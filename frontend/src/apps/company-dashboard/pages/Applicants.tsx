import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Eye,
  FileText,
  MessageSquare,
  UserCheck,
  Clock,
  GraduationCap,
  Briefcase,
  Users,
  CheckCircle,
} from 'lucide-react';
import { DataTable, Column } from '../components/data-table/DataTable';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { formatDate, getStatusColor } from '@/shared/lib/utils';
import { applicationService } from '@/services/application.service';
import { ApplicantDetailsModal } from '../components/ApplicantDetailsModal';
import type { Applicant } from '@/shared/types';

interface ApiApplicant {
  application_id: string;
  applicant_id: string;  // Changed to string to match backend
  name: string | null;
  email: string | null;  // Can be null if contact details not visible
  phone: string | null;
  university: string | null;
  major: string | null;
  graduation_year: string | null;
  grading_type?: string | null;
  grading_score?: string | null;
  bio?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  skills: string[] | null;  // Can be null
  work_experiences?: Array<{
    id: number;
    company: string;
    position: string;
    start_date: string | null;
    end_date: string | null;
    description: string | null;
  }>;
  projects?: Array<{
    id: number;
    title: string;
    description: string | null;
    technologies: string[];
    start_date: string | null;
    end_date: string | null;
    github_url: string | null;
    live_demo_url: string | null;
  }>;
  match_percentage: number;
  match_score: string;
  skill_match?: number;
  matching_skills?: string[];
  missing_skills?: string[];
  status: string;
  applied_date: string | null;
  internship_title: string;
  internship_id: string;
  can_view_contact_details?: boolean;  // Backend flag for contact visibility
  offer_sent_date?: string | null;
  offer_response_date?: string | null;
  hired_date?: string | null;
}

