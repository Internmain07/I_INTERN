import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Eye,
  Copy,
  Trash2,
  MapPin,
  IndianRupee,
  Users,
  Calendar,
  Briefcase,
  Share2,
} from 'lucide-react';
import { DataTable, Column } from '../components/data-table/DataTable';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { formatCurrency, formatDate, getStatusColor } from '@/shared/lib/utils';
import { useAuth } from '../../../auth/AuthContext';
import { InternshipDetailsModal } from '../components/InternshipDetailsModal';
import type { Internship } from '@/shared/types';
import { internshipService } from '@/services/internship.service';
import { useToast } from '@/shared/components/ui/use-toast';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const Internships: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // company-dashboard/pages/Internships.tsx

  const fetchInternships = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/internships/company/my-internships`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch internships');
      }
      const data = await response.json();
      
      // Transform backend data to match frontend Internship interface
      const transformedInternships = data.map((item: any) => ({
        id: item.id,
        title: item.title || 'Untitled',
        company: 'Your Company', // TODO: Get from user profile
        location: item.location || 'Remote',
        stipend: item.stipend || 0,
        applicantCount: item.applicant_count || 0, // Use the actual count from backend
        status: (item.status || 'Active') as 'Active' | 'Closed' | 'Draft',
        datePosted: item.date_posted ? new Date(item.date_posted) : new Date(),
        deadline: item.deadline ? new Date(item.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        description: item.description || '',
        // Map skills from database
        skills: item.skills ? item.skills.split(',').map((s: string) => s.trim()) : [],
        // Map requirements from database  
        requirements: item.requirements ? item.requirements.split(',').map((s: string) => s.trim()) : [],
        // Map benefits from database
        benefits: item.benefits ? item.benefits.split(',').map((s: string) => s.trim()) : [],
        duration: item.duration || '3 months',
        type: (item.type || 'Remote') as 'Remote' | 'Hybrid' | 'In-office',
      }));
      
      setInternships(transformedInternships);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [token]);

  const handleBulkClose = async (selectedInternships: Internship[]) => {
    console.log('Closing internships:', selectedInternships);
    
    for (const internship of selectedInternships) {
      try {
        const response = await fetch(`${API_URL}/api/v1/internships/${internship.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'Closed',
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to close internship');
        }
      } catch (error) {
        console.error('Error closing internship:', error);
      }
    }
    
    // Refetch internships to update the UI
    fetchInternships();
  };

  // company-dashboard/pages/Internships.tsx

  const handleBulkDelete = async (selectedInternships: Internship[]) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedInternships.length} internship(s)? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      for (const internship of selectedInternships) {
        await internshipService.deleteInternship(internship.id);
      }
      
      // Show success notification
      const notification = document.createElement('div');
      notification.textContent = `✅ Successfully deleted ${selectedInternships.length} internship(s)`;
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      
      // Refetch the internships list to update the UI
      fetchInternships();
    } catch (error) {
      console.error('Error deleting internships:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.textContent = '❌ Failed to delete some internships. Please try again.';
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  const handleDelete = async (internship: Internship) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${internship.title}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      await internshipService.deleteInternship(internship.id);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.textContent = '✅ Internship deleted successfully!';
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      
      // Refetch the internships list to update the UI
      fetchInternships();
    } catch (error) {
      console.error('Error deleting internship:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.textContent = '❌ Failed to delete internship. Please try again.';
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  const handleEdit = (internship: Internship) => {
    navigate(`/company/internships/edit/${internship.id}`);
  };

  const handleViewApplicants = (internship: Internship) => {
    console.log('Viewing applicants for:', internship);
    // Navigate to applicants filtered by internship
  };

  const handleClone = (internship: Internship) => {
    console.log('Cloning internship:', internship);
    // Handle clone logic here
  };

  const handleShare = (internship: Internship) => {
    const shareUrl = `${window.location.origin}/internship/${internship.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Share Link Copied!",
        description: `The public link for "${internship.title}" has been copied to your clipboard.`,
      });
    }).catch(() => {
      toast({
        title: "Failed to Copy",
        description: "Could not copy the share link. Please try again.",
        variant: "destructive",
      });
    });
    console.log('Sharing internship:', internship);
  };

  const handleViewDetails = (internship: Internship) => {
    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  const columns: Column<Internship>[] = [
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div>
          <div 
            className="font-semibold text-gray-900 cursor-pointer hover:text-teal-600 transition-colors"
            onClick={() => handleViewDetails(row)}
          >
            {value}
          </div>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            {row.location}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      filterable: true,
      render: (value) => (
        <Badge variant="outline" className="text-xs">
          {value}
        </Badge>
      ),
    },
    {
      key: 'stipend',
      header: 'Stipend',
      sortable: true,
      render: (value) => (
        <div className="flex items-center text-sm font-medium">
          <IndianRupee className="w-3 h-3 mr-1" />
          {formatCurrency(value)}/mo
        </div>
      ),
    },
    {
      key: 'applicantCount',
      header: 'Applicants',
      sortable: true,
      render: (value) => (
        <div className="flex items-center text-sm">
          <Users className="w-3 h-3 mr-1" />
          {value}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <Badge className={getStatusColor(value)} variant="secondary">
          {value}
        </Badge>
      ),
    },
    {
      key: 'deadline',
      header: 'Deadline',
      sortable: true,
      render: (value) => (
        <div className="flex items-center text-sm">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: 'datePosted',
      header: 'Posted',
      sortable: true,
      render: (value) => formatDate(value),
    },
  ];

  const bulkActions = [
    {
      label: 'Close Selected',
      icon: Trash2,
      onClick: handleBulkClose,
    },
    {
      label: 'Delete Selected',
      icon: Trash2,
      onClick: handleBulkDelete,
    },
  ];

  const rowActions = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: handleViewDetails,
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: handleEdit,
    },
    {
      label: 'View Applicants',
      icon: Eye,
      onClick: handleViewApplicants,
    },
    {
      label: 'Clone',
      icon: Copy,
      onClick: handleClone,
    },
    {
      label: 'Share',
      icon: Share2,
      onClick: handleShare,
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: handleDelete,
      variant: 'destructive' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#FFFAF3]">Internships</h1>
            <p className="text-[#E8F5F3] mt-1">
              Manage your internship postings and track applications
            </p>
          </div>

        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="p-4 bg-[#FFFAF3] border-[#63D7C7]/20">
            <CardContent className="p-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#63D7C7] rounded-lg">
                  <Briefcase className="w-5 h-5 text-[#004F4D]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1F7368]">Total</p>
                  <p className="text-2xl font-bold text-[#004F4D]">
                    {internships.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-4 bg-[#FFFAF3] border-[#63D7C7]/20">
            <CardContent className="p-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#63D7C7] rounded-lg">
                  <Eye className="w-5 h-5 text-[#004F4D]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1F7368]">Active</p>
                  <p className="text-2xl font-bold text-[#004F4D]">
                    {internships.filter(i => !i.status || String(i.status).toLowerCase() === 'active').length}
                  </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-[#FFFAF3] border-[#63D7C7]/20">
          <CardContent className="p-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#63D7C7] rounded-lg">
                <Trash2 className="w-5 h-5 text-[#004F4D]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1F7368]">Closed</p>
                <p className="text-2xl font-bold text-[#004F4D]">
                  {internships.filter(i => i.status === 'Closed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Table */}
      <div className="flex justify-end mb-4">
        <Link to="/company/post-internship">
          <Button className="bg-[#1F7368] hover:bg-[#004F4D] text-white flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Post New Internship
          </Button>
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <DataTable
          data={internships}
          columns={columns}
          isLoading={isLoading}
          onRowSelect={(selected) => console.log('Selected rows:', selected)}
          bulkActions={bulkActions}
          rowActions={rowActions}
        />
      </motion.div>

      {/* Internship Details Modal */}
      <InternshipDetailsModal
        internship={selectedInternship}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      </div>
    </div>
  );
};


