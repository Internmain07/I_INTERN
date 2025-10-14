import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Clock,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  Award,
} from "lucide-react";
import { OfferResponse, applicationService } from "@/services/application.service";
import { internshipService, InternshipResponse } from "@/services/internship.service";

interface OfferDetailsModalProps {
  offer: OfferResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onOfferResponded: () => void;
}

const OfferDetailsModal: React.FC<OfferDetailsModalProps> = ({
  offer,
  isOpen,
  onClose,
  onOfferResponded,
}) => {
  const { toast } = useToast();
  const [internship, setInternship] = useState<InternshipResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [responding, setResponding] = useState(false);
  
  useEffect(() => {
    if (offer && offer.internship_id) {
      fetchInternshipDetails();
    }
  }, [offer]);

  const fetchInternshipDetails = async () => {
    if (!offer?.internship_id) return;
    
    try {
      setLoading(true);
      const data = await internshipService.getInternshipById(offer.internship_id);
      setInternship(data);
    } catch (error) {
      console.error("Error fetching internship details:", error);
      toast({
        title: "Error",
        description: "Failed to load internship details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (response: 'accepted' | 'declined') => {
    if (!offer) return;

    try {
      setResponding(true);
      await applicationService.respondToOffer(offer.application_id, response);
      
      toast({
        title: response === 'accepted' ? "✅ Offer Accepted!" : "❌ Offer Declined",
        description: response === 'accepted' 
          ? `Congratulations! You've accepted the offer from ${offer.company}. The company will be notified.`
          : `You've declined the offer from ${offer.company}. The company will be notified.`,
      });
      
      onOfferResponded();
      onClose();
    } catch (error: any) {
      console.error("Error responding to offer:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to respond to offer",
        variant: "destructive",
      });
    } finally {
      setResponding(false);
    }
  };

  if (!offer) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDaysRemaining = (dateStr: string | null) => {
    if (!dateStr) return null;
    const deadline = new Date(dateStr);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOfferPending = offer.status.toLowerCase() === 'offered';
  const isOfferAccepted = offer.status.toLowerCase() === 'accepted';
  const isOfferDeclined = offer.status.toLowerCase() === 'declined';

  const getStatusBadge = () => {
    if (isOfferAccepted) {
      return (
        <Badge className="bg-success text-success-foreground flex items-center space-x-1">
          <CheckCircle className="h-3 w-3" />
          <span>Accepted</span>
        </Badge>
      );
    }
    if (isOfferDeclined) {
      return (
        <Badge className="bg-destructive text-destructive-foreground flex items-center space-x-1">
          <XCircle className="h-3 w-3" />
          <span>Declined</span>
        </Badge>
      );
    }
    return (
      <Badge className="bg-warning text-warning-foreground flex items-center space-x-1">
        <Clock className="h-3 w-3" />
        <span>Pending Response</span>
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] h-[95vh] overflow-hidden p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex flex-col h-full max-h-[95vh]"
        >
          {/* Header */}
          <DialogHeader className="flex-shrink-0 p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-muted-foreground truncate">{offer.company}</p>
                    {getStatusBadge()}
                  </div>
                </div>
                <DialogTitle className="text-xl md:text-2xl font-bold text-foreground mb-2 line-clamp-2">
                  {offer.title}
                </DialogTitle>
                <div className="flex items-center space-x-4 text-muted-foreground flex-wrap gap-2">
                  {offer.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{offer.location}</span>
                    </div>
                  )}
                  {offer.duration && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{offer.duration}</span>
                    </div>
                  )}
                  {offer.salary && (
                    <div className="flex items-center space-x-1">
                      <IndianRupee className="w-4 h-4 text-[#1F7368] flex-shrink-0" />
                      <span className="font-medium text-foreground text-sm">{offer.salary}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading internship details...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Important Notice for Pending Offers */}
                  {isOfferPending && (
                    <div className="bg-[#63D7C7]/10 border border-[#63D7C7]/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-[#1F7368] flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-[#004F4D] mb-1">🎉 Congratulations! You have an offer!</h4>
                          <p className="text-[#1F7368] text-sm">
                            Please review the internship details carefully before accepting or declining this offer.
                            Once you respond, the company will be notified of your decision.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Offer Timeline */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Offer Timeline</h3>
                    <div className="space-y-3">
                      {offer.application_date && (
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-[#63D7C7]/20 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-[#1F7368]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Application Submitted</p>
                            <p className="text-xs text-muted-foreground">{formatDate(offer.application_date)}</p>
                          </div>
                        </div>
                      )}
                      {offer.offer_sent_date && (
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-[#63D7C7]/30 flex items-center justify-center flex-shrink-0">
                            <Award className="w-4 h-4 text-[#004F4D]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Offer Received</p>
                            <p className="text-xs text-muted-foreground">{formatDate(offer.offer_sent_date)}</p>
                          </div>
                        </div>
                      )}
                      {offer.offer_response_date && (
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isOfferAccepted ? 'bg-[#1F7368]/20' : 'bg-red-100'
                          }`}>
                            {isOfferAccepted ? (
                              <CheckCircle className="w-4 h-4 text-[#1F7368]" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {isOfferAccepted ? 'Offer Accepted' : 'Offer Declined'}
                            </p>
                            <p className="text-xs text-muted-foreground">{formatDate(offer.offer_response_date)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Internship Details */}
                  {internship && (
                    <>
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {offer.type && (
                          <div className="bg-primary/5 rounded-lg p-4 text-center">
                            <Briefcase className="w-6 h-6 text-primary mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">Type</p>
                            <p className="text-sm font-bold text-foreground">{offer.type}</p>
                          </div>
                        )}
                        {internship.deadline && (
                          <div className="bg-[#63D7C7]/10 rounded-lg p-4 text-center">
                            <Clock className="w-6 h-6 text-[#1F7368] mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">Application Deadline</p>
                            <p className="text-sm font-bold text-foreground">
                              {getDaysRemaining(internship.deadline) !== null 
                                ? `${getDaysRemaining(internship.deadline)} days`
                                : formatDate(internship.deadline)
                              }
                            </p>
                          </div>
                        )}
                        {internship.category && (
                          <div className="bg-[#004F4D]/10 rounded-lg p-4 text-center">
                            <Award className="w-6 h-6 text-[#004F4D] mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">Category</p>
                            <p className="text-sm font-bold text-foreground">{internship.category}</p>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {internship.description && (
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-3">About This Internship</h3>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {internship.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Requirements */}
                      {internship.requirements && (
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-3">Requirements</h3>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {internship.requirements}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Skills Required */}
                      {(internship.skills || internship.required_skills) && (
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-3">Skills Required</h3>
                          <div className="flex flex-wrap gap-2">
                            {(internship.skills || internship.required_skills)?.split(',').map((skill, index) => (
                              <Badge 
                                key={index}
                                variant="outline" 
                                className="border-primary/30 text-primary bg-primary/5"
                              >
                                {skill.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Benefits */}
                      {internship.benefits && (
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-3">Benefits & Perks</h3>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {internship.benefits}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex-shrink-0 border-t bg-muted/20 p-6">
            {isOfferPending ? (
              <div className="space-y-4">
                <div className="bg-[#63D7C7]/10 border border-[#63D7C7]/30 rounded-lg p-3">
                  <p className="text-sm text-[#004F4D] text-center">
                    <strong>Important:</strong> Please make your decision carefully. Once you respond, it cannot be changed.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={responding}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleResponse('declined')}
                    disabled={responding}
                    className="flex-1"
                  >
                    {responding ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Declining...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline Offer
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleResponse('accepted')}
                    disabled={responding}
                    className="flex-1 bg-success hover:bg-success/90"
                  >
                    {responding ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Accepting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Offer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {isOfferAccepted && (
                    <p className="text-success font-medium">✅ You accepted this offer on {formatDate(offer.offer_response_date)}</p>
                  )}
                  {isOfferDeclined && (
                    <p className="text-destructive font-medium">❌ You declined this offer on {formatDate(offer.offer_response_date)}</p>
                  )}
                </div>
                <Button onClick={onClose}>Close</Button>
              </div>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferDetailsModal;
