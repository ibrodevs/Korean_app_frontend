import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrderTracking, TrackingStatus } from '../types/tracking';

const ORDERS_KEY = '@user_orders';

export const trackingService = {
  // Имитация задержки сети
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Получение информации об отслеживании заказа
  getOrderTracking: async (orderId: string): Promise<OrderTracking> => {
    await trackingService.delay(800);
    
    // Получаем заказы из хранилища
    const ordersData = await AsyncStorage.getItem(ORDERS_KEY);
    const orders = ordersData ? JSON.parse(ordersData) : [];
    
    // Ищем заказ или создаем моковые данные
    const order = orders.find((o: any) => o.id === orderId);
    
    if (order) {
      return order;
    }

    // Создаем моковые данные для демонстрации
    return trackingService.createMockTracking(orderId);
  },

  // Создание моковых данных отслеживания
  createMockTracking: (orderId: string): OrderTracking => {
    const now = new Date();
    const estimatedDelivery = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 дня
    
    // Статусы заказа
    const statuses: TrackingStatus[] = [
      {
        id: '1',
        code: 'placed',
        name: 'Order Placed',
        description: 'Your order has been received',
        icon: 'cart-outline',
        color: '#1774F3',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'KoreanStore Warehouse',
        estimatedDuration: 24,
        actualDuration: 24,
        isCompleted: true,
        isCurrent: false,
      },
      {
        id: '2',
        code: 'processing',
        name: 'Processing',
        description: 'Your order is being prepared',
        icon: 'construct-outline',
        color: '#D97706',
        timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Seoul Distribution Center',
        estimatedDuration: 12,
        actualDuration: 18,
        isCompleted: true,
        isCurrent: false,
      },
      {
        id: '3',
        code: 'shipped',
        name: 'Shipped',
        description: 'Your order is on its way',
        icon: 'airplane-outline',
        color: '#059669',
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        location: 'In Transit - Local Hub',
        estimatedDuration: 24,
        isCompleted: false,
        isCurrent: true,
      },
      {
        id: '4',
        code: 'delivery',
        name: 'Out for Delivery',
        description: 'Your order will be delivered soon',
        icon: 'car-outline',
        color: '#DC2626',
        timestamp: '',
        location: 'Local Delivery Center',
        estimatedDuration: 8,
        isCompleted: false,
        isCurrent: false,
      }
    ];

    return {
      id: orderId,
      orderNumber: `KS${orderId.slice(-6).toUpperCase()}`,
      orderDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: estimatedDelivery.toISOString(),
      status: 'shipped',
      progress: 65,
      shippingAddress: {
        id: '1',
        fullName: 'John Doe',
        phoneNumber: '+1234567890',
        email: 'john.doe@example.com',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
        isDefault: true,
        label: 'home',
        // Поля для обратной совместимости
        street: '123 Main Street',
        phone: '+1234567890'
      },
      carrier: {
        id: 'dhl',
        name: 'DHL Express',
        logo: 'https://logo.clearbit.com/dhl.com',
        phone: '+1-800-CALL-DHL',
        website: 'https://www.dhl.com',
        trackingUrl: 'https://www.dhl.com/tracking'
      },
      trackingNumber: `DHL${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timeline: statuses,
      deliveryType: Math.random() > 0.5 ? 'pickup' : 'delivery',
      pickupLocation: {
        id: 'pickup-1',
        name: 'Korean Store Pickup Point',
        address: '456 Korean Plaza, Seoul District, NY 10002',
        phone: '+1-555-KOREA-SHOP',
        workingHours: {
          weekdays: '9:00 AM - 8:00 PM',
          weekends: '10:00 AM - 6:00 PM'
        },
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        distance: '2.5 km'
      },
      items: [
        {
          id: 'item-1',
          name: 'Korean Instant Noodles Pack (6x)',
          quantity: 1,
          image: 'https://picsum.photos/60/60?random=noodles',
          tracking: `ITEM${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        },
        {
          id: 'item-2', 
          name: 'Korean Ginseng Tea (Premium)',
          quantity: 2,
          image: 'https://picsum.photos/60/60?random=tea'
        },
        {
          id: 'item-3',
          name: 'Korean Skincare Set',
          quantity: 1,
          image: 'https://picsum.photos/60/60?random=skincare',
          tracking: `ITEM${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        }
      ],
      deliveryWindow: {
        start: '2:00 PM',
        end: '6:00 PM',
        type: 'afternoon'
      },
      driver: {
        name: 'Mike Johnson',
        phone: '+1-555-DELIVERY',
        photo: 'https://picsum.photos/100/100?random=driver'
      },
      currentLocation: {
        latitude: 40.7484,
        longitude: -73.9857,
        address: 'Times Square Distribution Hub, NY',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
      },
      deliveryNotes: 'Please ring doorbell. Leave at door if no answer.',
      signatureRequired: true
    };
  },

  // Обновление статуса отслеживания
  updateTrackingStatus: async (orderId: string, status: TrackingStatus): Promise<void> => {
    await trackingService.delay(300);
    // Здесь будет логика обновления статуса
    console.log(`Order ${orderId} status updated to ${status.name}`);
  },

  // Получение истории отслеживания
  getTrackingHistory: async (): Promise<OrderTracking[]> => {
    await trackingService.delay(500);
    
    const ordersData = await AsyncStorage.getItem(ORDERS_KEY);
    if (ordersData) {
      const orders = JSON.parse(ordersData);
      return orders.map((order: any) => ({
        ...order,
        progress: Math.floor(Math.random() * 100),
      }));
    }
    
    // Возвращаем моковые данные
    return [
      trackingService.createMockTracking('order_1'),
      trackingService.createMockTracking('order_2'),
      trackingService.createMockTracking('order_3'),
    ];
  },
};