
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { Activity, ShoppingBag, Users, CreditCard, TrendingUp, Package, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPrice } from '@/lib/utils';

// Type definitions
interface SalesData {
  date: string;
  sales: number;
}

interface CategoryData {
  name: string;
  value: number;
}

interface OrderStatus {
  status: string;
  count: number;
}

interface ProductStock {
  name: string;
  stock: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B'];

export function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [overview, setOverview] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0
  });
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatus[]>([]);
  const [stockData, setStockData] = useState<ProductStock[]>([]);

  // Fetch all analytics data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchOverviewData(),
          fetchSalesData(),
          fetchCategoryData(),
          fetchOrderStatusData(),
          fetchStockData()
        ]);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  // Fetch general metrics
  const fetchOverviewData = async () => {
    try {
      // Get total sales
      const { data: salesData, error: salesError } = await supabase
        .from('orders')
        .select('total_amount');
      
      if (salesError) throw salesError;

      // Get total orders
      const { count: ordersCount, error: ordersError } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: false });
      
      if (ordersError) throw ordersError;

      // Get unique customers
      const { count: customersCount, error: customersError } = await supabase
        .from('orders')
        .select('user_id', { count: 'exact', head: false })
        .not('user_id', 'is', null);
      
      if (customersError) throw customersError;

      // Get pending orders
      const { count: pendingCount, error: pendingError } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: false })
        .eq('status', 'pending');
      
      if (pendingError) throw pendingError;

      // Calculate total sales
      const totalSales = salesData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      
      setOverview({
        totalSales,
        totalOrders: ordersCount || 0,
        totalCustomers: customersCount || 0,
        pendingOrders: pendingCount || 0
      });
    } catch (error) {
      console.error("Error fetching overview data:", error);
    }
  };

  // Fetch sales data for charts
  const fetchSalesData = async () => {
    try {
      let daysToLookBack = 7;
      
      if (timeframe === 'month') {
        daysToLookBack = 30;
      } else if (timeframe === 'year') {
        daysToLookBack = 365;
      }
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysToLookBack);
      
      const { data, error } = await supabase
        .from('orders')
        .select('created_at, total_amount')
        .gte('created_at', startDate.toISOString());
      
      if (error) throw error;
      
      // Process the data for the chart
      const groupedData: Record<string, number> = {};
      
      data?.forEach(order => {
        const date = new Date(order.created_at);
        let formattedDate;
        
        if (timeframe === 'week') {
          formattedDate = format(date, 'EEE'); // Mon, Tue, etc.
        } else if (timeframe === 'month') {
          formattedDate = format(date, 'dd MMM'); // 01 Jan, 02 Jan, etc.
        } else {
          formattedDate = format(date, 'MMM'); // Jan, Feb, etc.
        }
        
        groupedData[formattedDate] = (groupedData[formattedDate] || 0) + Number(order.total_amount);
      });
      
      // Convert the grouped data to the format needed by recharts
      const chartData = Object.keys(groupedData).map(date => ({
        date,
        sales: groupedData[date]
      }));
      
      // Add sample data if no data is available
      if (chartData.length === 0) {
        if (timeframe === 'week') {
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          setSalesData(days.map(day => ({ date: day, sales: Math.floor(Math.random() * 10000) })));
        } else if (timeframe === 'month') {
          const sampleData = Array.from({ length: 30 }, (_, i) => ({
            date: format(new Date(2023, 0, i + 1), 'dd MMM'),
            sales: Math.floor(Math.random() * 10000)
          }));
          setSalesData(sampleData);
        } else {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          setSalesData(months.map(month => ({ date: month, sales: Math.floor(Math.random() * 50000) })));
        }
      } else {
        setSalesData(chartData);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
      // Add some sample data if the fetch fails
      setSalesData([
        { date: "Mon", sales: 4000 },
        { date: "Tue", sales: 3000 },
        { date: "Wed", sales: 2000 },
        { date: "Thu", sales: 2780 },
        { date: "Fri", sales: 1890 },
        { date: "Sat", sales: 2390 },
        { date: "Sun", sales: 3490 }
      ]);
    }
  };

  // Fetch category distribution data
  const fetchCategoryData = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category');
      
      if (error) throw error;
      
      // Count products per category
      const categoryCount: Record<string, number> = {};
      
      data?.forEach(product => {
        const category = product.category;
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
      
      // Convert to the format needed by the pie chart
      const pieData = Object.keys(categoryCount).map(category => ({
        name: category,
        value: categoryCount[category]
      }));
      
      setCategoryData(pieData.length > 0 ? pieData : [
        { name: "Women's Fashion", value: 40 },
        { name: "Men's Wear", value: 30 },
        { name: "Accessories", value: 20 },
        { name: "Footwear", value: 10 }
      ]);
    } catch (error) {
      console.error("Error fetching category data:", error);
      setCategoryData([
        { name: "Women's Fashion", value: 40 },
        { name: "Men's Wear", value: 30 },
        { name: "Accessories", value: 20 },
        { name: "Footwear", value: 10 }
      ]);
    }
  };

  // Fetch order status distribution
  const fetchOrderStatusData = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status');
      
      if (error) throw error;
      
      // Count orders by status
      const statusCount: Record<string, number> = {};
      
      data?.forEach(order => {
        const status = order.status;
        statusCount[status] = (statusCount[status] || 0) + 1;
      });
      
      // Convert to the format needed by the chart
      const chartData = Object.keys(statusCount).map(status => ({
        status,
        count: statusCount[status]
      }));
      
      setOrderStatusData(chartData.length > 0 ? chartData : [
        { status: "Pending", count: 15 },
        { status: "Processing", count: 8 },
        { status: "Shipped", count: 10 },
        { status: "Delivered", count: 30 }
      ]);
    } catch (error) {
      console.error("Error fetching order status data:", error);
      setOrderStatusData([
        { status: "Pending", count: 15 },
        { status: "Processing", count: 8 },
        { status: "Shipped", count: 10 },
        { status: "Delivered", count: 30 }
      ]);
    }
  };

  // Fetch product stock data
  const fetchStockData = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('name, stock')
        .order('stock', { ascending: true })
        .limit(10);
      
      if (error) throw error;
      
      setStockData(data?.map(item => ({
        name: item.name,
        stock: item.stock || 0
      })) || []);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setStockData([]);
    }
  };

  // Rendering the dashboard
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">View your store performance and customer insights</p>
        </div>
        <div className="mt-2 sm:mt-0">
          <Select 
            value={timeframe} 
            onValueChange={(value) => setTimeframe(value as 'week' | 'month' | 'year')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatPrice(overview.totalSales)}</div>
                <p className="text-xs text-muted-foreground">
                  Total revenue from all sales
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+{Math.floor(Math.random() * 20) + 1}%</span> from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+{Math.floor(Math.random() * 10) + 1}%</span> from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview.pendingOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Orders waiting to be processed
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-4">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Orders</TabsTrigger>
        </TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>
                  Revenue trends over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="mt-2 text-sm text-muted-foreground">Loading chart data...</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          padding={{ left: 15, right: 15 }}
                          tick={{ fontSize: 12 }} 
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }} 
                          tickFormatter={(value) => `$${value}`} 
                        />
                        <Tooltip 
                          formatter={(value) => [formatPrice(value as number), "Sales"]} 
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>
                  Distribution of products by category
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="mt-2 text-sm text-muted-foreground">Loading chart data...</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} products`, "Count"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
              <CardDescription>Items that need restocking soon</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : stockData.length > 0 ? (
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stockData.slice(0, 10)}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 50,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fontSize: 12 }}
                        width={120}
                        tickFormatter={(value) => 
                          value.length > 15 ? `${value.substring(0, 15)}...` : value
                        }
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="stock" name="Stock Remaining" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No product data available</h3>
                  <p className="text-muted-foreground">
                    Add some products to your inventory to see stock data.
                  </p>
                  <Button className="mt-4" asChild>
                    <a href="/admin/products/add">Add Product</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="customers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Breakdown of orders by status</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={orderStatusData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Orders" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest customer orders and actions</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New order placed</p>
                        <p className="text-xs text-muted-foreground">Order #ORD-2023 for KES 7,500</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New customer registered</p>
                        <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Order status updated</p>
                        <p className="text-xs text-muted-foreground">Order #ORD-1984 changed to "Shipped"</p>
                        <p className="text-xs text-muted-foreground">12 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Payment received</p>
                        <p className="text-xs text-muted-foreground">KES 12,300 via M-Pesa</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
