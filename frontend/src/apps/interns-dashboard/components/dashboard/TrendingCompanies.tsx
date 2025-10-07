import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const TrendingCompanies = () => {
  // No mock data - component will show empty state
  const trendingCompanies: any[] = [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-[#63D7C7]/30 bg-[#FFFAF3] hover:border-[#63D7C7]/50 overflow-hidden group">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#63D7C7]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center text-lg text-[#004F4D]">
            <TrendingUp className="mr-2 h-5 w-5 text-[#1F7368]" />
            Trending Companies
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10">
          {trendingCompanies.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="mx-auto h-12 w-12 text-[#1F7368] mb-2" />
              <p className="text-[#004F4D]/70">No trending companies available</p>
              <p className="text-sm text-[#004F4D]/50">Check back later for updates</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Companies would be rendered here if data exists */}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};


