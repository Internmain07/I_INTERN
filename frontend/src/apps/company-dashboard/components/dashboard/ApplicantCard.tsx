import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Briefcase } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate, getStatusColor } from '@/shared/lib/utils';
import { Applicant } from '@/shared/types';
import { Skeleton } from '../ui/Skeleton';

interface ApplicantCardProps {
  applicant: Applicant;
  isLoading?: boolean;
  index?: number;
  onClick?: (applicant: Applicant) => void;
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({
  applicant,
  isLoading = false,
  index = 0,
  onClick,
}) => {
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex space-x-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
        <CardContent className="p-0" onClick={() => onClick?.(applicant)}>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex space-x-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-white">
                    {applicant.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{applicant.name}</h4>
                    {applicant.match_percentage !== undefined && applicant.match_percentage > 0 && (
                      <Badge
                        className={`text-xs font-semibold ${
                          applicant.match_percentage >= 80 ? 'bg-green-100 text-green-700 border-green-300' :
                          applicant.match_percentage >= 60 ? 'bg-blue-100 text-blue-700 border-blue-300' :
                          applicant.match_percentage >= 40 ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                          'bg-red-100 text-red-700 border-red-300'
                        }`}
                        variant="outline"
                      >
                        {applicant.match_percentage.toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Mail className="w-3 h-3" />
                    {applicant.canViewContactDetails ? (
                      <span className="line-clamp-1">{applicant.email}</span>
                    ) : (
                      <span className="line-clamp-1 italic text-gray-500">
                        Contact details protected
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Badge
                className={getStatusColor(applicant.status)}
                variant="secondary"
              >
                {applicant.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {applicant.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-50 text-teal-700 border border-teal-200"
                  >
                    {skill}
                  </span>
                ))}
                {applicant.skills.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                    +{applicant.skills.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Briefcase className="w-3 h-3" />
                  <span className="line-clamp-1">{applicant.internshipTitle}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(applicant.applicationDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


