
import { ProductType } from "@/components/products/product-card";

export const products: ProductType[] = [
  {
    id: "1",
    name: "Floral Print Summer Dress",
    price: 12500,
    originalPrice: 15000,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80",
    category: "Dresses",
    isNew: true,
    isFeatured: true,
    slug: "floral-print-summer-dress"
  },
  {
    id: "2",
    name: "Classic White Blouse",
    price: 4500,
    originalPrice: 6000,
    image: "https://images.unsplash.com/photo-1551048632-24e444b48a0f?auto=format&fit=crop&q=80",
    category: "Tops",
    isFeatured: true,
    isBestSeller: true,
    slug: "classic-white-blouse"
  },
  {
    id: "3",
    name: "High-Waist Denim Jeans",
    price: 3800,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80",
    category: "Bottoms",
    isNew: true,
    slug: "high-waist-denim-jeans"
  },
  {
    id: "4",
    name: "Leather Crossbody Bag",
    price: 8500,
    originalPrice: 9500,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80",
    category: "Accessories",
    isFeatured: true,
    isBestSeller: true,
    slug: "leather-crossbody-bag"
  },
  {
    id: "5",
    name: "Statement Gold Necklace",
    price: 3200,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80",
    category: "Jewelry",
    slug: "statement-gold-necklace"
  },
  {
    id: "6",
    name: "Pleated Midi Skirt",
    price: 6500,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&q=80",
    category: "Bottoms",
    slug: "pleated-midi-skirt",
    isNew: true
  },
  {
    id: "7",
    name: "Silk Hair Scarf",
    price: 2500,
    originalPrice: 3000,
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80",
    category: "Accessories",
    isFeatured: true,
    slug: "silk-hair-scarf"
  },
  {
    id: "8",
    name: "Tailored Blazer",
    price: 15000,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80",
    category: "Outerwear",
    isNew: true,
    slug: "tailored-blazer"
  },
  {
    id: "9",
    name: "Linen Summer Shirt",
    price: 5500,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80",
    category: "Tops",
    isNew: true,
    slug: "linen-summer-shirt"
  },
  {
    id: "10",
    name: "Floral Maxi Dress",
    price: 9500,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80",
    category: "Dresses",
    isBestSeller: true,
    slug: "floral-maxi-dress"
  },
  {
    id: "11",
    name: "Leather Ankle Boots",
    price: 18500,
    originalPrice: 22000,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80",
    category: "Shoes",
    isBestSeller: true,
    slug: "leather-ankle-boots"
  },
  {
    id: "12",
    name: "Oversized Knit Sweater",
    price: 7800,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80",
    category: "Tops",
    isBestSeller: true,
    slug: "oversized-knit-sweater"
  },
];

export const featuredProducts = products.filter(product => product.isFeatured);
export const newArrivals = products.filter(product => product.isNew);
export const bestSellers = products.filter(product => product.isBestSeller);

export const categories = [
  {
    id: "1",
    name: "Dresses & Jumpsuits",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80",
    slug: "dresses-jumpsuits"
  },
  {
    id: "2",
    name: "Tops & Blouses",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80",
    slug: "tops-blouses"
  },
  {
    id: "3",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&q=80",
    slug: "accessories"
  },
  {
    id: "4",
    name: "Shoes",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80",
    slug: "shoes"
  },
  {
    id: "5",
    name: "Bottoms",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80",
    slug: "bottoms"
  },
  {
    id: "6",
    name: "Outerwear",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80",
    slug: "outerwear"
  },
  {
    id: "7",
    name: "Jewelry",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80",
    slug: "jewelry"
  }
];

export const collections = [
  {
    id: "1",
    name: "Summer Essentials",
    description: "Light, breezy pieces perfect for warm days and balmy nights",
    image: "https://images.unsplash.com/photo-1523359346063-d879354c0ea5?auto=format&fit=crop&q=80",
    slug: "summer-essentials"
  },
  {
    id: "2",
    name: "Evening Elegance",
    description: "Sophisticated designs for special occasions",
    image: "https://images.unsplash.com/photo-1490725263030-1f0521cec8ec?auto=format&fit=crop&q=80",
    slug: "evening-elegance"
  },
  {
    id: "3",
    name: "Urban Classics",
    description: "Timeless pieces for the modern wardrobe",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80",
    slug: "urban-classics"
  }
];
