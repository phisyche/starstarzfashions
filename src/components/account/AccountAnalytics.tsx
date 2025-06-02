
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '@/context/SupabaseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { Package, CreditCard, Heart, ShoppingCart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function AccountAnalytics() {
  const { supabase, user } = useSupabase();

  // Fetch user orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch user favorites
  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('favorite_items')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch cart items
  const { data: cartItems, isLoading: cartLoading } = useQuery({
    queryKey: ['user-cart', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Calculate analytics
  const totalOrders = orders?.length || 0;
  const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  const completedOrders = orders?.filter(order => order.status === 'delivered').length || 0;
  const totalFavorites = favorites?.length || 0;
  const cartValue = cartItems?.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0) || 0;

  const isLoading = ordersLoading || favoritesLoading || cartLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {completedOrders} completed, {pendingOrders} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalSpent)}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime spending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFavorites}</div>
            <p className="text-xs text-muted-foreground">
              Saved items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Cart Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(cartValue)}</div>
            <p className="text-xs text-muted-foreground">
              {cartItems?.length || 0} items in cart
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      {orders && orders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total_amount)}</p>
                    <Badge variant="outline" className={
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
