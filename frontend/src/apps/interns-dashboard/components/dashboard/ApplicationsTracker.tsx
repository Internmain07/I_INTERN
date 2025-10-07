import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, Users, Calendar, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

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
}

const statusConfig = {
  offered: {
    icon: Gift,
    color: "bg-[#63D7C7] text-white",
    label: "Offer Pending"
  },
  accepted: {
    icon: CheckCircle,
    color: "bg-[#1F7368] text-white",
    label: "Accepted"
  },
  pending: {
    icon: Clock,
    color: "bg-[#63D7C7]/70 text-white",
    label: "Pending"
  },
  reviewed: {
    icon: Users,
    color: "bg-[#004F4D] text-white",
    label: "Reviewed"
  },
  rejected: {
    icon: XCircle,
    color: "bg-red-500 text-white",
    label: "Rejected"
  },
  declined: {
    icon: XCircle,
    color: "bg-gray-500 text-white",
    label: "Declined"
  }
};

export const ApplicationsTracker = ({ applications }: ApplicationsTrackerProps) => {
  // Display only the top 3 recent applications (already sorted by priority from API)
  const displayApplications = applications.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-[#63D7C7]/30 bg-[#FFFAF3] hover:border-[#63D7C7]/50 overflow-hidden group">
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#1F7368]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center text-lg">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            Recent Applications
          </CardTitle>
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
                const status = application.status.toLowerCase();
                const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = config.icon;
                
                return (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-[#63D7C7]/30 rounded-xl hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-white/50 backdrop-blur-sm group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">
                          {application.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {application.company}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applied {new Date(application.application_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`ml-2 ${config.color} flex items-center space-x-1`}>
                        <StatusIcon className="h-3 w-3" />
                        <span className="text-xs">{config.label}</span>
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};


