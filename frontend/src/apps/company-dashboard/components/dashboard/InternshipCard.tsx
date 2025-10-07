import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, IndianRupee, Calendar, Share2, Copy, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/DropdownMenu';
import { formatCurrency, formatDate, getStatusColor } from '@/shared/lib/utils';
import { Internship } from '../../types';
import { Skeleton } from '../ui/Skeleton';

interface InternshipCardProps {
  internship: Internship;
  isLoading?: boolean;
  index?: number;
  onClick?: (internship: Internship) => void;
}

export const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  isLoading = false,
  index = 0,
  onClick,
}) => {
  const handleShare = (platform: string) => {
    const shareUrl = `${window.location.origin}/internship/${internship.id}`;
    const shareText = `Check out this ${internship.title} internship at ${internship.location} - ${formatCurrency(internship.stipend)}/month`;
    
    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        // You could add a toast notification here
        break;
      case 'direct':
        window.open(shareUrl, '_blank');
        break;
    }
  };
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-teal-500">
        <CardContent className="p-0" onClick={() => onClick?.(internship)}>
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-gray-900 line-clamp-1">
                {internship.title}
              </h4>
              <div className="flex items-center space-x-2">
                <Badge
                  className={getStatusColor(internship.status)}
                  variant="secondary"
                >
                  {internship.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleShare('linkedin')} className="flex items-center space-x-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>Share on LinkedIn</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('twitter')} className="flex items-center space-x-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>Share on Twitter</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('copy')} className="flex items-center space-x-2">
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('direct')} className="flex items-center space-x-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>View Public Page</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{internship.location}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <IndianRupee className="w-4 h-4" />
                <span>{formatCurrency(internship.stipend)}/month</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{internship.applicantCount} applicants</span>
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(internship.deadline)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


