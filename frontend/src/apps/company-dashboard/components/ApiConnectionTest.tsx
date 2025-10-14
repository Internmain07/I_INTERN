import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { apiClient } from '@/api';

interface ApiTest {
  name: string;
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
  data?: any;
}

export const ApiConnectionTest: React.FC = () => {
  const [tests, setTests] = useState<ApiTest[]>([
    { name: 'Dashboard Stats', endpoint: '/api/v1/internships/company/dashboard-stats', status: 'pending' },
    { name: 'All Applicants', endpoint: '/api/v1/applications/company/all-applicants', status: 'pending' },
    { name: 'Monthly Analytics', endpoint: '/api/v1/internships/company/analytics/monthly-applications', status: 'pending' },
    { name: 'Hiring Funnel', endpoint: '/api/v1/internships/company/analytics/hiring-funnel', status: 'pending' },
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (test: ApiTest, index: number) => {
    try {
      console.log(`Testing ${test.endpoint}...`);
      const response = await apiClient.get(test.endpoint);
      
      setTests(prev => prev.map((t, i) => 
        i === index 
          ? { ...t, status: 'success' as const, data: response }
          : t
      ));
    } catch (error: any) {
      console.error(`Test failed for ${test.endpoint}:`, error);
      
      setTests(prev => prev.map((t, i) => 
        i === index 
          ? { ...t, status: 'error' as const, error: error.message || 'Unknown error' }
          : t
      ));
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    // Reset all tests to pending
    setTests(prev => prev.map(t => ({ ...t, status: 'pending' as const, error: undefined, data: undefined })));
    
    // Run tests sequentially
    for (let i = 0; i < tests.length; i++) {
      await runTest(tests[i], i);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getOverallStatus = () => {
    const allTested = tests.every(t => t.status !== 'pending');
    const allSuccess = tests.every(t => t.status === 'success');
    const hasErrors = tests.some(t => t.status === 'error');
    
    if (!allTested) return 'pending';
    if (allSuccess) return 'success';
    if (hasErrors) return 'error';
    return 'pending';
  };

  const overallStatus = getOverallStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="bg-[#FFFAF3] border-[#63D7C7]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-[#1F7368]" />
              <div>
                <CardTitle className="text-[#004F4D]">API Connection Test</CardTitle>
                <p className="text-sm text-[#1F7368]/70 mt-1">
                  Test backend connectivity and authentication
                </p>
              </div>
            </div>
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-[#1F7368] hover:bg-[#004F4D] text-white"
            >
              {isRunning ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isRunning ? 'Testing...' : 'Run Tests'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {tests.map((test) => (
            <div
              key={test.endpoint}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#63D7C7]/10"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(test.status)}
                <div>
                  <p className="text-sm font-medium text-[#004F4D]">{test.name}</p>
                  <p className="text-xs text-[#1F7368]/70">{test.endpoint}</p>
                </div>
              </div>
              <div className="text-right">
                {test.status === 'success' && test.data && (
                  <p className="text-xs text-green-600">
                    {Array.isArray(test.data) ? `${test.data.length} items` : 'OK'}
                  </p>
                )}
                {test.status === 'error' && (
                  <p className="text-xs text-red-600 max-w-32 truncate">
                    {test.error}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {overallStatus === 'success' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">
                ✅ All API endpoints are working correctly!
              </p>
              <p className="text-xs text-green-600 mt-1">
                Backend connection is established and authenticated.
              </p>
            </div>
          )}
          
          {overallStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">
                ❌ Some API endpoints failed
              </p>
              <p className="text-xs text-red-600 mt-1">
                Please check your authentication and network connection.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};