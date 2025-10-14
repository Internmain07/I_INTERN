import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Building } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useEffect, useState } from "react";
import { internshipService, InternshipResponse } from "@/services/internship.service";
import { applicationService } from "@/services/application.service";
import { useToast } from "@/shared/components/ui/use-toast";

const InternshipDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [internship, setInternship] = useState<InternshipResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchInternship = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await internshipService.getInternshipById(id);
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

  const handleApply = async () => {
    if (!internship) return;
    
    setApplying(true);
    try {
      await applicationService.applyForInternship({ 
        internship_id: internship.id 
      });
      
      toast({
        title: "Application Submitted!",
        description: `Your application for ${internship.title} has been submitted successfully.`,
      });
      
      // Navigate to applications page
      setTimeout(() => navigate("/interns/applications"), 1500);
    } catch (error: any) {
      console.error("Error applying:", error);
      const errorMessage = error.message || "Failed to submit application. Please try again.";
      
      toast({
        title: "Application Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Loading internship details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Internship not found</p>
            <Link to="/interns" className="text-primary hover:underline">
              Return to Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Link to="/interns" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>

          <Card className="shadow-medium">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{internship.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Building className="mr-1 h-4 w-4" />
                      <span>{internship.company_name || "Company"}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{internship.location || "Remote"}</span>
                    </div>
                  </div>
                </div>
                {internship.match_percentage && internship.match_percentage > 0 && (
                  <Badge 
                    className={`flex items-center space-x-1 ${
                      internship.match_percentage >= 80 ? 'bg-[#63D7C7]/20 text-[#1F7368] border-[#63D7C7]' :
                      internship.match_percentage >= 60 ? 'bg-[#1F7368]/20 text-[#004F4D] border-[#1F7368]' :
                      internship.match_percentage >= 40 ? 'bg-[#004F4D]/10 text-[#004F4D] border-[#004F4D]/30' :
                      'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                  >
                    <span>{internship.match_percentage.toFixed(0)}% Match</span>
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {internship.description || "No description available"}
                </p>
              </div>

              {/* Stipend & Duration */}
              {(internship.stipend || internship.duration) && (
                <div className="grid grid-cols-2 gap-4">
                  {internship.stipend && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1 text-muted-foreground">Stipend</h4>
                      <p className="text-lg font-semibold text-[#1F7368]">
                        ₹{internship.stipend.toLocaleString()}/month
                      </p>
                    </div>
                  )}
                  {internship.duration && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1 text-muted-foreground">Duration</h4>
                      <p className="text-lg font-semibold">{internship.duration}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Skills */}
              {(internship.skills || internship.required_skills) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {(internship.skills || internship.required_skills || "")
                      .split(',')
                      .map((skill: string) => skill.trim())
                      .filter((skill: string) => skill)
                      .map((skill: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-primary/20 text-primary"
                        >
                          {skill}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {internship.requirements && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Additional Requirements</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {internship.requirements}
                  </p>
                </div>
              )}

              {/* Benefits */}
              {internship.benefits && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {internship.benefits}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button 
                  className="flex-1 bg-gradient-primary"
                  onClick={handleApply}
                  disabled={applying}
                >
                  {applying ? "Applying..." : "Apply Now"}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate("/interns/internships")}
                >
                  Browse More Internships
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default InternshipDetailPage;


