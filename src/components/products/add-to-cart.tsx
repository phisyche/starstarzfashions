
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { MinusIcon, PlusIcon, ShoppingCart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export interface AddToCartProps {
  productId: string;
  className?: string;
}

export function AddToCart({ productId, className = '' }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(productId, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} item${quantity > 1 ? 's' : ''} added to your cart.`,
    });
  };

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <label htmlFor="quantity" className="mr-3 font-medium">
          Quantity:
        </label>
        <div className="flex items-center border rounded-md">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={decreaseQuantity} 
            disabled={quantity <= 1}
            className="h-10 w-10"
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center">{quantity}</span>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={increaseQuantity}
            className="h-10 w-10"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button onClick={handleAddToCart} className="w-full">
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
    </div>
  );
}
