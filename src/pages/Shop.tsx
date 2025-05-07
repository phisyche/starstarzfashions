import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductCard } from "@/components/products/product-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, SlidersHorizontal, Search, Grid3X3, List } from "lucide-react";
import { from } from "@/integrations/supabase/client";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryParam = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";
  
  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await from('categories')
          .select('*')
          .order('sort_order', { ascending: true });
          
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
        
        // Fetch products with filtering
        let query = from('products').select('*');
        
        if (categoryParam) {
          query = query.eq('category', categoryParam);
        }
        
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }
        
        const { data: productsData, error: productsError } = await query;
        
        if (productsError) throw productsError;
        setProducts(productsData || []);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [categoryParam, searchQuery]);

  const toggleCategory = (slug: string) => {
    if (categoryParam === slug) {
      // Remove category filter
      searchParams.delete("category");
    } else {
      // Set category filter
      searchParams.set("category", slug);
    }
    setSearchParams(searchParams);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    if (search) {
      searchParams.set("search", search);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shop Our Collection</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-muted" : ""}
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-muted" : ""}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
            <Button
              variant={filtersOpen ? "secondary" : "outline"}
              size="sm"
              className="md:hidden"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar/Filters */}
          <aside
            className={`w-full md:w-64 shrink-0 transition-all ${
              filtersOpen ? "block" : "hidden md:block"
            }`}
          >
            <div className="sticky top-24 space-y-6">
              <div>
                <h2 className="font-semibold text-lg mb-2">Search</h2>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    name="search"
                    placeholder="Search products..."
                    defaultValue={searchQuery}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" variant="secondary">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>

              <div>
                <h2 className="font-semibold text-lg mb-2">Categories</h2>
                <ul className="space-y-1">
                  {loading ? (
                    Array(8)
                      .fill(0)
                      .map((_, i) => (
                        <li key={i} className="mb-2">
                          <Skeleton className="h-6 w-full" />
                        </li>
                      ))
                  ) : (
                    <>
                      {categories.map((category) => (
                        <li key={category.id}>
                          <Button
                            variant={categoryParam === category.slug ? "secondary" : "ghost"}
                            className="justify-start w-full font-normal"
                            onClick={() => toggleCategory(category.slug)}
                          >
                            {category.name}
                          </Button>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </div>

              <Accordion type="single" collapsible defaultValue="prices">
                <AccordionItem value="prices">
                  <AccordionTrigger className="font-semibold text-lg">
                    Price Range
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 mt-2">
                      {["Under KES 1,000", "KES 1,000 - 2,500", "KES 2,500 - 5,000", "Over KES 5,000"].map(
                        (range) => (
                          <div key={range} className="flex items-center space-x-2">
                            <Checkbox id={`price-${range}`} />
                            <Label htmlFor={`price-${range}`}>{range}</Label>
                          </div>
                        )
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="sizes">
                  <AccordionTrigger className="font-semibold text-lg">
                    Sizes
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 mt-2">
                      {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox id={`size-${size}`} />
                          <Label htmlFor={`size-${size}`}>{size}</Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {(categoryParam || searchQuery) && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full border-dashed mt-4"
                >
                  Clear All Filters
                </Button>
              )}

              <Button
                className="w-full md:hidden mt-4"
                onClick={() => setFiltersOpen(false)}
                variant="secondary"
              >
                Apply Filters
              </Button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Active filters */}
            {(categoryParam || searchQuery) && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-sm font-medium">Active Filters:</span>
                {categoryParam && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-7 text-xs rounded-full"
                    onClick={() => toggleCategory(categoryParam)}
                  >
                    Category: {categories.find(c => c.slug === categoryParam)?.name || categoryParam}
                    <span className="ml-1">×</span>
                  </Button>
                )}
                {searchQuery && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-7 text-xs rounded-full"
                    onClick={() => {
                      searchParams.delete("search");
                      setSearchParams(searchParams);
                    }}
                  >
                    Search: {searchQuery}
                    <span className="ml-1">×</span>
                  </Button>
                )}
              </div>
            )}

            {/* Results */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-muted-foreground">
                  {loading
                    ? "Loading products..."
                    : `Showing ${products.length} product${
                        products.length === 1 ? "" : "s"
                      }`}
                </div>
                <div>
                  <Button variant="ghost" size="sm" className="text-sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" /> Sort by
                  </Button>
                </div>
              </div>

              {loading ? (
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="w-full aspect-square rounded-md" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                </div>
              ) : products.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground">
                    Try changing your filters or search term
                  </p>
                </div>
              ) : (
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
