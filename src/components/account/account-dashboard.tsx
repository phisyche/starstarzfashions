
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ShoppingBag, Heart, Package, User, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for demo purposes
const recentOrdersMock = [
  { 
    id: 'ORD-2456', 
    date: '2025-05-05', 
    status: 'Delivered', 
    amount: 12500 
  },
  { 
    id: 'ORD-2455', 
    date: '2025-05-01', 
    status: 'Processing', 
    amount: 4500 
  }
];

const wishlistItemsMock = [
  { 
    id: 'PROD-001', 
    name: 'Designer Dress', 
    price: 8500,
    inStock: true 
  },
  { 
    id: 'PROD-002', 
    name: 'Leather Bag', 
    price: 12000,
    inStock: true 
  },
  { 
    id: 'PROD-003', 
    name: 'Summer Sandals', 
    price: 3500,
    inStock: false 
  }
];

interface AccountDashboardProps {
  userData: any;
}

export function AccountDashboard({ userData }: AccountDashboardProps) {
  const fullName = userData ? 
    `${userData.first_name || ''} ${userData.last_name || ''}`.trim() : 
    'User';
    
  // Calculate loyalty points (mock)
  const loyaltyPoints = 250;
  const nextTierPoints = 500;
  const loyaltyProgress = (loyaltyPoints / nextTierPoints) * 100;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Welcome & Stats */}
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Welcome back, {fullName}!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Loyalty Points</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{loyaltyPoints}</span>
                  <span className="text-sm text-muted-foreground">points</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Current</span>
                    <span>Silver Member</span>
                  </div>
                  <Progress value={loyaltyProgress} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span>{loyaltyPoints} pts</span>
                    <span>Gold: {nextTierPoints} pts</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground">Orders</span>
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl font-semibold mt-2">2</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground">Wishlist</span>
                    <Heart className="h-4 w-4 text-pink-500" />
                  </div>
                  <p className="text-2xl font-semibold mt-2">3</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground">Reviews</span>
                    <Package className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-2xl font-semibold mt-2">1</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground">Coupons</span>
                    <CreditCard className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-2xl font-semibold mt-2">2</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col mt-6">
              <h4 className="text-sm font-medium mb-2">Complete your profile - 60%</h4>
              <Progress value={60} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                Add a profile picture and complete your preferences to get personalized recommendations.
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full md:w-auto">
                Complete Profile
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Special Offers */}
        <Card className="w-full md:w-80">
          <CardHeader className="bg-pink-500 text-white">
            <CardTitle className="text-lg">Special Offers</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="border border-dashed border-primary/50 p-3 rounded-md">
                <div className="font-semibold">WELCOME10</div>
                <p className="text-sm text-muted-foreground">10% off your next purchase</p>
                <div className="text-xs mt-1">Expires: 2025-06-10</div>
                <Button size="sm" variant="outline" className="w-full mt-2">
                  Copy Code
                </Button>
              </div>
              
              <div className="border border-dashed border-primary/50 p-3 rounded-md">
                <div className="font-semibold">BDAY2025</div>
                <p className="text-sm text-muted-foreground">Special birthday discount</p>
                <div className="text-xs mt-1">Expires: On your birthday</div>
                <Button size="sm" variant="outline" className="w-full mt-2">
                  Copy Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <Link to="/account/orders" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrdersMock.length > 0 ? (
                recentOrdersMock.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">KSh {order.amount.toLocaleString()}</div>
                      <div className={`text-xs ${
                        order.status === 'Delivered' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No recent orders
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Wishlist Preview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Wishlist</CardTitle>
              <Link to="/account/wishlist" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wishlistItemsMock.length > 0 ? (
                wishlistItemsMock.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className={`text-xs ${
                        item.inStock ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">KSh {item.price.toLocaleString()}</div>
                      <Button size="sm" variant="outline" className="mt-1">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Your wishlist is empty
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Product Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommended for You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({length: 4}).map((_, i) => (
              <div key={i} className="rounded-md overflow-hidden border">
                <div className="h-32 bg-muted flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <div className="p-3">
                  <div className="font-medium text-sm line-clamp-1">Recommended Product {i + 1}</div>
                  <div className="text-sm mt-1">KSh {(Math.floor(Math.random() * 10000) + 1000).toLocaleString()}</div>
                  <Button size="sm" variant="outline" className="w-full mt-2 h-7 text-xs">
                    View Product
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
