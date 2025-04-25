
import React, { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSupabase } from '@/context/SupabaseContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Settings, 
  LogOut, 
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, signOut, loading } = useSupabase();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-t-2 border-primary rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary/10 text-primary' : '';
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        
        <nav className="flex-1 py-4 px-2 space-y-1">
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md ${isActive('/admin/dashboard')}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/admin/products" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md ${isActive('/admin/products')}`}
          >
            <Package size={18} />
            <span>Products</span>
          </Link>
          
          <Link 
            to="/admin/orders" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md ${isActive('/admin/orders')}`}
          >
            <ShoppingBag size={18} />
            <span>Orders</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2"
            onClick={handleSignOut}
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </Button>
        </div>
      </aside>
      
      {/* Mobile header */}
      <div className="flex flex-col flex-1">
        <header className="bg-white border-b p-4 md:py-2 sticky top-0 z-10 flex items-center justify-between">
          {/* Mobile menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <ChevronDown />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/admin/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/products">Products</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/orders">Orders</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="md:flex-1 md:ml-4 flex justify-center md:justify-start">
            <Link to="/admin/dashboard" className="md:hidden text-lg font-bold">Admin</Link>
          </div>
          
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <span>{user.email}</span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut size={14} className="mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
