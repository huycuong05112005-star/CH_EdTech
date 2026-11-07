import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/api';
import {
  GeometryDocument,
  GeometryPoint,
  GeometrySegment,
  WorkspaceTool,
  FreehandStroke,
} from './types';
import { PRESETS, PYRAMID_ABCD_PRESET } from './geometryPresets';
import { GeometryCanvas3D } from './GeometryCanvas3D';
import {
  RotateCcw,
  MousePointer,
  Dot,
  Minus,
  PenTool,
  Grid,
  Compass,
  Download,
  Save,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Trash2,
  LogIn,
  Check,
  Sparkles,
} from 'lucide-react';

export const GeometryWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Document state initialized with standard S.ABCD pyramid
  const [doc, setDoc] = useState<GeometryDocument>(PYRAMID_ABCD_PRESET);
  const [currentTool, setCurrentTool] = useState<WorkspaceTool>('orbit');
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [isPlayingSteps, setIsPlayingSteps] = useState(false);

  // Inspector & selection
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Toggles
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  // Freehand drawing strokes
  const [strokes, setStrokes] = useState<FreehandStroke[]>([]);

  // Feedback notifications & Guest save dialog
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Step player timer ref
  const playTimerRef = useRef<any>(null);

  // Current active step ID
  const activeStepId =
    activeStepIndex !== null && doc.steps[activeStepIndex] ? doc.steps[activeStepIndex].id : null;

  // Step navigation
  const handleNextStep = () => {
    if (doc.steps.length === 0) return;
    if (activeStepIndex === null) {
      setActiveStepIndex(0);
    } else if (activeStepIndex < doc.steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
      setActiveStepIndex(null); // Show all
    }
  };

  const handlePrevStep = () => {
    if (doc.steps.length === 0) return;
    if (activeStepIndex === null) {
      setActiveStepIndex(doc.steps.length - 1);
    } else if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    } else {
      setActiveStepIndex(null);
    }
  };

  const togglePlaySteps = () => {
    if (isPlayingSteps) {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      setIsPlayingSteps(false);
    } else {
      setIsPlayingSteps(true);
      setActiveStepIndex(0);
      playTimerRef.current = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev === null || prev >= doc.steps.length - 1) {
            setIsPlayingSteps(false);
            if (playTimerRef.current) clearInterval(playTimerRef.current);
            return null;
          }
          return prev + 1;
        });
      }, 3000);
    }
  };

  // Tool Handlers
  const handleAddPoint = (point: GeometryPoint) => {
    setDoc((prev) => ({
      ...prev,
      points: [...prev.points, point],
    }));
    setSelectedId(point.id);
    setSelectedType('point');
    showToast(`Đã thêm điểm ${point.name} (${point.coords.join(', ')})`);
  };

  const handleAddSegment = (p1Id: string, p2Id: string) => {
    const p1 = doc.points.find((p) => p.id === p1Id);
    const p2 = doc.points.find((p) => p.id === p2Id);
    if (!p1 || !p2) return;

    const newSeg: GeometrySegment = {
      id: `seg_${Date.now()}`,
      startPointId: p1Id,
      endPointId: p2Id,
      label: `${p1.name}${p2.name}`,
      color: '#0284c7',
      dashed: false,
      thickness: 2,
    };

    setDoc((prev) => ({
      ...prev,
      segments: [...prev.segments, newSeg],
    }));
    setSelectedId(newSeg.id);
    setSelectedType('segment');
    showToast(`Đã nối đoạn thẳng ${newSeg.label}`);
  };

  const handleSelectElement = (id: string | null, type?: string) => {
    setSelectedId(id);
    setSelectedType(type || null);
  };

  // Preset switch
  const handleLoadPreset = (key: string) => {
    if (PRESETS[key]) {
      setDoc(PRESETS[key]);
      setActiveStepIndex(null);
      setSelectedId(null);
      setStrokes([]);
      showToast(`Đã tải mẫu: ${PRESETS[key].title}`);
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã tải xuống tệp JSON');
  };

  // Save to Library (Database if logged in, Modal if guest)
  const handleSaveDocument = async () => {
    if (!user) {
      setShowGuestDialog(true);
      return;
    }

    try {
      setIsSaving(true);
      const dataJson = JSON.stringify(doc);
      if (doc.id) {
        await api.drawings.updateDrawing(doc.id, {
          title: doc.title,
          description: doc.description,
          dataJson,
          isPublic: true,
        });
        showToast('Đã cập nhật bản vẽ thành công!');
      } else {
        const saved = await api.drawings.saveDrawing({
          title: doc.title,
          description: doc.description,
          drawingType: doc.mode,
          dataJson,
          isPublic: true,
        });
        setDoc((prev) => ({ ...prev, id: saved.id }));
        showToast('Đã lưu bản vẽ vào tài khoản!');
      }
    } catch (err: any) {
      showToast(`Lỗi khi lưu: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete selected element
  const handleDeleteSelected = () => {
    if (!selectedId) return;

    if (selectedType === 'point') {
      setDoc((prev) => ({
        ...prev,
        points: prev.points.filter((p) => p.id !== selectedId),
        segments: prev.segments.filter(
          (s) => s.startPointId !== selectedId && s.endPointId !== selectedId
        ),
        polygons: prev.polygons.filter((poly) => !poly.vertexIds.includes(selectedId)),
      }));
    } else if (selectedType === 'segment') {
      setDoc((prev) => ({
        ...prev,
        segments: prev.segments.filter((s) => s.id !== selectedId),
      }));
    } else if (selectedType === 'polygon') {
      setDoc((prev) => ({
        ...prev,
        polygons: prev.polygons.filter((p) => p.id !== selectedId),
      }));
    }

    setSelectedId(null);
    setSelectedType(null);
    showToast('Đã xóa đối tượng');
  };

  // Selected item object lookup
  const selectedPoint = doc.points.find((p) => p.id === selectedId);
  const selectedSegment = doc.segments.find((s) => s.id === selectedId);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. Header Toolbar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-primary-400 font-bold text-lg hover:text-primary-300 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <span>CH Geometry</span>
          </button>
          <span className="text-slate-600">/</span>
          <input
            type="text"
            value={doc.title}
            onChange={(e) => setDoc({ ...doc, title: e.target.value })}
            className="bg-transparent text-sm font-medium border-b border-transparent hover:border-slate-700 focus:border-primary-500 focus:outline-none px-1 py-0.5 max-w-xs text-slate-200"
            title="Đổi tên bản vẽ"
          />
        </div>

        {/* Center: Presets & Views */}
        <div className="flex items-center space-x-2">
          <select
            onChange={(e) => handleLoadPreset(e.target.value)}
            defaultValue="pyramid"
            className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="pyramid">Hình chóp S.ABCD (Chuẩn SGK)</option>
            <option value="tetrahedron">Tứ diện đều S.ABC</option>
            <option value="cuboid">Hình hộp chữ nhật</option>
            <option value="prism">Lăng trụ đứng tam giác</option>
          </select>

          <div className="h-5 w-px bg-slate-800" />

          {/* Helpers toggles */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded text-xs flex items-center space-x-1 ${
              showGrid ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Bật/Tắt Lưới toạ độ"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAxes(!showAxes)}
            className={`p-1.5 rounded text-xs flex items-center space-x-1 ${
              showAxes ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Bật/Tắt Trục toạ độ Oxyz"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportJson}
            className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center space-x-1.5 border border-slate-700"
            title="Xuất file JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất JSON</span>
          </button>

          <button
            onClick={handleSaveDocument}
            disabled={isSaving}
            className="px-3 py-1.5 text-xs font-medium bg-primary-600 hover:bg-primary-500 text-white rounded-lg flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{user ? 'Lưu bản vẽ' : 'Lưu vào tài khoản'}</span>
          </button>

          {!user && (
            <button
              onClick={() => navigate('/login')}
              className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white flex items-center space-x-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Left Floating Toolbar */}
        <div className="absolute left-4 top-4 z-10 flex flex-col space-y-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl shadow-xl">
          <button
            onClick={() => setCurrentTool('orbit')}
            className={`p-2.5 rounded-lg transition-colors flex items-center justify-center ${
              currentTool === 'orbit'
                ? 'bg-primary-600 text-white shadow'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title="Xoay không gian 3D (Orbit / Pan / Zoom)"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentTool('select')}
            className={`p-2.5 rounded-lg transition-colors flex items-center justify-center ${
              currentTool === 'select'
                ? 'bg-primary-600 text-white shadow'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title="Chọn / Kiểm tra phần tử"
          >
            <MousePointer className="w-5 h-5" />
          </button>

          <div className="h-px bg-slate-800 my-1" />

          <button
            onClick={() => setCurrentTool('point')}
            className={`p-2.5 rounded-lg transition-colors flex items-center justify-center ${
              currentTool === 'point'
                ? 'bg-primary-600 text-white shadow'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title="Đặt Điểm mới (Nhấp trên mặt phẳng)"
          >
            <Dot className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentTool('segment')}
            className={`p-2.5 rounded-lg transition-colors flex items-center justify-center ${
              currentTool === 'segment'
                ? 'bg-primary-600 text-white shadow'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title="Đoạn thẳng (Nối 2 điểm)"
          >
            <Minus className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentTool('pen')}
            className={`p-2.5 rounded-lg transition-colors flex items-center justify-center ${
              currentTool === 'pen'
                ? 'bg-primary-600 text-white shadow'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title="Bút vẽ ghi chú tự do (Annotation)"
          >
            <PenTool className="w-5 h-5" />
          </button>

          {strokes.length > 0 && (
            <button
              onClick={() => setStrokes([])}
              className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
              title="Xóa nét vẽ bút lông"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 3D WebGL Canvas */}
        <div className="flex-1 relative h-full">
          <GeometryCanvas3D
            document={doc}
            tool={currentTool}
            activeStepId={activeStepId}
            selectedElementId={selectedId}
            onSelectElement={handleSelectElement}
            onAddPoint={handleAddPoint}
            onAddSegment={handleAddSegment}
            freehandStrokes={strokes}
            onAddStroke={(s) => setStrokes((prev) => [...prev, s])}
            showGrid={showGrid}
            showAxes={showAxes}
          />
        </div>

        {/* Right Inspector & Property Panel */}
        {showSidebar && (
          <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 z-10 text-xs">
            <div className="p-3 border-b border-slate-800 font-semibold text-slate-200 flex justify-between items-center">
              <span>Thuộc Tính Toán Học</span>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                &times;
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {/* Selected Point Inspector */}
              {selectedPoint && (
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-primary-400">
                      Điểm {selectedPoint.name}
                    </span>
                    <button
                      onClick={handleDeleteSelected}
                      className="text-rose-400 hover:text-rose-300 p-1"
                      title="Xóa điểm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Tên điểm</label>
                    <input
                      type="text"
                      value={selectedPoint.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDoc((prev) => ({
                          ...prev,
                          points: prev.points.map((p) =>
                            p.id === selectedPoint.id ? { ...p, name: val } : p
                          ),
                        }));
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Toạ độ (X, Y, Z)</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['X', 'Y', 'Z'].map((axis, i) => (
                        <div key={axis} className="flex items-center space-x-1">
                          <span className="text-slate-500">{axis}:</span>
                          <input
                            type="number"
                            step="0.5"
                            value={selectedPoint.coords[i]}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              const newCoords = [...selectedPoint.coords] as [number, number, number];
                              newCoords[i] = val;
                              setDoc((prev) => ({
                                ...prev,
                                points: prev.points.map((p) =>
                                  p.id === selectedPoint.id ? { ...p, coords: newCoords } : p
                                ),
                              }));
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-1.5 py-1 text-slate-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Segment Inspector */}
              {selectedSegment && (
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-primary-400">
                      Đoạn thẳng {selectedSegment.label}
                    </span>
                    <button
                      onClick={handleDeleteSelected}
                      className="text-rose-400 hover:text-rose-300 p-1"
                      title="Xóa đoạn thẳng"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="text-slate-300 cursor-pointer flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedSegment.dashed || false}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setDoc((prev) => ({
                            ...prev,
                            segments: prev.segments.map((s) =>
                              s.id === selectedSegment.id ? { ...s, dashed: val } : s
                            ),
                          }));
                        }}
                        className="rounded bg-slate-950 border-slate-700 text-primary-600 focus:ring-0"
                      />
                      <span>Nét đứt (Cạnh khuất SGK)</span>
                    </label>
                  </div>
                </div>
              )}

              {!selectedPoint && !selectedSegment && (
                <div className="text-center py-6 text-slate-500">
                  <MousePointer className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>Chọn một điểm hoặc đoạn thẳng trên bản vẽ để tùy chỉnh thuộc tính.</p>
                </div>
              )}

              {/* Document Tree Elements */}
              <div className="border-t border-slate-800 pt-3">
                <span className="text-slate-400 font-semibold block mb-2">
                  Danh sách đối tượng ({doc.points.length} điểm, {doc.segments.length} đoạn)
                </span>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {doc.points.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectElement(p.id, 'point')}
                      className={`flex justify-between items-center px-2 py-1 rounded cursor-pointer ${
                        selectedId === p.id
                          ? 'bg-primary-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>Điểm {p.name}</span>
                      <span className="text-[10px] text-slate-400">
                        [{p.coords.join(', ')}]
                      </span>
                    </div>
                  ))}
                  {doc.segments.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleSelectElement(s.id, 'segment')}
                      className={`flex justify-between items-center px-2 py-1 rounded cursor-pointer ${
                        selectedId === s.id
                          ? 'bg-primary-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>Đoạn {s.label}</span>
                      <span className="text-[10px] text-slate-400">
                        {s.dashed ? 'Nét đứt' : 'Nét liền'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* 3. Bottom Pedagogical Timeline Bar (Các bước dựng hình) */}
      {doc.steps.length > 0 && (
        <footer className="h-14 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-400">Các Bước Dựng Hình:</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevStep}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Bước trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlaySteps}
                className={`p-1.5 rounded ${
                  isPlayingSteps
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title={isPlayingSteps ? 'Tạm dừng diễn tiến' : 'Tự động trình chiếu các bước'}
              >
                {isPlayingSteps ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={handleNextStep}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Bước tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <span className="text-xs text-slate-400 font-medium">
              {activeStepIndex === null
                ? `Hiển thị toàn bộ (${doc.steps.length} bước)`
                : `Bước ${activeStepIndex + 1} / ${doc.steps.length}`}
            </span>
          </div>

          {/* Current Step Description */}
          <div className="hidden md:flex items-center text-xs text-slate-300 truncate max-w-xl">
            {activeStepIndex !== null && doc.steps[activeStepIndex] && (
              <span className="bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60 text-primary-300">
                <strong>{doc.steps[activeStepIndex].title}:</strong>{' '}
                {doc.steps[activeStepIndex].description}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {!showSidebar && (
              <button
                onClick={() => setShowSidebar(true)}
                className="px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
              >
                Mở thuộc tính
              </button>
            )}
          </div>
        </footer>
      )}

      {/* Guest Mode Save Prompt Modal */}
      {showGuestDialog && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-white">Lưu Bản Vẽ Vào Tài Khoản</h3>
              <p className="text-xs text-slate-400">
                Bạn đang sử dụng Phòng Thực Hành dưới tư cách khách. Để lưu trữ vĩnh viễn và đồng bộ
                lên hệ thống lớp học, hãy đăng nhập ngay mà không làm mất bản vẽ hiện tại!
              </p>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-primary-400">✨ Quyền lợi khi có tài khoản:</p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                <li>Lưu trữ không giới hạn bản vẽ vào thư viện đám mây.</li>
                <li>Nộp bài tập hình học trực tiếp cho giáo viên.</li>
                <li>Mở phòng vẽ cộng tác thời gian thực với bạn cùng lớp.</li>
              </ul>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  setShowGuestDialog(false);
                  handleExportJson();
                }}
                className="flex-1 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
              >
                Tải file JSON về máy
              </button>

              <button
                onClick={() => {
                  setShowGuestDialog(false);
                  navigate('/login');
                }}
                className="flex-1 py-2 text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors shadow-lg shadow-primary-600/30"
              >
                Đăng nhập ngay
              </button>
            </div>

            <button
              onClick={() => setShowGuestDialog(false)}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-400 pt-1"
            >
              Tiếp tục vẽ ở chế độ khách
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 border border-slate-700 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
