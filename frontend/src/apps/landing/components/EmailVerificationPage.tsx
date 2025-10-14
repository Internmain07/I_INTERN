import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { ProfileBuildingModal } from './ProfileBuildingModal';
import { useAuth } from '@/auth/AuthContext';

export const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // Get login function from AuthContext
  const email = location.state?.email || '';
  const role = location.state?.role || 'intern'; // Get role from navigation state
  
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email is provided
  useEffect(() => {
    if (!email) {
      // Redirect to appropriate registration page based on role
      if (role === 'company') {
        navigate('/register/company');
      } else {
        navigate('/register/student');
      }
    }
  }, [email, role, navigate]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (index === 5 && value) {
      const otpString = newOtp.join('');
      if (otpString.length === 6) {
        handleVerify(otpString);
      }
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
      const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
      setOtp(newOtp.slice(0, 6));
      
      // Focus on the next empty field or last field
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();

      // Auto-submit if 6 digits pasted
      if (pastedData.length === 6) {
        handleVerify(pastedData);
      }
    }
  };

  const handleVerify = async (otpString?: string) => {
    const otpValue = otpString || otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const response = await authService.verifyEmail({ email, otp: otpValue });
      
      // Store token in localStorage and update AuthContext
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('userRole', role);
      
      // Update AuthContext with the new authentication state
      login(response.access_token, role);
      
      setIsVerified(true);
      
      // Show profile building modal after a short delay
      setTimeout(() => {
        setShowProfileModal(true);
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setError(null);

    try {
      await authService.sendVerificationOTP({ email });
      setResendCooldown(60); // 60 seconds cooldown
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      setError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Success screen
  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1F7368] via-[#63D7C7] to-[#004F4D] flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center"
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

          <h1 className="text-3xl font-bold text-[#004F4D] mb-4">Email Verified!</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your email has been verified successfully! You are now logged in.
            <strong className="block mt-2 text-[#1F7368]">Get ready to build your profile...</strong>
          </p>

          <div className="w-8 h-8 border-4 border-[#1F7368]/30 border-t-[#1F7368] rounded-full animate-spin mx-auto"></div>
          
          {/* Profile Building Modal */}
          <ProfileBuildingModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            role={role}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F7368] via-[#63D7C7] to-[#004F4D] py-12 px-6">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <motion.div
        className="w-full max-w-md mx-auto relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Back Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            to={role === 'company' ? '/register/company' : '/register/student'}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Back to Registration
          </Link>
        </motion.div>

        {/* Verification Card */}
        <motion.div
          className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Email Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#1F7368]/10 rounded-full flex items-center justify-center">
              <Mail size={32} className="text-[#1F7368]" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#004F4D] mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-[#1F7368] font-semibold mt-1">{email}</p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <div className="flex justify-center gap-3 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 ${
                    error
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-[#1F7368] focus:ring-[#1F7368]/20'
                  }`}
                  disabled={isVerifying}
                />
              ))}
            </div>

            {error && (
              <motion.p
                className="text-red-500 text-sm text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* Verify Button */}
          <motion.button
            onClick={() => handleVerify()}
            disabled={isVerifying || otp.join('').length !== 6}
            className="w-full bg-[#1F7368] text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:bg-[#004F4D] hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            whileHover={{ scale: isVerifying ? 1 : 1.02 }}
            whileTap={{ scale: isVerifying ? 1 : 0.98 }}
          >
            {isVerifying ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Verifying...
              </div>
            ) : (
              'Verify Email'
            )}
          </motion.button>

          {/* Resend OTP */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResendOtp}
              disabled={isResending || resendCooldown > 0}
              className="text-[#1F7368] font-semibold hover:text-[#004F4D] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              <RefreshCw size={16} className={isResending ? 'animate-spin' : ''} />
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
            </button>
          </div>

          {/* Tips */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              💡 <strong>Tip:</strong> Check your spam folder if you don't see the email. The code expires in 10 minutes.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
