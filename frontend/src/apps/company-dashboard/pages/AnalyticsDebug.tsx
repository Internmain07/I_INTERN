import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, XCircle, AlertTriangle, Code, Database, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { CompanyAnalyticsService } from '@/services/company-analytics.service';
import { apiClient } from '@/api';

interface TestResult {
  endpoint: string;
  status: 'success' | 'error' | 'pending';
  response?: any;
  error?: string;
  timestamp?: Date;
}

export const AnalyticsDebugPage: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);

  const endpoints = [
    {
      name: 'Dashboard Stats',
      endpoint: '/api/v1/internships/company/dashboard-stats',
      description: 'Core statistics for company dashboard'
    },
    {
      name: 'Monthly Applications',
      endpoint: '/api/v1/internships/company/analytics/monthly-applications',
      description: 'Monthly trend data for applications'
    },
    {
      name: 'Hiring Funnel',
      endpoint: '/api/v1/internships/company/analytics/hiring-funnel',
      description: 'Conversion funnel from application to hire'
    }
  ];

  const runSingleTest = async (endpoint: string): Promise<TestResult> => {
    const result: TestResult = {
      endpoint,
      status: 'pending',
      timestamp: new Date()
    };

    try {
      const response = await apiClient.get(endpoint);
      result.status = 'success';
      result.response = response;
      console.log(`✅ ${endpoint} success:`, response);
    } catch (error: any) {
      result.status = 'error';
      result.error = error.message || 'Unknown error';
      console.error(`❌ ${endpoint} error:`, error);
    }

    return result;
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    const results: TestResult[] = [];

    for (const endpoint of endpoints) {
      const result = await runSingleTest(endpoint.endpoint);
      results.push(result);
      setTestResults([...results]); // Update UI progressively
    }

    setIsRunningTests(false);
  };

  const runServiceTest = async () => {
    setIsRunningTests(true);
    try {
      const serviceResult = await CompanyAnalyticsService.getAllAnalyticsData();
      console.log('🔄 Service test result:', serviceResult);
      
      const result: TestResult = {
        endpoint: 'CompanyAnalyticsService',
        status: 'success',
        response: serviceResult,
        timestamp: new Date()
      };
      
      setTestResults(prev => [...prev, result]);
    } catch (error: any) {
      const result: TestResult = {
        endpoint: 'CompanyAnalyticsService',
        status: 'error',
        error: error.message,
        timestamp: new Date()
      };
      
      setTestResults(prev => [...prev, result]);
    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFFAF3] rounded-xl shadow-sm border border-[#63D7C7]/20 p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#004F4D] mb-2">Analytics Debug Console</h1>
              <p className="text-[#1F7368]">Test and debug your analytics API connections</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={runAllTests} disabled={isRunningTests} className="bg-[#1F7368] hover:bg-[#004F4D]">
                <Play className="w-4 h-4 mr-2" />
                {isRunningTests ? 'Testing...' : 'Test All Endpoints'}
              </Button>
              <Button onClick={runServiceTest} disabled={isRunningTests} variant="outline" className="border-[#63D7C7]/30 text-[#1F7368]">
                <Database className="w-4 h-4 mr-2" />
                Test Service
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Results */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#FFFAF3] rounded-xl shadow-sm border border-[#63D7C7]/20"
          >
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-[#004F4D] flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {endpoints.map((endpoint) => {
                    const result = testResults.find(r => r.endpoint === endpoint.endpoint);
                    return (
                      <div
                        key={endpoint.endpoint}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedTest?.endpoint === endpoint.endpoint
                            ? 'border-[#1F7368] bg-[#E8F5F3]'
                            : 'border-[#63D7C7]/20 hover:border-[#63D7C7]/40'
                        }`}
                        onClick={() => setSelectedTest(result || null)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-[#004F4D]">{endpoint.name}</h3>
                            <p className="text-sm text-[#1F7368]/70">{endpoint.description}</p>
                            <code className="text-xs text-[#1F7368]/60 font-mono">
                              {endpoint.endpoint}
                            </code>
                          </div>
                          <div className="flex items-center space-x-2">
                            {result ? (
                              <>
                                {getStatusIcon(result.status)}
                                <span className="text-sm font-medium text-[#1F7368]">
                                  {result.status === 'success' ? 'Connected' : 
                                   result.status === 'error' ? 'Error' : 'Testing...'}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm text-[#1F7368]/60">Not tested</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Response Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#FFFAF3] rounded-xl shadow-sm border border-[#63D7C7]/20"
          >
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-[#004F4D] flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Response Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTest ? (
                  <Tabs defaultValue="response" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="response">Response</TabsTrigger>
                      <TabsTrigger value="info">Info</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="response" className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm overflow-auto max-h-96">
                          {selectedTest.status === 'success' 
                            ? JSON.stringify(selectedTest.response, null, 2)
                            : selectedTest.error || 'No response data'}
                        </pre>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="info" className="mt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-[#004F4D]">Status:</span>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(selectedTest.status)}
                            <span className="text-sm text-[#1F7368]">
                              {selectedTest.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-[#004F4D]">Endpoint:</span>
                          <code className="text-sm text-[#1F7368] font-mono">
                            {selectedTest.endpoint}
                          </code>
                        </div>
                        
                        {selectedTest.timestamp && (
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-[#004F4D]">Tested at:</span>
                            <span className="text-sm text-[#1F7368]">
                              {selectedTest.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        )}
                        
                        {selectedTest.error && (
                          <div className="pt-3 border-t border-[#63D7C7]/20">
                            <span className="text-sm font-medium text-red-600">Error:</span>
                            <p className="text-sm text-red-700 mt-1">{selectedTest.error}</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-12 text-[#1F7368]/60">
                    <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a test result to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Quick Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFFAF3] rounded-xl shadow-sm border border-[#63D7C7]/20 mt-8 p-6"
        >
          <h3 className="text-lg font-semibold text-[#004F4D] mb-4">Troubleshooting Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-[#1F7368]">Authentication Issues</h4>
              <p className="text-sm text-[#1F7368]/70">
                Ensure you're logged in as a company user with proper permissions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-[#1F7368]">Network Connectivity</h4>
              <p className="text-sm text-[#1F7368]/70">
                Check your internet connection and firewall settings.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-[#1F7368]">Backend Issues</h4>
              <p className="text-sm text-[#1F7368]/70">
                Backend may be down or endpoints might need configuration.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};