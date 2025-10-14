import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WifiOff, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { applicationService } from '@/services/application.service';

interface ConnectionStatusProps {
  showDetails?: boolean;
  autoCheck?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  showDetails = false, 
  autoCheck = true 
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      // Try to fetch applicants to test backend connection
      await applicationService.getAllCompanyApplicants();
      setIsConnected(true);
      setLastChecked(new Date());
    } catch (err: any) {
      setIsConnected(false);
      setError(err.message || 'Connection failed');
      setLastChecked(new Date());
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (autoCheck) {
      checkConnection();
      
      // Check connection every 30 seconds
      const interval = setInterval(checkConnection, 30000);
      return () => clearInterval(interval);
    }
  }, [autoCheck]);

  const getStatusIcon = () => {
    if (isChecking) {
      return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
    }
    
    if (isConnected === null) {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
    
    return isConnected ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <WifiOff className="w-4 h-4 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (isChecking) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Checking...</Badge>;
    }
    
    if (isConnected === null) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Unknown</Badge>;
    }
    
    return isConnected ? 
      <Badge className="bg-green-100 text-green-700 border-green-300">Connected</Badge> :
      <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-300">Disconnected</Badge>;
  };

  if (!showDetails) {
    return (
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        {getStatusBadge()}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 mb-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Backend Connection</h3>
            <p className="text-xs text-gray-500">
              {lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : 'Not checked yet'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {getStatusBadge()}
          <Button
            onClick={checkConnection}
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            {isChecking ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Test
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">
            <strong>Error:</strong> {error}
          </p>
          <p className="text-xs text-red-600 mt-1">
            Please check your internet connection and ensure the backend server is running.
          </p>
        </div>
      )}
      
      {isConnected && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            Backend connection is working properly. All features should be available.
          </p>
        </div>
      )}
    </motion.div>
  );
};