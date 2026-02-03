import { Product } from './product';
import { Carrier } from './tracking';

export interface ShippingAddress {
  id?: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
  label?: 'home' | 'work' | 'other';
  street?: string; // Добавляем поле для обратной совместимости
  phone?: string; // Добавляем поле для обратной совместимости
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
  icon: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'paypal' | 'apple' | 'google' | 'cod';
  icon: string;
  lastFour?: string;
  expiryDate?: string;
  brand?: string; // Добавляем поле для обратной совместимости
  last4?: string; // Добавляем поле для обратной совместимости
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
  name?: string; // Добавляем поле для обратной совместимости
  variant?: string; // Добавляем поле для обратной совместимости
  image?: string; // Добавляем поле для обратной совместимости
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery: string;
  notes?: string;
}

export interface OrderHistory {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingNumber?: string;
  carrier?: Carrier;
  canReorder: boolean;
  canCancel: boolean;
  canReturn: boolean;
  invoiceUrl?: string;
  notes?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packaged'
  | 'shipped'
  | 'outForDelivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export interface OrderFilter {
  status?: OrderStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

export interface OrderSort {
  field: 'date' | 'amount' | 'status';
  direction: 'asc' | 'desc';
}

export interface OrderStats {
  totalOrders: number;
  totalSpent: number;
  averageOrder: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  favouriteCategory: string;
  lastOrderDate?: string;
}

export const MOCK_ORDERS: OrderHistory[] = [
  {
    id: '1',
    orderNumber: 'KST20231215001',
    orderDate: '2024-12-15T10:30:00Z',
    status: 'delivered',
    items: [
      {
        id: '101',
        productId: '1',
        product: {
          id: '1',
          name: 'Korean Face Sunscreen SPF 50+',
          description: 'Premium sunscreen',
          price: 24.99,
          currency: 'USD',
          category: 'Skincare',
          images: ['https://picsum.photos/150/150?random=order1'],
          rating: 4.8,
          reviewCount: 120,
          stock: 50,
          isNew: false,
          isFeatured: true,
          isBestSeller: true,
          tags: ['sunscreen'],
          seller: { id: '1', name: 'Korean Beauty Co', rating: 4.9 },
          inStock: true,
        },
        quantity: 2,
        price: 24.99,
        name: 'Korean Face Sunscreen SPF 50+',
        variant: '50ml',
        image: 'https://picsum.photos/150/150?random=order1',
      },
      {
        id: '102',
        productId: '2',
        product: {
          id: '2',
          name: 'Snail Mucin Essence',
          description: 'Hydrating essence',
          price: 18.50,
          currency: 'USD',
          category: 'Skincare',
          images: ['https://picsum.photos/150/150?random=order2'],
          rating: 4.7,
          reviewCount: 89,
          stock: 30,
          isNew: false,
          isFeatured: false,
          isBestSeller: false,
          tags: ['essence'],
          seller: { id: '1', name: 'Korean Beauty Co', rating: 4.9 },
          inStock: true,
        },
        quantity: 1,
        price: 18.50,
        name: 'Snail Mucin Essence',
        variant: '100ml',
        image: 'https://picsum.photos/150/150?random=order2',
      },
    ],
    totalAmount: 68.48,
    currency: 'USD',
    shippingAddress: {
      fullName: 'John Doe',
      street: '123 Main St',
      city: 'Seoul',
      state: 'Seoul',
      zipCode: '04500',
      country: 'South Korea',
      phone: '+82-10-1234-5678',
    },
    paymentMethod: {
      type: 'card',
      brand: 'Visa',
      last4: '4242',
    },
    estimatedDelivery: '2024-12-20',
    actualDelivery: '2024-12-19',
    trackingNumber: 'TRK123456789KR',
    carrier: {
      id: '1',
      name: 'Korean Post',
      trackingUrl: 'https://tracking.kpost.go.kr',
    },
    canReorder: true,
    canCancel: false,
    canReturn: true,
    invoiceUrl: 'https://koreanstore.com/invoice/1',
    notes: 'Leave at the front door',
  },
  {
    id: '2',
    orderNumber: 'KST20231212001',
    orderDate: '2024-12-12T14:20:00Z',
    status: 'shipped',
    items: [
      {
        id: '201',
        name: 'BB Cream Foundation',
        variant: 'Light Beige',
        price: 29.99,
        quantity: 1,
        image: 'https://picsum.photos/150/150?random=order3',
      },
    ],
    totalAmount: 34.99,
    currency: 'USD',
    shippingAddress: {
      fullName: 'John Doe',
      street: '123 Main St',
      city: 'Seoul',
      state: 'Seoul',
      zipCode: '04500',
      country: 'South Korea',
      phone: '+82-10-1234-5678',
    },
    paymentMethod: {
      type: 'card',
      brand: 'MasterCard',
      last4: '8888',
    },
    estimatedDelivery: '2024-12-18',
    trackingNumber: 'TRK987654321KR',
    carrier: {
      id: '2',
      name: 'CJ Logistics',
      trackingUrl: 'https://cjlgs.co.kr',
    },
    canReorder: true,
    canCancel: false,
    canReturn: false,
  },
  {
    id: '3',
    orderNumber: 'KST20231210001',
    orderDate: '2024-12-10T09:15:00Z',
    status: 'processing',
    items: [
      {
        id: '301',
        name: 'Green Tea Serum',
        variant: '30ml',
        price: 32.99,
        quantity: 3,
        image: 'https://picsum.photos/150/150?random=order4',
      },
      {
        id: '302',
        name: 'Sheet Mask Pack',
        variant: '10 pieces',
        price: 15.99,
        quantity: 1,
        image: 'https://picsum.photos/150/150?random=order5',
      },
    ],
    totalAmount: 114.96,
    currency: 'USD',
    shippingAddress: {
      fullName: 'John Doe',
      street: '123 Main St',
      city: 'Seoul',
      state: 'Seoul',
      zipCode: '04500',
      country: 'South Korea',
      phone: '+82-10-1234-5678',
    },
    paymentMethod: {
      type: 'paypal',
    },
    canReorder: false,
    canCancel: true,
    canReturn: false,
  },
  {
    id: '4',
    orderNumber: 'KST20231205001',
    orderDate: '2024-12-05T16:45:00Z',
    status: 'cancelled',
    items: [
      {
        id: '401',
        name: 'Lip Tint Set',
        variant: '5 colors',
        price: 39.99,
        quantity: 1,
        image: 'https://picsum.photos/150/150?random=order6',
      },
    ],
    totalAmount: 39.99,
    currency: 'USD',
    shippingAddress: {
      fullName: 'John Doe',
      street: '123 Main St',
      city: 'Seoul',
      state: 'Seoul',
      zipCode: '04500',
      country: 'South Korea',
      phone: '+82-10-1234-5678',
    },
    paymentMethod: {
      type: 'card',
      brand: 'Visa',
      last4: '4242',
    },
    canReorder: true,
    canCancel: false,
    canReturn: false,
  },
];