import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Education } from '../../types/resume';
import { FormInput } from '../FormInput';


interface EducationStepProps {
  data: Education[];
  onUpdate: (data: Education[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const EducationStep: React.FC<EducationStepProps> = ({ data, onUpdate, onNext, onPrev }) => {
// function body continues below
  const [educations, setEducations] = useState<Education[]>(data);
  const [errors, setErrors] = useState<{[key: number]: Partial<Education>}>({});
  const [gradeTypes, setGradeTypes] = useState<{[key: number]: 'CGPA' | 'GPA'}>({});

  useEffect(() => {
    onUpdate(educations);
  }, [educations, onUpdate]);

  const validateForm = () => {
    const newErrors: {[key: number]: Partial<Education>} = {};
    educations.forEach((formData, idx) => {
      const gradeType = gradeTypes[idx] || 'CGPA';
      const err: Partial<Education> = {};
      if (!formData.degree.trim()) err.degree = 'Degree is required';
      if (!formData.college.trim()) err.college = 'College/University is required';
      if (!formData.cgpa.trim()) {
        err.cgpa = gradeType + ' is required';
      } else if (gradeType === 'CGPA' && (isNaN(Number(formData.cgpa)) || Number(formData.cgpa) < 0 || Number(formData.cgpa) > 10)) {
        err.cgpa = 'Please enter a valid CGPA (0-10)';
      } else if (gradeType === 'GPA' && (isNaN(Number(formData.cgpa)) || Number(formData.cgpa) < 0 || Number(formData.cgpa) > 4)) {
        err.cgpa = 'Please enter a valid GPA (0-4)';
      }
      if (!formData.startDate) err.startDate = 'Start date is required';
      if (!formData.endDate) err.endDate = 'End date is required';
      if (Object.keys(err).length > 0) newErrors[idx] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const addEducation = () => {
    setEducations(prev => ([...prev, { degree: '', college: '', cgpa: '', startDate: '', endDate: '' }]));
  };
  const removeEducation = (idx: number) => {
    setEducations(prev => prev.filter((_, i) => i !== idx));
    setGradeTypes(prev => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-[#004F4D] mb-2">Education</h2>
        <p className="text-[#004F4D]/70">Tell us about your educational background</p>
      </div>
      {educations.map((formData, idx) => (
        <div key={idx} className="border-2 border-[#63D7C7]/30 rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-[#004F4D]">Degree {idx + 1}</h3>
            {educations.length > 1 && (
              <button onClick={() => removeEducation(idx)} className="text-red-500 hover:text-red-600 transition-colors">Remove</button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Degree"
              value={formData.degree}
              onChange={(value) => setEducations(prev => prev.map((e, i) => i === idx ? { ...e, degree: value } : e))}
              error={errors[idx]?.degree}
              placeholder="B.Tech in Computer Science"
              required
            />
            <FormInput
              label="College/University"
              value={formData.college}
              onChange={(value) => setEducations(prev => prev.map((e, i) => i === idx ? { ...e, college: value } : e))}
              error={errors[idx]?.college}
              placeholder="ABC University"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-[#004F4D] mb-1">Grade Type</label>
              <select
                className="w-full px-3 py-2 border border-[#63D7C7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63D7C7]/50"
                value={gradeTypes[idx] || 'CGPA'}
                onChange={e => setGradeTypes(prev => ({ ...prev, [idx]: e.target.value as 'CGPA' | 'GPA' }))}
              >
                <option value="CGPA">CGPA (0-10)</option>
                <option value="GPA">GPA (0-4)</option>
              </select>
            </div>
            <FormInput
              label={gradeTypes[idx] || 'CGPA'}
              value={formData.cgpa}
              onChange={(value) => setEducations(prev => prev.map((e, i) => i === idx ? { ...e, cgpa: value } : e))}
              error={errors[idx]?.cgpa}
              placeholder={(gradeTypes[idx] || 'CGPA') === 'CGPA' ? '8.5' : '3.7'}
              required
            />
            <FormInput
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(value) => setEducations(prev => prev.map((e, i) => i === idx ? { ...e, startDate: value } : e))}
              error={errors[idx]?.startDate}
              required
            />
            <FormInput
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(value) => setEducations(prev => prev.map((e, i) => i === idx ? { ...e, endDate: value } : e))}
              error={errors[idx]?.endDate}
              required
            />
          </div>
        </div>
      ))}
      <button
        onClick={addEducation}
        className="w-full py-2 border-2 border-dashed border-[#63D7C7] rounded-lg text-[#1F7368] hover:border-[#1F7368] hover:text-[#004F4D] transition-colors duration-200 flex items-center justify-center gap-2 mb-4"
      >
        Add Another Degree
      </button>
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


