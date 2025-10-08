import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext"; // Correct path to AuthContext

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface InternshipFormData {
  title: string;
  description: string;
  location: string;
  stipend: string;
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
  companyRating: number;
  industry: string;
}

const initialForm: InternshipFormData = {
  title: "",
  description: "",
  location: "",
  stipend: "",
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
  companyRating: 4.0,
  industry: ""
};


export default function PostInternshipPage() {
  const { token, isAuthenticated } = useAuth(); // <-- Get token and auth status from context
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [agreedToEmployerTerms, setAgreedToEmployerTerms] = useState(false);
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [currentBenefit, setCurrentBenefit] = useState('');
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'stipend' || name === 'companyRating' ? (value === '' ? '' : Number(value)) : value });
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isAuthenticated || !token) {
      alert("You must be logged in to post an internship.");
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    setSubmitted(true);

    // Backend expects strings (comma-separated) for skills, requirements, benefits
    const internshipData = {
      // Required fields
      title: form.title,
      description: form.description,
      
      // Optional fields - backend expects strings, not arrays
      location: form.location,
      stipend: Number(form.stipend),
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
      status: 'Active'
    };

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
        throw new Error(errorData.detail || 'Failed to post internship.');
      }

      // Success!
      console.log('Internship posted successfully:', await response.json());
      setTimeout(() => navigate('/company/dashboard'), 1200);

    } catch (error: any) {
      console.error('Error posting internship:', error);
      setSubmitted(false); // Allow the user to try again
      alert(`Error: ${error.message}`); // Show an error message to the user
    }
  }

  return (
    // ... Your existing JSX remains unchanged ...
    <div className="max-w-4xl mx-auto p-6 bg-[#FFFAF3] rounded-xl shadow-md border-2 border-[#63D7C7]">
      <h1 className="text-3xl font-bold mb-6 text-[#004F4D]">Post New Internship</h1>
      {submitted ? (
        <div className="text-[#1F7368] font-semibold text-center py-8 bg-[#63D7C7]/10 rounded-lg border-2 border-[#63D7C7]">
          <div className="text-2xl mb-2">✅ Internship posted successfully!</div>
          <div>Redirecting to dashboard...</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg border-2 border-[#63D7C7]/30">
                        <h2 className="text-xl font-semibold mb-4 text-[#004F4D]">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#004F4D] mb-2">Internship Title *</label>
                <input 
                  name="title" 
                  value={form.title} 
                  onChange={handleChange} 
                  placeholder="e.g., Frontend Developer Intern" 
                  required 
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#004F4D] mb-2">Company Name *</label>
                <input 
                  name="companyName" 
                  value={form.companyName} 
                  onChange={handleChange} 
                  placeholder="Your Company Name" 
                  required 
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#004F4D] mb-2">Location *</label>
                <input 
                  name="location" 
                  value={form.location} 
                  onChange={handleChange} 
                  placeholder="e.g., Bangalore, Karnataka" 
                  required 
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#004F4D] mb-2">Industry/Category *</label>
                <input 
                  name="category" 
                  value={form.category} 
                  onChange={handleChange} 
                  placeholder="e.g., Technology, Healthcare, Finance" 
                  required 
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#004F4D] mb-2">Description *</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Describe the internship role, responsibilities, and what the intern will learn..." 
                required 
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-white p-6 rounded-lg border-2 border-[#63D7C7]/30">
            <h2 className="text-xl font-semibold mb-4 text-[#004F4D]">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#004F4D] mb-2">Work Type *</label>
                <select 
                  name="type" 
                  value={form.type} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#004F4D] mb-2">Experience Level *</label>
                <select 
                  name="level" 
                  value={form.level} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#004F4D] mb-2">Duration *</label>
                <input 
                  name="duration" 
                  value={form.duration} 
                  onChange={handleChange} 
                  placeholder="e.g., 3 months, 6 months" 
                  required 
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#004F4D] mb-2">Stipend (₹/month) *</label>
                <input 
                  type="number"
                  name="stipend" 
                  value={form.stipend} 
                  onChange={handleChange} 
                  placeholder="e.g., 15000" 
                  required 
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#004F4D] mb-2">Application Deadline *</label>
                <input 
                  type="date"
                  name="deadline" 
                  value={form.deadline} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#004F4D] mb-2">Company Rating</label>
                <input 
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  name="companyRating" 
                  value={form.companyRating} 
                  onChange={handleChange} 
                  placeholder="4.5" 
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>
          </div>

          {/* Skills Required */}
          <div className="bg-white p-6 rounded-lg border-2 border-[#63D7C7]/30">
            <h2 className="text-xl font-semibold mb-4 text-[#004F4D]">Skills Required</h2>
            <div className="flex gap-2 mb-3">
              <input 
                value={currentSkill} 
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill (e.g., React, JavaScript)" 
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
              <button type="button" onClick={addSkill} className="bg-[#1F7368] text-white px-4 py-2 rounded-md hover:bg-[#004F4D] transition-colors">
                Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skills.map((skill, index) => (
                <span key={index} className="bg-[#63D7C7]/20 text-[#004F4D] px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-[#63D7C7]">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="text-blue-600 hover:text-blue-800">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white p-6 rounded-lg border-2 border-[#63D7C7]/30">
            <h2 className="text-xl font-semibold mb-4 text-[#004F4D]">Requirements</h2>
            <div className="flex gap-2 mb-3">
              <input 
                value={currentRequirement} 
                onChange={(e) => setCurrentRequirement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                placeholder="Add a requirement (e.g., Bachelor's degree in Computer Science)" 
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
              <button type="button" onClick={addRequirement} className="bg-[#1F7368] text-white px-4 py-2 rounded-md hover:bg-[#004F4D] transition-colors">
                Add
              </button>
            </div>
            <div className="space-y-2">
              {form.requirements.map((req, index) => (
                <div key={index} className="bg-white p-3 rounded border flex justify-between items-center">
                  <span className="text-sm">{req}</span>
                  <button type="button" onClick={() => removeRequirement(req)} className="text-red-600 hover:text-red-800">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white p-6 rounded-lg border-2 border-[#63D7C7]/30">
            <h2 className="text-xl font-semibold mb-4 text-[#004F4D]">Benefits & Perks</h2>
            <div className="flex gap-2 mb-3">
              <input 
                value={currentBenefit} 
                onChange={(e) => setCurrentBenefit(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                placeholder="Add a benefit (e.g., Flexible working hours, Learning opportunities)" 
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
              <button type="button" onClick={addBenefit} className="bg-[#1F7368] text-white px-4 py-2 rounded-md hover:bg-[#004F4D] transition-colors">
                Add
              </button>
            </div>
            <div className="space-y-2">
              {form.benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-3 rounded border flex justify-between items-center">
                  <span className="text-sm">{benefit}</span>
                  <button type="button" onClick={() => removeBenefit(benefit)} className="text-red-600 hover:text-red-800">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Terms and Submit */}
          <div className="bg-white p-6 rounded-lg border-2 border-[#63D7C7]/30">
            <div className="flex items-center gap-3 mb-6">
              <input
                type="checkbox"
                id="employer-terms"
                checked={agreedToEmployerTerms}
                onChange={e => setAgreedToEmployerTerms(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label htmlFor="employer-terms" className="text-sm text-[#004F4D]">
                I confirm our company agrees to the I-Intern{' '}
                <a
                  href="/employer-terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Employer Terms of Service
                </a>
              </label>
            </div>

            <div className="flex gap-4">
              <button 
                type="submit" 
                disabled={!agreedToEmployerTerms}
                className="bg-gradient-to-r from-[#1F7368] to-[#004F4D] text-white px-8 py-3 rounded-md font-semibold hover:from-[#004F4D] hover:to-[#003836] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Post Internship
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/company/dashboard')}
                className="bg-[#FFFAF3] text-[#004F4D] px-8 py-3 rounded-md font-semibold hover:bg-[#63D7C7]/20 border-2 border-[#63D7C7] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}