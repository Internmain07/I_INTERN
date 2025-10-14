import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  onStepClick: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
  onStepClick,
}) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between gap-2 sm:gap-4 relative">
        {Array.from({ length: totalSteps }, (_, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center flex-1 min-w-0">
              <motion.div
                layout
                initial={{ scale: index < currentStep ? 0.7 : 0.8, opacity: 0.5 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  boxShadow:
                    index === currentStep
                      ? '0 0 0 4px rgba(99, 215, 199, 0.3), 0 2px 12px 0 rgba(99, 215, 199, 0.25)'
                      : index < currentStep
                      ? '0 2px 8px 0 rgba(31, 115, 104, 0.15)'
                      : 'none',
                  filter: index === currentStep ? 'brightness(1.08)' : 'none',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-2 z-10 transition-shadow duration-300 ${
                  index < currentStep
                    ? 'bg-[#1F7368] text-white border-[#1F7368]'
                    : index === currentStep
                    ? 'bg-[#1F7368] text-white border-[#63D7C7]'
                    : 'bg-white text-[#004F4D]/50 border-[#63D7C7]/30'
                }`}
                onClick={() => onStepClick(index)}
                whileHover={{ scale: 1.08, boxShadow: '0 0 0 6px rgba(99, 215, 199, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                {index === currentStep && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-[#63D7C7]/20 blur-sm"
                    style={{ zIndex: 0 }}
                    initial={{ opacity: 0.7, scale: 1 }}
                    animate={{
                      opacity: [0.7, 0.3, 0.7],
                      scale: [1, 1.25, 1],
                    }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                {index < currentStep ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    <Check size={20} />
                  </motion.div>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </motion.div>
              <span className="text-xs mt-2 text-center text-[#FFFAF3]/90 truncate w-20 sm:w-auto">
                {stepTitles[index]}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <motion.div
                layout
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className={`flex-1 h-1 mx-1 sm:mx-2 rounded origin-left shadow-sm ${
                  index < currentStep - 1
                    ? 'bg-[#1F7368]'
                    : index === currentStep - 1
                    ? 'bg-[#1F7368]'
                    : 'bg-[#63D7C7]/30'
                }`}
                style={{ 
                  minWidth: 16, 
                  boxShadow: index === currentStep - 1 ? '0 2px 8px rgba(31, 115, 104, 0.3)' : undefined 
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};


