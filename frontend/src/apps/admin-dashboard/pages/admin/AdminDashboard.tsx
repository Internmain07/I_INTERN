import { useEffect, useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Building2, Users, Briefcase, Clock, TrendingUp, TrendingDown, Eye } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from "@/shared/lib/utils";
import { apiClient } from "@/api";

const iconMap = {
  building: Building2,
  users: Users, 
  briefcase: Briefcase,
  clock: Clock
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes, auditLogsRes] = await Promise.all([
          apiClient.get("/api/v1/admin/dashboard/stats"),
          apiClient.get("/api/v1/admin/activities"),
          apiClient.get("/api/v1/admin/audit-logs"),
        ]);
        setStats(statsRes);
        setActivities(activitiesRes);
        setAuditLogs(auditLogsRes);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  const kpiMetrics = [
    { title: "Total Companies", value: stats?.total_companies || 0, icon: "building", trend: "up", change: stats?.trends?.companies || 0 },
    { title: "Total Users", value: stats?.total_users || 0, icon: "users", trend: "up", change: stats?.trends?.users || 0 },
    { title: "Total Internships", value: stats?.total_internships || 0, icon: "briefcase", trend: "up", change: stats?.trends?.internships || 0 },
    { title: "Applications", value: stats?.total_applications || 0, icon: "clock", trend: "up", change: stats?.trends?.applications || 0 }
  ];

  return (
    <>
      <AdminHeader 
        title="Dashboard" 
        subtitle="Overview of platform metrics and recent activity"
      />
      
      <main className="flex-1 p-6 space-y-8 overflow-auto bg-gradient-to-br from-background to-muted/30 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiMetrics.map((metric, index) => {
            const IconComponent = iconMap[metric.icon as keyof typeof iconMap];
            
            return (
              <Card 
                key={metric.title} 
                className="card-elevated hover:scale-105 transition-all duration-300 animate-slide-up group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    {metric.title}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-1">{metric.value}</div>
                  <div className="flex items-center gap-1 text-sm">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <span className={cn(
                      "font-medium",
                      metric.trend === 'up' ? "text-success" : "text-destructive"
                    )}>
                      {Math.abs(parseInt(metric.change))}%
                    </span>
                    <span className="text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Growth Chart */}
          <Card className="card-elevated animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                User Growth Trends
              </CardTitle>
              <CardDescription>
                Employers vs Interns registration over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={[]}> {/* Replace with actual data */}
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).getDate().toString()}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-elevated)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="employers" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    name="Employers"
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="interns" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3}
                    name="Interns"
                    dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "hsl(var(--success))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activity Chart */}
          <Card className="card-elevated animate-scale-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-warning" />
                Weekly Activity
              </CardTitle>
              <CardDescription>
                Internships posted vs applications submitted
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={[]}> {/* Replace with actual data */}
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en', { weekday: 'short' })}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-elevated)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="postings" 
                    fill="hsl(var(--primary))" 
                    name="Postings"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="applications" 
                    fill="hsl(var(--success))" 
                    name="Applications"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="card-elevated animate-slide-up" style={{ animationDelay: "600ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-warning" />
                Audit Log
              </CardTitle>
              <CardDescription>
                Recent admin actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.slice(0, 5).map((log, index) => (
                  <div key={log.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/30 transition-all duration-200 group animate-fade-in" style={{ animationDelay: `${700 + index * 100}ms` }}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        log.action.includes('APPROVE') || log.action.includes('VERIFY') ? 'bg-success' :
                        log.action.includes('SUSPEND') || log.action.includes('DELETE') ? 'bg-destructive' :
                        'bg-warning'
                      }`}></div>
                      <div>
                        <p className="font-medium text-sm">{log.admin_user}</p>
                        <p className="text-xs text-muted-foreground">{log.action.toLowerCase().replace('_', ' ')} • {log.targetName}</p>
                        <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {log.targetType}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated animate-slide-up" style={{ animationDelay: "700ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-warning" />
                  Recent Activities
                </span>
                <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                  {activities.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                Recent platform activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity, index) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/30 transition-all duration-200 group animate-fade-in" style={{ animationDelay: `${800 + index * 100}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.activity}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}


