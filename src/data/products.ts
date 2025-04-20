
import { ProductType } from "@/components/products/product-card";

export const products: ProductType[] = [
  {
    id: "1",
    name: "Ankara Print Maxi Dress",
    price: 4500,
    originalPrice: 5500,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Women's Dresses",
    isNew: true,
    isFeatured: true,
    slug: "ankara-print-maxi-dress"
  },
  {
    id: "2",
    name: "Kente Peplum Top",
    price: 2800,
    originalPrice: 3500,
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Women's Tops",
    isFeatured: true,
    slug: "kente-peplum-top"
  },
  {
    id: "3",
    name: "African Print Scarf",
    price: 1200,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    isNew: true,
    slug: "african-print-scarf"
  },
  {
    id: "4",
    name: "Kitenge Print Shirt",
    price: 3200,
    originalPrice: 3800,
    image: "https://images.unsplash.com/photo-1578932750294-f5075e85f702?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Men's Shirts",
    isFeatured: true,
    slug: "kitenge-print-shirt"
  },
  {
    id: "5",
    name: "Beaded Necklace",
    price: 1800,
    image: "https://images.unsplash.com/photo-1576689560324-1f4f28ca6716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Jewelry",
    slug: "beaded-necklace"
  },
  {
    id: "6",
    name: "Ankara Print Skirt",
    price: 2500,
    image: "https://images.unsplash.com/photo-1533659828870-95ee305cee3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Women's Bottoms",
    slug: "ankara-print-skirt"
  },
  {
    id: "7",
    name: "African Print Headwrap",
    price: 1500,
    originalPrice: 1800,
    image: "https://images.unsplash.com/photo-1577224682806-983150abd261?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    isFeatured: true,
    slug: "african-print-headwrap"
  },
  {
    id: "8",
    name: "African Print Jacket",
    price: 4800,
    image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Outerwear",
    isNew: true,
    slug: "african-print-jacket"
  }
];

export const featuredProducts = products.filter(product => product.isFeatured);
export const newArrivals = products.filter(product => product.isNew);

export const categories = [
  {
    id: "1",
    name: "Women's Fashion",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "womens-fashion"
  },
  {
    id: "2",
    name: "Men's Fashion",
    image: "https://images.unsplash.com/photo-1578932750294-f5075e85f702?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "mens-fashion"
  },
  {
    id: "3",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1576689560324-1f4f28ca6716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "accessories"
  },
  {
    id: "4",
    name: "Traditional Wear",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "traditional-wear"
  }
];

export const collections = [
  {
    id: "1",
    name: "Summer Collection",
    description: "Light, airy designs perfect for warm climate",
    image: "https://images.unsplash.com/photo-1577224682806-983150abd261?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "summer-collection"
  },
  {
    id: "2",
    name: "Urban Fusion",
    description: "Modern designs with traditional African influences",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "urban-fusion"
  },
  {
    id: "3",
    name: "Heritage Collection",
    description: "Authentic designs celebrating African culture",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "heritage-collection"
  }
];
