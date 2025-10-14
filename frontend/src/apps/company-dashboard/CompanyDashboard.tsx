import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { AnalyticsDebugPage } from './pages/AnalyticsDebug';
import { Internships } from './pages/Internships';
import { Applicants } from './pages/Applicants';
import { Settings } from './pages/Settings';
import PostInternshipPage from './pages/PostInternshipPage';
import { EditInternshipPage } from './pages/EditInternshipPage';
import { CompanyAuthGuard } from './components/CompanyAuthGuard';
import NotFound from './pages/NotFound';

const CompanyDashboard: React.FC = () => {
  return (
    <CompanyAuthGuard>
      <Routes>
        <Route path="" element={<Navigate to="/company/dashboard" replace />} />
        <Route path="" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="analytics/debug" element={<AnalyticsDebugPage />} />
          <Route path="internships" element={<Internships />} />
          <Route path="internships/edit/:id" element={<EditInternshipPage />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="settings" element={<Settings />} />
          <Route path="post-internship" element={<PostInternshipPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </CompanyAuthGuard>
  );
};

export default CompanyDashboard;


