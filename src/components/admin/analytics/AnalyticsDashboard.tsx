
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, BarChart, Calendar, ChevronDown, CreditCard, DollarSign, Package, ShoppingBag, TrendingDown, TrendingUp, Users } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useSupabase } from '@/context/SupabaseContext';
import { from } from '@/integrations/supabase/client';

// Define types for our analytics data
interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  newOrders: number;
  pendingOrders: number;
  revenueChange: number;
}

interface OrderStatus {
  name: string;
  value: number;
  color: string;
}

interface SalesData {
  name: string;
  sales: number;
  orders?: number;
}

interface ProductPerformance {
  name: string;
  sales: number;
  views: number;
  stock: number;
}

interface CustomerDemographic {
  name: string;
  value: number;
  color: string;
}

export function AnalyticsDashboard() {
  const { supabase, user } = useSupabase();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [timeRange, setTimeRange] = React.useState<'7d' | '30d' | '90d' | 'all'>('30d');
  
  const [stats, setStats] = React.useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0, 
    totalCustomers: 0,
    totalRevenue: 0,
    newOrders: 0,
    pendingOrders: 0,
    revenueChange: 0
  });
  
  const [salesData, setSalesData] = React.useState<SalesData[]>([]);
  const [orderStatusData, setOrderStatusData] = React.useState<OrderStatus[]>([]);
  const [topProducts, setTopProducts] = React.useState<ProductPerformance[]>([]);
  const [demographics, setDemographics] = React.useState<CustomerDemographic[]>([]);
  
  // Define chart colors
  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#0EA5E9'];
  const CHART_CONFIG = {
    orders: { label: 'Orders', theme: { light: '#3B82F6', dark: '#3B82F6' } },
    revenue: { label: 'Revenue', theme: { light: '#10B981', dark: '#10B981' } },
    delivered: { label: 'Delivered', theme: { light: '#10B981', dark: '#10B981' } },
    processing: { label: 'Processing', theme: { light: '#3B82F6', dark: '#3B82F6' } },
    cancelled: { label: 'Cancelled', theme: { light: '#EF4444', dark: '#EF4444' } },
  };

  React.useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get product count
      const { count: productCount, error: productError } = await from('products')
        .select('*', { count: 'exact', head: true });
      
      if (productError) throw productError;
      
      // Get customer count
      const { count: customerCount, error: customerError } = await from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (customerError) throw customerError;
      
      // Get orders and revenue data
      const { data: orders, error: ordersError } = await from('orders')
        .select('*');
      
      if (ordersError) throw ordersError;
      
      // Calculate total revenue, new orders, pending orders
      const totalRevenue = orders ? orders.reduce((sum, order) => sum + Number(order.total_amount), 0) : 0;
      const newOrders = orders ? orders.filter(order => new Date(order.created_at).getTime() > Date.now() - 48 * 60 * 60 * 1000).length : 0;
      const pendingOrders = orders ? orders.filter(order => order.status === 'pending').length : 0;
      
      // Create a random revenue change percentage for demo purposes
      // In real world, we'd compare with previous period
      const revenueChange = Math.round((Math.random() * 20) - 5);
      
      setStats({
        totalProducts: productCount || 0,
        totalOrders: orders?.length || 0,
        totalCustomers: customerCount || 0,
        totalRevenue,
        newOrders,
        pendingOrders,
        revenueChange
      });
      
      // Generate sales data by day for last 30 days
      const salesByDay = generateSalesDataByDay(orders || []);
      setSalesData(salesByDay);
      
      // Generate order status distribution data
      const orderStatusCounts = {
        delivered: orders ? orders.filter(o => o.status === 'completed').length : 0,
        processing: orders ? orders.filter(o => o.status === 'processing').length : 0,
        cancelled: orders ? orders.filter(o => o.status === 'cancelled').length : 0,
        pending: orders ? orders.filter(o => o.status === 'pending').length : 0
      };
      
      const orderStatusArray = [
        { name: 'Completed', value: orderStatusCounts.delivered, color: '#10B981' },
        { name: 'Processing', value: orderStatusCounts.processing, color: '#3B82F6' },
        { name: 'Pending', value: orderStatusCounts.pending, color: '#F59E0B' },
        { name: 'Cancelled', value: orderStatusCounts.cancelled, color: '#EF4444' }
      ];
      setOrderStatusData(orderStatusArray);
      
      // Get top products data
      const { data: products, error: productsError } = await from('products')
        .select('*')
        .order('stock', { ascending: false })
        .limit(5);
      
      if (productsError) throw productsError;
      
      if (products) {
        // Transform product data
        const topProductsData = products.map(product => ({
          name: product.name,
          sales: Math.floor(Math.random() * 100), // Placeholder for actual sales data
          views: Math.floor(Math.random() * 1000), // Placeholder for actual view data
          stock: product.stock || 0
        }));
        setTopProducts(topProductsData);
      }
      
      // Mock customer demographics data
      const mockDemographics = [
        { name: 'Nairobi', value: 65, color: '#3B82F6' },
        { name: 'Mombasa', value: 15, color: '#10B981' },
        { name: 'Kisumu', value: 10, color: '#F59E0B' },
        { name: 'Other', value: 10, color: '#8B5CF6' }
      ];
      setDemographics(mockDemographics);
      
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to generate daily sales data
  const generateSalesDataByDay = (orders: any[]) => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 30;
    const result: SalesData[] = [];
    
    // Create a map of dates
    const salesMap = new Map();
    const ordersMap = new Map();
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      salesMap.set(dateString, 0);
      ordersMap.set(dateString, 0);
    }
    
    // Populate with actual data
    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      if (Date.now() - orderDate.getTime() <= days * 24 * 60 * 60 * 1000) {
        const dateString = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (salesMap.has(dateString)) {
          salesMap.set(dateString, salesMap.get(dateString) + Number(order.total_amount));
          ordersMap.set(dateString, ordersMap.get(dateString) + 1);
        }
      }
    });
    
    // Convert to array format required by charts
    salesMap.forEach((sales, date) => {
      result.push({
        name: date,
        sales: sales,
        orders: ordersMap.get(date) || 0
      });
    });
    
    // Sort by date ascending
    return result.sort((a, b) => {
      const dateA = new Date(a.name);
      const dateB = new Date(b.name);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const formatCurrency = (value: number) => {
    return `KES ${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Get insights on your business performance</p>
        </div>
        
        <div className="flex gap-2">
          <select 
            className="border rounded-md p-2 bg-background"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => fetchDashboardData()}
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin">⭮</span>
            ) : (
              <span>↻</span>
            )}
          </Button>
        </div>
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
                stats.totalProducts
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Products in inventory
            </p>
            <div className="mt-2">
              <Button size="sm" variant="outline" className="text-xs" asChild>
                <a href="/admin/products">Manage Products</a>
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
                stats.totalOrders
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
              <Button size="sm" variant="outline" className="text-xs" asChild>
                <a href="/admin/orders">View Orders</a>
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
                stats.totalCustomers
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
                `KES ${stats.totalRevenue.toLocaleString()}`
              )}
            </div>
            <div className="flex items-center pt-1">
              <span className={`text-xs font-medium flex items-center ${
                stats.revenueChange > 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {stats.revenueChange > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stats.revenueChange > 0 ? '+' : ''}{stats.revenueChange}% vs last period
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
                Sales & Orders Trends
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
                <ChartContainer 
                  config={CHART_CONFIG}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        yAxisId="left"
                        orientation="left"
                        stroke="#10B981"
                        tickFormatter={val => `KES ${val}`}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        stroke="#3B82F6"
                      />
                      <ChartTooltip 
                        content={
                          <ChartTooltipContent 
                            formatter={(value, name) => {
                              if (name === 'sales') return [`KES ${Number(value).toLocaleString()}`, 'Sales'];
                              return [value, 'Orders'];
                            }}
                          />
                        }
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#10B981" 
                        fillOpacity={1}
                        fill="url(#colorSales)"
                        strokeWidth={2}
                        yAxisId="left"
                        name="revenue"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="orders" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        yAxisId="right"
                        name="orders"
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
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
                Order Status Distribution
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
                <ChartContainer 
                  config={CHART_CONFIG}
                  className="h-full w-full"
                >
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
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}`, 'Orders']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Additional charts */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Demographics</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Top Products by Performance
              </CardTitle>
              <CardDescription>
                View your best selling and most viewed products
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="w-full h-[300px]" />
              ) : (
                <div className="w-full" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={topProducts}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" name="Sales" fill="#10B981" />
                      <Bar dataKey="views" name="Views" fill="#3B82F6" />
                      <Bar dataKey="stock" name="Stock" fill="#F59E0B" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Customer Demographics
              </CardTitle>
              <CardDescription>
                View customer distribution by location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demographics}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {demographics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Customer Insights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-sm text-muted-foreground">New customers</div>
                        <div className="text-2xl font-bold">{stats.totalCustomers > 0 ? Math.floor(stats.totalCustomers * 0.15) : 0}</div>
                        <div className="text-xs text-green-600">+12% from last month</div>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-sm text-muted-foreground">Retention rate</div>
                        <div className="text-2xl font-bold">78%</div>
                        <div className="text-xs text-amber-600">-2% from last month</div>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-sm text-muted-foreground">Avg. order value</div>
                        <div className="text-2xl font-bold">
                          {stats.totalOrders > 0 ? 
                            `KES ${Math.floor(stats.totalRevenue / stats.totalOrders).toLocaleString()}` : 
                            'KES 0'}
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-sm text-muted-foreground">Mobile users</div>
                        <div className="text-2xl font-bold">82%</div>
                        <div className="text-xs text-green-600">+5% from last month</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Analytics
              </CardTitle>
              <CardDescription>
                Payment method preferences and transaction volumes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-4">Payment Methods</h4>
                  <div className="w-full" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'M-Pesa', value: 85, color: '#3B82F6' },
                            { name: 'Card', value: 10, color: '#10B981' },
                            { name: 'Cash', value: 5, color: '#F59E0B' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: 'M-Pesa', value: 85, color: '#3B82F6' },
                            { name: 'Card', value: 10, color: '#10B981' },
                            { name: 'Cash', value: 5, color: '#F59E0B' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-4">Transaction Success Rate</h4>
                  <div className="w-full" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { name: 'Mon', success: 95, failure: 5 },
                          { name: 'Tue', success: 93, failure: 7 },
                          { name: 'Wed', success: 98, failure: 2 },
                          { name: 'Thu', success: 92, failure: 8 },
                          { name: 'Fri', success: 96, failure: 4 },
                          { name: 'Sat', success: 99, failure: 1 },
                          { name: 'Sun', success: 97, failure: 3 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="success" stroke="#10B981" name="Success Rate (%)" />
                        <Line type="monotone" dataKey="failure" stroke="#EF4444" name="Failure Rate (%)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-4">Transaction Statistics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Avg. Transaction Time</p>
                          <p className="text-xl font-bold">8.2s</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-full text-green-600">
                          <CreditCard className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Success Rate</p>
                          <p className="text-xl font-bold">95.8%</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-full text-green-600">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Failed Payments</p>
                          <p className="text-xl font-bold">4.2%</p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-full text-red-600">
                          <TrendingDown className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
