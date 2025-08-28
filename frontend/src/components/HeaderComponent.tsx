import { Leaf, LogOut, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "./LoginModal";
import { useState } from "react";

const HeaderComponent = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return "U";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/5 ring-1 ring-white/10 backdrop-blur-2xl sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Main Navigation Bar */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
            <Link
              to="/"
              className="text-lg sm:text-xl font-bold text-white hover:text-green-400 transition-colors font-geist"
            >
              GreenProxy
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className="font-geist text-white/80 hover:text-white hover:bg-white/10 backdrop-blur rounded-full px-3 lg:px-4 py-2 text-sm transition-all duration-300"
              >
                Dashboard
              </Button>
            </Link>
            <Link to="/regions">
              <Button
                variant="ghost"
                className="font-geist text-white/80 hover:text-white hover:bg-white/10 backdrop-blur rounded-full px-3 lg:px-4 py-2 text-sm transition-all duration-300"
              >
                Regions
              </Button>
            </Link>
            <Link to="/events">
              <Button
                variant="ghost"
                className="font-geist text-white/80 hover:text-white hover:bg-white/10 backdrop-blur rounded-full px-3 lg:px-4 py-2 text-sm transition-all duration-300"
              >
                Events
              </Button>
            </Link>

            {!isAuthenticated ? (
              <LoginModal>
                <Button
                  disabled={isLoading}
                  className="flex items-center space-x-2 font-geist bg-white text-slate-900 hover:bg-white/90 rounded-full px-4 lg:px-6 py-2 text-sm font-semibold transition-all duration-300"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline">Sign In</span>
                  <span className="lg:hidden">Login</span>
                </Button>
              </LoginModal>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/15 transition-all duration-300"
                  >
                    <Avatar className="h-7 w-7 lg:h-8 lg:w-8">
                      <AvatarFallback className="bg-green-500/20 text-white font-geist text-xs lg:text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-white/10 ring-1 ring-white/20 backdrop-blur-2xl border-white/20"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none font-geist text-white">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-white/60 font-geist">
                        {user?.email || ""}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white transition-colors">
                    <User className="mr-2 h-4 w-4" />
                    <span className="font-geist">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-white/80 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-geist">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/15 transition-all duration-300"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-green-500/20 text-white font-geist text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-white/10 ring-1 ring-white/20 backdrop-blur-2xl border-white/20"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none font-geist text-white">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-white/60 font-geist">
                        {user?.email || ""}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white transition-colors">
                    <User className="mr-2 h-4 w-4" />
                    <span className="font-geist">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-white/80 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-geist">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-white hover:bg-white/10 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10">
            <div className="flex flex-col space-y-3">
              <Link to="/dashboard" onClick={closeMobileMenu}>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-geist text-white/80 hover:text-white hover:bg-white/10 backdrop-blur rounded-lg px-4 py-3 text-sm transition-all duration-300"
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/regions" onClick={closeMobileMenu}>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-geist text-white/80 hover:text-white hover:bg-white/10 backdrop-blur rounded-lg px-4 py-3 text-sm transition-all duration-300"
                >
                  Regions
                </Button>
              </Link>
              <Link to="/events" onClick={closeMobileMenu}>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-geist text-white/80 hover:text-white hover:bg-white/10 backdrop-blur rounded-lg px-4 py-3 text-sm transition-all duration-300"
                >
                  Events
                </Button>
              </Link>

              {!isAuthenticated && (
                <div className="pt-2 border-t border-white/10">
                  <LoginModal>
                    <Button
                      disabled={isLoading}
                      className="w-full flex items-center justify-center space-x-2 font-geist bg-white text-slate-900 hover:bg-white/90 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-300"
                      onClick={closeMobileMenu}
                    >
                      <User className="h-4 w-4" />
                      <span>Sign In</span>
                    </Button>
                  </LoginModal>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HeaderComponent;
