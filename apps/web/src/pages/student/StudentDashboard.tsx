import React from 'react';
import { GeometryViewer3D } from '../../components/geometry/GeometryViewer3D';
import { 
  Sparkles, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Portal Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Góc Học Tập Trực Tuyến</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Student Portal</h1>
          <p className="text-sm text-slate-400">Khám phá hình học không gian trực quan và học tập với sự trợ giúp của AI</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            ROLE_STUDENT Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive 3D Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              Phòng Thực Hành Trực Quan 3D
            </h2>
            <span className="text-xs text-slate-400">Xoay, phóng to, thu nhỏ tự do</span>
          </div>
          <GeometryViewer3D initialShape="pyramid" />
        </div>

        {/* AI Learning Assistant & Assignments */}
        <div className="space-y-6">
          {/* AI Math Assistant Box */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-brand-400 font-bold">
              <Sparkles className="w-5 h-5" />
              <span>AI Trợ Lý Toán Học</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nhập đề bài hình học hoặc chụp ảnh đề từ sách giáo khoa. AI sẽ nhận diện giả thiết, lập kế hoạch dựng hình và kiểm chứng bằng công cụ hình học.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
              <span className="text-slate-500 text-[10px] block uppercase font-mono">Ví dụ bài toán lớp 11:</span>
              <p className="text-slate-200 italic">
                "Cho hình chóp S.ABCD có đáy ABCD là hình vuông cạnh a. Cạnh bên SA vuông góc với đáy..."
              </p>
              <div className="flex gap-2 pt-1">
                <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 text-[10px]">Góc (SC, (ABCD))</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">Thể tích S.ABCD</span>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2">
              <span>Hỏi Trợ Lý AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Enrolled Courses & Tasks */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Bài Tập Cần Hoàn Thành
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-200 block">Bài tập tuần 8: Thiết diện hình chóp</span>
                  <span className="text-slate-500 text-[11px]">Hạn chót: 23:59 Chủ Nhật</span>
                </div>
                <span className="text-amber-400 font-mono text-[11px]">Chưa nộp</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-200 block">Luyện tập: Khoảng cách giữa 2 đường chéo nhau</span>
                  <span className="text-slate-500 text-[11px]">Đã nộp bài</span>
                </div>
                <span className="text-emerald-400 font-mono text-[11px]">10/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
