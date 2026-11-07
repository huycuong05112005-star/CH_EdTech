import React from 'react';
import { SystemHealthWidget } from '../../components/common/SystemHealthWidget';
import { 
  Users, 
  ShieldAlert, 
  Database, 
  FileCheck2,
  Server
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Portal Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-brand-400 font-semibold">Cổng Điều Hành</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Admin Portal</h1>
          <p className="text-sm text-slate-400">Quản trị toàn diện người dùng, lớp học, tài liệu và giám sát hệ thống</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            ROLE_ADMIN Active
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tổng Người Dùng</span>
            <Users className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-bold text-white">3 Tài khoản</div>
          <div className="text-xs text-emerald-400">1 Admin, 1 Giáo viên, 1 Học sinh</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Đề Thi Chờ Duyệt</span>
            <FileCheck2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">0 Đề thi</div>
          <div className="text-xs text-slate-400">Không có đề thi tồn đọng</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tài Liệu pgvector</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">Vector Ready</div>
          <div className="text-xs text-slate-400">HNSW 1536 chiều hoạt động</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Cảnh Báo An Toàn</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">0 Lỗi</div>
          <div className="text-xs text-emerald-400">Hệ thống bảo vệ WAF ổn định</div>
        </div>
      </div>

      {/* Live System Health */}
      <SystemHealthWidget />

      {/* Admin Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-400" />
            Tài Khoản Được Phân Quyền Sẵn (Hệ Thống Mẫu)
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex justify-between items-center">
              <div>
                <span className="font-semibold text-white block">admin@chedtech.edu.vn</span>
                <span className="text-slate-400">ROLE_ADMIN - Quản trị hệ thống</span>
              </div>
              <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-[10px] font-mono">ACTIVE</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex justify-between items-center">
              <div>
                <span className="font-semibold text-white block">teacher@chedtech.edu.vn</span>
                <span className="text-slate-400">ROLE_TEACHER - Giáo viên soạn giảng & đề thi</span>
              </div>
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-[10px] font-mono">ACTIVE</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex justify-between items-center">
              <div>
                <span className="font-semibold text-white block">student@chedtech.edu.vn</span>
                <span className="text-slate-400">ROLE_STUDENT - Học sinh học tập & tương tác 3D</span>
              </div>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-mono">ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-400" />
            Cổng Giám Sát & Truy Cập Hạ Tầng
          </h3>
          <div className="space-y-3 text-sm">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-300 transition-all"
            >
              <span>Grafana Telemetry Dashboard</span>
              <span className="text-xs font-mono text-brand-400">localhost:3000 &rarr;</span>
            </a>
            <a
              href="http://localhost:9090"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-300 transition-all"
            >
              <span>Prometheus Metrics Scraper</span>
              <span className="text-xs font-mono text-brand-400">localhost:9090 &rarr;</span>
            </a>
            <a
              href="http://localhost:9001"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-300 transition-all"
            >
              <span>MinIO Object Storage Console</span>
              <span className="text-xs font-mono text-brand-400">localhost:9001 &rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
