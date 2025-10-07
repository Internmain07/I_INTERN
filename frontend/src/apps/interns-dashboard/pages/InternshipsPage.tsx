import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Search, 
  MapPin, 
  Building2, 
  Calendar, 
  IndianRupee,
  Star, 
  Bookmark, 
  ArrowLeft,
  Clock,
  Users,
  Briefcase
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useDebounce } from "@/shared/hooks/useDebounce";
import InternshipDetailsModal from "../components/InternshipDetailsModal";
import { internshipService } from "@/services/internship.service";
import { applicationService } from "@/services/application.service";
import { useToast } from "@/shared/components/ui/use-toast";

// Enhanced internship interface
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
  matchPercentage?: number;
  matchingSkills?: string[];
  missingSkills?: string[];
}

const InternshipsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch internships from API
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setIsLoading(true);
        // Try to fetch internships with match percentages
        const response = await internshipService.getInternshipsWithMatch();
        
        // Transform API response to match frontend interface
        const transformedInternships = response
          .filter(item => item.status === 'Active') // Only show Active internships to students
          .map(item => ({
            id: item.id,
            title: item.title || 'Untitled Internship',
            company: item.company_name || 'Unknown Company',
            location: item.location || 'Remote',
            type: (item.type || 'Full-time') as 'Full-time' | 'Part-time' | 'Remote' | 'Hybrid',
            duration: item.duration || 'Not specified',
            salary: item.stipend ? `₹${item.stipend.toLocaleString()}/month` : 'Unpaid',
            description: item.description || 'No description available',
            requirements: item.requirements ? item.requirements.split(',').map(r => r.trim()) : [],
            skills: item.skills ? item.skills.split(',').map(s => s.trim()) : [],
            postedDate: item.date_posted ? new Date(item.date_posted) : new Date(),
            deadline: item.deadline ? new Date(item.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            applicants: item.applicant_count || 0,
            rating: 4.0, // TODO: Add company rating from backend
            category: item.category || 'Other',
            level: (item.level || 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced',
            benefits: item.benefits ? item.benefits.split(',').map(b => b.trim()) : [],
            isBookmarked: false,
            matchPercentage: item.match_percentage || 0,
            matchingSkills: item.matching_skills || [],
            missingSkills: item.missing_skills || [],
          }));

        setInternships(transformedInternships);
        setFilteredInternships(transformedInternships);
      } catch (error) {
        console.error('Error fetching internships:', error);
        // Fallback to regular endpoint if match endpoint fails
        try {
          const response = await internshipService.getAllInternships();
          const transformedInternships = response
            .filter(item => item.status === 'Active')
            .map(item => ({
              id: item.id,
              title: item.title || 'Untitled Internship',
              company: item.company_name || 'Unknown Company',
              location: item.location || 'Remote',
              type: (item.type || 'Full-time') as 'Full-time' | 'Part-time' | 'Remote' | 'Hybrid',
              duration: item.duration || 'Not specified',
              salary: item.stipend ? `₹${item.stipend.toLocaleString()}/month` : 'Unpaid',
              description: item.description || 'No description available',
              requirements: item.requirements ? item.requirements.split(',').map(r => r.trim()) : [],
              skills: item.skills ? item.skills.split(',').map(s => s.trim()) : [],
              postedDate: item.date_posted ? new Date(item.date_posted) : new Date(),
              deadline: item.deadline ? new Date(item.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              applicants: 0,
              rating: 4.0,
              category: item.category || 'Other',
              level: (item.level || 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced',
              benefits: item.benefits ? item.benefits.split(',').map(b => b.trim()) : [],
              isBookmarked: false,
            }));
          setInternships(transformedInternships);
          setFilteredInternships(transformedInternships);
        } catch (fallbackError) {
          console.error('Error fetching internships (fallback):', fallbackError);
          setInternships([]);
          setFilteredInternships([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // Auto-open modal if internship ID is in URL
  useEffect(() => {
    const internshipId = searchParams.get('id');
    if (internshipId && internships.length > 0 && !isModalOpen) {
      const internship = internships.find(i => i.id === internshipId);
      if (internship) {
        setSelectedInternship(internship);
        setIsModalOpen(true);
      }
    }
  }, [searchParams, internships, isModalOpen]);

  // Filter and search logic
  useEffect(() => {
    let filtered = internships;

    // Search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (internship) =>
          internship.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          internship.company.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          internship.skills.some(skill => 
            skill.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          )
      );
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter(internship => 
        internship.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(internship => 
        internship.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(internship => 
        internship.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    // Sorting
    switch (sortBy) {
      case "match":
        filtered.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
        break;
      case "newest":
        filtered.sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime());
        break;
      case "salary":
        filtered.sort((a, b) => {
          const salaryA = parseInt(a.salary.replace(/[^\d]/g, ''));
          const salaryB = parseInt(b.salary.replace(/[^\d]/g, ''));
          return salaryB - salaryA;
        });
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "applicants":
        filtered.sort((a, b) => a.applicants - b.applicants);
        break;
      default:
        break;
    }

    setFilteredInternships(filtered);
  }, [debouncedSearchTerm, locationFilter, categoryFilter, typeFilter, sortBy, internships]);

  const toggleBookmark = (id: string) => {
    setFilteredInternships(prev => 
      prev.map(internship => 
        internship.id === id 
          ? { ...internship, isBookmarked: !internship.isBookmarked }
          : internship
      )
    );
  };

  const handleViewDetails = (internship: Internship) => {
    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInternship(null);
    // Remove internship ID from URL when closing modal
    searchParams.delete('id');
    setSearchParams(searchParams);
  };

  const handleApplyFromModal = async (internship: Internship) => {
    await handleApply(internship);
  };

  const handleApply = async (internship: Internship) => {
    try {
      await applicationService.applyForInternship({ 
        internship_id: internship.id 
      });
      
      toast({
        title: "Application Submitted!",
        description: `Your application for ${internship.title} at ${internship.company} has been submitted successfully.`,
      });
      
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error applying:", error);
      const errorMessage = error.message || "Failed to submit application. Please try again.";
      
      toast({
        title: "Application Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getDaysRemaining = (deadline: Date) => {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center bg-[#FFFAF3] p-8 rounded-xl shadow-xl border border-[#63D7C7]/30">
              <Briefcase className="mx-auto h-16 w-16 text-[#1F7368] animate-pulse mb-4" />
              <h3 className="text-xl font-semibold text-[#004F4D] mb-2">
                Loading internships...
              </h3>
              <p className="text-[#004F4D]/70">
                Please wait while we fetch the latest opportunities
              </p>
            </div>
          </div>
        ) : (
          <>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/interns')}
                variant="ghost"
                className="bg-[#FFFAF3] text-[#004F4D] hover:bg-white border border-[#63D7C7]/30 hover:shadow-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-[#FFFAF3]">
                  Discover Internships
                </h1>
                <p className="text-[#FFFAF3]/80">
                  Find your perfect internship opportunity
                </p>
              </div>
            </div>
            <div className="text-right bg-[#FFFAF3] px-6 py-3 rounded-xl border border-[#63D7C7]/30 shadow-lg">
              <p className="text-2xl font-bold text-[#1F7368]">
                {filteredInternships.length}
              </p>
              <p className="text-sm text-[#004F4D]/70">
                {filteredInternships.length === 1 ? 'Opportunity' : 'Opportunities'}
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="p-6 bg-[#FFFAF3] border-[#63D7C7]/30 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search internships, companies, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="data science">Data Science</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Work Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="applicants">Least Competitive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        {/* Internships Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInternships.map((internship, index) => (
            <motion.div
              key={internship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col bg-[#FFFAF3] hover:shadow-xl transition-all duration-300 border border-[#63D7C7]/30 hover:border-[#1F7368]/50">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Building2 className="w-4 h-4 text-[#1F7368]" />
                        <span className="text-sm font-medium text-[#004F4D]">
                          {internship.company}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-[#63D7C7] fill-current" />
                          <span className="text-xs text-[#004F4D]/70">
                            {internship.rating}
                          </span>
                        </div>
                        {internship.matchPercentage !== undefined && internship.matchPercentage > 0 && (
                          <Badge 
                            className={`text-xs font-semibold ${
                              internship.matchPercentage >= 80 ? 'bg-[#63D7C7]/20 text-[#004F4D] border-[#1F7368]/50' :
                              internship.matchPercentage >= 60 ? 'bg-[#1F7368]/20 text-[#004F4D] border-[#1F7368]/50' :
                              internship.matchPercentage >= 40 ? 'bg-[#63D7C7]/10 text-[#1F7368] border-[#63D7C7]/50' :
                              'bg-gray-100 text-gray-700 border-gray-300'
                            }`}
                          >
                            {internship.matchPercentage.toFixed(0)}% Match
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg font-semibold text-[#004F4D] mb-2">
                        {internship.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-[#004F4D]/70">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{internship.location}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs bg-[#63D7C7]/20 text-[#004F4D] border-[#63D7C7]/30">
                          {internship.type}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookmark(internship.id)}
                      className="p-2 h-8 w-8 hover:bg-[#63D7C7]/10"
                    >
                      <Bookmark 
                        className={`w-4 h-4 ${
                          internship.isBookmarked 
                            ? 'fill-current text-[#1F7368]' 
                            : 'text-[#004F4D]/50'
                        }`} 
                      />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-[#004F4D]/70 mb-4 line-clamp-3">
                    {internship.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="w-4 h-4 text-[#1F7368]" />
                      <span className="text-sm font-medium text-[#004F4D]">
                        {internship.salary}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-[#1F7368]" />
                      <span className="text-sm text-[#004F4D]">
                        {internship.duration}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-[#1F7368]" />
                      <span className="text-sm text-[#004F4D]">
                        {internship.applicants} applied
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[#1F7368]" />
                      <span className="text-sm text-[#004F4D]">
                        {getDaysRemaining(internship.deadline)} days left
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-[#004F4D]/70 mb-2">Skills Required:</p>
                    <div className="flex flex-wrap gap-1">
                      {internship.skills.slice(0, 3).map((skill, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="text-xs border-[#1F7368]/30 text-[#1F7368] bg-[#63D7C7]/10"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {internship.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs border-[#1F7368]/30 text-[#004F4D]">
                          +{internship.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-[#63D7C7]/20">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-[#1F7368] text-[#1F7368] hover:bg-[#63D7C7]/10 hover:border-[#1F7368]"
                        onClick={() => handleViewDetails(internship)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-[#1F7368] hover:bg-[#004F4D] text-white shadow-md hover:shadow-lg"
                        onClick={() => handleApply(internship)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredInternships.length === 0 && (
          <div className="text-center py-12 bg-[#FFFAF3] rounded-xl shadow-xl border border-[#63D7C7]/30 mx-auto max-w-md">
            <Briefcase className="mx-auto h-16 w-16 text-[#1F7368] mb-4" />
            <h3 className="text-xl font-semibold text-[#004F4D] mb-2">
              No internships found
            </h3>
            <p className="text-[#004F4D]/70 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setLocationFilter("all");
                setCategoryFilter("all");
                setTypeFilter("all");
              }}
              variant="outline"
              className="bg-white border-[#63D7C7] text-[#1F7368] hover:bg-[#63D7C7]/10 hover:border-[#1F7368]"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Internship Details Modal */}
        <InternshipDetailsModal
          internship={selectedInternship}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onApply={handleApplyFromModal}
          onBookmark={toggleBookmark}
        />
          </>
        )}
      </div>
    </div>
  );
};

export default InternshipsPage;