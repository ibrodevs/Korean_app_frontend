import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';

import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyOrders from '../components/orders/EmptyOrders';
import OrderCard from '../components/orders/OrderCard';
import Text from '../components/Text';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types/navigation';
import {
  MOCK_ORDERS,
  OrderHistory,
} from '../types/order';

const OrdersScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Простые состояния
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Загрузка данных
  const loadOrders = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockOrders = MOCK_ORDERS.map(order => ({
        ...order,
        status: getRandomStatus() as any,
        orderDate: getRandomDate(),
      }));
      setOrders(mockOrders as any);
      setLoading(false);
      setRefreshing(false);
    }, 800);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Вспомогательные функции для генерации случайных данных
  const getRandomStatus = () => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getRandomDate = () => {
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - Math.floor(Math.random() * 30));
    return pastDate.toISOString();
  };

  // Простые обработчики действий
  const handleViewDetails = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      navigation.navigate('OrderTracking', { orderId });
    }
  };

  const handleTrackOrder = (orderId: string) => {
    navigation.navigate('OrderTracking', { orderId });
  };

  const handleReorder = (orderId: string) => {
    Alert.alert('Заказать снова', 'Товары добавлены в корзину!');
  };

  const handleCancelOrder = (orderId: string) => {
    Alert.alert(
      'Отменить заказ',
      'Вы уверены, что хотите отменить заказ?',
      [
        { text: 'Нет', style: 'cancel' },
        {
          text: 'Да',
          style: 'destructive',
          onPress: () => {
            setOrders(orders.map(order =>
              order.id === orderId ? { ...order, status: 'cancelled' } : order
            ));
            Alert.alert('Успешно', 'Заказ отменён');
          },
        },
      ]
    );
  };

  const handleStartShopping = () => {
    navigation.navigate('Main', { 
      screen: 'HomeTab', 
      params: { screen: 'HomeMain' }
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const renderOrderItem = ({ item }: { item: OrderHistory }) => (
    <OrderCard
      order={item}
      onViewDetails={handleViewDetails}
      onTrackOrder={handleTrackOrder}
      onReorder={handleReorder}
      onCancelOrder={handleCancelOrder}
    />
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Загрузка заказов...
          </Text>
        </View>
      );
    }

    if (orders.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <EmptyOrders onStartShopping={handleStartShopping} />
        </View>
      );
    }

    return (
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Мои заказы
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              {orders.length} заказов
            </Text>
          </View>
        }
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {Platform.OS !== 'web' && (
        <StatusBar 
          barStyle={'dark-content'} 
          backgroundColor={theme.navBackground}
        />
      )}
      
      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 15,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
});

export default OrdersScreen;