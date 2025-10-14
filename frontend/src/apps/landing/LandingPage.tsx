import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingHomePage from './pages/LandingHomePage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import HireInternsPage from './pages/HireInternsPage';
import TermsAndConditions from './pages/TermsAndConditions';
import NotFoundPage from './pages/NotFoundPage';
import BrowseInternshipsPage from './pages/BrowseInternshipsPage';
import { LoginPage } from './components/LoginPage';
import { StudentRegistrationPage } from './components/StudentRegistrationPage';
import { CompanyRegistrationPage } from './components/CompanyRegistrationPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { VerifyOTPPage } from './components/VerifyOTPPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { EmailVerificationPage } from './components/EmailVerificationPage';
import PublicInternshipPage from './pages/PublicInternshipPage';


const LandingPage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingHomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/hire-interns" element={<HireInternsPage />} />
      <Route path="/browse-internships" element={<BrowseInternshipsPage />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/terms/interns" element={<TermsAndConditions />} />
      <Route path="/terms/employers" element={<TermsAndConditions />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/student" element={<StudentRegistrationPage />} />
      <Route path="/register/company" element={<CompanyRegistrationPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOTPPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/internship/:id" element={<PublicInternshipPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default LandingPage;
