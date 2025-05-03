
import { MainLayout } from "@/components/layout/main-layout";
import { ProductCard } from "@/components/products/product-card";
import { products } from "@/data/products";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSupabase } from "@/context/SupabaseContext";

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const { supabase } = useSupabase();

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      if (!supabase) return;
      
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, [supabase]);

  // Implement filtering
  const filteredProducts = products.filter((product) => {
    // Filter by search query
    const matchesSearch = searchQuery 
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) 
      : true;
    
    // Filter by category
    const matchesCategory = selectedCategory 
      ? product.category.toLowerCase() === selectedCategory.toLowerCase() 
      : true;
    
    // Filter by price range
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Implement sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "newest":
        return a.isNew ? -1 : b.isNew ? 1 : 0;
      default:
        return a.isFeatured ? -1 : b.isFeatured ? 1 : 0;
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied through the state
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceRange([0, 5000]);
    setSelectedSort("featured");
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">Shop All Products</h1>
          <div className="text-gray-600">
            Discover our unique collection of authentic Kenyan fashion
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="w-full md:w-64 hidden md:block">
            <div className="bg-white rounded-lg border p-4 sticky top-24">
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Categories</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Button 
                      variant={selectedCategory === null ? "default" : "ghost"} 
                      size="sm"
                      onClick={() => handleCategoryChange(null)}
                    >
                      All Products
                    </Button>
                  </div>
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <Button 
                        variant={selectedCategory === category.name ? "default" : "ghost"} 
                        size="sm"
                        onClick={() => handleCategoryChange(category.name)}
                      >
                        {category.name}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    min={0}
                    max={5000}
                    step={100}
                    onValueChange={handlePriceChange}
                  />
                  <div className="flex items-center justify-between">
                    <span>KES {priceRange[0]}</span>
                    <span>KES {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Product Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="new-arrivals" />
                    <Label htmlFor="new-arrivals">New Arrivals</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sale" />
                    <Label htmlFor="sale">On Sale</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="featured" />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Mobile Filters */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden mb-4">
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              
              <div className="py-4">
                <div className="mb-6">
                  <h3 className="font-medium text-lg mb-3">Categories</h3>
                  <div className="space-y-2">
                    <SheetClose asChild>
                      <Button 
                        variant={selectedCategory === null ? "default" : "ghost"} 
                        size="sm"
                        onClick={() => handleCategoryChange(null)}
                        className="w-full justify-start"
                      >
                        All Products
                      </Button>
                    </SheetClose>
                    {categories.map((category) => (
                      <SheetClose key={category.id} asChild>
                        <Button 
                          variant={selectedCategory === category.name ? "default" : "ghost"} 
                          size="sm"
                          onClick={() => handleCategoryChange(category.name)}
                          className="w-full justify-start"
                        >
                          {category.name}
                        </Button>
                      </SheetClose>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-lg mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={5000}
                      step={100}
                      onValueChange={handlePriceChange}
                    />
                    <div className="flex items-center justify-between">
                      <span>KES {priceRange[0]}</span>
                      <span>KES {priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-lg mb-3">Product Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mobile-new-arrivals" />
                      <Label htmlFor="mobile-new-arrivals">New Arrivals</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mobile-sale" />
                      <Label htmlFor="mobile-sale">On Sale</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mobile-featured" />
                      <Label htmlFor="mobile-featured">Featured</Label>
                    </div>
                  </div>
                </div>

                <SheetClose asChild>
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1">
            {/* Search and Sort Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <form onSubmit={handleSearch} className="relative w-full sm:max-w-sm">
                <Input
                  type="search"
                  placeholder="Search products..."
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
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
                <Select value={selectedSort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">New Arrivals</SelectItem>
                    <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                    <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Results */}
            <div>
              <div className="text-sm text-gray-600 mb-4">
                Showing {sortedProducts.length} products
              </div>
              
              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">Try changing your filters or search term</p>
                  <Button onClick={handleClearFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
