
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
    image: '/lovable-uploads/d62448f0-bd29-4042-8d98-86953249d7b6.png'
  },
  {
    id: '2',
    name: 'Winter Essentials',
    slug: 'winter-essentials',
    description: 'Stay warm and stylish during the cold months',
    image: '/lovable-uploads/805f0c30-3872-4a34-b17d-91249d49c8fe.png'
  },
  {
    id: '3',
    name: 'Formal Attire',
    slug: 'formal-attire',
    description: 'Sophisticated pieces for special occasions',
    image: '/lovable-uploads/90493f64-dcbf-48fe-ac18-1815f2ebb412.png'
  },
  {
    id: '4',
    name: 'Active Wear',
    slug: 'active-wear',
    description: 'Performance clothing for your workout routine',
    image: '/lovable-uploads/720e6bfb-1fe4-4ff5-b8f5-e8b23a38ebaf.png'
  },
  {
    id: '5',
    name: 'Kenyan Heritage',
    slug: 'kenyan-heritage',
    description: 'Traditional and modern designs inspired by Kenyan culture',
    image: '/lovable-uploads/9ad9ae97-de2e-42ed-a29e-6e08a1600dd6.png'
  }
];

// Helper functions
export const getProductsByCategory = (category: string) => {
  return products.filter(product => product.category === category);
};

export const getProductsByCollection = (collectionSlug: string) => {
  return products.slice(0, 8);
};

// Products data with the new uploaded images
export const products = [
  {
    id: '1',
    name: 'Lavender Velvet Tracksuit',
    slug: 'lavender-velvet-tracksuit',
    description: 'Luxurious lavender velvet tracksuit featuring a comfortable fit and premium quality fabric.',
    price: 3500,
    category: 'women',
    image: '/lovable-uploads/7d8e7740-9ea4-412d-9461-cda9c4043d67.png',
    images: [
      '/lovable-uploads/7d8e7740-9ea4-412d-9461-cda9c4043d67.png'
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
    image: '/lovable-uploads/2550e605-a2dc-49b2-915e-b85e997673df.png',
    images: [
      '/lovable-uploads/2550e605-a2dc-49b2-915e-b85e997673df.png'
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
    image: '/lovable-uploads/80ddaeb8-9fce-4fd0-82b5-77e771451ab0.png',
    images: [
      '/lovable-uploads/80ddaeb8-9fce-4fd0-82b5-77e771451ab0.png'
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
    image: '/lovable-uploads/b6996288-d7fe-46ee-9f47-43c145eb0769.png',
    images: [
      '/lovable-uploads/b6996288-d7fe-46ee-9f47-43c145eb0769.png'
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
    image: '/lovable-uploads/c6dcc27f-776b-4b38-84c2-775c0d4d8c27.png',
    images: [
      '/lovable-uploads/c6dcc27f-776b-4b38-84c2-775c0d4d8c27.png'
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
    image: '/lovable-uploads/6b26857d-f158-4afd-8c1e-a1d69f00b987.png',
    images: [
      '/lovable-uploads/6b26857d-f158-4afd-8c1e-a1d69f00b987.png'
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
    image: '/lovable-uploads/1e3368c0-b257-4031-aade-7f9ca9638959.png',
    images: [
      '/lovable-uploads/1e3368c0-b257-4031-aade-7f9ca9638959.png'
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
    image: '/lovable-uploads/5fb7f5a6-91c1-4256-9276-25ae38b9af6d.png',
    images: [
      '/lovable-uploads/5fb7f5a6-91c1-4256-9276-25ae38b9af6d.png'
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
    image: '/lovable-uploads/de183be4-0d91-471f-8a2b-1ad6a46ac0fe.png',
    images: [
      '/lovable-uploads/de183be4-0d91-471f-8a2b-1ad6a46ac0fe.png'
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
    image: '/lovable-uploads/9d1900d6-c052-42e7-99e9-121bc565efb3.png',
    images: [
      '/lovable-uploads/9d1900d6-c052-42e7-99e9-121bc565efb3.png'
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
    image: '/lovable-uploads/f7138fbf-c738-4bde-be83-64fb39a22eb3.png',
    images: [
      '/lovable-uploads/f7138fbf-c738-4bde-be83-64fb39a22eb3.png'
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
    image: '/lovable-uploads/5cb8074a-ef41-42af-831e-61b13dd7de02.png',
    images: [
      '/lovable-uploads/5cb8074a-ef41-42af-831e-61b13dd7de02.png'
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
    image: '/lovable-uploads/d48f9645-7c6a-411e-868e-5fa03fe8055a.png',
    images: [
      '/lovable-uploads/d48f9645-7c6a-411e-868e-5fa03fe8055a.png'
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
    image: '/lovable-uploads/de183be4-0d91-471f-8a2b-1ad6a46ac0fe.png',
    images: [
      '/lovable-uploads/de183be4-0d91-471f-8a2b-1ad6a46ac0fe.png'
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
    image: '/lovable-uploads/9ad9ae97-de2e-42ed-a29e-6e08a1600dd6.png',
    images: [
      '/lovable-uploads/9ad9ae97-de2e-42ed-a29e-6e08a1600dd6.png'
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
    image: '/lovable-uploads/90493f64-dcbf-48fe-ac18-1815f2ebb412.png',
    images: [
      '/lovable-uploads/90493f64-dcbf-48fe-ac18-1815f2ebb412.png'
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
    image: '/lovable-uploads/d62448f0-bd29-4042-8d98-86953249d7b6.png',
    images: [
      '/lovable-uploads/d62448f0-bd29-4042-8d98-86953249d7b6.png'
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
    image: '/lovable-uploads/c6dcc27f-776b-4b38-84c2-775c0d4d8c27.png',
    images: [
      '/lovable-uploads/c6dcc27f-776b-4b38-84c2-775c0d4d8c27.png'
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
