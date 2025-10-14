import React from 'react';
import { ApiConnectionTest } from '../components/ApiConnectionTest';

export const ConnectionTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#FFFAF3] mb-2">
            API Connection Diagnostics
          </h1>
          <p className="text-[#E8F5F3]">
            Test backend connectivity and troubleshoot issues
          </p>
        </div>
        
        <ApiConnectionTest />
        
        <div className="bg-[#FFFAF3] rounded-xl shadow-sm border border-[#63D7C7]/20 p-6">
          <h2 className="text-xl font-semibold text-[#004F4D] mb-4">
            Troubleshooting Tips
          </h2>
          <div className="space-y-3 text-sm text-[#1F7368]">
            <div className="flex items-start space-x-2">
              <span className="font-medium">1.</span>
              <p>Ensure the backend server is running on port 8002</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">2.</span>
              <p>Check that you're logged in with a company account</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">3.</span>
              <p>Verify your network connection</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">4.</span>
              <p>Check browser console for detailed error messages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};