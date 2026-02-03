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
        name: 'Order Processing',
        description: 'Your order is being prepared',
        icon: 'build-outline',
        color: '#2563EB',
        timestamp: new Date(now.getTime() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'KoreanStore Warehouse',
        estimatedDuration: 12,
        actualDuration: 10,
        isCompleted: true,
        isCurrent: false,
      },
      {
        id: '3',
        code: 'packaged',
        name: 'Packaged',
        description: 'Your items have been packaged',
        icon: 'cube-outline',
        color: '#1D4ED8',
        timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'KoreanStore Warehouse',
        estimatedDuration: 6,
        actualDuration: 8,
        isCompleted: true,
        isCurrent: false,
      },
      {
        id: '4',
        code: 'shipped',
        name: 'Shipped',
        description: 'Package has been handed to carrier',
        icon: 'car-outline',
        color: '#D97706',
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        location: 'Seoul Distribution Center',
        estimatedDuration: 24,
        actualDuration: undefined,
        isCompleted: false,
        isCurrent: true,
      },
      {
        id: '5',
        code: 'outForDelivery',
        name: 'Out for Delivery',
        description: 'Package is on its way to you',
        icon: 'navigate-outline',
        color: '#0284C7',
        timestamp: '',
        location: undefined,
        estimatedDuration: 4,
        actualDuration: undefined,
        isCompleted: false,
        isCurrent: false,
      },
      {
        id: '6',
        code: 'delivered',
        name: 'Delivered',
        description: 'Package has been delivered',
        icon: 'checkmark-done-outline',
        color: '#059669',
        timestamp: '',
        location: undefined,
        estimatedDuration: undefined,
        actualDuration: undefined,
        isCompleted: false,
        isCurrent: false,
      },
    ];

    // Рассчитываем прогресс
    const completedStatuses = statuses.filter(s => s.isCompleted).length;
    const totalStatuses = statuses.filter(s => s.timestamp).length;
    const progress = Math.round((completedStatuses / totalStatuses) * 100);

    return {
      id: orderId,
      orderNumber: `ORD-${orderId.slice(-8)}`,
      orderDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: estimatedDelivery.toISOString(),
      status: 'shipped',
      progress,
      shippingAddress: {
        fullName: 'John Doe',
        phoneNumber: '+82 10-1234-5678',
        email: 'john@example.com',
        address: '123 Gangnam-daero',
        apartment: 'Apt 4B',
        city: 'Seoul',
        state: 'Gangnam-gu',
        zipCode: '06164',
        country: 'South Korea',
        isDefault: true,
        label: 'home',
      },
      carrier: {
        id: 'korean_post',
        name: 'Korean Post',
        logo: 'https://picsum.photos/60/60?random=logo1',
        phone: '+82 2-1234-5678',
        website: 'https://koreapost.go.kr',
        trackingUrl: `https://koreapost.go.kr/tracking/${orderId}`,
      },
      trackingNumber: `KP${Date.now().toString().slice(-10)}`,
      timeline: statuses,
      items: [
        {
          id: '1',
          name: 'Korean Face Mask Pack',
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=400',
          tracking: `KP${Date.now().toString().slice(-10)}-1`,
        },
        {
          id: '2',
          name: 'Korean BB Cream',
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
          tracking: `KP${Date.now().toString().slice(-10)}-2`,
        },
      ],
      deliveryWindow: {
        start: '14:00',
        end: '18:00',
        type: 'afternoon',
      },
      driver: {
        name: 'Kim Min-woo',
        phone: '+82 10-9876-5432',
        photo: 'https://picsum.photos/40/40?random=photo1',
      },
      currentLocation: {
        latitude: 37.5665 + Math.random() * 0.01,
        longitude: 126.9780 + Math.random() * 0.01,
        address: 'Near Gangnam Station, Seoul',
        timestamp: new Date().toISOString(),
      },
      deliveryNotes: 'Please leave at the front door if no one answers',
      signatureRequired: true,
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