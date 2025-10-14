import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { internshipService, InternshipResponse } from '@/services/internship.service';

export const EditInternshipPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [internship, setInternship] = useState<InternshipResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Utility function for consistent input styling
  const getInputClassName = (fieldName: string) => 
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F7368] ${
      errors[fieldName] ? 'border-red-500' : 'border-[#63D7C7]/30'
    }`;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    stipend: 0,
    duration: '',
    type: '',
    level: '',
    category: '',
    requirements: '',
    skills: '',
    benefits: '',
    deadline: '',
    status: 'Active' as 'Active' | 'Closed' | 'Draft'
  });

  useEffect(() => {
    // Fetch the internship to edit
    const fetchInternship = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await internshipService.getCompanyInternshipById(id);
        setInternship(data);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          stipend: data.stipend || 0,
          duration: data.duration || '',
          type: data.type || '',
          level: data.level || 'Beginner',
          category: data.category || '',
          requirements: data.requirements || '',
          skills: data.skills || '',
          benefits: data.benefits || '',
          deadline: data.deadline ? data.deadline.split('T')[0] : '',
          status: (data.status as 'Active' | 'Closed' | 'Draft') || 'Active'
        });
      } catch (error) {
        console.error('Error fetching internship:', error);
        // Show error notification
        const notification = document.createElement('div');
        notification.textContent = '❌ Failed to load internship data. Please try again.';
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
          navigate('/company/internships');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stipend' || name === 'companyRating' ? (value === '' ? 0 : parseFloat(value)) : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Only validate required fields strictly if status is Active
    const isActivating = formData.status === 'Active';
    
    console.log('Validating form. Status:', formData.status, 'Is activating:', isActivating);
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (isActivating && !formData.description.trim()) newErrors.description = 'Description is required';
    if (isActivating && !formData.location.trim()) newErrors.location = 'Location is required';
    // Allow stipend of 0 for unpaid internships
    if (isActivating && formData.stipend < 0) newErrors.stipend = 'Stipend cannot be negative';
    if (isActivating && !formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (isActivating && !formData.type.trim()) newErrors.type = 'Type is required';
    if (isActivating && !formData.level.trim()) newErrors.level = 'Experience level is required';
    if (isActivating && !formData.category.trim()) newErrors.category = 'Category is required';
    if (isActivating && !formData.deadline) newErrors.deadline = 'Application deadline is required';
    
    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    console.log('Attempting to save internship with status:', formData.status);
    console.log('Form data:', formData);
    
    if (!validateForm() || !id) {
      console.log('Validation failed or no ID');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Sending update to API...');
      // Update internship via API
      await internshipService.partialUpdateInternship(id, {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        stipend: formData.stipend,
        duration: formData.duration,
        type: formData.type,
        level: formData.level,
        category: formData.category,
        requirements: formData.requirements,
        skills: formData.skills,
        benefits: formData.benefits,
        deadline: formData.deadline,
        status: formData.status
      });
      
      // Show success notification
      const notification = document.createElement('div');
      notification.textContent = '✅ Internship updated successfully!';
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
        navigate('/company/internships');
      }, 2000);
      
    } catch (error) {
      console.error('Error updating internship:', error);
      const notification = document.createElement('div');
      const errorMessage = error instanceof Error ? error.message : 'Failed to update internship. Please try again.';
      notification.textContent = `❌ ${errorMessage}`;
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#63D7C7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[#FFFAF3] mb-2">Loading Internship</h2>
          <p className="text-[#E8F5F3]">Please wait while we fetch the internship details...</p>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Internship Not Found</h2>
          <p className="text-gray-600 mb-6">The internship you're trying to edit doesn't exist.</p>
          <Button onClick={() => navigate('/company/internships')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Internships
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/company/internships')}
              className="text-[#FFFAF3] hover:text-[#E8F5F3] hover:bg-[#1F7368]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Internships
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-[#FFFAF3]">Edit Internship</h1>
              <p className="text-[#E8F5F3]">Update internship details and requirements</p>
            </div>
          </div>
          <Badge
            className={internship.status === 'Active' ? 'bg-[#1F7368] text-white' : 
                     internship.status === 'Draft' ? 'bg-[#63D7C7] text-[#004F4D]' : 
                     'bg-[#E8F5F3] text-[#004F4D]'}
          >
            {internship.status}
          </Badge>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-[#FFFAF3] border-[#63D7C7]/20">
            <CardHeader>
              <CardTitle className="text-[#004F4D]">Internship Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={getInputClassName('title')}
                    placeholder="e.g., Frontend Developer Intern"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Bangalore, Karnataka"
                  />
                  {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stipend (₹/month) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1F7368] font-medium">₹</span>
                    <input
                      type="number"
                      name="stipend"
                      value={formData.stipend}
                      onChange={handleInputChange}
                      className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.stipend ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 15000"
                    />
                  </div>
                  {errors.stipend && <p className="mt-1 text-sm text-red-600">{errors.stipend}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.duration ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 3 months"
                  />
                  {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Type</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                  {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level *
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.level ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category/Industry *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Technology, Healthcare"
                  />
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.deadline ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the internship opportunity..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements (one per line)
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g.,&#10;Bachelor's degree in Computer Science&#10;Knowledge of React.js&#10;Strong problem-solving skills"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills (one per line)
                </label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g.,&#10;JavaScript&#10;React.js&#10;Node.js&#10;Git"
                />
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits & Perks (one per line)
                </label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g.,&#10;Flexible working hours&#10;Learning opportunities&#10;Mentorship program&#10;Certificate of completion"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/company/internships')}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};