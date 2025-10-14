import { motion } from "framer-motion";
import { Gift, IndianRupee, Calendar, CheckCircle, Clock, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useEffect, useState } from "react";
import { applicationService, OfferResponse } from "@/services/application.service";
import OfferDetailsModal from "./OfferDetailsModal";
import { internshipService } from "@/services/internship.service";

const statusConfig = {
  pending: {
    icon: Clock,
    color: "bg-warning text-warning-foreground",
    label: "Pending"
  },
  offered: {
    icon: Clock,
    color: "bg-warning text-warning-foreground",
    label: "Offered"
  },
  accepted: {
    icon: CheckCircle,
    color: "bg-success text-success-foreground",
    label: "Accepted"
  },
  declined: {
    icon: X,
    color: "bg-destructive text-destructive-foreground",
    label: "Declined"
  },
  hired: {
    icon: CheckCircle,
    color: "bg-primary text-primary-foreground",
    label: "Hired"
  }
};

export const Offers = () => {
  const [offers, setOffers] = useState<OfferResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<OfferResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchPercentages, setMatchPercentages] = useState<Record<string, number>>({});

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getMyOffers();
      setOffers(data);

      // Fetch match percentages for each internship
      try {
        const internshipsWithMatch = await internshipService.getInternshipsWithMatch();
        const matchMap: Record<string, number> = {};
        internshipsWithMatch.forEach(internship => {
          matchMap[internship.id] = internship.match_percentage || 0;
        });
        setMatchPercentages(matchMap);
      } catch (matchError) {
        console.error("Error fetching match percentages:", matchError);
      }
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleOfferClick = (offer: OfferResponse) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOffer(null);
  };

  const handleOfferResponded = () => {
    // Refresh the offers list after responding
    fetchOffers();
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-[#63D7C7]/30 bg-[#FFFAF3] hover:border-[#63D7C7]/50 overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#63D7C7]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center text-lg">
              <Gift className="mr-2 h-5 w-5 text-primary" />
              My Offers
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading offers...</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-[#63D7C7]/30 bg-[#FFFAF3] hover:border-[#63D7C7]/50 overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#63D7C7]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center text-lg">
            <Gift className="mr-2 h-5 w-5 text-[#1F7368]" />
            My Offers
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10">
          {error ? (
            <div className="text-center py-8">
              <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No offers yet</p>
              <p className="text-sm text-muted-foreground">
                Keep applying to get your first offer
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer, index) => {
                // Normalize status to lowercase for mapping
                const normalizedStatus = offer.status?.toLowerCase?.() || 'pending';
                const config = statusConfig[normalizedStatus as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = config.icon;
                const matchPercentage = matchPercentages[offer.internship_id] || 0;

                const getMatchColor = (match: number) => {
                  if (match >= 80) return 'bg-[#63D7C7]/20 text-[#004F4D] border-[#1F7368]/50';
                  if (match >= 60) return 'bg-[#1F7368]/20 text-[#004F4D] border-[#1F7368]/50';
                  if (match >= 40) return 'bg-[#63D7C7]/10 text-[#1F7368] border-[#63D7C7]/50';
                  return 'bg-gray-100 text-gray-700 border-gray-300';
                };

                return (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleOfferClick(offer)}
                    className="p-4 border border-[#63D7C7]/30 rounded-xl hover:bg-white hover:shadow-xl hover:scale-[1.02] hover:border-[#1F7368]/50 transition-all duration-300 cursor-pointer bg-white/50 backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">
                            {offer.title}
                          </h4>
                          {matchPercentage > 0 && (
                            <Badge
                              className={`text-xs font-semibold shrink-0 ${getMatchColor(matchPercentage)}`}
                              variant="outline"
                            >
                              {matchPercentage.toFixed(0)}% Match
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">
                          {offer.company}
                        </p>
                      </div>
                      <Badge className={`ml-2 shrink-0 ${config.color} flex items-center space-x-1`}>
                        <StatusIcon className="h-3 w-3" />
                        <span className="text-xs">{config.label}</span>
                      </Badge>
                    </div>

                    {offer.salary && (
                      <div className="flex items-center space-x-2 mb-1">
                        <IndianRupee className="h-3 w-3 text-[#1F7368]" />
                        <span className="text-xs text-[#1F7368] font-medium">
                          {offer.salary}
                        </span>
                      </div>
                    )}

                    {offer.offer_sent_date && (
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Offer sent on {new Date(offer.offer_sent_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    )}

                    {offer.location && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          📍 {offer.location}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Offer Details Modal */}
      <OfferDetailsModal
        offer={selectedOffer}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onOfferResponded={handleOfferResponded}
      />
    </motion.div>
  );
};


