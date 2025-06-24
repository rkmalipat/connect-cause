import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Menu, User, MessageCircle, Search, Plus, Info, PlusCircle } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/browse", label: "Browse Causes", icon: Search },
    { href: "/livelihood", label: "Livelihood", icon: Plus },
    { href: "/submit", label: "Submit Cause", icon: PlusCircle },
    { href: "/stories", label: "Success Stories", icon: Heart },
    { href: "/about", label: "About Us", icon: Info },
  ];

  if (user) {
    navItems.push(
      { href: "/messages", label: "Messages", icon: MessageCircle },
      { href: `/profile/${user.id}`, label: "Profile", icon: User }
    );
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Heart className="h-8 w-8 text-trust-blue mr-3" />
              <span className="text-xl font-bold text-gray-900">ConnectCause</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    location === item.href
                      ? "text-trust-blue"
                      : "text-gray-700 hover:text-trust-blue"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {user ? (
                <div className="flex items-center space-x-4">
                  {user.userType === 'initiative_runner' && (
                    <Button asChild className="bg-action-orange hover:bg-amber-600">
                      <Link href="/profile/create-initiative">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Initiative
                      </Link>
                    </Button>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <div className="h-8 w-8 rounded-full bg-trust-blue text-white flex items-center justify-center">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/profile/${user.id}`} className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout} className="cursor-pointer">
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button asChild variant="ghost">
                    <Link href="/auth">Sign In</Link>
                  </Button>
                  <Button asChild className="bg-action-orange hover:bg-amber-600">
                    <Link href="/auth?mode=register">Start Helping</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    location === item.href
                      ? "text-trust-blue"
                      : "text-gray-700 hover:text-trust-blue"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {user ? (
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-3">
                    <div className="h-10 w-10 rounded-full bg-trust-blue text-white flex items-center justify-center">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user.fullName}</div>
                      <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-trust-blue w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 pb-3 border-t border-gray-200 space-y-2">
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="w-full bg-action-orange hover:bg-amber-600">
                    <Link href="/auth?mode=register" onClick={() => setMobileMenuOpen(false)}>
                      Start Helping
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
