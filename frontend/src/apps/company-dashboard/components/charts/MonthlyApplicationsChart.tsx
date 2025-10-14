import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface MonthlyApplicationsChartProps {
  data: Array<{
    month: string;
    total_applications?: number;  // Backend format
    applications?: number;         // Frontend format
    hired: number;
    rejected: number;
  }>;
}

export const MonthlyApplicationsChart: React.FC<MonthlyApplicationsChartProps> = ({ data }) => {
  // Transform data to ensure consistent format
  const chartData = data?.map(item => ({
    month: item.month,
    applications: item.total_applications || item.applications || 0,
    hired: item.hired || 0,
    rejected: item.rejected || 0
  })) || [];

  // Empty state
  if (!data || data.length === 0) {
    return (
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-lg font-semibold text-[#004F4D]">Monthly Applications Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="h-[350px] flex items-center justify-center text-[#1F7368]/60">
            <div className="text-center">
              <p className="text-lg font-medium">No application data yet</p>
              <p className="text-sm mt-2">Applications will appear here once students start applying</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-lg font-semibold text-[#004F4D]">Monthly Applications Trend</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8F5F3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#1F7368' }}
              axisLine={{ stroke: '#63D7C7' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#1F7368' }}
              axisLine={{ stroke: '#63D7C7' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#FFFAF3',
                border: '1px solid #63D7C7',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                color: '#004F4D'
              }}
            />
            <Legend />
            <Bar 
              dataKey="applications" 
              fill="#63D7C7" 
              name="Total Applications"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="hired" 
              fill="#1F7368" 
              name="Hired"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="rejected" 
              fill="#FF6B6B" 
              name="Rejected"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};


