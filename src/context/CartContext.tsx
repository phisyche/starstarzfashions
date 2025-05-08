
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSupabase } from './SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  size?: string;
  color?: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity: number, product: any) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getItem: (productId: string) => CartItem | undefined;
  itemCount: number;
  calculateTotal: () => number;
  subtotal: number;
}

export const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
  getItem: () => undefined,
  itemCount: 0,
  calculateTotal: () => 0,
  subtotal: 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useSupabase();
  const { toast } = useToast();

  // Load cart items when user changes
  useEffect(() => {
    const loadCartItems = async () => {
      if (user) {
        // User is logged in, get cart from database
        try {
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            console.error('Error loading cart:', error);
            // Fall back to local storage
            const storedItems = localStorage.getItem('cartItems');
            setItems(storedItems ? JSON.parse(storedItems) : []);
            return;
          }
          
          if (data) {
            // Transform from database format to our CartItem format
            const cartItems: CartItem[] = data.map(item => ({
              id: item.id,
              productId: item.product_id,
              quantity: item.quantity,
              price: Number(item.price),
              name: item.product_name,
              image: item.image_url || '',
              size: item.size || undefined,
              color: item.color || undefined
            }));
            setItems(cartItems);
          }
        } catch (error) {
          console.error('Error loading cart:', error);
          // Fall back to local storage
          const storedItems = localStorage.getItem('cartItems');
          setItems(storedItems ? JSON.parse(storedItems) : []);
        }
      } else {
        // No user logged in, use local storage
        const storedItems = localStorage.getItem('cartItems');
        setItems(storedItems ? JSON.parse(storedItems) : []);
      }
    };

    loadCartItems();
  }, [user]);

  // Save cart items when they change
  useEffect(() => {
    const saveCartItems = async () => {
      // Always save to local storage as a fallback
      localStorage.setItem('cartItems', JSON.stringify(items));
      
      // If user is logged in, also save to database
      if (user && items.length > 0) {
        // We don't want to await this operation to avoid blocking the UI
        // This is fire-and-forget style, but we log errors if any
        try {
          // First, get existing cart items to compare
          const { data: existingItems } = await supabase
            .from('cart_items')
            .select('id')
            .eq('user_id', user.id);

          const existingIds = existingItems?.map(item => item.id) || [];
          const currentIds = items.map(item => item.id);
          
          // Find items to delete (in existingIds but not in currentIds)
          const idsToDelete = existingIds.filter(id => !currentIds.includes(id));
          
          if (idsToDelete.length > 0) {
            await supabase
              .from('cart_items')
              .delete()
              .in('id', idsToDelete);
          }

          // Upsert current items
          for (const item of items) {
            await supabase
              .from('cart_items')
              .upsert({
                id: item.id,
                user_id: user.id,
                product_id: item.productId,
                product_name: item.name,
                price: item.price,
                quantity: item.quantity,
                image_url: item.image,
                size: item.size || null,
                color: item.color || null
              });
          }
        } catch (error) {
          console.error('Error saving cart to database:', error);
          // We continue even if there's an error saving to DB
          // since we've already saved to localStorage
        }
      }
    };

    // Skip initial render
    if (items.length > 0) {
      saveCartItems();
    }
  }, [items, user]);

  // Add item to cart
  const addItem = (productId: string, quantity: number, product: any) => {
    console.log("Adding to cart:", productId, quantity, product);
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === productId);
      
      if (existingItem) {
        toast({
          title: "Item updated",
          description: `Updated quantity of ${product.name} in your cart`,
        });
        
        return prevItems.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart`,
        });
        
        return [...prevItems, { 
          id: uuidv4(), // Generate unique ID for cart item
          productId, 
          quantity, 
          price: product.price, 
          name: product.name, 
          image: product.image,
          size: product.size,
          color: product.color
        }];
      }
    });
  };

  // Update quantity of item in cart
  const updateQuantity = (itemId: string, quantity: number) => {
    setItems(prevItems => {
      return prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
    });
  };

  // Remove item from cart
  const removeItem = (itemId: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === itemId);
      
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.name} has been removed from your cart`,
        });
      }
      
      return prevItems.filter(item => item.id !== itemId);
    });
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
    
    // If user is logged in, also clear from database
    if (user) {
      supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) console.error('Error clearing cart from database:', error);
        });
    }
  };

  // Get item from cart
  const getItem = (productId: string) => {
    return items.find(item => item.productId === productId);
  };

  // Calculate total price of items in cart
  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get total number of items in cart
  const itemCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return calculateTotal();
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        getItem,
        itemCount,
        calculateTotal,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
