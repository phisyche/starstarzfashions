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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { products } from "@/data/products";

export default function CheckoutPage() {
  const { cart, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'credit-card',
    terms: false,
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

    setIsSubmitting(true);
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear cart and navigate to success page
      clearCart();
      toast({
        title: "Order confirmed",
        description: "Thank you for your order! You will receive an email with the details.",
      });
      navigate('/order-confirmation');
    } catch (error) {
      console.error("Error during checkout:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return null; // or a message indicating the cart is empty
  }

  return (
    <MainLayout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-500 mb-8">
          Please review your order and enter your details below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <Card className="mb-4">
              <CardContent className="p-4">
                <Table>
                  <TableCaption>A list of your recent invoices.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => {
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
                        KES {getTotalPrice().toLocaleString()}
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
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="credit-card"
                        name="paymentMethod"
                        value="credit-card"
                        checked={formData.paymentMethod === 'credit-card'}
                        onChange={handleChange}
                      />
                      <label
                        htmlFor="credit-card"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Credit Card
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="paypal"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleChange}
                      />
                      <label
                        htmlFor="paypal"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        PayPal
                      </label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Shipping Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
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
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the <a href="/terms" className="text-blue-500 underline">terms and conditions</a>
                </label>
              </div>

              <Button disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Processing...' : 'Confirm Order'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
