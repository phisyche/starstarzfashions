
// import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'
// import { SupabaseProvider } from '@/context/SupabaseContext'
// import { CartProvider } from '@/context/CartContext'
// import { FavoritesProvider } from '@/context/FavoritesContext'
// import { Toaster } from '@/components/ui/toaster'

// createRoot(document.getElementById("root")!).render(
//   <SupabaseProvider>
//     <CartProvider>
//       <FavoritesProvider>
//         <App />
//         <Toaster />
//       </FavoritesProvider>
//     </CartProvider>
//   </SupabaseProvider>
// );
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SupabaseProvider } from '@/context/SupabaseContext'
import { CartProvider } from '@/context/CartContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { Toaster } from '@/components/ui/toaster'

// Import React Query dependencies
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a QueryClient instance
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <SupabaseProvider>
      <CartProvider>
        <FavoritesProvider>
          <App />
          <Toaster />
        </FavoritesProvider>
      </CartProvider>
    </SupabaseProvider>
  </QueryClientProvider>
);
