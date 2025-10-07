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
    <header className="bg-gradient-card border-b border-border h-16 flex items-center justify-between px-6 shadow-sm backdrop-blur-sm animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg shadow-glow animate-pulse" />
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search..."
            className="pl-9 w-64 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative hover:bg-muted/50 hover:scale-110 transition-all duration-200"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-destructive to-destructive/80 animate-pulse">
            3
          </Badge>
        </Button>

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 h-auto p-2 hover:bg-muted/50 hover:scale-105 transition-all duration-200 group"
            >
              <Avatar className="h-8 w-8 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                <AvatarImage src="/admin-avatar.jpg" alt="Admin" />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">AD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium group-hover:text-primary transition-colors">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@platform.com</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-56 shadow-elevated animate-scale-in" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="hover:bg-muted/70 transition-colors" asChild>
              <a href="/admin/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </a>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="hover:bg-muted/70 transition-colors">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}


