import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

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
  const chartData = data.map(item => ({
    month: item.month,
    applications: item.total_applications || item.applications || 0,
    hired: item.hired || 0,
    rejected: item.rejected || 0
  }));

  return (
    <Card className="p-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-lg font-semibold">Monthly Applications Trend</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Bar 
              dataKey="applications" 
              fill="#14b8a6" 
              name="Total Applications"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="hired" 
              fill="#10b981" 
              name="Hired"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="rejected" 
              fill="#ef4444" 
              name="Rejected"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};


