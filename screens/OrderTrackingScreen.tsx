import Ionicons from '@expo/vector-icons/Ionicons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTailwind } from '../utils/tailwindUtilities';

// Компоненты
import DeliveryInfo from '../components/tracking/DeliveryInfo';
import MapView from '../components/tracking/MapView';
import OrderActions from '../components/tracking/OrderActions';
import OrderHeader from '../components/tracking/OrderHeader';
import OrderItems from '../components/tracking/OrderItems';
import PickupInfo from '../components/tracking/PickupInfo';
import StatusTimeline from '../components/tracking/StatusTimeline';

// Типы и сервисы
import { trackingService } from '../services/trackingService';
import { RootStackParamList } from '../types/navigation';
import { OrderItem, OrderTracking, PickupLocation } from '../types/tracking';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'OrderTracking'>;

const OrderTrackingScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();

  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadTrackingData();
    
    // Автообновление каждые 30 секунд
    let interval: any = null;
    if (autoRefresh && tracking?.status !== 'delivered') {
      interval = setInterval(() => {
        loadTrackingData(false);
      }, 30000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [route.params.orderId, autoRefresh]);

  const loadTrackingData = async (showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      const data = await trackingService.getOrderTracking(route.params.orderId);
      setTracking(data);
    } catch (error) {
      Alert.alert(
        'Ошибка',
        'Не удалось загрузить данные отслеживания',
        [
          {
            text: 'Повторить',
            onPress: () => loadTrackingData(),
          },
          {
            text: 'Назад',
            onPress: () => navigation.goBack(),
          },
        ]
      );
      console.error('Error loading tracking data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadTrackingData(false);
  };

  const handleViewDetails = () => {
    navigation.goBack();
  };

  const handleContactSupport = () => {
    // Навигация к экрану поддержки - заглушка
    Alert.alert(
      'Связаться с поддержкой',
      'Центр помощи',
      [{ text: 'ОК' }]
    );
  };

  const handleTrackCarrier = (carrier: any) => {
    Linking.openURL(carrier.trackingUrl);
  };

  const handleContactDriver = () => {
    if (tracking?.driver?.phone) {
      Linking.openURL(`tel:${tracking.driver.phone}`);
    }
  };

  const handleViewMap = () => {
    setShowMap(true);
  };

  const handleItemPress = (item: OrderItem) => {
    navigation.navigate('ProductDetail', { productId: item.id });
  };

  const handleNavigateToPickup = (location: PickupLocation) => {
    const url = `https://maps.google.com/?q=${location.coordinates.latitude},${location.coordinates.longitude}`;
    Linking.openURL(url);
  };

  const handleCallPickup = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleCancelOrder = () => {
    // Логика отмены заказа
    Alert.alert(
      'Успешно',
      'Заказ отменен',
      [{ text: 'ОК', onPress: () => navigation.goBack() }]
    );
  };

  const canCancelOrder = (): boolean => {
    return tracking ? ['pending', 'processing', 'preparing'].includes(tracking.status) : false;
  };

  if (loading || !tracking) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={theme.background === '#FFFFFF' ? 'dark-content' : 'light-content'}
          backgroundColor={theme.navBackground}
        />
        {/* Здесь можно добавить индикатор загрузки */}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.background === '#FFFFFF' ? 'dark-content' : 'light-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Кнопка назад */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Хедер с информацией о заказе */}
        <OrderHeader
          tracking={tracking}
          onRefresh={handleRefresh}
          onViewDetails={handleViewDetails}
          onContactSupport={handleContactSupport}
          refreshing={refreshing}
        />

        {/* Товары в заказе */}
        <OrderItems
          items={tracking.items}
          onItemPress={handleItemPress}
        />

        {/* Таймлайн статусов */}
        <StatusTimeline
          timeline={tracking.timeline}
          currentStatus={tracking.status}
        />

        {/* Информация о пункте выдачи или доставке */}
        {tracking.deliveryType === 'pickup' && tracking.pickupLocation ? (
          <PickupInfo
            location={tracking.pickupLocation}
            onNavigate={handleNavigateToPickup}
            onCall={handleCallPickup}
          />
        ) : (
          <DeliveryInfo
            tracking={tracking}
            onTrackCarrier={handleTrackCarrier}
            onContactDriver={handleContactDriver}
            onViewMap={handleViewMap}
          />
        )}

        {/* Действия с заказом */}
        <OrderActions
          orderNumber={tracking.orderNumber}
          trackingNumber={tracking.trackingNumber}
          onViewOrderDetails={handleViewDetails}
          onContactSupport={handleContactSupport}
          onCancelOrder={handleCancelOrder}
          canCancel={canCancelOrder()}
        />
      </ScrollView>

      {/* Модальное окно с картой */}
      <Modal
        visible={showMap}
        animationType="slide"
        onRequestClose={() => setShowMap(false)}
      >
        {tracking.currentLocation && (
          <MapView
            currentLocation={tracking.currentLocation}
            destinationLocation={{
              latitude: 0,
              longitude: 0
            }}
            onLocationPress={() => setShowMap(false)}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
});

export default OrderTrackingScreen;