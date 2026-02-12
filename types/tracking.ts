import { ShippingAddress } from './order';

export interface TrackingStatus {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  timestamp: string;
  location?: string;
  estimatedDuration?: number; // в часах
  actualDuration?: number; // в часах
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface PickupLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  workingHours: {
    weekdays: string;
    weekends: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: string;
}

export interface OrderTracking {
  id: string;
  orderNumber: string;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  status: string;
  progress: number; // 0-100
  shippingAddress: ShippingAddress;
  carrier: Carrier;
  trackingNumber: string;
  timeline: TrackingStatus[];
  items: OrderItem[];
  deliveryType: 'delivery' | 'pickup'; // новое поле
  pickupLocation?: PickupLocation; // информация о пункте выдачи
  deliveryWindow?: {
    start: string;
    end: string;
    type: 'morning' | 'afternoon' | 'evening';
  };
  driver?: {
    name: string;
    phone: string;
    photo?: string;
  };
  currentLocation?: {
    latitude: number;
    longitude: number;
    address: string;
    timestamp: string;
  };
  deliveryNotes?: string;
  signatureRequired: boolean;
}

export interface Carrier {
  id: string;
  name: string;
  logo: string;
  phone: string;
  website: string;
  trackingUrl: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  image: string;
  tracking?: string;
}

export interface DeliveryProgress {
  distanceRemaining: number; // в км
  timeRemaining: number; // в минутах
  currentLocation: string;
  nextStop: string;
  eta: string;
}