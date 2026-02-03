import { Product, Category, Banner, ProductDetail } from '../types/product';

// Моковые данные товаров
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Korean Face Mask Pack',
    description: 'Hydrating sheet mask with snail mucin extract',
    price: 12.99,
    originalPrice: 16.99,
    discount: 23,
    currency: '$',
    category: 'skincare',
    subCategory: 'face-mask',
    images: [
      'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=400',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w-400',
    ],
    rating: 4.7,
    reviewCount: 128,
    stock: 45,
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    tags: ['skincare', 'face mask', 'snail mucin'],
    specifications: {
      'Brand': 'Korean Beauty Co.',
      'Type': 'Sheet Mask',
      'Skin Type': 'All Types',
      'Volume': '25ml'
    },
    shippingInfo: {
      freeShipping: true,
      deliveryTime: '2-3 days',
    },
    seller: {
      id: 'seller1',
      name: 'K-Beauty Store',
      rating: 4.8,
      reviewCount: 256,
      responseRate: 98
    },
    inStock: true
  },
  {
    id: '2',
    name: 'Korean BB Cream',
    description: 'Lightweight foundation with SPF 50',
    price: 24.99,
    currency: '$',
    category: 'cosmetics',
    subCategory: 'makeup',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    ],
    rating: 4.5,
    reviewCount: 89,
    stock: 32,
    isNew: false,
    isFeatured: true,
    isBestSeller: false,
    tags: ['makeup', 'foundation', 'SPF'],
    specifications: {
      'Brand': 'Korean Cosmetics',
      'Coverage': 'Medium',
      'SPF': '50',
      'Volume': '30ml'
    },
    shippingInfo: {
      freeShipping: false,
      deliveryTime: '3-5 days',
    },
    seller: {
      id: 'seller2',
      name: 'Beauty Paradise',
      rating: 4.6,
      reviewCount: 89,
      responseRate: 95
    },
    inStock: true
  },
  {
    id: '3',
    name: 'Korean Snack Box',
    description: 'Assortment of popular Korean snacks',
    price: 29.99,
    originalPrice: 34.99,
    discount: 14,
    currency: '$',
    category: 'snacks',
    subCategory: 'snack-box',
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
    ],
    rating: 4.8,
    reviewCount: 256,
    stock: 0,
    isNew: false,
    isFeatured: false,
    isBestSeller: true,
    tags: ['snacks', 'korean food', 'assortment'],
    specifications: {
      'Brand': 'Korean Snacks Co.',
      'Weight': '500g',
      'Type': 'Mixed Snacks',
      'Expiry': '6 months'
    },
    shippingInfo: {
      freeShipping: true,
      deliveryTime: '1-2 days',
    },
    seller: {
      id: 'seller3',
      name: 'Korean Food Hub',
      rating: 4.9,
      reviewCount: 342,
      responseRate: 99
    },
    inStock: true
  },
  {
    id: '4',
    name: 'Korean Fashion Hoodie',
    description: 'Oversized hoodie with K-pop design',
    price: 49.99,
    currency: '$',
    category: 'fashion',
    subCategory: 'clothing',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    ],
    rating: 4.6,
    reviewCount: 67,
    stock: 18,
    isNew: true,
    isFeatured: false,
    isBestSeller: false,
    tags: ['fashion', 'hoodie', 'k-pop'],
    specifications: {
      'Brand': 'K-Style',
      'Material': '100% Cotton',
      'Size': 'M, L, XL',
      'Care': 'Machine wash'
    },
    shippingInfo: {
      freeShipping: false,
      deliveryTime: '5-7 days',
    },
    seller: {
      id: 'seller4',
      name: 'K-Fashion Store',
      rating: 4.4,
      reviewCount: 67,
      responseRate: 92
    },
    inStock: true
  },
  {
    id: '5',
    name: 'Korean Ceramic Mug',
    description: 'Hand-painted traditional Korean design',
    price: 18.99,
    currency: '$',
    category: 'homeDecor',
    subCategory: 'kitchen',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400',
    ],
    rating: 4.9,
    reviewCount: 42,
    stock: 56,
    isNew: true,
    isFeatured: false,
    isBestSeller: false,
    tags: ['home decor', 'ceramic', 'traditional'],
    specifications: {
      'Brand': 'Korean Ceramics',
      'Material': 'Ceramic',
      'Size': '15cm x 10cm',
      'Style': 'Traditional'
    },
    shippingInfo: {
      freeShipping: true,
      deliveryTime: '3-4 days',
    },
    seller: {
      id: 'seller5',
      name: 'Traditional Korea',
      rating: 4.7,
      reviewCount: 156,
      responseRate: 97
    },
    inStock: true
  },
  {
    id: '6',
    name: 'Korean Beauty Blender',
    description: 'Professional makeup sponge set',
    price: 14.99,
    originalPrice: 19.99,
    discount: 25,
    currency: '$',
    category: 'cosmetics',
    subCategory: 'tools',
    images: [
      'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=400',
    ],
    rating: 4.4,
    reviewCount: 93,
    stock: 72,
    isNew: false,
    isFeatured: false,
    isBestSeller: true,
    tags: ['makeup tools', 'beauty blender', 'sponge'],
    specifications: {
      'Brand': 'K-Beauty Tools',
      'Material': 'Latex-free foam',
      'Size': 'Standard',
      'Count': '4 pieces'
    },
    shippingInfo: {
      freeShipping: false,
      deliveryTime: '2-3 days',
    },
    seller: {
      id: 'seller6',
      name: 'Beauty Tools Pro',
      rating: 4.5,
      reviewCount: 234,
      responseRate: 94
    },
    inStock: true
  },
];

