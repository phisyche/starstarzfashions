
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, LogOut, Package, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

// Mock orders for demonstration
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
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("0712 345 678");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update
    alert("Profile updated successfully");
  };
  
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password update
    alert("Password updated successfully");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
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
              <div className="bg-white rounded-lg border p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{firstName} {lastName}</div>
                    <div className="text-sm text-gray-500">{email}</div>
                  </div>
                </div>
                
                <TabsList className="flex flex-col w-full space-y-1 h-auto bg-transparent">
                  <TabsTrigger value="orders" className="w-full justify-start px-3 h-10">
                    <Package className="h-4 w-4 mr-2" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="w-full justify-start px-3 h-10">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="addresses" className="w-full justify-start px-3 h-10">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Addresses
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="w-full justify-start px-3 h-10">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <Separator className="my-4" />
                
                <Button variant="ghost" className="w-full justify-start text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Orders Tab */}
              <TabsContent value="orders" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>My Orders</CardTitle>
                    <CardDescription>
                      View and manage your order history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg overflow-hidden">
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
                        <Package className="h-10 w-10 text-gray-400 mx-auto mb-4" />
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
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>My Profile</CardTitle>
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
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                        
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium text-lg mb-4">Change Password</h3>
                      <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input
                            id="current-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="new-password">New Password</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        
                        <Button type="submit">Update Password</Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Addresses Tab */}
              <TabsContent value="addresses" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>My Addresses</CardTitle>
                    <CardDescription>
                      Manage your shipping and billing addresses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* Default Address Card */}
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">Default Address</div>
                          <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Default</div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                          <p>John Doe</p>
                          <p>123 Main Street</p>
                          <p>Nairobi, Kenya</p>
                          <p>Phone: 0712 345 678</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                        </div>
                      </div>
                      
                      {/* Add New Address Card */}
                      <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                          <span className="text-xl">+</span>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
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
