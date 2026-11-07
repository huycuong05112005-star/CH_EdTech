import React from 'react';
import { Link } from 'react-router-dom';
import { SystemHealthWidget } from '../../components/common/SystemHealthWidget';
import {
  Compass,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users,
  Layers,
} from 'lucide-react';

export const LandingPage: React.FC = () => {

  return (
    <div className="w-full space-y-20 py-10 font-sans">
      {/* 1. Hero Section */}
      <section className="relative max-w-5xl mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nền tảng Hình Học Không Gian Tương Tác & Lớp Học Số</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          See Mathematics. Understand Geometry.{' '}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-sky-400 to-indigo-400 mt-2">
            Học Toán Trực Quan Bằng Bảng Số 3D
          </span>
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
          Không cần đăng nhập để bắt đầu. Người học và giáo viên có thể lập tức dựng hình chóp, khối
          đa diện, kiểm tra quan hệ vuông góc và trình chiếu từng bước giải toán chuẩn mực.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/workspace"
            className="px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold shadow-xl shadow-primary-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Compass className="w-5 h-5" />
            <span>Mở Bảng Vẽ Hình Học (Miễn Phí & Tức Thì)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/login"
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold flex items-center gap-2 transition-all"
          >
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <span>Đăng Nhập Lớp Học</span>
          </Link>
        </div>
      </section>

      {/* 2. Four Core Product Pillars */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Bốn Năng Lực Cốt Lõi Của CH EdTech
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Thiết kế lại toàn diện từ trải nghiệm người dùng đến kiến trúc backend để tạo nên không gian
            học Toán số hiện đại.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-primary-500/40 p-6 rounded-2xl space-y-3 transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">1. Không Gian Mở (Guest First)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bất kỳ ai truy cập đều có thể vẽ điểm, nối đoạn thẳng, xoay không gian 3D, thử nghiệm các
              mẫu bài học mà không bắt buộc phải tạo tài khoản.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 p-6 rounded-2xl space-y-3 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">2. Bảng Vẽ Hình Học Kỹ Thuật Số</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Điều khiển camera chủ động (Orbit/Pan/Zoom, không auto-spin vô nghĩa), hiển thị nét đứt
              cho các cạnh khuất theo chuẩn SGK và thanh dòng thời gian dựng hình từng bước.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 p-6 rounded-2xl space-y-3 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">3. Lớp Học Trực Tuyến & Mã Vào Lớp</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Giáo viên tạo lớp học và sinh mã tham gia (Join Code). Học sinh nhập mã để vào phòng học
              và cùng tương tác trên bảng vẽ qua giao thức STOMP thời gian thực.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 p-6 rounded-2xl space-y-3 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">4. AI Trợ Lý & Kiểm Chứng Toán Học</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI đọc hiểu đề bài, hỗ trợ giải quyết quan hệ song song, vuông góc, khoảng cách, thể tích
              thông qua công cụ tính toán chính xác của Geometry Engine.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Preset Models Ready to Explore */}
      <section className="max-w-5xl mx-auto px-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Mẫu Hình Học Tiêu Biểu Trong Sách Giáo Khoa</h3>
            <p className="text-xs text-slate-400 mt-1">
              Nhấp để mở ngay trong phòng thực hành 3D với đầy đủ các bước dựng hình mẫu:
            </p>
          </div>
          <Link
            to="/workspace"
            className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center space-x-1"
          >
            <span>Mở bảng trắng hoàn toàn</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: 'Hình chóp tứ giác đều S.ABCD',
              subtitle: 'Đáy hình vuông, đường cao SO',
              badge: 'Lớp 11 & 12',
            },
            {
              title: 'Tứ diện đều S.ABC',
              subtitle: 'Tam giác đều, trọng tâm SH',
              badge: 'Khối đa diện',
            },
            {
              title: 'Hình hộp chữ nhật',
              subtitle: '6 mặt phẳng, cạnh khuất nét đứt',
              badge: 'Cơ bản',
            },
            {
              title: 'Lăng trụ tam giác ABC.A\'B\'C\'',
              subtitle: 'Mặt phẳng song song',
              badge: 'Nâng cao',
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              to="/workspace"
              className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 p-4 rounded-xl space-y-2 group transition-all"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary-500/10 text-primary-400 border border-primary-500/20">
                  {item.badge}
                </span>
                <Compass className="w-3.5 h-3.5 text-slate-500 group-hover:text-primary-400 transition-colors" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-primary-300 transition-colors">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-normal">{item.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Real Infrastructure Health */}
      <section className="max-w-5xl mx-auto px-4">
        <SystemHealthWidget />
      </section>
    </div>
  );
};
