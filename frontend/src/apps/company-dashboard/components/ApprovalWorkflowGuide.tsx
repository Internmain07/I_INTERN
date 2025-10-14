import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  AlertCircle,
  Mail,
  CheckCircle,
  UserCheck,
  XCircle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface ApprovalWorkflowGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApprovalWorkflowGuide: React.FC<ApprovalWorkflowGuideProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const workflowSteps = [
    {
      status: 'Applied',
      icon: Clock,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      description: 'Student submits application',
      action: 'Review application and move to "Under Review"',
      timeline: 'Immediate',
    },
    {
      status: 'Under Review',
      icon: AlertCircle,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      description: 'Application is being evaluated',
      action: 'Send offer letter or reject application',
      timeline: '1-3 days',
    },
    {
      status: 'Offered',
      icon: Mail,
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      description: 'Offer letter sent to student',
      action: 'Wait for student response',
      timeline: '3-7 days',
    },
    {
      status: 'Offer Accepted',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-700 border-green-300',
      description: 'Student accepted the offer',
      action: 'Confirm hiring to complete process',
      timeline: 'Within 24 hours',
    },
    {
      status: 'Hired',
      icon: UserCheck,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      description: 'Student successfully hired',
      action: 'Process complete - contact details available',
      timeline: 'Final',
    },
  ];

  const rejectedSteps = [
    {
      status: 'Rejected',
      icon: XCircle,
      color: 'bg-red-100 text-red-700 border-red-300',
      description: 'Application rejected during review',
      action: 'Process complete - no further action needed',
      timeline: 'Final',
    },
    {
      status: 'Offer Rejected',
      icon: XCircle,
      color: 'bg-red-100 text-red-700 border-red-300',
      description: 'Student declined the offer',
      action: 'Process complete - consider other candidates',
      timeline: 'Final',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1F7368] to-[#63D7C7] text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Application Approval Workflow</h2>
                <p className="text-teal-100 mt-1">
                  Understand how to efficiently manage student applications
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            
            {/* Main Workflow */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="w-5 h-5 text-[#1F7368] mr-2" />
                Standard Hiring Process
              </h3>
              
              <div className="space-y-4">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.status} className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${step.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium text-gray-900">{step.status}</h4>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {step.timeline}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{step.description}</p>
                        <p className="text-sm text-[#1F7368] mt-1 font-medium">
                          Action: {step.action}
                        </p>
                      </div>

                      {index < workflowSteps.length - 1 && (
                        <div className="ml-4 flex-shrink-0">
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Alternative Outcomes */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                Alternative Outcomes
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rejectedSteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <Card key={step.status} className="border-2 border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 ml-3">{step.status}</h4>
                        </div>
                        <p className="text-gray-600 mb-2">{step.description}</p>
                        <p className="text-sm text-red-600 font-medium">
                          Action: {step.action}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Pro Tips for Efficient Hiring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Contact details become available only after students accept offers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Review applications within 1-3 days to maintain student engagement</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Use skill matching percentages to prioritize candidates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Confirm hiring promptly after offer acceptance to complete the process</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#1F7368] text-white rounded-lg hover:bg-[#004F4D] transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};