import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import {
  Compass,
  Globe,
  LogIn,
  LogOut,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserPortalPath = () => {
    if (!user) return '/login';
    if (user.role === 'ROLE_ADMIN') return '/admin';
    if (user.role === 'ROLE_TEACHER') return '/teacher';
    return '/student';
  };

  const getUserPortalTitle = () => {
    if (!user) return '';
    if (user.role === 'ROLE_ADMIN') return 'Quản Trị Viên';
    if (user.role === 'ROLE_TEACHER') return 'Lớp Dạy Học';
    return 'Góc Học Tập';
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/90 border-b border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-600/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-white text-lg tracking-tight">CH EdTech</span>
            <span className="hidden sm:inline-block ml-2 text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium border border-slate-700/60">
              Interactive Mathematics
            </span>
          </div>
        </Link>

        {/* Center / Navigation Links */}
        <nav className="flex items-center space-x-1 sm:space-x-2 text-sm font-medium">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname === '/'
                ? 'text-primary-400 bg-primary-500/10 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {t('nav.home') || 'Trang chủ'}
          </Link>

          {/* Primary Highlighted Geometry Workspace Button (Guest First!) */}
          <Link
            to="/workspace"
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              location.pathname === '/workspace'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-primary-500/10 text-primary-300 border border-primary-500/20 hover:bg-primary-500/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-primary-400" />
            <span>Phòng Dựng Hình 3D</span>
          </Link>

          {/* Authenticated Role Portal Shortcut */}
          {user && (
            <Link
              to={getUserPortalPath()}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                location.pathname.startsWith(getUserPortalPath())
                  ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>{getUserPortalTitle()}</span>
            </Link>
          )}
        </nav>

        {/* Right Section: Language Toggle & Auth */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-primary-400" />
            <span className="uppercase">{i18n.language}</span>
          </button>

          {/* Auth State */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-200">{user.fullName}</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {user.role.replace('ROLE_', '')}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/40 hover:text-rose-400 text-slate-400 transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-primary-400" />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
