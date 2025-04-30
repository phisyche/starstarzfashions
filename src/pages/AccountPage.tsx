
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogOut, Package, Settings, CreditCard, User, Heart, ShoppingBag, Edit, Trash2, Camera, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSupabase } from "@/context/SupabaseContext";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";

// Mock orders for demonstration - will be replaced with real orders from Supabase
const orders = [
  {
    id: "KF837492",
    date: "April 15, 2025",
    status: "Delivered",
    total: 7800,
    items: [
      {
        name: "Kitenge Print Maxi Dress",
        quantity: 1,
        price: 4500,
      },
      {
        name: "African Print Slim Fit Shirt",
        quantity: 1,
        price: 3300,
      },
    ],
  },
  {
    id: "KF726153",
    date: "March 28, 2025",
    status: "Processing",
    total: 4200,
    items: [
      {
        name: "Ankara Peplum Top",
        quantity: 1,
        price: 2800,
      },
      {
        name: "Traditional Beaded Necklace",
        quantity: 1,
        price: 1400,
      },
    ],
  },
];

export default function AccountPage() {
  const { user, supabase, signOut } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { favorites } = useCart();
  
  // Profile info state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Fetch user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !supabase) return;
      
      setIsLoading(true);
      
      try {
        // Fetch profile data from Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setPhone(data.phone_number || "");
          setEmail(user.email || "");
          setAvatarUrl(data.avatar_url || "");
        }
      } catch (error) {
        toast({
          title: "Error fetching profile",
          description: "We couldn't load your profile information.",
          variant: "destructive"
        });
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, supabase, toast]);
  
  // Update profile information
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !supabase) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone_number: phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "We couldn't update your profile. Please try again.",
        variant: "destructive"
      });
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Update password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    
    // Validate password match
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate password complexity
    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully."
      });
      
      // Reset password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "We couldn't update your password. Please try again.",
        variant: "destructive"
      });
      console.error("Error updating password:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user || !supabase) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    setIsUpdating(true);
    
    try {
      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const avatarUrl = publicUrlData.publicUrl;
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      setAvatarUrl(avatarUrl);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "We couldn't update your profile picture. Please try again.",
        variant: "destructive"
      });
      console.error("Error updating avatar:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle logout
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account"
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // If user is not logged in, redirect to login
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);
  
  if (!user) {
    return <MainLayout>
      <div className="container py-12 text-center">
        <div className="animate-spin h-8 w-8 border-t-2 border-primary mx-auto mb-4 rounded-full"></div>
        <p>Checking authentication status...</p>
      </div>
    </MainLayout>;
  }
  
  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <div className="text-gray-600">
            Manage your account, orders, and preferences
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Tabs defaultValue="orders" className="w-full">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64">
              <div className="bg-white rounded-lg border shadow-sm p-6 sticky top-24">
                <div className="flex flex-col items-center gap-3 mb-6">
                  <div className="relative group">
                    <Avatar className="w-20 h-20 border-2 border-primary">
                      <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
                      <AvatarFallback className="text-lg bg-primary/20">
                        {firstName && lastName ? `${firstName[0]}${lastName[0]}` : user.email?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <label 
                      htmlFor="avatar-upload" 
                      className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="h-4 w-4" />
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarUpload}
                        disabled={isUpdating}
                      />
                    </label>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-lg">{firstName} {lastName}</div>
                    <div className="text-sm text-gray-500">{email}</div>
                  </div>
                </div>
                
                <TabsList className="flex flex-col w-full space-y-1 h-auto bg-transparent">
                  <TabsTrigger value="orders" className="w-full justify-start px-3 h-10 data-[state=active]:bg-primary/10">
                    <Package className="h-4 w-4 mr-2" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="w-full justify-start px-3 h-10 data-[state=active]:bg-primary/10">
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                    {favorites.length > 0 && (
                      <Badge variant="secondary" className="ml-2">{favorites.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="w-full justify-start px-3 h-10 data-[state=active]:bg-primary/10">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="addresses" className="w-full justify-start px-3 h-10 data-[state=active]:bg-primary/10">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Addresses
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="w-full justify-start px-3 h-10 data-[state=active]:bg-primary/10">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <Separator className="my-4" />
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Orders Tab */}
              <TabsContent value="orders" className="mt-0">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingBag className="mr-2 h-5 w-5 text-primary" /> 
                      My Orders
                    </CardTitle>
                    <CardDescription>
                      View and manage your order history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-gray-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <div className="font-medium">Order #{order.id}</div>
                                <div className="text-sm text-gray-500">{order.date}</div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className={`text-sm font-medium px-2 py-1 rounded ${
                                  order.status === "Delivered" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-blue-100 text-blue-800"
                                }`}>
                                  {order.status}
                                </div>
                                <Button asChild size="sm" variant="outline">
                                  <Link to={`/account/orders/${order.id}`}>View Details</Link>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="space-y-3 mb-4">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex justify-between">
                                    <div>
                                      <span className="font-medium">{item.quantity}x</span> {item.name}
                                    </div>
                                    <div>KES {item.price}</div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between font-medium border-t pt-3">
                                <div>Total</div>
                                <div>KES {order.total}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                        <p className="text-gray-600 mb-4">
                          You haven't placed any orders yet. Start shopping to see your orders here.
                        </p>
                        <Button asChild>
                          <Link to="/shop">Start Shopping</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Favorites Tab */}
              <TabsContent value="favorites" className="mt-0">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="mr-2 h-5 w-5 text-red-500" />
                      My Favorites
                    </CardTitle>
                    <CardDescription>
                      Products you've saved to your favorites
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {favorites.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favorites.map((item) => (
                          <div key={item.id} className="border rounded-md overflow-hidden group">
                            <div className="relative aspect-square overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute top-2 right-2">
                                <Button 
                                  size="icon" 
                                  variant="destructive"
                                  className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => useCart().removeFromFavorites(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium truncate">{item.name}</h3>
                              <div className="flex items-center justify-between mt-2">
                                <div className="font-semibold">KES {item.price}</div>
                                <Link to={`/product/${item.productId}`}>
                                  <Button size="sm" variant="outline">View Product</Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                        <p className="text-gray-600 mb-4">
                          You haven't added any products to your favorites yet.
                        </p>
                        <Button asChild>
                          <Link to="/shop">Explore Products</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-0">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5 text-primary" />
                      My Profile
                    </CardTitle>
                    <CardDescription>
                      Manage your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handleUpdateProfile}>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            disabled
                            className="bg-gray-50"
                          />
                          <p className="text-xs text-gray-500 mt-1">Contact support to change your email address</p>
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g., +254 712 345 678"
                          />
                        </div>
                        
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? (
                            <>
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                              Saving...
                            </>
                          ) : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium text-lg mb-4">Change Password</h3>
                      <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                          <Label htmlFor="current-password">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="current-password"
                              type={showPassword.current ? "text" : "password"}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
                            >
                              {showPassword.current ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="new-password">New Password</Label>
                          <div className="relative">
                            <Input
                              id="new-password"
                              type={showPassword.new ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                            >
                              {showPassword.new ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Password must be at least 8 characters long
                          </p>
                        </div>
                        
                        <div>
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirm-password"
                              type={showPassword.confirm ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                            >
                              {showPassword.confirm ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? (
                            <>
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                              Updating...
                            </>
                          ) : "Update Password"}
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Addresses Tab */}
              <TabsContent value="addresses" className="mt-0">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-primary" />
                      My Addresses
                    </CardTitle>
                    <CardDescription>
                      Manage your shipping and billing addresses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* Default Address Card */}
                      <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="font-medium">Default Address</div>
                          <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Default</div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                          <p>{firstName} {lastName}</p>
                          <p>123 Main Street</p>
                          <p>Nairobi, Kenya</p>
                          <p>Phone: {phone || "0712 345 678"}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-1">
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      {/* Add New Address Card */}
                      <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                          <span className="text-xl text-primary">+</span>
                        </div>
                        <h3 className="font-medium mb-2">Add New Address</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Add a new delivery address for faster checkout
                        </p>
                        <Button size="sm">Add Address</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-0">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="mr-2 h-5 w-5 text-primary" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Email Notifications</div>
                            <div className="text-sm text-gray-600">
                              Receive emails about your orders and account activity
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">SMS Notifications</div>
                            <div className="text-sm text-gray-600">
                              Receive text messages about your orders
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Marketing Communications</div>
                            <div className="text-sm text-gray-600">
                              Receive updates on new products and special offers
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-4">Language & Currency</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="language">Language</Label>
                          <select
                            id="language"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            defaultValue="en"
                          >
                            <option value="en">English</option>
                            <option value="sw">Swahili</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="currency">Currency</Label>
                          <select
                            id="currency"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            defaultValue="kes"
                          >
                            <option value="kes">Kenyan Shilling (KES)</option>
                            <option value="usd">US Dollar (USD)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium text-red-600 mb-4">Delete Account</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Deleting your account will permanently remove all your personal information, order history, and saved addresses.
                        This action cannot be undone.
                      </p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
}
