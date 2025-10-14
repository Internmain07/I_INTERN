import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext"; // Correct path to AuthContext
import { motion } from "framer-motion";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  FileText,
  CheckCircle,
  X,
  Plus,
  AlertCircle
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface InternshipFormData {
  title: string;
  description: string;
  location: string;
  stipend: string;
  isUnpaid: boolean;
  duration: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  skills: string[];
  requirements: string[];
  benefits: string[];
  deadline: string;
  companyName: string;
  companyLogo?: string;
  industry: string;
  status?: 'Active' | 'Draft';
}

const initialForm: InternshipFormData = {
  title: "",
  description: "",
  location: "",
  stipend: "",
  isUnpaid: false,
  duration: "",
  type: "Remote",
  level: "Beginner",
  category: "",
  skills: [],
  requirements: [],
  benefits: [],
  deadline: "",
  companyName: "",
  companyLogo: "",
  industry: ""
};


export default function PostInternshipPage() {
  const { token, isAuthenticated } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deadlineError, setDeadlineError] = useState<string | null>(null);
  const [agreedToEmployerTerms, setAgreedToEmployerTerms] = useState(false);
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [currentBenefit, setCurrentBenefit] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const navigate = useNavigate();

  // Calculate min and max dates for deadline
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 1); // Minimum: Tomorrow
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 180); // Maximum: 180 days from today

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const minDateStr = formatDate(minDate);
  const maxDateStr = formatDate(maxDate);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    
    // Handle checkbox separately
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'isUnpaid') {
        setForm({ ...form, isUnpaid: checked, stipend: checked ? '0' : '' });
        return;
      }
      setForm({ ...form, [name]: checked });
      return;
    }
    
    // Validate deadline
    if (name === 'deadline') {
      setDeadlineError(null);
      const selectedDate = new Date(value);
      if (selectedDate < minDate) {
        setDeadlineError('Deadline must be at least 1 day from today.');
      } else if (selectedDate > maxDate) {
        setDeadlineError('Deadline cannot be more than 180 days from today.');
      }
    }
    
    setForm({ ...form, [name]: name === 'stipend' ? (value === '' ? '' : Number(value)) : value });
  }

  function addSkill() {
    if (currentSkill.trim() && !form.skills.includes(currentSkill.trim())) {
      setForm({ ...form, skills: [...form.skills, currentSkill.trim()] });
      setCurrentSkill('');
    }
  }

  function removeSkill(skillToRemove: string) {
    setForm({ ...form, skills: form.skills.filter(skill => skill !== skillToRemove) });
  }

  function addRequirement() {
    if (currentRequirement.trim() && !form.requirements.includes(currentRequirement.trim())) {
      setForm({ ...form, requirements: [...form.requirements, currentRequirement.trim()] });
      setCurrentRequirement('');
    }
  }

  function removeRequirement(reqToRemove: string) {
    setForm({ ...form, requirements: form.requirements.filter(req => req !== reqToRemove) });
  }

  function addBenefit() {
    if (currentBenefit.trim() && !form.benefits.includes(currentBenefit.trim())) {
      setForm({ ...form, benefits: [...form.benefits, currentBenefit.trim()] });
      setCurrentBenefit('');
    }
  }

  function removeBenefit(benefitToRemove: string) {
    setForm({ ...form, benefits: form.benefits.filter(benefit => benefit !== benefitToRemove) });
  }

  async function handleSubmit(e: React.FormEvent, saveAsDraft: boolean = false) {
    e.preventDefault();

    if (!isAuthenticated || !token) {
      setError("You must be logged in to post an internship.");
      navigate('/login');
      return;
    }

    // Validate deadline if not saving as draft
    if (!saveAsDraft && deadlineError) {
      setError('Please fix the deadline error before submitting.');
      return;
    }

    setSubmitted(true);
    setError(null);

    // Backend expects strings (comma-separated) for skills, requirements, benefits
    const internshipData = {
      // Required fields
      title: form.title,
      description: form.description,
      
      // Optional fields - backend expects strings, not arrays
      location: form.location,
      stipend: form.isUnpaid ? 0 : Number(form.stipend),
      duration: form.duration,
      type: form.type,
      level: form.level,
      category: form.category,
      
      // Convert arrays to comma-separated strings
      skills: form.skills.join(', '),
      requirements: form.requirements.join(', '),
      benefits: form.benefits.join(', '),
      
      // Dates
      deadline: form.deadline,
      date_posted: new Date().toISOString().split('T')[0],
      status: saveAsDraft ? 'Draft' : 'Active'
    };

    console.log('Sending internship data:', internshipData);

    try {
      const response = await fetch(`${API_URL}/api/v1/internships/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <-- Use the dynamic token from context
        },
        body: JSON.stringify(internshipData),
      });

      if (!response.ok) {
        // Handle server-side errors
        const errorData = await response.json();
        console.error('Backend error response:', errorData);
        
        let errorMessage = 'Failed to post internship.';
        
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            // FastAPI validation errors are arrays
            errorMessage = errorData.detail.map((err: any) => 
              `${err.loc?.join('.') || 'Field'}: ${err.msg}`
            ).join(', ');
          } else {
            errorMessage = JSON.stringify(errorData.detail);
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        
        throw new Error(errorMessage);
      }

      // Success!
      const result = await response.json();
      console.log('Internship posted successfully:', result);
      
      // Show success message based on draft status
      if (saveAsDraft) {
        setIsDraft(true);
      }
      
      setTimeout(() => navigate('/company/dashboard'), 1500);

    } catch (error: any) {
      console.error('Error posting internship:', error);
      setSubmitted(false); // Allow the user to try again
      const errorMessage = error.message || 'Failed to post internship. Please try again.';
      setError(errorMessage);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#63D7C7] mb-4">
            <Briefcase className="w-8 h-8 text-[#004F4D]" />
          </div>
          <h1 className="text-4xl font-bold text-[#FFFAF3] mb-2">Post an Internship</h1>
          <p className="text-[#FFFAF3]/80">Fill in the details to create a new internship opportunity</p>
        </motion.div>
        
        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}
        
        {submitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-[#FFFAF3] rounded-2xl shadow-xl border border-[#63D7C7]/20"
          >
            {isDraft ? (
              <div>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#63D7C7]/20 rounded-full mb-4">
                  <FileText className="w-10 h-10 text-[#1F7368]" />
                </div>
                <h2 className="text-2xl font-bold text-[#004F4D] mb-2">Draft Saved Successfully!</h2>
                <p className="text-[#1F7368]">You can publish it later from your dashboard.</p>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#004F4D] mb-2">Internship Posted Successfully!</h2>
                <p className="text-[#1F7368]">Applications will be accepted until {form.deadline}</p>
              </div>
            )}
            <div className="mt-6 text-[#1F7368]/70">Redirecting to dashboard...</div>
          </motion.div>
        ) : (
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
            
            {/* Basic Information Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#FFFAF3] rounded-2xl shadow-xl p-8 border border-[#63D7C7]/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#63D7C7] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#004F4D]" />
                </div>
                <h2 className="text-2xl font-bold text-[#004F4D]">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1F7368] mb-2">
                    Internship Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="title" 
                    value={form.title} 
                    onChange={handleChange} 
                    placeholder="e.g., Frontend Developer Intern" 
                    required 
                    className="w-full px-4 py-3 border-2 border-[#63D7C7]/30 rounded-xl focus:ring-2 focus:ring-[#1F7368] focus:border-[#1F7368] transition-all outline-none bg-white" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#1F7368] mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="companyName" 
                    value={form.companyName} 
                    onChange={handleChange} 
                    placeholder="Your Company Name" 
                    required 
                    className="w-full px-4 py-3 border-2 border-[#63D7C7]/30 rounded-xl focus:ring-2 focus:ring-[#1F7368] focus:border-[#1F7368] transition-all outline-none bg-white" 
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#1F7368] mb-2">
                    <MapPin className="w-4 h-4 text-[#1F7368]" />
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="location" 
                    value={form.location} 
                    onChange={handleChange} 
                    placeholder="e.g., Bangalore, Karnataka" 
                    required 
                    className="w-full px-4 py-3 border-2 border-[#63D7C7]/30 rounded-xl focus:ring-2 focus:ring-[#1F7368] focus:border-[#1F7368] transition-all outline-none bg-white" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#1F7368] mb-2">
                    Industry/Category <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="category" 
                    value={form.category} 
                    onChange={handleChange} 
                    placeholder="e.g., Technology, Healthcare" 
                    required 
                    className="w-full px-4 py-3 border-2 border-[#63D7C7]/30 rounded-xl focus:ring-2 focus:ring-[#1F7368] focus:border-[#1F7368] transition-all outline-none bg-white" 
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-semibold text-[#1F7368] mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  placeholder="Describe the internship role, responsibilities, and what the intern will learn..." 
                  required 
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-[#63D7C7]/30 rounded-xl focus:ring-2 focus:ring-[#1F7368] focus:border-[#1F7368] transition-all outline-none resize-none bg-white" 
                />
              </div>
            </motion.div>

            {/* Job Details Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#FFFAF3] rounded-2xl shadow-xl p-8 border border-[#63D7C7]/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#63D7C7] rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#004F4D]" />
                </div>
                <h2 className="text-2xl font-bold text-[#004F4D]">Job Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1F7368] mb-2">
                    Work Type <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="type" 
                    value={form.type} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-3 border-2 border-[#63D7C7]/30 rounded-xl focus:ring-2 focus:ring-[#1F7368] focus:border-[#1F7368] transition-all outline-none bg-white"
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#1F7368] mb-2">
                    Experience Level <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="level" 
                    value={form.level} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-3 border-2 border-[#63D7C7]/30 rounded-xl focus:ring-2 focus:ring-[#1F7368] focus:border-[#1F7368] transition-all outline-none bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#1F7368] mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="duration" 
                    value={form.duration} 
                    onChange={handleChange} 
                    placeholder="e.g., 3 months" 
                    required 
                    className="w-full px-4 py-3 border-2 border-[#63D7C7]/30 rounded-xl focus:ring-2 focus:ring-[#1F7368] focus:border-[#1F7368] transition-all outline-none bg-white" 
                  />
                </div>
              </div>
              
              {/* Stipend Section with Unpaid Option */}
              <div className="mt-6 p-6 bg-[#E8F5F3] rounded-xl border-2 border-[#63D7C7]/40">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-[#1F7368]" />
                  <label className="text-sm font-semibold text-[#004F4D]">
                    Compensation
                  </label>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="isUnpaid"
                      checked={form.isUnpaid}
                      onChange={handleChange}
                      className="w-5 h-5 text-[#1F7368] border-2 border-[#63D7C7] rounded focus:ring-2 focus:ring-[#1F7368] transition-all"
                    />
                    <span className="text-sm font-medium text-[#004F4D] group-hover:text-[#1F7368] transition-colors">
                      This is an unpaid internship
                    </span>
                  </label>
                </div>
                
                {!form.isUnpaid && (
                  <div>
                    <label className="block text-sm font-semibold text-[#1F7368] mb-2">
                      Stipend (₹/month) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1F7368] font-medium">₹</span>
                      <input 
                        type="number"
                        name="stipend" 
                        value={form.stipend} 
                        onChange={handleChange} 
                        placeholder="15000" 
                        required={!form.isUnpaid}
                        min="0"
                        className="w-full pl-8 pr-4 py-3 border-2 border-[#63D7C7]/30 rounded-xl focus:ring-2 focus:ring-[#1F7368] focus:border-[#1F7368] transition-all outline-none bg-white" 
                      />
                    </div>
                  </div>
                )}
                
                {form.isUnpaid && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      This internship will be listed as unpaid. Consider offering certificates or other benefits.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#1F7368] mb-2">
                  <Calendar className="w-4 h-4 text-[#1F7368]" />
                  Application Deadline <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-[#1F7368]/70">(Max 180 days from today)</span>
                </label>
                <input 
                  type="date"
                  name="deadline" 
                  value={form.deadline} 
                  onChange={handleChange}
                  min={minDateStr}
                  max={maxDateStr}
                  required 
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#1F7368] transition-all outline-none bg-white ${
                    deadlineError ? 'border-red-500 focus:border-red-500' : 'border-[#63D7C7]/30 focus:border-[#1F7368]'
                  }`}
                />
                {deadlineError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {deadlineError}
                  </p>
                )}
                <p className="mt-2 text-xs text-[#1F7368]/70 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Your internship will automatically be archived after this deadline passes.
                </p>
              </div>
            </motion.div>

            {/* Skills, Requirements & Benefits Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#FFFAF3] rounded-2xl shadow-xl p-8 border border-[#63D7C7]/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#63D7C7] rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#004F4D]" />
                </div>
                <h2 className="text-2xl font-bold text-[#004F4D]">Additional Details</h2>
              </div>
              
              {/* Skills Required */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-[#1F7368] mb-3">
                  Skills Required
                </label>
                <div className="flex gap-2 mb-3">
                  <input 
                    value={currentSkill} 
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill (e.g., React, JavaScript)" 
                    className="flex-1 px-4 py-3 border-2 border-[#63D7C7]/30 rounded-xl focus:ring-2 focus:ring-[#1F7368] focus:border-[#1F7368] transition-all outline-none bg-white" 
                  />
                  <button 
                    type="button" 
                    onClick={addSkill} 
                    className="px-6 py-3 bg-[#1F7368] text-white font-semibold rounded-xl hover:bg-[#004F4D] hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill, index) => (
                    <span key={index} className="bg-[#1F7368] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm hover:bg-[#004F4D] transition-colors">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-[#1F7368] mb-3">
                  Requirements
                </label>
                <div className="flex gap-2 mb-3">
                  <input 
                    value={currentRequirement} 
                    onChange={(e) => setCurrentRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                    placeholder="Add a requirement (e.g., Bachelor's degree in Computer Science)" 
                    className="flex-1 px-4 py-3 border-2 border-[#63D7C7]/30 rounded-xl focus:ring-2 focus:ring-[#1F7368] focus:border-[#1F7368] transition-all outline-none bg-white" 
                  />
                  <button 
                    type="button" 
                    onClick={addRequirement} 
                    className="px-6 py-3 bg-[#1F7368] text-white font-semibold rounded-xl hover:bg-[#004F4D] hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {form.requirements.map((req, index) => (
                    <div key={index} className="bg-[#E8F5F3] p-4 rounded-xl border-2 border-[#63D7C7]/30 flex justify-between items-center hover:border-[#1F7368] transition-all group">
                      <span className="text-sm text-[#004F4D]">{req}</span>
                      <button 
                        type="button" 
                        onClick={() => removeRequirement(req)} 
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-semibold text-[#1F7368] mb-3">
                  Benefits & Perks
                </label>
                <div className="flex gap-2 mb-3">
                  <input 
                    value={currentBenefit} 
                    onChange={(e) => setCurrentBenefit(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                    placeholder="Add a benefit (e.g., Flexible hours, Learning opportunities)" 
                    className="flex-1 px-4 py-3 border-2 border-[#63D7C7]/30 rounded-xl focus:ring-2 focus:ring-[#1F7368] focus:border-[#1F7368] transition-all outline-none bg-white" 
                  />
                  <button 
                    type="button" 
                    onClick={addBenefit} 
                    className="px-6 py-3 bg-[#1F7368] text-white font-semibold rounded-xl hover:bg-[#004F4D] hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {form.benefits.map((benefit, index) => (
                    <div key={index} className="bg-[#E8F5F3] p-4 rounded-xl border-2 border-[#63D7C7]/30 flex justify-between items-center hover:border-[#1F7368] transition-all group">
                      <span className="text-sm text-[#004F4D]">{benefit}</span>
                      <button 
                        type="button" 
                        onClick={() => removeBenefit(benefit)} 
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Terms and Submit */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#FFFAF3] rounded-2xl shadow-xl p-8 border border-[#63D7C7]/20"
            >
              <div className="flex items-start gap-3 mb-6 p-4 bg-[#E8F5F3] rounded-xl border-2 border-[#63D7C7]/40">
                <input
                  type="checkbox"
                  id="employer-terms"
                  checked={agreedToEmployerTerms}
                  onChange={e => setAgreedToEmployerTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-[#1F7368] border-2 border-[#63D7C7] rounded focus:ring-2 focus:ring-[#1F7368]"
                  required
                />
                <label htmlFor="employer-terms" className="text-sm text-[#004F4D]">
                  I confirm our company agrees to the I-Intern{' '}
                  <a
                    href="/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1F7368] font-semibold underline hover:text-[#63D7C7] transition-colors"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>

              <div className="flex flex-wrap gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={!agreedToEmployerTerms || !!deadlineError}
                  className="flex-1 min-w-[200px] px-8 py-4 bg-[#1F7368] text-white font-bold rounded-xl hover:bg-[#004F4D] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Post Internship
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button" 
                  onClick={(e: any) => handleSubmit(e, true)}
                  disabled={!agreedToEmployerTerms}
                  className="flex-1 min-w-[200px] px-8 py-4 bg-[#004F4D] text-white font-bold rounded-xl hover:bg-[#1F7368] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Save as Draft
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button" 
                  onClick={() => navigate('/company/dashboard')}
                  className="px-8 py-4 bg-white border-2 border-[#63D7C7] text-[#004F4D] font-bold rounded-xl hover:bg-[#E8F5F3] hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </form>
        )}
      </div>
    </div>
  );
}