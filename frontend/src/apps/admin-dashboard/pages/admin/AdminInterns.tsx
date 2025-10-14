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
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  XCircle, 
  RotateCcw, 
  Trash2,
  Users,
  GraduationCap,
  CheckCircle
} from "lucide-react";
import { apiClient } from "@/api";
import { useToast } from "@/shared/hooks/use-toast";

export default function AdminInterns() {
  const [searchQuery, setSearchQuery] = useState("");
  const [universityFilter, setUniversityFilter] = useState("all");
  const [interns, setInterns] = useState<any[]>([]);
  const [universities, setUniversities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await apiClient.get("/api/v1/admin/users");
        const internData = response.users || [];
        setInterns(internData);
        
        // Extract unique universities
        const uniqueUniversities = [...new Set(internData.map((intern: any) => intern.university).filter(Boolean))];
        setUniversities(uniqueUniversities as string[]);
      } catch (error) {
        console.error("Error fetching interns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterns();
  }, []);

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         intern.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         intern.university.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUniversity = universityFilter === "all" || intern.university === universityFilter;
    
    return matchesSearch && matchesUniversity;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSuspendUser = async (userId: number, isSuspended: boolean) => {
    try {
      const endpoint = isSuspended 
        ? `/api/v1/admin/users/${userId}/unsuspend`
        : `/api/v1/admin/users/${userId}/suspend`;
      
      await apiClient.patch(endpoint, {});
      
      // Update local state
      setInterns(interns.map(intern => 
        intern.id === userId 
          ? { ...intern, is_suspended: !isSuspended, status: !isSuspended ? "Suspended" : "Active" }
          : intern
      ));
      
      toast({
        title: isSuspended ? "User Unsuspended" : "User Suspended",
        description: isSuspended 
          ? "The user account has been activated successfully."
          : "The user account has been suspended successfully.",
      });
    } catch (error) {
      console.error("Error updating user suspension:", error);
      toast({
        title: "Error",
        description: "Failed to update user suspension status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("⚠️ DELETE USER - This will permanently delete:\n\n• User account from users table\n• All applications by this intern\n• All work experiences\n• All projects\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?")) {
      return;
    }
    
    try {
      const response = await apiClient.delete(`/api/v1/admin/users/${userId}`);
      
      // Remove from local state
      setInterns(interns.filter(intern => intern.id !== userId));
      
      toast({
        title: "✅ User Deleted Successfully",
        description: response.details || "The user account and all associated data have been permanently removed from the database.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user account.",
        variant: "destructive",
      });
    }
  };

  const totalApplications = interns.reduce((sum, intern) => sum + intern.applications, 0);
  const avgApplicationsPerIntern = Math.round(totalApplications / interns.length);

  return (
    <>
      <AdminHeader 
        title="Interns Management" 
        subtitle="Manage student accounts and monitor application activity"
      />
      
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{interns.length}</p>
                  <p className="text-xs text-muted-foreground">Total Interns</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-success" />
                <div>
                  <p className="text-2xl font-bold">{universities.length}</p>
                  <p className="text-xs text-muted-foreground">Universities</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{totalApplications}</p>
                  <p className="text-xs text-muted-foreground">Total Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{avgApplicationsPerIntern}</p>
                  <p className="text-xs text-muted-foreground">Avg per Intern</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Interns</CardTitle>
                <CardDescription>
                  View and manage all student accounts
                </CardDescription>
              </div>
              <Button>Export Data</Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search interns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={universityFilter} onValueChange={setUniversityFilter}>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Filter by university" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {universities.map(university => (
                    <SelectItem key={university} value={university}>{university}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Joined</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterns.map((intern) => (
                  <TableRow key={intern.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={intern.avatar} alt={intern.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(intern.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{intern.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {intern.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{intern.university}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={intern.is_suspended ? "destructive" : "default"}
                        className={intern.is_suspended ? "" : "bg-green-500 hover:bg-green-600"}
                      >
                        {intern.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(intern.dateJoined).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={intern.applications > 10 ? "border-success text-success" : ""}
                      >
                        {intern.applications}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          {intern.is_suspended ? (
                            <DropdownMenuItem onClick={() => handleSuspendUser(intern.id, true)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Unsuspend Account
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleSuspendUser(intern.id, false)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Suspend Account
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteUser(intern.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}


