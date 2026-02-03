import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import Text from '../Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OrderHistory } from '../../types/order';

interface OrderDetailsModalProps {
  order: OrderHistory | null;
  visible: boolean;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
  onReorder: (orderId: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  visible,
  onClose,
  onTrackOrder,
  onReorder,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  if (!order || !visible) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'delivered':
        return theme.secondary;
      case 'cancelled':
      case 'returned':
      case 'refunded':
        return theme.error;
      case 'shipped':
      case 'outForDelivery':
        return theme.primary;
      default:
        return theme.textSecondary;
    }
  };

  const getStatusDescription = () => {
    switch (order.status) {
      case 'pending':
        return t('orderDetails.statusPending');
      case 'confirmed':
        return t('orderDetails.statusConfirmed');
      case 'processing':
        return t('orderDetails.statusProcessing');
      case 'shipped':
        return order.estimatedDelivery
          ? `${t('orderDetails.statusShipped')} - ${t('orders.estimatedDelivery')}: ${order.estimatedDelivery}`
          : t('orderDetails.statusShipped');
      case 'delivered':
        return order.actualDelivery
          ? `${t('orders.deliveredOn')}: ${order.actualDelivery}`
          : t('orderDetails.statusDelivered');
      case 'cancelled':
        return t('orderDetails.statusCancelled');
      case 'returned':
        return t('orderDetails.statusReturned');
      default:
        return '';
    }
  };

  const handleDownloadInvoice = async () => {
    if (order.invoiceUrl) {
      try {
        const supported = await Linking.canOpenURL(order.invoiceUrl);
        if (supported) {
          await Linking.openURL(order.invoiceUrl);
        } else {
          Alert.alert(t('common.error'), t('orderDetails.cannotOpenInvoice'));
        }
      } catch (error) {
        Alert.alert(t('common.error'), t('orderDetails.invoiceError'));
      }
    }
  };

  const handleContactSupport = () => {
    Alert.alert(
      t('orders.contactSupport'),
      t('orderDetails.supportMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.call'), onPress: () => Linking.openURL('tel:+1234567890') },
        { text: t('common.email'), onPress: () => Linking.openURL('mailto:support@koreanstore.com') },
      ]
    );
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
        {/* Заголовок */}
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: theme.heading }]}>
            {t('orders.order')} #{order.orderNumber}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent}>
          {/* Статус заказа */}
          <View style={styles.section}>
            <View style={styles.statusHeader}>
              <View style={styles.statusBadgeContainer}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor() + '20' },
                  ]}
                >
                  <Ionicons
                    name="time"
                    size={20}
                    color={getStatusColor()}
                  />
                  <Text style={[styles.statusText, { color: getStatusColor() }]}>
                    {t(`orderStatus.${order.status}`)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.statusDescription, { color: theme.text }]}>
                {getStatusDescription()}
              </Text>
            </View>
          </View>

          {/* Информация о заказе */}
          <View style={[styles.section, styles.infoGrid]}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                {t('orders.orderPlaced')}
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {formatDate(order.orderDate)}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                {t('orders.orderTotal')}
              </Text>
              <Text style={[styles.infoValue, { color: theme.heading }]}>
                {order.currency} {order.totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Товары */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.heading }]}>
              {t('orders.items')} ({order.items.length})
            </Text>
            {order.items.map((item) => (
              <View key={item.id} style={styles.productItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={[styles.productVariant, { color: theme.textSecondary }]}>
                    {item.variant}
                  </Text>
                  <View style={styles.productBottom}>
                    <Text style={[styles.productPrice, { color: theme.heading }]}>
                      {order.currency} {item.price.toFixed(2)}
                    </Text>
                    <Text style={[styles.productQuantity, { color: theme.textSecondary }]}>
                      ×{item.quantity}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Адрес доставки */}
          {order.shippingAddress && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.heading }]}>
                {t('orders.shippingAddress')}
              </Text>
              <View style={styles.addressCard}>
                <Ionicons name="location" size={20} color={theme.primary} />
                <View style={styles.addressText}>
                  <Text style={[styles.addressName, { color: theme.text }]}>
                    {order.shippingAddress.fullName}
                  </Text>
                  <Text style={[styles.addressLine, { color: theme.text }]}>
                    {order.shippingAddress.street}
                  </Text>
                  <Text style={[styles.addressLine, { color: theme.text }]}>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </Text>
                  <Text style={[styles.addressLine, { color: theme.text }]}>
                    {order.shippingAddress.country}
                  </Text>
                  <Text style={[styles.addressPhone, { color: theme.textSecondary }]}>
                    📞 {order.shippingAddress.phone}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Способ оплаты */}
          {order.paymentMethod && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.heading }]}>
                {t('orders.paymentMethod')}
              </Text>
              <View style={styles.paymentCard}>
                <Ionicons name="card" size={20} color={theme.primary} />
                <View style={styles.paymentText}>
                  <Text style={[styles.paymentType, { color: theme.text }]}>
                    {order.paymentMethod.type === 'card'
                      ? `${order.paymentMethod.brand} •••• ${order.paymentMethod.last4}`
                      : t(`payment.${order.paymentMethod.type}`)}
                  </Text>
                  <Text style={[styles.paymentStatus, { color: theme.textSecondary }]}>
                    {t('payment.paid')} {order.currency} {order.totalAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Номер отслеживания */}
          {order.trackingNumber && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.heading }]}>
                {t('orderDetails.tracking')}
              </Text>
              <View style={styles.trackingCard}>
                <Ionicons name="cube" size={20} color={theme.primary} />
                <View style={styles.trackingText}>
                  <Text style={[styles.trackingNumber, { color: theme.text }]}>
                    {order.trackingNumber}
                  </Text>
                  <Text style={[styles.trackingCarrier, { color: theme.textSecondary }]}>
                    {order.carrier?.name || 'Unknown carrier'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.trackButton, { backgroundColor: theme.primary }]}
                  onPress={() => onTrackOrder(order.id)}
                >
                  <Text style={[styles.trackButtonText, { color: theme.heading }]}>
                    {t('orders.trackOrder')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Примечания */}
          {order.notes && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.heading }]}>
                {t('orderDetails.notes')}
              </Text>
              <View style={[styles.notesCard, { backgroundColor: theme.navBackground + '50' }]}>
                <Text style={[styles.notesText, { color: theme.text }]}>
                  {order.notes}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Нижние кнопки */}
        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <View style={styles.footerButtons}>
            {order.invoiceUrl && (
              <TouchableOpacity
                style={[styles.footerButton, styles.secondaryButton, { borderColor: theme.border }]}
                onPress={handleDownloadInvoice}
              >
                <Ionicons name="document-text" size={18} color={theme.primary} />
                <Text style={[styles.footerButtonText, { color: theme.primary }]}>
                  {t('orders.downloadInvoice')}
                </Text>
              </TouchableOpacity>
            )}

            {order.canReorder && (
              <TouchableOpacity
                style={[styles.footerButton, styles.primaryButton, { backgroundColor: theme.primary }]}
                onPress={() => {
                  onClose();
                  onReorder(order.id);
                }}
              >
                <Ionicons name="repeat" size={18} color={theme.heading} />
                <Text style={[styles.footerButtonText, { color: theme.heading }]}>
                  {t('orders.reorder')}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.footerButton, styles.helpButton]}
              onPress={handleContactSupport}
            >
              <Ionicons name="help-circle" size={18} color={theme.textSecondary} />
              <Text style={[styles.footerButtonText, { color: theme.textSecondary }]}>
                {t('orders.needHelp')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  modalContent: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  statusHeader: {
    alignItems: 'center',
  },
  statusBadgeContainer: {
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productVariant: {
    fontSize: 14,
    marginBottom: 8,
  },
  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  productQuantity: {
    fontSize: 14,
  },
  addressCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    gap: 12,
  },
  addressText: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 14,
    lineHeight: 20,
  },
  addressPhone: {
    fontSize: 14,
    marginTop: 4,
  },
  paymentCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    gap: 12,
  },
  paymentText: {
    flex: 1,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentStatus: {
    fontSize: 14,
  },
  trackingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    gap: 12,
  },
  trackingText: {
    flex: 1,
  },
  trackingNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  trackingCarrier: {
    fontSize: 14,
  },
  trackButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  trackButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notesCard: {
    padding: 16,
    borderRadius: 12,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  footerButtons: {
    gap: 12,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {},
  secondaryButton: {
    borderWidth: 1,
  },
  helpButton: {},
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderDetailsModal;