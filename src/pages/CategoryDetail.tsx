
import { MainLayout } from "@/components/layout/main-layout";
import { categories, products } from "@/data/products";
import { useParams, Link } from "react-router-dom";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find(c => c.slug === slug);
  
  // State for search and sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("featured");
  
  // Filter products for this category (in a real app, this would be based on database relations)
  // For demo purposes, filter products with matching category string
  const categoryProducts = products.filter(product => 
    product.category.toLowerCase().includes(category?.name.toLowerCase() || "")
  );
  
  // Search and sort logic
  const filteredAndSortedProducts = useMemo(() => {
    // First filter by search query
    let result = categoryProducts;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Then sort
    return [...result].sort((a, b) => {
      switch (sortOrder) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return b.id.localeCompare(a.id); // Assuming newer products have higher IDs
        default: // featured
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [categoryProducts, searchQuery, sortOrder]);
  
  if (!category) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={category.image} 
            alt={category.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="container relative z-10">
          <Link to="/shop" className="inline-flex items-center text-gray-600 hover:text-kenya-red mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
          <h1 className="text-4xl font-bold mb-3">{category.name}</h1>
          <p className="text-gray-600 max-w-2xl">
            Discover our collection of {category.name.toLowerCase()} - combining quality, style, and elegance.
          </p>
        </div>
      </div>

      <section className="py-10">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            {/* Search */}
            <div className="relative w-full sm:w-auto sm:min-w-[300px]">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Sort */}
            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
