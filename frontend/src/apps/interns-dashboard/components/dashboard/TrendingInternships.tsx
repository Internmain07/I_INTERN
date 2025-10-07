import { motion } from "framer-motion";
import { TrendingUp, MapPin, Clock, Users } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

const trendingInternships = [
  {
    id: 1,
    title: "Software Engineering Intern",
    company: "Microsoft",
    location: "Seattle, WA",
    type: "Remote",
    duration: "12 weeks",
    applicants: 2500,
    trend: "Hot",
    postedDate: "2 days ago",
    skills: ["React", "TypeScript", "Node.js"]
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "Google",
    location: "Mountain View, CA",
    type: "Hybrid",
    duration: "16 weeks",
    applicants: 3200,
    trend: "Rising",
    postedDate: "1 day ago",
    skills: ["Python", "Machine Learning", "SQL"]
  },
  {
    id: 3,
    title: "Product Design Intern",
    company: "Apple",
    location: "Cupertino, CA",
    type: "On-site",
    duration: "12 weeks",
    applicants: 1800,
    trend: "Hot",
    postedDate: "3 hours ago",
    skills: ["Figma", "UI/UX", "Prototyping"]
  },
  {
    id: 4,
    title: "Marketing Intern",
    company: "Meta",
    location: "Menlo Park, CA",
    type: "Remote",
    duration: "10 weeks",
    applicants: 1200,
    trend: "Rising",
    postedDate: "1 day ago",
    skills: ["Analytics", "Social Media", "Content"]
  }
];

export const TrendingInternships = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending Internships
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendingInternships.map((internship, index) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                className="p-4 rounded-lg border hover:border-primary/50 transition-all cursor-pointer bg-card"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{internship.title}</h4>
                    <p className="text-muted-foreground text-xs">{internship.company}</p>
                  </div>
                  <Badge 
                    variant={internship.trend === "Hot" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {internship.trend}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {internship.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {internship.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {internship.applicants}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {internship.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs py-0 px-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <Badge variant="secondary" className="text-xs">
                    {internship.type}
                  </Badge>
                  <span className="text-muted-foreground">{internship.postedDate}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


