
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSupabase } from '@/context/SupabaseContext';
import { useQuery } from '@tanstack/react-query';
import {
  CircleDollarSign,
  Package,
  Heart,
  ShoppingBag,
  Clock,
  TrendingUp,
  Eye
} from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

export function UserDashboard() {
  const { supabase, user } = useSupabase();
  const [recentViewedProducts, setRecentViewedProducts] = useState<any[]>([]);
  
  // Fetch user orders
  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching orders:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch user favorites
  const { data: favorites, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('favorite_items')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error fetching favorites:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch user cart items
  const { data: cartItems, isLoading: isLoadingCart } = useQuery({
    queryKey: ['user-cart', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error fetching cart:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user,
  });

  // Load recently viewed products from localStorage
  useEffect(() => {
    const viewedItems = localStorage.getItem('recentlyViewedProducts');
    if (viewedItems) {
      try {
        setRecentViewedProducts(JSON.parse(viewedItems).slice(0, 4));
      } catch (e) {
        console.error('Error parsing recently viewed products', e);
      }
    }
  }, []);

  // Calculate total spent
  const totalSpent = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              {isLoadingOrders ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <h4 className="text-3xl font-bold">{orders?.length || 0}</h4>
              )}
            </div>
            <Package className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>

        {/* Wishlist Items */}
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Wishlist Items</p>
              {isLoadingFavorites ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <h4 className="text-3xl font-bold">{favorites?.length || 0}</h4>
              )}
            </div>
            <Heart className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>

        {/* Cart Items */}
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cart Items</p>
              {isLoadingCart ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <h4 className="text-3xl font-bold">{cartItems?.length || 0}</h4>
              )}
            </div>
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>

        {/* Total Spent */}
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
              {isLoadingOrders ? (
                <Skeleton className="h-7 w-20 mt-1" />
              ) : (
                <h4 className="text-3xl font-bold">${totalSpent.toFixed(2)}</h4>
              )}
            </div>
            <CircleDollarSign className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="mb-4">
                  <Skeleton className="h-14 w-full" />
                </div>
              ))
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div 
                    key={order.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="ml-4 text-muted-foreground">
                        ${Number(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/account/orders">View All Orders</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/shop">Start Shopping</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recently Viewed Products */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              Recently Viewed Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentViewedProducts.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentViewedProducts.map((product) => (
                    <Link 
                      key={product.id} 
                      to={`/product/${product.slug}`} 
                      className="group"
                    >
                      <div className="bg-muted/50 rounded-lg overflow-hidden">
                        <div className="aspect-[4/3] relative overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium truncate">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">${Number(product.price).toFixed(2)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/shop">Browse More Products</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No products viewed recently.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/shop">Browse Products</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Shopping Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Your Shopping Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          <div className="flex items-center justify-center py-8">
            {isLoadingOrders ? (
              <Skeleton className="h-[200px] w-full" />
            ) : orders && orders.length > 0 ? (
              <div className="text-center w-full">
                <p className="text-lg mb-4">Based on your purchase history, we recommend:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                  {["Dresses", "T-shirts", "Shoes", "Accessories", "Formal Wear"].map((category) => (
                    <Link
                      key={category}
                      to={`/shop?category=${category.toLowerCase().replace(' ', '-')}`}
                      className="bg-muted/50 hover:bg-muted p-4 rounded-lg text-center transition-colors"
                    >
                      <div className="font-medium">{category}</div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Make a purchase to see your shopping trends.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/shop">Start Shopping</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
