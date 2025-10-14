import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X,
  MapPin,
  IndianRupee,
  Clock,
  Users,
  Briefcase,
  CheckCircle,
  Building, 
  Eye,
  Edit,
  Share2,
  Copy,
  Mail,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { formatCurrency, formatDate, getStatusColor } from '@/shared/lib/utils';
import { Internship } from '@/shared/types';

interface InternshipDetailsModalProps {
  internship: Internship | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InternshipDetailsModal: React.FC<InternshipDetailsModalProps> = ({
  internship,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [isSharing, setIsSharing] = React.useState(false);
  const [showShareOptions, setShowShareOptions] = React.useState(false);

  // Reset share options when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setShowShareOptions(false);
    }
  }, [isOpen]);

  if (!internship) return null;

  // Quick Action Handlers
  const handleViewApplications = () => {
    // Navigate to applications page for this internship
    navigate(`/company/applicants?internshipId=${internship.id}`);
    onClose();
  };

  const handleEditInternship = () => {
    // Navigate to edit internship page
    navigate(`/company/internships/edit/${internship.id}`);
    onClose();
  };

  // Enhanced sharing functionality
  const shareUrl = `${window.location.origin}/internship/${internship.id}`;
  const shareTitle = `${internship.title} Internship Opportunity`;
  const shareText = `Check out this ${internship.title} internship at ${internship.location}! Stipend: ₹${internship.stipend}/month for ${internship.duration}.`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showNotification('✅ Link copied to clipboard!', 'success');
      setShowShareOptions(false); // Close share options after action
    } catch (error) {
      console.error('Failed to copy link:', error);
      showNotification('❌ Failed to copy link', 'error');
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`${shareText}\n\nApply here: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setShowShareOptions(false); // Close share options after action
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${shareTitle}\n\n${shareText}\n\nApply here: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShareOptions(false); // Close share options after action
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(shareUrl);
    const title = encodeURIComponent(shareTitle);
    const summary = encodeURIComponent(shareText);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank');
    setShowShareOptions(false); // Close share options after action
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`${shareTitle}\n\n${shareText}`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    setShowShareOptions(false); // Close share options after action
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    setShowShareOptions(false); // Close share options after action
  };

  const handleQuickShareToggle = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleNativeShare = async () => {
    setIsSharing(true);

    const shareData = {
      title: shareTitle,
      text: shareText,
      url: shareUrl
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        showNotification('✅ Shared successfully!', 'success');
      } else {
        // Fallback: copy to clipboard
        const fullText = `${shareTitle}\n\n${shareText}\n\nApply here: ${shareUrl}`;
        await navigator.clipboard.writeText(fullText);
        showNotification('✅ Internship details copied to clipboard!', 'success');
      }
      setShowShareOptions(false); // Close share options after action
    } catch (error) {
      console.error('Error sharing:', error);
      showNotification('❌ Sharing failed', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 text-white ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-start justify-between p-6 border-b sticky top-0 bg-white z-10">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-teal-100 rounded-lg">
                    <Briefcase className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {internship.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Building className="w-4 h-4" />
                        <span>{internship.company}</span>
                      </div>
                      <Badge
                        className={getStatusColor(internship.status)}
                        variant="secondary"
                      >
                        {internship.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Key Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-semibold">{internship.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <IndianRupee className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Stipend</p>
                          <p className="font-semibold">{formatCurrency(internship.stipend)}/mo</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-semibold">{internship.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Users className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Applicants</p>
                          <p className="font-semibold">{internship.applicantCount}</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Job Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {internship.description}
                      </p>
                    </div>

                    {/* Skills Required */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Skills Required
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(internship.skills || [] ).map((skill, index) => (
                          <Badge key={index} variant="outline" className="border-teal-200 text-teal-700 bg-teal-50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Requirements
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {internship.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits & Perks */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Benefits & Perks
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {(internship.benefits || []).map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Timeline */}
                    <Card className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">Posted</p>
                            <p className="text-xs text-gray-600">
                              {formatDate(internship.datePosted)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">Application Deadline</p>
                            <p className="text-xs text-gray-600">
                              {formatDate(internship.deadline)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Work Type */}
                    <Card className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Work Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Work Type</span>
                          <Badge variant="outline">{internship.type}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Duration</span>
                          <span className="text-sm font-medium">{internship.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <Badge
                            className={getStatusColor(internship.status)}
                            variant="secondary"
                          >
                            {internship.status}
                          </Badge>
                        </div>
                      </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-2">
                        <Button
                          className="w-full"
                          size="sm"
                          onClick={handleViewApplications}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Applications
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          size="sm"
                          onClick={handleEditInternship}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Internship
                        </Button>

                        {/* Enhanced Share Menu */}
                        <div className="w-full">
                          <Button
                            variant="outline"
                            className="w-full mb-2"
                            size="sm"
                            onClick={handleQuickShareToggle}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Quick Share
                          </Button>

                          {showShareOptions && (
                            <div className="grid grid-cols-2 gap-2 mt-2 p-2 bg-gray-50 rounded-md border">
                              <Button variant="ghost" size="sm" className="text-xs p-2 h-auto" onClick={handleNativeShare} disabled={isSharing}><Share2 className="w-3 h-3 mr-1" />{isSharing ? 'Sharing...' : 'System Share'}</Button>
                              <Button variant="ghost" size="sm" className="text-xs p-2 h-auto" onClick={handleCopyLink}><Copy className="w-3 h-3 mr-1" />Copy Link</Button>
                              <Button variant="ghost" size="sm" className="text-xs p-2 h-auto" onClick={handleEmailShare}><Mail className="w-3 h-3 mr-1" />Email</Button>
                              <Button variant="ghost" size="sm" className="text-xs p-2 h-auto" onClick={handleWhatsAppShare}><MessageCircle className="w-3 h-3 mr-1" />WhatsApp</Button>
                              <Button variant="ghost" size="sm" className="text-xs p-2 h-auto" onClick={handleLinkedInShare}><ExternalLink className="w-3 h-3 mr-1" />LinkedIn</Button>
                              <Button variant="ghost" size="sm" className="text-xs p-2 h-auto" onClick={handleTwitterShare}><ExternalLink className="w-3 h-3 mr-1" />Twitter</Button>
                              <Button variant="ghost" size="sm" className="text-xs p-2 h-auto" onClick={handleFacebookShare}><ExternalLink className="w-3 h-3 mr-1" />Facebook</Button>
                              <Button variant="ghost" size="sm" className="text-xs p-2 h-auto text-gray-500" onClick={handleQuickShareToggle}><X className="w-3 h-3 mr-1" />Close</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>

                    {/* Application Stats */}
                    <Card className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Application Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Total Applications</span><span className="font-semibold">{internship.applicantCount}</span></div>
                        <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Under Review</span><span className="font-semibold">{Math.floor(internship.applicantCount * 0.3)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Shortlisted</span><span className="font-semibold">{Math.floor(internship.applicantCount * 0.15)}</span></div>
                      </div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};