import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('ROLE_ADMIN' | 'ROLE_TEACHER' | 'ROLE_STUDENT')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    // Redirect to login preserving destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to appropriate home
    if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'ROLE_TEACHER') return <Navigate to="/teacher" replace />;
    return <Navigate to="/student" replace />;
  }

  return <>{children}</>;
};

