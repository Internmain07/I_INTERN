import { motion } from "framer-motion";
import { User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const ProfilePage = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Link to="/interns" className="inline-flex items-center mb-6 px-4 py-2 bg-[#FFFAF3] text-[#004F4D] rounded-lg border border-[#63D7C7]/30 hover:bg-white hover:shadow-lg transition-all duration-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>

          <Card className="shadow-xl bg-[#FFFAF3] border-[#63D7C7]/30 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#1F7368] to-[#004F4D] rounded-full flex items-center justify-center mb-4 shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-[#004F4D]">My Profile</CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              <p className="text-[#004F4D]/70">
                This is a placeholder page for the user profile settings. 
                Here you would be able to edit your personal information, skills, and preferences.
              </p>
              
              <div className="space-y-4">
                <Button className="w-full bg-[#1F7368] hover:bg-[#004F4D] text-white shadow-md hover:shadow-lg transition-all duration-300">
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full bg-white border-[#63D7C7] text-[#1F7368] hover:bg-[#63D7C7]/10 hover:border-[#1F7368] transition-all duration-300">
                  Account Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;


