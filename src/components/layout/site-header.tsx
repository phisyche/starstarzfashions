
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { GlobalSearch } from "@/components/search/global-search";
import { useSupabase } from "@/context/SupabaseContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { categories } from "@/data/products";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const { user, signOut } = useSupabase();
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center justify-between w-full gap-4">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[340px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-medium hover:text-theme-pink transition-colors">
                  Home
                </Link>
                <div className="space-y-2">
                  <h4 className="text-lg font-medium">Shop by Category</h4>
                  <div className="pl-4 flex flex-col gap-2">
                    {categories.map((category) => (
                      <Link 
                        key={category.id} 
                        to={`/shop/${category.slug}`}
                        className="text-sm hover:text-theme-pink transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link to="/collections" className="text-lg font-medium hover:text-theme-pink transition-colors">
                  Collections
                </Link>
                <Link to="/about" className="text-lg font-medium hover:text-theme-pink transition-colors">
                  About Us
                </Link>
                <Link to="/contact" className="text-lg font-medium hover:text-theme-pink transition-colors">
                  Contact
                </Link>
              </nav>
              <form onSubmit={handleSearch} className="mt-6">
                <div className="flex gap-2">
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit">Search</Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>

          <Link to="/" className="font-bold text-xl">
            {/* Star<span className="text-theme-pink">Starz</span>Ltd */}
            {/* <img src="" alt="" /> */}

            <img
          src="/public/new/starstarz/IMG-20250426-WA0020.jpg"
          alt="logo"
          style={{ width: '100px', height: '100px', borderRadius: '10px' }}
          className="w-full h-full object-cover object-left"
        />

          </Link>

          <div className="hidden lg:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className="px-4 py-2 font-medium hover:text-theme-pink transition-colors">
                    Home
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-medium hover:text-theme-pink transition-colors">Shop</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-[600px]">
                      <div className="mb-4">
                        <Link 
                          to="/shop" 
                          className="block p-2 mb-2 text-center font-bold hover:bg-muted rounded-md transition-colors"
                        >
                          View All Products
                        </Link>
                        <form onSubmit={handleSearch} className="flex gap-2">
                          <Input
                            type="search"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <Button type="submit">
                            <Search className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {categories.map((category) => (
                          <NavigationMenuLink 
                            key={category.id} 
                            asChild 
                            className="block p-2 hover:bg-muted rounded-md transition-colors"
                          >
                            <Link to={`/shop/${category.slug}`}>
                              <div className="font-medium">{category.name}</div>
                              <p className="text-sm text-muted-foreground">
                                Browse {category.name.toLowerCase()} collection
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/collections" className="px-4 py-2 font-medium hover:text-theme-pink transition-colors">
                    Collections
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/about" className="px-4 py-2 font-medium hover:text-theme-pink transition-colors">
                    About Us
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/contact" className="px-4 py-2 font-medium hover:text-theme-pink transition-colors">
                    Contact
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <form onSubmit={handleSearch} className="relative w-full sm:max-w-[200px]">
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            <Link to="/cart">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="User menu">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer w-full">
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer w-full">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="User menu">
                    <User className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[325px]">
                  <DialogHeader>
                    <DialogTitle>Account</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-2 py-4">
                    <Link to="/login">
                      <Button variant="outline" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button className="w-full justify-start">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
