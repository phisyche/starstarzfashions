
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { useSupabase } from '@/context/SupabaseContext';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ProductCard } from '@/components/products/product-card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function ShopPage() {
  const { supabase } = useSupabase();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<string>('newest');

  // Fetch all products
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Filter products by category if activeCategory is set
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    if (!activeCategory) return products;
    
    return products.filter(product => 
      product.category === activeCategory
    );
  }, [products, activeCategory]);

  // Sort products based on activeSort
  const sortedProducts = React.useMemo(() => {
    if (!filteredProducts) return [];
    
    switch (activeSort) {
      case 'price-low':
        return [...filteredProducts].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...filteredProducts].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name));
      case 'newest':
      default:
        return filteredProducts;
    }
  }, [filteredProducts, activeSort]);

  return (
    <MainLayout>
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Shop Collection</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    className={`block w-full text-left px-2 py-1 rounded ${!activeCategory ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    onClick={() => setActiveCategory(null)}
                  >
                    All Products
                  </button>
                  
                  {categories?.map((category) => (
                    <button
                      key={category.id}
                      className={`block w-full text-left px-2 py-1 rounded ${activeCategory === category.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Sort By</h3>
                <div className="space-y-2">
                  <button
                    className={`block w-full text-left px-2 py-1 rounded ${activeSort === 'newest' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    onClick={() => setActiveSort('newest')}
                  >
                    Newest First
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded ${activeSort === 'price-low' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    onClick={() => setActiveSort('price-low')}
                  >
                    Price: Low to High
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded ${activeSort === 'price-high' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    onClick={() => setActiveSort('price-high')}
                  >
                    Price: High to Low
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded ${activeSort === 'name-asc' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    onClick={() => setActiveSort('name-asc')}
                  >
                    Name: A-Z
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded ${activeSort === 'name-desc' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    onClick={() => setActiveSort('name-desc')}
                  >
                    Name: Z-A
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Product grid */}
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center p-8">
                <p className="text-destructive">Error loading products. Please try again later.</p>
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <p>No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
