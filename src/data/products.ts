
// Categories data
export const categories = [
  { id: '1', name: 'Men', slug: 'men', image: '/placeholder-category.jpg' },
  { id: '2', name: 'Women', slug: 'women', image: '/placeholder-category.jpg' },
  { id: '3', name: 'Dresses', slug: 'dresses', image: '/placeholder-category.jpg' },
  { id: '4', name: 'Tops', slug: 'tops', image: '/placeholder-category.jpg' },
  { id: '5', name: 'Trousers', slug: 'trousers', image: '/placeholder-category.jpg' },
  { id: '6', name: 'Bags', slug: 'bags', image: '/placeholder-category.jpg' },
  { id: '7', name: 'T-Shirts', slug: 't-shirts', image: '/placeholder-category.jpg' },
  { id: '8', name: 'Shoes', slug: 'shoes', image: '/placeholder-category.jpg' }
];

// Collections data 
export const collections = [
  {
    id: '1',
    name: 'Summer Collection',
    slug: 'summer-collection',
    description: 'Light and breezy pieces perfect for summer days',
    image: '/public/lovable-uploads/af1aebcd-1e33-49f4-93b1-b441fd8c5edc.png'
  },
  {
    id: '2',
    name: 'Winter Essentials',
    slug: 'winter-essentials',
    description: 'Stay warm and stylish during the cold months',
    image: '/public/lovable-uploads/af1aebcd-1e33-49f4-93b1-b441fd8c5edc.png'
  },
  {
    id: '3',
    name: 'Formal Attire',
    slug: 'formal-attire',
    description: 'Sophisticated pieces for special occasions',
    image: '/public/lovable-uploads/af1aebcd-1e33-49f4-93b1-b441fd8c5edc.png'
  },
  {
    id: '4',
    name: 'Active Wear',
    slug: 'active-wear',
    description: 'Performance clothing for your workout routine',
    image: '/public/lovable-uploads/af1aebcd-1e33-49f4-93b1-b441fd8c5edc.png'
  },
  {
    id: '5',
    name: 'Kenyan Heritage',
    slug: 'kenyan-heritage',
    description: 'Traditional and modern designs inspired by Kenyan culture',
    image: '/public/lovable-uploads/af1aebcd-1e33-49f4-93b1-b441fd8c5edc.png'
  }
];

// Helper functions
export const getProductsByCategory = (category: string) => {
  return products.filter(product => product.category === category);
};

export const getProductsByCollection = (collectionSlug: string) => {
  return products.slice(0, 8);
};

