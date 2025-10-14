import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  UserCheck,
  TrendingUp,
  Plus,
  Star,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { StatCard } from '../components/dashboard/StatCard';
import { InternshipCard } from '../components/dashboard/InternshipCard';
import { ApplicantCard } from '../components/dashboard/ApplicantCard';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';
import { InternshipDetailsModal } from '../components/InternshipDetailsModal';
import { ApplicantDetailsModal } from '../components/ApplicantDetailsModal';
import { NotificationSystem, useNotifications } from '../components/NotificationSystem';
import { apiClient } from '@/api';
import { applicationService } from '@/services/application.service';
import type { DashboardStats, Internship, Applicant } from '@/shared/types';

export const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [applicantSearch, setApplicantSearch] = useState('');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);

  // Notification system
  const { notifications, addNotification, markAsRead, removeNotification } = useNotifications();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats from backend
        const statsResponse = await apiClient.get('/api/v1/internships/company/dashboard-stats');
        setStats({
          totalInternships: statsResponse.total_internships,
          activeInternships: statsResponse.active_internships,
          totalApplicants: statsResponse.total_applicants,
          totalHires: statsResponse.total_hires,
          newInternshipsWeek: statsResponse.new_internships_week,
          newApplicantsMonth: statsResponse.new_applicants_month,
          applicantsChangePercent: statsResponse.applicants_change_percent,
          newHiresMonth: statsResponse.new_hires_month,
          endingSoon: statsResponse.ending_soon,
        });

        // Fetch company's internships
        const internshipsResponse = await apiClient.get('/api/v1/internships/company/my-internships');
        
        // Transform backend data to match frontend Internship interface
        const transformedInternships = internshipsResponse.map((item: any) => ({
          id: item.id,
          title: item.title || 'Untitled',
          company: 'Your Company', // TODO: Get from user profile
          location: item.location || 'Remote',
          stipend: item.stipend || 0,
          applicantCount: item.applicant_count || 0, // Use the actual count from backend
          status: (item.status || 'Active') as 'Active' | 'Closed' | 'Draft',
          datePosted: item.date_posted ? new Date(item.date_posted) : new Date(),
          deadline: item.deadline ? new Date(item.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          description: item.description || '',
          // Map skills from database
          skills: item.skills ? item.skills.split(',').map((s: string) => s.trim()) : [],
          // Map requirements from database
          requirements: item.requirements ? item.requirements.split(',').map((s: string) => s.trim()) : [],
          // Map benefits from database
          benefits: item.benefits ? item.benefits.split(',').map((s: string) => s.trim()) : [],
          duration: item.duration || '3 months',
          type: (item.type || 'Remote') as 'Remote' | 'Hybrid' | 'In-office',
        }));
        
        setInternships(transformedInternships.slice(0, 3));

        // Fetch recent applicants
        try {
          const applicantsResponse = await apiClient.get('/api/v1/applications/company/all-applicants');
          // Transform backend data to match frontend Applicant interface
          const transformedApplicants = applicantsResponse.slice(0, 5).map((item: any) => ({
            id: item.application_id,
            name: item.name,
            email: item.email,
            internshipId: item.internship_id,
            internshipTitle: item.internship_title,
            skills: item.skills || [],
            university: item.university,
            major: item.major,
            graduation_year: item.graduation_year,
            applicationDate: item.applied_date ? new Date(item.applied_date) : new Date(),
            status: item.status.toLowerCase().includes('review') ? 'Under Review' : 
                    item.status.toLowerCase() === 'accepted' || item.status.toLowerCase() === 'offer accepted' || item.status.toLowerCase() === 'offer_accepted' ? 'Offer Accepted' :
                    item.status.toLowerCase() === 'offered' ? 'Offered' : 
                    item.status.toLowerCase() === 'rejected' ? 'Rejected' : 
                    item.status.toLowerCase() === 'hired' ? 'Hired' :
                    'Applied',
            experience: item.graduation_year || 'Not specified',
            education: item.major ? `${item.major} - ${item.university || 'Not specified'}` : (item.university || 'Not specified'),
            match_percentage: item.match_percentage || 0,
            match_score: item.match_score,
            matching_skills: item.matching_skills || [],
            missing_skills: item.missing_skills || [],
            canViewContactDetails: item.can_view_contact_details || false,
          }));
          setApplicants(transformedApplicants);
        } catch (error) {
          console.error('Error fetching applicants:', error);
          setApplicants([]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // You might want to show an error toast or message here
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredApplicants = applicants.filter(applicant =>
    applicant.name.toLowerCase().includes(applicantSearch.toLowerCase()) ||
    (applicant.skills && applicant.skills.some(skill => 
      skill.toLowerCase().includes(applicantSearch.toLowerCase())
    ))
  );

  const handleInternshipClick = (internship: Internship) => {
    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInternship(null);
  };

  const handleApplicantClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsApplicantModalOpen(true);
  };

  const handleCloseApplicantModal = () => {
    setIsApplicantModalOpen(false);
    setSelectedApplicant(null);
  };

  const handleStatusUpdate = async (applicantId: string, newStatus: Applicant['status']) => {
    try {
      console.log('DEBUG Dashboard: Updating status for applicant:', applicantId, 'to:', newStatus);
      
      // Map frontend status to backend status
      const backendStatus = newStatus.toLowerCase().replace(' ', '_');
      console.log('DEBUG Dashboard: Mapped backend status:', backendStatus);
      
      // Call API to persist the status change
      await applicationService.updateApplicationStatus(applicantId, backendStatus);
      console.log('DEBUG Dashboard: Status updated successfully in database');
      
      // Update local state for immediate UI feedback
      setApplicants(prevApplicants =>
        prevApplicants.map(applicant => {
          if (applicant.id === applicantId) {
            const updatedApplicant = { 
              ...applicant, 
              status: newStatus,
              // Update contact visibility based on workflow
              canViewContactDetails: newStatus === 'Hired' || newStatus === 'Offer Accepted',
              // Add timestamps for workflow tracking
              ...(newStatus === 'Offered' && { offerSentDate: new Date() }),
              ...(newStatus === 'Offer Accepted' && { offerResponseDate: new Date() }),
              ...(newStatus === 'Offer Rejected' && { offerResponseDate: new Date() })
            };

            // Send notifications based on status change
            const applicantName = applicant.name;
            const internshipTitle = applicant.internshipTitle;

            switch (newStatus) {
              case 'Under Review':
                addNotification({
                  type: 'application_received',
                  title: 'Application Under Review',
                  message: `${applicantName}'s application for ${internshipTitle} is now under review.`,
                  recipientType: 'company',
                  relatedId: applicantId
                });
                break;

              case 'Offered':
                addNotification({
                  type: 'offer_sent',
                  title: 'Offer Letter Sent',
                  message: `Offer letter sent to ${applicantName} for ${internshipTitle}. Waiting for response.`,
                  recipientType: 'company',
                  relatedId: applicantId
                });
                break;

              case 'Offer Accepted':
                addNotification({
                  type: 'offer_response',
                  title: 'Offer Accepted!',
                  message: `${applicantName} has accepted the offer for ${internshipTitle}. Contact details are now available.`,
                  recipientType: 'company',
                  relatedId: applicantId
                });
                break;

              case 'Offer Rejected':
                addNotification({
                  type: 'offer_response',
                  title: 'Offer Declined',
                  message: `${applicantName} has declined the offer for ${internshipTitle}.`,
                  recipientType: 'company',
                  relatedId: applicantId
                });
                break;

              case 'Hired':
                addNotification({
                  type: 'hire_confirmed',
                  title: 'Candidate Hired!',
                  message: `${applicantName} has been successfully hired for ${internshipTitle}. Welcome to the team!`,
                  recipientType: 'company',
                  relatedId: applicantId
                });
                break;
            }

            return updatedApplicant;
          }
          return applicant;
        })
      );
      
      // Update the selected applicant if it's the same one
      if (selectedApplicant && selectedApplicant.id === applicantId) {
        setSelectedApplicant(prev => prev ? { 
          ...prev, 
          status: newStatus,
          canViewContactDetails: newStatus === 'Hired' || newStatus === 'Offer Accepted',
          ...(newStatus === 'Offered' && { offerSentDate: new Date() }),
          ...(newStatus === 'Offer Accepted' && { offerResponseDate: new Date() }),
          ...(newStatus === 'Offer Rejected' && { offerResponseDate: new Date() })
        } : null);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] p-6">
      <div className="max-w-7xl mx-auto space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Internships"
          value={stats?.totalInternships || 0}
          change={stats?.newInternshipsWeek && stats.newInternshipsWeek > 0 
            ? `+${stats.newInternshipsWeek} this week` 
            : 'No new internships'}
          icon={Briefcase}
          gradient="bg-gradient-to-br from-[#1F7368] to-[#004F4D]"
          index={0}
        />
        <StatCard
          title="Total Applicants"
          value={stats?.totalApplicants || 0}
          change={stats?.applicantsChangePercent !== undefined
            ? `${stats.applicantsChangePercent >= 0 ? '+' : ''}${stats.applicantsChangePercent}% from last month`
            : 'No data'}
          icon={Users}
          gradient="bg-gradient-to-br from-[#63D7C7] to-[#1F7368]"
          index={1}
        />
        <StatCard
          title="Total Hires"
          value={stats?.totalHires || 0}
          change={stats?.newHiresMonth && stats.newHiresMonth > 0
            ? `+${stats.newHiresMonth} this month`
            : 'No new hires'}
          icon={UserCheck}
          gradient="bg-gradient-to-br from-[#004F4D] to-[#003836]"
          index={2}
        />
        <StatCard
          title="Active Internships"
          value={stats?.activeInternships || 0}
          change={stats?.endingSoon && stats.endingSoon > 0
            ? `${stats.endingSoon} ending soon`
            : 'None ending soon'}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-[#1F7368] to-[#63D7C7]"
          index={3}
        />
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Post New Internship CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-6 bg-gradient-to-br from-[#FFFAF3] to-[#F0EDE6] border-[#63D7C7]/30">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#004F4D] mb-2">
                      Ready to hire top talent?
                    </h3>
                    <p className="text-[#1F7368] text-sm mb-4">
                      Post a new internship and start receiving applications from qualified candidates.
                    </p>
                    <div className="flex gap-3">
                      <Link to="/company/post-internship">
                        <Button className="bg-[#1F7368] hover:bg-[#004F4D] text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Post New Internship
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-20 h-20 bg-[#63D7C7]/20 rounded-full flex items-center justify-center">
                      <Briefcase className="w-10 h-10 text-[#1F7368]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Internships */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="p-6 bg-[#FFFAF3] border-[#63D7C7]/20">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-[#004F4D]">Active Internships</CardTitle>
                  <Button variant="ghost" size="sm" className="text-[#1F7368] hover:text-[#004F4D] hover:bg-[#E8F5F3]">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4">
                  {internships.map((internship, index) => (
                    <InternshipCard
                      key={internship.id}
                      internship={internship}
                      index={index}
                      onClick={handleInternshipClick}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Premium Features Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="p-6 bg-gradient-to-br from-[#FFFAF3] to-[#F5F1E9] border-[#63D7C7]/30">
              <CardContent className="p-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#63D7C7] to-[#1F7368] rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#004F4D]">
                      Upgrade to Premium
                    </h3>
                    <p className="text-sm text-[#1F7368] mt-1">
                      Get advanced analytics, priority support, and unlimited postings.
                    </p>
                    <Link to="/pricing?type=company">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 border-[#1F7368] text-[#1F7368] hover:bg-[#1F7368] hover:text-white"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Applicant Search */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-6 bg-[#FFFAF3] border-[#63D7C7]/20">
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#004F4D]">Find Candidates</h3>
                    <div className="flex items-center text-sm text-[#1F7368]">
                      <Filter className="w-4 h-4 mr-1" />
                      Advanced
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1F7368] w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search by name, skills, or position..."
                      value={applicantSearch}
                      onChange={(e) => setApplicantSearch(e.target.value)}
                      className="pl-10 bg-white border-[#63D7C7]/30 text-[#004F4D] placeholder:text-[#1F7368]/60"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Applicants */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="p-6 bg-[#FFFAF3] border-[#63D7C7]/20">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-[#004F4D]">Recent Applicants</CardTitle>
                  <Button variant="ghost" size="sm" className="text-[#1F7368] hover:text-[#004F4D] hover:bg-[#E8F5F3]">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredApplicants.map((applicant, index) => (
                    <ApplicantCard
                      key={applicant.id}
                      applicant={applicant}
                      index={index}
                      onClick={handleApplicantClick}
                    />
                  ))}
                  {filteredApplicants.length === 0 && (
                    <div className="text-center py-8 text-[#1F7368]">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No applicants found matching your search.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      </div>

      {/* Internship Details Modal */}
      <InternshipDetailsModal
        internship={selectedInternship}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Applicant Details Modal */}
      <ApplicantDetailsModal
        applicant={selectedApplicant}
        isOpen={isApplicantModalOpen}
        onClose={handleCloseApplicantModal}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onRemove={removeNotification}
      />
      </div>
    </div>
  );
};


