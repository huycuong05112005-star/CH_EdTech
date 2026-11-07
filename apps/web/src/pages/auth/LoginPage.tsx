import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogIn, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState('teacher@chedtech.edu.vn');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Login failed');
      }

      setUser(json.data);

      // Route according to server-returned role
      if (json.data.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (json.data.role === 'ROLE_TEACHER') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('password123');
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
          <LogIn className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white">Đăng Nhập CH EdTech</h1>
        <p className="text-xs text-slate-400">Hệ thống phân quyền độc lập: Admin, Teacher, Student</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
        >
          {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
        </button>
      </form>

      {/* Quick Test Presets */}
      <div className="pt-4 border-t border-slate-800 space-y-2">
        <span className="text-[11px] text-slate-500 block uppercase font-mono">Tài khoản thử nghiệm nhanh:</span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPreset('admin@chedtech.edu.vn')}
            className="px-2 py-1.5 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-[11px] text-red-400 font-semibold"
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => setPreset('teacher@chedtech.edu.vn')}
            className="px-2 py-1.5 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-[11px] text-blue-400 font-semibold"
          >
            Giáo viên
          </button>
          <button
            type="button"
            onClick={() => setPreset('student@chedtech.edu.vn')}
            className="px-2 py-1.5 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-[11px] text-emerald-400 font-semibold"
          >
            Học sinh
          </button>
        </div>
      </div>
    </div>
  );
};
