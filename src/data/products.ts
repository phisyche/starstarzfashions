
import { ProductType } from "@/components/products/product-card";

export const products: ProductType[] = [
  {
    id: "1",
    name: "African Print Blazer",
    price: 12500,
    originalPrice: 15000,
    image: "https://images.unsplash.com/photo-1618503551238-7f981a41d142?auto=format&fit=crop&q=80",
    category: "Men's Outerwear",
    isNew: true,
    isFeatured: true,
    slug: "african-print-blazer"
  },
  {
    id: "2",
    name: "Dashiki Shirt",
    price: 4500,
    originalPrice: 6000,
    image: "https://images.unsplash.com/photo-1600267204026-85c3cc8e96cd?auto=format&fit=crop&q=80",
    category: "Men's Shirts",
    isFeatured: true,
    slug: "dashiki-shirt"
  },
  {
    id: "3",
    name: "Ankara Print Shirt",
    price: 3800,
    image: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?auto=format&fit=crop&q=80",
    category: "Men's Shirts",
    isNew: true,
    slug: "ankara-print-shirt"
  },
  {
    id: "4",
    name: "Kitenge Print Shirt",
    price: 3200,
    originalPrice: 3800,
    image: "https://images.unsplash.com/photo-1507680232228-e0d4c52eaa56?auto=format&fit=crop&q=80",
    category: "Men's Shirts",
    isFeatured: true,
    slug: "kitenge-print-shirt"
  },
  {
    id: "5",
    name: "Beaded Necklace",
    price: 1800,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80",
    category: "Jewelry",
    slug: "beaded-necklace"
  },
  {
    id: "6",
    name: "Ankara Print Skirt",
    price: 2500,
    image: "https://images.unsplash.com/photo-1551163943-3f7253a3a614?auto=format&fit=crop&q=80",
    category: "Women's Bottoms",
    slug: "ankara-print-skirt"
  },
  {
    id: "7",
    name: "African Print Headwrap",
    price: 1500,
    originalPrice: 1800,
    image: "https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?auto=format&fit=crop&q=80",
    category: "Accessories",
    isFeatured: true,
    slug: "african-print-headwrap"
  },
  {
    id: "8",
    name: "African Print Jacket",
    price: 4800,
    image: "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&q=80",
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
    name: "Modern African",
    image: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?auto=format&fit=crop&q=80",
    slug: "modern-african"
  },
  {
    id: "2",
    name: "Traditional Wear",
    image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&q=80",
    slug: "traditional-wear"
  },
  {
    id: "3",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1620293023837-6ca93abe081f?auto=format&fit=crop&q=80",
    slug: "accessories"
  }
];

export const collections = [
  {
    id: "1",
    name: "Modern Heritage",
    description: "Contemporary takes on traditional African designs",
    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&q=80",
    slug: "modern-heritage"
  },
  {
    id: "2",
    name: "Urban African",
    description: "Modern African fashion for the city",
    image: "https://images.unsplash.com/photo-1600267204026-85c3cc8e96cd?auto=format&fit=crop&q=80",
    slug: "urban-african"
  }
];
