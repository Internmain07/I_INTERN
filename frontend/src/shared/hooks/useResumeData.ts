import { useState, useCallback } from 'react';
import { ResumeData, PersonalInfo, Education, Project, Experience, Certification } from '../types/resume';

const initialPersonalInfo: PersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  githubLink: '',
  linkedinProfile: '',
};

const initialEducation: Education[] = [
  {
    degree: '',
    college: '',
    cgpa: '',
    startDate: '',
    endDate: '',
  }
];

const initialResumeData: ResumeData = {
  personalInfo: initialPersonalInfo,
  objective: '',
  education: initialEducation,
  projects: [],
  experience: [],
  skills: [],
  certifications: [],
};

export const useResumeData = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [currentStep, setCurrentStep] = useState(0);

  const updatePersonalInfo = useCallback((data: PersonalInfo) => {
    setResumeData(prev => ({ ...prev, personalInfo: data }));
  }, []);

  const updateObjective = useCallback((objective: string) => {
    setResumeData(prev => ({ ...prev, objective }));
  }, []);

  const updateEducation = useCallback((education: Education[]) => {
    setResumeData(prev => ({ ...prev, education }));
  }, []);

  const updateProjects = useCallback((projects: Project[]) => {
    setResumeData(prev => ({ ...prev, projects }));
  }, []);

  const updateExperience = useCallback((experience: Experience[]) => {
    setResumeData(prev => ({ ...prev, experience }));
  }, []);

  const updateSkills = useCallback((skills: string[]) => {
    setResumeData(prev => ({ ...prev, skills }));
  }, []);

  const updateCertifications = useCallback((certifications: Certification[]) => {
    setResumeData(prev => ({ ...prev, certifications }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 6));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, 6)));
  }, []);

  return {
    resumeData,
    currentStep,
    updatePersonalInfo,
    updateObjective,
    updateEducation,
    updateProjects,
    updateExperience,
    updateSkills,
    updateCertifications,
    nextStep,
    prevStep,
    goToStep,
  };
};