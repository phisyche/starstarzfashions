
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/main-layout';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Package } from 'lucide-react';
import { useSupabase } from '@/context/SupabaseContext';

export default function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { supabase } = useSupabase();

  // Fetch collection details
  const { data: collection, isLoading: collectionLoading } = useQuery({
    queryKey: ['collection', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Fetch collection products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['collection-products', collection?.id],
    queryFn: async () => {
      if (!collection?.id) return [];
      
      const { data, error } = await supabase
        .from('collection_products')
        .select(`
          products (*)
        `)
        .eq('collection_id', collection.id);

      if (error) throw error;
      return data?.map(item => item.products).filter(Boolean) || [];
    },
    enabled: !!collection?.id,
  });

  if (collectionLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!collection) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Collection Not Found</h1>
          <p className="text-gray-600 mb-6">The collection you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/collections">Back to Collections</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const isActive = !collection.end_date || new Date(collection.end_date) >= new Date();
  const isUpcoming = collection.start_date && new Date(collection.start_date) > new Date();

  return (
    <MainLayout>
      {/* Collection Hero */}
      <div className="bg-gray-50 py-16 relative overflow-hidden">
        {collection.image && (
          <div className="absolute inset-0 opacity-20">
            <img 
              src={collection.image} 
              alt={collection.name} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        <div className="container relative z-10">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/collections">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collections
            </Link>
          </Button>
          
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold">{collection.name}</h1>
              <div className="flex gap-2">
                <Badge variant={isActive ? 'default' : 'secondary'}>
                  {isUpcoming ? 'Upcoming' : isActive ? 'Active' : 'Ended'}
                </Badge>
              </div>
            </div>
            
            {collection.description && (
              <p className="text-gray-600 text-lg mb-6">
                {collection.description}
              </p>
            )}
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>{products.length} products</span>
              </div>
              {collection.start_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {collection.end_date 
                      ? `${new Date(collection.start_date).toLocaleDateString()} - ${new Date(collection.end_date).toLocaleDateString()}`
                      : `Started ${new Date(collection.start_date).toLocaleDateString()}`
                    }
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container py-10">
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No Products Yet</h2>
            <p className="text-gray-500 mb-6">This collection doesn't have any products yet.</p>
            <Button asChild>
              <Link to="/shop">Browse All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
