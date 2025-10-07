import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileText, Mail, Home, UserPen } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface ProfileCardProps {
  profile: {
    id: number;
    email: string;
    role: string;
    name?: string | null;
    skills?: string | null;
    avatar_url?: string | null;
  } | null;
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  const navigate = useNavigate();
  
  // Use profile data if available, otherwise use mock data
  const displayName = profile?.name || (profile?.email ? profile.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'User');
  const displayEmail = profile?.email || 'user@example.com';
  const displaySkills = profile?.skills && profile.skills.trim() ? profile.skills.split(',').map(s => s.trim()).filter(s => s) : [];
  const displayAvatar = profile?.avatar_url ? `${API_URL}${profile.avatar_url}` : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-[#63D7C7]/30 bg-[#FFFAF3] hover:border-[#63D7C7]/50 overflow-hidden group relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#63D7C7]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Home Icon - Top Left Corner */}
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-[#FFFAF3] border border-[#63D7C7]/30 hover:border-[#1F7368] hover:bg-[#63D7C7]/10 transition-all duration-300 shadow-md hover:shadow-lg group/home"
          title="Go to Landing Page"
        >
          <Home className="h-4 w-4 text-[#1F7368] group-hover/home:text-[#004F4D] transition-colors" />
        </motion.button>

        <CardHeader className="text-center pb-2 relative pt-12">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="mx-auto mb-4"
          >
            <Avatar className="h-24 w-24 ring-4 ring-[#63D7C7]/50 shadow-lg hover:ring-[#1F7368] transition-all duration-300">
              <AvatarImage src={displayAvatar} alt={displayName} />
              <AvatarFallback className="text-xl bg-[#63D7C7] text-[#004F4D]">
                {displayName.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <CardTitle className="text-xl text-[#004F4D]">{displayName}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Contact Info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-[#1F7368]">
              <Mail className="h-4 w-4" />
              <span>{displayEmail}</span>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-[#004F4D]">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {displaySkills.length > 0 ? displaySkills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-[#63D7C7]/20 text-[#004F4D] hover:bg-[#63D7C7]/30"
                  >
                    {skill}
                  </Badge>
                </motion.div>
              )) : (
                <p className="text-sm text-gray-500">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Edit Profile Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => navigate("/interns/profile")}
                className="w-full bg-[#FFFAF3] border-2 border-[#1F7368] text-[#1F7368] hover:bg-[#63D7C7]/10 hover:border-[#004F4D] hover:text-[#004F4D] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <UserPen className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </motion.div>

            {/* Build Resume Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => navigate("/interns/build-resume")}
                className="w-full bg-[#1F7368] hover:bg-[#004F4D] text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FileText className="mr-2 h-4 w-4" />
                Build Resume
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

