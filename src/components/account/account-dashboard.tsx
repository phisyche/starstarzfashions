
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabase } from '@/context/SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Package, ShoppingBag, TrendingUp, Heart, Clock, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface AccountDashboardProps {
  userData?: any;
}

export function AccountDashboard({ userData }: AccountDashboardProps) {
  const { user } = useSupabase();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    completed: 0,
    processing: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) return;
    
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Fetch order stats
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('id, status, total_amount, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
        } else if (orders) {
          // Set recent orders
          setRecentOrders(orders.slice(0, 5));
          
          // Calculate order stats
          const stats = {
            total: orders.length,
            completed: orders.filter(o => o.status === 'delivered').length,
            processing: orders.filter(o => o.status === 'processing').length,
            pending: orders.filter(o => o.status === 'pending').length
          };
          
          setOrderStats(stats);
        }
        
        // Fetch favorites count
        const { count: favCount, error: favError } = await supabase
          .from('favorite_items')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id);
          
        if (favError) {
          console.error("Error fetching favorites:", favError);
        } else {
          setFavoriteCount(favCount || 0);
        }
        
        // Fetch cart count
        const { count: cartItemsCount, error: cartError } = await supabase
          .from('cart_items')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id);
          
        if (cartError) {
          console.error("Error fetching cart items:", cartError);
        } else {
          setCartCount(cartItemsCount || 0);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  // Render loading skeletons
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-[60px] mb-2" />
                <Skeleton className="h-4 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-[180px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-[200px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                    <Skeleton className="h-6 w-[80px]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-[180px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const userName = userData?.first_name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{getGreeting()}, {userName}!</h2>
        <p className="text-muted-foreground">
          Here's what's happening with your account today
        </p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="recommendations">For You</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Orders</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{orderStats.total}</span>
                </div>
              </CardContent>
              <CardFooter className="p-2">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/account?tab=orders')}>
                  View Orders
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Items in Wishlist</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-rose-500 mr-2" />
                  <span className="text-2xl font-bold">{favoriteCount}</span>
                </div>
              </CardContent>
              <CardFooter className="p-2">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/account?tab=favorites')}>
                  View Wishlist
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Items in Cart</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold">{cartCount}</span>
                </div>
              </CardContent>
              <CardFooter className="p-2">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/cart')}>
                  View Cart
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Recently Viewed</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-2xl font-bold">4</span>
                </div>
              </CardContent>
              <CardFooter className="p-2">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/shop')}>
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map(order => (
                      <div key={order.id} className="flex justify-between items-center border-b pb-4">
                        <div>
                          <div className="font-medium">{`Order #${order.id.substring(0, 8)}`}</div>
                          <div className="text-sm text-muted-foreground">{formatDate(order.created_at)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn("text-xs px-2 py-1 rounded", getOrderStatusColor(order.status))}>
                            {order.status}
                          </span>
                          <span className="font-medium">KES {order.total_amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="mb-2">No orders yet</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/shop">Start Shopping</a>
                    </Button>
                  </div>
                )}
              </CardContent>
              {recentOrders.length > 0 && (
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/account?tab=orders')}>
                    View All Orders
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                {orderStats.total > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Completed</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{orderStats.completed}</span>
                        <div className="w-20 h-2 bg-gray-100 ml-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-green-500 h-full" 
                            style={{ 
                              width: `${orderStats.total ? (orderStats.completed / orderStats.total) * 100 : 0}%` 
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Processing</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{orderStats.processing}</span>
                        <div className="w-20 h-2 bg-gray-100 ml-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full" 
                            style={{ 
                              width: `${orderStats.total ? (orderStats.processing / orderStats.total) * 100 : 0}%` 
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Pending</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{orderStats.pending}</span>
                        <div className="w-20 h-2 bg-gray-100 ml-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-amber-500 h-full" 
                            style={{ 
                              width: `${orderStats.total ? (orderStats.pending / orderStats.total) * 100 : 0}%` 
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <Calendar className="h-10 w-10 mb-2 text-muted-foreground opacity-20" />
                    <p className="text-muted-foreground mb-2">No order data to show</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/shop">Shop Now</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Shopping Insights</CardTitle>
                <CardDescription>Your shopping patterns and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                    Most Purchased Category
                  </h4>
                  <p className="text-muted-foreground text-sm">African Print</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    Average Order Frequency
                  </h4>
                  <p className="text-muted-foreground text-sm">Every 45 days</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2 flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2 text-blue-500" />
                    Average Order Value
                  </h4>
                  <p className="text-muted-foreground text-sm">KES {orderStats.total > 0 ? '4,250' : '0'}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Trends & Recommendations</CardTitle>
                <CardDescription>Based on your shopping behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-md border border-blue-100">
                    <h4 className="font-medium mb-2">Your Style Profile</h4>
                    <div className="flex gap-2 flex-wrap">
                      <span className="bg-white px-2 py-1 text-xs rounded-full border">Modern</span>
                      <span className="bg-white px-2 py-1 text-xs rounded-full border">Casual</span>
                      <span className="bg-white px-2 py-1 text-xs rounded-full border">African Print</span>
                      <span className="bg-white px-2 py-1 text-xs rounded-full border">Elegant</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" onClick={() => navigate('/shop')}>
                    View Personalized Recommendations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
              <CardDescription>Products you might like based on your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border rounded-md overflow-hidden">
                    <div className="h-48 bg-gray-100"></div>
                    <div className="p-3">
                      <h4 className="font-medium truncate">African Print Dress</h4>
                      <p className="text-muted-foreground text-sm mb-2">KES 3,999</p>
                      <Button variant="outline" size="sm" className="w-full">View Product</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/shop')}>
                View All Recommendations
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Latest Fashion Trends</CardTitle>
              <CardDescription>Stay updated with what's hot in the fashion world</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "African Print Revival", desc: "Traditional prints with modern cuts" },
                  { title: "Sustainable Fashion", desc: "Eco-friendly materials and ethical production" },
                  { title: "Bold Color Blocks", desc: "Vibrant color combinations for statement looks" }
                ].map((trend, i) => (
                  <div key={i} className="flex gap-4 border-b pb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded"></div>
                    <div>
                      <h4 className="font-medium">{trend.title}</h4>
                      <p className="text-muted-foreground text-sm">{trend.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
