import { useState, useEffect } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2,
  FileText,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Ban
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { apiClient } from "@/api";
import { useToast } from "@/shared/hooks/use-toast";

const statusColors = {
  active: "bg-status-verified text-white",
  pending: "bg-status-pending text-white", 
  draft: "bg-muted text-muted-foreground",
  expired: "bg-status-suspended text-white",
  suspended: "bg-red-500 text-white"
};

const typeColors = {
  "Remote": "bg-blue-100 text-blue-800",
  "On-site": "bg-green-100 text-green-800",
  "Hybrid": "bg-purple-100 text-purple-800"
};

export default function AdminInternshipPostings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [internshipPostings, setInternshipPostings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await apiClient.get("/api/v1/admin/internships");
        setInternshipPostings(response.internships || []);
      } catch (error) {
        console.error("Error fetching internships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const filteredPostings = internshipPostings.filter(posting => {
    const matchesSearch = posting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         posting.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         posting.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || posting.status === statusFilter;
    const matchesType = typeFilter === "all" || posting.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    return (
      <Badge className={cn("text-xs font-medium", statusColors[status as keyof typeof statusColors])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge className={cn("text-xs font-medium", typeColors[type as keyof typeof typeColors])}>
        {type}
      </Badge>
    );
  };

  const handleSuspendInternship = async (internshipId: string, isSuspended: boolean) => {
    try {
      const endpoint = isSuspended 
        ? `/api/v1/admin/internships/${internshipId}/unsuspend`
        : `/api/v1/admin/internships/${internshipId}/suspend`;
      
      await apiClient.patch(endpoint, {});
      
      // Update local state
      setInternshipPostings(internshipPostings.map(posting => 
        posting.id === internshipId 
          ? { ...posting, is_suspended: !isSuspended, status: !isSuspended ? "suspended" : "active" }
          : posting
      ));
      
      toast({
        title: isSuspended ? "Internship Unsuspended" : "Internship Suspended",
        description: isSuspended 
          ? "The internship posting has been activated successfully."
          : "The internship posting has been suspended successfully.",
      });
    } catch (error) {
      console.error("Error updating internship suspension:", error);
      toast({
        title: "Error",
        description: "Failed to update internship suspension status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInternship = async (internshipId: string) => {
    if (!confirm("⚠️ DELETE INTERNSHIP - This will permanently delete:\n\n• Internship posting\n• ALL applications to this internship\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?")) {
      return;
    }
    
    try {
      const response = await apiClient.delete(`/api/v1/admin/internships/${internshipId}`);
      
      // Remove from local state
      setInternshipPostings(internshipPostings.filter(posting => posting.id !== internshipId));
      
      const details = response.details || {};
      toast({
        title: "✅ Internship Deleted Successfully",
        description: `Removed "${response.internship_title}" and ${details.applications_deleted || 0} applications from the database.`,
      });
    } catch (error) {
      console.error("Error deleting internship:", error);
      toast({
        title: "Error",
        description: "Failed to delete internship posting.",
        variant: "destructive",
      });
    }
  };

  const totalApplications = internshipPostings.reduce((sum, posting) => sum + posting.applications, 0);

  return (
    <>
      <AdminHeader 
        title="Internship Postings" 
        subtitle="Manage and moderate all internship listings"
      />
      
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-gradient-card border-border/50 shadow-elevated hover:shadow-glow transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold animate-fade-in">{internshipPostings.length}</p>
                  <p className="text-xs text-muted-foreground">Total Postings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-border/50 shadow-elevated hover:shadow-glow transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="text-2xl font-bold animate-fade-in">{internshipPostings.filter(p => p.status === 'active').length}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-border/50 shadow-elevated hover:shadow-glow transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold animate-fade-in">{internshipPostings.filter(p => p.status === 'pending').length}</p>
                  <p className="text-xs text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-border/50 shadow-elevated hover:shadow-glow transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold animate-fade-in">{internshipPostings.filter(p => p.featured).length}</p>
                  <p className="text-xs text-muted-foreground">Featured</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-border/50 shadow-elevated hover:shadow-glow transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold animate-fade-in">{totalApplications}</p>
                  <p className="text-xs text-muted-foreground">Total Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-gradient-card border-border/50 shadow-elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gradient-primary">Internship Postings</CardTitle>
                <CardDescription>
                  View and manage all internship listings on the platform
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Bulk Actions
                </Button>
                <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
                  Review Pending
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search postings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-border/50 focus:border-primary/50"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-border/50">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40 border-border/50">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" className="border-border/50 hover:bg-muted/50">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Position</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location & Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPostings.map((posting, index) => (
                    <TableRow key={posting.id} className="hover:bg-muted/30 transition-colors animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{posting.title}</p>
                            {posting.featured && <Star className="h-4 w-4 text-warning fill-warning" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{posting.duration} • {posting.salary}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{posting.company.charAt(0)}</span>
                          </div>
                          <span className="font-medium">{posting.company}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{posting.location}</span>
                          </div>
                          {getTypeBadge(posting.type)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(posting.status)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={posting.applications > 20 ? "border-success text-success" : ""}
                        >
                          {posting.applications} applications
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(posting.deadline).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="shadow-elevated">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="hover:bg-muted/70">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {posting.status === 'pending' && (
                              <DropdownMenuItem className="hover:bg-muted/70">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve Posting
                              </DropdownMenuItem>
                            )}
                            {posting.is_suspended ? (
                              <DropdownMenuItem 
                                className="hover:bg-muted/70"
                                onClick={() => handleSuspendInternship(posting.id, true)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Unsuspend Posting
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                className="hover:bg-muted/70"
                                onClick={() => handleSuspendInternship(posting.id, false)}
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend Posting
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="hover:bg-muted/70">
                              <Star className="mr-2 h-4 w-4" />
                              {posting.featured ? 'Remove Featured' : 'Make Featured'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-muted/70">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Posting
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteInternship(posting.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Posting
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}


