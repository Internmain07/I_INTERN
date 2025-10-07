import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEmployers from './pages/admin/AdminEmployers';
import AdminInterns from './pages/admin/AdminInterns';
import AdminInternshipPostings from './pages/admin/AdminInternshipPostings';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';
import NotFound from './pages/NotFound';

const AdminDashboardApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* The default route for "/admin" will now render the dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employers" element={<AdminEmployers />} />
        <Route path="interns" element={<AdminInterns />} />
        <Route path="postings" element={<AdminInternshipPostings />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminDashboardApp;