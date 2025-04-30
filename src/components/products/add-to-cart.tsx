
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface AddToCartProps {
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  className?: string;
}

export const AddToCart: React.FC<AddToCartProps> = ({
  productId,
  name,
  price,
  image,
  size,
  color,
  className,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    
    addItem({
      productId,
      name,
      price,
      image,
      quantity,
      size,
      color,
    });
    
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1); // Reset quantity after adding
    }, 500);
  };

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="border border-gray-300 rounded-md flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-10 text-center">{quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none"
            onClick={increaseQuantity}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Button 
        onClick={handleAddToCart}
        className="w-full"
        disabled={isAdding}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isAdding ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  );
};