// Products data with new images
export const products = [
  {
    id: '1',
    name: 'Lavender Velvet Tracksuit',
    slug: 'lavender-velvet-tracksuit',
    description: 'Luxurious lavender velvet tracksuit featuring a comfortable fit and premium quality fabric.',
    price: 3500,
    category: 'women',
    image: '/public/lovable-uploads/f11b9b38-0082-4d5a-8ff2-360448907bb1.png',
    images: [
      '/public/lovable-uploads/f11b9b38-0082-4d5a-8ff2-360448907bb1.png'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Lavender', 'Black', 'Gray'],
    isFeatured: true,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 25
  },
  {
    id: '2',
    name: 'Mint Green Graphic Tee & Floral Pants',
    slug: 'mint-green-graphic-tee-floral-pants',
    description: 'Stylish mint green t-shirt with graphic design paired with elegant floral print pants.',
    price: 4200,
    category: 'women',
    image: '/public/lovable-uploads/e1e38f46-27ba-47fe-b3cf-ac333b7a7cf6.png',
    images: [
      '/public/lovable-uploads/e1e38f46-27ba-47fe-b3cf-ac333b7a7cf6.png'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Mint Green/Black'],
    isFeatured: true,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 30
  },
  {
    id: '3',
    name: 'Designer Tracksuit Collection',
    slug: 'designer-tracksuit-collection',
    description: 'Premium designer tracksuits in exclusive patterns and colors, perfect for fashion-forward looks.',
    price: 6800,
    category: 'women',
    image: '/public/lovable-uploads/afefaa6a-9ac2-4d38-a0a5-0a6aec428ce2.png',
    images: [
      '/public/lovable-uploads/afefaa6a-9ac2-4d38-a0a5-0a6aec428ce2.png'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Green/Black', 'Gold/Brown'],
    isFeatured: true,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 15
  },
  {
    id: '4',
    name: 'Men\'s Grey Tracksuit',
    slug: 'mens-grey-tracksuit',
    description: 'Men\'s classic grey tracksuit with matching vest, perfect for casual and sports wear.',
    price: 4800,
    category: 'men',
    image: '/public/lovable-uploads/7dd5f6af-ce49-478d-9cb5-7dafbeb4b72b.png',
    images: [
      '/public/lovable-uploads/7dd5f6af-ce49-478d-9cb5-7dafbeb4b72b.png'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Grey'],
    isFeatured: false,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 20
  },
  {
    id: '5',
    name: 'Designer Leopard Print Set',
    slug: 'designer-leopard-print-set',
    description: 'Fashionable black set with leopard print design elements. Includes top and pants.',
    price: 5500,
    category: 'women',
    image: '/public/lovable-uploads/abc1f9a9-6a87-410e-bf4d-13de257e3e72.png',
    images: [
      '/public/lovable-uploads/abc1f9a9-6a87-410e-bf4d-13de257e3e72.png'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black/Leopard Print'],
    isFeatured: true,
    isNew: false,
    isSale: false,
    discountPercent: 0,
    stock: 15
  },
  {
    id: '6',
    name: 'Elegant Black Mesh Dress',
    slug: 'elegant-black-mesh-dress',
    description: 'Sophisticated black dress with mesh detail and gold star pattern, perfect for special occasions.',
    price: 4800,
    category: 'dresses',
    image: '/public/lovable-uploads/7bf4f2b0-a8c7-4da6-a89b-7ebc204ecaaa.png',
    images: [
      '/public/lovable-uploads/7bf4f2b0-a8c7-4da6-a89b-7ebc204ecaaa.png'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    isFeatured: true,
    isNew: false,
    isSale: false,
    discountPercent: 0,
    stock: 20
  },
  {
    id: '7',
    name: 'Women\'s Formal Business Suit',
    slug: 'womens-formal-business-suit',
    description: 'Professional black business suit for women with skirt, perfect for office and formal settings.',
    price: 7500,
    category: 'women',
    image: '/public/lovable-uploads/906fcc7b-40a6-4a82-b744-48caccb15b87.png',
    images: [
      '/public/lovable-uploads/906fcc7b-40a6-4a82-b744-48caccb15b87.png'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    isFeatured: false,
    isNew: false,
    isSale: false,
    discountPercent: 0,
    stock: 25
  },
  {
    id: '8',
    name: 'Men\'s Grey Formal Suit',
    slug: 'mens-grey-formal-suit',
    description: 'Classic grey formal suit for men with vest and white shirt, perfect for business and special occasions.',
    price: 12000,
    category: 'men',
    image: '/public/lovable-uploads/42efd527-3543-499c-ae64-527c63001e6c.png',
    images: [
      '/public/lovable-uploads/42efd527-3543-499c-ae64-527c63001e6c.png'
    ],
    sizes: ['48', '50', '52', '54'],
    colors: ['Grey'],
    isFeatured: true,
    isNew: false,
    isSale: false,
    discountPercent: 0,
    stock: 15
  },
  {
    id: '9',
    name: 'Varsity Hoodie Set',
    slug: 'varsity-hoodie-set',
    description: 'Comfortable and stylish varsity hoodie set for casual wear.',
    price: 4500,
    category: 'men',
    image: '/public/lovable-uploads/113f92d4-15c6-4d2a-a924-bb20fefe115e.png',
    images: [
      '/public/lovable-uploads/113f92d4-15c6-4d2a-a924-bb20fefe115e.png'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue/Grey', 'Black/Grey'],
    isFeatured: true,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 30
  },
  {
    id: '10',
    name: 'Men\'s Blue Formal Suit',
    slug: 'mens-blue-formal-suit',
    description: 'Elegant blue formal suit for men, ideal for special occasions and professional settings.',
    price: 13000,
    category: 'men',
    image: '/public/lovable-uploads/efe27d21-4b5c-49bc-8ef7-d76541972638.png',
    images: [
      '/public/lovable-uploads/efe27d21-4b5c-49bc-8ef7-d76541972638.png'
    ],
    sizes: ['48', '50', '52', '54'],
    colors: ['Blue'],
    isFeatured: false,
    isNew: false,
    isSale: false,
    discountPercent: 0,
    stock: 10
  },
  {
    id: '11',
    name: 'Royal Blue Elegant Dress',
    slug: 'royal-blue-elegant-dress',
    description: 'Stunning royal blue dress with layered design and button detail, perfect for special occasions.',
    price: 5800,
    category: 'dresses',
    image: '/public/lovable-uploads/f38d8a00-0c3e-4535-b4a0-5d27606c328b.png',
    images: [
      '/public/lovable-uploads/f38d8a00-0c3e-4535-b4a0-5d27606c328b.png'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Royal Blue'],
    isFeatured: true,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 15
  },
  {
    id: '12',
    name: 'Black Pearl Dress',
    slug: 'black-pearl-dress',
    description: 'Elegant black dress with see-through pearl-studded sleeves for a sophisticated evening look.',
    price: 6200,
    category: 'dresses',
    image: '/public/lovable-uploads/b4fd900d-0cdf-44ea-8615-4e0c3f57b4d0.png',
    images: [
      '/public/lovable-uploads/b4fd900d-0cdf-44ea-8615-4e0c3f57b4d0.png'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    isFeatured: false,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 20
  },
  {
    id: '13',
    name: 'Geometric Print Blazer',
    slug: 'geometric-print-blazer',
    description: 'Stylish black and white geometric print blazer, perfect for making a fashion statement.',
    price: 4500,
    category: 'women',
    image: '/public/lovable-uploads/f6cbdb3f-75ff-4639-959b-f50700867524.png',
    images: [
      '/public/lovable-uploads/f6cbdb3f-75ff-4639-959b-f50700867524.png'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black/White'],
    isFeatured: true,
    isNew: false,
    isSale: false,
    discountPercent: 0,
    stock: 15
  },
  {
    id: '14',
    name: 'Blue Winter Coat',
    slug: 'blue-winter-coat',
    description: 'Warm and stylish royal blue winter coat with fur collar detail.',
    price: 7200,
    category: 'women',
    image: '/public/lovable-uploads/4985348f-71b5-4c86-b9b1-35a3059284be.png',
    images: [
      '/public/lovable-uploads/4985348f-71b5-4c86-b9b1-35a3059284be.png'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Blue'],
    isFeatured: false,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 12
  },
  {
    id: '15',
    name: 'Emerald Green Dress',
    slug: 'emerald-green-dress',
    description: 'Flowing emerald green dress with wide sleeves and gold accessory detail.',
    price: 5500,
    category: 'dresses',
    image: '/public/lovable-uploads/ec773571-e555-44f7-a781-51bdba59a995.png',
    images: [
      '/public/lovable-uploads/ec773571-e555-44f7-a781-51bdba59a995.png'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Emerald Green'],
    isFeatured: true,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 18
  },
  {
    id: '16',
    name: 'Tropical Leaf Print Dress',
    slug: 'tropical-leaf-print-dress',
    description: 'Vibrant dress featuring yellow and gold tropical leaf print, perfect for summer occasions.',
    price: 4800,
    category: 'dresses',
    image: '/public/lovable-uploads/6efe455b-f332-4ceb-bec3-892e0091601a.png',
    images: [
      '/public/lovable-uploads/6efe455b-f332-4ceb-bec3-892e0091601a.png'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['White/Yellow'],
    isFeatured: false,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 20
  },
  {
    id: '17',
    name: 'Neon Green Kaftan Dress',
    slug: 'neon-green-kaftan-dress',
    description: 'Bold and beautiful neon green kaftan dress with black pattern, perfect for making a statement.',
    price: 6500,
    category: 'dresses',
    image: '/public/lovable-uploads/2a2e429e-fe7a-4d1b-a4bc-68c1e51cd252.png',
    images: [
      '/public/lovable-uploads/2a2e429e-fe7a-4d1b-a4bc-68c1e51cd252.png'
    ],
    sizes: ['S/M', 'L/XL'],
    colors: ['Neon Green/Black'],
    isFeatured: true,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 10
  },
  {
    id: '18',
    name: 'Floral Pattern Dress',
    slug: 'floral-pattern-dress',
    description: 'Elegant black dress with colorful floral pattern and belted design.',
    price: 5200,
    category: 'dresses',
    image: '/public/lovable-uploads/f273f5e5-d285-4a66-8661-d0f7847e31a3.png',
    images: [
      '/public/lovable-uploads/f273f5e5-d285-4a66-8661-d0f7847e31a3.png'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black/Floral'],
    isFeatured: false,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 25
  }
];

// Derived data for home page sections
export const featuredProducts = products.filter(product => product.isFeatured).slice(0, 8);
export const newArrivals = products.filter(product => product.isNew).slice(0, 8);
export const bestSellers = [
  products[0],
  products[1],
  products[2],
  products[5],
  products[7],
  products[10],
  products[14],
  products[16],
];
