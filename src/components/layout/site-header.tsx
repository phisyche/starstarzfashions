
// Note: We can't modify this file directly as it's in the read-only list,
// so we'll create a new component to handle cart functionality

import React from 'react';
import { useCart } from '@/context/CartContext';

export const CartIndicator: React.FC = () => {
  const { itemCount } = useCart();
  
  return (
    <>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </>
  );
};
