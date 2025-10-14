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
  Building2,
  Ban
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { apiClient } from "@/api";
import { useToast } from "@/shared/hooks/use-toast";

const statusColors = {
  verified: "bg-status-verified text-white",
  pending: "bg-status-pending text-white", 
  suspended: "bg-status-suspended text-white"
};

export default function AdminEmployers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employers, setEmployers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await apiClient.get("/api/v1/admin/companies");
        setEmployers(response.companies || []);
      } catch (error) {
        console.error("Error fetching employers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployers();
  }, []);

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = employer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || employer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return (
      <Badge className={cn("text-xs font-medium", statusColors[status as keyof typeof statusColors])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleVerifyCompany = async (companyId: string) => {
    try {
      await apiClient.patch(`/api/v1/admin/companies/${companyId}/verify`, {});
      
      // Update local state
      setEmployers(employers.map(employer => 
        employer.id === companyId 
          ? { ...employer, status: "verified" }
          : employer
      ));
      
      toast({
        title: "Company Verified",
        description: "The company has been verified successfully.",
      });
    } catch (error) {
      console.error("Error verifying company:", error);
      toast({
        title: "Error",
        description: "Failed to verify company.",
        variant: "destructive",
      });
    }
  };

  const handleSuspendCompany = async (companyId: string, isSuspended: boolean) => {
    try {
      const endpoint = isSuspended 
        ? `/api/v1/admin/companies/${companyId}/unsuspend`
        : `/api/v1/admin/companies/${companyId}/suspend`;
      
      await apiClient.patch(endpoint, {});
      
      // Update local state
      setEmployers(employers.map(employer => 
        employer.id === companyId 
          ? { ...employer, status: isSuspended ? "verified" : "suspended" }
          : employer
      ));
      
      toast({
        title: isSuspended ? "Company Unsuspended" : "Company Suspended",
        description: isSuspended 
          ? "The company account has been activated successfully."
          : "The company account has been suspended successfully.",
      });
    } catch (error) {
      console.error("Error updating company suspension:", error);
      toast({
        title: "Error",
        description: "Failed to update company suspension status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm("⚠️ DELETE COMPANY - This will permanently delete:\n\n• Company record from companies table\n• User account from users table\n• ALL internships posted by this company\n• ALL applications to those internships\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?")) {
      return;
    }
    
    try {
      const response = await apiClient.delete(`/api/v1/admin/companies/${companyId}`);
      
      // Remove from local state
      setEmployers(employers.filter(employer => employer.id !== companyId));
      
      const details = response.details || {};
      toast({
        title: "✅ Company Deleted Successfully",
        description: `Removed company, user account, ${details.internships_deleted || 0} internships, and ${details.applications_deleted || 0} applications from the database.`,
      });
    } catch (error) {
      console.error("Error deleting company:", error);
      toast({
        title: "Error",
        description: "Failed to delete company account.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AdminHeader 
        title="Employers Management" 
        subtitle="Manage company accounts and employer verifications"
      />
      
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{employers.length}</p>
                  <p className="text-xs text-muted-foreground">Total Employers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="text-2xl font-bold">{employers.filter(e => e.status === 'verified').length}</p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{employers.filter(e => e.status === 'pending').length}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">{employers.filter(e => e.status === 'suspended').length}</p>
                  <p className="text-xs text-muted-foreground">Suspended</p>
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
                <CardTitle>Employers</CardTitle>
                <CardDescription>
                  View and manage all employer accounts
                </CardDescription>
              </div>
              <Button>Add Employer</Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search employers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
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
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Joined</TableHead>
                  <TableHead>Active Postings</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployers.map((employer) => (
                  <TableRow key={employer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{employer.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {employer.email}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(employer.status)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(employer.dateJoined).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{employer.activePostings}</Badge>
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
                          {employer.status === 'pending' && (
                            <DropdownMenuItem onClick={() => handleVerifyCompany(employer.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve Company
                            </DropdownMenuItem>
                          )}
                          {employer.status === 'suspended' ? (
                            <DropdownMenuItem onClick={() => handleSuspendCompany(employer.id, true)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Unsuspend Account
                            </DropdownMenuItem>
                          ) : employer.status !== 'pending' && (
                            <DropdownMenuItem onClick={() => handleSuspendCompany(employer.id, false)}>
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend Account
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteCompany(employer.id)}
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


