import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'intern' | 'company' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to appropriate dashboard
  if (requiredRole && role !== requiredRole) {
    // Redirect to the user's appropriate dashboard
    if (role === 'intern') {
      return <Navigate to="/interns/dashboard" replace />;
    } else if (role === 'company') {
      return <Navigate to="/company/dashboard" replace />;
    } else if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Fallback: redirect to home
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has the right role
  return <>{children}</>;
};
