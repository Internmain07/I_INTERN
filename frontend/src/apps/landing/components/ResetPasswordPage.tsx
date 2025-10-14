import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, GraduationCap, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../../api';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const otp = location.state?.otp || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no email or OTP is provided, redirect to forgot-password
    if (!email || !otp) {
      navigate('/forgot-password');
    }
  }, [email, otp, navigate]);

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!minLength) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!hasUpperCase) {
      setError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!hasLowerCase) {
      setError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!hasNumber) {
      setError('Password must contain at least one number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (!validatePassword(newPassword)) {
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post('/api/v1/auth/reset-password', {
        email,
        otp,
        new_password: newPassword
      });
      setIsPasswordReset(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
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
            to="/verify-otp"
            state={{ email }}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Back to Verify OTP
          </Link>
        </motion.div>

        {/* Reset Password Card */}
        <motion.div
          className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {!isPasswordReset ? (
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
                
                <h1 className="text-3xl font-bold text-[#004F4D] mb-2">Reset Your Password</h1>
                {email && (
                  <p className="text-gray-600">For account: <strong>{email}</strong></p>
                )}
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

                {/* New Password Input */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 focus:border-[#1F7368] transition-all duration-300"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Must be at least 8 characters with uppercase, lowercase, and a number
                  </p>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 focus:border-[#1F7368] transition-all duration-300"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
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
                      Resetting Password...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </motion.button>
              </motion.form>
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

              <h1 className="text-3xl font-bold text-[#004F4D] mb-4">Password Reset Successful!</h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Your password has been reset successfully. You can now log in with your new password.
              </p>

              <div className="space-y-4">
                <Link to="/login">
                  <motion.button
                    className="w-full bg-[#1F7368] text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:bg-[#004F4D] hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Go to Login
                  </motion.button>
                </Link>
              </div>

              <motion.div
                className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p>Redirecting to login page in 3 seconds...</p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
