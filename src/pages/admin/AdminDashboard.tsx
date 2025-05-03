
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabase } from '@/context/SupabaseContext';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Chart imports
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboard() {
  const { supabase, isAdmin, user } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
    newOrders: 0,
    pendingOrders: 0,
  });
  
  const [salesData, setSalesData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminVerified, setAdminVerified] = useState(false);
  
  // Sample data for charts
  const defaultSalesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
  ];
  
  const defaultOrderStatusData = [
    { name: 'Delivered', value: 65, color: '#10B981' },
    { name: 'Processing', value: 25, color: '#3B82F6' },
    { name: 'Cancelled', value: 10, color: '#EF4444' },
  ];

  // Verify admin status
  useEffect(() => {
    const verifyAdmin = async () => {
      if (!user) {
        navigate('/admin');
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          throw error;
        }
        
        if (!data?.is_admin) {
          toast({
            title: "Access denied",
            description: "You don't have permission to access the admin area.",
            variant: "destructive",
          });
          navigate('/');
        } else {
          setAdminVerified(true);
          fetchDashboardData();
        }
      } catch (error) {
        console.error("Error verifying admin status:", error);
        toast({
          title: "Authentication error",
          description: "There was a problem verifying your credentials.",
          variant: "destructive",
        });
        navigate('/admin');
      }
    };
    
    verifyAdmin();
  }, [user, navigate, toast, supabase]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (!supabase) return;
      
      // Run concurrent requests to improve loading speed
      const [
        productsResponse, 
        ordersResponse, 
        customersResponse, 
        revenueResponse,
        newOrdersResponse,
        pendingOrdersResponse
      ] = await Promise.all([
        // Get product count
        supabase.from('products').select('*', { count: 'exact', head: true }),
        
        // Get order count
        supabase.from('orders').select('*', { count: 'exact', head: true }).maybeSingle(),
        
        // Get customer count
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        
        // Get revenue data
        supabase.from('orders').select('total_amount, created_at').maybeSingle(),
        
        // Get new orders (last 7 days)
        supabase.from('orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .maybeSingle(),
        
        // Get pending orders
        supabase.from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'processing')
          .maybeSingle()
      ]);
      
      // Extract counts
      const productCount = productsResponse.count || 0;
      const orderCount = ordersResponse.count || 0;
      const customerCount = customersResponse.count || 0;
      const newOrdersCount = newOrdersResponse.count || 0;
      const pendingOrdersCount = pendingOrdersResponse.count || 0;
      
      // Calculate total revenue
      const orders = revenueResponse.data || [];
      let totalRevenue = 0;
      
      if (Array.isArray(orders)) {
        totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      } else if (orders && typeof orders === 'object' && 'total_amount' in orders) {
        totalRevenue = orders.total_amount || 0;
      }
      
      // Prepare monthly sales data
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlySales = Array(12).fill(0);
      
      if (Array.isArray(orders)) {
        orders.forEach(order => {
          if (order.created_at && order.total_amount) {
            const date = new Date(order.created_at);
            const month = date.getMonth();
            monthlySales[month] += order.total_amount;
          }
        });
      }
      
      const salesChartData = monthNames.map((name, i) => ({
        name,
        sales: monthlySales[i]
      })).filter((_, i) => i <= new Date().getMonth());
      
      // Set chart data
      setSalesData(salesChartData.length > 0 ? salesChartData : defaultSalesData);
      setOrderStatusData(defaultOrderStatusData);
      
      setStats({
        products: productCount,
        orders: orderCount,
        customers: customerCount,
        revenue: totalRevenue,
        newOrders: newOrdersCount,
        pendingOrders: pendingOrdersCount
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Data fetch error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // COLORS for the pie chart
  const COLORS = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6'];

  // If not admin verified, show loading state
  if (!adminVerified) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin mb-4 h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <h2 className="text-xl font-medium">Verifying admin credentials...</h2>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats.products
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Products in inventory
              </p>
              <div className="mt-2">
                <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate('/admin/products')}>
                  Manage Products
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats.orders
                )}
              </div>
              <div className="flex items-center pt-1">
                <span className="text-xs text-green-700 font-medium flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{loading ? (<Skeleton className="h-3 w-8 inline-block" />) : stats.newOrders} new
                </span>
                <span className="mx-2 text-xs text-gray-500">•</span>
                <span className="text-xs text-blue-700 font-medium">
                  {loading ? (<Skeleton className="h-3 w-8 inline-block" />) : stats.pendingOrders} pending
                </span>
              </div>
              <div className="mt-2">
                <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate('/admin/orders')}>
                  View Orders
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats.customers
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
              <div className="mt-2">
                <Button size="sm" variant="outline" className="text-xs" disabled>
                  View Customers
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  `KES ${stats.revenue.toLocaleString()}`
                )}
              </div>
              <div className="flex items-center pt-1">
                <span className={`text-xs font-medium flex items-center ${
                  stats.revenue > 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {stats.revenue > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stats.revenue > 0 ? '+8.7%' : '-2.5%'} vs last month
                </span>
              </div>
              <div className="mt-2">
                <Button size="sm" variant="outline" className="text-xs" disabled>
                  Revenue Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <Card className="col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Monthly Sales
                </CardTitle>
                <select 
                  className="text-sm border rounded px-2 py-1 bg-white"
                  defaultValue="sales"
                >
                  <option value="sales">Revenue</option>
                  <option value="orders">Orders</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="w-full aspect-[1.5/1]">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : (
                <div className="w-full" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`KES ${value}`, 'Sales']} />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#8B5CF6" 
                        fill="#8B5CF680" 
                        activeDot={{ r: 6 }} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Order Status */}
          <Card className="col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Order Status
                </CardTitle>
                <select 
                  className="text-sm border rounded px-2 py-1 bg-white"
                  defaultValue="allTime"
                >
                  <option value="allTime">All Time</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="w-full aspect-[1.5/1]">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : (
                <div className="flex flex-col items-center" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
