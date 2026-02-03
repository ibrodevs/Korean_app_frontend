export interface PaymentCard {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  cardHolder: string;
  isDefault: boolean;
  token?: string; // Токен для безопасных транзакций
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'paypal' | 'apple' | 'google' | 'cod' | 'bank';
  icon: string;
  description?: string;
  fee?: number;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  card?: PaymentCard;
  billingAddress?: {
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
  saveCard?: boolean;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  message?: string;
  timestamp: string;
  amount: number;
  currency: string;
}

export interface PaymentStatus {
  id: string;
  status: PaymentResponse['status'];
  progress: number; // 0-100
  message: string;
  estimatedTime?: number; // в секундах
}