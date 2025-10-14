import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Trophy, Download, FileText } from 'lucide-react';

interface LoadingModalProps {
  isOpen: boolean;
  status: 'generating' | 'success' | 'error';
  progress?: number; // 0-100 for real-time progress
  onDownload?: () => void;
  onClose?: () => void;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  status,
  progress = 0,
  onDownload,
  onClose,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-neutral bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-cream p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 border border-accentTeal"
      >
        {status === 'generating' && (
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-4"
            >
              <Loader2 size={48} className="text-primaryTeal animate-spin" />
            </motion.div>
            <h3 className="text-xl font-semibold text-primaryTeal mb-2">
              Generating Your Resume
            </h3>
            <motion.p
              className="text-neutral flex items-center justify-center gap-1"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              Please wait while we create your ATS-optimized resume
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2], x: [0, 2, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.2 }}
              >
                .
              </motion.span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2], x: [0, 2, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.4 }}
              >
                .
              </motion.span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2], x: [0, 2, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.6 }}
              >
                .
              </motion.span>
            </motion.p>
            <div className="mt-4">
              <div className="w-full bg-aqua rounded-full h-2 overflow-hidden relative">
                <motion.div
                  className="bg-primaryTeal h-2 rounded-full absolute left-0 top-0"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
              </div>
              <div className="text-xs text-primaryTeal mt-1 font-medium">{progress}%</div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4"
            >
              <Trophy size={48} className="text-highlight" />
            </motion.div>
            <h3 className="text-xl font-semibold text-primaryTeal mb-2">
              Resume Generated Successfully!
            </h3>
            <p className="text-neutral mb-6">
              Your ATS-optimized resume is ready for download.
            </p>
            <div className="w-full bg-aqua rounded-full h-2 mb-6 overflow-hidden relative">
              <motion.div
                className="bg-primaryTeal h-2 rounded-full absolute left-0 top-0"
                initial={{ width: '0%' }}
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 1.2 }}
              />
            </div>
            <div className="flex gap-3 justify-center mt-4">
              <motion.button
                onClick={onDownload}
                className="px-6 py-3 bg-primaryTeal text-white rounded-lg hover:bg-darkTeal transition-colors flex items-center gap-2 shadow-md"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={20} />
                Download Resume
              </motion.button>
              <motion.button
                onClick={onClose}
                className="px-6 py-3 border border-accentTeal text-primaryTeal rounded-lg hover:bg-aqua hover:text-darkTeal transition-colors shadow-md"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="inline-block mb-4">
              <FileText size={48} className="text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Generation Failed
            </h3>
            <p className="text-gray-600 mb-6">
              There was an error generating your resume. Please try again.
            </p>
            <motion.button
              onClick={onClose}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};


