import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, CheckCircle, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../../api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('🔑 Requesting password reset for:', email);
        const response = await apiClient.post('/api/v1/auth/forgot-password', { email });
        console.log('✅ Password reset OTP sent successfully:', response);
        setIsOTPSent(true);
        // Navigate to verify OTP page after 2 seconds
        setTimeout(() => {
          navigate('/verify-otp', { state: { email } });
        }, 2000);
      } catch (err: any) {
        console.error('❌ Forgot password error:', err);
        setError(err.message || 'Failed to send OTP. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Resending OTP to:', email);
      await apiClient.post('/api/v1/auth/forgot-password', { email });
      console.log('✅ OTP resent successfully');
      alert('OTP sent again! Check your email.');
    } catch (err: any) {
      console.error('❌ Resend OTP error:', err);
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F7368] via-[#63D7C7] to-[#004F4D] flex items-center justify-center p-6">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/20 rounded-full blur-lg animate-pulse"></div>
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Back to Login */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Back to Login
          </Link>
        </motion.div>

        {/* Forgot Password Card */}
        <motion.div
          className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {!isOTPSent ? (
            <>
              {/* Logo and Header */}
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex items-center gap-3 mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-[#63D7C7] rounded-xl flex items-center justify-center">
                    <GraduationCap size={24} className="text-[#004F4D]" />
                  </div>
                  <span className="text-2xl font-bold text-[#004F4D]">I-Intern</span>
                </motion.div>
                
                <h1 className="text-3xl font-bold text-[#004F4D] mb-2">Forgot Password?</h1>
                <p className="text-gray-600">No worries! Enter your email and we'll send you a 6-digit OTP to reset your password.</p>
              </div>

              {/* Reset Form */}
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 focus:border-[#1F7368] transition-all duration-300"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                {/* Reset Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1F7368] text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:bg-[#004F4D] hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending OTP...
                    </div>
                  ) : (
                    'Send OTP'
                  )}
                </motion.button>
              </motion.form>

              {/* Back to Login Link */}
              <motion.div
                className="text-center mt-8 pt-6 border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="text-[#1F7368] font-semibold hover:text-[#004F4D] transition-colors duration-200">
                    Sign in here
                  </Link>
                </p>
                <p className="text-gray-600 mt-2">
                  Don't have an account?{' '}
                  <Link to="/register/student" className="text-[#1F7368] font-semibold hover:text-[#004F4D] transition-colors duration-200">
                    Sign up as Intern
                  </Link>
                  {' or '}
                  <Link to="/register/company" className="text-[#1F7368] font-semibold hover:text-[#004F4D] transition-colors duration-200">
                    Register as Company
                  </Link>
                </p>
              </motion.div>
            </>
          ) : (
            /* Success State */
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CheckCircle size={40} className="text-green-600" />
              </motion.div>

              <h1 className="text-3xl font-bold text-[#004F4D] mb-4">Check Your Email</h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We've sent a 6-digit OTP to <strong>{email}</strong>. 
                Please check your inbox and enter the OTP on the next page to reset your password.
              </p>

              <div className="space-y-4">
                <motion.button
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="w-full bg-[#1F7368] text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:bg-[#004F4D] hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Resending...
                    </div>
                  ) : (
                    'Resend OTP'
                  )}
                </motion.button>

                <Link to="/login">
                  <motion.button
                    className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back to Login
                  </motion.button>
                </Link>
              </div>

              <motion.div
                className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p>Didn't receive the OTP? Check your spam folder or contact support.</p>
                <p className="mt-2">Redirecting to verification page...</p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};


