import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { apiClient } from '@/api';

interface ConnectivityStatus {
  dashboard: 'connected' | 'error' | 'pending';
  monthly: 'connected' | 'error' | 'pending';
  funnel: 'connected' | 'error' | 'pending';
}

interface ConnectivityTestProps {
  onStatusUpdate?: (status: ConnectivityStatus) => void;
}

export const ConnectivityTest: React.FC<ConnectivityTestProps> = ({ onStatusUpdate }) => {
  const [status, setStatus] = useState<ConnectivityStatus>({
    dashboard: 'pending',
    monthly: 'pending',
    funnel: 'pending',
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [lastTested, setLastTested] = useState<Date | null>(null);

  const testEndpoint = async (endpoint: string): Promise<boolean> => {
    try {
      const response = await apiClient.get(endpoint);
      console.log(`${endpoint} response:`, response);
      return true;
    } catch (error) {
      console.error(`${endpoint} error:`, error);
      return false;
    }
  };

  const runConnectivityTest = async () => {
    setIsTestingConnection(true);
    
    const newStatus: ConnectivityStatus = {
      dashboard: 'pending',
      monthly: 'pending',
      funnel: 'pending',
    };

    // Test dashboard stats endpoint
    const dashboardConnected = await testEndpoint('/api/v1/internships/company/dashboard-stats');
    newStatus.dashboard = dashboardConnected ? 'connected' : 'error';

    // Test monthly applications endpoint
    const monthlyConnected = await testEndpoint('/api/v1/internships/company/analytics/monthly-applications');
    newStatus.monthly = monthlyConnected ? 'connected' : 'error';

    // Test hiring funnel endpoint
    const funnelConnected = await testEndpoint('/api/v1/internships/company/analytics/hiring-funnel');
    newStatus.funnel = funnelConnected ? 'connected' : 'error';

    setStatus(newStatus);
    setLastTested(new Date());
    setIsTestingConnection(false);

    // Notify parent component about status update
    if (onStatusUpdate) {
      onStatusUpdate(newStatus);
    }
  };

  const getStatusIcon = (endpointStatus: 'connected' | 'error' | 'pending') => {
    switch (endpointStatus) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = (endpointStatus: 'connected' | 'error' | 'pending') => {
    switch (endpointStatus) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Error';
      case 'pending':
        return 'Not Tested';
    }
  };

  const getOverallStatus = () => {
    const hasError = Object.values(status).some(s => s === 'error');
    const allConnected = Object.values(status).every(s => s === 'connected');
    
    if (hasError) return 'error';
    if (allConnected) return 'connected';
    return 'pending';
  };

  const overallStatus = getOverallStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFFAF3] rounded-xl shadow-sm border border-[#63D7C7]/20 mb-6"
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            {overallStatus === 'connected' ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : overallStatus === 'error' ? (
              <WifiOff className="w-5 h-5 text-red-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            )}
            <div>
              <CardTitle className="text-lg font-semibold text-[#004F4D]">
                Analytics Connection Status
              </CardTitle>
              <p className="text-sm text-[#1F7368]/70 mt-1">
                {lastTested 
                  ? `Last tested: ${lastTested.toLocaleTimeString()}`
                  : 'Click "Test Connection" to check endpoint connectivity'
                }
              </p>
            </div>
          </div>
          
          <Button
            onClick={runConnectivityTest}
            disabled={isTestingConnection}
            variant="outline"
            size="sm"
            className="hover:bg-[#E8F5F3] border-[#63D7C7]/30 text-[#1F7368]"
          >
            {isTestingConnection ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Test Connection
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#63D7C7]/10">
              <div>
                <p className="text-sm font-medium text-[#004F4D]">Dashboard Stats</p>
                <p className="text-xs text-[#1F7368]/70">/api/v1/internships/company/dashboard-stats</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(status.dashboard)}
                <span className="text-xs font-medium text-[#1F7368]">
                  {getStatusText(status.dashboard)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#63D7C7]/10">
              <div>
                <p className="text-sm font-medium text-[#004F4D]">Monthly Data</p>
                <p className="text-xs text-[#1F7368]/70">/monthly-applications</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(status.monthly)}
                <span className="text-xs font-medium text-[#1F7368]">
                  {getStatusText(status.monthly)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#63D7C7]/10">
              <div>
                <p className="text-sm font-medium text-[#004F4D]">Hiring Funnel</p>
                <p className="text-xs text-[#1F7368]/70">/hiring-funnel</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(status.funnel)}
                <span className="text-xs font-medium text-[#1F7368]">
                  {getStatusText(status.funnel)}
                </span>
              </div>
            </div>
          </div>
          
          {overallStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">Connection Issues Detected</p>
              <p className="text-xs text-red-600 mt-1">
                Some analytics endpoints are not responding. Please check your authentication and network connection.
              </p>
            </div>
          )}
          
          {overallStatus === 'connected' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">All Systems Connected</p>
              <p className="text-xs text-green-600 mt-1">
                Analytics endpoints are responding correctly. Data should load properly.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};