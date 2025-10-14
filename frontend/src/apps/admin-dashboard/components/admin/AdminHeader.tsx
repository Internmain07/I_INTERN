import { useNavigate } from "react-router-dom";
import { Bell, Search, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Clear the token
    navigate("/login"); // Redirect to the login page
  };

  return (
    <header className="bg-gradient-to-r from-[#004F4D] via-[#1F7368] to-[#004F4D] border-b border-[#63D7C7]/20 h-16 flex items-center justify-between px-6 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-gradient-to-br from-[#63D7C7] to-[#1F7368] rounded-lg shadow-lg" />
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm text-[#63D7C7]">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#63D7C7] h-4 w-4 group-focus-within:text-white transition-colors" />
          <Input
            placeholder="Search..."
            className="pl-9 w-64 bg-[#003836]/50 border-[#63D7C7]/30 text-white placeholder:text-[#63D7C7]/60 focus:border-[#63D7C7] focus:ring-[#63D7C7]/20 transition-all duration-200"
          />
        </div>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative hover:bg-[#63D7C7]/20 hover:scale-110 transition-all duration-200 text-white"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-red-500 to-red-600">
            3
          </Badge>
        </Button>

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 h-auto p-2 hover:bg-[#63D7C7]/20 hover:scale-105 transition-all duration-200 group text-white"
            >
              <Avatar className="h-8 w-8 ring-2 ring-[#63D7C7]/40 group-hover:ring-[#63D7C7] transition-all">
                <AvatarImage src="/admin-avatar.jpg" alt="Admin" />
                <AvatarFallback className="bg-gradient-to-br from-[#63D7C7] to-[#1F7368] text-white font-semibold">AD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium group-hover:text-[#63D7C7] transition-colors">Admin User</p>
                <p className="text-xs text-[#63D7C7]">admin@platform.com</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-56 bg-[#FFFAF3] shadow-xl border border-[#63D7C7]/20" align="end">
            <DropdownMenuLabel className="text-[#004F4D]">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#63D7C7]/20" />
            
            <DropdownMenuItem className="hover:bg-[#E8F5F3] text-[#004F4D] transition-colors" asChild>
              <a href="/admin/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </a>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="hover:bg-[#E8F5F3] text-[#004F4D] transition-colors">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-[#63D7C7]/20" />
            
            <DropdownMenuItem 
              className="text-red-600 hover:bg-red-50 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}


