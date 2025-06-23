
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSupabase } from './SupabaseContext';
import { useToast } from '@/components/ui/use-toast';

interface FavoriteItem {
  id: string;
  productId: string;
  product_id: string;
  name: string;
  product_name: string;
  price: number;
  image: string;
  image_url: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { supabase, user } = useSupabase();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load favorites from Supabase when user is available
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorite_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading favorites:', error);
        toast({
          title: "Error loading favorites",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (item: FavoriteItem) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      const favoriteData = {
        user_id: user.id,
        product_id: item.productId || item.product_id,
        product_name: item.name || item.product_name,
        price: item.price,
        image_url: item.image || item.image_url,
      };

      const { error } = await supabase
        .from('favorite_items')
        .insert(favoriteData);

      if (error) {
        console.error('Error adding to favorites:', error);
        toast({
          title: "Error adding to favorites",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Reload favorites to get the updated list
      await loadFavorites();
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Error adding to favorites",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorite_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing from favorites:', error);
        toast({
          title: "Error removing from favorites",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Reload favorites to get the updated list
      await loadFavorites();
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: "Error removing from favorites",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(item => 
      item.product_id === productId || item.productId === productId
    );
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
