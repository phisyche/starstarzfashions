
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSupabase } from './SupabaseContext';

export interface FavoriteItem {
  id?: string;
  product_id: string;
  product_name: string;
  price: number;
  image_url: string;
  user_id?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  loading: boolean;
  addToFavorites: (item: Omit<FavoriteItem, 'id'>) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useSupabase();

  // Load favorites from Supabase or localStorage
  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        if (user) {
          // If user is authenticated, load favorites from Supabase
          const { data, error } = await supabase
            .from('favorite_items')
            .select('*')
            .eq('user_id', user.id);
            
          if (error) throw error;
          setFavorites(data || []);
        } else {
          // If not authenticated, load from localStorage
          const storedFavorites = localStorage.getItem('favorites');
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        }
      } catch (error: any) {
        console.error('Error loading favorites:', error);
        toast({
          title: "Error loading favorites",
          description: error.message || "Could not load your favorites",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadFavorites();
  }, [user, toast]);
  
  // Save favorites to localStorage when they change
  useEffect(() => {
    if (!user) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, user]);
  
  // Check if a product is in favorites
  const isFavorite = (productId: string): boolean => {
    return favorites.some(item => item.product_id === productId);
  };
  
  // Add item to favorites
  const addToFavorites = async (item: Omit<FavoriteItem, 'id'>) => {
    setLoading(true);
    try {
      if (user) {
        // If user is authenticated, add to Supabase
        const { data, error } = await supabase
          .from('favorite_items')
          .insert({
            ...item,
            user_id: user.id
          })
          .select()
          .single();
        
        if (error) throw error;
        
        setFavorites(prev => [...prev, data]);
      } else {
        // If not authenticated, add to local state
        const newItem = {
          ...item,
          id: Date.now().toString(),
        };
        setFavorites(prev => [...prev, newItem as FavoriteItem]);
      }
      
      toast({
        title: "Added to favorites",
        description: `${item.product_name} has been added to your favorites`,
      });
    } catch (error: any) {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Error",
        description: error.message || "Could not add to favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Remove item from favorites
  const removeFromFavorites = async (productId: string) => {
    setLoading(true);
    try {
      if (user) {
        // If user is authenticated, remove from Supabase
        const { error } = await supabase
          .from('favorite_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        
        if (error) throw error;
      }
      
      // Remove from local state 
      setFavorites(prev => prev.filter(item => item.product_id !== productId));
      
      toast({
        title: "Removed from favorites",
        description: "Item has been removed from your favorites",
      });
    } catch (error: any) {
      console.error('Error removing from favorites:', error);
      toast({
        title: "Error",
        description: error.message || "Could not remove from favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh favorites from the backend
  const refreshFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorite_items')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      setFavorites(data || []);
    } catch (error: any) {
      console.error('Error refreshing favorites:', error);
      toast({
        title: "Error",
        description: error.message || "Could not refresh favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      loading, 
      addToFavorites, 
      removeFromFavorites, 
      refreshFavorites,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
