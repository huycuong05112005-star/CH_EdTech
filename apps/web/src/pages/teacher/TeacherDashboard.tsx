import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { api, Classroom, DrawingSummary } from '../../lib/api';
import {
  Compass,
  GraduationCap,
  PlusCircle,
  FolderOpen,
  ArrowRight,
  Users,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [drawings, setDrawings] = useState<DrawingSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Classroom Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Toán Học');
  const [gradeLevel, setGradeLevel] = useState('Khối 11');
  const [createLoading, setCreateLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesData, drawingsData] = await Promise.all([
        api.classrooms.getTeacherClasses(),
        api.drawings.getMyDrawings(),
      ]);
      setClassrooms(classesData);
      setDrawings(drawingsData);
    } catch (err) {
      console.error('Error fetching teacher dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setCreateLoading(true);
      await api.classrooms.createClassroom({
        name: name.trim(),
        description: description.trim(),
        subject,
        gradeLevel,
      });
      setShowCreateModal(false);
      setName('');
      setDescription('');
      fetchData();
    } catch (err: any) {
      alert(`Lỗi khi tạo lớp học: ${err.message}`);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerateCode = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn cấp lại mã mới? Học sinh cũ vẫn giữ nguyên trong lớp.'))
      return;
    try {
      await api.classrooms.regenerateCode(id);
      fetchData();
    } catch (err: any) {
      alert(`Lỗi khi đổi mã: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
              Không gian Giáo Viên
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Chào mừng Thầy/Cô {user?.fullName || 'Giáo Viên'}!
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Quản lý các lớp học trực tuyến, tạo mã tham gia và mở bảng dạy hình học 3D đồng bộ thời gian thực.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-emerald-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tạo lớp học mới</span>
          </button>

          <button
            onClick={() => navigate('/workspace')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-primary-600/30"
          >
            <Compass className="w-4 h-4" />
            <span>Bảng Vẽ Hình Học Mở</span>
          </button>
        </div>
      </div>

      {/* 2. Main Grid: Classrooms & Teaching Drawings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Managed Classrooms */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-primary-400" />
              <span>Lớp Học Phụ Trách ({classrooms.length})</span>
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-xs text-primary-400 hover:underline"
            >
              + Tạo thêm lớp
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
              Đang tải danh sách lớp học...
            </div>
          ) : classrooms.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 space-y-3">
              <GraduationCap className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-semibold text-slate-300">Chưa có lớp học nào</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tạo lớp học mới để sinh mã tham gia và bắt đầu dạy học trực tuyến với bảng hình học số.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-2 px-3.5 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-500 inline-flex items-center space-x-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Tạo lớp đầu tiên</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classrooms.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {cls.gradeLevel}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{cls.studentCount} học sinh</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-2 line-clamp-1">{cls.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {cls.description || 'Chưa có mô tả chi tiết.'}
                    </p>

                    {/* Join Code Box */}
                    <div className="mt-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-mono">
                          Mã tham gia lớp:
                        </span>
                        <span className="font-mono font-bold text-sm text-emerald-400 tracking-wider">
                          {cls.joinCode}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleCopyCode(cls.joinCode, cls.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Sao chép mã gửi học sinh"
                        >
                          {copiedId === cls.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleRegenerateCode(cls.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                          title="Đổi mã mới"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-end">
                    <button
                      onClick={() => navigate(`/classroom/${cls.id}/board`)}
                      className="w-full py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl flex items-center justify-center space-x-1.5 text-xs font-semibold shadow-md transition-all"
                    >
                      <span>Mở Phòng Dạy & Bảng Số</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Lesson Drawings & Teaching Tools */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-amber-400" />
              <span>Bản Dựng Bài Giảng ({drawings.length})</span>
            </h2>
            <button
              onClick={() => navigate('/workspace')}
              className="text-xs text-primary-400 hover:underline"
            >
              + Soạn bản mới
            </button>
          </div>

          {loading ? (
            <div className="p-6 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800 text-xs">
              Đang tải danh sách bài giảng...
            </div>
          ) : drawings.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 space-y-2">
              <Compass className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">Chưa có bản dựng bài giảng nào được lưu.</p>
              <button
                onClick={() => navigate('/workspace')}
                className="mt-2 px-3 py-1 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-500"
              >
                Soạn bài giảng 3D
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {drawings.map((draw) => (
                <div
                  key={draw.id}
                  onClick={() => navigate('/workspace')}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">
                      {draw.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Cập nhật: {new Date(draw.updatedAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          )}

          {/* Quick Guidance Box */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center space-x-2 font-bold text-slate-300">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span>Tiện ích sư phạm hình học</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Khi mở phòng dạy trực tuyến, Thầy/Cô có thể trình chiếu từng bước dựng hình (Step-by-step
              construction), vẽ nét đứt cho các cạnh khuất và đồng bộ trạng thái bảng sang máy của học
              sinh theo thời gian thực.
            </p>
          </div>
        </div>
      </div>

      {/* Create Classroom Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-primary-400" />
                <span>Tạo lớp học trực tuyến mới</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-500 hover:text-slate-300 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateClassroom} className="space-y-3.5 pt-1 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Tên lớp học *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Toán 11A1 - Chuyên Đề Hình Không Gian"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Khối lớp</label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="Khối 10">Khối 10</option>
                    <option value="Khối 11">Khối 11</option>
                    <option value="Khối 12">Khối 12</option>
                    <option value="Luyện thi THPT">Luyện thi THPT</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Môn học</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Mô tả lớp học</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả mục tiêu học tập, yêu cầu chuẩn bị..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 text-xs bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createLoading || !name.trim()}
                  className="flex-1 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  {createLoading ? 'Đang tạo...' : 'Tạo lớp và sinh mã'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
