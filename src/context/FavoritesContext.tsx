
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSupabase } from './SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Updated interface to match the database schema
export interface FavoriteItem {
  id: string;
  productId?: string; // For UI compatibility
  product_id: string; // For database compatibility
  name?: string; // For UI compatibility
  product_name: string; // For database compatibility
  price: number;
  image?: string; // For UI compatibility  
  image_url: string; // For database compatibility
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  loading: boolean;
  addToFavorites: (item: Omit<FavoriteItem, 'id'>) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  isInFavorites: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabase();
  const { toast } = useToast();

  // Load favorites when user changes
  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      if (user) {
        // Try to get favorites from the database if user is logged in
        const { data, error } = await supabase
          .from('favorite_items')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error loading favorites:', error);
          // If DB error, try to fall back to localStorage
          loadFavoritesFromLocalStorage();
        } else {
          // Map the database fields to our interface
          const mappedData = (data || []).map(item => ({
            id: item.id,
            productId: item.product_id,
            product_id: item.product_id,
            name: item.product_name,
            product_name: item.product_name,
            price: item.price,
            image: item.image_url,
            image_url: item.image_url
          }));
          
          setFavorites(mappedData);
          
          // Also save to localStorage as backup
          localStorage.setItem('favorites', JSON.stringify(mappedData));
        }
      } else {
        // If no user, load from localStorage
        loadFavoritesFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      loadFavoritesFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFavoritesFromLocalStorage = () => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (e) {
      console.error('Error loading favorites from localStorage:', e);
      setFavorites([]);
    }
  };

  const addToFavorites = async (item: Omit<FavoriteItem, 'id'>) => {
    try {
      // Format the item to match our interface
      const newFavoriteItem: Omit<FavoriteItem, 'id'> = {
        product_id: item.product_id || item.productId || '',
        product_name: item.product_name || item.name || '',
        price: item.price,
        image_url: item.image_url || item.image || '',
      };

      if (user) {
        // Add to database if user is logged in
        const { data, error } = await supabase
          .from('favorite_items')
          .insert({
            user_id: user.id,
            product_id: newFavoriteItem.product_id,
            product_name: newFavoriteItem.product_name,
            price: newFavoriteItem.price,
            image_url: newFavoriteItem.image_url
          })
          .select('*')
          .single();

        if (error) {
          throw error;
        }

        // Add the database-returned item (with ID) to favorites
        const mappedItem: FavoriteItem = {
          id: data.id,
          productId: data.product_id,
          product_id: data.product_id,
          name: data.product_name,
          product_name: data.product_name,
          price: data.price,
          image: data.image_url,
          image_url: data.image_url,
        };

        setFavorites(prev => [...prev, mappedItem]);
        
        // Update localStorage
        localStorage.setItem('favorites', JSON.stringify([...favorites, mappedItem]));
      } else {
        // Add to localStorage if not logged in
        const newItem: FavoriteItem = {
          ...newFavoriteItem,
          id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        };
        
        setFavorites(prev => [...prev, newItem]);
        localStorage.setItem('favorites', JSON.stringify([...favorites, newItem]));
      }

      toast({
        title: "Added to favorites",
        description: "Item has been added to your favorites"
      });
    } catch (error: any) {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Error",
        description: error.message || "Could not add to favorites",
        variant: "destructive"
      });
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      if (user) {
        // Remove from database if user is logged in
        const { error } = await supabase
          .from('favorite_items')
          .delete()
          .eq('product_id', productId)
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }
      }

      // Always update local state
      setFavorites(prev => prev.filter(item => 
        (item.product_id !== productId && item.productId !== productId)
      ));
      
      // Update localStorage
      localStorage.setItem('favorites', JSON.stringify(
        favorites.filter(item => (item.product_id !== productId && item.productId !== productId))
      ));

      toast({
        title: "Removed from favorites",
        description: "Item has been removed from your favorites"
      });
    } catch (error: any) {
      console.error('Error removing from favorites:', error);
      toast({
        title: "Error",
        description: error.message || "Could not remove from favorites",
        variant: "destructive"
      });
    }
  };

  const clearFavorites = async () => {
    try {
      if (user) {
        // Clear all favorites from database if user is logged in
        const { error } = await supabase
          .from('favorite_items')
          .delete()
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }
      }

      // Always clear local state
      setFavorites([]);
      localStorage.removeItem('favorites');

      toast({
        title: "Favorites cleared",
        description: "All items have been removed from your favorites"
      });
    } catch (error: any) {
      console.error('Error clearing favorites:', error);
      toast({
        title: "Error",
        description: error.message || "Could not clear favorites",
        variant: "destructive"
      });
    }
  };

  const isInFavorites = (productId: string) => {
    return favorites.some(item => 
      item.product_id === productId || item.productId === productId
    );
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        addToFavorites,
        removeFromFavorites,
        clearFavorites,
        isInFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  
  return context;
}
