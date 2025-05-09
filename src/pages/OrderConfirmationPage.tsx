
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Check, Package, ShoppingBag, Truck, AlertCircle, Loader2 } from "lucide-react";
import { useSupabase } from '@/context/SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { checkMpesaTransactionStatus } from "@/services/mpesa";

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useSupabase();
  const orderId = searchParams.get('orderId');
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/order-confirmation' + (orderId ? `?orderId=${orderId}` : ''));
      return;
    }
    
    if (!orderId) {
      navigate('/');
      return;
    }
    
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', orderId)
          .single();
          
        if (error) {
          console.error('Error fetching order:', error);
          throw error;
        }
        
        if (!data) {
          throw new Error('Order not found');
        }
        
        setOrder(data);
        
        // Check payment status for M-Pesa payments
        if (data.payment_method === 'mpesa' && data.payment_status === 'pending') {
          setCheckingPayment(true);
          
          // Get the M-Pesa transaction for this order
          const { data: txnData, error: txnError } = await supabase
            .from('mpesa_transactions')
            .select('checkout_request_id')
            .eq('order_id', orderId)
            .single();
            
          if (!txnError && txnData?.checkout_request_id) {
            // Start polling for payment status
            const checkoutRequestId = txnData.checkout_request_id;
            const checkPaymentInterval = setInterval(async () => {
              try {
                // First check direct from DB
                const { data: updatedOrder } = await supabase
                  .from('orders')
                  .select('payment_status')
                  .eq('id', orderId)
                  .single();
                  
                if (updatedOrder && updatedOrder.payment_status === 'paid') {
                  clearInterval(checkPaymentInterval);
                  setCheckingPayment(false);
                  setOrder(prev => ({ ...prev, payment_status: 'paid' }));
                  return;
                }
                
                // Then check transaction status service
                const statusResult = await checkMpesaTransactionStatus(checkoutRequestId);
                if (statusResult.paid) {
                  clearInterval(checkPaymentInterval);
                  setCheckingPayment(false);
                  setOrder(prev => ({ ...prev, payment_status: 'paid' }));
                }
              } catch (checkError) {
                console.error('Error checking payment status:', checkError);
              }
            }, 5000); // Check every 5 seconds
            
            return () => {
              clearInterval(checkPaymentInterval);
              setCheckingPayment(false);
            };
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Could not load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, navigate, user]);

  if (!user) {
    return (
      <MainLayout>
        <div className="container py-12">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Please log in to view your order details.
            </AlertDescription>
          </Alert>
          <Button asChild className="mt-4">
            <Link to={`/login?redirect=/order-confirmation${orderId ? `?orderId=${orderId}` : ''}`}>
              Log In
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container max-w-3xl py-16 flex flex-col items-center justify-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <div className="container max-w-3xl py-16">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || "Order not found. Please check your order ID."}
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <Button asChild>
              <Link to="/shop">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-3xl py-16">
        <div className="bg-white rounded-lg border p-8 text-center">
          {order.payment_method === 'mpesa' && order.payment_status === 'pending' ? (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              
              <h1 className="text-3xl font-bold mb-2">Payment Processing</h1>
              <p className="text-gray-600 mb-6">
                We're waiting for confirmation of your M-Pesa payment. Please check your phone and enter your PIN if prompted.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <div className="text-sm text-gray-600 mb-1">Order Number</div>
                <div className="text-xl font-bold">{order.id}</div>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                This page will automatically update once your payment is confirmed. Please do not close this page.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <div className="text-sm text-gray-600 mb-1">Order Number</div>
                <div className="text-xl font-bold">{order.id}</div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">What's Next?</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <ShoppingBag className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-medium">Order Processing</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      We're preparing your items for shipping. You'll receive an email with the details.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Package className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-medium">Order Packed</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your items are carefully packed and ready to be shipped to your location.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Truck className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-medium">Order Delivery</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your package will be delivered to your address within 2-4 business days.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <p>
                  A confirmation email has been sent to your email address.
                </p>
                <p>
                  If you have any questions about your order, please contact our customer service team.
                </p>
              </div>
            </>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/shop">
                Continue Shopping
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={`/account/orders/${order.id}`}>
                View Order Details
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
