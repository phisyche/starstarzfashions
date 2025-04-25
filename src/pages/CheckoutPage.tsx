
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Price } from "@/components/ui/price";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/context/SupabaseContext";
import { products } from "@/data/products";
import { Check, CreditCard, Info, ShoppingBag } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { v4 as uuidv4 } from "uuid";

// Mock cart items
const cartItems = [
  {
    product: products[0],
    quantity: 1,
    size: "M",
    color: "Black",
  },
  {
    product: products[3],
    quantity: 2,
    size: "L",
    color: "Blue",
  },
];

const counties = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Nyeri", 
  "Machakos", "Malindi", "Thika", "Kitale", "Kericho"
];

// Form schema
const checkoutFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  county: z.string().min(1, "Please select a county"),
  city: z.string().min(2, "City must be at least 2 characters"),
  shippingMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["mpesa", "card"]),
  mpesaNumber: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // React Hook Form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      county: "",
      city: "",
      shippingMethod: "standard",
      paymentMethod: "mpesa",
      mpesaNumber: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
    },
  });
  
  // Watch form values
  const paymentMethod = form.watch("paymentMethod");
  const shippingMethod = form.watch("shippingMethod");
  
  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  const discount = 0; // Apply discounts if needed
  const shipping = shippingMethod === "standard" ? 300 : 500;
  const total = subtotal - discount + shipping;
  
  const handleSubmitOrder = async (data: CheckoutFormValues) => {
    setIsProcessing(true);
    
    try {
      // Generate unique order ID
      const orderId = uuidv4();
      
      // Create order in database
      const { error: orderError } = await supabase.from("orders").insert({
        id: orderId,
        status: "pending",
        total_amount: total,
        shipping_address: {
          first_name: data.firstName,
          last_name: data.lastName,
          address: data.address,
          city: data.city,
          county: data.county,
          phone: data.phone,
        },
        payment_method: data.paymentMethod,
        payment_status: "pending",
        created_at: new Date().toISOString(),
      });
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: orderId,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size,
        color: item.color,
      }));
      
      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Process payment based on payment method
      if (data.paymentMethod === "mpesa") {
        // Call Supabase Edge Function to process M-Pesa payment
        const { data: mpesaData, error: mpesaError } = await supabase.functions.invoke("process-mpesa-payment", {
          body: {
            phone: data.mpesaNumber,
            amount: total,
            orderId,
          },
        });
        
        if (mpesaError) throw mpesaError;
        
        // Show toast with payment instructions
        toast({
          title: "M-Pesa payment initiated",
          description: "Please check your phone and enter your M-Pesa PIN to complete payment",
          duration: 6000,
        });
      }
      
      // Redirect to order confirmation page
      setTimeout(() => {
        navigate("/order-confirmation", { 
          state: { 
            orderId, 
            paymentMethod: data.paymentMethod,
            total,
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: "Error processing order",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <div className="text-gray-600">
            Complete your order with secure checkout
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmitOrder)} id="checkout-form">
                {/* Customer Information */}
                <div className="bg-white rounded-lg border p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4">Customer Information</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="John" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Doe" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="john.doe@example.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="07XX XXX XXX" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Shipping Information */}
                <div className="bg-white rounded-lg border p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                  
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="123 Main St" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="county"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>County</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a county" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {counties.map((county) => (
                                <SelectItem key={county} value={county}>
                                  {county}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City/Town</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="City/Town" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="shippingMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Method</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="mt-2"
                            >
                              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                                <RadioGroupItem value="standard" id="standard" />
                                <Label htmlFor="standard" className="flex-1 cursor-pointer">
                                  <div className="font-medium">Standard Delivery</div>
                                  <div className="text-sm text-gray-500">2-4 business days</div>
                                </Label>
                                <span className="text-sm font-medium">KES 300</span>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 mt-2">
                                <RadioGroupItem value="express" id="express" />
                                <Label htmlFor="express" className="flex-1 cursor-pointer">
                                  <div className="font-medium">Express Delivery</div>
                                  <div className="text-sm text-gray-500">1-2 business days</div>
                                </Label>
                                <span className="text-sm font-medium">KES 500</span>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Payment Methods */}
                <div className="bg-white rounded-lg border p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Tabs
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="w-full"
                          >
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
                              <TabsTrigger value="card">Visa Card</TabsTrigger>
                            </TabsList>
                            
                            {/* M-Pesa */}
                            <TabsContent value="mpesa" className="mt-4">
                              <div className="space-y-4">
                                <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm flex gap-2">
                                  <Info className="h-5 w-5 flex-shrink-0" />
                                  <div>
                                    <p className="font-medium">How to pay with M-Pesa:</p>
                                    <ol className="list-decimal ml-4 mt-1 text-green-700">
                                      <li>Enter your M-Pesa registered phone number below.</li>
                                      <li>Complete your order by clicking "Place Order".</li>
                                      <li>You'll receive an M-Pesa prompt to complete payment.</li>
                                      <li>Enter your M-Pesa PIN to complete the transaction.</li>
                                    </ol>
                                  </div>
                                </div>
                                
                                <FormField
                                  control={form.control}
                                  name="mpesaNumber"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>M-Pesa Phone Number</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="07XX XXX XXX"
                                          disabled={paymentMethod !== "mpesa"}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </TabsContent>
                            
                            {/* Card */}
                            <TabsContent value="card" className="mt-4">
                              <div className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="cardNumber"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Card Number</FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <Input
                                            {...field}
                                            placeholder="1234 5678 9012 3456"
                                            disabled={paymentMethod !== "card"}
                                          />
                                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <CreditCard className="h-5 w-5 text-gray-400" />
                                          </div>
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name="cardExpiry"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Expiry Date</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            placeholder="MM/YY"
                                            disabled={paymentMethod !== "card"}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="cardCvv"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>CVV</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            placeholder="123"
                                            disabled={paymentMethod !== "card"}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <ShoppingBag className="h-4 w-4" />
                                  <span>Your payment information is securely processed</span>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Place Order Button (Mobile) */}
                <div className="lg:hidden">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Place Order - KES ${total}`
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium line-clamp-1">
                        {item.product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Qty: {item.quantity} • Size: {item.size}
                      </div>
                      <div className="mt-1">
                        <Price amount={item.product.price * item.quantity} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Edit Cart Link */}
              <div className="mb-6">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/cart">Edit Cart</Link>
                </Button>
              </div>
              
              {/* Price breakdown */}
              <div className="space-y-3 border-t pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <Price amount={subtotal} />
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-KES {discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <Price amount={shipping} />
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <Price amount={total} size="lg" />
                </div>
              </div>
              
              {/* Place Order Button (Desktop) */}
              <div className="hidden lg:block">
                <Button
                  type="submit"
                  form="checkout-form"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </div>
              
              {/* Payment Methods */}
              <div className="text-center text-sm text-gray-500 mt-4">
                Secure Checkout with 256-bit encryption
              </div>
              
              <div className="flex justify-center items-center gap-2 flex-wrap mt-2">
                <div className="bg-gray-100 rounded px-2 py-1 text-xs font-medium">M-PESA</div>
                <div className="bg-gray-100 rounded px-2 py-1 text-xs font-medium">VISA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
