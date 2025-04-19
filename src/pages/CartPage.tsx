
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

// Mock cart items for demonstration
const initialCartItems = [
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

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  
  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
  };
  
  const handleRemoveItem = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };
  
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim() === "KENYA20") {
      setPromoApplied(true);
    } else {
      setPromoApplied(false);
      alert("Invalid promo code. Try KENYA20 for 20% off.");
    }
  };
  
  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  const discount = promoApplied ? Math.round(subtotal * 0.2) : 0;
  const shipping = subtotal > 0 ? 300 : 0; // Free shipping above a certain threshold could be implemented
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
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Shopping Cart ({cartItems.length})</h2>
                    <Button variant="ghost" size="sm" className="gap-1 text-gray-600">
                      <ShoppingCart className="h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </div>
                </div>
                
                <div className="divide-y">
                  {cartItems.map((item, index) => (
                    <div key={index} className="p-6 flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                          <div>
                            <Link to={`/product/${item.product.slug}`} className="font-medium hover:text-primary transition-colors">
                              {item.product.name}
                            </Link>
                            <div className="text-sm text-gray-500 mt-1">
                              Size: {item.size} • Color: {item.color}
                            </div>
                            <div className="mt-2">
                              <Price amount={item.product.price} />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {/* Quantity Control */}
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleQuantityChange(index, item.quantity - 1)}
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
                                onClick={() => handleQuantityChange(index, item.quantity + 1)}
                                className="h-8 w-8 rounded-r-md rounded-l-none"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(index)}
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
                
                <Button asChild className="w-full mb-4">
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
        
        {/* You might also like */}
        {cartItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(4, 8).map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <Price amount={product.price} size="sm" className="mt-1" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
