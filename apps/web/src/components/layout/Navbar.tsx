import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { 
  Compass, 
  Globe, 
  LogIn, 
  LogOut, 
  ShieldAlert, 
  GraduationCap, 
  BookOpen
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-white text-lg tracking-tight">CH EdTech</span>
            <span className="hidden sm:inline-block ml-2 text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
              Mathematics & 3D Geometry
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname === '/' ? 'text-brand-400 bg-brand-500/10' : 'text-slate-300 hover:text-white'
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/student"
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              location.pathname === '/student' ? 'text-brand-400 bg-brand-500/10' : 'text-slate-300 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            {t('nav.student')}
          </Link>
          <Link
            to="/teacher"
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              location.pathname === '/teacher' ? 'text-brand-400 bg-brand-500/10' : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            {t('nav.teacher')}
          </Link>
          <Link
            to="/admin"
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              location.pathname === '/admin' ? 'text-brand-400 bg-brand-500/10' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            {t('nav.admin')}
          </Link>
        </nav>

        {/* Actions: Language & Auth */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-brand-400" />
            <span className="uppercase">{i18n.language}</span>
          </button>

          {/* Auth State Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                {user.fullName}
              </span>
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-brand-500/20 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

