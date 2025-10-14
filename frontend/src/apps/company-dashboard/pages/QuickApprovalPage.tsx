import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Mail,
  AlertCircle,
  Search,
  HelpCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { applicationService } from '@/services/application.service';
import { ApplicantDetailsModal } from '../components/ApplicantDetailsModal';
import { ApprovalWorkflowGuide } from '../components/ApprovalWorkflowGuide';
import { ConnectionStatus } from '../components/ConnectionStatus';
import type { Applicant } from '@/shared/types';
import { formatDate, getStatusColor } from '@/shared/lib/utils';

export const QuickApprovalPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching applicants from backend...');
      const response = await applicationService.getAllCompanyApplicants();
      console.log('Raw API response:', response);
      
      // Transform API response to match frontend Applicant interface
      const transformedApplicants: Applicant[] = response.map((app: any) => ({
        id: String(app.application_id),
        name: app.name || (app.email ? app.email.split('@')[0] : 'Anonymous'),
        email: app.email || 'Contact details protected',
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
        canViewContactDetails: app.can_view_contact_details || false,
        offerSentDate: app.offer_sent_date ? new Date(app.offer_sent_date) : undefined,
        offerResponseDate: app.offer_response_date ? new Date(app.offer_response_date) : undefined,
      }));
      
      console.log('Transformed applicants:', transformedApplicants);
      setApplicants(transformedApplicants);
      setFilteredApplicants(transformedApplicants);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      // Don't alert on error, just log it
      setApplicants([]);
      setFilteredApplicants([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    let filtered = applicants;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (applicant) =>
          applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant.internshipTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((applicant) => applicant.status.toLowerCase() === statusFilter.toLowerCase());
    }

    setFilteredApplicants(filtered);
  }, [applicants, searchQuery, statusFilter]);

  const handleStatusUpdate = async (applicantId: string, newStatus: Applicant['status']) => {
    try {
      console.log(`Updating application ${applicantId} to status: ${newStatus}`);
      const backendStatus = newStatus.toLowerCase().replace(' ', '_');
      await applicationService.updateApplicationStatus(applicantId, backendStatus);
      
      // Refresh the data
      await fetchApplicants();
      
      // Update the selected applicant if modal is open
      if (selectedApplicant && selectedApplicant.id === applicantId) {
        const updatedApplicant = applicants.find(a => a.id === applicantId);
        if (updatedApplicant) {
          setSelectedApplicant({ ...updatedApplicant, status: newStatus });
        }
      }
      
      console.log(`Successfully updated application ${applicantId} to ${newStatus}`);
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please check your connection and try again.');
    }
  };

  const handleQuickApprove = async (applicantId: string) => {
    await handleStatusUpdate(applicantId, 'Offered');
  };

  const handleQuickReject = async (applicantId: string) => {
    await handleStatusUpdate(applicantId, 'Rejected');
  };

  const getStatusStats = () => {
    const stats = applicants.reduce((acc, applicant) => {
      // Don't group statuses together - keep them separate
      acc[applicant.status] = (acc[applicant.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const getActionButton = (applicant: Applicant) => {
    switch (applicant.status) {
      case 'Applied':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusUpdate(applicant.id, 'Under Review')}
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Review
          </Button>
        );
      case 'Under Review':
        return (
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={() => handleQuickApprove(applicant.id)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Offer
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickReject(applicant.id)}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <XCircle className="w-3 h-3 mr-1" />
              Reject
            </Button>
          </div>
        );
      case 'Offered':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-300">
            <Mail className="w-3 h-3 mr-1" />
            Offer Sent
          </Badge>
        );
      case 'Offer Accepted':
        return (
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(applicant.id, 'Hired')}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <UserCheck className="w-3 h-3 mr-1" />
            Hire
          </Button>
        );
      case 'Hired':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300">
            <UserCheck className="w-3 h-3 mr-1" />
            Hired
          </Badge>
        );
      case 'Rejected':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
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
            <h1 className="text-3xl font-bold text-[#FFFAF3]">Quick Approval Dashboard</h1>
            <p className="text-[#E8F5F3] mt-1">
              Fast-track application approvals and hiring decisions
            </p>
            <div className="mt-2">
              <ConnectionStatus showDetails={false} autoCheck={true} />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsGuideOpen(true)}
            className="bg-[#FFFAF3] border-[#63D7C7] text-[#1F7368] hover:bg-[#E8F5F3]"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Workflow Guide
          </Button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          <Card className="bg-[#FFFAF3] border-[#63D7C7]/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-[#1F7368]">Pending</p>
                  <p className="text-lg font-bold text-[#004F4D]">{statusStats['Applied'] || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#FFFAF3] border-[#63D7C7]/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-[#1F7368]">In Review</p>
                  <p className="text-lg font-bold text-[#004F4D]">{statusStats['Under Review'] || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#FFFAF3] border-[#63D7C7]/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-[#1F7368]">Offered</p>
                  <p className="text-lg font-bold text-[#004F4D]">{statusStats['Offered'] || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#FFFAF3] border-[#63D7C7]/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-[#1F7368]">Accepted</p>
                  <p className="text-lg font-bold text-[#004F4D]">{statusStats['Offer Accepted'] || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#FFFAF3] border-[#63D7C7]/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-[#1F7368]">Hired</p>
                  <p className="text-lg font-bold text-[#004F4D]">{statusStats['Hired'] || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#FFFAF3] border-[#63D7C7]/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-[#63D7C7] rounded-lg">
                  <Users className="w-4 h-4 text-[#004F4D]" />
                </div>
                <div>
                  <p className="text-xs text-[#1F7368]">Total</p>
                  <p className="text-lg font-bold text-[#004F4D]">{applicants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1F7368] w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by name, position, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#FFFAF3] border-[#63D7C7]/30 text-[#004F4D] placeholder:text-[#1F7368]/60"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#63D7C7]/30 rounded-lg bg-[#FFFAF3] text-[#004F4D] focus:outline-none focus:ring-2 focus:ring-[#1F7368] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="under review">Under Review</option>
              <option value="offered">Offered</option>
              <option value="offer accepted">Offer Accepted</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* Applicants List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-[#FFFAF3] border-[#63D7C7]/20">
            <CardHeader>
              <CardTitle className="text-[#004F4D]">Applications Ready for Action</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F7368] mx-auto"></div>
                  <p className="text-[#1F7368] mt-2">Loading applications...</p>
                </div>
              ) : filteredApplicants.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-[#1F7368]/40 mx-auto mb-2" />
                  <p className="text-[#1F7368]">No applications found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredApplicants.map((applicant) => (
                    <div
                      key={applicant.id}
                      className="flex items-center justify-between p-4 border border-[#63D7C7]/20 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedApplicant(applicant);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#63D7C7] to-[#1F7368] rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {applicant.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#004F4D]">{applicant.name}</h3>
                          <p className="text-sm text-[#1F7368]">{applicant.internshipTitle}</p>
                          <p className="text-xs text-[#1F7368]/60">{applicant.university}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium text-[#004F4D]">
                              {(applicant.match_percentage || 0).toFixed(0)}% Match
                            </div>
                          </div>
                          <p className="text-xs text-[#1F7368]/60">
                            Applied {formatDate(applicant.applicationDate)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(applicant.status)} variant="secondary">
                            {applicant.status}
                          </Badge>
                          <div onClick={(e) => e.stopPropagation()}>
                            {getActionButton(applicant)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Applicant Details Modal */}
        <ApplicantDetailsModal
          applicant={selectedApplicant}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedApplicant(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />

        {/* Workflow Guide Modal */}
        <ApprovalWorkflowGuide
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />
      </div>
    </div>
  );
};