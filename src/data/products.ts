// Mocked collections data for display
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

// Mocked categories data
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

// Helper function to get products by category
export const getProductsByCategory = (category: string) => {
  return mockedProducts.filter(product => product.category === category);
};

// Helper function to get products by collection
export const getProductsByCollection = (collectionSlug: string) => {
  // In a real app, this would filter by a collection-product relationship
  // For now, return some random products
  return mockedProducts.slice(0, 8);
};

// Mocked products data
export const mockedProducts = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    slug: 'classic-white-t-shirt',
    description: 'A comfortable and versatile white t-shirt made from 100% cotton.',
    price: 1200,
    category: 'men',
    image: '/products/tshirt1.jpg',
    images: [
      '/products/tshirt1.jpg',
      '/products/tshirt1-2.jpg',
      '/products/tshirt1-3.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Gray'],
    isFeatured: true,
    isNew: false,
    isSale: false,
    discountPercent: 0,
    stock: 50
  },
  {
    id: '2',
    name: 'Floral Summer Dress',
    slug: 'floral-summer-dress',
    description: 'A beautiful floral dress perfect for summer days.',
    price: 2500,
    category: 'women',
    image: '/products/dress1.jpg',
    images: [
      '/products/dress1.jpg',
      '/products/dress1-2.jpg',
      '/products/dress1-3.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Blue', 'Pink'],
    isFeatured: true,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 30
  },
  {
    id: '3',
    name: 'Leather Crossbody Bag',
    slug: 'leather-crossbody-bag',
    description: 'A stylish leather crossbody bag with multiple compartments.',
    price: 3500,
    category: 'bags',
    image: '/products/bag1.jpg',
    images: [
      '/products/bag1.jpg',
      '/products/bag1-2.jpg',
      '/products/bag1-3.jpg'
    ],
    sizes: ['One Size'],
    colors: ['Brown', 'Black'],
    isFeatured: false,
    isNew: false,
    isSale: true,
    discountPercent: 15,
    stock: 20
  },
  {
    id: '4',
    name: 'Slim Fit Jeans',
    slug: 'slim-fit-jeans',
    description: 'Comfortable slim fit jeans made from high-quality denim.',
    price: 2800,
    category: 'men',
    image: '/products/jeans1.jpg',
    images: [
      '/products/jeans1.jpg',
      '/products/jeans1-2.jpg',
      '/products/jeans1-3.jpg'
    ],
    sizes: ['30', '32', '34', '36'],
    colors: ['Blue', 'Black'],
    isFeatured: false,
    isNew: false,
    isSale: false,
    discountPercent: 0,
    stock: 40
  },
  {
    id: '5',
    name: 'Running Shoes',
    slug: 'running-shoes',
    description: 'Lightweight and comfortable running shoes with excellent support.',
    price: 4500,
    category: 'shoes',
    image: '/products/shoes1.jpg',
    images: [
      '/products/shoes1.jpg',
      '/products/shoes1-2.jpg',
      '/products/shoes1-3.jpg'
    ],
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Black/Red', 'Blue/White', 'Gray/Green'],
    isFeatured: true,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 25
  },
  {
    id: '6',
    name: 'Casual Blouse',
    slug: 'casual-blouse',
    description: 'A lightweight and comfortable blouse for everyday wear.',
    price: 1800,
    category: 'tops',
    image: '/products/blouse1.jpg',
    images: [
      '/products/blouse1.jpg',
      '/products/blouse1-2.jpg',
      '/products/blouse1-3.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Pink'],
    isFeatured: false,
    isNew: false,
    isSale: true,
    discountPercent: 20,
    stock: 35
  },
  {
    id: '7',
    name: 'Formal Suit',
    slug: 'formal-suit',
    description: 'A classic formal suit for business and special occasions.',
    price: 12000,
    category: 'men',
    image: '/products/suit1.jpg',
    images: [
      '/products/suit1.jpg',
      '/products/suit1-2.jpg',
      '/products/suit1-3.jpg'
    ],
    sizes: ['48', '50', '52', '54'],
    colors: ['Black', 'Navy', 'Gray'],
    isFeatured: true,
    isNew: false,
    isSale: false,
    discountPercent: 0,
    stock: 15
  },
  {
    id: '8',
    name: 'Evening Gown',
    slug: 'evening-gown',
    description: 'An elegant evening gown for formal events and celebrations.',
    price: 15000,
    category: 'dresses',
    image: '/products/gown1.jpg',
    images: [
      '/products/gown1.jpg',
      '/products/gown1-2.jpg',
      '/products/gown1-3.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Red', 'Black', 'Gold'],
    isFeatured: true,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 10
  },
  {
    id: '9',
    name: 'Casual Chinos',
    slug: 'casual-chinos',
    description: 'Comfortable and stylish chinos for a casual look.',
    price: 2200,
    category: 'trousers',
    image: '/products/chinos1.jpg',
    images: [
      '/products/chinos1.jpg',
      '/products/chinos1-2.jpg',
      '/products/chinos1-3.jpg'
    ],
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Beige', 'Navy', 'Olive'],
    isFeatured: false,
    isNew: false,
    isSale: false,
    discountPercent: 0,
    stock: 30
  },
  {
    id: '10',
    name: 'Tote Bag',
    slug: 'tote-bag',
    description: 'A spacious and durable tote bag for everyday use.',
    price: 1800,
    category: 'bags',
    image: '/products/tote1.jpg',
    images: [
      '/products/tote1.jpg',
      '/products/tote1-2.jpg',
      '/products/tote1-3.jpg'
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Canvas'],
    isFeatured: false,
    isNew: true,
    isSale: false,
    discountPercent: 0,
    stock: 25
  },
  {
    id: '11',
    name: 'Graphic T-Shirt',
    slug: 'graphic-t-shirt',
    description: 'A cool graphic t-shirt with unique design.',
    price: 1500,
    category: 't-shirts',
    image: '/products/graphic-tee1.jpg',
    images: [
      '/products/graphic-tee1.jpg',
      '/products/graphic-tee1-2.jpg',
      '/products/graphic-tee1-3.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Gray'],
    isFeatured: false,
    isNew: false,
    isSale: true,
    discountPercent: 10,
    stock: 40
  },
  {
    id: '12',
    name: 'Ankle Boots',
    slug: 'ankle-boots',
    description: 'Stylish ankle boots that go with any outfit.',
    price: 3800,
    category: 'shoes',
    image: '/products/boots1.jpg',
    images: [
      '/products/boots1.jpg',
      '/products/boots1-2.jpg',
      '/products/boots1-3.jpg'
    ],
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Black', 'Brown', 'Tan'],
    isFeatured: true,
    isNew: false,
    isSale: false,
    discountPercent: 0,
    stock: 20
  }
];
