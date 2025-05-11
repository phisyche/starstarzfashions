
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabase } from './SupabaseContext';
import { FavoriteItem } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';

interface FavoritesContextType {
  favorites: FavoriteItem[];
  loading: boolean;
  addToFavorites: (product: any) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: any) => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  const { user, supabase } = useSupabase();
  const { toast } = useToast();

  // Fetch favorites from Supabase or localStorage
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        
        if (user && supabase) {
          // Fetch favorites from database
          const { data, error } = await supabase
            .from('favorites')
            .select(`
              id,
              product_id,
              product_name,
              price,
              image_url
            `)
            .eq('user_id', user.id);
            
          if (error) {
            throw error;
          }
          
          // Transform to match FavoriteItem interface
          const transformedData = data.map(item => ({
            id: item.id,
            productId: item.product_id,
            product_id: item.product_id,
            name: item.product_name,
            product_name: item.product_name,
            price: item.price,
            image: item.image_url,
            image_url: item.image_url
          }));
          
          setFavorites(transformedData);
        } else {
          // Get from localStorage if not authenticated
          const storedFavorites = localStorage.getItem('favoriteItems');
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [user, supabase]);

  // Update localStorage when favorites change
  useEffect(() => {
    if (!user) {
      localStorage.setItem('favoriteItems', JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // Add a product to favorites
  const addToFavorites = async (product: any) => {
    try {
      const favoriteItem: FavoriteItem = {
        id: `${Date.now()}`,
        productId: product.id,
        product_id: product.id,
        name: product.name,
        product_name: product.name,
        price: product.price,
        image: product.image,
        image_url: product.image
      };
      
      if (user && supabase) {
        // Add to database
        const { data, error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: product.id,
            product_name: product.name,
            price: product.price,
            image_url: product.image
          })
          .select('id')
          .single();
          
        if (error) {
          throw error;
        }
        
        // Update id with the one from the database
        favoriteItem.id = data.id;
      }
      
      // Update state
      setFavorites(prev => [...prev, favoriteItem]);
      
      toast({
        title: 'Added to favorites',
        description: `${product.name} has been added to your favorites.`
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to favorites.',
        variant: 'destructive'
      });
    }
  };

  // Remove a product from favorites
  const removeFromFavorites = async (productId: string) => {
    try {
      if (user && supabase) {
        // Remove from database
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
          
        if (error) {
          throw error;
        }
      }
      
      // Update state
      setFavorites(prev => prev.filter(item => item.productId !== productId && item.product_id !== productId));
      
      toast({
        title: 'Removed from favorites',
        description: 'Item has been removed from your favorites.'
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from favorites.',
        variant: 'destructive'
      });
    }
  };

  // Check if a product is in favorites
  const isFavorite = (productId: string): boolean => {
    return favorites.some(item => item.productId === productId || item.product_id === productId);
  };

  // Toggle favorite status
  const toggleFavorite = async (product: any) => {
    if (isFavorite(product.id)) {
      await removeFromFavorites(product.id);
    } else {
      await addToFavorites(product);
    }
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      loading,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      toggleFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
