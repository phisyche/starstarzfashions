
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabase } from '@/context/SupabaseContext';
import { Package, ShoppingBag, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { supabase } = useSupabase();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Get product count
        const { count: productCount, error: productsError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        
        // Get order count
        const { count: orderCount, error: ordersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });
          
        // Get customer count
        const { count: customerCount, error: customersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        // Calculate revenue (simplified)
        const { data: orders, error: revenueError } = await supabase
          .from('orders')
          .select('total_amount');
          
        const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
        
        setStats({
          products: productCount || 0,
          orders: orderCount || 0,
          customers: customerCount || 0,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, [supabase]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                ) : (
                  stats.products
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total products in inventory
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                ) : (
                  stats.orders
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total orders processed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                ) : (
                  `KES ${stats.revenue.toLocaleString()}`
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total revenue generated
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
