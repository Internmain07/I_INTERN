import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PersonalInfo } from '../../types/resume';
import { FormInput } from '../FormInput';

interface PersonalInfoStepProps {
  data: PersonalInfo;
  onUpdate: (data: PersonalInfo) => void;
  onNext: () => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  data,
  onUpdate,
  onNext,
}) => {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState<Partial<PersonalInfo>>({});

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const validateForm = () => {
    const newErrors: Partial<PersonalInfo> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        <h2 className="text-2xl font-bold text-[#004F4D] mb-2">Personal Information</h2>
        <p className="text-[#004F4D]/70">Let's start with your basic information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Full Name"
          value={formData.fullName}
          onChange={(value) => setFormData(prev => ({ ...prev, fullName: value }))}
          error={errors.fullName}
          placeholder="John Doe"
          required
        />
        <FormInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
          error={errors.email}
          placeholder="john.doe@example.com"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
          error={errors.phone}
          placeholder="+1 (555) 123-4567"
          required
        />
        <FormInput
          label="GitHub Profile"
          type="url"
          value={formData.githubLink}
          onChange={(value) => setFormData(prev => ({ ...prev, githubLink: value }))}
          error={errors.githubLink}
          placeholder="https://github.com/johndoe"
        />
      </div>

      <FormInput
        label="LinkedIn Profile"
        type="url"
        value={formData.linkedinProfile}
        onChange={(value) => setFormData(prev => ({ ...prev, linkedinProfile: value }))}
        error={errors.linkedinProfile}
        placeholder="https://linkedin.com/in/johndoe"
      />

      <div className="flex justify-end">
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


