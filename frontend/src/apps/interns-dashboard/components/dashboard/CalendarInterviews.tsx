import { motion } from "framer-motion";
import { Calendar, Clock, Video, MapPin, Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

const upcomingInterviews = [
  {
    id: "1",
    company: "Google",
    position: "Software Engineering Intern",
    date: "2024-09-25",
    time: "2:00 PM",
    type: "Video Call",
    interviewer: "Sarah Chen",
    status: "confirmed"
  },
  {
    id: "2", 
    company: "Microsoft",
    position: "Data Science Intern",
    date: "2024-09-27",
    time: "10:30 AM", 
    type: "On-site",
    interviewer: "Mark Johnson",
    status: "pending"
  },
  {
    id: "3",
    company: "Meta",
    position: "Product Management Intern",
    date: "2024-09-30",
    time: "4:00 PM",
    type: "Video Call", 
    interviewer: "Lisa Park",
    status: "confirmed"
  }
];

const statusConfig = {
  confirmed: {
    color: "bg-success text-success-foreground",
    label: "Confirmed"
  },
  pending: {
    color: "bg-warning text-warning-foreground", 
    label: "Pending"
  },
  cancelled: {
    color: "bg-destructive text-destructive-foreground",
    label: "Cancelled"
  }
};

export const CalendarInterviews = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="shadow-soft hover:shadow-medium transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            Upcoming Interviews
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {upcomingInterviews.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No interviews scheduled</p>
              <p className="text-sm text-muted-foreground">
                Schedule your first interview
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingInterviews.map((interview, index) => {
                const config = statusConfig[interview.status];
                
                return (
                  <motion.div
                    key={interview.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border rounded-lg hover:bg-card-hover transition-smooth cursor-pointer bg-gradient-card"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1 truncate">
                          {interview.position}
                        </h4>
                        <p className="text-sm text-muted-foreground font-medium">
                          {interview.company}
                        </p>
                      </div>
                      <Badge className={`ml-2 ${config.color}`}>
                        {config.label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(interview.date).toLocaleDateString()} at {interview.time}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {interview.type === "Video Call" ? (
                          <Video className="h-3 w-3 text-primary" />
                        ) : (
                          <MapPin className="h-3 w-3 text-primary" />
                        )}
                        <span className="text-xs text-primary">
                          {interview.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          with {interview.interviewer}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4"
          >
            <Button
              onClick={() => alert("Calendar feature coming soon!")}
              variant="outline"
              className="w-full"
            >
              <Calendar className="mr-2 h-4 w-4" />
              View Full Calendar
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


