import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Globe,
  MapPin,
  Menu,
  X,
  Home,
  Calendar,
  User,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const DashboardLayout = ({ children, pageTitle }: DashboardLayoutProps) => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">GreenProxy</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex flex-col flex-1 mt-6 px-3">
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Home className="mr-3 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/regions"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/regions")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <MapPin className="mr-3 h-4 w-4" />
              Regions
            </Link>
            <Link
              to="/events"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/events")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Calendar className="mr-3 h-4 w-4" />
              Events
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="px-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                System Status
              </h3>
              <div className="mt-3 flex items-center space-x-2">
                <div className="status-indicator status-online"></div>
                <span className="text-sm text-muted-foreground">
                  System Online
                </span>
              </div>
            </div>
          </div>

          {/* Account Section - positioned at bottom */}
          <div className="mt-auto pt-6 border-t mb-4">
            <div className="px-3 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
                size="sm"
              >
                <User className="mr-3 h-4 w-4" />
                Account Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
                size="sm"
                onClick={handleogout}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </nav>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-0 flex flex-col h-screen">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm lg:pl-0 flex-shrink-0">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <h1 className="text-xl font-bold">{pageTitle}</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
