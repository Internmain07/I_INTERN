import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, GraduationCap, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../../api';

export const VerifyOTPPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // If no email is provided, redirect to forgot-password
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    // Focus on the first input when the component mounts
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      
      // Focus on the next empty input or the last one
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post('/api/v1/auth/verify-otp', {
        email,
        otp: otpString
      });
      
      // Navigate to reset password page with email and otp
      navigate('/reset-password', { state: { email, otp: otpString } });
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP. Please try again.');
      // Clear OTP inputs on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.post('/api/v1/auth/forgot-password', { email });
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      alert('OTP sent again! Check your email.');
    } catch (err: any) {
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
        {/* Back to Forgot Password */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Back to Forgot Password
          </Link>
        </motion.div>

        {/* Verify OTP Card */}
        <motion.div
          className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
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
            
            <h1 className="text-3xl font-bold text-[#004F4D] mb-2">Verify OTP</h1>
            <p className="text-gray-600">
              Enter the 6-digit code sent to <strong>{email}</strong>
            </p>
          </div>

          {/* Verify OTP Form */}
          <motion.form
            onSubmit={handleVerifyOTP}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* OTP Input Fields */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 focus:border-[#1F7368] transition-all duration-300"
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Verify Button */}
            <motion.button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full bg-[#1F7368] text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:bg-[#004F4D] hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </motion.button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-[#1F7368] font-semibold hover:text-[#004F4D] transition-colors duration-200 disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </motion.form>

          {/* Help Text */}
          <motion.div
            className="text-center mt-8 pt-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-gray-600 text-sm">
              OTP expires in 10 minutes. Check your spam folder if you don't see the email.
            </p>
            <p className="text-gray-600 mt-2 text-sm">
              <Link to="/login" className="text-[#1F7368] font-semibold hover:text-[#004F4D] transition-colors duration-200">
                Back to Login
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
