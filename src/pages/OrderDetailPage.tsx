
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user || !id) return;
      
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
          .eq('user_id', user.id)
          .single();
          
        if (orderError) {
          console.error('Error fetching order:', orderError);
          // Fallback to mock data if no real order data
          if (id === 'ORD-001') {
            setOrder({
              id: 'ORD-001',
              created_at: new Date().toISOString(),
              status: 'delivered',
              payment_status: 'paid',
              total_amount: 2500,
              shipping_address: {
                line1: '123 Fashion Street',
                city: 'Style City',
                county: 'Design County',
                postal_code: '12345'
              },
              payment_method: 'mpesa',
              mpesa_reference: 'MP12345678',
              order_items: [
                {
                  id: 'ITEM-001',
                  product_name: 'Summer Dress',
                  price: 1200,
                  quantity: 1,
                  size: 'M',
                  color: 'Blue'
                },
                {
                  id: 'ITEM-002',
                  product_name: 'Casual Shoes',
                  price: 1300,
                  quantity: 1,
                  size: '40',
                  color: 'Black'
                }
              ]
            });
          } else if (id === 'ORD-002') {
            setOrder({
              id: 'ORD-002',
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'processing',
              payment_status: 'paid',
              total_amount: 4500,
              shipping_address: {
                line1: '456 Fashion Ave',
                city: 'Style City',
                county: 'Design County',
                postal_code: '12345'
              },
              payment_method: 'card',
              order_items: [
                {
                  id: 'ITEM-003',
                  product_name: 'Leather Bag',
                  price: 4500,
                  quantity: 1,
                  color: 'Brown'
                }
              ]
            });
          }
        } else if (orderData) {
          setOrder(orderData);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id, user]);

  if (!user) {
    return null;
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
                  {order.order_items.map((item) => (
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
                            ${(item.price / 100).toFixed(2)} each
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
                      <div>{order.shipping_address.line1}</div>
                      <div>{order.shipping_address.city}</div>
                      <div>{order.shipping_address.county}</div>
                      <div>{order.shipping_address.postal_code}</div>
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
