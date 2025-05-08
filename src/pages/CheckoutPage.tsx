
import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { useSupabase } from '@/context/SupabaseContext';
import { generateOrderId } from '@/lib/utils';
import { initiateMpesaPayment } from '@/services/mpesa';
import { supabase } from '@/integrations/supabase/client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { products } from "@/data/products";
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function CheckoutPage() {
  const { items: cartItems, clearCart, calculateTotal } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSupabase();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Kenya',
    paymentMethod: 'mpesa',
    terms: false,
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    
    // Pre-fill user data if available
    if (user) {
      const fetchUserProfile = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profile) {
          setFormData(prev => ({
            ...prev,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            email: profile.email || user.email || '',
            phone: profile.phone || '',
            address: profile.address?.line1 || '',
            city: profile.address?.city || '',
            postalCode: profile.address?.postal_code || '',
            country: profile.address?.country || 'Kenya',
          }));
        }
      };
      
      fetchUserProfile();
    }
  }, [cartItems, navigate, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      terms: checked
    }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.terms) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number for M-Pesa
    if (formData.paymentMethod === 'mpesa') {
      const phoneRegex = /^(?:254|\+254|0)?[17][0-9]{8}$/;
      if (!phoneRegex.test(formData.phone)) {
        toast({
          title: "Invalid phone number",
          description: "Please enter a valid Kenyan phone number for M-Pesa payments.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    setPaymentStatus('processing');
    
    try {
      // Generate a unique order ID
      const newOrderId = generateOrderId();
      setOrderId(newOrderId);
      
      // Create the order in the database
      const orderData = {
        id: newOrderId,
        user_id: user?.id || null,
        status: 'pending',
        total_amount: calculateTotal(),
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address: formData.address,
          city: formData.city,
          county: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        payment_method: formData.paymentMethod,
        payment_status: 'pending',
        created_at: new Date().toISOString(),
      };
      
      // Create order in database
      const { error: orderError } = await supabase
        .from('orders')
        .insert(orderData);
        
      if (orderError) {
        throw new Error('Failed to create order: ' + orderError.message);
      }
      
      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: newOrderId,
        product_id: item.productId,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size || null,
        color: item.color || null,
      }));
      
      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (orderItemsError) {
        throw new Error('Failed to create order items: ' + orderItemsError.message);
      }
      
      // Process payment based on selected method
      if (formData.paymentMethod === 'mpesa') {
        // Initiate M-Pesa STK Push
        const mpesaResponse = await initiateMpesaPayment({
          phone: formData.phone,
          amount: calculateTotal(),
          orderId: newOrderId
        });
        
        if (mpesaResponse.success) {
          toast({
            title: "M-Pesa payment initiated",
            description: "Please check your phone and enter your M-Pesa PIN to complete the payment.",
          });
          
          // Clear cart and redirect to order confirmation page
          clearCart();
          navigate(`/order-confirmation?orderId=${newOrderId}`);
        } else {
          setPaymentStatus('error');
          setPaymentError(mpesaResponse.error || 'Failed to initiate M-Pesa payment');
          toast({
            title: "Payment failed",
            description: mpesaResponse.error || 'Failed to initiate M-Pesa payment. Please try again.',
            variant: "destructive",
          });
        }
      } else if (formData.paymentMethod === 'card') {
        // For now, we'll simulate a successful card payment
        // In a real-world scenario, you would integrate with a card payment provider
        setTimeout(() => {
          // Update order status
          supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              status: 'processing',
            })
            .eq('id', newOrderId);
            
          // Clear cart and redirect to order confirmation page
          clearCart();
          setPaymentStatus('success');
          toast({
            title: "Payment successful",
            description: "Thank you for your order! You will receive an email with the details.",
          });
          navigate(`/order-confirmation?orderId=${newOrderId}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setPaymentStatus('error');
      setPaymentError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return null; // or a message indicating the cart is empty
  }

  return (
    <MainLayout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-500 mb-8">
          Please review your order and enter your details below.
        </p>

        {paymentStatus === 'processing' && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500 mr-2" />
            <AlertTitle>Processing payment</AlertTitle>
            <AlertDescription>
              Please do not close this page. We are processing your payment.
              {formData.paymentMethod === 'mpesa' && " Check your phone for the M-Pesa PIN prompt."}
            </AlertDescription>
          </Alert>
        )}
        
        {paymentStatus === 'error' && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment failed</AlertTitle>
            <AlertDescription>
              {paymentError || "There was a problem processing your payment. Please try again."}
            </AlertDescription>
          </Alert>
        )}
        
        {paymentStatus === 'success' && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Payment successful</AlertTitle>
            <AlertDescription>
              Thank you for your order! You will be redirected to the confirmation page.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <Card className="mb-4">
              <CardContent className="p-4">
                <Table>
                  <TableCaption>Your order items</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => {
                      const product = products.find(p => p.id === item.productId);
                      if (!product) return null;

                      return (
                        <TableRow key={item.productId}>
                          <TableCell className="font-medium">
                            <div className="w-16 h-16 rounded overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            KES {(product.price * item.quantity).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total</TableCell>
                      <TableCell className="text-right">
                        KES {calculateTotal().toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>

            <Accordion type="single" collapsible>
              <AccordionItem value="payment">
                <AccordionTrigger className="text-xl font-semibold">Payment Method</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mpesa"
                        checked={formData.paymentMethod === 'mpesa'}
                        onCheckedChange={() => handlePaymentMethodChange('mpesa')}
                      />
                      <label
                        htmlFor="mpesa"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        M-Pesa (Mobile Money)
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="card"
                        checked={formData.paymentMethod === 'card'}
                        onCheckedChange={() => handlePaymentMethodChange('card')}
                      />
                      <label
                        htmlFor="card"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Visa / MasterCard
                      </label>
                    </div>
                    
                    {formData.paymentMethod === 'mpesa' && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm">
                        <p className="font-medium mb-2">M-Pesa Payment Information:</p>
                        <ul className="list-disc pl-4 space-y-1 text-gray-600">
                          <li>Enter your phone number in the form</li>
                          <li>You'll receive a payment prompt on your phone</li>
                          <li>Enter your M-PESA PIN to complete the payment</li>
                          <li>The payment will be processed to PayBill: 4108307</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Shipping Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number {formData.paymentMethod === 'mpesa' && <span className="text-red-500">*</span>}
                </label>
                <Input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 0712345678"
                  className="mt-1"
                />
                {formData.paymentMethod === 'mpesa' && (
                  <p className="text-xs text-gray-500 mt-1">
                    This number will receive the M-Pesa payment request
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <Input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                    Postal Code
                  </label>
                  <Input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <Input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <Separator className="my-4" />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.terms}
                  onCheckedChange={handleCheckboxChange}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the <a href="/terms" className="text-blue-500 underline">terms and conditions</a>
                </label>
              </div>

              <Button disabled={isSubmitting} type="submit" className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Order'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
