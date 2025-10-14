import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useEffect, useState } from "react";
import { internshipService, InternshipResponse } from "@/services/internship.service";

export const Recommendations = () => {
  const navigate = useNavigate();
  const [internshipsWithMatch, setInternshipsWithMatch] = useState<InternshipResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Fetch internships with match percentages
        const data = await internshipService.getInternshipsWithMatch();
        setInternshipsWithMatch(data.slice(0, 3)); // Top 3 matches
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setInternshipsWithMatch([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);
  
  // Convert API internships to display format
  const displayRecommendations = internshipsWithMatch.map(rec => ({
    id: String(rec.id),
    title: rec.title,
    company: rec.company_name || "Company",
    location: rec.location || "Remote",
    description: rec.description || "No description available",
    skills: rec.skills ? rec.skills.split(',').map(s => s.trim()) : [],
    matchPercentage: rec.match_percentage || 0
  }));

  const handleRecommendationClick = (id: string) => {
    navigate(`/interns/internships?id=${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-[#63D7C7]/30 bg-[#FFFAF3] hover:border-[#63D7C7]/50 overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1F7368]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading recommendations...</p>
            </div>
          ) : displayRecommendations.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No recommendations yet</p>
              <p className="text-sm text-muted-foreground">Complete your profile to get personalized recommendations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayRecommendations.map((recommendation, index) => {
                const matchPercentage = recommendation.matchPercentage || 0;
                const getMatchColor = (match: number) => {
                  if (match >= 80) return 'bg-[#63D7C7]/20 text-[#004F4D] border-[#1F7368]/50';
                  if (match >= 60) return 'bg-[#1F7368]/20 text-[#004F4D] border-[#1F7368]/50';
                  if (match >= 40) return 'bg-[#63D7C7]/10 text-[#1F7368] border-[#63D7C7]/50';
                  return 'bg-gray-100 text-gray-700 border-gray-300';
                };

                return (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={() => handleRecommendationClick(recommendation.id)}
                    className="p-4 border border-[#63D7C7]/30 rounded-xl hover:shadow-xl hover:bg-white hover:scale-[1.02] hover:border-[#1F7368]/50 transition-all duration-300 cursor-pointer bg-white/50 backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground truncate">
                            {recommendation.title}
                          </span>
                          {matchPercentage > 0 && (
                            <Badge
                              className={`text-xs font-semibold shrink-0 ${getMatchColor(matchPercentage)}`}
                              variant="outline"
                            >
                              {matchPercentage.toFixed(0)}% Match
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {recommendation.company}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {recommendation.location}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {recommendation.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(recommendation.skills || []).slice(0, 3).map((req, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs border-primary/20 text-primary"
                        >
                          {req}
                        </Badge>
                      ))}
                      {(recommendation.skills || []).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(recommendation.skills || []).length - 3} more
                        </Badge>
                      )}
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