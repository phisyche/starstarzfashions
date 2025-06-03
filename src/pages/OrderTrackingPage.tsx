
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { OrderTrackingMap } from '@/components/tracking/OrderTrackingMap';
import { useSupabase } from '@/context/SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  shipping_address: any;
  payment_method: string;
  payment_status: string;
  created_at: string;
}

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useSupabase();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/tracking/' + orderId);
      return;
    }

    if (!orderId) {
      navigate('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching order:', error);
          throw error;
        }

        if (!data) {
          setError('Order not found');
          return;
        }

        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container max-w-4xl py-16 flex flex-col items-center justify-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading order tracking...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <div className="container max-w-4xl py-16">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || 'Order not found. Please check your order ID.'}
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  // Mock tracking data - in a real app, this would come from your tracking service
  const deliveryAddress = {
    lat: -1.2921, // Default to Nairobi coordinates
    lng: 36.8219,
    address: order.shipping_address?.address || 'Delivery Address'
  };

  const currentLocation = {
    lat: -1.2800,
    lng: 36.8200,
    timestamp: new Date().toISOString(),
    status: order.status === 'completed' ? 'Delivered' : 'In Transit',
    description: order.status === 'completed' ? 'Package delivered successfully' : 'Package is on the way to your location'
  };

  const trackingHistory = [
    {
      lat: -1.2921,
      lng: 36.8219,
      timestamp: order.created_at,
      status: 'Order Placed',
      description: 'Your order has been confirmed and is being prepared'
    },
    {
      lat: -1.2850,
      lng: 36.8250,
      timestamp: new Date(Date.parse(order.created_at) + 24 * 60 * 60 * 1000).toISOString(),
      status: 'Processing',
      description: 'Your items are being packed and prepared for shipment'
    },
    {
      lat: -1.2800,
      lng: 36.8200,
      timestamp: new Date(Date.parse(order.created_at) + 48 * 60 * 60 * 1000).toISOString(),
      status: 'In Transit',
      description: 'Your package is on its way'
    }
  ];

  const estimatedDelivery = new Date(Date.parse(order.created_at) + 3 * 24 * 60 * 60 * 1000).toISOString();

  return (
    <MainLayout>
      <div className="container max-w-6xl py-8">
        <OrderTrackingMap
          orderId={order.id}
          deliveryAddress={deliveryAddress}
          currentLocation={currentLocation}
          trackingHistory={trackingHistory}
          estimatedDelivery={estimatedDelivery}
        />
      </div>
    </MainLayout>
  );
}
