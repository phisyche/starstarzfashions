
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
  const [tab, setTab] = useState('profile');
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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setProfileData(data);
        
        // Set form values
        form.reset({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: user.email || '',
          phone: data.phone || '',
          address_line1: data.address?.line1 || '',
          city: data.address?.city || '',
          county: data.address?.county || '',
          postal_code: data.address?.postal_code || '',
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
  
  // Fetch user orders
  const fetchOrders = async () => {
    if (!user || !supabase) return;
    
    try {
      // Check if orders table exists
      const { error: tableCheckError } = await supabase
        .from('orders')
        .select('id')
        .limit(1)
        .maybeSingle();
        
      if (tableCheckError && tableCheckError.code === '42P01') {
        console.log('Orders table does not exist');
        setOrders([]);
        return;
      }
      
      // Fetch orders if table exists
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, 
          created_at, 
          status,
          payment_status, 
          total_amount,
          order_items (
            id,
            product_id,
            product_name,
            quantity,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load order history.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle profile update
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user || !supabase) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone,
          address: {
            line1: values.address_line1,
            city: values.city,
            county: values.county,
            postal_code: values.postal_code
          }
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
      <div className="bg-gradient-to-b from-primary/5 to-background py-10">
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
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container max-w-6xl py-8">
        <Tabs value={tab} onValueChange={setTab} className="space-y-8">
          <div className="flex justify-between border-b">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="profile" className="flex gap-2 items-center">
                <UserIcon className="w-4 h-4" />
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
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="John"
                                  {...field} 
                                  disabled={loading}
                                />
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
                                <Input 
                                  placeholder="Doe"
                                  {...field}
                                  disabled={loading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="john.doe@example.com"
                                  {...field}
                                  disabled={true}
                                />
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
                                <Input 
                                  placeholder="+254 123 456789"
                                  {...field}
                                  disabled={loading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
                      
                      <FormField
                        control={form.control}
                        name="address_line1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="123 Main St"
                                {...field}
                                disabled={loading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Nairobi"
                                  {...field}
                                  disabled={loading}
                                />
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
                                <Input 
                                  placeholder="Nairobi County"
                                  {...field}
                                  disabled={loading}
                                />
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
                                <Input 
                                  placeholder="00100"
                                  {...field}
                                  disabled={loading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password or reset it if you've forgotten it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Update password</p>
                    <p className="text-sm text-muted-foreground">
                      It's a good idea to use a strong password that you don't use elsewhere
                    </p>
                  </div>
                  <Button>
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>
                  Options for managing your account data and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-destructive">Delete account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Order History</h2>
              
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-48 w-full rounded-lg" />
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
                          <CardDescription>
                            Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'processing' ? 'default' : 'secondary'}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <Badge variant={order.payment_status === 'paid' ? 'success' : 'outline'}>
                            {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {order.order_items && order.order_items.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b">
                              <div className="flex-1">
                                <p>{item.product_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {item.quantity} × <Price amount={item.price} />
                                </p>
                              </div>
                              <Price amount={item.price * item.quantity} />
                            </div>
                          ))}
                          <div className="flex justify-between items-center pt-2">
                            <span className="font-bold">Total</span>
                            <Price amount={order.total_amount} size="lg" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/order/${order.id}`}>
                            <Package className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No orders yet</h3>
                    <p className="text-center text-muted-foreground mb-6">
                      Once you make a purchase, your order history will appear here.
                    </p>
                    <Button asChild>
                      <Link to="/shop">Start Shopping</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Saved Items</h2>
              
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
                  <p className="text-center text-muted-foreground mb-6">
                    Save items you love by clicking the heart icon on any product.
                  </p>
                  <Button asChild>
                    <Link to="/shop">Explore Products</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
