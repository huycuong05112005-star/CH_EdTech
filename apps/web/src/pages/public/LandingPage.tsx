import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GeometryViewer3D } from '../../components/geometry/GeometryViewer3D';
import { SystemHealthWidget } from '../../components/common/SystemHealthWidget';
import { 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-w-full space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          {t('hero.badge')}
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          {t('hero.title')}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-blue-500 to-indigo-400 mt-2">
            See Mathematics. Understand Geometry.
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-normal">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/student"
            className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all"
          >
            <GraduationCap className="w-5 h-5" />
            {t('hero.getStarted')}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#geometry-demo"
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold flex items-center gap-2 transition-all"
          >
            <Compass className="w-5 h-5 text-brand-400" />
            {t('hero.exploreGeometry')}
          </a>
        </div>
      </section>

      {/* 3D Geometry Studio Preview */}
      <section id="geometry-demo" className="max-w-5xl mx-auto px-4">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-white">{t('geometry.title')}</h2>
          <p className="text-sm text-slate-400">Tương tác trực tiếp với mô hình toán học 3D, tính toán thể tích và chiều cao theo thời gian thực</p>
        </div>
        <GeometryViewer3D initialShape="pyramid" />
      </section>

      {/* Real-time System Telemetry */}
      <section className="max-w-5xl mx-auto px-4">
        <SystemHealthWidget />
      </section>

      {/* Feature Highlights */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Động Cơ Hình Học Chuẩn Xác</h3>
          <p className="text-sm text-slate-400">
            Tính toán tọa độ, vector, góc, mặt cắt và thể tích thuần túy bằng đại số tuyến tính độc lập với góc quay camera.
          </p>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">AI Agent Sư Phạm</h3>
          <p className="text-sm text-slate-400">
            Trợ lý toán học tiếp nhận đề bài bằng văn bản hoặc hình ảnh, phân tích giả thiết và gọi công cụ dựng hình từng bước.
          </p>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Bảo Mật & Lưu Trữ Độc Lập</h3>
          <p className="text-sm text-slate-400">
            Tài liệu và hình ảnh người dùng được lưu trữ an toàn trên Object Storage, phân quyền truy cập thông qua Pre-signed URL.
          </p>
        </div>
      </section>
    </div>
  );
};
