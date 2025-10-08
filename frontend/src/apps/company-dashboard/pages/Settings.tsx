import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  CreditCard,
  Building2,
  Mail,
  Phone,
  Globe,
  Eye,
  EyeOff,
  Smartphone,
  Download,
  Trash2,
  Edit3,
  Check,
  Crown,
  Calendar,
  FileText,
  Users,
  HelpCircle,
  Save,
  Camera,
  Upload,
  History,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import { apiClient } from '@/api';

export const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal states for different functionalities
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    description: '',
    contactPerson: '',
    industryType: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch company profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await apiClient.get('/api/v1/companies/profile');
        setFormData({
          companyName: profile.company_name || '',
          email: profile.email || '',
          phone: profile.contact_number || '',
          website: profile.company_website || '',
          address: profile.address || '',
          description: '',
          contactPerson: profile.contact_person || '',
          industryType: profile.industry_type || '',
          country: profile.country || '',
          state: profile.state || '',
          city: profile.city || '',
          pincode: profile.pincode || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const [notifications, setNotifications] = useState({
    newApplications: true,
    deadlineReminders: true,
    emailDigest: true,
    smsAlerts: false,
    weeklyReports: true,
    securityAlerts: true
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    loginNotifications: true
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: string, value: boolean | string) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
  };

  // API handlers - ready for backend integration
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      // API call: PUT /api/v1/companies/profile
      await apiClient.put('/api/v1/companies/profile', {
        company_name: formData.companyName,
        contact_person: formData.contactPerson,
        contact_number: formData.phone,
        company_website: formData.website,
        industry_type: formData.industryType,
        address: formData.address,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        pincode: formData.pincode,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      // API call: PUT /api/company/notifications
      console.log('Saving notifications:', notifications);
      alert('Notification preferences updated!');
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        alert('New password and confirm password do not match');
        return;
      }
      
      if (!formData.currentPassword || !formData.newPassword) {
        alert('Please fill in all password fields');
        return;
      }

      setIsSaving(true);
      // API call: PUT /api/v1/companies/password
      await apiClient.put('/api/v1/companies/password', {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
      });
      alert('Password updated successfully!');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (error: any) {
      console.error('Error updating password:', error);
      alert(error.message || 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      // API call: POST/DELETE /api/auth/2fa
      console.log('Toggling 2FA:', !security.twoFactorEnabled);
      if (!security.twoFactorEnabled) {
        setShow2FAModal(true);
      } else {
        handleSecurityChange('twoFactorEnabled', false);
        alert('Two-factor authentication disabled');
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error);
    }
  };

  const handleUpgradePlan = () => {
    // Navigate to pricing page or show upgrade modal
    window.open('/pricing?type=company', '_blank');
  };

  const handleAddPaymentMethod = () => {
    setShowPaymentModal(true);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // API call: GET /api/billing/invoice/:id/download
    console.log('Downloading invoice:', invoiceId);
    // window.open(`/api/billing/invoice/${invoiceId}/download`, '_blank');
  };

  const handleInviteTeamMember = () => {
    setShowInviteModal(true);
  };

  const handleEditTeamMember = (memberId: string) => {
    // Navigate to team member edit page or show modal
    console.log('Editing team member:', memberId);
  };

  const handleExportData = async () => {
    try {
      // API call: POST /api/data/export
      console.log('Exporting data');
      alert('Data export started. You will receive an email when ready.');
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountModal(true);
  };

  const handleContactSupport = (type: 'email' | 'phone') => {
    if (type === 'email') {
      window.open('mailto:support@i-intern.com?subject=Support Request', '_blank');
    } else {
      window.open('tel:+15551234567', '_blank');
    }
  };

  const handleViewLoginHistory = () => {
    // Open login history in new page or modal
    console.log('Viewing login history');
    alert('Login history will open in a new page');
  };

  const settingsSections = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'support', label: 'Help & Support', icon: HelpCircle }
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <Input
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Enter company name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <Input
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="Enter website URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Person
            </label>
            <Input
              value={formData.contactPerson}
              onChange={(e) => handleInputChange('contactPerson', e.target.value)}
              placeholder="Enter contact person name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry Type
            </label>
            <Input
              value={formData.industryType}
              onChange={(e) => handleInputChange('industryType', e.target.value)}
              placeholder="e.g., Technology, Healthcare, Finance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <Input
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="Enter country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <Input
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="Enter state"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <Input
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode
            </label>
            <Input
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              placeholder="Enter pincode"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <Input
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter company address"
          />
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your company..."
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Logo</h3>
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[#63D7C7] to-[#1F7368] rounded-lg flex items-center justify-center">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <Button 
              variant="outline" 
              className="mr-3"
              onClick={() => setShowLogoModal(true)}
            >
              <Camera className="w-4 h-4 mr-2" />
              Change Logo
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                // API call to remove logo
                console.log('Removing logo');
                alert('Logo removed successfully!');
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button 
          variant="outline"
          onClick={() => {
            // Refetch profile data to reset form
            window.location.reload();
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSaveProfile} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">New Applications</div>
              <div className="text-sm text-gray-600">Get notified when someone applies to your internships</div>
            </div>
            <Switch
              checked={notifications.newApplications}
              onCheckedChange={(checked) => handleNotificationChange('newApplications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Deadline Reminders</div>
              <div className="text-sm text-gray-600">Reminders before internship application deadlines</div>
            </div>
            <Switch
              checked={notifications.deadlineReminders}
              onCheckedChange={(checked) => handleNotificationChange('deadlineReminders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Weekly Email Digest</div>
              <div className="text-sm text-gray-600">Summary of applications and activities</div>
            </div>
            <Switch
              checked={notifications.emailDigest}
              onCheckedChange={(checked) => handleNotificationChange('emailDigest', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Weekly Reports</div>
              <div className="text-sm text-gray-600">Analytics and performance reports</div>
            </div>
            <Switch
              checked={notifications.weeklyReports}
              onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">SMS Alerts</div>
              <div className="text-sm text-gray-600">Urgent notifications via SMS</div>
            </div>
            <Switch
              checked={notifications.smsAlerts}
              onCheckedChange={(checked) => handleNotificationChange('smsAlerts', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Security Alerts</div>
              <div className="text-sm text-gray-600">Important security-related notifications</div>
            </div>
            <Switch
              checked={notifications.securityAlerts}
              onCheckedChange={(checked) => handleNotificationChange('securityAlerts', checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button 
          variant="outline"
          onClick={() => {
            // Reset to default notification settings
            setNotifications({
              newApplications: true,
              deadlineReminders: true,
              emailDigest: true,
              smsAlerts: false,
              weeklyReports: true,
              securityAlerts: true
            });
          }}
        >
          Reset to Default
        </Button>
        <Button onClick={handleSaveNotifications}>
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <Input
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-medium text-gray-900">Two-Factor Authentication</div>
              <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
            </div>
            <Switch
              checked={security.twoFactorEnabled}
              onCheckedChange={handleToggle2FA}
            />
          </div>
          {security.twoFactorEnabled && (
            <div className="mt-4 p-3 bg-[#FFFAF3] border border-[#63D7C7]/30 rounded-lg">
              <div className="flex items-center space-x-2 text-[#004F4D]">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Two-factor authentication is enabled</span>
              </div>
              <div className="flex space-x-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShow2FAModal(true)}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Manage Devices
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleViewLoginHistory}
                >
                  <History className="w-4 h-4 mr-2" />
                  Login History
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <select
              value={security.sessionTimeout}
              onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Login Notifications</div>
              <div className="text-sm text-gray-600">Get notified of new login attempts</div>
            </div>
            <Switch
              checked={security.loginNotifications}
              onCheckedChange={(checked) => handleSecurityChange('loginNotifications', checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button 
          variant="outline"
          onClick={() => {
            setFormData(prev => ({ 
              ...prev, 
              currentPassword: '', 
              newPassword: '', 
              confirmPassword: '' 
            }));
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleUpdatePassword} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Updating...' : 'Update Security'}
        </Button>
      </div>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
        <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#004F4D]">Genesis Plan</h4>
                <p className="text-[#1F7368]">₹699/month • Billed Monthly</p>
              </div>
            </div>
            <Button onClick={handleUpgradePlan}>Upgrade Plan</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#004F4D]">5</div>
              <div className="text-sm text-[#1F7368]">Postings/month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#004F4D]">30</div>
              <div className="text-sm text-[#1F7368]">Profile views/month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#004F4D]">✓</div>
              <div className="text-sm text-[#1F7368]">Verified Badge</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-6 bg-[#1F7368] rounded text-white text-xs flex items-center justify-center font-bold">
                VISA
              </div>
              <div>
                <div className="font-medium">•••• •••• •••• 4242</div>
                <div className="text-sm text-gray-600">Expires 12/26</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Primary</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Navigate to edit payment method
                  console.log('Editing payment method');
                  setShowPaymentModal(true);
                }}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleAddPaymentMethod}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
        <div className="space-y-3">
          {[
            { date: 'Sep 1, 2025', amount: '₹699', status: 'Paid', invoice: 'INV-001' },
            { date: 'Aug 1, 2025', amount: '₹699', status: 'Paid', invoice: 'INV-002' },
            { date: 'Jul 1, 2025', amount: '₹699', status: 'Paid', invoice: 'INV-003' }
          ].map((bill, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium">{bill.date}</div>
                  <div className="text-sm text-gray-600">{bill.invoice}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-medium">{bill.amount}</div>
                  <div className="text-sm text-green-600">{bill.status}</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownloadInvoice(bill.invoice)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTeamSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
        <div className="space-y-3">
          {[
            { name: 'John Smith', email: 'john@techcorp.com', role: 'Admin', status: 'Active' },
            { name: 'Sarah Johnson', email: 'sarah@techcorp.com', role: 'HR Manager', status: 'Active' },
            { name: 'Mike Chen', email: 'mike@techcorp.com', role: 'Recruiter', status: 'Pending' }
          ].map((member, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-gray-600">{member.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-medium">{member.role}</div>
                  <div className={`text-sm ${member.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {member.status}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditTeamMember(member.name)}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          className="mt-4"
          onClick={handleInviteTeamMember}
        >
          <Users className="w-4 h-4 mr-2" />
          Invite Team Member
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Roles & Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { role: 'Admin', permissions: ['Full Access', 'User Management', 'Billing'] },
            { role: 'HR Manager', permissions: ['Post Jobs', 'Review Applications', 'Interview'] },
            { role: 'Recruiter', permissions: ['Review Applications', 'Schedule Interviews'] }
          ].map((role, index) => (
            <Card key={index} className="p-4 bg-[#FFFAF3] border-2 border-[#63D7C7]">
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-lg">{role.role}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {role.permissions.map((permission, pIndex) => (
                    <div key={pIndex} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">{permission}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSupportSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Help Center</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Getting Started Guide', icon: FileText },
            { title: 'FAQ', icon: HelpCircle },
            { title: 'Video Tutorials', icon: Globe },
            { title: 'API Documentation', icon: FileText }
          ].map((item, index) => (
            <Card key={index} className="p-4 bg-[#FFFAF3] border-2 border-[#63D7C7] hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-teal-600" />
                  <span className="font-medium">{item.title}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Email Support</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Get help via email within 24 hours</p>
            <Button 
              variant="outline"
              onClick={() => handleContactSupport('email')}
            >
              Send Email
            </Button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Phone className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Phone Support</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Call us during business hours</p>
            <Button 
              variant="outline"
              onClick={() => handleContactSupport('phone')}
            >
              +1 (555) 123-4567
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
        <div className="space-y-3">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Export Data</div>
                <div className="text-sm text-gray-600">Download all your account data</div>
              </div>
              <Button 
                variant="outline"
                onClick={handleExportData}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-red-900">Delete Account</div>
                <div className="text-sm text-red-700">Permanently delete your account and all data</div>
              </div>
              <Button 
                variant="outline" 
                className="border-red-300 text-red-700 hover:bg-red-100"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'billing':
        return renderBillingSettings();
      case 'team':
        return renderTeamSettings();
      case 'support':
        return renderSupportSettings();
      default:
        return renderProfileSettings();
    }
  };

  // Modal Components
  const LogoUploadModal = () => (
    showLogoModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Upload Company Logo</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Drop your logo here or click to browse</p>
            <Button>Choose File</Button>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowLogoModal(false)}>Cancel</Button>
            <Button onClick={() => {
              // API call to upload logo
              console.log('Uploading logo');
              setShowLogoModal(false);
              alert('Logo uploaded successfully!');
            }}>Upload</Button>
          </div>
        </div>
      </div>
    )
  );

  const PaymentMethodModal = () => (
    showPaymentModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Add Payment Method</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <Input placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <Input placeholder="MM/YY" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <Input placeholder="123" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
              <Input placeholder="John Doe" />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
            <Button onClick={() => {
              // API call to add payment method
              console.log('Adding payment method');
              setShowPaymentModal(false);
              alert('Payment method added successfully!');
            }}>Add Card</Button>
          </div>
        </div>
      </div>
    )
  );

  const InviteTeamModal = () => (
    showInviteModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Invite Team Member</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <Input placeholder="colleague@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>HR Manager</option>
                <option>Recruiter</option>
                <option>Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Personal Message (Optional)</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={3}
                placeholder="Welcome to our team..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowInviteModal(false)}>Cancel</Button>
            <Button onClick={() => {
              // API call to send invitation
              console.log('Sending invitation');
              setShowInviteModal(false);
              alert('Invitation sent successfully!');
            }}>Send Invitation</Button>
          </div>
        </div>
      </div>
    )
  );

  const DeleteAccountModal = () => (
    showDeleteAccountModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900">Delete Account</h3>
              <p className="text-sm text-red-700">This action cannot be undone</p>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800">
              Deleting your account will permanently remove all your data, including:
            </p>
            <ul className="list-disc list-inside text-sm text-red-800 mt-2 space-y-1">
              <li>All internship postings</li>
              <li>Applicant data and communications</li>
              <li>Team member access</li>
              <li>Billing and payment history</li>
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type "DELETE" to confirm
            </label>
            <Input placeholder="DELETE" />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowDeleteAccountModal(false)}>Cancel</Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                // API call to delete account
                console.log('Deleting account');
                setShowDeleteAccountModal(false);
                alert('Account deletion initiated. You will receive a confirmation email.');
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    )
  );

  const TwoFactorModal = () => (
    show2FAModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Enable Two-Factor Authentication</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">QR Code</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code with your authenticator app
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or enter this code manually:
              </label>
              <Input 
                value="ABCD-EFGH-IJKL-MNOP" 
                readOnly 
                className="font-mono text-center"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter verification code:
              </label>
              <Input placeholder="000000" maxLength={6} />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShow2FAModal(false)}>Cancel</Button>
            <Button onClick={() => {
              // API call to enable 2FA
              console.log('Enabling 2FA');
              setShow2FAModal(false);
              handleSecurityChange('twoFactorEnabled', true);
              alert('Two-factor authentication enabled successfully!');
            }}>Enable 2FA</Button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#FFFAF3] rounded-xl shadow-sm border-2 border-[#63D7C7] p-6"
      >
        <div className="flex items-center space-x-3">
          <SettingsIcon className="w-8 h-8 text-[#1F7368]" />
          <div>
            <h1 className="text-3xl font-bold text-[#004F4D]">Settings</h1>
            <p className="text-[#1F7368] mt-1">
              Manage your account and application preferences
            </p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <Card className="p-6 bg-[#FFFAF3] border-2 border-[#63D7C7]">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F7368]"></div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4 bg-[#FFFAF3] border-2 border-[#63D7C7]">
            <nav className="space-y-2">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-[#FFFAF3] to-[#F0EDE6] text-[#004F4D] border-r-2 border-[#1F7368]'
                        : 'text-gray-600 hover:text-[#1F7368] hover:bg-[#FFFAF3]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="p-6 bg-[#FFFAF3] border-2 border-[#63D7C7]">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderSectionContent()}
            </motion.div>
          </Card>
        </div>
      </div>
      )}

      {/* Modals */}
      <LogoUploadModal />
      <PaymentMethodModal />
      <InviteTeamModal />
      <DeleteAccountModal />
      <TwoFactorModal />
    </div>
  );
};


