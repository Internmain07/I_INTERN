import { useState, useEffect } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { 
  Database, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Trash2,
  Shield,
  Activity,
  Users,
  Building2,
  FileText,
  Loader2
} from "lucide-react";
import { apiClient } from "@/api";
import { useToast } from "@/shared/hooks/use-toast";

export default function AdminDatabase() {
  const [integrityReport, setIntegrityReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cleanupDialogOpen, setCleanupDialogOpen] = useState(false);
  const [cleaningUp, setCleaningUp] = useState(false);
  const { toast } = useToast();

  const fetchIntegrityReport = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/v1/admin/database/integrity-check");
      setIntegrityReport(response);
    } catch (error) {
      console.error("Error fetching integrity report:", error);
      toast({
        title: "Error",
        description: "Failed to fetch database integrity report.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrityReport();
  }, []);

  const handleCleanup = async () => {
    setCleaningUp(true);
    try {
      const response = await apiClient.post("/api/v1/admin/database/cleanup", {});
      
      toast({
        title: "Cleanup Completed",
        description: `Removed ${response.report.orphaned_applications} orphaned applications and ${response.report.orphaned_internships} orphaned internships.`,
      });
      
      // Refresh integrity report
      await fetchIntegrityReport();
      setCleanupDialogOpen(false);
    } catch (error) {
      console.error("Error during cleanup:", error);
      toast({
        title: "Error",
        description: "Failed to cleanup database.",
        variant: "destructive",
      });
    } finally {
      setCleaningUp(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader 
          title="Database Management" 
          subtitle="Monitor and manage database integrity"
        />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader 
        title="Database Management" 
        subtitle="Monitor and manage database integrity with full admin power"
      />
      
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Database Health Status */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${
                  integrityReport?.health_status === 'healthy' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>Database Health Status</CardTitle>
                  <CardDescription>
                    Overall system integrity and performance
                  </CardDescription>
                </div>
              </div>
              <Badge 
                variant={integrityReport?.health_status === 'healthy' ? 'default' : 'destructive'}
                className={integrityReport?.health_status === 'healthy' ? 'bg-green-500' : ''}
              >
                {integrityReport?.health_status === 'healthy' ? (
                  <><CheckCircle className="h-3 w-3 mr-1" /> Healthy</>
                ) : (
                  <><AlertTriangle className="h-3 w-3 mr-1" /> Needs Attention</>
                )}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Database Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{integrityReport?.total_users || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{integrityReport?.total_companies || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Companies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100 text-green-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{integrityReport?.total_internships || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Internships</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{integrityReport?.total_applications || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integrity Issues */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Database Issues
              </CardTitle>
              <CardDescription>
                Problems detected in database consistency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Orphaned Applications</p>
                  <p className="text-xs text-muted-foreground">Applications with deleted interns/internships</p>
                </div>
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  {integrityReport?.orphaned_applications || 0}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Companies Without User Accounts</p>
                  <p className="text-xs text-muted-foreground">Company records without login credentials</p>
                </div>
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  {integrityReport?.companies_without_users || 0}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Unverified Users</p>
                  <p className="text-xs text-muted-foreground">Users pending email verification</p>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {integrityReport?.unverified_users || 0}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Suspended Users</p>
                  <p className="text-xs text-muted-foreground">Currently suspended accounts</p>
                </div>
                <Badge variant="outline" className="text-red-600 border-red-600">
                  {integrityReport?.suspended_users || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Admin Actions
              </CardTitle>
              <CardDescription>
                Powerful database management tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={fetchIntegrityReport}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Integrity Check
              </Button>
              
              <Button 
                className="w-full justify-start bg-yellow-500 hover:bg-yellow-600" 
                onClick={() => setCleanupDialogOpen(true)}
                disabled={integrityReport?.orphaned_applications === 0 && integrityReport?.orphaned_internships === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clean Up Orphaned Records
              </Button>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Admin Powers Enabled</p>
                    <p className="text-xs text-muted-foreground">
                      You have full database editing capabilities. All delete and suspend operations 
                      now cascade properly across all related tables (users, companies, internships, applications).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Cascade Operations</p>
                    <p className="text-xs text-muted-foreground">
                      ✓ Delete user → Removes from users table + all applications
                      <br />
                      ✓ Delete company → Removes from companies + users + all internships + applications
                      <br />
                      ✓ Suspend company → Updates companies + users + all internships
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Issues List */}
        {integrityReport?.issues && integrityReport.issues.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Issues Report</CardTitle>
              <CardDescription>
                Specific problems found in the database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {integrityReport.issues.map((issue: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg bg-yellow-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{issue.type}</p>
                        <p className="text-xs text-muted-foreground">
                          Company ID: {issue.company_id} | Email: {issue.company_email}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-yellow-600">
                        Action Required
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Cleanup Confirmation Dialog */}
      <AlertDialog open={cleanupDialogOpen} onOpenChange={setCleanupDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clean Up Database?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete orphaned records from the database:
              <br /><br />
              • <strong>{integrityReport?.orphaned_applications || 0}</strong> orphaned applications
              <br />
              • <strong>{integrityReport?.orphaned_internships || 0}</strong> orphaned internships
              <br /><br />
              This action cannot be undone. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cleaningUp}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCleanup} 
              disabled={cleaningUp}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              {cleaningUp ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cleaning...
                </>
              ) : (
                'Yes, Clean Up'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
