import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import BuildResumePage from './pages/BuildResumePage';
import EditProfilePage from './pages/EditProfilePage';
import InternshipDetailPage from './pages/InternshipDetailPage';
import InternshipsPage from './pages/InternshipsPage';
import SettingsPage from './pages/SettingsPage';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

const InternsDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#63D7C7]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#63D7C7]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10">
      <Routes>
        <Route path="" element={<Index />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="internships" element={<InternshipsPage />} />
        <Route path="build-resume" element={<BuildResumePage />} />
        <Route path="profile" element={<EditProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="internship/:id" element={<InternshipDetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
    </div>
  );
};

export default InternsDashboard;


