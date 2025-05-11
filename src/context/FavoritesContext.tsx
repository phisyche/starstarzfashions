
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSupabase } from './SupabaseContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FavoriteItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  price: number;
  image?: string;
  image_url?: string;
  category?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  loading: boolean;
  addToFavorites: (product: any) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: any) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabase();
  const { toast } = useToast();

  // Load favorites when user changes
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        // If no user, use local storage
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          try {
            setFavorites(JSON.parse(storedFavorites));
          } catch (e) {
            console.error('Error parsing stored favorites:', e);
            setFavorites([]);
          }
        } else {
          setFavorites([]);
        }
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Check if the favorite_items table exists
        const { error: checkError } = await supabase
          .from('favorite_items')
          .select('count')
          .limit(1)
          .single();

        if (checkError && checkError.code === '42P01') {
          // Table doesn't exist, use local storage instead
          const storedFavorites = localStorage.getItem('favorites');
          if (storedFavorites) {
            try {
              setFavorites(JSON.parse(storedFavorites));
            } catch (e) {
              console.error('Error parsing stored favorites:', e);
              setFavorites([]);
            }
          } else {
            setFavorites([]);
          }
          console.log("Favorite items table doesn't exist yet, using local storage");
        } else {
          // Table exists, fetch from database
          const { data, error } = await supabase
            .from('favorite_items')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            console.error('Error fetching favorites:', error);
            toast({
              title: 'Error',
              description: 'Failed to load your favorites.',
              variant: 'destructive',
            });
            setFavorites([]);
          } else {
            setFavorites(data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  // Save favorites to localStorage when not logged in
  useEffect(() => {
    if (!user && favorites.length > 0) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const addToFavorites = async (product: any) => {
    if (!product) return;

    // Create favorite item object
    const favoriteItem = {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      image_url: product.image || '',
      category: product.category || 'Uncategorized'
    };

    try {
      if (user) {
        // Save to Supabase
        const { data, error } = await supabase
          .from('favorite_items')
          .insert([{
            ...favoriteItem,
            user_id: user.id,
          }])
          .select()
          .single();

        if (error) {
          // Table might not exist, save to localStorage
          if (error.code === '42P01') {
            const newItem = {
              id: crypto.randomUUID(),
              user_id: user.id,
              ...favoriteItem
            };
            setFavorites(prev => [...prev, newItem]);
            localStorage.setItem('favorites', JSON.stringify([...favorites, newItem]));
          } else {
            console.error('Error adding to favorites:', error);
            toast({
              title: 'Error',
              description: 'Failed to add item to favorites.',
              variant: 'destructive',
            });
            return;
          }
        } else if (data) {
          // Successfully added to DB
          setFavorites(prev => [...prev, data]);
        }
      } else {
        // User not logged in, save to localStorage
        const newItem = {
          id: crypto.randomUUID(),
          user_id: 'guest',
          ...favoriteItem
        };
        setFavorites(prev => [...prev, newItem]);
      }

      toast({
        title: 'Added to Favorites',
        description: `${product.name} has been added to your favorites.`,
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to favorites.',
        variant: 'destructive',
      });
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      if (user) {
        try {
          // Remove from Supabase
          const { error } = await supabase
            .from('favorite_items')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId);

          if (error) {
            // If table doesn't exist, remove from local state
            if (error.code === '42P01') {
              setFavorites(prev => prev.filter(item => item.product_id !== productId));
              localStorage.setItem('favorites', JSON.stringify(favorites.filter(item => item.product_id !== productId)));
            } else {
              console.error('Error removing from favorites:', error);
              toast({
                title: 'Error',
                description: 'Failed to remove item from favorites.',
                variant: 'destructive',
              });
              return;
            }
          }
        } catch (error) {
          console.error('Error removing from Supabase:', error);
        }
      }

      // Update state regardless of whether we're using Supabase or localStorage
      setFavorites(prev => prev.filter(item => item.product_id !== productId));
      
      toast({
        title: 'Removed from Favorites',
        description: 'Item has been removed from your favorites.',
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from favorites.',
        variant: 'destructive',
      });
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(item => item.product_id === productId);
  };

  const toggleFavorite = async (product: any) => {
    if (isFavorite(product.id)) {
      await removeFromFavorites(product.id);
    } else {
      await addToFavorites(product);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
      }}
    >
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
