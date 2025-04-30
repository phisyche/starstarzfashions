
import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSupabase } from '@/context/SupabaseContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Settings, 
  LogOut, 
  ChevronDown,
  Users,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, signOut, loading, isAdmin } = useSupabase();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Check for admin permissions and authentication
  useEffect(() => {
    const checkAccess = async () => {
      if (!loading && !user) {
        toast({
          title: "Authentication required",
          description: "Please login to access the admin area.",
        });
        navigate('/admin');
        return;
      }
      
      if (!loading && !isAdmin && user) {
        toast({
          title: "Access denied",
          description: "You don't have permission to access the admin area.",
          variant: "destructive",
        });
        navigate('/');
      }
    };
    
    checkAccess();
  }, [user, loading, navigate, toast, isAdmin]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account"
      });
      navigate('/admin');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full bg-primary/20 animate-pulse" />
          <Skeleton className="h-4 w-32" />
          <p className="text-muted-foreground text-sm">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'bg-primary/10 text-primary' : '';
  };

  // Menu items for easier management
  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      title: 'Products',
      icon: Package,
      path: '/admin/products',
    },
    {
      title: 'Orders',
      icon: ShoppingBag,
      path: '/admin/orders',
    },
    {
      title: 'Customers',
      icon: Users,
      path: '/admin/customers',
      disabled: true,
    },
    {
      title: 'Payments',
      icon: CreditCard,
      path: '/admin/payments',
      disabled: true,
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      disabled: true,
    }
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r shadow-sm fixed md:relative inset-y-0 left-0 z-20 transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-0 md:w-20 overflow-hidden'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h1 className="text-xl font-bold truncate">Admin Dashboard</h1>
              )}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 rounded-md hover:bg-gray-100 md:block hidden"
              >
                {sidebarOpen ? (
                  <ChevronDown className="rotate-90 h-5 w-5" />
                ) : (
                  <ChevronDown className="-rotate-90 h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link 
                key={item.title}
                to={item.disabled ? "#" : item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors
                  ${isActive(item.path)} 
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                <item.icon size={18} />
                {(sidebarOpen || !sidebarOpen && window.innerWidth < 768) && (
                  <span className="truncate">{item.title}</span>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t mt-auto">
            <Button 
              variant="ghost" 
              className={`w-full justify-${sidebarOpen ? 'start' : 'center'} gap-2 hover:bg-red-50 hover:text-red-600`}
              onClick={handleSignOut}
            >
              <LogOut size={18} />
              {sidebarOpen && <span>Sign out</span>}
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full overflow-x-hidden">
        <header className="bg-white border-b p-4 md:py-2 sticky top-0 z-10 flex items-center justify-between shadow-sm">
          {/* Mobile menu */}
          <div className="md:hidden">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronDown className={sidebarOpen ? "rotate-180" : ""} />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
          
          <div className="md:flex-1 md:ml-4 flex md:justify-start justify-center">
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold">
                {menuItems.find(item => location.pathname.startsWith(item.path))?.title || 'Admin'}
              </h2>
            </div>
          </div>
          
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <span className="hidden md:inline-block">{user.email}</span>
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {user.email?.charAt(0).toUpperCase() || "A"}
                  </span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/')}>
                  View Store
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                  <LogOut size={14} className="mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
