
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
import { useFavorites } from '@/context/FavoritesContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Price } from '@/components/ui/price';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShoppingBag, Heart, HeartOff, Package, User as UserIcon, AlertCircle, Settings, CreditCard, LogOut, Mail, User, Eye, Edit, Trash2 } from 'lucide-react';
import { from } from '@/integrations/supabase/client';
import { AccountDashboard } from '@/components/account/account-dashboard';
import { formatDate, cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

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
  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const { user, supabase, signOut, updateEmail } = useSupabase();
  const { favorites, loading: favLoading, removeFromFavorites } = useFavorites();
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
        
        // Set email for potential update
        setNewEmail(user.email || '');
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
  
  // Fetch user orders from Supabase
  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Try to fetch orders from Supabase
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
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
  
  // Handle email update
  const handleEmailUpdate = async () => {
    if (!user || !supabase || !newEmail) return;
    
    if (newEmail === user.email) {
      toast({
        title: 'No change',
        description: 'Your email address is already set to this value.',
      });
      return;
    }
    
    try {
      setUpdatingEmail(true);
      await updateEmail(newEmail);
    } catch (error) {
      console.error('Error updating email:', error);
    } finally {
      setUpdatingEmail(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleRemoveFavorite = async (productId: string) => {
    await removeFromFavorites(productId);
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
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            ) : profileData ? (
              <AccountDashboard userData={profileData} />
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
                <p className="text-muted-foreground mb-6">Complete your profile to get personalized recommendations and track your orders.</p>
                <Button onClick={() => setTab('profile')}>Complete Your Profile</Button>
              </div>
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
                      
                      {/* Email field with update button */}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex gap-2">
                          <Input
                            id="email"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                          />
                          <Button 
                            type="button" 
                            onClick={handleEmailUpdate}
                            disabled={updatingEmail || newEmail === user.email}
                            className="whitespace-nowrap"
                          >
                            {updatingEmail ? (
                              <>
                                <span className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full mr-1"></span>
                                Updating...
                              </>
                            ) : (
                              <>
                                <Edit className="h-4 w-4 mr-1" />
                                Update Email
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          You'll be asked to verify your email address after updating.
                        </p>
                      </div>
                      
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
              
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : orders.length === 0 ? (
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
                              Placed on {formatDate(order.created_at)}
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
                          {(order.order_items || []).slice(0, 2).map((item: any) => (
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
                          {(order.order_items || []).length > 2 && (
                            <div className="p-4 text-sm text-muted-foreground text-center border-t">
                              +{(order.order_items || []).length - 2} more items
                            </div>
                          )}
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
              
              {favLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-square relative">
                        <Skeleton className="h-full w-full absolute inset-0" />
                      </div>
                      <CardContent className="p-4">
                        <Skeleton className="h-5 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-1/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : favorites.length === 0 ? (
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
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-square relative bg-muted">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.product_name} 
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="h-12 w-12 text-muted-foreground/40" />
                          </div>
                        )}
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
                          onClick={() => handleRemoveFavorite(item.product_id)}
                        >
                          <HeartOff className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1 line-clamp-1">{item.product_name}</h3>
                        <Price amount={item.price} />
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link to={`/product/${item.product_id}`}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex-none"
                          onClick={() => handleRemoveFavorite(item.product_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
