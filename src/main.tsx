
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SupabaseProvider } from '@/context/SupabaseContext'
import { CartProvider } from '@/context/CartContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { Toaster } from '@/components/ui/toaster'

createRoot(document.getElementById("root")!).render(
  <SupabaseProvider>
    <CartProvider>
      <FavoritesProvider>
        <App />
        <Toaster />
      </FavoritesProvider>
    </CartProvider>
  </SupabaseProvider>
);
