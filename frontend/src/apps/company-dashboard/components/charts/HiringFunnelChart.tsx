import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface HiringFunnelChartProps {
  data: Array<{
    stage: string;
    count: number;
    percentage: number;
  }> | {
    applied?: number;
    screened?: number;
    interviewed?: number;
    offered?: number;
    hired?: number;
  };
}

export const HiringFunnelChart: React.FC<HiringFunnelChartProps> = ({ data }) => {
  // Check if data exists
  if (!data) {
    return (
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-lg font-semibold text-[#004F4D]">Hiring Funnel</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="h-[300px] flex items-center justify-center text-[#1F7368]/60">
            <div className="text-center">
              <p className="text-lg font-medium">No hiring data yet</p>
              <p className="text-sm mt-2">The hiring funnel will show application progress</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data if it's in object format (from backend)
  const chartData = Array.isArray(data) ? data : [
    { stage: 'Applied', count: data.applied || 0, percentage: 100 },
    { stage: 'Screened', count: data.screened || 0, percentage: data.applied ? Math.round((data.screened || 0) / data.applied * 100) : 0 },
    { stage: 'Interviewed', count: data.interviewed || 0, percentage: data.applied ? Math.round((data.interviewed || 0) / data.applied * 100) : 0 },
    { stage: 'Final Round', count: data.offered || 0, percentage: data.applied ? Math.round((data.offered || 0) / data.applied * 100) : 0 },
    { stage: 'Hired', count: data.hired || 0, percentage: data.applied ? Math.round((data.hired || 0) / data.applied * 100) : 0 },
  ];

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-lg font-semibold text-[#004F4D]">Hiring Funnel</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorFunnel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#63D7C7" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#63D7C7" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8F5F3" />
            <XAxis 
              dataKey="stage" 
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
              formatter={(value: number, name: string) => [
                name === 'count' ? `${value} applicants` : `${value}%`,
                name === 'count' ? 'Count' : 'Conversion Rate'
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#1F7368" 
              fillOpacity={1} 
              fill="url(#colorFunnel)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};


