
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/context/SupabaseContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

export function WishlistPage() {
  const { supabase, user } = useSupabase();
  const { removeFromFavorites } = useFavorites();
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: favorites = [], isLoading, refetch } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('favorite_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching favorites:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user,
  });

  const handleRemoveFromWishlist = async (productId: string, productName: string) => {
    await removeFromFavorites(productId);
    toast({
      title: 'Removed from wishlist',
      description: `${productName} has been removed from your wishlist.`,
    });
    refetch();
  };

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.product_id,
      productId: item.product_id,
      name: item.product_name,
      price: item.price,
      image: item.image_url,
      quantity: 1,
    });
    
    toast({
      title: 'Added to cart',
      description: `${item.product_name} has been added to your cart.`,
    });
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your wishlist.</p>
          <Button asChild>
            <Link to="/login">Log In</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-8">
          <Heart className="h-6 w-6 text-red-500" />
          <h1 className="text-3xl font-bold">My Wishlist</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Start adding items to your wishlist by clicking the heart icon on products you love.
            </p>
            <Button asChild>
              <Link to="/shop">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{item.product_name}</h3>
                  <p className="text-lg font-bold text-primary mb-4">
                    ${Number(item.price).toFixed(2)}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveFromWishlist(item.product_id, item.product_name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
