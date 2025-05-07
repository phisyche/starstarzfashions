import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity: number, product: any) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getItem: (productId: string) => CartItem | undefined;
  itemCount: number;
  calculateTotal: () => number;
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
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Get cart items from local storage on initial load
    const storedItems = localStorage.getItem('cartItems');
    return storedItems ? JSON.parse(storedItems) : [];
  });

  useEffect(() => {
    // Save cart items to local storage whenever the cart changes
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  // Add item to cart
  const addItem = (productId: string, quantity: number, product: any) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === productId);
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { productId, quantity, price: product.price, name: product.name, image: product.image }];
      }
    });
  };

  // Update quantity of item in cart
  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prevItems => {
      return prevItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
    });
  };

  // Remove item from cart
  const removeItem = (productId: string) => {
    setItems(prevItems => {
      return prevItems.filter(item => item.productId !== productId);
    });
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
