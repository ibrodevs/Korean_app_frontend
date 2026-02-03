import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShippingAddress, ShippingMethod, PaymentMethod, OrderItem, Order } from '../types/order';

const ADDRESSES_KEY = '@user_addresses';
const ORDERS_KEY = '@user_orders';

// Моковые методы доставки
const mockShippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Delivery in 5-7 business days',
    price: 4.99,
    estimatedDays: 7,
    icon: 'car-outline',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Delivery in 2-3 business days',
    price: 12.99,
    estimatedDays: 3,
    icon: 'rocket-outline',
  },
  {
    id: 'free',
    name: 'Free Shipping',
    description: 'Delivery in 7-10 business days',
    price: 0,
    estimatedDays: 10,
    icon: 'gift-outline',
  },
];

// Моковые методы оплаты
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'cod',
    name: 'Cash on Delivery',
    type: 'cod',
    icon: 'cash-outline',
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    type: 'card',
    icon: 'card-outline',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'paypal',
    icon: 'logo-paypal',
  },
  {
    id: 'apple',
    name: 'Apple Pay',
    type: 'apple',
    icon: 'logo-apple',
  },
  {
    id: 'google',
    name: 'Google Pay',
    type: 'google',
    icon: 'logo-google',
  },
];

export const checkoutService = {
  // Имитация задержки сети
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Получение сохраненных адресов
  getSavedAddresses: async (): Promise<ShippingAddress[]> => {
    await checkoutService.delay(300);
    try {
      const addresses = await AsyncStorage.getItem(ADDRESSES_KEY);
      if (addresses) {
        return JSON.parse(addresses);
      }
      return [];
    } catch (error) {
      console.error('Error getting addresses:', error);
      return [];
    }
  },

  // Сохранение адреса
  saveAddress: async (address: ShippingAddress): Promise<ShippingAddress> => {
    await checkoutService.delay(500);
    try {
      const addresses = await checkoutService.getSavedAddresses();
      const newAddress = {
        ...address,
        id: address.id || `addr_${Date.now()}`,
      };

      // Если это адрес по умолчанию, снимаем флаг с других адресов
      if (newAddress.isDefault) {
        addresses.forEach(addr => {
          addr.isDefault = false;
        });
      }

      // Обновляем существующий или добавляем новый
      const existingIndex = addresses.findIndex(addr => addr.id === newAddress.id);
      if (existingIndex >= 0) {
        addresses[existingIndex] = newAddress;
      } else {
        addresses.push(newAddress);
      }

      await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
      return newAddress;
    } catch (error) {
      console.error('Error saving address:', error);
      throw error;
    }
  },

  // Удаление адреса
  deleteAddress: async (addressId: string): Promise<void> => {
    await checkoutService.delay(300);
    try {
      const addresses = await checkoutService.getSavedAddresses();
      const filtered = addresses.filter(addr => addr.id !== addressId);
      await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },

  // Получение методов доставки
  getShippingMethods: async (): Promise<ShippingMethod[]> => {
    await checkoutService.delay(200);
    return [...mockShippingMethods];
  },

  // Получение методов оплаты
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    await checkoutService.delay(200);
    return [...mockPaymentMethods];
  },

  // Оформление заказа
  placeOrder: async (orderData: {
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    shippingMethod: ShippingMethod;
    paymentMethod: PaymentMethod;
    notes: string;
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
  }): Promise<string> => {
    await checkoutService.delay(1000); // Имитация процесса оформления
    
    try {
      // Генерация номера заказа
      const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
      const orderId = `order_${Date.now()}`;

      // Создание объекта заказа
      const newOrder: Order = {
        id: orderId,
        orderNumber,
        userId: 'user_1',
        ...orderData,
        discount: 0, // Добавляем отсутствующее поле
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 
          orderData.shippingMethod.estimatedDays * 24 * 60 * 60 * 1000
        ).toISOString(),
      };

      // Сохранение заказа
      const existingOrders = await AsyncStorage.getItem(ORDERS_KEY);
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(newOrder);
      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

      return orderId;
    } catch (error) {
      console.error('Error placing order:', error);
      throw new Error('Failed to place order');
    }
  },
};