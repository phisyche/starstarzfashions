
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from './SupabaseContext';
import { v4 as uuidv4 } from 'uuid';
import { from } from '@/integrations/supabase/client';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface FavoriteItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  dateAdded: string;
}

interface CartContextType {
  items: CartItem[];
  favorites: FavoriteItem[];
  itemCount: number;
  favoriteCount: number;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  addToFavorites: (item: Omit<FavoriteItem, 'id' | 'dateAdded'>) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (productId: string) => boolean;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, supabase } = useSupabase();

  // Calculate total number of items in cart
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  // Calculate number of favorites
  const favoriteCount = favorites.length;
  
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
    
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Load cart and favorites from Supabase if user is logged in
  useEffect(() => {
    const syncWithDatabase = async () => {
      if (!user || !supabase) return;
      
      setIsLoading(true);
      
      try {
        // Fetch cart items from database
        const { data: cartData, error: cartError } = await from('cart_items')
          .select('*')
          .eq('user_id', user.id);
          
        if (cartError) {
          console.error('Error fetching cart items:', cartError);
        } else if (cartData && cartData.length > 0) {
          // If there are items in the database, use those
          setItems(cartData.map(item => ({
            id: item.id,
            productId: item.product_id,
            name: item.product_name,
            price: Number(item.price),
            image: item.image_url || '',
            quantity: item.quantity,
            size: item.size || undefined,
            color: item.color || undefined
          })));
        }
        
        // Fetch favorite items from database
        const { data: favData, error: favError } = await from('favorite_items')
          .select('*')
          .eq('user_id', user.id);
          
        if (favError) {
          console.error('Error fetching favorite items:', favError);
        } else if (favData && favData.length > 0) {
          // If there are favorites in the database, use those
          setFavorites(favData.map(item => ({
            id: item.id,
            productId: item.product_id,
            name: item.product_name,
            price: Number(item.price),
            image: item.image_url || '',
            dateAdded: item.created_at || new Date().toISOString()
          })));
        }
      } catch (error) {
        console.error('Error syncing with database:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    syncWithDatabase();
  }, [user, supabase]);

  // Sync cart with database when it changes
  useEffect(() => {
    const syncCartToDatabase = async () => {
      if (!user || !supabase) return;
      
      try {
        if (items.length === 0) {
          // If cart is empty, delete all items for this user
          const { error: deleteError } = await from('cart_items')
            .delete()
            .eq('user_id', user.id);
            
          if (deleteError) {
            console.error('Error deleting cart items:', deleteError);
          }
          return;
        }
        
        // First, delete all existing cart items for this user
        const { error: deleteError } = await from('cart_items')
          .delete()
          .eq('user_id', user.id);
          
        if (deleteError) {
          console.error('Error deleting cart items:', deleteError);
          return;
        }
        
        // Then, insert all current cart items
        const { error: insertError } = await from('cart_items')
          .insert(items.map(item => ({
            id: item.id,
            user_id: user.id,
            product_id: item.productId,
            product_name: item.name,
            price: item.price,
            image_url: item.image,
            quantity: item.quantity,
            size: item.size,
            color: item.color
          })));
          
        if (insertError) {
          console.error('Error inserting cart items:', insertError);
        }
      } catch (error) {
        console.error('Error syncing cart to database:', error);
      }
    };
    
    if (user) {
      syncCartToDatabase();
    }
  }, [items, user, supabase]);

  // Sync favorites with database when they change
  useEffect(() => {
    const syncFavoritesToDatabase = async () => {
      if (!user || !supabase) return;
      
      try {
        if (favorites.length === 0) {
          // If favorites are empty, delete all items for this user
          const { error: deleteError } = await from('favorite_items')
            .delete()
            .eq('user_id', user.id);
            
          if (deleteError) {
            console.error('Error deleting favorite items:', deleteError);
          }
          return;
        }
        
        // First, delete all existing favorite items for this user
        const { error: deleteError } = await from('favorite_items')
          .delete()
          .eq('user_id', user.id);
          
        if (deleteError) {
          console.error('Error deleting favorite items:', deleteError);
          return;
        }
        
        // Then, insert all current favorite items
        const { error: insertError } = await from('favorite_items')
          .insert(favorites.map(item => ({
            id: item.id,
            user_id: user.id,
            product_id: item.productId,
            product_name: item.name,
            price: item.price,
            image_url: item.image,
            created_at: item.dateAdded
          })));
          
        if (insertError) {
          console.error('Error inserting favorite items:', insertError);
        }
      } catch (error) {
        console.error('Error syncing favorites to database:', error);
      }
    };
    
    if (user) {
      syncFavoritesToDatabase();
    }
  }, [favorites, user, supabase]);

  // Add item to cart
  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    setItems(currentItems => {
      // Check if item already exists in cart
      const existingItemIndex = currentItems.findIndex(
        item => item.productId === newItem.productId && 
               item.size === newItem.size && 
               item.color === newItem.color
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        
        toast({
          title: "Cart updated",
          description: `${newItem.name} quantity increased to ${updatedItems[existingItemIndex].quantity}`,
        });
        
        return updatedItems;
      } else {
        // Add new item if it doesn't exist
        const itemWithId = {
          ...newItem,
          id: uuidv4()
        };
        
        toast({
          title: "Added to cart",
          description: `${newItem.name} added to your cart`,
        });
        
        return [...currentItems, itemWithId];
      }
    });
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.id === id);
      if (itemToRemove) {
        toast({
          title: "Removed from cart",
          description: `${itemToRemove.name} removed from your cart`,
        });
      }
      return currentItems.filter(item => item.id !== id);
    });
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(currentItems => {
      return currentItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };
  
  // Add to favorites
  const addToFavorites = (item: Omit<FavoriteItem, 'id' | 'dateAdded'>) => {
    setFavorites(currentFavorites => {
      // Check if item already exists in favorites
      const existingItem = currentFavorites.find(
        favorite => favorite.productId === item.productId
      );
      
      if (existingItem) {
        toast({
          title: "Already in favorites",
          description: `${item.name} is already in your favorites`,
        });
        return currentFavorites;
      } else {
        // Add new item if it doesn't exist
        const favoriteWithId = {
          ...item,
          id: uuidv4(),
          dateAdded: new Date().toISOString()
        };
        
        toast({
          title: "Added to favorites",
          description: `${item.name} added to your favorites`,
        });
        
        return [...currentFavorites, favoriteWithId];
      }
    });
  };
  
  // Remove from favorites
  const removeFromFavorites = (id: string) => {
    setFavorites(currentFavorites => {
      const itemToRemove = currentFavorites.find(item => item.id === id);
      if (itemToRemove) {
        toast({
          title: "Removed from favorites",
          description: `${itemToRemove.name} removed from your favorites`,
        });
      }
      return currentFavorites.filter(item => item.id !== id);
    });
  };
  
  // Check if product is in favorites
  const isFavorite = (productId: string) => {
    return favorites.some(item => item.productId === productId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        favorites,
        itemCount,
        favoriteCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isLoading,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
