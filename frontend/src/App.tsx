import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { Toaster } from '@/shared/components/ui/toaster';
import { Toaster as Sonner } from '@/shared/components/ui/sonner';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { AuthProvider } from '@/auth/AuthContext'; // Import AuthProvider
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

// Lazy load all main app components
const LandingPage = lazy(() => import('@/apps/landing/LandingPage'));
const InternsDashboard = lazy(() => import('@/apps/interns-dashboard/InternsDashboard'));
const CompanyDashboard = lazy(() => import('@/apps/company-dashboard/CompanyDashboard'));
const AdminDashboard = lazy(() => import('@/apps/admin-dashboard/AdminDashboard'));
const BuildResume = lazy(() => import('@/apps/build-resume/BuildResume'));
const IVA = lazy(() => import('@/apps/iva/IVA'));
const AURA = lazy(() => import('@/apps/aura/AURA'));

// Create a single QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider> {/* Add AuthProvider here */}
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Landing Page and related routes */}
                    <Route path="/*" element={<LandingPage />} />
                    
                    {/* Interns Dashboard - Protected for intern role */}
                    <Route 
                      path="/interns/*" 
                      element={
                        <ProtectedRoute requiredRole="intern">
                          <InternsDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Company Dashboard - Protected for company role */}
                    <Route 
                      path="/company/*" 
                      element={
                        <ProtectedRoute requiredRole="company">
                          <CompanyDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Admin Dashboard - Protected for admin role */}
                    <Route 
                      path="/admin/*" 
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Build Resume */}
                    <Route path="/resume/*" element={<BuildResume />} />
                    
                    {/* IVA Chat Assistant */}
                    <Route path="/iva/*" element={<IVA />} />
                    
                    {/* AURA AI Interface */}
                    <Route path="/aura/*" element={<AURA />} />
                  </Routes>
                </Suspense>
              </div>
            </BrowserRouter>
          </AuthProvider> {/* And close it here */}
          
          {/* Global toast notifications */}
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;