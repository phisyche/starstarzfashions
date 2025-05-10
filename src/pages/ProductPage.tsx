
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '@/context/SupabaseContext';
import { MainLayout } from '@/components/layout/main-layout';
import { ProductImages } from '@/components/products/product-images';
import { AddToCart } from '@/components/products/add-to-cart';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/products/product-card';
import { ChevronRight } from 'lucide-react';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { supabase } = useSupabase();

  // Fetch product details
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Fetch related products
  const { data: relatedProducts, isLoading: isLoadingRelated } = useQuery({
    queryKey: ['related-products', product?.category, product?.id],
    queryFn: async () => {
      if (!product) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', product.category)
        .neq('id', product.id)
        .limit(4);

      if (error) throw error;
      return data;
    },
    enabled: !!product,
  });

  // Loading state
  if (isLoadingProduct) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-2 mb-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link to="/shop" className="text-muted-foreground hover:text-foreground">Shop</Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <div className="pt-4">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Product not found
  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8">Sorry, the product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-2 mb-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link to="/shop" className="text-muted-foreground hover:text-foreground">Shop</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product images */}
          <ProductImages images={product.images || [product.image]} />
          
          {/* Product details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="text-2xl font-semibold text-primary">
              ${product.price.toFixed(2)}
            </div>
            
            <div className="text-muted-foreground">
              {product.description}
            </div>
            
            {product.features && (
              <ul className="list-disc list-inside space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            )}
            
            <Separator />
            
            <div>
              <AddToCart productId={product.id} />
            </div>
            
            <div className="pt-4 text-sm text-muted-foreground">
              <p>SKU: {product.id}</p>
              <p>Category: {product.category}</p>
            </div>
          </div>
        </div>
        
        {/* Related products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoadingRelated ? (
                Array(4).fill(0).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : (
                relatedProducts.map(relatedProduct => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
