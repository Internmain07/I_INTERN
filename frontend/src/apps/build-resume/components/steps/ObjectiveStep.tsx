import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FormTextarea } from '../FormTextarea';

interface ObjectiveStepProps {
  data: string;
  onUpdate: (data: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ObjectiveStep: React.FC<ObjectiveStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [objective, setObjective] = useState(data);
  const [error, setError] = useState('');

  useEffect(() => {
    onUpdate(objective);
  }, [objective, onUpdate]);

  const validateForm = () => {
    if (!objective.trim()) {
      setError('Career objective is required');
      return false;
    }
    if (objective.trim().length < 50) {
      setError('Please provide a more detailed objective (at least 50 characters)');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-[#004F4D] mb-2">Career Objective</h2>
        <p className="text-[#004F4D]/70">Write a brief summary of your career goals and aspirations</p>
      </div>

      <FormTextarea
        label="Objective"
        value={objective}
        onChange={setObjective}
        error={error}
        placeholder="A motivated computer science student seeking an internship opportunity to apply my programming skills and contribute to innovative projects while gaining practical experience in software development..."
        required
        rows={6}
      />

      <div className="text-sm text-[#004F4D]/60">
        Character count: {objective.length} (minimum 50 recommended)
      </div>

      <div className="flex justify-between">
        <motion.button
          onClick={onPrev}
          className="px-6 py-3 border border-[#63D7C7] text-[#1F7368] rounded-lg hover:bg-[#63D7C7]/10 hover:text-[#004F4D] transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Previous
        </motion.button>
        <motion.button
          onClick={handleNext}
          className="px-6 py-3 bg-[#1F7368] text-white rounded-lg hover:bg-[#004F4D] transition-colors duration-200 shadow-md"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Next Step
        </motion.button>
      </div>
    </motion.div>
  );
};


