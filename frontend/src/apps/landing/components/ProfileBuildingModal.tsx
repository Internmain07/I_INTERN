import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CheckCircle, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
}

export const ProfileBuildingModal: React.FC<ProfileBuildingModalProps> = ({ isOpen, onClose, role }) => {
  const navigate = useNavigate();

  const handleBuildProfile = () => {
    onClose();
    if (role === 'intern') {
      navigate('/interns/edit-profile');
    } else if (role === 'company') {
      navigate('/company/settings?tab=profile');
    }
  };

  const handleSkip = () => {
    onClose();
    if (role === 'intern') {
      navigate('/interns/dashboard');
    } else if (role === 'company') {
      navigate('/company/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 z-10"
          >
            <X size={20} className="text-gray-500" />
          </button>

          {/* Header with Icon */}
          <div className="bg-gradient-to-br from-[#1F7368] via-[#63D7C7] to-[#004F4D] px-8 pt-12 pb-8">
            <motion.div
              className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <User size={40} className="text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white text-center mb-2">
              Welcome to I-Intern! 🎉
            </h2>
            <p className="text-white/90 text-center text-lg">
              Let's build your profile
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            <div className="space-y-6">
              {/* Why Build Profile Section */}
              <div className="bg-[#FFFAF3] rounded-2xl p-6 border-2 border-[#63D7C7]/20">
                <h3 className="text-xl font-bold text-[#004F4D] mb-4 flex items-center">
                  <CheckCircle size={24} className="text-[#1F7368] mr-2" />
                  Why build your profile?
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-[#1F7368] mr-2 font-bold">✓</span>
                    <span><strong>Stand Out:</strong> Complete profiles get 3x more views</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#1F7368] mr-2 font-bold">✓</span>
                    <span><strong>Better Matches:</strong> Get personalized internship recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#1F7368] mr-2 font-bold">✓</span>
                    <span><strong>Quick Applications:</strong> Apply with one click once profile is complete</span>
                  </li>
                  {role === 'intern' && (
                    <li className="flex items-start">
                      <span className="text-[#1F7368] mr-2 font-bold">✓</span>
                      <span><strong>Showcase Skills:</strong> Highlight your education, experience, and projects</span>
                    </li>
                  )}
                  {role === 'company' && (
                    <li className="flex items-start">
                      <span className="text-[#1F7368] mr-2 font-bold">✓</span>
                      <span><strong>Attract Talent:</strong> Complete company profiles attract better candidates</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Recommendation Box */}
              <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                <p className="text-amber-900 text-sm font-medium flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  <span>
                    <strong>Recommended:</strong> Building your profile now will give you immediate access to all features and better opportunities!
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 pb-8 space-y-3">
            <motion.button
              onClick={handleBuildProfile}
              className="w-full bg-gradient-to-r from-[#1F7368] to-[#63D7C7] text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <User size={20} className="mr-2" />
              Build My Profile Now
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              onClick={handleSkip}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-2xl font-medium hover:bg-gray-200 transition-all duration-200"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              I'll do this later (Skip)
            </motion.button>

            <p className="text-center text-xs text-gray-500 mt-2">
              You can always build your profile later from your dashboard settings
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
