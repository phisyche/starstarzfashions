
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserDashboard } from '@/components/account/user-dashboard';
import { WishlistPage } from '@/components/account/WishlistPage';
import { useSupabase } from '@/context/SupabaseContext';
import { 
  User, 
  Heart, 
  Package, 
  Settings, 
  LogOut,
  MapPin,
  CreditCard,
  Bell
} from 'lucide-react';

function AccountDashboard() {
  const { user, signOut } = useSupabase();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/wishlist')) return 'wishlist';
    if (path.includes('/orders')) return 'orders';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/addresses')) return 'addresses';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user?.email}</CardTitle>
                    <Badge variant="secondary" className="text-xs">Member</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Tabs value={getActiveTab()} orientation="vertical" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent">
                    <TabsTrigger value="dashboard" asChild className="justify-start">
                      <Link to="/account" className="flex items-center gap-2 w-full">
                        <Package className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </TabsTrigger>
                    <TabsTrigger value="wishlist" asChild className="justify-start">
                      <Link to="/account/wishlist" className="flex items-center gap-2 w-full">
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Link>
                    </TabsTrigger>
                    <TabsTrigger value="orders" asChild className="justify-start">
                      <Link to="/account/orders" className="flex items-center gap-2 w-full">
                        <Package className="h-4 w-4" />
                        Orders
                      </Link>
                    </TabsTrigger>
                    <TabsTrigger value="profile" asChild className="justify-start">
                      <Link to="/account/profile" className="flex items-center gap-2 w-full">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </TabsTrigger>
                    <TabsTrigger value="addresses" asChild className="justify-start">
                      <Link to="/account/addresses" className="flex items-center gap-2 w-full">
                        <MapPin className="h-4 w-4" />
                        Addresses
                      </Link>
                    </TabsTrigger>
                    <TabsTrigger value="settings" asChild className="justify-start">
                      <Link to="/account/settings" className="flex items-center gap-2 w-full">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Routes>
              <Route index element={<UserDashboard />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="addresses" element={<AddressesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Placeholder components for other account pages
function OrdersPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">When you place orders, they'll appear here.</p>
            <Button asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfilePage() {
  const { user } = useSupabase();
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Member Since</label>
              <p className="text-gray-600">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AddressesPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No saved addresses</h3>
            <p className="text-gray-500 mb-6">Add addresses for faster checkout.</p>
            <Button>Add Address</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Manage your notification preferences.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Manage your saved payment methods.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AccountDashboard;
