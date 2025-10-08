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
      
      // Transform API response to match frontend Applicant interface
      const transformedApplicants: Applicant[] = response.map(app => ({
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
        status: app.status.toLowerCase().includes('review') ? 'Under Review' : 
                app.status.toLowerCase() === 'accepted' || app.status.toLowerCase() === 'offer accepted' || app.status.toLowerCase() === 'offer_accepted' ? 'Offer Accepted' :
                app.status.toLowerCase() === 'offered' ? 'Offered' : 
                app.status.toLowerCase() === 'rejected' ? 'Rejected' : 
                app.status.toLowerCase() === 'hired' ? 'Hired' :
                'Applied',
        applicationDate: app.applied_date ? new Date(app.applied_date) : new Date(),
        canViewContactDetails: app.can_view_contact_details || false,  // Use backend flag
        offerSentDate: app.offer_sent_date ? new Date(app.offer_sent_date) : undefined,
        offerResponseDate: app.offer_response_date ? new Date(app.offer_response_date) : undefined,
      }));
      
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
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  const handleStatusUpdate = async (applicantId: string, newStatus: Applicant['status']) => {
    try {
      // Map frontend status to backend status
      const backendStatus = newStatus.toLowerCase().replace(' ', '_');
      
      // Call API to update status
      await applicationService.updateApplicationStatus(applicantId, backendStatus);
      
      // Refresh the applicants list to get updated data with contact visibility
      await fetchApplicants();
      
      // Update the selected applicant if modal is open
      if (selectedApplicant && selectedApplicant.id === applicantId) {
        const updatedApplicant = applicants.find(a => a.id === applicantId);
        if (updatedApplicant) {
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
            <div className="font-semibold text-[#004F4D]">{value}</div>
            <div className="text-sm text-[#1F7368] flex items-center">
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
              <span className="text-xs text-[#1F7368]">
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
          <Briefcase className="w-4 h-4 mr-2 text-[#1F7368]" />
          <span className="font-medium text-[#004F4D]">{value}</span>
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
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#63D7C7]/20 text-[#004F4D] border border-[#63D7C7]"
            >
              {skill}
            </span>
          ))}
          {value.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#FFFAF3] text-[#1F7368] border border-[#63D7C7]">
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
          <GraduationCap className="w-4 h-4 mr-2 text-[#1F7368]" />
          <span className="text-sm text-[#004F4D]">{value}</span>
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
        <div className="flex items-center text-sm text-[#004F4D]">
          <Clock className="w-3 h-3 mr-1 text-[#1F7368]" />
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
      // Count "Offer Accepted" as "Hired" for the stats
      const statusForStats = applicant.status === 'Offer Accepted' ? 'Hired' : applicant.status;
      acc[statusForStats] = (acc[statusForStats] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const statusStats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[#004F4D]">Applicants</h1>
          <p className="text-[#1F7368] mt-1">
            Review and manage internship applications
          </p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="p-4 bg-[#FFFAF3] border-2 border-[#63D7C7]">
          <CardContent className="p-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#63D7C7]/20 rounded-lg">
                <Users className="w-5 h-5 text-[#1F7368]" />
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

        <Card className="p-4 bg-[#FFFAF3] border-2 border-[#63D7C7]">
          <CardContent className="p-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#FFFAF3] rounded-lg">
                <Clock className="w-5 h-5 text-[#1F7368]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1F7368]">Pending</p>
                <p className="text-2xl font-bold text-[#004F4D]">
                  {statusStats['Pending'] || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-[#FFFAF3] border-2 border-[#63D7C7]">
          <CardContent className="p-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#1F7368]/20 rounded-lg">
                <Eye className="w-5 h-5 text-[#004F4D]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1F7368]">Under Review</p>
                <p className="text-2xl font-bold text-[#004F4D]">
                  {statusStats['Under Review'] || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-[#FFFAF3] border-2 border-[#63D7C7]">
          <CardContent className="p-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#004F4D]/10 rounded-lg">
                <UserCheck className="w-5 h-5 text-[#004F4D]" />
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
  );
};


