import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useToast } from "@/shared/hooks/use-toast";
import { internshipService, InternshipResponse } from "@/services/internship.service";
import {
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Star,
  Users,
  Clock,
  Briefcase,
  CheckCircle,
  Award,
  Heart,
  Share2,
  BookmarkIcon,
  Copy,
  Mail,
  MessageCircle
} from "lucide-react";

interface Internship {
  id: string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Remote' | 'Hybrid';
  duration: string;
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedDate: Date;
  deadline: Date;
  applicants: number;
  rating: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  benefits: string[];
  isBookmarked?: boolean;
}

interface InternshipDetailsModalProps {
  internship: Internship | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (internship: Internship) => void;
  onBookmark: (id: string) => void;
}

const InternshipDetailsModal: React.FC<InternshipDetailsModalProps> = ({
  internship,
  isOpen,
  onClose,
  onApply,
  onBookmark,
}) => {
  const { toast } = useToast();
  const [similarInternships, setSimilarInternships] = useState<InternshipResponse[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Fetch similar internships when modal opens
  useEffect(() => {
    const fetchSimilarInternships = async () => {
      if (!internship || !isOpen) return;
      
      setLoadingSimilar(true);
      try {
        // Get all internships
        const allInternships = await internshipService.getAllInternships();
        
        // Filter out current internship and find ones with matching skills
        const currentSkills = internship.skills || [];
        const similar = allInternships
          .filter((int: InternshipResponse) => String(int.id) !== String(internship.id)) // Exclude current internship
          .map((int: InternshipResponse) => {
            // Calculate skill match score
            const intSkills = int.skills?.toLowerCase().split(',').map((s: string) => s.trim()) || [];
            const matchCount = currentSkills.filter((skill: string) => 
              intSkills.some((intSkill: string) => intSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(intSkill))
            ).length;
            return { ...int, matchScore: matchCount };
          })
          .filter((int: any) => int.matchScore > 0) // Only include if there's at least 1 skill match
          .sort((a: any, b: any) => b.matchScore - a.matchScore) // Sort by match score
          .slice(0, 3); // Take top 3
        
        setSimilarInternships(similar);
      } catch (error) {
        console.error("Error fetching similar internships:", error);
        setSimilarInternships([]);
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilarInternships();
  }, [internship, isOpen]);
  
  if (!internship) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDaysRemaining = (deadline: Date) => {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleShare = async () => {
    const shareData = {
      title: `${internship.title} at ${internship.company}`,
      text: `Check out this ${internship.title} internship opportunity at ${internship.company}. Duration: ${internship.duration}, Salary: ${internship.salary}`,
      url: window.location.origin + `/internship/${internship.id}`
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        // Use Web Share API if available (mobile devices)
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        const shareText = `${shareData.title}\n\n${shareData.text}\n\nApply here: ${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        
        // Show success message with toast
        toast({
          title: "Shared Successfully!",
          description: "Internship details copied to clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy basic info to clipboard
      try {
        const fallbackText = `${internship.title} at ${internship.company} - ${internship.salary} for ${internship.duration}`;
        await navigator.clipboard.writeText(fallbackText);
        toast({
          title: "Shared!",
          description: "Basic internship info copied to clipboard.",
        });
      } catch (clipboardError) {
        console.error('Clipboard access failed:', clipboardError);
        toast({
          title: "Share Failed",
          description: "Unable to share. Please copy the URL manually.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCopyLink = async () => {
    const url = window.location.origin + `/internship/${internship.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Internship link copied to clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy link. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`${internship.title} at ${internship.company}`);
    const body = encodeURIComponent(
      `Hi,\n\nI found this great internship opportunity that might interest you:\n\n` +
      `Position: ${internship.title}\n` +
      `Company: ${internship.company}\n` +
      `Location: ${internship.location}\n` +
      `Duration: ${internship.duration}\n` +
      `Salary: ${internship.salary}\n\n` +
      `Check it out here: ${window.location.origin}/internship/${internship.id}\n\n` +
      `Best regards`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Check out this internship: *${internship.title}* at *${internship.company}*\n\n` +
      `📍 ${internship.location}\n` +
      `⏰ ${internship.duration}\n` +
      `💰 ${internship.salary}\n\n` +
      `Apply here: ${window.location.origin}/internship/${internship.id}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleSave = () => {
    // Save internship to local storage for later viewing
    const savedInternships = JSON.parse(localStorage.getItem('savedInternships') || '[]');
    const isAlreadySaved = savedInternships.some((saved: any) => saved.id === internship.id);
    
    if (!isAlreadySaved) {
      const internshipToSave = {
        id: internship.id,
        title: internship.title,
        company: internship.company,
        location: internship.location,
        salary: internship.salary,
        type: internship.type,
        duration: internship.duration,
        deadline: internship.deadline,
        category: internship.category,
        savedAt: new Date().toISOString()
      };
      
      savedInternships.push(internshipToSave);
      localStorage.setItem('savedInternships', JSON.stringify(savedInternships));
      
      // Also trigger bookmark to update UI
      onBookmark(internship.id);
      
      // Show success message
      toast({
        title: "✅ Saved Successfully!",
        description: "Internship saved to your collection.",
      });
    } else {
      // Remove from saved if already saved (toggle functionality)
      const updatedSaved = savedInternships.filter((saved: any) => saved.id !== internship.id);
      localStorage.setItem('savedInternships', JSON.stringify(updatedSaved));
      onBookmark(internship.id);
      toast({
        title: "📌 Removed",
        description: "Internship removed from saved list.",
      });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-[#63D7C7]/20 text-[#1F7368] border-[#63D7C7]/30';
      case 'Intermediate':
        return 'bg-[#1F7368]/20 text-[#004F4D] border-[#1F7368]/30';
      case 'Advanced':
        return 'bg-[#004F4D]/20 text-[#004F4D] border-[#004F4D]/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Remote':
        return 'bg-[#63D7C7]/20 text-[#1F7368] border-[#63D7C7]/30';
      case 'Hybrid':
        return 'bg-[#1F7368]/20 text-[#004F4D] border-[#1F7368]/30';
      case 'Full-time':
        return 'bg-[#63D7C7]/20 text-[#1F7368] border-[#63D7C7]/30';
      case 'Part-time':
        return 'bg-[#004F4D]/20 text-[#004F4D] border-[#004F4D]/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] h-[95vh] overflow-hidden p-0">
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
                    <p className="text-sm font-medium text-muted-foreground truncate">{internship.company}</p>
                    <div className="flex items-center space-x-2 flex-wrap">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-[#63D7C7] fill-current" />
                        <span className="text-sm font-medium">{internship.rating}</span>
                      </div>
                      <Badge className={getTypeColor(internship.type)}>
                        {internship.type}
                      </Badge>
                      <Badge className={getLevelColor(internship.level)}>
                        {internship.level}
                      </Badge>
                    </div>
                  </div>
                </div>
                <DialogTitle className="text-xl md:text-2xl font-bold text-foreground mb-2 line-clamp-2">
                  {internship.title}
                </DialogTitle>
                <div className="flex items-center space-x-4 text-muted-foreground flex-wrap gap-2">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{internship.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{internship.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <IndianRupee className="w-4 h-4 text-[#1F7368] flex-shrink-0" />
                    <span className="font-medium text-foreground text-sm">{internship.salary}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="p-2"
                  title="Save internship"
                >
                  <BookmarkIcon 
                    className={`w-5 h-5 ${
                      internship.isBookmarked 
                        ? 'fill-current text-primary' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2" 
                      title="Share internship"
                    >
                      <Share2 className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleShare} className="flex items-center space-x-2">
                      <Share2 className="w-4 h-4" />
                      <span>Share via System</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyLink} className="flex items-center space-x-2">
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEmailShare} className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Share via Email</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleWhatsAppShare} className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Share via WhatsApp</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <div className="bg-primary/5 rounded-lg p-3 md:p-4 text-center">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2" />
                      <p className="text-xs md:text-sm text-muted-foreground">Applicants</p>
                      <p className="text-lg md:text-xl font-bold text-foreground">{internship.applicants}</p>
                    </div>
                    <div className="bg-[#63D7C7]/10 rounded-lg p-3 md:p-4 text-center">
                      <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#1F7368] mx-auto mb-2" />
                      <p className="text-xs md:text-sm text-muted-foreground">Days Left</p>
                      <p className="text-lg md:text-xl font-bold text-foreground">{getDaysRemaining(internship.deadline)}</p>
                    </div>
                    <div className="bg-[#1F7368]/10 rounded-lg p-3 md:p-4 text-center">
                      <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-[#004F4D] mx-auto mb-2" />
                      <p className="text-xs md:text-sm text-muted-foreground">Category</p>
                      <p className="text-xs md:text-sm font-bold text-foreground">{internship.category}</p>
                    </div>
                    <div className="bg-[#004F4D]/10 rounded-lg p-3 md:p-4 text-center">
                      <Award className="w-5 h-5 md:w-6 md:h-6 text-[#004F4D] mx-auto mb-2" />
                      <p className="text-xs md:text-sm text-muted-foreground">Posted</p>
                      <p className="text-xs md:text-sm font-bold text-foreground">
                        {formatDate(internship.postedDate).split(' ')[0]} {formatDate(internship.postedDate).split(' ')[1]}
                      </p>
                    </div>
                  </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">About This Internship</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {internship.description}
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {internship.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-[#1F7368] mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills Required */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {internship.skills.map((skill, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="border-primary/30 text-primary bg-primary/5"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Benefits & Perks</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {internship.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-muted-foreground text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Application Deadline */}
                <div className="bg-[#63D7C7]/10 border border-[#63D7C7]/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-[#1F7368]" />
                    <h4 className="font-semibold text-[#004F4D]">Application Deadline</h4>
                  </div>
                  <p className="text-[#1F7368] font-medium">{formatDate(internship.deadline)}</p>
                  <p className="text-[#1F7368] text-sm mt-1">
                    {getDaysRemaining(internship.deadline)} days remaining
                  </p>
                </div>

                {/* Company Info */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3">About {internship.company}</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-[#63D7C7]" />
                      <span>{internship.rating}/5.0 Company Rating</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Based in {internship.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{internship.category} Industry</span>
                    </div>
                  </div>
                </div>

                {/* Similar Internships */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold text-[#004F4D] mb-3">Similar Opportunities</h4>
                  {loadingSimilar ? (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      Loading similar opportunities...
                    </div>
                  ) : similarInternships.length > 0 ? (
                    <div className="space-y-3">
                      {similarInternships.map((similar) => (
                        <div key={similar.id} className="text-sm hover:bg-white/50 p-2 rounded-lg transition-colors cursor-pointer">
                          <p className="font-medium text-[#004F4D]">{similar.title}</p>
                          <p className="text-muted-foreground">{similar.company_name}</p>
                          <p className="text-[#1F7368] text-xs font-semibold">
                            ₹{similar.stipend?.toLocaleString('en-IN')}/month
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {similar.location} • {similar.duration}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      No similar opportunities found
                    </div>
                  )}
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex-shrink-0 border-t bg-muted/20 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-muted-foreground gap-1 sm:gap-0">
                <span>Posted on {formatDate(internship.postedDate)}</span>
                <span className="hidden sm:inline">•</span>
                <span>{internship.applicants} applicants</span>
                <span className="hidden sm:inline">•</span>
                <span className={getDaysRemaining(internship.deadline) <= 7 ? 'text-red-600 font-medium' : ''}>
                  {getDaysRemaining(internship.deadline)} days left
                </span>
              </div>
              <div className="flex space-x-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-[#63D7C7]/30 text-[#1F7368] hover:bg-[#63D7C7]/10 flex-1 sm:flex-none"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    onApply(internship);
                    onClose();
                  }}
                  className="bg-[#1F7368] hover:bg-[#004F4D] text-white px-6 md:px-8 flex-1 sm:flex-none"
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default InternshipDetailsModal;