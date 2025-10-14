import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Search, Calendar, MapPin, Clock, Gift, CheckCircle, XCircle, Users, AlertCircle, Eye, DollarSign } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { apiClient } from '@/api';
import { useNavigate } from 'react-router-dom';
import { StudentApplicationDetailsModal } from '../components/StudentApplicationDetailsModal';

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
  internship_id: string;
  title: string;
  position: string;
  company: string;
  company_id: string;
  location: string;
  stipend: number;
  salary: string;
  duration: string;
  type: string;
  status: string;
  application_date: string;
  offer_sent_date?: string;
  offer_response_date?: string;
  deadline?: string;
  description?: string;
  required_skills?: string;
  student_profile?: StudentProfile;
  work_experiences?: WorkExperience[];
  projects?: Project[];
}

const statusConfig = {
  offered: {
    icon: Gift,
    color: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
    bgColor: "bg-purple-50 border-purple-200",
    label: "Offer Pending",
    priority: 1
  },
  accepted: {
    icon: CheckCircle,
    color: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    bgColor: "bg-green-50 border-green-200",
    label: "Accepted",
    priority: 2
  },
  under_review: {
    icon: Eye,
    color: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    bgColor: "bg-blue-50 border-blue-200",
    label: "Under Review",
    priority: 3
  },
  reviewed: {
    icon: Users,
    color: "bg-gradient-to-r from-[#004F4D] to-[#1F7368] text-white",
    bgColor: "bg-teal-50 border-teal-200",
    label: "Reviewed",
    priority: 4
  },
  pending: {
    icon: Clock,
    color: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
    bgColor: "bg-yellow-50 border-yellow-200",
    label: "Pending",
    priority: 5
  },
  applied: {
    icon: AlertCircle,
    color: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
    bgColor: "bg-gray-50 border-gray-200",
    label: "Applied",
    priority: 6
  },
  rejected: {
    icon: XCircle,
    color: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    bgColor: "bg-red-50 border-red-200",
    label: "Rejected",
    priority: 7
  },
  declined: {
    icon: XCircle,
    color: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
    bgColor: "bg-gray-50 border-gray-200",
    label: "Declined",
    priority: 8
  }
};

export const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchApplications = async () => {
    try {
      setIsRefreshing(true);
      const response = await apiClient.get("/api/v1/applications/my-applications");
      setApplications(response);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    let filtered = applications;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.status.toLowerCase().replace(' ', '_') === statusFilter);
    }

    // Sort by priority and date
    filtered.sort((a, b) => {
      const aStatus = a.status.toLowerCase().replace(' ', '_');
      const bStatus = b.status.toLowerCase().replace(' ', '_');
      const aConfig = statusConfig[aStatus as keyof typeof statusConfig] || statusConfig.applied;
      const bConfig = statusConfig[bStatus as keyof typeof statusConfig] || statusConfig.applied;
      
      if (aConfig.priority !== bConfig.priority) {
        return aConfig.priority - bConfig.priority;
      }
      
      return new Date(b.application_date).getTime() - new Date(a.application_date).getTime();
    });

    setFilteredApplications(filtered);
  }, [applications, searchQuery, statusFilter]);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getStatusStats = () => {
    const stats = applications.reduce((acc, app) => {
      const status = app.status.toLowerCase().replace(' ', '_');
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const statusStats = getStatusStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/20 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-white/20 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-white/20 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/interns')}
              variant="outline"
              className="bg-[#FFFAF3] border-[#63D7C7] text-[#1F7368] hover:bg-[#E8F5F3]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-[#FFFAF3]">My Applications</h1>
              <p className="text-[#E8F5F3] mt-1">
                Track all your internship applications and their current status
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#E8F5F3]">
              Last updated: {getTimeAgo(lastUpdated.toISOString())}
            </span>
            <Button
              onClick={fetchApplications}
              disabled={isRefreshing}
              variant="outline"
              className="bg-[#FFFAF3] border-[#63D7C7] text-[#1F7368] hover:bg-[#E8F5F3]"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="bg-[#FFFAF3] border-[#63D7C7]/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Gift className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-[#1F7368]">Offers</p>
                  <p className="text-lg font-bold text-[#004F4D]">{statusStats['offered'] || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#FFFAF3] border-[#63D7C7]/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-[#1F7368]">Accepted</p>
                  <p className="text-lg font-bold text-[#004F4D]">{statusStats['accepted'] || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#FFFAF3] border-[#63D7C7]/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-[#1F7368]">In Review</p>
                  <p className="text-lg font-bold text-[#004F4D]">{(statusStats['under_review'] || 0) + (statusStats['reviewed'] || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#FFFAF3] border-[#63D7C7]/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-[#63D7C7] rounded-lg">
                  <Calendar className="w-4 h-4 text-[#004F4D]" />
                </div>
                <div>
                  <p className="text-xs text-[#1F7368]">Total</p>
                  <p className="text-lg font-bold text-[#004F4D]">{applications.length}</p>
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
                placeholder="Search by company, position, or location..."
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
              <option value="offered">Offers</option>
              <option value="accepted">Accepted</option>
              <option value="under_review">Under Review</option>
              <option value="reviewed">Reviewed</option>
              <option value="pending">Pending</option>
              <option value="applied">Applied</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* Applications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredApplications.length === 0 ? (
            <Card className="bg-[#FFFAF3] border-[#63D7C7]/20">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-[#1F7368]/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#004F4D] mb-2">No applications found</h3>
                <p className="text-[#1F7368] mb-4">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Start applying to internships to see them here'}
                </p>
                <Button
                  onClick={() => navigate('/interns/internships')}
                  className="bg-[#1F7368] hover:bg-[#004F4D] text-white"
                >
                  Browse Internships
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application, index) => {
              const status = application.status.toLowerCase().replace(' ', '_');
              const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.applied;
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`border-2 ${config.bgColor} hover:shadow-xl transition-all duration-300 cursor-pointer group`}
                    onClick={() => {
                      setSelectedApplication(application);
                      setIsModalOpen(true);
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-[#004F4D] group-hover:text-[#1F7368] transition-colors">
                                {application.title}
                              </h3>
                              <p className="text-[#1F7368] font-medium">{application.company}</p>
                            </div>
                            <Badge className={`${config.color} flex items-center space-x-1 shadow-md`}>
                              <StatusIcon className="h-3 w-3" />
                              <span className="text-xs font-medium">{config.label}</span>
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-[#1F7368]" />
                              <span className="text-sm text-[#004F4D]">{application.location || 'Remote'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-[#1F7368]" />
                              <span className="text-sm text-[#004F4D]">{application.salary || 'Not specified'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-[#1F7368]" />
                              <span className="text-sm text-[#004F4D]">{application.duration || '3 months'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-[#1F7368]" />
                              <span className="text-sm text-[#004F4D]">Applied {getTimeAgo(application.application_date)}</span>
                            </div>
                          </div>

                          {application.offer_sent_date && (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
                              <div className="flex items-center space-x-2">
                                <Gift className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-700">
                                  🎉 Offer received {getTimeAgo(application.offer_sent_date)}
                                </span>
                              </div>
                              {status === 'offered' && (
                                <p className="text-xs text-purple-600 mt-1">
                                  Action required: Accept or decline this offer
                                </p>
                              )}
                            </div>
                          )}

                          {application.deadline && (
                            <div className="text-xs text-[#1F7368]/60">
                              Application deadline: {new Date(application.deadline).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Application Details Modal */}
        <StudentApplicationDetailsModal
          application={selectedApplication}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedApplication(null);
          }}
        />
      </div>
    </div>
  );
};