
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/use-toast";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };
  
  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };
  
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim() === "KENYA20") {
      setPromoApplied(true);
      toast({
        title: "Promo code applied",
        description: "20% discount has been applied to your order.",
      });
    } else {
      setPromoApplied(false);
      toast({
        title: "Invalid promo code",
        description: "Try KENYA20 for 20% off your order.",
        variant: "destructive",
      });
    }
  };
  
  // Calculate totals
  const discount = promoApplied ? Math.round(subtotal * 0.2) : 0;
  const shipping = subtotal > 0 ? 300 : 0;
  const total = subtotal - discount + shipping;
  
  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">Your Shopping Cart</h1>
          <div className="text-gray-600">
            Review your items and proceed to checkout
          </div>
        </div>
      </div>

      <div className="container py-8">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Shopping Cart ({items.length})</h2>
                    <Button variant="ghost" size="sm" className="gap-1 text-gray-600" asChild>
                      <Link to="/shop">
                        <ShoppingCart className="h-4 w-4" />
                        Continue Shopping
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                          <div>
                            <Link to={`/product/${item.productId}`} className="font-medium hover:text-primary transition-colors">
                              {item.name}
                            </Link>
                            <div className="text-sm text-gray-500 mt-1">
                              {item.size && item.color && `Size: ${item.size} • Color: ${item.color}`}
                            </div>
                            <div className="mt-2">
                              <Price amount={item.price} />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {/* Quantity Control */}
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 rounded-l-md rounded-r-none"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <div className="h-8 w-12 flex items-center justify-center border-y border-input">
                                {item.quantity}
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="h-8 w-8 rounded-r-md rounded-l-none"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg border p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <Price amount={subtotal} />
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (KENYA20)</span>
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
                
                {/* Promo Code */}
                <div className="mb-6">
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" variant="outline">
                      Apply
                    </Button>
                  </form>
                  <div className="text-xs text-gray-500 mt-2">
                    Try "KENYA20" for 20% off your order
                  </div>
                </div>
                
                <Button asChild className="w-full mb-4" disabled={items.length === 0}>
                  <Link to="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>
                
                <div className="text-center text-sm text-gray-500 mb-4">
                  Secure Checkout with 256-bit encryption
                </div>
                
                <div className="flex justify-center items-center gap-2 flex-wrap">
                  <div className="bg-gray-100 rounded px-2 py-1 text-xs font-medium">M-PESA</div>
                  <div className="bg-gray-100 rounded px-2 py-1 text-xs font-medium">VISA</div>
                  <div className="bg-gray-100 rounded px-2 py-1 text-xs font-medium">MASTERCARD</div>
                  <div className="bg-gray-100 rounded px-2 py-1 text-xs font-medium">AIRTEL MONEY</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
