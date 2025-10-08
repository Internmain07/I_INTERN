import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Settings,
  LogOut
} from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/DropdownMenu';
import { useAuth } from '@/auth/AuthContext';
import { apiClient } from '@/api';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [companyName, setCompanyName] = useState('Company');
  const [contactPerson, setContactPerson] = useState('Manager');

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const profile = await apiClient.get('/api/v1/companies/profile');
        setCompanyName(profile.company_name || 'Company');
        setContactPerson(profile.contact_person || 'Manager');
      } catch (error) {
        console.error('Error fetching company profile:', error);
      }
    };
    fetchCompanyProfile();
  }, []);

  const notifications = [
    { id: 1, title: 'New application received', time: '2 min ago', type: 'application' },
    { id: 2, title: 'Interview scheduled', time: '1 hour ago', type: 'interview' },
    { id: 3, title: 'Application deadline reminder', time: '3 hours ago', type: 'reminder' },
  ];

  return (
    <header className="bg-[#FFFAF3] border-b-2 border-[#63D7C7] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1F7368] w-4 h-4" />
            <Input
              type="text"
              placeholder="Search applicants, internships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full border-2 border-[#63D7C7]/30 focus:border-[#63D7C7]"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative hover:bg-[#63D7C7]/20">
                  <Bell className="w-5 h-5 text-[#1F7368]" />
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#63D7C7] to-[#1F7368] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    3
                  </span>
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent isOpen={isNotificationOpen} className="w-80 bg-[#FFFAF3] border-2 border-[#63D7C7]">
              <div className="px-4 py-2 border-b-2 border-[#63D7C7]/30">
                <h3 className="font-medium text-[#004F4D]">Notifications</h3>
              </div>
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="px-4 py-3 hover:bg-[#63D7C7]/10">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-gradient-to-br from-[#63D7C7] to-[#1F7368] rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#004F4D]">
                        {notification.title}
                      </p>
                      <p className="text-xs text-[#1F7368]">{notification.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              <div className="px-4 py-2 border-t-2 border-[#63D7C7]/30">
                <Button variant="ghost" className="w-full text-sm text-[#1F7368] hover:bg-[#63D7C7]/10">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[#63D7C7]/20 cursor-pointer border-2 border-transparent hover:border-[#63D7C7]/30 transition-all">
                <div className="w-8 h-8 bg-gradient-to-br from-[#63D7C7] to-[#1F7368] rounded-full flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-[#004F4D]">{contactPerson || companyName}</p>
                  <p className="text-xs text-[#1F7368]">{companyName}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-[#1F7368]" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent isOpen={isProfileOpen} className="bg-[#FFFAF3] border-2 border-[#63D7C7]">
              <DropdownMenuItem 
                className="flex items-center space-x-2 cursor-pointer hover:bg-[#63D7C7]/10 text-[#004F4D]"
                onClick={() => navigate('/company/settings')}
              >
                <Settings className="w-4 h-4 text-[#1F7368]" />
                <span>Settings</span>
              </DropdownMenuItem>
              <div className="border-t-2 border-[#63D7C7]/30 my-1"></div>
              <DropdownMenuItem 
                className="flex items-center space-x-2 text-red-600 cursor-pointer hover:bg-red-50"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};


