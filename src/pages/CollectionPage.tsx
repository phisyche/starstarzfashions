
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/products/product-card';
import { useSupabase } from '@/context/SupabaseContext';
import { collections } from '@/data/products';
import { ChevronRight } from 'lucide-react';

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const { supabase } = useSupabase();
  const [collection, setCollection] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollectionData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // First try to get from the database
        const { data: collectionsData, error: collectionsError } = await supabase
          .from('collections')
          .select('*')
          .eq('slug', slug)
          .single();

        if (collectionsError) {
          console.error('Error fetching collection:', collectionsError);
          // Fall back to local data if DB fetch fails
          const localCollection = collections.find(c => c.slug === slug);
          if (localCollection) {
            setCollection(localCollection);
          } else {
            setError('Collection not found');
          }
        } else {
          setCollection(collectionsData);
        }

        // Now fetch associated products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*');

        if (productsError) {
          console.error('Error fetching products:', productsError);
          setProducts([]);
        } else {
          // For simplicity, we're just using some products as if they belong to the collection
          // In a real system, there would be a relationship table between collections and products
          setProducts(productsData.slice(0, 8));
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionData();
  }, [slug, supabase]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-2 mb-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link to="/collections" className="text-muted-foreground hover:text-foreground">Collections</Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          <Skeleton className="h-[400px] w-full rounded-lg mb-10" />
          
          <Skeleton className="h-8 w-64 mb-6" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[250px] w-full rounded-lg" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !collection) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Collection Not Found</h1>
          <p className="mb-8">{error || "Sorry, the collection you're looking for doesn't exist or has been removed."}</p>
          <Button asChild>
            <Link to="/collections">Back to Collections</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative min-h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src={collection.image} 
            alt={collection.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container relative z-10 px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">{collection.name}</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            {collection.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Products in this Collection</h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No products found in this collection.</p>
            <Button className="mt-4" asChild>
              <Link to="/shop">Browse All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
