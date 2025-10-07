import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, User, LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useAuth } from "@/auth/AuthContext";
import { apiClient } from "@/api";

export const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState<{
    name: string | null;
    email: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/api/v1/auth/me");
        setUserData({
          name: response.name,
          email: response.email,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Display logic: use name if available, otherwise use email username
  const displayName = userData?.name || userData?.email.split('@')[0] || "User";
  const displayEmail = userData?.email || "";
  const avatarFallback = userData?.name 
    ? userData.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : displayName.substring(0, 2).toUpperCase();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-[#63D7C7]/30 bg-white/80 backdrop-blur-xl shadow-lg"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/interns" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 bg-gradient-to-br from-[#1F7368] to-[#004F4D] rounded-lg flex items-center justify-center shadow-lg hover:shadow-[#63D7C7]/50 transition-shadow duration-300"
          >
            <span className="text-white font-bold text-lg">I</span>
          </motion.div>
          <span className="text-xl font-bold text-[#004F4D]">I-Intern</span>
        </Link>

        {/* Profile Dropdown */}
        <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={displayName} />
                <AvatarFallback>
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium">
                {displayName.split(" ")[0]}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{displayEmail}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/interns/profile" className="w-full flex items-center">
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.nav>
  );
};


