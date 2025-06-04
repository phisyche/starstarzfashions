
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package } from 'lucide-react';
import { useSupabase } from '@/context/SupabaseContext';

export default function CollectionsPage() {
  const { supabase } = useSupabase();

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_products(count)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Collections</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our curated collections featuring the finest selection of fashion items.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Collections</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated collections featuring the finest selection of fashion items.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.slug}`}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={collection.image || '/placeholder.svg'}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">{collection.name}</h3>
                    {collection.description && (
                      <p className="text-white/90 text-sm line-clamp-2">{collection.description}</p>
                    )}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package className="h-4 w-4" />
                      <span>{collection.collection_products?.[0]?.count || 0} items</span>
                    </div>
                    {collection.start_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(collection.start_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  {(collection.start_date || collection.end_date) && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {collection.end_date && new Date(collection.end_date) < new Date()
                          ? 'Ended'
                          : collection.start_date && new Date(collection.start_date) > new Date()
                          ? 'Upcoming'
                          : 'Active'
                        }
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {collections.length === 0 && (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No Collections Yet</h2>
            <p className="text-gray-500">Check back later for our curated collections.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
