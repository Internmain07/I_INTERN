import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  Briefcase,
  Download,
  RefreshCw,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { StatCard } from '../components/dashboard/StatCard';
import { MonthlyApplicationsChart } from '../components/charts/MonthlyApplicationsChart';
import { HiringFunnelChart } from '../components/charts/HiringFunnelChart';
import { CompanyAnalyticsService, CompanyDashboardStats, MonthlyApplicationData, HiringFunnelData } from '@/services/company-analytics.service';

export const Analytics: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<CompanyDashboardStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyApplicationData[]>([]);
  const [funnelData, setFunnelData] = useState<HiringFunnelData>({
    applied: 0,
    screened: 0,
    interviewed: 0,
    offered: 0,
    hired: 0
  });
  const [timeRange, setTimeRange] = useState('30d');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setConnectionError(null);
    
    try {
      const { stats: dashboardStats, monthlyData: monthlyApps, funnelData: hiringFunnel } = 
        await CompanyAnalyticsService.getAllAnalyticsData();

      setStats(dashboardStats);
      setMonthlyData(monthlyApps);
      setFunnelData(hiringFunnel);
      
      console.log('Analytics data loaded successfully:', {
        stats: dashboardStats,
        monthlyData: monthlyApps,
        funnelData: hiringFunnel
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setConnectionError('Unable to connect to analytics service. Please check your connection and try again.');
      
      // Set default values on error
      setStats({
        totalInternships: 0,
        activeInternships: 0,
        totalApplicants: 0,
        totalHires: 0,
      });
      setMonthlyData([]);
      setFunnelData({
        applied: 0,
        screened: 0,
        interviewed: 0,
        offered: 0,
        hired: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const handleExport = () => {
    // Simple CSV export functionality
    const data = [
      ['Metric', 'Value'],
      ['Total Internships', displayStats.totalInternships],
      ['Active Internships', displayStats.activeInternships],
      ['Total Applicants', displayStats.totalApplicants],
      ['Total Hires', displayStats.totalHires],
    ];
    
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `company-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 rounded-lg"></div>
            <div className="h-80 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show content even with zero stats
  const displayStats = stats || {
    totalInternships: 0,
    activeInternships: 0,
    totalApplicants: 0,
    totalHires: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#FFFAF3] rounded-xl shadow-sm border border-[#63D7C7]/20 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#004F4D] mb-2">Analytics Dashboard</h1>
            <p className="text-[#1F7368]">Track your hiring performance and candidate insights</p>
            {!isLoading && (
              <div className="text-xs text-[#1F7368]/70 mt-1">
                Last updated: {new Date().toLocaleString()}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-[#63D7C7]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1F7368] focus:border-transparent bg-white text-[#004F4D]"
            >
              {timeRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <Button variant="outline" size="sm" className="hover:bg-[#E8F5F3] border-[#63D7C7]/30 text-[#1F7368]" onClick={fetchStats}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm" className="hover:bg-[#E8F5F3] border-[#63D7C7]/30 text-[#1F7368]" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Connection Error Alert */}
      {connectionError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
              <p className="text-sm text-red-700 mt-1">{connectionError}</p>
              <Button 
                onClick={fetchStats} 
                size="sm" 
                variant="outline" 
                className="mt-2 text-red-700 border-red-300 hover:bg-red-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Connection
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Key Metrics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Applicants"
            value={displayStats.totalApplicants}
            change="+12% from last month"
            icon={Users}
            gradient="bg-gradient-to-br from-[#63D7C7] to-[#1F7368]"
            index={0}
          />
          <StatCard
            title="Active Internships"
            value={displayStats.activeInternships}
            change="+2 this week"
            icon={Briefcase}
            gradient="bg-gradient-to-br from-[#1F7368] to-[#004F4D]"
            index={1}
          />
          <StatCard
            title="Total Hires"
            value={displayStats.totalHires}
            change="+3 this month"
            icon={UserCheck}
            gradient="bg-gradient-to-br from-[#004F4D] to-[#003836]"
            index={2}
          />
          <StatCard
            title="Total Internships"
            value={displayStats.totalInternships}
            change="5 posted this quarter"
            icon={TrendingUp}
            gradient="bg-gradient-to-br from-[#1F7368] to-[#63D7C7]"
            index={3}
          />
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#FFFAF3] rounded-xl shadow-sm border border-[#63D7C7]/20 overflow-hidden"
        >
          <MonthlyApplicationsChart data={monthlyData} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#FFFAF3] rounded-xl shadow-sm border border-[#63D7C7]/20 overflow-hidden"
        >
          <HiringFunnelChart data={funnelData} />
        </motion.div>
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#FFFAF3] rounded-xl shadow-sm border border-[#63D7C7]/20"
        >
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#004F4D]">Application Sources</CardTitle>
              <PieChart className="w-4 h-4 text-[#1F7368]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#1F7368] rounded-full"></div>
                    <span className="text-sm text-[#1F7368]">Direct Apply</span>
                  </div>
                  <span className="text-sm font-medium text-[#004F4D]">100%</span>
                </div>
                <p className="text-xs text-[#1F7368]/60 mt-4">
                  All applications are currently from direct platform applications
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#FFFAF3] rounded-xl shadow-sm border border-[#63D7C7]/20"
        >
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#004F4D]">Skills Analytics</CardTitle>
              <BarChart3 className="w-4 h-4 text-[#1F7368]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-[#1F7368]">
                  Skills analytics will be available once you receive more applications
                </p>
                <p className="text-xs text-[#1F7368]/60 mt-2">
                  This will show the most requested skills across your internship postings
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#FFFAF3] rounded-xl shadow-sm border border-[#63D7C7]/20"
        >
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#004F4D]">Conversion Rates</CardTitle>
              <TrendingUp className="w-4 h-4 text-[#1F7368]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#1F7368]">Application to Screened</span>
                  <span className="text-sm font-medium text-[#1F7368]">
                    {funnelData?.applied > 0 
                      ? `${Math.round((funnelData.screened / funnelData.applied) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#1F7368]">Screened to Interview</span>
                  <span className="text-sm font-medium text-[#1F7368]">
                    {funnelData?.screened > 0
                      ? `${Math.round((funnelData.interviewed / funnelData.screened) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#1F7368]">Interview to Offer</span>
                  <span className="text-sm font-medium text-[#1F7368]">
                    {funnelData?.interviewed > 0
                      ? `${Math.round((funnelData.offered / funnelData.interviewed) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#63D7C7]/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#004F4D]">Overall Hire Rate</span>
                    <span className="text-lg font-bold text-[#1F7368]">
                      {funnelData?.applied > 0
                        ? `${Math.round((funnelData.hired / funnelData.applied) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </div>
    </div>
  );
};