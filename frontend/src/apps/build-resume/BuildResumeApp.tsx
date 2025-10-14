import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResumeData } from '@/shared/hooks/useResumeData';
import { StepIndicator } from './components/StepIndicator';
import { PersonalInfoStep } from './components/steps/PersonalInfoStep';
import { ObjectiveStep } from './components/steps/ObjectiveStep';
import { EducationStep } from './components/steps/EducationStep';
import { ProjectsStep } from './components/steps/ProjectsStep';
import { ExperienceStep } from './components/steps/ExperienceStep';
import { SkillsStep } from './components/steps/SkillsStep';
import { CertificationsStep } from './components/steps/CertificationsStep';
import { LoadingModal } from './components/LoadingModal';
import { Footer } from '@/apps/landing/components/Footer';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STEP_TITLES = [
  'Personal Info',
  'Objective',
  'Education',
  'Projects',
  'Experience',
  'Skills',
  'Certifications',
];


export default function App() {
  const navigate = useNavigate();
  const {
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
  } = useResumeData();

  // Validation for each step
  function validateCurrentStep() {
    switch (currentStep) {
      case 0: {
        const d = resumeData.personalInfo;
        return d.fullName.trim() && d.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) && d.phone.trim();
      }
      case 1: {
        const o = resumeData.objective;
        return o && o.trim().length >= 50;
      }
      case 2: {
        const e = resumeData.education;
        return e.length > 0 && e.every(edu => 
          edu.degree.trim() && 
          edu.college.trim() && 
          edu.cgpa.trim() && 
          !isNaN(Number(edu.cgpa)) && 
          Number(edu.cgpa) >= 0 && 
          Number(edu.cgpa) <= 10 && 
          edu.startDate && 
          edu.endDate
        );
      }
      case 3: {
        return resumeData.projects.length > 0 && resumeData.projects.every(p => p.title.trim() && p.description.trim());
      }
      case 4: {
        return resumeData.experience.length > 0 && resumeData.experience.every(exp => exp.role.trim() && exp.company.trim() && exp.startDate.trim() && exp.endDate.trim() && exp.responsibilities.length > 0);
      }
      case 5: {
        return resumeData.skills.length > 0;
      }
      case 6: {
        return true;
      }
      default:
        return true;
    }
  }

  const guardedGoToStep = (step: number) => {
    if (step === currentStep) return;
    if (step > currentStep) {
      if (!validateCurrentStep()) {
        alert('Please complete all required fields before proceeding.');
        return;
      }
    }
    goToStep(step);
  };

  const [modalStatus, setModalStatus] = useState<'generating' | 'success' | 'error' | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async () => {
    setModalStatus('generating');
    setProgress(0);
    // Simulate real-time progress
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev < 90) {
          return prev + Math.floor(Math.random() * 6) + 2; // Increase by 2-7%
        } else {
          return prev;
        }
      });
    }, 300);

    try {
      // Make direct fetch call for PDF blob response
      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      console.log('Sending resume data:', JSON.stringify(resumeData, null, 2));

      const response = await fetch(`${API_URL}/api/v1/resume/generate`, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify(resumeData),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      setPdfBlob(blob);
      setProgress(100);
      setModalStatus('success');
    } catch (error) {
      console.error('Error generating resume:', error);
      setModalStatus('error');
    } finally {
      if (progressInterval.current) {
        setTimeout(() => {
          clearInterval(progressInterval.current!);
          progressInterval.current = null;
        }, 600);
      }
    }
  };

  const handleDownload = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Reset progress and clear interval when modal closes
  const handleCloseModal = () => {
    setModalStatus(null);
    setProgress(0);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoStep
            data={resumeData.personalInfo}
            onUpdate={updatePersonalInfo}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <ObjectiveStep
            data={resumeData.objective}
            onUpdate={updateObjective}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 2:
        return (
          <EducationStep
            data={resumeData.education}
            onUpdate={updateEducation}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <ProjectsStep
            data={resumeData.projects}
            onUpdate={updateProjects}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <ExperienceStep
            data={resumeData.experience}
            onUpdate={updateExperience}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <SkillsStep
            data={resumeData.skills}
            onUpdate={updateSkills}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 6:
        return (
          <CertificationsStep
            data={resumeData.certifications}
            onUpdate={updateCertifications}
            onSubmit={handleSubmit}
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] relative overflow-hidden">
        {/* Animated background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-[#63D7C7]/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#63D7C7]/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate('/interns')}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-[#FFFAF3]/90 hover:bg-[#FFFAF3] text-[#004F4D] rounded-lg shadow-md hover:shadow-lg transition-all duration-200 backdrop-blur-sm border border-[#63D7C7]/30"
            whileHover={{ scale: 1.02, x: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Dashboard</span>
          </motion.button>

          {/* Header */}
          <div className="mb-10 border-b border-[#FFFAF3]/20 pb-6 flex flex-col items-center">
            <h1 className="text-3xl font-bold font-quicksand text-[#FFFAF3] tracking-wide mb-1">InternCV</h1>
            <p className="text-[#FFFAF3]/80 text-base font-manrope">Create your professional ATS-optimized resume in minutes</p>
          </div>

          {/* Main Content */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#FFFAF3] rounded-lg border border-[#63D7C7]/30 p-6 shadow-xl relative group">
              <StepIndicator
                currentStep={currentStep}
                totalSteps={STEP_TITLES.length}
                stepTitles={STEP_TITLES}
                onStepClick={guardedGoToStep}
              />

              <AnimatePresence mode="wait">
                <div key={currentStep}>
                  {renderCurrentStep()}
                </div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <LoadingModal
          isOpen={modalStatus !== null}
          status={modalStatus || 'generating'}
          progress={progress}
          onDownload={handleDownload}
          onClose={handleCloseModal}
        />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}


