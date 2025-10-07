import { motion } from "framer-motion";
import { Clock, AlertTriangle, Calendar, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

const applicationDeadlines = [
  {
    id: "1",
    company: "Google",
    position: "Software Engineering Intern",
    deadline: "2024-09-28",
    daysLeft: 4,
    priority: "high",
    status: "not-applied"
  },
  {
    id: "2",
    company: "Microsoft", 
    position: "Product Management Intern",
    deadline: "2024-10-05",
    daysLeft: 11,
    priority: "medium",
    status: "not-applied"
  },
  {
    id: "3",
    company: "Meta",
    position: "Data Science Intern", 
    deadline: "2024-10-15",
    daysLeft: 21,
    priority: "low",
    status: "applied"
  },
  {
    id: "4",
    company: "Apple",
    position: "iOS Development Intern",
    deadline: "2024-10-01",
    daysLeft: 7,
    priority: "high",
    status: "not-applied"
  },
  {
    id: "5",
    company: "Netflix",
    position: "UI/UX Design Intern",
    deadline: "2024-10-20",
    daysLeft: 26,
    priority: "medium",
    status: "not-applied"
  }
];

const priorityConfig = {
  high: {
    color: "bg-destructive text-destructive-foreground",
    icon: AlertTriangle,
    label: "High Priority"
  },
  medium: {
    color: "bg-warning text-warning-foreground",
    icon: Clock,
    label: "Medium Priority"
  },
  low: {
    color: "bg-primary text-primary-foreground",
    icon: Calendar,
    label: "Low Priority"
  }
};

const statusConfig = {
  applied: {
    color: "bg-success text-success-foreground",
    icon: CheckCircle,
    label: "Applied"
  },
  "not-applied": {
    color: "bg-muted text-muted-foreground",
    icon: Clock,
    label: "Not Applied"
  }
};

export const ApplicationDeadlines = () => {
  const sortedDeadlines = applicationDeadlines
    .filter(deadline => deadline.status === "not-applied")
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="shadow-soft hover:shadow-medium transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <AlertTriangle className="mr-2 h-5 w-5 text-primary" />
            Application Deadlines
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {sortedDeadlines.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-success mb-2" />
              <p className="text-muted-foreground">All caught up!</p>
              <p className="text-sm text-muted-foreground">
                No pending application deadlines
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedDeadlines.slice(0, 5).map((deadline, index) => {
                const priorityConf = priorityConfig[deadline.priority];
                const statusConf = statusConfig[deadline.status];
                const PriorityIcon = priorityConf.icon;
                
                return (
                  <motion.div
                    key={deadline.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border rounded-lg hover:bg-card-hover transition-smooth cursor-pointer bg-gradient-card"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1 truncate">
                          {deadline.position}
                        </h4>
                        <p className="text-sm text-muted-foreground font-medium">
                          {deadline.company}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={priorityConf.color}>
                          <PriorityIcon className="h-3 w-3 mr-1" />
                          {deadline.daysLeft} days
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Deadline: {new Date(deadline.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {deadline.daysLeft <= 7 ? "Urgent" : "Upcoming"}
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


