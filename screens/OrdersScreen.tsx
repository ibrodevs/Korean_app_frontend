import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyOrders from '../components/orders/EmptyOrders';
import OrderCard from '../components/orders/OrderCard';
import OrderDetailsModal from '../components/orders/OrderDetailsModal';
import OrdersHeader from '../components/orders/OrdersHeader';
import Text from '../components/Text';
import { useTheme } from '../contexts/ThemeContext';
import {
  MOCK_ORDERS,
  OrderFilter,
  OrderHistory,
  OrderSort,
  OrderStats,
} from '../types/order';
import { useTailwind } from '../utils/tailwindUtilities';

import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

const OrdersScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Состояния
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderHistory[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    totalSpent: 0,
    averageOrder: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    favouriteCategory: 'Cosmetics',
    lastOrderDate: undefined,
  });
  
  const [filter, setFilter] = useState<OrderFilter>({});
  const [sort, setSort] = useState<OrderSort>({ field: 'date', direction: 'desc' });
  const [selectedOrder, setSelectedOrder] = useState<OrderHistory | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Загрузка данных
  const loadOrders = useCallback(() => {
    // В реальном приложении здесь будет API запрос
    setTimeout(() => {
      setOrders(MOCK_ORDERS);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Обновление статистики при изменении заказов
  useEffect(() => {
    if (orders.length === 0) {
      setStats({
        totalOrders: 0,
        totalSpent: 0,
        averageOrder: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        favouriteCategory: 'None',
        lastOrderDate: undefined,
      });
      return;
    }

    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = orders.filter(o => 
      ['pending', 'confirmed', 'processing', 'packaged'].includes(o.status)
    ).length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const lastOrder = [...orders].sort((a, b) => 
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    )[0];

    setStats({
      totalOrders: orders.length,
      totalSpent,
      averageOrder: totalSpent / orders.length,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      favouriteCategory: 'Cosmetics', // Здесь должна быть реальная логика
      lastOrderDate: lastOrder?.orderDate,
    });
  }, [orders]);

const navigation = useNavigation<NavigationProp<RootStackParamList>>();

// Для навигации к деталям заказа:
const handleViewOrderDetails = (orderId: string) => {
  navigation.navigate('OrderTracking', { orderId });
};

// Для навигации к профилю:
const goToProfile = () => {
  navigation.navigate('Main', { screen: 'ProfileTab', params: { screen: 'ProfileMain' } });
};

  // Фильтрация и сортировка заказов
  useEffect(() => {
    let result = [...orders];

    // Применение фильтров
    if (filter.status && filter.status.length > 0) {
      result = result.filter(order => filter.status?.includes(order.status));
    }

    // Применение сортировки
    result.sort((a, b) => {
      let valueA, valueB;

      switch (sort.field) {
        case 'date':
          valueA = new Date(a.orderDate).getTime();
          valueB = new Date(b.orderDate).getTime();
          break;
        case 'amount':
          valueA = a.totalAmount;
          valueB = b.totalAmount;
          break;
        default:
          return 0;
      }

      if (sort.direction === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    setFilteredOrders(result);
  }, [orders, filter, sort]);

  // Обработчики действий
  const handleViewDetails = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsModalVisible(true);
    }
  };

  const handleTrackOrder = (orderId: string) => {
    Alert.alert(
      t('orders.trackOrder'),
      t('orderDetails.trackingNotAvailable'),
      [{ text: t('common.ok') }]
    );
  };

  const handleReorder = (orderId: string) => {
    Alert.alert(
      t('orders.reorder'),
      t('orderDetails.reorderConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: () => {
            // Здесь будет логика повторного заказа
            Alert.alert(t('common.success'), t('orderDetails.reorderSuccess'));
          },
        },
      ]
    );
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: 'cancelled' } : order
    ));
    Alert.alert(t('common.success'), t('orderDetails.cancelSuccess'));
  };

  const handleStartShopping = () => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('Main', { screen: 'HomeTab' });
    }
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
      return <LoadingSpinner />;
    }

    if (orders.length === 0) {
      return <EmptyOrders onStartShopping={handleStartShopping} />;
    }

    return (
      <FlatList
        data={filteredOrders}
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
        ListEmptyComponent={
          <View style={styles.emptyFilterContainer}>
            <Text style={[styles.emptyFilterText, { color: theme.textSecondary }]}>
              {t('orderDetails.noFilterResults')}
            </Text>
          </View>
        }
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <OrdersHeader
        stats={stats}
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
      />
      
      {renderContent()}

      <OrderDetailsModal
        order={selectedOrder}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onTrackOrder={handleTrackOrder}
        onReorder={handleReorder}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  emptyFilterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyFilterText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default OrdersScreen;