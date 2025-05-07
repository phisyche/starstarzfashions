
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/context/SupabaseContext';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from '@/components/ui/use-toast';

export function SiteHeader() {
  const { user, signOut, isAdmin } = useSupabase();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/5360e524-225a-4ce2-b602-18862793b0f3.png" 
              alt="Star Starz Fashions" 
              className="h-12 w-auto" 
            />
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/shop" className="text-sm font-medium transition-colors hover:text-primary">
              Shop
            </Link>
            <Link to="/collections" className="text-sm font-medium transition-colors hover:text-primary">
              Collections
            </Link>
            <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin/dashboard">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <Link to="/account">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
          
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-medium text-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Button>
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-4 py-4">
                <Link to="/" className="px-2 py-1 text-sm">Home</Link>
                <Link to="/shop" className="px-2 py-1 text-sm">Shop</Link>
                <Link to="/collections" className="px-2 py-1 text-sm">Collections</Link>
                <Link to="/about" className="px-2 py-1 text-sm">About</Link>
                <Link to="/contact" className="px-2 py-1 text-sm">Contact</Link>
                {!user && (
                  <>
                    <Link to="/login" className="px-2 py-1 text-sm">Login</Link>
                    <Link to="/register" className="px-2 py-1 text-sm">Register</Link>
                  </>
                )}
                {user && (
                  <>
                    {isAdmin && (
                      <Link to="/admin/dashboard" className="px-2 py-1 text-sm">Admin Dashboard</Link>
                    )}
                    <Link to="/account" className="px-2 py-1 text-sm">Account</Link>
                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="justify-start px-2">
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
