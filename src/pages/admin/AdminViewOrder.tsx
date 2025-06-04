
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/context/SupabaseContext';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Order {
  id: string;
  user_id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  shipping_address: any;
  payment_method: string;
  mpesa_reference?: string;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  created_at: string;
}

export default function AdminViewOrder() {
  const { id } = useParams<{ id: string }>();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();
        
        if (orderError) throw orderError;
        
        setOrder(orderData);
        
        // Fetch order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', id);
        
        if (itemsError) throw itemsError;
        
        setOrderItems(itemsData || []);
        
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast({
          title: "Error loading order details",
          description: "Could not load the order information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id, supabase, toast]);
  
  const handleStatusUpdate = async (newStatus: string) => {
    if (!order || !id) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setOrder({ ...order, status: newStatus });
      
      toast({
        title: "Order updated",
        description: `Order status changed to ${newStatus}`,
      });
      
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Update failed",
        description: "Could not update the order status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit' 
    });
  };
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h3 className="mt-2">Loading order details...</h3>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Order not found</h2>
          <p className="mt-2">The requested order could not be found.</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/admin/orders')}
          >
            Back to Orders
          </Button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="ghost" 
              className="mb-2" 
              onClick={() => navigate('/admin/orders')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">
              Order ID: {order.id}
            </p>
          </div>
          
          {/* Order status section */}
          <div className="flex items-center space-x-4">
            <Badge className={`${getStatusColor(order.status)} text-white px-3 py-1 text-sm`}>
              {order.status.toUpperCase()}
            </Badge>
            <Badge className={`${getPaymentStatusColor(order.payment_status)} text-white px-3 py-1 text-sm`}>
              {order.payment_status.toUpperCase()}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order summary */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Placed on {formatDate(order.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <div className="text-sm text-muted-foreground">
                          <p>Quantity: {item.quantity}</p>
                          {item.size && <p>Size: {item.size}</p>}
                          {item.color && <p>Color: {item.color}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">KES {item.price.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          Total: KES {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>KES {orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>KES 350</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2">
                      <span>Total:</span>
                      <span>KES {order.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Payment information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="font-medium">{order.payment_method === 'mpesa' ? 'M-Pesa' : 'Card'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Status</p>
                      <p className="font-medium capitalize">{order.payment_status}</p>
                    </div>
                  </div>
                  
                  {order.mpesa_reference && (
                    <div>
                      <p className="text-sm text-muted-foreground">M-Pesa Reference</p>
                      <p className="font-medium">{order.mpesa_reference}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Customer information and actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">
                      {order.shipping_address.first_name} {order.shipping_address.last_name}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">{order.shipping_address.phone}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Shipping Address</p>
                    <div>
                      <p>{order.shipping_address.address}</p>
                      <p>{order.shipping_address.city}, {order.shipping_address.county}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.status !== 'processing' && (
                    <Button 
                      className="w-full" 
                      disabled={isUpdating} 
                      onClick={() => handleStatusUpdate('processing')}
                    >
                      {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Mark as Processing
                    </Button>
                  )}
                  
                  {order.status !== 'completed' && (
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      disabled={isUpdating} 
                      onClick={() => handleStatusUpdate('completed')}
                    >
                      {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Mark as Completed
                    </Button>
                  )}
                  
                  {order.status !== 'cancelled' && (
                    <Button 
                      className="w-full" 
                      variant="destructive" 
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate('cancelled')}
                    >
                      {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Cancel Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
