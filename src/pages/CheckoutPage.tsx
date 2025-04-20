
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Price } from "@/components/ui/price";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { products } from "@/data/products";
import { useState } from "react";
import { Check, CreditCard, Info, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

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

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  const discount = 0; // Apply discounts if needed
  const shipping = shippingMethod === "standard" ? 300 : 500;
  const total = subtotal - discount + shipping;
  
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      window.location.href = "/order-confirmation";
    }, 2000);
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
            <form onSubmit={handleSubmitOrder}>
              {/* Customer Information */}
              <div className="bg-white rounded-lg border p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Customer Information</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required placeholder="Doe" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" required placeholder="john.doe@example.com" />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" required placeholder="07XX XXX XXX" />
                </div>
              </div>
              
              {/* Shipping Information */}
              <div className="bg-white rounded-lg border p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                
                <div className="mb-4">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" required placeholder="123 Main St" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="county">County</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a county" />
                      </SelectTrigger>
                      <SelectContent>
                        {counties.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="city">City/Town</Label>
                    <Input id="city" required placeholder="City/Town" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label>Shipping Method</Label>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="mt-2">
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
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="bg-white rounded-lg border p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                
                <Tabs defaultValue="mpesa" onValueChange={setPaymentMethod} className="w-full">
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
                      
                      <div>
                        <Label htmlFor="mpesa-number">M-Pesa Phone Number</Label>
                        <Input
                          id="mpesa-number"
                          required={paymentMethod === "mpesa"}
                          placeholder="07XX XXX XXX"
                          value={mpesaNumber}
                          onChange={(e) => setMpesaNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Card */}
                  <TabsContent value="card" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="card-number"
                            required={paymentMethod === "card"}
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            required={paymentMethod === "card"}
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            required={paymentMethod === "card"}
                            placeholder="123"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Your payment information is securely processed</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
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
              
              {/* Payment Methods & Security */}
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
