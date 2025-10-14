import React, { useState } from 'react';
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
import { useCompanyProfile } from '../../hooks/useCompanyProfile';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use the company profile hook for dynamic data
  const { data: profile } = useCompanyProfile();
  const companyName = profile?.company_name || 'Company';
  const contactPerson = profile?.contact_person || 'Manager';

  const notifications = [
    { id: 1, title: 'New application received', time: '2 min ago', type: 'application' },
    { id: 2, title: 'Interview scheduled', time: '1 hour ago', type: 'interview' },
    { id: 3, title: 'Application deadline reminder', time: '3 hours ago', type: 'reminder' },
  ];

  return (
    <header className="bg-gradient-to-r from-[#004F4D] via-[#1F7368] to-[#004F4D] border-b border-[#63D7C7]/20 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#63D7C7] w-4 h-4" />
            <Input
              type="text"
              placeholder="Search applicants, internships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full bg-[#003836]/50 border-[#63D7C7]/30 text-white placeholder:text-[#63D7C7]/60 focus:border-[#63D7C7] focus:ring-[#63D7C7]/20"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative hover:bg-[#63D7C7]/20 text-white">
                  <Bell className="w-5 h-5 text-white" />
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent isOpen={isNotificationOpen} className="w-80 bg-[#FFFAF3] border border-[#63D7C7]/20">
              <div className="px-4 py-2 border-b border-[#63D7C7]/20">
                <h3 className="font-medium text-[#004F4D]">Notifications</h3>
              </div>
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="px-4 py-3 hover:bg-[#E8F5F3]">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-[#1F7368] rounded-full"></div>
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
              <div className="px-4 py-2 border-t border-[#63D7C7]/20">
                <Button variant="ghost" className="w-full text-sm text-[#1F7368] hover:bg-[#E8F5F3]">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[#63D7C7]/20 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-[#63D7C7] to-[#1F7368] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{contactPerson || companyName}</p>
                  <p className="text-xs text-[#63D7C7]">{companyName}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-[#63D7C7]" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent isOpen={isProfileOpen} className="bg-[#FFFAF3] border border-[#63D7C7]/20">
              <DropdownMenuItem 
                className="flex items-center space-x-2 cursor-pointer text-[#004F4D] hover:bg-[#E8F5F3]"
                onClick={() => navigate('/company/settings')}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <div className="border-t border-[#63D7C7]/20 my-1"></div>
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


