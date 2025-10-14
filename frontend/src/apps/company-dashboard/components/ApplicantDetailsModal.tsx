import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  Calendar, 
  Briefcase,
  GraduationCap,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Star,
  User,
  Phone,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { formatDate, getStatusColor } from '@/shared/lib/utils';
import { Applicant } from '@/shared/types';

interface ApplicantDetailsModalProps {
  applicant: Applicant | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: (applicantId: string, newStatus: Applicant['status']) => void;
}

export const ApplicantDetailsModal: React.FC<ApplicantDetailsModalProps> = ({
  applicant,
  isOpen,
  onClose,
  onStatusUpdate,
}) => {
  if (!applicant) return null;

  const handleStatusUpdate = (newStatus: Applicant['status']) => {
    if (onStatusUpdate) {
      onStatusUpdate(applicant.id, newStatus);
    }
    
    // Show success notification
    const statusMessages = {
      'Applied': 'Application received! 📥',
      'Under Review': 'Application moved to review! 👀',
      'Offered': 'Offer letter sent! ✉️',
      'Offer Accepted': 'Offer accepted by candidate! ✅',
      'Offer Rejected': 'Offer declined by candidate! ❌',
      'Hired': 'Candidate successfully hired! 🎉',
      'Rejected': 'Application rejected! ❌'
    };

    const message = statusMessages[newStatus] || 'Status updated!';
    
    if (typeof document !== 'undefined') {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.className = 'fixed top-4 right-4 bg-teal-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  };

  const handleSendOfferLetter = () => {
    // First update status to 'Offered'
    if (onStatusUpdate) {
      onStatusUpdate(applicant.id, 'Offered');
    }
    
    // Show success notification
    if (typeof document !== 'undefined') {
      const notification = document.createElement('div');
      notification.textContent = '✉️ Offer letter sent to candidate! They will receive a notification.';
      notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-md shadow-lg z-50 max-w-sm';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 5000);
    }

    // In a real app, this would:
    // 1. Send notification to intern's dashboard
    // 2. Create offer letter record
    // 3. Set response deadline
    // 4. Send email notification
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Applied':
        return <Clock className="w-4 h-4" />;
      case 'Under Review':
        return <AlertCircle className="w-4 h-4" />;
      case 'Offered':
        return <Mail className="w-4 h-4" />;
      case 'Offer Accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'Offer Rejected':
        return <XCircle className="w-4 h-4" />;
      case 'Hired':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleDownloadResume = () => {
    if (applicant.resumeUrl) {
      // Create a temporary link to download the resume
      const link = document.createElement('a');
      link.href = applicant.resumeUrl;
      link.download = `${applicant.name}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Show notification that resume is not available
      const notification = document.createElement('div');
      notification.textContent = '📄 Resume not available for this applicant';
      notification.className = 'fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {applicant.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{applicant.name}</h2>
                      {/* Only show contact details if offer has been accepted */}
                      {applicant.canViewContactDetails ? (
                        <>
                          <p className="text-teal-100 flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{applicant.email}</span>
                          </p>
                          {applicant.phone && (
                            <p className="text-teal-100 flex items-center space-x-1 mt-1">
                              <Phone className="w-4 h-4" />
                              <span>{applicant.phone}</span>
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-teal-100 flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>Contact details will be available after offer acceptance</span>
                        </p>
                      )}
                      <p className="text-teal-100 flex items-center space-x-1 mt-1">
                        <Briefcase className="w-4 h-4" />
                        <span>Applied for: {applicant.internshipTitle}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={`${getStatusColor(applicant.status)} text-white`}
                    >
                      {getStatusIcon(applicant.status)}
                      <span className="ml-1">{applicant.status}</span>
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="text-white hover:bg-white hover:bg-opacity-20"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Application Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-teal-600" />
                          <span>Application Information</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Application Date</label>
                            <p className="text-gray-900">{formatDate(applicant.applicationDate)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Status</label>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(applicant.status)}>
                                {getStatusIcon(applicant.status)}
                                <span className="ml-1">{applicant.status}</span>
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Position Applied</label>
                            <p className="text-gray-900">{applicant.internshipTitle}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Applicant ID</label>
                            <p className="text-gray-900 font-mono text-sm">#{applicant.id}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Profile & Bio Section */}
                    {(applicant.bio || applicant.linkedin || applicant.github || applicant.portfolio) && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-teal-600" />
                            <span>Student Profile</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {applicant.bio && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">About</label>
                              <p className="text-sm text-gray-700 mt-1 leading-relaxed">{applicant.bio}</p>
                            </div>
                          )}
                          
                          {(applicant.linkedin || applicant.github || applicant.portfolio) && (
                            <div>
                              <label className="text-sm font-medium text-gray-500 mb-2 block">Professional Links</label>
                              <div className="flex flex-wrap gap-2">
                                {applicant.linkedin && (
                                  <a
                                    href={applicant.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors border border-blue-200"
                                  >
                                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                    LinkedIn Profile
                                  </a>
                                )}
                                {applicant.github && (
                                  <a
                                    href={applicant.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors border border-gray-300"
                                  >
                                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                    GitHub Profile
                                  </a>
                                )}
                                {applicant.portfolio && (
                                  <a
                                    href={applicant.portfolio}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-2 text-sm bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-md transition-colors border border-teal-200"
                                  >
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                    Portfolio Website
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Education Section - Full Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <GraduationCap className="w-5 h-5 text-teal-600" />
                          <span>Education</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">University</label>
                              <p className="text-gray-900 font-medium">{applicant.university || 'Not specified'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Major/Field of Study</label>
                              <p className="text-gray-900 font-medium">{applicant.major || 'Not specified'}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Expected Graduation</label>
                              <p className="text-gray-900">{applicant.graduation_year || 'Not specified'}</p>
                            </div>
                            {applicant.grading_type && applicant.grading_score && (
                              <div>
                                <label className="text-sm font-medium text-gray-500">{applicant.grading_type}</label>
                                <p className="text-gray-900 font-semibold">{applicant.grading_score}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Work Experience Section - Full Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Briefcase className="w-5 h-5 text-teal-600" />
                          <span>Work Experience</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {applicant.work_experiences && applicant.work_experiences.length > 0 ? (
                          <div className="space-y-4">
                            {applicant.work_experiences.map((exp, idx) => (
                              <div key={exp.id} className={`${idx > 0 ? 'pt-4 border-t' : ''}`}>
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h5 className="font-semibold text-gray-900">{exp.position}</h5>
                                    <p className="text-sm text-teal-600 font-medium">{exp.company}</p>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {exp.start_date ? new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'} -{' '}
                                    {exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                                  </p>
                                </div>
                                {exp.description && (
                                  <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic text-sm">No work experience added</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Projects Section - Full Details */}
                    {applicant.projects && applicant.projects.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-teal-600" />
                            <span>Projects</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {applicant.projects.map((project, idx) => (
                              <div key={project.id} className={`${idx > 0 ? 'pt-4 border-t' : ''}`}>
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-semibold text-gray-900">{project.title}</h5>
                                  <div className="flex gap-2">
                                    {project.github_url && (
                                      <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                                      >
                                        <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                        GitHub
                                      </a>
                                    )}
                                    {project.live_demo_url && (
                                      <a
                                        href={project.live_demo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs px-2 py-1 bg-teal-100 hover:bg-teal-200 rounded text-teal-700 transition-colors"
                                      >
                                        Live Demo
                                      </a>
                                    )}
                                  </div>
                                </div>
                                {project.description && (
                                  <p className="text-sm text-gray-700 mb-2 leading-relaxed">{project.description}</p>
                                )}
                                {project.technologies && project.technologies.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {project.technologies.map((tech, techIdx) => (
                                      <span
                                        key={techIdx}
                                        className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {(project.start_date || project.end_date) && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    {project.start_date ? new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} 
                                    {project.start_date && project.end_date && ' - '}
                                    {project.end_date ? new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Skills */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-teal-600" />
                          <span>Technical Skills</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {applicant.skills && applicant.skills.length > 0 ? (
                            applicant.skills.map((skill, index) => (
                              <Badge 
                                key={index}
                                variant="outline" 
                                className="border-teal-200 text-teal-700 bg-teal-50 px-3 py-1.5"
                              >
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-gray-500 italic text-sm">No skills information available</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    
                    {/* Quick Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          onClick={handleDownloadResume}
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Resume
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Status Management & Workflow Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Application Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Current Status Display */}
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Current Status</p>
                          <p className="font-medium text-gray-900">{applicant.status}</p>
                        </div>

                        {/* Workflow Actions based on current status */}
                        {applicant.status === 'Applied' && (
                          <Button
                            variant="outline"
                            onClick={() => handleStatusUpdate('Under Review')}
                            className="w-full"
                          >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Start Review Process
                          </Button>
                        )}

                        {applicant.status === 'Under Review' && (
                          <>
                            <Button
                              variant="default"
                              onClick={() => handleSendOfferLetter()}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Send Offer Letter
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleStatusUpdate('Rejected')}
                              className="w-full bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject Application
                            </Button>
                          </>
                        )}

                        {applicant.status === 'Offered' && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                              ✉️ Offer letter sent on {applicant.offerSentDate ? formatDate(applicant.offerSentDate) : 'N/A'}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              Waiting for candidate response...
                            </p>
                          </div>
                        )}

                        {applicant.status === 'Offer Accepted' && (
                          <Button
                            variant="default"
                            onClick={() => handleStatusUpdate('Hired')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm Hiring
                          </Button>
                        )}

                        {applicant.status === 'Offer Rejected' && (
                          <div className="p-3 bg-red-50 rounded-lg">
                            <p className="text-sm text-red-700">
                              ❌ Candidate declined the offer
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                              Application closed
                            </p>
                          </div>
                        )}

                        {applicant.status === 'Hired' && (
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-700">
                              ✅ Candidate successfully hired!
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              Contact details are now available
                            </p>
                          </div>
                        )}

                        {applicant.status === 'Rejected' && (
                          <div className="p-3 bg-red-50 rounded-lg">
                            <p className="text-sm text-red-700">
                              ❌ Application rejected
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                              Application closed
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Application Timeline */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Application Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {/* Application Submitted */}
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium">Application Submitted</p>
                              <p className="text-xs text-gray-500">{formatDate(applicant.applicationDate)}</p>
                            </div>
                          </div>
                          
                          {/* Under Review */}
                          {['Under Review', 'Offered', 'Offer Accepted', 'Offer Rejected', 'Hired', 'Rejected'].includes(applicant.status) && (
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <div>
                                <p className="text-sm font-medium">Review Started</p>
                                <p className="text-xs text-gray-500">Application under evaluation</p>
                              </div>
                            </div>
                          )}

                          {/* Offer Sent */}
                          {['Offered', 'Offer Accepted', 'Offer Rejected', 'Hired'].includes(applicant.status) && (
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <div>
                                <p className="text-sm font-medium">Offer Letter Sent</p>
                                <p className="text-xs text-gray-500">
                                  {applicant.offerSentDate ? formatDate(applicant.offerSentDate) : 'Offer sent to candidate'}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Offer Response */}
                          {applicant.status === 'Offer Accepted' && (
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <div>
                                <p className="text-sm font-medium">Offer Accepted</p>
                                <p className="text-xs text-gray-500">
                                  {applicant.offerResponseDate ? formatDate(applicant.offerResponseDate) : 'Candidate accepted offer'}
                                </p>
                              </div>
                            </div>
                          )}

                          {applicant.status === 'Offer Rejected' && (
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <div>
                                <p className="text-sm font-medium">Offer Declined</p>
                                <p className="text-xs text-gray-500">
                                  {applicant.offerResponseDate ? formatDate(applicant.offerResponseDate) : 'Candidate declined offer'}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Final Status */}
                          {applicant.status === 'Hired' && (
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                              <div>
                                <p className="text-sm font-medium">Successfully Hired</p>
                                <p className="text-xs text-gray-500">Candidate onboarded</p>
                              </div>
                            </div>
                          )}

                          {applicant.status === 'Rejected' && (
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <div>
                                <p className="text-sm font-medium">Application Rejected</p>
                                <p className="text-xs text-gray-500">Application closed</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t bg-gray-50 px-6 py-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Application ID: #{applicant.id} • Applied {formatDate(applicant.applicationDate)}
                  </p>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};