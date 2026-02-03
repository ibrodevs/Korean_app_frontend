import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { useTailwind } from '../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Компоненты
import CheckoutStepper from '../components/checkout/CheckoutStepper';
import ShippingStep from '../components/checkout/ShippingStep';
import ConfirmationStep from '../components/checkout/ConfirmationStep';
import OrderSuccess from '../components/checkout/OrderSuccess';

// Типы и сервисы
import { RootStackParamList } from '../types/navigation';
import { ShippingAddress, OrderItem } from '../types/order';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'Checkout'>;

const CheckoutScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    address: null as ShippingAddress | null,
    notes: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Получаем товары из параметров навигации
  // For now, using empty array - params would come from cart
  const items: OrderItem[] = [];

  useEffect(() => {
    if (items.length === 0) {
      Alert.alert(t('checkout.title'), t('checkout.emptyCart'));
      navigation.goBack();
    }
  }, [items]);

  const handleUpdateShippingData = (data: Partial<typeof shippingData>) => {
    setShippingData(prev => ({ ...prev, ...data }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!shippingData.address) {
        Alert.alert(t('checkout.title'), t('checkout.selectAddress'));
        return;
      }
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleOrderSuccess = (newOrderId: string) => {
    setOrderId(newOrderId);
    setShowSuccess(true);
  };

  const handleContinueShopping = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleTrackOrder = () => {
    // Переход на экран отслеживания заказа
    navigation.navigate('OrderTracking', { orderId });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.background === '#FFFFFF' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.navBackground}
      />

      {/* Степпер */}
      <CheckoutStepper currentStep={currentStep} />

      {/* Контент шага */}
      {currentStep === 1 ? (
        <ShippingStep
          shippingData={shippingData}
          onUpdate={handleUpdateShippingData}
          onNext={handleNextStep}
        />
      ) : (
        <ConfirmationStep
          shippingAddress={shippingData.address!}
          notes={shippingData.notes}
          items={items}
          onBack={handlePrevStep}
          onSuccess={handleOrderSuccess}
        />
      )}

      {/* Модальное окно успешного заказа */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <OrderSuccess
          orderNumber={orderId}
          onContinueShopping={handleContinueShopping}
          onViewOrders={handleTrackOrder}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CheckoutScreen;