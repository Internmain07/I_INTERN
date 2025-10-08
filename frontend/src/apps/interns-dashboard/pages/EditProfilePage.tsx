import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Save, User, Mail, Calendar, Briefcase, Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useToast } from "@/shared/hooks/use-toast";
import { userService } from "@/services/user.service";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    dateOfBirth: "",
    bio: "",
    skills: "",
    linkedIn: "",
    github: "",
    portfolio: "",
    university: "",
    major: "",
    graduationYear: "",
    gradingType: "GPA",
    gradingScore: ""
  });

  const [educationEntries, setEducationEntries] = useState([
    {
      id: 1,
      university: "",
      major: "",
      graduationYear: "",
      gradingType: "GPA",
      gradingScore: ""
    }
  ]);

  const [experienceEntries, setExperienceEntries] = useState([
    {
      id: 1,
      company: "",
      position: "",
      startYear: "",
      endYear: "",
      description: ""
    }
  ]);

  const [projectEntries, setProjectEntries] = useState([
    {
      id: 1,
      title: "",
      technologies: "",
      startDate: "",
      endDate: "",
      description: "",
      githubUrl: "",
      liveUrl: ""
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsFetching(true);
        const profile = await userService.getProfile();
        
        // Set avatar URL
        setAvatarUrl(profile.avatar_url || "");
        
        // Populate form with existing data
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          location: profile.location || "",
          dateOfBirth: profile.date_of_birth || "",
          bio: profile.bio || "",
          skills: profile.skills || "",
          linkedIn: profile.linkedin || "",
          github: profile.github || "",
          portfolio: profile.portfolio || "",
          university: profile.university || "",
          major: profile.major || "",
          graduationYear: profile.graduation_year || "",
          gradingType: profile.grading_type || "GPA",
          gradingScore: profile.grading_score || ""
        });
        
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const response = await userService.uploadAvatar(file);
      setAvatarUrl(response.avatar_url);
      
      toast({
        title: "Success",
        description: "Profile picture uploaded successfully!",
      });
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!avatarUrl) {
      toast({
        title: "No Avatar",
        description: "You don't have a profile picture to delete",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      await userService.deleteAvatar();
      setAvatarUrl("");
      
      toast({
        title: "Success",
        description: "Profile picture deleted successfully!",
      });
    } catch (error: any) {
      console.error("Error deleting avatar:", error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleEducationChange = (id: number, field: string, value: string) => {
    setEducationEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addEducationEntry = () => {
    const newId = Math.max(...educationEntries.map(e => e.id)) + 1;
    setEducationEntries(prev => [...prev, {
      id: newId,
      university: "",
      major: "",
      graduationYear: "",
      gradingType: "GPA",
      gradingScore: ""
    }]);
  };

  const removeEducationEntry = (id: number) => {
    if (educationEntries.length > 1) {
      setEducationEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const handleExperienceChange = (id: number, field: string, value: string) => {
    setExperienceEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addExperienceEntry = () => {
    const newId = Math.max(...experienceEntries.map(e => e.id)) + 1;
    setExperienceEntries(prev => [...prev, {
      id: newId,
      company: "",
      position: "",
      startYear: "",
      endYear: "",
      description: ""
    }]);
  };

  const removeExperienceEntry = (id: number) => {
    if (experienceEntries.length > 1) {
      setExperienceEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const handleProjectChange = (id: number, field: string, value: string) => {
    setProjectEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addProjectEntry = () => {
    const newId = Math.max(...projectEntries.map(e => e.id)) + 1;
    setProjectEntries(prev => [...prev, {
      id: newId,
      title: "",
      technologies: "",
      startDate: "",
      endDate: "",
      description: "",
      githubUrl: "",
      liveUrl: ""
    }]);
  };

  const removeProjectEntry = (id: number) => {
    if (projectEntries.length > 1) {
      setProjectEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // 1. Save basic profile data
      const response = await userService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        date_of_birth: formData.dateOfBirth || null,
        bio: formData.bio,
        linkedin: formData.linkedIn,
        github: formData.github,
        portfolio: formData.portfolio,
        university: formData.university,
        major: formData.major,
        graduation_year: formData.graduationYear,
        grading_type: formData.gradingType,
        grading_score: formData.gradingScore,
        skills: formData.skills,
      });
      
      console.log("Profile update response:", response);
      
      // 2. Save work experiences (if any data is filled)
      for (const exp of experienceEntries) {
        // Skip empty entries
        if (!exp.company && !exp.position) continue;
        
        const workExpData = {
          company: exp.company,
          position: exp.position,
          start_date: exp.startYear || null,
          end_date: exp.endYear || null,
          description: exp.description || null,
        };
        
        try {
          await userService.addWorkExperience(workExpData);
          console.log("Work experience saved:", workExpData);
        } catch (error) {
          console.error("Error saving work experience:", error);
          // Continue with other entries even if one fails
        }
      }
      
      // 3. Save projects (if any data is filled)
      for (const proj of projectEntries) {
        // Skip empty entries
        if (!proj.title) continue;
        
        const projectData = {
          title: proj.title,
          description: proj.description || null,
          technologies: proj.technologies ? proj.technologies.split(',').map(t => t.trim()) : [],
          start_date: proj.startDate || null,
          end_date: proj.endDate || null,
          github_url: proj.githubUrl || null,
          live_demo_url: proj.liveUrl || null,
        };
        
        try {
          await userService.addProject(projectData);
          console.log("Project saved:", projectData);
        } catch (error) {
          console.error("Error saving project:", error);
          // Continue with other entries even if one fails
        }
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      // Refresh the page to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="mx-auto h-16 w-16 text-primary animate-pulse mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Loading profile...
          </h3>
          <p className="text-muted-foreground">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/interns")}
            className="mr-4 bg-[#FFFAF3] hover:bg-white border border-[#63D7C7]/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-[#FFFAF3]">Edit Profile</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="bg-[#FFFAF3] border-[#63D7C7]/30 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-[#004F4D]">
                  <User className="mr-2 h-5 w-5" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="relative inline-block">
                  <Avatar className="h-32 w-32 ring-4 ring-primary/10">
                    <AvatarImage 
                      src={avatarUrl ? `${API_URL}${avatarUrl}` : ""} 
                      alt={formData.name} 
                    />
                    <AvatarFallback className="text-2xl">
                      {formData.name ? formData.name.split(" ").map(n => n[0]).join("") : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label htmlFor="avatar-upload">
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full h-10 w-10 p-0 cursor-pointer"
                      disabled={isUploadingAvatar}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('avatar-upload')?.click();
                      }}
                      title="Upload profile picture"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {isUploadingAvatar ? "Processing..." : "Click the camera icon to upload a profile picture"}
                  </p>
                  {avatarUrl && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleAvatarDelete}
                      disabled={isUploadingAvatar}
                      className="w-full"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Profile Picture
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Max size: 5MB • Formats: JPEG, PNG, GIF, WebP
                </p>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="bg-[#FFFAF3] border-[#63D7C7]/30 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-[#004F4D]">
                  <Mail className="mr-2 h-5 w-5" />
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="linkedIn">LinkedIn</Label>
                  <Input
                    id="linkedIn"
                    value={formData.linkedIn}
                    onChange={(e) => handleInputChange("linkedIn", e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={formData.github}
                    onChange={(e) => handleInputChange("github", e.target.value)}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div>
                  <Label htmlFor="portfolio">Portfolio Website</Label>
                  <Input
                    id="portfolio"
                    value={formData.portfolio}
                    onChange={(e) => handleInputChange("portfolio", e.target.value)}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-[#FFFAF3] border-[#63D7C7]/30 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-[#004F4D]">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="skills-sidebar">Skills (comma-separated)</Label>
                  <Textarea
                    id="skills-sidebar"
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    placeholder="React, TypeScript, Node.js, Python..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Separate skills with commas
                  </p>
                </div>
                {formData.skills && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.split(",").map((skill, index) => (
                      skill.trim() && (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs bg-[#63D7C7]/20 text-[#004F4D] hover:bg-[#63D7C7]/30"
                        >
                          {skill.trim()}
                        </Badge>
                      )
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <Card className="bg-[#FFFAF3] border-[#63D7C7]/30 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-[#004F4D]">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-[#FFFAF3] border-[#63D7C7]/30 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-[#004F4D]">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Education
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEducationEntry}
                    className="flex items-center"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Education
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {educationEntries.map((education, index) => (
                  <motion.div
                    key={education.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative border rounded-lg p-4 space-y-4"
                  >
                    {educationEntries.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducationEntry(education.id)}
                        className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`university-${education.id}`}>University</Label>
                        <Input
                          id={`university-${education.id}`}
                          value={education.university}
                          onChange={(e) => handleEducationChange(education.id, "university", e.target.value)}
                          placeholder="Enter university name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`major-${education.id}`}>Major</Label>
                        <Input
                          id={`major-${education.id}`}
                          value={education.major}
                          onChange={(e) => handleEducationChange(education.id, "major", e.target.value)}
                          placeholder="Enter your major"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`graduationYear-${education.id}`}>Graduation Year</Label>
                        <Input
                          id={`graduationYear-${education.id}`}
                          value={education.graduationYear}
                          onChange={(e) => handleEducationChange(education.id, "graduationYear", e.target.value)}
                          placeholder="2025"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`gradingType-${education.id}`}>Grading System</Label>
                        <Select
                          value={education.gradingType}
                          onValueChange={(value) => handleEducationChange(education.id, "gradingType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select grading system" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GPA">GPA (4.0 scale)</SelectItem>
                            <SelectItem value="CGPA">CGPA (10.0 scale)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor={`gradingScore-${education.id}`}>
                          {education.gradingType} Score (Optional)
                        </Label>
                        <Input
                          id={`gradingScore-${education.id}`}
                          value={education.gradingScore}
                          onChange={(e) => handleEducationChange(education.id, "gradingScore", e.target.value)}
                          placeholder={education.gradingType === "CGPA" ? "8.5" : "3.8"}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-[#FFFAF3] border-[#63D7C7]/30 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-[#004F4D]">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    placeholder="React, TypeScript, Node.js, Python..."
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.split(",").map((skill, index) => (
                      skill.trim() && (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill.trim()}
                        </Badge>
                      )
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card className="bg-[#FFFAF3] border-[#63D7C7]/30 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-[#004F4D]">
                  <div className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Work Experience
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExperienceEntry}
                    className="flex items-center"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Experience
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {experienceEntries.map((experience, index) => (
                  <motion.div
                    key={experience.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative border rounded-lg p-4 space-y-4"
                  >
                    {experienceEntries.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperienceEntry(experience.id)}
                        className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`company-${experience.id}`}>Company</Label>
                        <Input
                          id={`company-${experience.id}`}
                          value={experience.company}
                          onChange={(e) => handleExperienceChange(experience.id, "company", e.target.value)}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`position-${experience.id}`}>Position/Role</Label>
                        <Input
                          id={`position-${experience.id}`}
                          value={experience.position}
                          onChange={(e) => handleExperienceChange(experience.id, "position", e.target.value)}
                          placeholder="Enter your position"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`startYear-${experience.id}`}>Start Year</Label>
                        <Input
                          id={`startYear-${experience.id}`}
                          value={experience.startYear}
                          onChange={(e) => handleExperienceChange(experience.id, "startYear", e.target.value)}
                          placeholder="2023"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`endYear-${experience.id}`}>End Year</Label>
                        <Input
                          id={`endYear-${experience.id}`}
                          value={experience.endYear}
                          onChange={(e) => handleExperienceChange(experience.id, "endYear", e.target.value)}
                          placeholder="2024 or 'Present'"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`description-${experience.id}`}>Description</Label>
                      <Textarea
                        id={`description-${experience.id}`}
                        value={experience.description}
                        onChange={(e) => handleExperienceChange(experience.id, "description", e.target.value)}
                        placeholder="Describe your work, responsibilities, and achievements..."
                        rows={3}
                      />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="bg-[#FFFAF3] border-[#63D7C7]/30 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-[#004F4D]">
                  <div className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Projects
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addProjectEntry}
                    className="flex items-center"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Project
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {projectEntries.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative border rounded-lg p-4 space-y-4"
                  >
                    {projectEntries.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProjectEntry(project.id)}
                        className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`title-${project.id}`}>Project Title</Label>
                        <Input
                          id={`title-${project.id}`}
                          value={project.title}
                          onChange={(e) => handleProjectChange(project.id, "title", e.target.value)}
                          placeholder="Enter project title"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`technologies-${project.id}`}>Technologies Used</Label>
                        <Input
                          id={`technologies-${project.id}`}
                          value={project.technologies}
                          onChange={(e) => handleProjectChange(project.id, "technologies", e.target.value)}
                          placeholder="React, Node.js, MongoDB, etc."
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`description-${project.id}`}>Project Description</Label>
                      <Textarea
                        id={`description-${project.id}`}
                        value={project.description}
                        onChange={(e) => handleProjectChange(project.id, "description", e.target.value)}
                        placeholder="Describe the project, your role, challenges faced, and outcomes achieved..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`githubUrl-${project.id}`}>GitHub URL (Optional)</Label>
                        <Input
                          id={`githubUrl-${project.id}`}
                          value={project.githubUrl}
                          onChange={(e) => handleProjectChange(project.id, "githubUrl", e.target.value)}
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`liveUrl-${project.id}`}>Live Demo URL (Optional)</Label>
                        <Input
                          id={`liveUrl-${project.id}`}
                          value={project.liveUrl}
                          onChange={(e) => handleProjectChange(project.id, "liveUrl", e.target.value)}
                          placeholder="https://project-demo.vercel.app"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full h-12 text-lg bg-gradient-primary hover:opacity-90"
              >
                <Save className="mr-2 h-5 w-5" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;