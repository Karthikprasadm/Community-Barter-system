
import { useBarterContext } from "@/context/BarterContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, Search, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export const Header = () => {
  const { currentUser, isAdmin, logout } = useBarterContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-10">
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-barter-primary">BarterNexus</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className="text-gray-600 hover:text-barter-primary transition-colors">
              Marketplace
            </Link>
            <Link to="/my-items" className="text-gray-600 hover:text-barter-primary transition-colors">
              My Items
            </Link>
            <Link to="/offers" className="text-gray-600 hover:text-barter-primary transition-colors">
              Offers
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-purple-600 font-medium hover:text-purple-800 transition-colors flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search items..." 
              className="pl-10 w-full" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 bg-barter-accent rounded-full w-2 h-2"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.profileImage} alt={currentUser.username} />
                      <AvatarFallback>{(currentUser?.username?.charAt(0) || '?').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {isAdmin && (
                      <span className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                        A
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{currentUser.username}</span>
                      <span className="text-xs text-gray-500">{currentUser.email}</span>
                      {isAdmin && (
                        <span className="text-xs text-purple-600 font-semibold flex items-center gap-1 mt-1">
                          <Shield className="h-3 w-3" /> Admin Access
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/users">Manage Users</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/items">Manage Items</Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/my-items">My Items</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/offers">Offers</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/trades">Trade History</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
              <Button variant="outline" className="flex items-center gap-1 border-purple-300 text-purple-700 hover:bg-purple-200 hover:text-purple-900" asChild>
                <Link to="/admin-login">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
