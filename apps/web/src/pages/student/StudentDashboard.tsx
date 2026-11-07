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
  CheckCircle,
  AlertCircle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [drawings, setDrawings] = useState<DrawingSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Join Classroom Dialog State
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesData, drawingsData] = await Promise.all([
        api.classrooms.getEnrolledClasses(),
        api.drawings.getMyDrawings(),
      ]);
      setClassrooms(classesData);
      setDrawings(drawingsData);
    } catch (err) {
      console.error('Error fetching student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleJoinClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    try {
      setJoinLoading(true);
      setJoinError(null);
      const joined = await api.classrooms.joinByCode(joinCodeInput.trim().toUpperCase());
      setJoinSuccess(`Tham gia thành công lớp: ${joined.name}`);
      setTimeout(() => {
        setShowJoinModal(false);
        setJoinSuccess(null);
        setJoinCodeInput('');
        fetchData();
      }, 1500);
    } catch (err: any) {
      setJoinError(err.message || 'Mã lớp không hợp lệ hoặc bạn đã ở trong lớp này');
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              Không gian Học Sinh
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Chào mừng trở lại, {user?.fullName || 'Học Sinh'}!
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Xem danh sách lớp học thực tế, mở bảng vẽ 3D và luyện tập hình học không gian.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Tham gia lớp bằng mã</span>
          </button>

          <button
            onClick={() => navigate('/workspace')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-primary-600/30"
          >
            <Compass className="w-4 h-4" />
            <span>Mở Bảng Vẽ Hình Học</span>
          </button>
        </div>
      </div>

      {/* 2. Grid Overview: Classrooms & Personal Drawings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Enrolled Classrooms */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-primary-400" />
              <span>Lớp Học Đang Tham Gia ({classrooms.length})</span>
            </h2>
            <button
              onClick={() => setShowJoinModal(true)}
              className="text-xs text-primary-400 hover:underline"
            >
              + Nhập mã tham gia mới
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
              Đang tải dữ liệu lớp học từ máy chủ...
            </div>
          ) : classrooms.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 space-y-3">
              <GraduationCap className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-semibold text-slate-300">Chưa tham gia lớp học nào</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hỏi giáo viên của bạn mã lớp học (ví dụ: TOAN11) để tham gia vào phòng học trực tuyến.
              </p>
              <button
                onClick={() => setShowJoinModal(true)}
                className="mt-2 px-3.5 py-1.5 bg-slate-800 text-slate-200 text-xs rounded-lg hover:bg-slate-700 inline-flex items-center space-x-1.5"
              >
                <span>Nhập mã lớp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classrooms.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-primary-500/10 text-primary-400 border border-primary-500/20">
                        {cls.gradeLevel || 'Toán học'}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{cls.studentCount} thành viên</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-2 line-clamp-1">{cls.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {cls.description || 'Chưa có mô tả chi tiết.'}
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      GV: <strong className="text-slate-200">{cls.teacherName}</strong>
                    </span>
                    <button
                      onClick={() => navigate(`/classroom/${cls.id}/board`)}
                      className="px-3 py-1.5 bg-primary-600/20 hover:bg-primary-600/30 text-primary-300 border border-primary-500/30 rounded-lg flex items-center space-x-1 font-medium transition-colors"
                    >
                      <span>Vào phòng học</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Saved Drawings Library */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-amber-400" />
              <span>Bản Vẽ Của Tôi ({drawings.length})</span>
            </h2>
            <button
              onClick={() => navigate('/workspace')}
              className="text-xs text-primary-400 hover:underline"
            >
              + Tạo mới
            </button>
          </div>

          {loading ? (
            <div className="p-6 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800 text-xs">
              Đang tải danh sách bản vẽ...
            </div>
          ) : drawings.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 space-y-2">
              <Compass className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">Bạn chưa lưu bản vẽ nào trên tài khoản.</p>
              <button
                onClick={() => navigate('/workspace')}
                className="mt-2 px-3 py-1 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-500"
              >
                Vẽ ngay bây giờ
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

          {/* Quick Mathematical Formulas Helper */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Công thức hình học không gian thường dùng</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span>Thể tích hình chóp:</span>
                <span className="font-mono text-emerald-400">V = 1/3 * B * h</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span>Thể tích lăng trụ:</span>
                <span className="font-mono text-emerald-400">V = B * h</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Thể tích khối hộp:</span>
                <span className="font-mono text-emerald-400">V = a * b * c</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Classroom Dialog Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <span>Tham gia lớp học</span>
              </h3>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-slate-500 hover:text-slate-300 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Nhập mã tham gia 6 ký tự do giáo viên cung cấp (ví dụ: <code className="text-emerald-400 font-mono">TOAN11</code>).
            </p>

            {joinError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{joinError}</span>
              </div>
            )}

            {joinSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{joinSuccess}</span>
              </div>
            )}

            <form onSubmit={handleJoinClassroom} className="space-y-4 pt-1">
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Mã tham gia</label>
                <input
                  type="text"
                  maxLength={10}
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="TOAN11"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-center font-mono text-lg tracking-widest text-emerald-400 uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 py-2 text-xs bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={joinLoading || !joinCodeInput.trim()}
                  className="flex-1 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  {joinLoading ? 'Đang xác thực...' : 'Vào lớp ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
