import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, Phone, GraduationCap, MapPin, Globe, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  mobileNumber: string;
  universityName: string;
  pincode: string;
  country: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

export const StudentRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    mobileNumber: '',
    universityName: '',
    pincode: '',
    country: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [serverError, setServerError] = useState<string | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateAge = (dateOfBirth: string): boolean => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 16;
    }
    return age >= 16;
  };

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    Object.keys(formData).forEach(key => {
      if (!formData[key as keyof FormData].trim()) {
        newErrors[key] = 'This field is required';
      }
    });

    // Age validation
    if (formData.dateOfBirth && !validateAge(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'You must be at least 16 years old';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Mobile number validation
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    if (formData.mobileNumber && !phoneRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid mobile number';
    }

    // Password validation
    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Pincode validation
    const pincodeRegex = /^\d{5,6}$/;
    if (formData.pincode && !pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid pincode (5-6 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setServerError('Please agree to the terms and conditions');
      return;
    }
    
    if (validateForm()) {
      setIsLoading(true);
      setServerError(null);
      
      try {
        // Register the student with backend
        await authService.register({
          email: formData.email,
          password: formData.password,
          role: 'intern',
          skills: '', // Can be added later in profile
        });
        
        console.log('✅ Registration successful! OTP sent to email.');
        
        setIsRegistered(true);
        
        // Redirect to email verification page after 2 seconds
        setTimeout(() => {
          navigate('/verify-email', { 
            state: { 
              email: formData.email,
              role: 'intern'
            } 
          });
        }, 2000);
      } catch (error: any) {
        setServerError(error.message || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getPasswordStrength = (password: string): { strength: number; text: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    const levels = [
      { text: 'Very Weak', color: 'bg-red-500' },
      { text: 'Weak', color: 'bg-orange-500' },
      { text: 'Fair', color: 'bg-yellow-500' },
      { text: 'Good', color: 'bg-blue-500' },
      { text: 'Strong', color: 'bg-green-500' }
    ];

    return { strength, ...levels[strength] };
  };

  if (isRegistered) {
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

                    <h1 className="text-3xl font-bold text-[#004F4D] mb-4">Registration Successful!</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We've sent a verification code (OTP) to your email. Please check your inbox and verify your email. 
            <strong className="block mt-3 text-[#1F7368]">After verification, you'll build your profile and get full access to the platform!</strong>
          </p>

          <div className="w-8 h-8 border-4 border-[#1F7368]/30 border-t-[#1F7368] rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 text-sm mt-4">Redirecting to verification page...</p>
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
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/20 rounded-full blur-lg animate-pulse"></div>
      </div>

      <motion.div
        className="w-full max-w-2xl mx-auto relative z-10"
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

        {/* Registration Card */}
        <motion.div
          className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#004F4D] mb-2">Join as an Intern</h1>
            <p className="text-gray-600">Create your account to find amazing internship opportunities</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 transition-all duration-300 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-[#1F7368]'
                    }`}
                    placeholder="Enter first name"
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 transition-all duration-300 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-[#1F7368]'
                    }`}
                    placeholder="Enter last name"
                  />
                </div>
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Birth * (Must be at least 16 years old)
              </label>
              <div className="relative">
                <Calendar size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 transition-all duration-300 ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-gray-200 focus:border-[#1F7368]'
                  }`}
                />
              </div>
              {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 transition-all duration-300 ${
                    errors.mobileNumber ? 'border-red-500' : 'border-gray-200 focus:border-[#1F7368]'
                  }`}
                  placeholder="Enter mobile number"
                />
              </div>
              {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
            </div>

            {/* University Name */}
            <div>
              <label htmlFor="universityName" className="block text-sm font-semibold text-gray-700 mb-2">
                University Name *
              </label>
              <div className="relative">
                <GraduationCap size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="universityName"
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 transition-all duration-300 ${
                    errors.universityName ? 'border-red-500' : 'border-gray-200 focus:border-[#1F7368]'
                  }`}
                  placeholder="Enter university name"
                />
              </div>
              {errors.universityName && <p className="text-red-500 text-sm mt-1">{errors.universityName}</p>}
            </div>

            {/* Location Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pincode" className="block text-sm font-semibold text-gray-700 mb-2">
                  Pincode *
                </label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 transition-all duration-300 ${
                      errors.pincode ? 'border-red-500' : 'border-gray-200 focus:border-[#1F7368]'
                    }`}
                    placeholder="Enter pincode"
                  />
                </div>
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                  Country *
                </label>
                <div className="relative">
                  <Globe size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 transition-all duration-300 ${
                      errors.country ? 'border-red-500' : 'border-gray-200 focus:border-[#1F7368]'
                    }`}
                  >
                    <option value="">Select country</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 transition-all duration-300 ${
                    errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#1F7368]'
                  }`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 transition-all duration-300 ${
                    errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#1F7368]'
                  }`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrength(formData.password).color}`}
                        style={{ width: `${(getPasswordStrength(formData.password).strength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{getPasswordStrength(formData.password).text}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Password must contain: 8+ characters, uppercase, lowercase, number, special character
                  </p>
                </div>
              )}
              
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>


            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 transition-all duration-300 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-[#1F7368]'
                  }`}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                className="accent-[#1F7368] w-5 h-5 rounded focus:ring-[#1F7368] border-gray-300"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700 select-none">
                I agree to the{' '}
                <a
                  href="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1F7368] underline hover:text-[#004F4D]"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Server Error Display */}
            {serverError && (
              <motion.div
                className="bg-red-50 border border-red-200 rounded-xl p-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-red-600 text-sm">{serverError}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !agreedToTerms}
              className="w-full bg-[#1F7368] text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:bg-[#004F4D] hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading || !agreedToTerms ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || !agreedToTerms ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Intern Account'
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <motion.div
            className="text-center mt-8 pt-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#1F7368] font-semibold hover:text-[#004F4D] transition-colors duration-200">
                Sign in here
              </Link>
            </p>
            <p className="text-gray-600 mt-2">
              Want to hire interns?{' '}
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