export const Applicants: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const response: ApiApplicant[] = await applicationService.getAllCompanyApplicants();
      console.log('DEBUG: Fetched applicants from API:', response);
      
      // Transform API response to match frontend Applicant interface
      const transformedApplicants: Applicant[] = response.map(app => {
        const transformedStatus = app.status.toLowerCase().includes('review') ? 'Under Review' : 
                app.status.toLowerCase() === 'accepted' || app.status.toLowerCase() === 'offer accepted' || app.status.toLowerCase() === 'offer_accepted' ? 'Offer Accepted' :
                app.status.toLowerCase() === 'offered' ? 'Offered' : 
                app.status.toLowerCase() === 'rejected' ? 'Rejected' : 
                app.status.toLowerCase() === 'hired' ? 'Hired' :
                'Applied';
        
        console.log(`DEBUG: Transforming applicant ${app.application_id} status from "${app.status}" to "${transformedStatus}"`);
        
        return {
          id: String(app.application_id),
          name: app.name || (app.email ? app.email.split('@')[0] : 'Anonymous'),
          email: app.email || 'Contact details protected',  // Show placeholder if not visible
          phone: app.phone || undefined,
          internshipTitle: app.internship_title,
          internshipId: String(app.internship_id),
          skills: app.skills || [],
          university: app.university || 'Not specified',
          major: app.major || undefined,
          graduation_year: app.graduation_year || undefined,
          bio: app.bio || undefined,
          linkedin: app.linkedin || undefined,
          github: app.github || undefined,
          portfolio: app.portfolio || undefined,
          grading_type: app.grading_type || undefined,
          grading_score: app.grading_score || undefined,
          work_experiences: app.work_experiences || [],
          projects: app.projects || [],
          education: app.major ? `${app.major} - ${app.university || 'Not specified'}` : (app.university || 'Not specified'),
          experience: app.graduation_year || 'Not specified',
          match_percentage: app.match_percentage,
          match_score: app.match_score,
          matching_skills: app.matching_skills || [],
          missing_skills: app.missing_skills || [],
          status: transformedStatus,
          applicationDate: app.applied_date ? new Date(app.applied_date) : new Date(),
          canViewContactDetails: app.can_view_contact_details || false,  // Use backend flag
          offerSentDate: app.offer_sent_date ? new Date(app.offer_sent_date) : undefined,
          offerResponseDate: app.offer_response_date ? new Date(app.offer_response_date) : undefined,
        };
      });
      
      console.log('DEBUG: Transformed applicants:', transformedApplicants);
      setApplicants(transformedApplicants);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleBulkStatusChange = (selectedApplicants: Applicant[]) => {
    console.log('Changing status for:', selectedApplicants);
    // Handle bulk status change logic here
  };

  const handleBulkMessage = (selectedApplicants: Applicant[]) => {
    console.log('Sending bulk message to:', selectedApplicants);
    // Handle bulk message logic here
  };

  const handleViewResume = (applicant: Applicant) => {
    console.log('Viewing resume for:', applicant);
    // Handle view resume logic here
  };

  const handleViewProfile = (applicant: Applicant) => {
    // Fetch full applicant details from API before opening modal
    (async () => {
      try {
        const details = await applicationService.getApplicantDetails(applicant.id);
        const mapped: Applicant = {
          id: String(details.application_id),
          name: details.name,
          email: details.email || (details.can_view_contact_details ? details.email : 'Contact details will be available after offer acceptance'),
          phone: details.phone || undefined,
          internshipTitle: details.internship_title,
          internshipId: String(details.internship_id),
          skills: details.skills || [],
          university: details.education?.university || details.university || 'Not specified',
          major: details.education?.major || details.major || undefined,
          graduation_year: details.education?.graduation_year || details.graduation_year || undefined,
          bio: details.bio || undefined,
          linkedin: details.linkedin || undefined,
          github: details.github || undefined,
          portfolio: details.portfolio || undefined,
          grading_type: details.education?.grading_type || details.grading_type || undefined,
          grading_score: details.education?.grading_score || details.grading_score || undefined,
          work_experiences: details.work_experiences || [],
          projects: details.projects || [],
          education: details.education ? `${details.education.major || ''} - ${details.education.university || ''}` : (details.education || 'Not specified'),
          experience: details.graduation_year || details.experience || 'Not specified',
          match_percentage: details.match_percentage || 0,
          match_score: details.match_score || '0%',
          matching_skills: details.matching_skills || [],
          missing_skills: details.missing_skills || [],
          status: details.status ? (details.status.toLowerCase().includes('review') ? 'Under Review' : 
                   details.status.toLowerCase() === 'accepted' || details.status.toLowerCase() === 'offer accepted' ? 'Offer Accepted' :
                   details.status.toLowerCase() === 'offered' ? 'Offered' :
                   details.status.toLowerCase() === 'rejected' ? 'Rejected' :
                   details.status.toLowerCase() === 'hired' ? 'Hired' : 'Applied') : 'Applied',
          applicationDate: details.applied_date ? new Date(details.applied_date) : new Date(),
          // internshipId and internshipTitle already set above
          resumeUrl: details.resume_url || undefined,
          canViewContactDetails: details.can_view_contact_details || false,
        };

        setSelectedApplicant(mapped);
        setIsModalOpen(true);
      } catch (err) {
        console.error('Failed to load applicant details:', err);
        alert('Failed to load applicant details. Please try again.');
      }
    })();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  const handleStatusUpdate = async (applicantId: string, newStatus: Applicant['status']) => {
    try {
      console.log('DEBUG: Updating status for applicant:', applicantId, 'to:', newStatus);
      
      // Map frontend status to backend status
      const backendStatus = newStatus.toLowerCase().replace(' ', '_');
      console.log('DEBUG: Mapped backend status:', backendStatus);
      
      // Call API to update status
      const response = await applicationService.updateApplicationStatus(applicantId, backendStatus);
      console.log('DEBUG: Status update response:', response);
      
      // Refresh the applicants list to get updated data with contact visibility
      await fetchApplicants();
      console.log('DEBUG: Applicants refreshed after status update');
      
      // Update the selected applicant if modal is open
      if (selectedApplicant && selectedApplicant.id === applicantId) {
        const updatedApplicant = applicants.find(a => a.id === applicantId);
        if (updatedApplicant) {
          console.log('DEBUG: Updated selected applicant status:', updatedApplicant.status);
          setSelectedApplicant(updatedApplicant);
        }
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    }
  };

  const handleSendMessage = (applicant: Applicant) => {
    console.log('Sending message to:', applicant);
    // Handle send message logic here
  };

  const columns: Column<Applicant>[] = [
    {
      key: 'name',
      header: 'Candidate',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {value.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {row.canViewContactDetails ? row.email : 'Contact details protected'}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'match_percentage',
      header: 'Match',
      sortable: true,
      render: (value, row) => {
        const percentage = value || 0;
        const getMatchColor = (match: number) => {
          if (match >= 80) return 'bg-green-100 text-green-700 border-green-300';
          if (match >= 60) return 'bg-blue-100 text-blue-700 border-blue-300';
          if (match >= 40) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
          return 'bg-red-100 text-red-700 border-red-300';
        };
        
        return (
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${getMatchColor(percentage)}`}>
              {percentage.toFixed(0)}%
            </div>
            {row.matching_skills && row.matching_skills.length > 0 && (
              <span className="text-xs text-gray-500">
                ({row.matching_skills.length} skills)
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'internshipTitle',
      header: 'Position Applied',
      sortable: true,
      filterable: true,
      render: (value) => (
        <div className="flex items-center">
          <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'skills',
      header: 'Skills',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((skill: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-50 text-teal-700 border border-teal-200"
            >
              {skill}
            </span>
          ))}
          {value.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
              +{value.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'education',
      header: 'Education',
      sortable: true,
      filterable: true,
      render: (value) => (
        <div className="flex items-center">
          <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <Badge className={getStatusColor(value)} variant="secondary">
          {value}
        </Badge>
      ),
    },
    {
      key: 'applicationDate',
      header: 'Applied Date',
      sortable: true,
      render: (value) => (
        <div className="flex items-center text-sm">
          <Clock className="w-3 h-3 mr-1 text-gray-400" />
          {formatDate(value)}
        </div>
      ),
    },
  ];

  const bulkActions = [
    {
      label: 'Change Status',
      icon: UserCheck,
      onClick: handleBulkStatusChange,
    },
    {
      label: 'Send Bulk Message',
      icon: MessageSquare,
      onClick: handleBulkMessage,
    },
  ];

  const rowActions = [
    {
      label: 'View Resume',
      icon: FileText,
      onClick: handleViewResume,
    },
    {
      label: 'View Profile',
      icon: Eye,
      onClick: handleViewProfile,
    },
    {
      label: 'Send Message',
      icon: MessageSquare,
      onClick: handleSendMessage,
    },
  ];

  const getStatusStats = () => {
    const stats = applicants.reduce((acc, applicant) => {
      // Keep statuses separate - don't group them together
      acc[applicant.status] = (acc[applicant.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const statusStats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[#FFFAF3]">Applicants</h1>
          <p className="text-[#E8F5F3] mt-1">
            Review and manage internship applications
          </p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <Card className="p-4 bg-[#FFFAF3] border-[#63D7C7]/20">
          <CardContent className="p-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#63D7C7] rounded-lg">
                <Users className="w-5 h-5 text-[#004F4D]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1F7368]">Total</p>
                <p className="text-2xl font-bold text-[#004F4D]">
                  {applicants.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-[#FFFAF3] border-[#63D7C7]/20">
          <CardContent className="p-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#63D7C7] rounded-lg">
                <Clock className="w-5 h-5 text-[#004F4D]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1F7368]">Applied</p>
                <p className="text-2xl font-bold text-[#004F4D]">
                  {statusStats['Applied'] || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-[#FFFAF3] border-[#63D7C7]/20">
          <CardContent className="p-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#63D7C7] rounded-lg">
                <Eye className="w-5 h-5 text-[#004F4D]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1F7368]">In Review</p>
                <p className="text-2xl font-bold text-[#004F4D]">
                  {statusStats['Under Review'] || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-[#FFFAF3] border-[#63D7C7]/20">
          <CardContent className="p-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1F7368]">Accepted</p>
                <p className="text-2xl font-bold text-[#004F4D]">
                  {statusStats['Offer Accepted'] || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-[#FFFAF3] border-[#63D7C7]/20">
          <CardContent className="p-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1F7368]">Hired</p>
                <p className="text-2xl font-bold text-[#004F4D]">
                  {statusStats['Hired'] || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <DataTable
          data={applicants}
          columns={columns}
          isLoading={isLoading}
          onRowClick={handleViewProfile}  // Add row click handler
          onRowSelect={(selected) => console.log('Selected rows:', selected)}
          bulkActions={bulkActions}
          rowActions={rowActions}
        />
      </motion.div>

      {/* Applicant Details Modal */}
      <ApplicantDetailsModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusUpdate={handleStatusUpdate}
      />
      </div>
    </div>
  );
};


