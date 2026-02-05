import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { OrderHistory } from '../../types/order';
import Text from '../Text';

interface OrderDetailsModalProps {
  order: OrderHistory | null;
  visible: boolean;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
  onReorder: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  onWriteReview?: (orderId: string) => void;
}

const { width, height } = Dimensions.get('window');

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  visible,
  onClose,
  onTrackOrder,
  onReorder,
  onCancelOrder,
  onWriteReview,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 70,
          friction: 12,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return '-';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    if (amount === undefined || amount === null) {
      return '-';
    }
    const symbol = currency === 'USD' ? '$' : '';
    return `${symbol}${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return theme.secondary;
      case 'cancelled':
      case 'returned':
        return theme.error;
      case 'shipped':
      case 'outForDelivery':
        return theme.primary;
      default:
        return theme.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'checkmark-circle';
      case 'shipped':
      case 'outForDelivery':
        return 'rocket';
      case 'cancelled':
        return 'close-circle';
      case 'returned':
        return 'refresh-circle';
      case 'refunded':
        return 'cash';
      default:
        return 'time';
    }
  };

  const canTrack = order
    ? ['shipped', 'outForDelivery', 'delivered'].includes(order.status)
    : false;
  const canReorder = order ? order.canReorder && order.status !== 'cancelled' : false;
  const canCancel = order ? ['pending', 'confirmed', 'processing'].includes(order.status) : false;
  const canWriteReview = order ? order.status === 'delivered' : false;

  const handleBackdropPress = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleBackdropPress}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.card,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Swipe Handle */}
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: `${theme.border}80` }]} />
          </View>
        </TouchableWithoutFeedback>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: theme.heading }]}>
              {t('orderDetails.title')}
            </Text>
            {order && (
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                #{order.orderNumber}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={handleBackdropPress}
            style={[styles.closeButton, { backgroundColor: `${theme.border}20` }]}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={22} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {!order ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color={`${theme.textSecondary}40`} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {t('orderDetails.noOrderSelected')}
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            bounces={false}
          >
            {/* Order Status Banner */}
            <LinearGradient
              colors={[`${getStatusColor(order.status)}20`, `${getStatusColor(order.status)}05`]}
              style={[styles.statusBanner, { borderColor: `${getStatusColor(order.status)}30` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statusContent}>
                <View style={styles.statusLeft}>
                  <View style={[styles.statusIconContainer, { backgroundColor: getStatusColor(order.status) }]}>
                    <Ionicons name={getStatusIcon(order.status) as any} size={20} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={[styles.statusTitle, { color: theme.heading }]}>
                      {t(`orderStatus.${order.status}`)}
                    </Text>
                    <Text style={[styles.statusSubtitle, { color: theme.textSecondary }]}>
                      {t(`orderStatus.${order.status}Description`)}
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={[styles.statusBadgeText, { color: '#FFFFFF' }]}>
                    {order.status === 'delivered' ? '✓' : '→'}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* Order Summary */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="receipt-outline" size={20} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.heading }]}>
                  {t('orderDetails.summary')}
                </Text>
              </View>
              
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                    {t('orderDetails.orderDate')}
                  </Text>
                  <Text style={[styles.summaryValue, { color: theme.heading }]}>
                    {formatDate(order.orderDate)}
                  </Text>
                  <Text style={[styles.summaryMeta, { color: theme.textSecondary }]}>
                    {formatTime(order.orderDate)}
                  </Text>
                </View>

                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                    {t('orderDetails.total')}
                  </Text>
                  <Text style={[styles.summaryValue, { color: theme.heading }]}>
                    {formatCurrency(order.totalAmount, order.currency)}
                  </Text>
                  <Text style={[styles.summaryMeta, { color: theme.textSecondary }]}>
                    {order.items.length} {t('orderDetails.items')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Order Items */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="cube-outline" size={20} color={theme.secondary} />
                <Text style={[styles.sectionTitle, { color: theme.heading }]}>
                  {t('orderDetails.items')}
                </Text>
                <View style={styles.itemsCount}>
                  <Text style={[styles.itemsCountText, { color: theme.textSecondary }]}>
                    {order.items.length}
                  </Text>
                </View>
              </View>

              <View style={styles.itemsList}>
                {order.items.map((item, index) => (
                  <View
                    key={item.id}
                    style={[
                      styles.itemCard,
                      { 
                        backgroundColor: theme.navBackground,
                        borderColor: `${theme.border}30`,
                        marginTop: index > 0 ? 10 : 0,
                      }
                    ]}
                  >
                    {item.image ? (
                      <Image 
                        source={{ uri: item.image }} 
                        style={styles.itemImage} 
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.imagePlaceholder, { backgroundColor: `${theme.border}40` }]}>
                        <Ionicons name="cube-outline" size={24} color={theme.textSecondary} />
                      </View>
                    )}
                    
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: theme.heading }]} numberOfLines={2}>
                        {item.name || item.product?.name}
                      </Text>
                      <View style={styles.itemMeta}>
                        <Text style={[styles.itemQuantity, { color: theme.textSecondary }]}>
                          {t('orderDetails.quantity')}: {item.quantity}
                        </Text>
                        {item.size && (
                          <Text style={[styles.itemSize, { color: theme.textSecondary }]}>
                            • {item.size}
                          </Text>
                        )}
                      </View>
                      {item.color && (
                        <View style={styles.colorIndicator}>
                          <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                          <Text style={[styles.colorText, { color: theme.textSecondary }]}>
                            {item.color}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.itemPrice}>
                      <Text style={[styles.priceValue, { color: theme.heading }]}>
                        {formatCurrency(item.price, order.currency)}
                      </Text>
                      <Text style={[styles.priceSubtotal, { color: theme.textSecondary }]}>
                        {formatCurrency((item.price || 0) * (item.quantity || 1), order.currency)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Total Amount */}
              <View style={[styles.totalContainer, { borderTopColor: `${theme.border}30` }]}>
                <Text style={[styles.totalLabel, { color: theme.heading }]}>
                  {t('orderDetails.total')}
                </Text>
                <View style={styles.totalValueContainer}>
                  <Text style={[styles.totalValue, { color: theme.primary }]}>
                    {formatCurrency(order.totalAmount, order.currency)}
                  </Text>
                  <Text style={[styles.totalCurrency, { color: theme.textSecondary }]}>
                    {order.currency}
                  </Text>
                </View>
              </View>
            </View>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="location-outline" size={20} color={theme.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.heading }]}>
                    {t('orderDetails.shippingAddress')}
                  </Text>
                </View>
                
                <View style={[styles.addressCard, { backgroundColor: theme.navBackground }]}>
                  <Ionicons name="home-outline" size={20} color={theme.primary} />
                  <View style={styles.addressInfo}>
                    <Text style={[styles.addressName, { color: theme.heading }]}>
                      {order.shippingAddress.fullName || order.shippingAddress.name}
                    </Text>
                    <Text style={[styles.addressText, { color: theme.textSecondary }]}>
                      {order.shippingAddress.street}
                    </Text>
                    <Text style={[styles.addressText, { color: theme.textSecondary }]}>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </Text>
                    <Text style={[styles.addressText, { color: theme.textSecondary }]}>
                      {order.shippingAddress.country}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Tracking Info */}
            {order.trackingNumber && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="navigate-outline" size={20} color={theme.secondary} />
                  <Text style={[styles.sectionTitle, { color: theme.heading }]}>
                    {t('orderDetails.tracking')}
                  </Text>
                </View>
                
                <View style={[styles.trackingCard, { backgroundColor: theme.navBackground }]}>
                  <View style={styles.trackingInfo}>
                    <Text style={[styles.trackingNumber, { color: theme.heading }]}>
                      #{order.trackingNumber}
                    </Text>
                    <Text style={[styles.trackingCarrier, { color: theme.textSecondary }]}>
                      {typeof order.carrier === 'string'
                        ? order.carrier
                        : order.carrier?.name || order.carrier?.id || t('orderDetails.standardShipping')}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* Action Buttons */}
        {order && (
          <View style={[styles.actionsContainer, { borderTopColor: `${theme.border}30` }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.actionsScroll}
            >

              {canCancel && onCancelOrder && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: `${theme.error}15` }]}
                  onPress={() => onCancelOrder(order.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close-circle" size={18} color={theme.error} />
                  <Text style={[styles.actionButtonText, { color: theme.error }]}>
                    {t('orders.cancel')}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.actionButton, styles.supportButton, { backgroundColor: `${theme.border}20` }]}
                activeOpacity={0.8}
              >
                <Ionicons name="help-circle-outline" size={18} color={theme.textSecondary} />
                <Text style={[styles.actionButtonText, { color: theme.textSecondary }]}>
                  {t('orders.support')}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height * 0.88,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
    overflow: 'hidden',
  },
  handleContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  statusBanner: {
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: 24,
    overflow: 'hidden',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.8,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  statusBadgeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  itemsCount: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  itemsCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    padding: 16,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  summaryMeta: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.7,
  },
  itemsList: {
    gap: 10,
  },
  itemCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 14,
  },
  imagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 20,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  itemQuantity: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemSize: {
    fontSize: 12,
    fontWeight: '500',
  },
  colorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  colorText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  itemPrice: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  priceSubtotal: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    marginTop: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalValueContainer: {
    alignItems: 'flex-end',
  },
  totalValue: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  totalCurrency: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 2,
    opacity: 0.7,
  },
  addressCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 18,
    alignItems: 'flex-start',
    gap: 14,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    opacity: 0.8,
  },
  trackingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 18,
  },
  trackingInfo: {
    flex: 1,
  },
  trackingNumber: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  trackingCarrier: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.7,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    marginLeft: 12,
  },
  trackButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    borderTopWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  actionsScroll: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  supportButton: {
    paddingHorizontal: 20,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OrderDetailsModal;