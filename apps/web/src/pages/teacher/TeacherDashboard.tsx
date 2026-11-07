import React from 'react';
import { GeometryViewer3D } from '../../components/geometry/GeometryViewer3D';
import { 
  BookOpen, 
  Send, 
  PlusCircle, 
  FileText, 
  Users
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Portal Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">Giáo Viên Bộ Môn Toán</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Teacher Portal</h1>
          <p className="text-sm text-slate-400">Soạn bài giảng trực quan, dựng mô hình hình học và gửi duyệt đề kiểm tra</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20">
            <PlusCircle className="w-4 h-4" />
            Tạo Bài Giảng Mới
          </button>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Geometry Studio for Teachers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-400" />
              Không Gian Dựng Hình 3D Dành Cho Bài Giảng
            </h2>
            <span className="text-xs text-slate-400">Geometry Engine v0.1.0</span>
          </div>
          <GeometryViewer3D initialShape="cuboid" />
        </div>

        {/* Exam Authoring & Submission Workflow */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              Quy Trình Duyệt Đề Kiểm Tra (Admin Approval)
            </h3>
            <p className="text-xs text-slate-400">
              Mọi đề kiểm tra do giáo viên biên soạn phải được gửi qua hệ thống phê duyệt của Admin trước khi công bố cho học sinh.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>Kiểm Tra 15 Phút: Khối Đa Diện</span>
                  <span className="text-amber-400">CHỜ DUYỆT</span>
                </div>
                <div className="text-[11px] text-slate-500">Lớp 11A1 Chuyên Toán - Đã gửi lúc 08:30</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>Khảo Sát Giữa Kỳ: Hình Không Gian</span>
                  <span className="text-emerald-400">ĐÃ DUYỆT</span>
                </div>
                <div className="text-[11px] text-slate-500">Lớp 11A2 - Phê duyệt bởi Admin</div>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all">
              <FileText className="w-4 h-4" />
              Soạn Đề Kiểm Tra Mới
            </button>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Lớp Phân Công
            </h3>
            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex justify-between p-2 rounded bg-slate-950">
                <span>Toán 11 - Khối Chuyên Sáng</span>
                <span className="text-brand-400 font-mono">35 Học sinh</span>
              </li>
              <li className="flex justify-between p-2 rounded bg-slate-950">
                <span>Toán 12 - Ôn Thi THPT Quốc Gia</span>
                <span className="text-brand-400 font-mono">42 Học sinh</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
