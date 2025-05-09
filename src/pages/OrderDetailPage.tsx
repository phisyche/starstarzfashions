
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/ui/price';
import { Package, ArrowLeft } from 'lucide-react';
import { useSupabase } from '@/context/SupabaseContext';
import { formatDate } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface OrderItem {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  total_amount: number;
  shipping_address: any;
  payment_method: string;
  mpesa_reference?: string;
  order_items: OrderItem[];
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrderDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Check if we have orders table in Supabase
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items(*)
          `)
          .eq('id', id)
          .single();
          
        if (orderError) {
          console.error('Error fetching order:', orderError);
          return;
        }
        
        if (orderData) {
          // Validate that this order belongs to the current user
          if (orderData.user_id !== user.id) {
            console.error('Unauthorized access to order');
            navigate('/account');
            return;
          }
          
          setOrder(orderData);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id, user, navigate]);

  if (!user) {
    return (
      <MainLayout>
        <div className="container py-8 max-w-4xl">
          <Alert>
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Please log in to view your order details.
            </AlertDescription>
          </Alert>
          <Button asChild className="mt-4">
            <Link to="/login">Log In</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8 max-w-4xl">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="container py-8 max-w-4xl">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or you don't have access to it.</p>
            <Button asChild>
              <Link to="/account">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Account
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'default'; // green
      case 'processing':
        return 'secondary'; // purple
      case 'shipped':
        return 'blue';
      case 'cancelled':
        return 'destructive'; // red
      default:
        return 'outline'; // gray
    }
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-4xl">
        {/* Back link */}
        <Button variant="link" className="mb-6 pl-0" asChild>
          <Link to="/account">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>

        {/* Order Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id}</h1>
            <p className="text-muted-foreground">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={getStatusColor(order.status) as any}>
              {order.status}
            </Badge>
            <Price amount={order.total_amount} className="text-lg font-bold" />
          </div>
        </div>

        {/* Order Details */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Items in your order</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {order.order_items && order.order_items.map((item) => (
                    <div key={item.id} className="p-4 flex items-center gap-4">
                      <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.product_name}</div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Quantity: {item.quantity}</div>
                          {item.size && <div>Size: {item.size}</div>}
                          {item.color && <div>Color: {item.color}</div>}
                        </div>
                      </div>
                      <div className="text-right">
                        <Price amount={item.price} />
                        {item.quantity > 1 && (
                          <div className="text-sm text-muted-foreground">
                            KES {item.price.toFixed(2)} each
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 flex justify-between">
                <div>Total</div>
                <Price amount={order.total_amount} className="font-bold" />
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <div className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {order.shipping_address && (
                    <address className="not-italic space-y-1">
                      <div>{order.shipping_address.first_name} {order.shipping_address.last_name}</div>
                      <div>{order.shipping_address.address}</div>
                      <div>{order.shipping_address.city}</div>
                      <div>{order.shipping_address.county}</div>
                      <div>{order.shipping_address.phone}</div>
                    </address>
                  )}
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-medium capitalize">{order.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <Badge variant={order.payment_status === 'paid' ? 'default' : 'outline'}>
                      {order.payment_status}
                    </Badge>
                  </div>
                  {order.mpesa_reference && (
                    <div className="flex justify-between">
                      <span>Reference:</span>
                      <span className="font-medium">{order.mpesa_reference}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Current Status:</span>
                      <Badge variant={getStatusColor(order.status) as any}>
                        {order.status}
                      </Badge>
                    </div>
                    {order.status === 'delivered' && (
                      <div className="text-sm text-muted-foreground mt-2">
                        Your order has been delivered. Thank you for shopping with us!
                      </div>
                    )}
                    {order.status === 'processing' && (
                      <div className="text-sm text-muted-foreground mt-2">
                        Your order is being processed. We'll update you when it ships.
                      </div>
                    )}
                    {order.status === 'shipped' && (
                      <div className="text-sm text-muted-foreground mt-2">
                        Your order has been shipped and is on its way to you!
                      </div>
                    )}
                    {order.status === 'pending' && (
                      <div className="text-sm text-muted-foreground mt-2">
                        Your order has been received and is pending processing.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
