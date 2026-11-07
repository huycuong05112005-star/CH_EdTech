import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/public/LandingPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { LoginPage } from './pages/auth/LoginPage';
import './i18n/config';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-900 bg-slate-950/90 py-8 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-bold text-slate-400">CH EdTech</span> &mdash; See Mathematics. Understand Geometry. Learn Smarter.
            </div>
            <div className="text-[11px] text-slate-600 font-mono">
              Windows 11 Dev &bull; Spring Boot 3.4 &bull; React &bull; Three.js &bull; pgvector
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;

