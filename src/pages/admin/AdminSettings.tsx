
import { useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { 
  Building, 
  CreditCard, 
  Globe, 
  Mail, 
  MessageSquare, 
  Phone, 
  Truck,
  ShieldCheck
} from 'lucide-react';

export default function AdminSettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const handleSave = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: 'Settings saved',
        description: 'Your settings have been saved successfully.',
      });
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your store settings and preferences
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>
                  Basic information about your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50">
                        <Building className="h-4 w-4 text-gray-400" />
                      </span>
                      <Input id="store-name" defaultValue="Star Starz Fashions" className="rounded-l-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-url">Store URL</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50">
                        <Globe className="h-4 w-4 text-gray-400" />
                      </span>
                      <Input id="store-url" defaultValue="https://starstarzfashions.com" className="rounded-l-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-email">Contact Email</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </span>
                      <Input id="store-email" defaultValue="contact@starstarzfashions.com" className="rounded-l-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-phone">Contact Phone</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </span>
                      <Input id="store-phone" defaultValue="+254 700 000000" className="rounded-l-none" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="store-address">Store Address</Label>
                  <Input id="store-address" defaultValue="Akai Plaza Ground Floor, Office No 2 At Rosters" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-city">City</Label>
                    <Input id="store-city" defaultValue="Nairobi" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-region">Region</Label>
                    <Input id="store-region" defaultValue="Nairobi County" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-postal">Postal Code</Label>
                    <Input id="store-postal" defaultValue="00100" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your store for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input id="meta-title" defaultValue="Star Starz Fashions | Quality Fashion for Everyone" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Input id="meta-description" defaultValue="Star Starz Fashions offers the latest trends in fashion for men and women. Shop quality clothing, accessories and footwear with fast delivery in Kenya." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meta-keywords">Meta Keywords</Label>
                  <Input id="meta-keywords" defaultValue="fashion, clothing, accessories, nairobi, kenya, online shopping" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Shipping Settings */}
          <TabsContent value="shipping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Methods</CardTitle>
                <CardDescription>
                  Configure shipping options for your customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <Truck className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Standard Delivery</p>
                        <p className="text-sm text-muted-foreground">2-3 business days</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Input type="number" defaultValue="200" className="w-24" />
                      <Switch defaultChecked id="standard-delivery" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <Truck className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Express Delivery</p>
                        <p className="text-sm text-muted-foreground">1 business day</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Input type="number" defaultValue="500" className="w-24" />
                      <Switch defaultChecked id="express-delivery" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <Truck className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Same Day Delivery</p>
                        <p className="text-sm text-muted-foreground">Available for Nairobi only</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Input type="number" defaultValue="800" className="w-24" />
                      <Switch id="same-day-delivery" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Payment Settings */}
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Configure payment options for your customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">M-Pesa</p>
                        <p className="text-sm text-muted-foreground">Mobile money payments</p>
                      </div>
                    </div>
                    <Switch defaultChecked id="mpesa" />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard, etc.</p>
                      </div>
                    </div>
                    <Switch id="card" />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <CreditCard className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when you receive</p>
                      </div>
                    </div>
                    <Switch defaultChecked id="cash" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure when and how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <ShieldCheck className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">New Order Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications when a new order is placed</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <Switch defaultChecked id="order-email" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                        <Switch defaultChecked id="order-sms" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Payment Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications when a payment is processed</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <Switch defaultChecked id="payment-email" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                        <Switch defaultChecked id="payment-sms" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <ShieldCheck className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Low Stock Alerts</p>
                        <p className="text-sm text-muted-foreground">Receive notifications when product stock is low</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <Switch defaultChecked id="stock-email" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                        <Switch id="stock-sms" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
