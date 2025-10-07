import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Employers", href: "/admin/employers", icon: Building2 },
  { name: "Interns", href: "/admin/interns", icon: Users },
  { name: "Internship Postings", href: "/admin/postings", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={cn(
      "bg-gradient-sidebar border-r border-sidebar-border flex flex-col transition-all duration-500 ease-out shadow-xl",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border bg-sidebar-accent/30">
        {!collapsed && (
          <h1 className="text-lg font-bold text-sidebar-foreground bg-gradient-primary bg-clip-text text-transparent">
            Admin Panel
          </h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200 hover:scale-110"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.name} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground hover:scale-105 hover:shadow-md",
                    "group relative overflow-hidden",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow scale-105" 
                      : "text-sidebar-foreground"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  {/* Glow effect for active item */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-sidebar-primary/20 to-transparent rounded-lg" />
                  )}
                  
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform duration-200 relative z-10",
                    "group-hover:scale-110",
                    isActive && "drop-shadow-sm"
                  )} />
                  {!collapsed && (
                    <span className="relative z-10 transition-all duration-200 group-hover:translate-x-1">
                      {item.name}
                    </span>
                  )}
                  
                  {/* Hover indicator */}
                  <div className={cn(
                    "absolute right-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-sidebar-primary rounded-l-full transition-all duration-200",
                    "group-hover:h-8",
                    isActive && "h-8"
                  )} />
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Footer gradient */}
      <div className="h-20 bg-gradient-to-t from-sidebar-accent/20 to-transparent" />
    </div>
  );
}


