
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSupabase } from './SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface FavoriteItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (product: any) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useSupabase();
  const { toast } = useToast();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        
        if (user) {
          // Load from database if user is logged in
          try {
            const { data, error } = await supabase
              .from('favorite_items')
              .select('*')
              .eq('user_id', user.id);

            if (error) {
              console.error('Error loading favorites:', error);
              // Fall back to localStorage
              const storedFavorites = localStorage.getItem('favoriteItems');
              const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
              setFavorites(parsedFavorites);
              return;
            }
            
            if (data) {
              const formattedFavorites: FavoriteItem[] = data.map(item => ({
                id: item.id,
                productId: item.product_id,
                name: item.product_name,
                price: Number(item.price),
                image: item.image_url || '',
              }));
              setFavorites(formattedFavorites);
            }
          } catch (error) {
            console.error('Error loading favorites from database:', error);
            // Fall back to localStorage
            const storedFavorites = localStorage.getItem('favoriteItems');
            const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
            setFavorites(parsedFavorites);
          }
        } else {
          // Load from localStorage if no user is logged in
          const storedFavorites = localStorage.getItem('favoriteItems');
          const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
          setFavorites(parsedFavorites);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('favoriteItems', JSON.stringify(favorites));
    }
  }, [favorites, loading]);

  const addToFavorites = async (product: any) => {
    try {
      const newItem: FavoriteItem = {
        id: uuidv4(),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      };

      // If user is logged in, save to database
      if (user) {
        const { error } = await supabase.from('favorite_items').insert({
          id: newItem.id,
          user_id: user.id,
          product_id: newItem.productId,
          product_name: newItem.name,
          price: newItem.price,
          image_url: newItem.image,
        });

        if (error) {
          console.error('Error adding favorite to database:', error);
          toast({
            title: 'Error',
            description: 'Could not add item to favorites',
            variant: 'destructive',
          });
          return;
        }
      }

      setFavorites(prev => [...prev, newItem]);
      
      toast({
        title: 'Added to Favorites',
        description: `${product.name} has been added to your favorites`,
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        title: 'Error',
        description: 'Could not add item to favorites',
        variant: 'destructive',
      });
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      const itemToRemove = favorites.find(item => item.productId === productId);
      
      if (!itemToRemove) {
        return;
      }

      // If user is logged in, remove from database
      if (user) {
        const { error } = await supabase
          .from('favorite_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) {
          console.error('Error removing favorite from database:', error);
        }
      }

      setFavorites(prev => prev.filter(item => item.productId !== productId));
      
      toast({
        title: 'Removed from Favorites',
        description: `Item has been removed from your favorites`,
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: 'Error',
        description: 'Could not remove item from favorites',
        variant: 'destructive',
      });
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(item => item.productId === productId);
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
