
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingBag, Heart, Package, User as UserIcon, CreditCard, Calendar, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSupabase } from '@/context/SupabaseContext';
import { from } from '@/integrations/supabase/client';

interface AccountDashboardProps {
  userData: any;
}

export function AccountDashboard({ userData }: AccountDashboardProps) {
  const { user, supabase } = useSupabase();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fullName = userData ? 
    `${userData.first_name || ''} ${userData.last_name || ''}`.trim() : 
    'User';
    
  // Calculate loyalty points (mock)
  const loyaltyPoints = 250;
  const nextTierPoints = 500;
  const loyaltyProgress = (loyaltyPoints / nextTierPoints) * 100;
  
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);
  
  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch recent orders
      const { data: orders, error: ordersError } = await from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(2);
      
      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
      } else {
        setRecentOrders(orders || []);
      }
      
      // Fetch favorite items
      const { data: favorites, error: favoritesError } = await from('favorite_items')
        .select('*')
        .eq('user_id', user?.id)
        .limit(3);
      
      if (favoritesError) {
        console.error("Error fetching favorites:", favoritesError);
      } else {
        setFavoriteItems(favorites || []);
      }
      
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      setError(error.message || "Failed to load your data");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Welcome & Stats */}
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Welcome back, {fullName}!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Loyalty Points</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{loyaltyPoints}</span>
                  <span className="text-sm text-muted-foreground">points</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Current</span>
                    <span>Silver Member</span>
                  </div>
                  <Progress value={loyaltyProgress} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span>{loyaltyPoints} pts</span>
                    <span>Gold: {nextTierPoints} pts</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground">Orders</span>
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl font-semibold mt-2">
                    {loading ? <Skeleton className="h-8 w-6" /> : recentOrders.length}
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground">Wishlist</span>
                    <Heart className="h-4 w-4 text-pink-500" />
                  </div>
                  <p className="text-2xl font-semibold mt-2">
                    {loading ? <Skeleton className="h-8 w-6" /> : favoriteItems.length}
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground">Reviews</span>
                    <Package className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-2xl font-semibold mt-2">0</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground">Coupons</span>
                    <CreditCard className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-2xl font-semibold mt-2">2</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col mt-6">
              <h4 className="text-sm font-medium mb-2">Complete your profile - {userData?.first_name && userData?.last_name ? '80%' : '40%'}</h4>
              <Progress value={userData?.first_name && userData?.last_name ? 80 : 40} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                {userData?.first_name && userData?.last_name 
                  ? 'Add a profile picture to complete your profile.'
                  : 'Add your name and address details to get personalized recommendations.'}
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full md:w-auto" asChild>
                <Link to="/account/profile">Complete Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Special Offers */}
        <Card className="w-full md:w-80">
          <CardHeader className="bg-pink-500 text-white">
            <CardTitle className="text-lg">Special Offers</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="border border-dashed border-primary/50 p-3 rounded-md">
                <div className="font-semibold">WELCOME10</div>
                <p className="text-sm text-muted-foreground">10% off your next purchase</p>
                <div className="text-xs mt-1">Expires: 2025-06-10</div>
                <Button size="sm" variant="outline" className="w-full mt-2">
                  Copy Code
                </Button>
              </div>
              
              <div className="border border-dashed border-primary/50 p-3 rounded-md">
                <div className="font-semibold">BDAY2025</div>
                <p className="text-sm text-muted-foreground">Special birthday discount</p>
                <div className="text-xs mt-1">Expires: On your birthday</div>
                <Button size="sm" variant="outline" className="w-full mt-2">
                  Copy Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <Link to="/account/orders" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium">{order.id.substring(0, 8)}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">KSh {Number(order.total_amount).toLocaleString()}</div>
                      <div className={`text-xs ${
                        order.status === 'completed' ? 'text-green-600' : 
                        order.status === 'processing' ? 'text-amber-600' : 'text-blue-600'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No recent orders</p>
                <Button asChild className="mt-4">
                  <Link to="/shop">Start Shopping</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Wishlist Preview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Wishlist</CardTitle>
              <Link to="/account/favorites" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : favoriteItems.length > 0 ? (
              <div className="space-y-4">
                {favoriteItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium">{item.product_name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">KSh {Number(item.price).toLocaleString()}</div>
                      <Button size="sm" variant="outline" className="mt-1" asChild>
                        <Link to={`/product/${item.product_id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Your wishlist is empty</p>
                <Button asChild className="mt-4">
                  <Link to="/shop">Browse Products</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Product Recommendations */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Recent Activity
          </CardTitle>
          <Button size="sm" variant="outline">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-muted/30 rounded-lg gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <UserIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Profile Updated</div>
                <div className="text-sm text-muted-foreground">
                  You updated your profile information
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-muted/30 rounded-lg gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <ShoppingBag className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Order Placed</div>
                <div className="text-sm text-muted-foreground">
                  You placed a new order
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(Date.now() - 86400000).toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-muted/30 rounded-lg gap-3">
              <div className="bg-pink-100 p-2 rounded-full">
                <Heart className="h-4 w-4 text-pink-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Item Favorited</div>
                <div className="text-sm text-muted-foreground">
                  You added an item to your favorites
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(Date.now() - 172800000).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
