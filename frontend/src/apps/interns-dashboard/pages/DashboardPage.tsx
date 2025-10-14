import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, LogOut, Bot, Crown, Calendar, Settings } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ProfileCard } from "../components/dashboard/ProfileCard";
import { ApplicationsTracker } from "../components/dashboard/ApplicationsTracker";
import { Recommendations } from "../components/dashboard/Recommendations";
import { Offers } from "../components/dashboard/Offers";
import { QuickStats } from "../components/dashboard/QuickStats";
import { TrendingCompanies } from "../components/dashboard/TrendingCompanies";
import { apiClient } from "@/api";
import { useAuth } from "@/auth/AuthContext";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const applicationsRes = await apiClient.get("/api/v1/applications/my-applications");
      setApplications(applicationsRes);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes] = await Promise.all([
          apiClient.get("/api/v1/auth/me"),
        ]);
        setProfile(profileRes);
        
        // Fetch applications separately so we can refresh them
        await fetchApplications();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Responsive Grid Layout - Reorganized by Importance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Profile & Tools */}
          <div className="lg:col-span-3 space-y-6">
            <ProfileCard profile={profile} />
            
            {/* Premium Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => navigate("/pricing")}
                className="w-full h-10 bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 hover:from-yellow-500 hover:via-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 hover:scale-[1.02] text-white font-bold relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Crown className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Go Premium</span>
              </Button>
            </motion.div>
            
            {/* A.U.R.A Button - High Priority */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => navigate("/aura")}
                className="w-full h-12 bg-gradient-to-r from-[#1F7368] to-[#004F4D] hover:shadow-[#63D7C7]/50 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Bot className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">A.U.R.A AI</span>
              </Button>
            </motion.div>
            
            <ApplicationsTracker applications={applications} onRefresh={fetchApplications} />
            
            {/* Secondary Tools */}
            <div className="space-y-4">
              {/* Calendar/Interviews Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => alert("Calendar feature coming soon!")}
                  variant="outline"
                  className="w-full h-10 bg-[#FFFAF3] border-[#1F7368] text-[#1F7368] hover:bg-[#1F7368] hover:text-white transition-all duration-300"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar & Interviews
                </Button>
              </motion.div>
            </div>
            
            {/* Settings and Logout Buttons */}
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button
                  onClick={() => navigate("/interns/settings")}
                  variant="outline"
                  className="w-full bg-[#FFFAF3] border-[#1F7368] text-[#1F7368] hover:bg-[#1F7368] hover:text-white transition-all duration-300"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full bg-[#FFFAF3] border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Main Column - Primary Actions & Content */}
          <div className="lg:col-span-6 space-y-6">
            {/* Most Important: Search & Discover */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Button
                onClick={() => navigate("/interns/internships")}
                className="w-full h-24 text-xl font-bold bg-gradient-to-r from-[#63D7C7] to-[#1F7368] hover:from-[#1F7368] hover:to-[#63D7C7] text-white transition-all duration-500 shadow-2xl hover:shadow-[#63D7C7]/50 hover:scale-[1.02] border-0 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#63D7C7]/0 via-[#63D7C7]/30 to-[#63D7C7]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
                <Search className="mr-4 h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10 group-hover:tracking-wide transition-all duration-300">Search & Discover Internships</span>
              </Button>
            </motion.div>


            {/* Medium Priority: Trending Content */}
            <TrendingCompanies />
            
            {/* Lower Priority: Personalized Content */}
            <Recommendations />
          </div>

          {/* Right Column - Secondary Info & Stats */}
          <div className="lg:col-span-3 space-y-6">
            <QuickStats applications={applications} />
            <Offers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


