
import { ProductType } from "@/components/products/product-card";

export const products: ProductType[] = [
  {
    id: "1",
    name: "Kitenge Print Maxi Dress",
    price: 4500,
    originalPrice: 5500,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Women's Dresses",
    isNew: true,
    isFeatured: true,
    slug: "kitenge-print-maxi-dress"
  },
  {
    id: "2",
    name: "Ankara Peplum Top",
    price: 2800,
    originalPrice: 3500,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Women's Tops",
    isFeatured: true,
    slug: "ankara-peplum-top"
  },
  {
    id: "3",
    name: "Maasai Inspired Shuka Scarf",
    price: 1200,
    image: "https://images.unsplash.com/photo-1561389881-9c4098a07da1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    isNew: true,
    slug: "maasai-inspired-shuka-scarf"
  },
  {
    id: "4",
    name: "African Print Slim Fit Shirt",
    price: 3200,
    originalPrice: 3800,
    image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Men's Shirts",
    isFeatured: true,
    slug: "african-print-slim-fit-shirt"
  },
  {
    id: "5",
    name: "Traditional Beaded Necklace",
    price: 1800,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Jewelry",
    slug: "traditional-beaded-necklace"
  },
  {
    id: "6",
    name: "Kente Print Pencil Skirt",
    price: 2500,
    image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Women's Bottoms",
    slug: "kente-print-pencil-skirt"
  },
  {
    id: "7",
    name: "Kikoi Beach Wrap",
    price: 1500,
    originalPrice: 1800,
    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    isFeatured: true,
    slug: "kikoi-beach-wrap"
  },
  {
    id: "8",
    name: "Tribal Print Bomber Jacket",
    price: 4800,
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    category: "Outerwear",
    isNew: true,
    slug: "tribal-print-bomber-jacket"
  }
];

export const featuredProducts = products.filter(product => product.isFeatured);
export const newArrivals = products.filter(product => product.isNew);

export const categories = [
  {
    id: "1",
    name: "Women's Fashion",
    image: "https://images.unsplash.com/photo-1590139665539-542a2d46c15d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "womens-fashion"
  },
  {
    id: "2",
    name: "Men's Fashion",
    image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "mens-fashion"
  },
  {
    id: "3",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
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
    description: "Light, airy designs perfect for Kenya's warm climate",
    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
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
    name: "Coastal Vibrance",
    description: "Inspired by Kenya's beautiful coastal culture",
    image: "https://images.unsplash.com/photo-1536048810607-3dc7f86981cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    slug: "coastal-vibrance"
  }
];
