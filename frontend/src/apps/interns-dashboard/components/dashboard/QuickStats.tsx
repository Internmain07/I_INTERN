import { motion } from "framer-motion";
import { FileText, Coins, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { mockUser } from "@/shared/data/mockData";
import { useEffect, useState } from "react";
import { applicationService, OfferResponse } from "@/services/application.service";

interface Application {
  id: number;
  status: string;
  applicant_id: number;
  internship_id: number;
}

interface QuickStatsProps {
  applications: Application[];
}

export const QuickStats = ({ applications }: QuickStatsProps) => {
  const [offers, setOffers] = useState<OfferResponse[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await applicationService.getMyOffers();
        setOffers(data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  const totalApplications = applications?.length || mockUser.completedApplications;
  // Count offers that have been accepted by the student
  const acceptedCount = offers.filter(offer => offer.status.toLowerCase() === 'accepted').length;
  
  const statItems = [
    {
      label: "Applications",
      value: totalApplications,
      icon: FileText,
      color: "text-[#1F7368]",
      bgColor: "bg-[#63D7C7]/20",
      description: "Total applications sent"
    },
    {
      label: "Credits",
      value: "250", // Display as string to add currency symbol if needed
      icon: Coins,
      color: "text-[#004F4D]",
      bgColor: "bg-[#63D7C7]/30",
      description: "Available for premium features"
    },
    {
      label: "Accepted Internships",
      value: acceptedCount,
      icon: CheckCircle,
      color: "text-[#1F7368]",
      bgColor: "bg-[#63D7C7]/20",
      description: "Successfully accepted"
    }
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-[#63D7C7]/30 bg-[#FFFAF3] hover:border-[#63D7C7]/50 overflow-hidden group">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#63D7C7]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="pb-4 relative z-10">
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="mr-2 h-5 w-5 text-[#1F7368]" />
            My Stats
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Your personal internship journey overview
          </p>
        </CardHeader>
        
        <CardContent className="pt-0 relative z-10">
          <div className="grid grid-cols-1 gap-3">
            {statItems.map((item, index) => {
              const Icon = item.icon;
              
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-4 rounded-xl hover:bg-white transition-all duration-300 border border-transparent hover:border-[#63D7C7]/50 hover:shadow-lg cursor-pointer group"
                >
                  <div className={`p-3 rounded-xl ${item.bgColor} flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <Icon className={`h-5 w-5 ${item.color} group-hover:rotate-12 transition-transform duration-300`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.label}</p>
                    <p className="text-xs text-muted-foreground truncate mb-1">{item.description}</p>
                    <motion.div 
                      className="flex items-baseline space-x-1"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <span className="text-2xl font-bold text-foreground">
                        {item.value}
                      </span>
                      {item.label === "Credits" && (
                        <span className="text-xs text-muted-foreground">pts</span>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


