import React, { useState } from 'react';
import {
  View,
  
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Text from '../../components/Text';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

// Компоненты
import OrderSummary from './OrderSummary';
import PaymentMethodSelector from './PaymentMethodSelector';
  import ShippingMethodSelector from './ShippingMethodSelector';

// Типы
import { ShippingAddress, ShippingMethod, PaymentMethod, OrderItem } from '../../types/order';
import { checkoutService } from '../../services/checkoutService';

interface ConfirmationStepProps {
  shippingAddress: ShippingAddress;
  notes: string;
  items: OrderItem[];
  onBack: () => void;
  onSuccess: (orderId: string) => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  shippingAddress,
  notes,
  items,
  onBack,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);

  // Рассчитываем суммы
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = selectedShipping?.price || 0;
  const tax = subtotal * 0.1; // 10% налог
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = async () => {
    if (!selectedShipping) {
      Alert.alert(t('checkout.title'), t('checkout.selectShipping'));
      return;
    }

    if (!selectedPayment) {
      Alert.alert(t('checkout.title'), t('checkout.selectPayment'));
      return;
    }

    setLoading(true);
    try {
      const orderId = await checkoutService.placeOrder({
        items,
        shippingAddress,
        shippingMethod: selectedShipping,
        paymentMethod: selectedPayment,
        notes,
        subtotal,
        shippingCost,
        tax,
        total,
      });

      onSuccess(orderId);
    } catch (error) {
      Alert.alert(t('common.error'), t('checkout.orderFailed'));
      console.error('Error placing order:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: ShippingAddress) => {
    return `${address.address}${
      address.apartment ? `, ${address.apartment}` : ''
    }, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Заголовок шага */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.heading }]}>
          {t('checkout.step2')}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t('checkout.confirmation')}
        </Text>
      </View>

      {/* Информация о доставке */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="location-outline" size={20} color={theme.primary} />
          <Text style={[styles.sectionTitle, { color: theme.heading }]}>
            {t('checkout.deliveryAddress')}
          </Text>
          <TouchableOpacity onPress={onBack} style={styles.editButton}>
            <Text style={[styles.editText, { color: theme.primary }]}>
              {t('common.edit')}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.addressDetails}>
          <Text style={[styles.addressName, { color: theme.text }]}>
            {shippingAddress.fullName}
          </Text>
          <Text style={[styles.addressPhone, { color: theme.text }]}>
            {shippingAddress.phoneNumber}
          </Text>
          <Text style={[styles.addressLine, { color: theme.text }]}>
            {formatAddress(shippingAddress)}
          </Text>
          {notes && (
            <View style={styles.notesContainer}>
              <Ionicons name="document-text-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.notes, { color: theme.textSecondary }]}>
                {notes}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Выбор способа доставки */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.heading }]}>
          {t('checkout.shippingMethod')}
        </Text>
        <ShippingMethodSelector
          selected={selectedShipping}
          onSelect={setSelectedShipping}
        />
      </View>

      {/* Выбор способа оплаты */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.heading }]}>
          {t('checkout.paymentMethod')}
        </Text>
        <PaymentMethodSelector
          selected={selectedPayment}
          onSelect={setSelectedPayment}
        />
      </View>

      {/* Список товаров */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.heading }]}>
          {t('checkout.items')} ({items.length})
        </Text>
        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: theme.text }]}>
                {item.product.name}
              </Text>
              {item.color && (
                <Text style={[styles.itemVariant, { color: theme.textSecondary }]}>
                  {t('product.color')}: {item.color}
                </Text>
              )}
              {item.size && (
                <Text style={[styles.itemVariant, { color: theme.textSecondary }]}>
                  {t('product.size')}: {item.size}
                </Text>
              )}
            </View>
            <View style={styles.itemPrice}>
              <Text style={[styles.itemQuantity, { color: theme.textSecondary }]}>
                x{item.quantity}
              </Text>
              <Text style={[styles.itemTotal, { color: theme.heading }]}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Итоговая сумма */}
      <OrderSummary
        subtotal={subtotal}
        shipping={shippingCost}
        tax={tax}
        total={total}
      />

      {/* Кнопки */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.backButton, { borderColor: theme.border }]}
          onPress={onBack}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={20} color={theme.text} />
          <Text style={[styles.buttonText, { color: theme.text }]}>
            {t('checkout.back')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.placeOrderButton, { backgroundColor: theme.primary }]}
          onPress={handlePlaceOrder}
          disabled={loading || !selectedShipping || !selectedPayment}
        >
          {loading ? (
            <Text style={[styles.buttonText, { color: theme.heading }]}>
              ...
            </Text>
          ) : (
            <>
              <Text style={[styles.buttonText, { color: theme.heading }]}>
                {t('checkout.placeOrder')}
              </Text>
              <Text style={[styles.totalAmount, { color: theme.heading }]}>
                ${total.toFixed(2)}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  editText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addressDetails: {
    marginLeft: 28,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  addressPhone: {
    fontSize: 14,
    marginBottom: 8,
  },
  addressLine: {
    fontSize: 14,
    lineHeight: 20,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  notes: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemVariant: {
    fontSize: 12,
    marginBottom: 2,
  },
  itemPrice: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    fontSize: 12,
    marginBottom: 4,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '700',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  backButton: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  placeOrderButton: {
    flex: 2,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 8,
  },
});

export default ConfirmationStep;