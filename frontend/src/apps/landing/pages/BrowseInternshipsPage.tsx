import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Building2,
  Calendar,
  IndianRupee,
  Briefcase,
  Clock,
  Users,
  Lock,
  ArrowRight,
  Filter,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  TrendingUp,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import SEO from '../components/SEO';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Slider } from '@/shared/components/ui/slider';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface PublicInternship {
  id: string;
  title: string;
  company_name: string;
  location: string;
  type: string;
  duration: string;
  stipend: number;
  category: string;
  level: string;
  date_posted: string;
  applicant_count: number;
  status: string;
  deadline?: string;
}

type SortOption = 'newest' | 'deadline' | 'stipend-high' | 'stipend-low' | 'applicants';

const BrowseInternshipsPage: React.FC = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState<PublicInternship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<PublicInternship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [maxStipend, setMaxStipend] = useState(100000);
  const [stipendRange, setStipendRange] = useState([0, 100000]);
  
  // Sorting State
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  // UI States
  const [showFilters, setShowFilters] = useState(false);

  // Fetch public internships (no auth required)
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/v1/internships/`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch internships');
        }
        
        const data = await response.json();
        
        // Filter only active internships (case-insensitive)
        const activeInternships = data.filter((int: PublicInternship) => 
          (!int.status || int.status.toLowerCase() === 'active')
        );
        setInternships(activeInternships);
        setFilteredInternships(activeInternships);
        
        // Set max stipend based on actual data
        const maxStipendValue = Math.max(...activeInternships.map((i: PublicInternship) => i.stipend), 100000);
        setMaxStipend(maxStipendValue);
        setStipendRange([0, maxStipendValue]);
      } catch (error) {
        console.error('Error fetching internships:', error);
        setInternships([]);
        setFilteredInternships([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // Helper function to parse duration in months
  const getDurationInMonths = (duration: string): number => {
    const match = duration.match(/(\d+)/);
    if (!match) return 0;
    const value = parseInt(match[1]);
    if (duration.toLowerCase().includes('year')) return value * 12;
    return value;
  };

  // Filter and Sort internships
  useEffect(() => {
    let filtered = [...internships];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (int) =>
          int.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          int.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          int.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          int.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter((int) => 
        int.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((int) => int.category === categoryFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((int) => int.type === typeFilter);
    }

    // Duration filter
    if (durationFilter !== 'all') {
      filtered = filtered.filter((int) => {
        const months = getDurationInMonths(int.duration);
        switch (durationFilter) {
          case '1-3': return months >= 1 && months <= 3;
          case '4-6': return months >= 4 && months <= 6;
          case '6+': return months > 6;
          default: return true;
        }
      });
    }

    // Stipend filter
    filtered = filtered.filter((int) => 
      int.stipend >= stipendRange[0] && int.stipend <= stipendRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime());
        break;
      case 'deadline':
        filtered.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });
        break;
      case 'stipend-high':
        filtered.sort((a, b) => b.stipend - a.stipend);
        break;
      case 'stipend-low':
        filtered.sort((a, b) => a.stipend - b.stipend);
        break;
      case 'applicants':
        filtered.sort((a, b) => a.applicant_count - b.applicant_count);
        break;
    }

    setFilteredInternships(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, locationFilter, categoryFilter, typeFilter, durationFilter, stipendRange, sortBy, internships]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInternships = filteredInternships.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInternships.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookmark = (internshipId: string) => {
    // Show login prompt for guest users
    navigate(`/register/student?returnUrl=/browse-internships&bookmark=${internshipId}`);
  };

  const handleLoginToViewDetails = (internshipId: string) => {
    navigate(`/login?returnUrl=/interns/internship/${internshipId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <SEO
        title="Browse Internships | I-Intern"
        description="Discover thousands of internship opportunities across India. Find the perfect internship to kickstart your career. Login to view details and apply."
        url="https://www.i-intern.com/browse-internships"
        image="https://www.i-intern.com/favicon.svg"
      />
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] text-white py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#63D7C7] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#B3EDEB] rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#B3EDEB] to-white bg-clip-text text-transparent">
              Discover Your Perfect Internship
            </h1>
            <p className="text-xl md:text-2xl text-[#B3EDEB] mb-8 font-light">
              Explore curated opportunities from top companies. Sign up to unlock full details and apply instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/register/student')}
                className="bg-[#63D7C7] text-[#004F4D] hover:bg-[#B3EDEB] hover:scale-105 transition-all duration-300 text-lg px-8 py-6 shadow-lg shadow-[#63D7C7]/50 font-semibold"
                size="lg"
              >
                Sign Up Free
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button
                onClick={() => navigate('/login')}
                className="bg-white/10 text-white border-2 border-white/30 hover:bg-white hover:text-[#004F4D] hover:scale-105 transition-all duration-300 text-lg px-8 py-6 backdrop-blur-md font-semibold"
                size="lg"
              >
                Login
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-gradient-to-r from-white via-[#FFFAF3] to-white py-4 md:py-6 shadow-md sticky top-0 z-10 border-b-2 border-[#B3EDEB]/30">
        <div className="container mx-auto px-4">
          {/* Top Row: Search, Sort, and Filter Toggle */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 mb-0">
            {/* Search Bar */}
            <div className="md:col-span-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1F7368]" size={20} />
                <Input
                  type="text"
                  placeholder="Search internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[#B3EDEB] focus:border-[#1F7368] focus:ring-[#1F7368]/20"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="md:col-span-3">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="border-[#B3EDEB] focus:border-[#1F7368] focus:ring-[#1F7368]/20">
                  <TrendingUp size={16} className="mr-2 text-[#1F7368]" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="deadline">Closing Soon</SelectItem>
                  <SelectItem value="stipend-high">Highest Stipend</SelectItem>
                  <SelectItem value="stipend-low">Lowest Stipend</SelectItem>
                  <SelectItem value="applicants">Least Competitive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="md:col-span-2 flex items-center justify-center order-last md:order-none">
              <Badge variant="outline" className="border-[#1F7368] text-[#004F4D] bg-[#B3EDEB]/20 px-4 py-2 text-sm font-semibold">
                {filteredInternships.length} {filteredInternships.length === 1 ? 'Result' : 'Results'}
              </Badge>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="md:col-span-2">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full border-[#1F7368] text-[#004F4D] hover:bg-[#B3EDEB]/20"
              >
                <SlidersHorizontal size={16} className="mr-2" />
                {showFilters ? 'Hide' : 'Filters'}
              </Button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-gradient-to-br from-[#FFFAF3] to-white border-2 border-[#B3EDEB]/50 rounded-lg p-4 md:p-6 mt-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-[#004F4D] flex items-center gap-2">
                      <Filter size={18} className="text-[#1F7368]" />
                      Advanced Filters
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLocationFilter('all');
                        setCategoryFilter('all');
                        setTypeFilter('all');
                        setDurationFilter('all');
                        setStipendRange([0, maxStipend]);
                      }}
                      className="text-[#1F7368] hover:text-[#004F4D] text-sm"
                    >
                      <X size={16} className="mr-1" />
                      Clear All
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Location Filter */}
                    <div>
                      <label className="block text-sm font-medium text-[#004F4D] mb-2">
                        <MapPin size={14} className="inline mr-1" />
                        Location
                      </label>
                      <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger className="border-[#B3EDEB] focus:border-[#1F7368]">
                          <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="coimbatore">Coimbatore</SelectItem>
                          <SelectItem value="chennai">Chennai</SelectItem>
                          <SelectItem value="bangalore">Bangalore</SelectItem>
                          <SelectItem value="mumbai">Mumbai</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="hyderabad">Hyderabad</SelectItem>
                          <SelectItem value="pune">Pune</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-[#004F4D] mb-2">
                        <Briefcase size={14} className="inline mr-1" />
                        Industry/Field
                      </label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="border-[#B3EDEB] focus:border-[#1F7368]">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="Technology">Technology/IT</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-[#004F4D] mb-2">
                        <Building2 size={14} className="inline mr-1" />
                        Type
                      </label>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="border-[#B3EDEB] focus:border-[#1F7368]">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Duration Filter */}
                    <div>
                      <label className="block text-sm font-medium text-[#004F4D] mb-2">
                        <Clock size={14} className="inline mr-1" />
                        Duration
                      </label>
                      <Select value={durationFilter} onValueChange={setDurationFilter}>
                        <SelectTrigger className="border-[#B3EDEB] focus:border-[#1F7368]">
                          <SelectValue placeholder="All Durations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Durations</SelectItem>
                          <SelectItem value="1-3">1-3 months</SelectItem>
                          <SelectItem value="4-6">4-6 months</SelectItem>
                          <SelectItem value="6+">6+ months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Stipend Range Slider */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-[#004F4D] mb-3">
                      <IndianRupee size={14} className="inline mr-1" />
                      Stipend Range: ₹{stipendRange[0].toLocaleString()} - ₹{stipendRange[1].toLocaleString()}/month
                    </label>
                    <div className="px-2">
                      <Slider
                        min={0}
                        max={maxStipend}
                        step={1000}
                        value={stipendRange}
                        onValueChange={setStipendRange}
                        className="[&_[role=slider]]:bg-[#1F7368] [&_[role=slider]]:border-[#1F7368]"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>₹0</span>
                        <span>₹{maxStipend.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Internships Grid */}
      <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-[#FFFAF3]/30 to-white">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#B3EDEB] border-t-[#1F7368]"></div>
            <p className="mt-4 text-[#1F7368] font-medium">Loading internships...</p>
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-[#B3EDEB]/20 to-[#63D7C7]/20 rounded-2xl p-12 max-w-md mx-auto">
              <Filter className="mx-auto mb-4 text-[#1F7368]" size={48} />
              <p className="text-xl text-[#004F4D] font-semibold mb-2">No internships found</p>
              <p className="text-gray-600">Try adjusting your filters or search term</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-[#1F7368] font-semibold flex items-center gap-2">
              <div className="h-1 w-12 bg-gradient-to-r from-[#1F7368] to-[#63D7C7] rounded"></div>
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredInternships.length)} of {filteredInternships.length} internships
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentInternships.map((internship, index) => (
                <motion.div
                  key={internship.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-2xl hover:shadow-[#63D7C7]/20 transition-all duration-300 h-full flex flex-col border-[#B3EDEB]/50 hover:border-[#63D7C7] hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-br from-[#FFFAF3] to-white border-b border-[#B3EDEB]/30">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-[#004F4D] to-[#1F7368] bg-clip-text text-transparent line-clamp-2 flex-1">
                          {internship.title}
                        </h3>
                        <div className="flex gap-2 ml-2">
                          <Badge variant="secondary" className="bg-[#B3EDEB]/30 text-[#004F4D] font-semibold whitespace-nowrap">
                            {internship.level}
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
                        <Building2 size={16} className="mr-2" />
                        <span>{internship.company_name}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-grow flex flex-col justify-between pt-4">
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-gray-700">
                          <div className="bg-gradient-to-br from-[#63D7C7]/20 to-[#B3EDEB]/20 p-1.5 rounded-lg mr-3">
                            <MapPin size={16} className="text-[#1F7368]" />
                          </div>
                          <span>{internship.location}</span>
                        </div>

                        <div className="flex items-center text-gray-700">
                          <div className="bg-gradient-to-br from-[#63D7C7]/20 to-[#B3EDEB]/20 p-1.5 rounded-lg mr-3">
                            <IndianRupee size={16} className="text-[#1F7368]" />
                          </div>
                          <span className="font-semibold text-[#004F4D]">
                            {internship.stipend > 0
                              ? `₹${internship.stipend.toLocaleString()}/month`
                              : 'Unpaid'}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-700">
                          <div className="bg-gradient-to-br from-[#63D7C7]/20 to-[#B3EDEB]/20 p-1.5 rounded-lg mr-3">
                            <Clock size={16} className="text-[#1F7368]" />
                          </div>
                          <span>{internship.duration}</span>
                        </div>

                        <div className="flex items-center text-gray-700">
                          <div className="bg-gradient-to-br from-[#63D7C7]/20 to-[#B3EDEB]/20 p-1.5 rounded-lg mr-3">
                            <Calendar size={16} className="text-[#1F7368]" />
                          </div>
                          <span className="text-sm">Posted: {formatDate(internship.date_posted)}</span>
                        </div>

                        <div className="flex items-center text-gray-700">
                          <div className="bg-gradient-to-br from-[#63D7C7]/20 to-[#B3EDEB]/20 p-1.5 rounded-lg mr-3">
                            <Users size={16} className="text-[#1F7368]" />
                          </div>
                          <span className="text-sm">{internship.applicant_count} applicants</span>
                        </div>

                        <div className="flex gap-2 flex-wrap mt-3">
                          <Badge variant="outline" className="border-[#1F7368]/30 text-[#004F4D] bg-[#B3EDEB]/10">
                            {internship.category}
                          </Badge>
                          <Badge variant="outline" className="border-[#63D7C7]/30 text-[#1F7368] bg-[#63D7C7]/10">
                            {internship.type}
                          </Badge>
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
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-[#1F7368] text-[#004F4D] hover:bg-[#B3EDEB]/20 disabled:opacity-50 w-full sm:w-auto"
                >
                  <ChevronLeft size={20} />
                  <span className="ml-1">Previous</span>
                </Button>

                <div className="flex gap-2 flex-wrap justify-center">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        onClick={() => handlePageChange(pageNum)}
                        className={
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-[#1F7368] to-[#004F4D] text-white min-w-[40px]'
                            : 'border-[#1F7368] text-[#004F4D] hover:bg-[#B3EDEB]/20 min-w-[40px]'
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-[#1F7368] text-[#004F4D] hover:bg-[#B3EDEB]/20 disabled:opacity-50 w-full sm:w-auto"
                >
                  <span className="mr-1">Next</span>
                  <ChevronRight size={20} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-br from-[#1F7368] via-[#004F4D] to-[#1F7368] text-white py-20 mt-12 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#63D7C7] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B3EDEB] rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-[#B3EDEB] to-white bg-clip-text text-transparent">
              Ready to Find Your Dream Internship?
            </h2>
            <p className="text-xl text-[#B3EDEB] mb-8 max-w-2xl mx-auto font-light">
              Create your free account to access detailed internship information, apply with one click,
              and get AI-powered recommendations based on your skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/register/student')}
                className="bg-[#63D7C7] text-[#004F4D] hover:bg-[#B3EDEB] hover:scale-105 transition-all duration-300 text-lg px-8 py-6 shadow-lg shadow-[#63D7C7]/50 font-semibold"
                size="lg"
              >
                Create Free Account
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BrowseInternshipsPage;
