export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  discount?: number;
  currency: string;
  category: string;
  subCategory?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  tags: string[];
  specifications?: Record<string, string>;
  shippingInfo?: {
    freeShipping: boolean;
    deliveryTime: string;
  };
  seller: {
    name: string;
    id: string;
    rating?: number;
    reviewCount?: number;
    responseRate?: number;
  };
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  productCount: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  backgroundColor: string;
  action: {
    type: 'product' | 'category' | 'url';
    target: string;
  };
}

export interface SortOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterOptions {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  minRating: number;
  inStockOnly: boolean;
}

export interface SearchFilters {
  query: string;
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  minRating: number;
  availability: 'all' | 'inStock' | 'outOfStock';
  shipping: 'all' | 'free' | 'paid';
  brands: string[];
  colors: string[];
  sizes: string[];
  onSale: boolean;
  newArrivals: boolean;
  highRated: boolean;
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultCount: number;
}

export interface PopularSearch {
  id: string;
  query: string;
  count: number;
  category?: string;
}

export interface Brand {
  id: string;
  name: string;
  productCount: number;
}

export interface ColorOption {
  id: string;
  name: string;
  color: string;
  productCount: number;
}

export interface SizeOption {
  id: string;
  name: string;
  productCount: number;
}

export interface SearchSortOption {
  id: string;
  label: string;
  value: string;
  field: string;
  order: 'asc' | 'desc';
}

export interface ProductDetail extends Product {
  specifications: Record<string, string>;
  shippingOptions: ShippingOption[];
  seller: Seller;
  returnPolicy: string;
  warranty: string;
  colors: ColorVariant[];
  sizes: SizeVariant[];
  relatedProducts: string[]; // IDs of related products
  questions: ProductQuestion[];
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: number;
  free: boolean;
}

export interface Seller {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  responseRate: number;
  responseTime: string;
  badge: 'verified' | 'premium' | 'new';
}

export interface ColorVariant {
  id: string;
  name: string;
  color: string;
  hex: string;
  image: string;
  available: boolean;
}

export interface SizeVariant {
  id: string;
  name: string;
  available: boolean;
}

export interface ProductQuestion {
  id: string;
  question: string;
  answer: string;
  askedBy: string;
  askedDate: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpful: number;
  images?: string[];
}