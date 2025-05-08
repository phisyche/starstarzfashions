
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from './SupabaseContext';
import { supabase } from '@/integrations/supabase/client';

interface FavoriteItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  image: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (product: Omit<FavoriteItem, 'id'>) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useSupabase();

  // Load favorites from localStorage or database when the component mounts
  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        if (user) {
          // Fetch favorites from database for logged-in users
          const { data, error } = await supabase
            .from('favorite_items')
            .select('*')
            .eq('user_id', user.id);
            
          if (error) {
            throw error;
          }
          
          setFavorites(data || []);
        } else {
          // Load from localStorage for guests
          const storedFavorites = localStorage.getItem('favoriteItems');
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFavorites();
  }, [user]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!user) {
      localStorage.setItem('favoriteItems', JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const addToFavorites = async (product: Omit<FavoriteItem, 'id'>) => {
    setLoading(true);
    try {
      if (user) {
        // Add to database for logged-in users
        const { data, error } = await supabase
          .from('favorite_items')
          .insert({
            user_id: user.id,
            product_id: product.product_id,
            product_name: product.product_name,
            price: product.price,
            image_url: product.image
          })
          .select()
          .single();
          
        if (error) {
          throw error;
        }
        
        setFavorites(prev => [...prev, data as FavoriteItem]);
      } else {
        // Add to local state for guests
        const newFavorite = {
          id: crypto.randomUUID(),
          ...product
        };
        setFavorites(prev => [...prev, newFavorite]);
      }
      
      toast({
        title: 'Added to favorites',
        description: `${product.product_name} has been added to your favorites.`
      });
    } catch (error: any) {
      console.error('Error adding to favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to favorites.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (productId: string) => {
    setLoading(true);
    try {
      if (user) {
        // Remove from database for logged-in users
        const { error } = await supabase
          .from('favorite_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
          
        if (error) {
          throw error;
        }
      }
      
      // Remove from local state for all users
      setFavorites(prev => prev.filter(item => item.product_id !== productId));
      
      toast({
        title: 'Removed from favorites',
        description: 'The item has been removed from your favorites.'
      });
    } catch (error: any) {
      console.error('Error removing from favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from favorites.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(item => item.product_id === productId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loading
  };

  return (
    <FavoritesContext.Provider value={value}>
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
