import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useSupabase } from '@/context/SupabaseContext';
import { generateOrderId } from '@/lib/utils';
import { initiateMpesaPayment } from '@/services/mpesa';
import { initiateStripePayment } from '@/services/stripe';
import { initiateCardPayment } from '@/services/cardPayment';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle2, Loader2, CreditCard, Smartphone } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CreditCardForm, CreditCardData } from '@/components/checkout/CreditCardForm';

export default function CheckoutPage() {
  const { items: cartItems, clearCart, calculateTotal } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSupabase();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [cardData, setCardData] = useState<CreditCardData | null>(null);
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
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to proceed with checkout",
        variant: "destructive",
      });
      navigate('/login?redirect=/checkout');
      return;
    }
    
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    
    if (user) {
      const fetchUserProfile = async () => {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error('Error fetching profile:', error);
            return;
          }
            
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
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };
      
      fetchUserProfile();
    }
  }, [cartItems, navigate, user, toast]);

  const handleCreditCardSubmit = (creditCardData: CreditCardData) => {
    setCardData(creditCardData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to proceed with checkout",
        variant: "destructive",
      });
      navigate('/login?redirect=/checkout');
      return;
    }

    if (!formData.terms) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }

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

    if (formData.paymentMethod === 'card' && !cardData) {
      toast({
        title: "Card details required",
        description: "Please fill in your credit card details.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setPaymentStatus('processing');
    setPaymentError(null);
    
    try {
      const newOrderId = generateOrderId();
      setOrderId(newOrderId);
      
      const orderData = {
        id: newOrderId,
        user_id: user.id,
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
      
      const { error: orderError } = await supabase
        .from('orders')
        .insert(orderData);
        
      if (orderError) {
        throw new Error('Failed to create order: ' + orderError.message);
      }
      
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
      
      if (formData.paymentMethod === 'mpesa') {
        const mpesaResponse = await initiateMpesaPayment({
          phone: formData.phone,
          amount: calculateTotal(),
          orderId: newOrderId
        });
        
        if (mpesaResponse.success) {
          setPaymentStatus('success');
          toast({
            title: "M-Pesa payment initiated",
            description: "Please check your phone and enter your M-Pesa PIN to complete the payment.",
          });
          
          clearCart();
          navigate(`/order-confirmation?orderId=${newOrderId}`);
        } else {
          setPaymentStatus('error');
          setPaymentError(mpesaResponse.error || 'Failed to initiate M-Pesa payment');
        }
      } else if (formData.paymentMethod === 'stripe') {
        const stripeResponse = await initiateStripePayment({
          amount: calculateTotal(),
          orderId: newOrderId,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
        });
        
        if (stripeResponse.success && stripeResponse.sessionUrl) {
          setPaymentStatus('success');
          
          toast({
            title: "Redirecting to payment",
            description: "Complete your payment in the new tab that will open.",
          });
          
          window.open(stripeResponse.sessionUrl, '_blank');
          
          clearCart();
          navigate(`/order-confirmation?orderId=${newOrderId}`);
        } else {
          setPaymentStatus('error');
          setPaymentError(stripeResponse.error || 'Failed to initiate Stripe payment');
        }
      } else if (formData.paymentMethod === 'card' && cardData) {
        const cardResponse = await initiateCardPayment({
          amount: calculateTotal(),
          orderId: newOrderId,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          cardData: cardData,
        });
        
        if (cardResponse.success) {
          setPaymentStatus('success');
          toast({
            title: "Payment processed successfully",
            description: "Your order has been confirmed and you will receive a confirmation email.",
          });
          
          clearCart();
          navigate(`/order-confirmation?orderId=${newOrderId}`);
        } else {
          setPaymentStatus('error');
          setPaymentError(cardResponse.error || 'Failed to process card payment');
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setPaymentStatus('error');
      setPaymentError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container py-12">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Please log in to continue with checkout.
            </AlertDescription>
          </Alert>
          <Button asChild>
            <a href="/login?redirect=/checkout">Log In</a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="container py-12">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Empty Cart</AlertTitle>
            <AlertDescription>
              Your cart is empty. Add items to your cart before checking out.
            </AlertDescription>
          </Alert>
          <Button asChild>
            <a href="/shop">Continue Shopping</a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-500 mb-8">
            Review your order and complete your purchase
          </p>

          {paymentStatus === 'processing' && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500 mr-2" />
              <AlertTitle>Processing payment</AlertTitle>
              <AlertDescription>
                Please do not close this page. We are processing your payment.
                {formData.paymentMethod === 'mpesa' && " Check your phone for the M-Pesa PIN prompt."}
                {formData.paymentMethod === 'card' && " Your card is being processed."}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="order-2 lg:order-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded object-cover"
                              />
                              <div>
                                <p className="font-medium">{item.name}</p>
                                {item.size && item.color && (
                                  <p className="text-sm text-gray-500">
                                    {item.size} • {item.color}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            KES {(item.price * item.quantity).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={2} className="font-semibold">Total</TableCell>
                        <TableCell className="text-right font-semibold">
                          KES {calculateTotal().toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Checkout Form */}
            <div className="order-1 lg:order-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                    >
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="mpesa" id="mpesa" />
                        <Label htmlFor="mpesa" className="flex items-center space-x-2 flex-1 cursor-pointer">
                          <Smartphone className="h-5 w-5 text-green-600" />
                          <span>M-Pesa Mobile Money</span>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center space-x-2 flex-1 cursor-pointer">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          <span>Credit/Debit Card (Visa, Mastercard)</span>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <Label htmlFor="stripe" className="flex items-center space-x-2 flex-1 cursor-pointer">
                          <CreditCard className="h-5 w-5 text-purple-600" />
                          <span>Stripe Checkout</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Credit Card Form */}
                {formData.paymentMethod === 'card' && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Credit Card Details</h3>
                      <CreditCardForm onSubmit={handleCreditCardSubmit} />
                    </CardContent>
                  </Card>
                )}

                {/* Shipping Information */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="0712345678"
                          required
                        />
                        {formData.paymentMethod === 'mpesa' && (
                          <p className="text-xs text-gray-500 mt-1">
                            This number will receive the M-Pesa payment request
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Postal Code *</Label>
                          <Input
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.terms}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, terms: checked as boolean }))}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the <a href="/terms" className="text-blue-500 underline">Terms and Conditions</a>
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.terms}
                  className="w-full py-3"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {formData.paymentMethod === 'mpesa' && <Smartphone className="mr-2 h-4 w-4" />}
                      {(formData.paymentMethod === 'stripe' || formData.paymentMethod === 'card') && <CreditCard className="mr-2 h-4 w-4" />}
                      Complete Order - KES {calculateTotal().toLocaleString()}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