// Моковые данные категорий
const mockCategories: Category[] = [
  {
    id: 'all',
    name: 'all',
    icon: 'all',
    color: '#1774F3',
    productCount: mockProducts.length,
  },
  {
    id: 'cosmetics',
    name: 'cosmetics',
    icon: 'cosmetics',
    color: '#2563EB',
    productCount: mockProducts.filter(p => p.category === 'cosmetics').length,
  },
  {
    id: 'skincare',
    name: 'skincare',
    icon: 'skincare',
    color: '#1D4ED8',
    productCount: mockProducts.filter(p => p.category === 'skincare').length,
  },
  {
    id: 'snacks',
    name: 'snacks',
    icon: 'snacks',
    color: '#93C5FD',
    productCount: mockProducts.filter(p => p.category === 'snacks').length,
  },
  {
    id: 'fashion',
    name: 'fashion',
    icon: 'fashion',
    color: '#475569',
    productCount: mockProducts.filter(p => p.category === 'fashion').length,
  },
  {
    id: 'homeDecor',
    name: 'homeDecor',
    icon: 'homeDecor',
    color: '#1774F3',
    productCount: mockProducts.filter(p => p.category === 'homeDecor').length,
  },
];

// Моковые данные баннеров
const mockBanners: Banner[] = [
  {
    id: '1',
    title: 'Summer Sale',
    subtitle: 'Up to 50% off on Korean cosmetics',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    backgroundColor: '#1774F3',
    action: {
      type: 'category',
      target: 'cosmetics',
    },
  },
  {
    id: '2',
    title: 'New Arrivals',
    subtitle: 'Discover latest Korean fashion trends',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    backgroundColor: '#2563EB',
    action: {
      type: 'category',
      target: 'fashion',
    },
  },
  {
    id: '3',
    title: 'Free Shipping',
    subtitle: 'On orders over $50',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
    backgroundColor: '#1D4ED8',
    action: {
      type: 'url',
      target: '/shipping-info',
    },
  },
];

export const productService = {
  // Имитация задержки сети
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Получение товаров
  getProducts: async (): Promise<Product[]> => {
    await productService.delay(500);
    return [...mockProducts];
  },

  // Получение категорий
  getCategories: async (): Promise<Category[]> => {
    await productService.delay(300);
    return [...mockCategories];
  },

  // Получение баннеров
  getBanners: async (): Promise<Banner[]> => {
    await productService.delay(200);
    return [...mockBanners];
  },

  // Получение товара по ID
  getProductById: async (id: string): Promise<Product | null> => {
    await productService.delay(300);
    return mockProducts.find(product => product.id === id) || null;
  },

  // Поиск товаров
  searchProducts: async (query: string): Promise<Product[]> => {
    await productService.delay(400);
    const lowerQuery = query.toLowerCase();
    return mockProducts.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },

  getProductDetail: async (id: string): Promise<ProductDetail> => {
    await productService.delay(500);
    
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }

    // Моковые детали продукта
    const mockDetails: ProductDetail = {
      ...product,
      specifications: [
        { key: 'Brand', value: 'Korean Beauty' },
        { key: 'Weight', value: '100g' },
        { key: 'Ingredients', value: 'Snail Mucin, Hyaluronic Acid' },
        { key: 'Country of Origin', value: 'South Korea' },
        { key: 'Skin Type', value: 'All skin types' },
        { key: 'Shelf Life', value: '24 months' },
      ],
      shippingOptions: [
        { id: '1', name: 'Standard', price: 5.99, estimatedDays: 5, free: false },
        { id: '2', name: 'Express', price: 12.99, estimatedDays: 2, free: false },
        { id: '3', name: 'Free Shipping', price: 0, estimatedDays: 7, free: true },
      ],
      seller: {
        id: 'seller1',
        name: 'KoreanBeautyShop',
        rating: 4.8,
        reviewCount: 1245,
        joinedDate: '2022-01-15',
        responseRate: 98,
        responseTime: '2 hours',
        badge: 'verified',
      },
      returnPolicy: '30-day return policy. Items must be unopened and in original packaging.',
      warranty: '1-year manufacturer warranty',
      colors: [
        { id: '1', name: 'Natural Beige', color: 'Beige', hex: '#F5DEB3', image: product.images[0], available: true },
        { id: '2', name: 'Rose Ivory', color: 'Pink', hex: '#F8C8C8', image: product.images[0], available: true },
        { id: '3', name: 'Vanilla', color: 'Ivory', hex: '#F5F5DC', image: product.images[0], available: false },
      ],
      sizes: [
        { id: '1', name: '30ml', available: true },
        { id: '2', name: '50ml', available: true },
        { id: '3', name: '100ml', available: true },
        { id: '4', name: '200ml', available: false },
      ],
      relatedProducts: ['2', '3', '6'],
      questions: [
        {
          id: '1',
          question: 'Is this product suitable for sensitive skin?',
          answer: 'Yes, it is formulated for all skin types including sensitive skin.',
          askedBy: 'Customer123',
          askedDate: '2024-01-15',
        },
      ],
    };

    return mockDetails;
  },

  // Получение похожих товаров
  getRelatedProducts: async (productId: string, category: string): Promise<Product[]> => {
    await productService.delay(300);
    return mockProducts
      .filter(p => p.id !== productId && p.category === category)
      .slice(0, 5);
  },
};