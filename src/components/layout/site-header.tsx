import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { categories } from "@/data/products";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function SiteHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
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
            Star<span className="text-theme-pink">Starz</span>Ltd
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
                    <div className="grid grid-cols-2 gap-4 p-4 w-[400px]">
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
          </div>
        </div>
      </div>
    </header>
  );
}
