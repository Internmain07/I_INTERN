import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, Users, Calendar, Gift, RefreshCw, Eye, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/api";

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
}

interface ApplicationsTrackerProps {
  applications: Application[];
  onRefresh?: () => void;
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

export const ApplicationsTracker = ({ applications: initialApplications, onRefresh }: ApplicationsTrackerProps) => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Update applications when prop changes
  useEffect(() => {
    setApplications(initialApplications);
    setLastUpdated(new Date());
  }, [initialApplications]);

  // Auto-refresh every 30 seconds to keep status current
  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshApplications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshApplications = async () => {
    setIsRefreshing(true);
    try {
      const freshApplications = await apiClient.get("/api/v1/applications/my-applications");
      setApplications(freshApplications);
      setLastUpdated(new Date());
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error refreshing applications:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Sort applications by priority (offers first, then by date)
  const sortedApplications = [...applications].sort((a, b) => {
    const aStatus = a.status.toLowerCase().replace(' ', '_');
    const bStatus = b.status.toLowerCase().replace(' ', '_');
    const aConfig = statusConfig[aStatus as keyof typeof statusConfig] || statusConfig.applied;
    const bConfig = statusConfig[bStatus as keyof typeof statusConfig] || statusConfig.applied;
    
    // First sort by priority
    if (aConfig.priority !== bConfig.priority) {
      return aConfig.priority - bConfig.priority;
    }
    
    // Then by date (most recent first)
    return new Date(b.application_date).getTime() - new Date(a.application_date).getTime();
  });

  // Display only the top 3 most important applications
  const displayApplications = sortedApplications.slice(0, 3);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) { // 24 hours
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-[#63D7C7]/30 bg-[#FFFAF3] hover:border-[#63D7C7]/50 overflow-hidden group">
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#1F7368]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Recent Applications
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-muted-foreground">
                Updated {getTimeAgo(lastUpdated.toISOString())}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshApplications}
                disabled={isRefreshing}
                className="h-8 w-8 p-0 hover:bg-[#63D7C7]/10"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10">
          {displayApplications.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No applications yet</p>
              <p className="text-sm text-muted-foreground">
                Start applying to internships to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayApplications.map((application, index) => {
                const status = application.status.toLowerCase().replace(' ', '_');
                const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.applied;
                const StatusIcon = config.icon;
                
                return (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 border rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-sm group ${config.bgColor}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">
                          {application.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {application.company}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">
                            Applied {getTimeAgo(application.application_date)}
                          </p>
                          {application.salary && (
                            <p className="text-xs font-medium text-green-600">
                              {application.salary}
                            </p>
                          )}
                        </div>
                        {application.offer_sent_date && (
                          <p className="text-xs text-purple-600 mt-1">
                            ✉️ Offer received {getTimeAgo(application.offer_sent_date)}
                          </p>
                        )}
                      </div>
                      <Badge className={`ml-2 ${config.color} flex items-center space-x-1 shadow-md`}>
                        <StatusIcon className="h-3 w-3" />
                        <span className="text-xs font-medium">{config.label}</span>
                      </Badge>
                    </div>
                    
                    {/* Progress indicator for offers */}
                    {status === 'offered' && (
                      <div className="mt-3 pt-3 border-t border-purple-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-purple-600 font-medium">🎉 Congratulations! You have an offer</span>
                          <span className="text-purple-500">Action required</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Status change indicator */}
                    {index === 0 && status === 'offered' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    )}
                  </motion.div>
                );
              })}
              
              {/* Show total count if there are more applications */}
              {applications.length > 3 && (
                <div className="text-center pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/interns/applications')}
                    className="text-xs text-[#1F7368] hover:text-[#004F4D] hover:bg-[#63D7C7]/10 w-full"
                  >
                    View all {applications.length} applications
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};


