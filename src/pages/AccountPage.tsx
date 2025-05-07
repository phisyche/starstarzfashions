
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/context/SupabaseContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Price } from '@/components/ui/price';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShoppingBag, Heart, Package, UserIcon, AlertCircle, Settings, CreditCard, LogOut, Mail, User } from 'lucide-react';
import { from } from '@/integrations/supabase/client';
import { AccountDashboard } from '@/components/account/account-dashboard';

interface AddressData {
  line1: string;
  city: string;
  county: string;
  postal_code: string;
}

const profileFormSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters').max(50),
  last_name: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address_line1: z.string().min(5, 'Address must be at least 5 characters').max(100),
  city: z.string().min(2, 'City must be at least 2 characters').max(50),
  county: z.string().min(2, 'County must be at least 2 characters').max(50),
  postal_code: z.string().min(4, 'Postal code must be at least 4 characters').max(10),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function AccountPage() {
  const [tab, setTab] = useState('dashboard'); // Changed default tab to dashboard
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const { user, supabase, signOut } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address_line1: '',
      city: '',
      county: '',
      postal_code: '',
    },
  });
  
  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    } else {
      fetchUserData();
      fetchOrders();
    }
  }, [user, navigate]);
  
  // Fetch user profile data
  const fetchUserData = async () => {
    if (!user || !supabase) return;
    
    try {
      const { data, error } = await from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setProfileData(data);
        
        // Get the address as an object with proper typing
        const address: AddressData = data.address as AddressData || {
          line1: '',
          city: '',
          county: '',
          postal_code: ''
        };
        
        // Set form values
        form.reset({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: user.email || '',
          phone: data.phone || '',
          address_line1: address.line1 || '',
          city: address.city || '',
          county: address.county || '',
          postal_code: address.postal_code || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch user orders - using mock data for now as we wait for orders table in the DB
  const fetchOrders = async () => {
    setOrders([
      {
        id: 'ORD-001',
        created_at: new Date().toISOString(),
        status: 'delivered',
        payment_status: 'paid',
        total_amount: 2500,
        order_items: [
          {
            id: 'ITEM-001',
            product_name: 'Summer Dress',
            price: 1200,
            quantity: 1
          },
          {
            id: 'ITEM-002',
            product_name: 'Casual Shoes',
            price: 1300,
            quantity: 1
          }
        ]
      },
      {
        id: 'ORD-002',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'processing',
        payment_status: 'paid',
        total_amount: 4500,
        order_items: [
          {
            id: 'ITEM-003',
            product_name: 'Leather Bag',
            price: 4500,
            quantity: 1
          }
        ]
      }
    ]);
  };
  
  // Handle profile update
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user || !supabase) return;
    
    setLoading(true);
    
    try {
      // Prepare the address object
      const address = {
        line1: values.address_line1,
        city: values.city,
        county: values.county,
        postal_code: values.postal_code
      };
      
      const { error } = await from('profiles')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone,
          address: address,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      
      // Refresh profile data
      await fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  if (!user) {
    return null; // Redirect happens in useEffect
  }
  
  const userInitials = profileData ? 
    `${(profileData.first_name?.[0] || '').toUpperCase()}${(profileData.last_name?.[0] || '').toUpperCase()}` : 
    user.email?.[0]?.toUpperCase() || '?';
    
  const fullName = profileData ? 
    `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() : 
    'User';
  
  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-10">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
              <AvatarImage src={profileData?.avatar_url} />
              <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{fullName}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container max-w-6xl py-8">
        <Tabs value={tab} onValueChange={setTab} className="space-y-8">
          <div className="flex justify-between border-b overflow-x-auto">
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="dashboard" className="flex gap-2 items-center">
                <UserIcon className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex gap-2 items-center">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex gap-2 items-center">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex gap-2 items-center">
                <Heart className="w-4 h-4" />
                <span>Favorites</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* New Dashboard Tab */}
          <TabsContent value="dashboard">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            ) : (
              <AccountDashboard userData={profileData} />
            )}
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and account information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={loading} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={loading} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} disabled type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={loading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div>
                        <h3 className="mb-4 text-lg font-medium">Delivery Address</h3>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="address_line1"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={loading} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid gap-4 md:grid-cols-3">
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={loading} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="county"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>County</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={loading} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="postal_code"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Postal Code</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={loading} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={loading} 
                          className="min-w-[150px]"
                        >
                          {loading ? 'Updating...' : 'Update Profile'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start border-t pt-6 space-y-2">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Account Security</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>For security reasons, password changes must be done through the login page.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="mt-2">Reset Password</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset Password?</AlertDialogTitle>
                      <AlertDialogDescription>
                        We will send you an email with instructions to reset your password.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Send Reset Email</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Order History</h2>
              
              {orders.length === 0 ? (
                <div className="bg-white rounded-lg border p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    When you place orders, they will appear here.
                  </p>
                  <Button asChild>
                    <Link to="/shop">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <CardTitle className="text-base">Order #{order.id}</CardTitle>
                            <CardDescription>
                              Placed on {new Date(order.created_at).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={
                                order.status === 'delivered' ? 'default' : 
                                order.status === 'processing' ? 'secondary' : 
                                'outline'
                              }
                            >
                              {order.status}
                            </Badge>
                            <Price amount={order.total_amount} />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {order.order_items.map((item: any) => (
                            <div key={item.id} className="p-4 flex items-center gap-4">
                              <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                                <Package className="h-8 w-8 text-muted-foreground/40" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{item.product_name}</div>
                                <div className="text-sm text-muted-foreground">
                                  Quantity: {item.quantity}
                                </div>
                              </div>
                              <div>
                                <Price amount={item.price} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between bg-muted/30">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/account/orders/${order.id}`}>View Details</Link>
                        </Button>
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm">Track Package</Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Your Favorites</h2>
              
              <div className="bg-white rounded-lg border p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-4">
                  Items you mark as favorite will appear here.
                </p>
                <Button asChild>
                  <Link to="/shop">Browse Products</Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
