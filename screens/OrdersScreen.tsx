import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Animated,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
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
import { RootStackParamList } from '../types/navigation';
import {
  MOCK_ORDERS,
  OrderFilter,
  OrderHistory,
  OrderSort,
  OrderStats,
} from '../types/order';

const OrdersScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Анимации
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 150],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

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
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Загрузка данных
  const loadOrders = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockOrders = MOCK_ORDERS.map(order => ({
        ...order,
        status: getRandomStatus(),
        orderDate: getRandomDate(),
      }));
      setOrders(mockOrders);
      setLoading(false);
      setRefreshing(false);
    }, 1200);
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
    
    // Находим самую популярную категорию
    const categoryCount: Record<string, number> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = item.category || 'Uncategorized';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });
    
    const favouriteCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Cosmetics';

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
      favouriteCategory,
      lastOrderDate: lastOrder?.orderDate,
    });
  }, [orders]);

  // Фильтрация и сортировка заказов
  useEffect(() => {
    let result = [...orders];

    // Применение фильтров
    if (filter.status && filter.status.length > 0) {
      result = result.filter(order => filter.status?.includes(order.status));
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.trim().toLowerCase();
      if (query.length > 0) {
        result = result.filter(order => {
          const orderNumber = order.orderNumber?.toLowerCase() ?? '';
          const itemMatch = order.items.some(item => {
            const name = item.name || item.product?.name || '';
            return name.toLowerCase().includes(query);
          });
          return orderNumber.includes(query) || itemMatch;
        });
      }
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
    const order = orders.find(o => o.id === orderId);
    Alert.alert(
      t('orders.trackOrder'),
      order?.trackingNumber 
        ? t('orderDetails.trackingAvailable', { trackingNumber: order.trackingNumber })
        : t('orderDetails.trackingNotAvailable'),
      [
        { text: t('common.ok'), style: 'cancel' },
        order?.trackingNumber && {
          text: t('orderDetails.viewTracking'),
          onPress: () => navigation.navigate('OrderTracking', { orderId }),
        },
      ].filter(Boolean) as any
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
          style: 'default',
          onPress: () => {
            // Здесь будет логика повторного заказа
            Alert.alert(t('common.success'), t('orderDetails.reorderSuccess'));
          },
        },
      ]
    );
  };

  const handleCancelOrder = (orderId: string) => {
    Alert.alert(
      t('orders.cancelOrder'),
      t('orderDetails.cancelConfirm'),
      [
        { text: t('common.no'), style: 'cancel' },
        {
          text: t('common.yes'),
          style: 'destructive',
          onPress: () => {
            setOrders(orders.map(order =>
              order.id === orderId ? { ...order, status: 'cancelled' } : order
            ));
            Alert.alert(t('common.success'), t('orderDetails.cancelSuccess'));
          },
        },
      ]
    );
  };

  const handleWriteReview = (orderId: string) => {
    navigation.navigate('WriteReview', { orderId });
  };

  const handleStartShopping = () => {
    navigation.navigate('Main', { 
      screen: 'HomeTab', 
      params: { screen: 'Home' }
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      listener: (event: any) => {
        const offset = event.nativeEvent.contentOffset.y;
        setShowScrollTop(offset > 300);
      },
      useNativeDriver: false,
    }
  );

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const flatListRef = useRef<FlatList>(null);

  const renderOrderItem = ({ item, index }: { item: OrderHistory; index: number }) => (
    <Animated.View
      style={{
        opacity: scrollY.interpolate({
          inputRange: [0, 100],
          outputRange: [1, 0.9],
          extrapolate: 'clamp',
        }),
        transform: [
          {
            scale: scrollY.interpolate({
              inputRange: [-1, 0, 100, 101],
              outputRange: [1, 1, 0.97, 0.97],
            }),
          },
        ],
      }}
    >
      <OrderCard
        order={item}
        onViewDetails={handleViewDetails}
        onTrackOrder={handleTrackOrder}
        onReorder={handleReorder}
        onCancelOrder={handleCancelOrder}
        onWriteReview={handleWriteReview}
      />
    </Animated.View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            {t('orders.loadingOrders')}
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
      <>
        <Animated.FlatList
          ref={flatListRef}
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
              progressBackgroundColor={theme.card}
            />
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListHeaderComponent={
            <OrdersHeader
              stats={stats}
              filter={filter}
              sort={sort}
              onFilterChange={setFilter}
              onSortChange={setSort}
              onSearch={(query) =>
                setFilter(prev => ({
                  ...prev,
                  searchQuery: query.length ? query : undefined,
                }))
              }
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyFilterContainer}>
              <Ionicons 
                name="funnel-outline" 
                size={48} 
                color={`${theme.textSecondary}40`} 
              />
              <Text style={[styles.emptyFilterTitle, { color: theme.heading }]}>
                {t('orderDetails.noFilterResults')}
              </Text>
              <Text style={[styles.emptyFilterText, { color: theme.textSecondary }]}>
                {t('orderDetails.tryDifferentFilters')}
              </Text>
              <TouchableOpacity
                style={[styles.clearFilterButton, { backgroundColor: theme.primary }]}
                onPress={() => setFilter({})}
              >
                <Text style={[styles.clearFilterText, { color: '#FFFFFF' }]}>
                  {t('common.clearFilters')}
                </Text>
              </TouchableOpacity>
            </View>
          }
          ListFooterComponent={
            filteredOrders.length > 0 ? (
              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                  {t('orders.showing')} {filteredOrders.length} {t('orders.of')} {orders.length} {t('orders.orders')}
                </Text>
              </View>
            ) : null
          }
        />

        {/* Кнопка прокрутки наверх */}
        {showScrollTop && (
          <TouchableOpacity
            style={[styles.scrollTopButton, { backgroundColor: theme.primary }]}
            onPress={scrollToTop}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-up" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.navBackground}
      />

      {/* Анимированный фон для статус бара */}
      <Animated.View 
        style={[
          styles.statusBarBackground,
          { 
            backgroundColor: theme.navBackground,
            opacity: headerOpacity 
          }
        ]}
      />

      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Декоративные элементы */}
      <LinearGradient
        colors={[`${theme.primary}05`, 'transparent']}
        style={[styles.decorativeCircle1, { 
          backgroundColor: `${theme.primary}03`
        }]}
      />
      <View style={[styles.decorativeCircle2, { 
        backgroundColor: `${theme.secondary}02`
      }]} />

      <OrderDetailsModal
        order={selectedOrder}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onTrackOrder={handleTrackOrder}
        onReorder={handleReorder}
        onCancelOrder={handleCancelOrder}
        onWriteReview={handleWriteReview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
    zIndex: 1000,
  },
  content: {
    flex: 1,
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
  emptyFilterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyFilterTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyFilterText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
    marginBottom: 24,
  },
  clearFilterButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  clearFilterText: {
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.7,
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: '30%',
    right: -100,
    opacity: 0.3,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: '20%',
    left: -75,
    opacity: 0.2,
  },
});

export default OrdersScreen;