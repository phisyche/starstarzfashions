
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Minus, Plus, ShoppingCart, Check, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getImagePath } from '@/utils/image-utils';

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
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites, loading: favLoading } = useFavorites();
  const { toast } = useToast();
  const isFav = isFavorite(productId);

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    
    try {
      // Process the image path to ensure it's correct
      const processedImage = typeof image === 'string' ? getImagePath(image) : '';
      
      // Create a product object with all necessary properties
      const product = {
        name,
        price,
        image: processedImage,
        size: size || 'M',
        color: color || 'Default',
      };
      
      // Now call addItem with the correct parameters
      addItem(productId, quantity, product);
      
      // Show success state
      setTimeout(() => {
        setIsAdding(false);
        setIsAdded(true);
        
        // Reset to normal state after showing success
        setTimeout(() => {
          setIsAdded(false);
          setQuantity(1);
        }, 1500);
      }, 500);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        title: "Error",
        description: "There was a problem adding the item to your cart.",
        variant: "destructive"
      });
      setIsAdding(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFav) {
        await removeFromFavorites(productId);
      } else {
        const productData = {
          product_id: productId,
          product_name: name,
          price,
          image_url: typeof image === 'string' ? getImagePath(image) : '',
        };
        await addToFavorites(productData);
      }
    } catch (error) {
      console.error("Error managing favorites:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your favorites.",
        variant: "destructive"
      });
    }
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
            disabled={quantity <= 1 || isAdding || isAdded}
            aria-label="Decrease quantity"
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
            disabled={isAdding || isAdded}
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <Button
          onClick={handleToggleFavorite}
          variant="outline"
          size="icon"
          className="ml-2 h-9 w-9"
          disabled={favLoading}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-4 w-4 ${isFav ? 'fill-current text-pink-500' : ''}`} />
        </Button>
      </div>

      <Button 
        onClick={handleAddToCart}
        className={`w-full transition-all ${isAdded ? 'bg-green-600 hover:bg-green-700' : ''}`}
        disabled={isAdding || isAdded}
        aria-label={isAdded ? "Added to Cart" : "Add to Cart"}
      >
        {isAdded ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Added to Cart
          </>
        ) : isAdding ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  );
}
