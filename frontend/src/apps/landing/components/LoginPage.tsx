import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import { authService } from '@/services/auth.service';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- Use the login function from AuthContext

  // Load saved email on component mount (for Remember Me)
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Use the auth service to login
      const data = await authService.login({
        username: email,
        password: password,
      });
      
      // Handle Remember Me functionality - Only save email (not password for security)
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Store token temporarily in localStorage to make authenticated requests
      localStorage.setItem('authToken', data.access_token);
      
      // Fetch current user to get role BEFORE setting auth state
      try {
        const userProfile = await authService.getCurrentUser();
        
        console.log('✅ User profile fetched:', userProfile);
        console.log('🔑 User role:', userProfile.role);
        
        // Now set the auth state with the correct role
        login(data.access_token, userProfile.role);
        
        // Redirect based on role
        if (userProfile.role === 'intern') {
          console.log('➡️  Redirecting to intern dashboard');
          navigate('/interns/dashboard');
        } else if (userProfile.role === 'company') {
          console.log('➡️  Redirecting to company dashboard');
          navigate('/company/dashboard');
        } else if (userProfile.role === 'admin') {
          console.log('➡️  Redirecting to admin dashboard');
          navigate('/admin/dashboard');
        } else {
          console.log('⚠️  Unknown role, redirecting to home');
          navigate('/');
        }
      } catch (profileError) {
        // If profile fetch fails, clean up and show error
        console.error('❌ Failed to fetch user profile:', profileError);
        localStorage.removeItem('authToken');
        setError('Failed to load user profile. Please try again.');
      }

    } catch (err: any) {
      console.error('❌ Login error:', err);
      
      // Check if it's an email verification error (403 status)
      if (err.message?.includes('Email not verified') || err.message?.includes('verify your email')) {
        setError('Email not verified. Please check your email for the OTP code and verify your account.');
        
        // Optionally redirect to verification page after showing error
        setTimeout(() => {
          navigate('/verify-email', { state: { email } });
        }, 3000);
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };     


  return (
    // ... The rest of your JSX remains unchanged
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
        {/* Back to Home */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </motion.div>

        {/* Login Card */}
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
            
            <h1 className="text-3xl font-bold text-[#004F4D] mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue your journey</p>
          </div>

          {/* Email Login Form */}
          <motion.form
            onSubmit={handleEmailLogin}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                <p className="text-sm">{error}</p>
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
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 focus:border-[#1F7368] transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#1F7368] border-gray-300 rounded focus:ring-[#1F7368]/20 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-[#1F7368] hover:text-[#004F4D] transition-colors duration-200">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
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
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </motion.form>

          {/* Sign Up Link */}
          <motion.div
            className="text-center mt-8 pt-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-gray-600">
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
        </motion.div>
      </motion.div>
    </div>
  );
};