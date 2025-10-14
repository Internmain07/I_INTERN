import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Building, ExternalLink, Lock, Calendar, IndianRupee, Clock, Users, Bookmark } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useEffect, useState } from "react";
import { internshipService, InternshipResponse } from "@/services/internship.service";
import { useToast } from "@/shared/components/ui/use-toast";
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const PublicInternshipPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [internship, setInternship] = useState<InternshipResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternship = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await internshipService.getPublicInternshipById(id);
        setInternship(data);
      } catch (error) {
        console.error("Error fetching internship:", error);
        toast({
          title: "Error",
          description: "Failed to load internship details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id, toast]);

  const handleLoginToViewDetails = (internshipId: string) => {
    navigate(`/login?returnUrl=/interns/internship/${internshipId}`);
  };

  const handleBookmark = (internshipId: string) => {
    navigate(`/register/student?returnUrl=/browse-internships&bookmark=${internshipId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#B3EDEB] border-t-[#1F7368] mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading internship details...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  if (!internship) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">Internship not found or no longer available</p>
              <Link to="/browse-internships" className="text-primary hover:underline">
                Browse All Internships
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#63D7C7] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#B3EDEB] rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Link to="/browse-internships" className="inline-flex items-center mb-6 text-[#B3EDEB] hover:text-white transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse All Internships
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-[#B3EDEB] to-white bg-clip-text text-transparent">
              Shared Internship
            </h1>
            <p className="text-lg md:text-xl text-[#B3EDEB] mb-6 font-light">
              Login or sign up to view full details and apply for this opportunity.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Internship Card Section */}
      <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-[#FFFAF3]/30 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card className="hover:shadow-2xl hover:shadow-[#63D7C7]/20 transition-all duration-300 border-[#B3EDEB]/50 hover:border-[#63D7C7] bg-white/80 backdrop-blur-sm ring-2 ring-[#63D7C7]/30">
            <CardHeader className="bg-gradient-to-br from-[#FFFAF3] to-white border-b border-[#B3EDEB]/30">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#004F4D] to-[#1F7368] bg-clip-text text-transparent line-clamp-2 flex-1">
                  {internship.title}
                </h3>
                <div className="flex gap-2 ml-2">
                  <Badge variant="secondary" className="bg-[#B3EDEB]/30 text-[#004F4D] font-semibold whitespace-nowrap">
                    {internship.level || 'Open'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleBookmark(internship.id)}
                    className="h-8 w-8 text-[#1F7368] hover:text-[#004F4D] hover:bg-[#B3EDEB]/30"
                    title="Save for later (requires login)"
                  >
                    <Bookmark size={18} />
                  </Button>
                </div>
              </div>
              <div className="flex items-center text-[#1F7368] mb-2 font-medium">
                <Building size={16} className="mr-2" />
                <span>{internship.company_name || "Company"}</span>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <div className="bg-gradient-to-br from-[#63D7C7]/20 to-[#B3EDEB]/20 p-1.5 rounded-lg mr-3">
                    <MapPin size={16} className="text-[#1F7368]" />
                  </div>
                  <span>{internship.location || "Remote"}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <div className="bg-gradient-to-br from-[#63D7C7]/20 to-[#B3EDEB]/20 p-1.5 rounded-lg mr-3">
                    <IndianRupee size={16} className="text-[#1F7368]" />
                  </div>
                  <span className="font-semibold text-[#004F4D]">
                    {internship.stipend && internship.stipend > 0
                      ? `₹${internship.stipend.toLocaleString()}/month`
                      : 'Unpaid'}
                  </span>
                </div>

                <div className="flex items-center text-gray-700">
                  <div className="bg-gradient-to-br from-[#63D7C7]/20 to-[#B3EDEB]/20 p-1.5 rounded-lg mr-3">
                    <Clock size={16} className="text-[#1F7368]" />
                  </div>
                  <span>{internship.duration || "Not specified"}</span>
                </div>

                {internship.date_posted && (
                  <div className="flex items-center text-gray-700">
                    <div className="bg-gradient-to-br from-[#63D7C7]/20 to-[#B3EDEB]/20 p-1.5 rounded-lg mr-3">
                      <Calendar size={16} className="text-[#1F7368]" />
                    </div>
                    <span className="text-sm">Posted: {formatDate(internship.date_posted)}</span>
                  </div>
                )}

                <div className="flex items-center text-gray-700">
                  <div className="bg-gradient-to-br from-[#63D7C7]/20 to-[#B3EDEB]/20 p-1.5 rounded-lg mr-3">
                    <Users size={16} className="text-[#1F7368]" />
                  </div>
                  <span className="text-sm">{internship.applicant_count || 0} applicants</span>
                </div>

                <div className="flex gap-2 flex-wrap mt-3">
                  {internship.category && (
                    <Badge variant="outline" className="border-[#1F7368]/30 text-[#004F4D] bg-[#B3EDEB]/10">
                      {internship.category}
                    </Badge>
                  )}
                  {internship.type && (
                    <Badge variant="outline" className="border-[#63D7C7]/30 text-[#1F7368] bg-[#63D7C7]/10">
                      {internship.type}
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                onClick={() => handleLoginToViewDetails(internship.id)}
                className="w-full bg-gradient-to-r from-[#1F7368] to-[#004F4D] hover:from-[#004F4D] hover:to-[#1F7368] text-white shadow-lg shadow-[#1F7368]/30 hover:shadow-xl hover:shadow-[#004F4D]/40 transition-all duration-300 font-semibold"
              >
                <Lock size={16} className="mr-2" />
                Login to View Details & Apply
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-[#1F7368] to-[#63D7C7] p-8 rounded-xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Interested in this internship?</h3>
            <p className="mb-6 opacity-90 text-lg">
              Join I-Intern to view full details, apply with one click, and discover thousands of other opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register/student">
                <Button 
                  variant="secondary"
                  className="bg-white text-[#1F7368] hover:bg-gray-100 font-semibold px-8 py-3 w-full sm:w-auto"
                  size="lg"
                >
                  Sign Up as Student
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  variant="outline"
                  className="bg-white text-[#1F7368] hover:bg-gray-100 font-semibold px-8 py-3 w-full sm:w-auto"
                  size="lg"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Browse More Section */}
        <div className="text-center mt-12">
          <Link to="/browse-internships">
            <Button 
              variant="outline" 
              className="inline-flex items-center border-[#1F7368] text-[#004F4D] hover:bg-[#B3EDEB]/20 px-8 py-3"
              size="lg"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Browse More Internships
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PublicInternshipPage;