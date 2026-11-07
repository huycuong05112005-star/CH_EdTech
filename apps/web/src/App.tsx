import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LandingPage } from './pages/public/LandingPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { LoginPage } from './pages/auth/LoginPage';
import { GeometryWorkspace } from './pages/workspace/GeometryWorkspace';
import { ClassroomLiveBoard } from './pages/classroom/ClassroomLiveBoard';
import './i18n/config';

const AppLayout: React.FC = () => {
  const location = useLocation();

  // Fullscreen interactive workspace views without outer navbar/footer
  const isWorkspaceView =
    location.pathname === '/workspace' ||
    location.pathname === '/board' ||
    location.pathname.includes('/board');

  if (isWorkspaceView) {
    return (
      <main className="h-screen w-screen overflow-hidden bg-slate-950">
        <Routes>
          <Route path="/workspace" element={<GeometryWorkspace />} />
          <Route path="/board" element={<GeometryWorkspace />} />
          <Route
            path="/classroom/:classroomId/board"
            element={
              <ProtectedRoute>
                <ClassroomLiveBoard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-primary-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER', 'ROLE_ADMIN']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-400">CH EdTech</span> &mdash; See Mathematics.
            Understand Geometry. Learn Smarter.
          </div>
          <div className="text-[11px] text-slate-600 font-mono">
            Windows 11 Dev &bull; Spring Boot 3.4 &bull; React &bull; Three.js &bull; STOMP WebSocket
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
