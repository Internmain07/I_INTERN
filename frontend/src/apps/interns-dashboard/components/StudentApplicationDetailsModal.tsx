import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Briefcase,
  GraduationCap,
  Star,
  MapPin,
  Building2,
  DollarSign,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

interface StudentProfile {
  university?: string | null;
  major?: string | null;
  graduation_year?: string | null;
  grading_type?: string | null;
  grading_score?: string | null;
  bio?: string | null;
  skills?: string[] | null;
}

interface WorkExperience {
  id: number;
  company: string;
  position: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
}

interface Project {
  id: number;
  title: string;
  description: string | null;
  technologies: string[];
  start_date: string | null;
  end_date: string | null;
  github_url: string | null;
  live_demo_url: string | null;
}

interface Application {
  id: string;
  application_id: string;
  title: string;
  position: string;
  company: string;
  location: string;
  stipend: number;
  salary: string;
  duration: string;
  type: string;
  status: string;
  application_date: string;
  offer_sent_date?: string;
  student_profile?: StudentProfile;
  work_experiences?: WorkExperience[];
  projects?: Project[];
}

interface StudentApplicationDetailsModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentApplicationDetailsModal: React.FC<StudentApplicationDetailsModalProps> = ({
  application,
  isOpen,
  onClose,
}) => {
  if (!application) return null;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('offer') && !statusLower.includes('reject')) return 'bg-purple-100 text-purple-700 border-purple-300';
    if (statusLower === 'accepted') return 'bg-green-100 text-green-700 border-green-300';
    if (statusLower.includes('review')) return 'bg-blue-100 text-blue-700 border-blue-300';
    if (statusLower === 'rejected' || statusLower === 'declined') return 'bg-red-100 text-red-700 border-red-300';
    if (statusLower === 'pending' || statusLower === 'applied') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
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
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#004F4D] via-[#1F7368] to-[#004F4D] text-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Application Details</h2>
                    <p className="text-[#63D7C7] text-sm">Applied for: {application.title}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-[#63D7C7] transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="space-y-6">
                  {/* Application Information */}
                  <Card className="border-[#63D7C7]/30">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-[#004F4D]">
                        <Calendar className="w-5 h-5 text-[#1F7368]" />
                        <span>Application Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-[#1F7368]">Application Date</label>
                        <p className="text-[#004F4D]">{formatDate(application.application_date)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-[#1F7368]">Status</label>
                        <Badge className={`${getStatusColor(application.status)} border mt-1`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-[#1F7368]">Position Applied</label>
                        <p className="text-[#004F4D]">{application.position}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-[#1F7368]">Applicant ID</label>
                        <p className="text-[#004F4D] font-mono text-sm">#{application.application_id.slice(0, 20)}...</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-[#1F7368]">Company</label>
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-[#1F7368]" />
                          <p className="text-[#004F4D]">{application.company}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-[#1F7368]">Location</label>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-[#1F7368]" />
                          <p className="text-[#004F4D]">{application.location}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-[#1F7368]">Stipend</label>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-[#1F7368]" />
                          <p className="text-[#004F4D]">{application.salary || 'Not specified'}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-[#1F7368]">Duration</label>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-[#1F7368]" />
                          <p className="text-[#004F4D]">{application.duration}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Education */}
                  <Card className="border-[#63D7C7]/30">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-[#004F4D]">
                        <GraduationCap className="w-5 h-5 text-[#1F7368]" />
                        <span>Education</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-[#1F7368]">University</label>
                          <p className="text-[#004F4D]">
                            {application.student_profile?.university || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#1F7368]">Major/Field of Study</label>
                          <p className="text-[#004F4D]">
                            {application.student_profile?.major || 'Not specified'}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-[#1F7368]">Expected Graduation</label>
                          <p className="text-[#004F4D]">
                            {application.student_profile?.graduation_year || 'Not specified'}
                          </p>
                        </div>
                        {application.student_profile?.grading_type && application.student_profile?.grading_score && (
                          <div>
                            <label className="text-sm font-medium text-[#1F7368]">
                              {application.student_profile.grading_type}
                            </label>
                            <p className="text-[#004F4D] font-semibold">
                              {application.student_profile.grading_score}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Work Experience */}
                  <Card className="border-[#63D7C7]/30">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-[#004F4D]">
                        <Briefcase className="w-5 h-5 text-[#1F7368]" />
                        <span>Work Experience</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {application.work_experiences && application.work_experiences.length > 0 ? (
                        <div className="space-y-4">
                          {application.work_experiences.map((exp, idx) => (
                            <div key={exp.id} className={`${idx > 0 ? 'pt-4 border-t border-[#63D7C7]/20' : ''}`}>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h5 className="font-semibold text-[#004F4D]">{exp.position}</h5>
                                  <p className="text-sm text-[#1F7368] font-medium">{exp.company}</p>
                                </div>
                                <p className="text-sm text-[#1F7368]/70">
                                  {exp.start_date ? new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'} -{' '}
                                  {exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                                </p>
                              </div>
                              {exp.description && (
                                <p className="text-sm text-[#004F4D]/80 mt-2 leading-relaxed whitespace-pre-wrap">
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[#1F7368]/60 italic text-sm">No work experience added</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Projects */}
                  {application.projects && application.projects.length > 0 && (
                    <Card className="border-[#63D7C7]/30">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-[#004F4D]">
                          <Star className="w-5 h-5 text-[#1F7368]" />
                          <span>Projects</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {application.projects.map((project, idx) => (
                            <div key={project.id} className={`${idx > 0 ? 'pt-4 border-t border-[#63D7C7]/20' : ''}`}>
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-semibold text-[#004F4D]">{project.title}</h5>
                                <div className="flex gap-2">
                                  {project.github_url && (
                                    <a
                                      href={project.github_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs px-2 py-1 bg-[#1F7368]/10 hover:bg-[#1F7368]/20 rounded text-[#1F7368] transition-colors"
                                    >
                                      GitHub
                                    </a>
                                  )}
                                  {project.live_demo_url && (
                                    <a
                                      href={project.live_demo_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs px-2 py-1 bg-[#63D7C7]/10 hover:bg-[#63D7C7]/20 rounded text-[#1F7368] transition-colors"
                                    >
                                      Live Demo
                                    </a>
                                  )}
                                </div>
                              </div>
                              {project.description && (
                                <p className="text-sm text-[#004F4D]/80 mt-2 leading-relaxed whitespace-pre-wrap">
                                  {project.description}
                                </p>
                              )}
                              {project.technologies && project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {project.technologies.map((tech, techIdx) => (
                                    <span
                                      key={techIdx}
                                      className="px-2 py-1 bg-[#63D7C7]/10 text-[#004F4D] text-xs rounded border border-[#63D7C7]/30"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Technical Skills */}
                  <Card className="border-[#63D7C7]/30">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-[#004F4D]">
                        <Star className="w-5 h-5 text-[#1F7368]" />
                        <span>Technical Skills</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {application.student_profile?.skills && application.student_profile.skills.length > 0 ? (
                          application.student_profile.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-[#63D7C7] text-[#004F4D] bg-[#63D7C7]/10 px-3 py-1.5"
                            >
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-[#1F7368]/60 italic text-sm">No skills information available</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-[#63D7C7]/20 bg-[#FFFAF3] p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#1F7368]">
                    Application ID: #{application.application_id.slice(0, 30)}... • Applied {formatDate(application.application_date)}
                  </p>
                  <Button
                    onClick={onClose}
                    className="bg-[#1F7368] hover:bg-[#004F4D] text-white"
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
