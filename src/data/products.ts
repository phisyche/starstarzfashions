import { ProductType } from "@/components/products/product-card";

export const products: ProductType[] = [
  {
    id: "1",
    name: "African Print Blazer",
    price: 12500,
    originalPrice: 15000,
    image: "https://images.unsplash.com/photo-1578932750294-f5075e85f702",
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
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    category: "Men's Shirts",
    isFeatured: true,
    slug: "dashiki-shirt"
  },
  {
    id: "3",
    name: "Ankara Print Shirt",
    price: 3800,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35",
    category: "Men's Shirts",
    isNew: true,
    slug: "ankara-print-shirt"
  },
  {
    id: "4",
    name: "Kitenge Print Shirt",
    price: 3200,
    originalPrice: 3800,
    image: "https://images.unsplash.com/photo-1578932750294-f5075e85f702",
    category: "Men's Shirts",
    isFeatured: true,
    slug: "kitenge-print-shirt"
  },
  {
    id: "5",
    name: "Beaded Necklace",
    price: 1800,
    image: "https://images.unsplash.com/photo-1576689560324-1f4f28ca6716",
    category: "Jewelry",
    slug: "beaded-necklace"
  },
  {
    id: "6",
    name: "Ankara Print Skirt",
    price: 2500,
    image: "https://images.unsplash.com/photo-1533659828870-95ee305cee3e",
    category: "Women's Bottoms",
    slug: "ankara-print-skirt"
  },
  {
    id: "7",
    name: "African Print Headwrap",
    price: 1500,
    originalPrice: 1800,
    image: "https://images.unsplash.com/photo-1577224682806-983150abd261",
    category: "Accessories",
    isFeatured: true,
    slug: "african-print-headwrap"
  },
  {
    id: "8",
    name: "African Print Jacket",
    price: 4800,
    image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d",
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
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    slug: "modern-african"
  },
  {
    id: "2",
    name: "Traditional Wear",
    image: "https://images.unsplash.com/photo-1578932750294-f5075e85f702",
    slug: "traditional-wear"
  },
  {
    id: "3",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35",
    slug: "accessories"
  }
];

export const collections = [
  {
    id: "1",
    name: "Modern Heritage",
    description: "Contemporary takes on traditional African designs",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    slug: "modern-heritage"
  },
  {
    id: "2",
    name: "Urban African",
    description: "Modern African fashion for the city",
    image: "https://images.unsplash.com/photo-1578932750294-f5075e85f702",
    slug: "urban-african"
  }
];
