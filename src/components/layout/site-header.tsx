
import { Link } from "react-router-dom";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function SiteHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Will implement search functionality later
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center justify-between w-full gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[340px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/shop" className="text-lg font-medium hover:text-primary transition-colors">
                  Shop
                </Link>
                <Link to="/collections" className="text-lg font-medium hover:text-primary transition-colors">
                  Collections
                </Link>
                <Link to="/about" className="text-lg font-medium hover:text-primary transition-colors">
                  About Us
                </Link>
                <Link to="/contact" className="text-lg font-medium hover:text-primary transition-colors">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="font-bold text-xl">
            Kenyan<span className="text-kenya-red">Fashion</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 mx-6">
            <Link to="/" className="font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/shop" className="font-medium hover:text-primary transition-colors">
              Shop
            </Link>
            <Link to="/collections" className="font-medium hover:text-primary transition-colors">
              Collections
            </Link>
            <Link to="/about" className="font-medium hover:text-primary transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Search, Cart, Account */}
          <div className="flex items-center gap-2">
            {!isMobile && (
              <form onSubmit={handleSearch} className="relative hidden md:flex w-full max-w-sm items-center">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </form>
            )}
            {isMobile && (
              <Link to="/search">
                <Button variant="ghost" size="icon" aria-label="Search">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link to="/cart">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/account">
              <Button variant="ghost" size="icon" aria-label="Account">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
