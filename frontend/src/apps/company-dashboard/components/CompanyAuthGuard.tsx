import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

interface CompanyAuthGuardProps {
  children: React.ReactNode;
}

export const CompanyAuthGuard: React.FC<CompanyAuthGuardProps> = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and save the attempted URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role !== 'company') {
    // If authenticated but not a company, redirect to appropriate dashboard
    const dashboardMap = {
      intern: '/intern/dashboard',
      admin: '/admin/dashboard',
      // Add other roles as needed
    };
    const redirectPath = dashboardMap[role as keyof typeof dashboardMap] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};