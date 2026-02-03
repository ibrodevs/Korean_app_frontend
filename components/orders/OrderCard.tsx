import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Text from '../Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OrderHistory } from '../../types/order';

interface OrderCardProps {
  order: OrderHistory;
  onViewDetails: (orderId: string) => void;
  onTrackOrder: (orderId: string) => void;
  onReorder: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onTrackOrder,
  onReorder,
  onCancelOrder,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
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

  const getStatusIcon = () => {
    switch (order.status) {
      case 'delivered':
        return 'checkmark-circle';
      case 'shipped':
      case 'outForDelivery':
        return 'car';
      case 'cancelled':
        return 'close-circle';
      case 'returned':
        return 'arrow-back-circle';
      case 'refunded':
        return 'cash';
      default:
        return 'time';
    }
  };

  const canTrack = ['shipped', 'outForDelivery', 'delivered'].includes(order.status);
  const canCancel = ['pending', 'confirmed', 'processing'].includes(order.status);
  const canReorder = order.canReorder && order.status !== 'cancelled';

  const handleCancelOrder = () => {
    Alert.alert(
      t('orders.cancelOrder'),
      t('orders.cancelConfirm'),
      [
        { text: t('common.no'), style: 'cancel' },
        {
          text: t('common.yes'),
          style: 'destructive',
          onPress: () => onCancelOrder(order.id),
        },
      ]
    );
  };

  const renderItemsPreview = () => {
    const maxItems = 3;
    const remainingItems = order.items.length - maxItems;
    
    return (
      <View style={styles.itemsContainer}>
        {order.items.slice(0, maxItems).map((item, index) => (
          <View key={item.id} style={[styles.itemImage, { marginLeft: index > 0 ? -10 : 0 }]}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={[styles.imagePlaceholder, { backgroundColor: theme.border }]}>
                <Ionicons name="cube-outline" size={20} color={theme.textSecondary} />
              </View>
            )}
          </View>
        ))}
        
        {remainingItems > 0 && (
          <View style={[styles.remainingItems, { backgroundColor: theme.primary }]}>
            <Text style={[styles.remainingText, { color: theme.heading }]}>
              +{remainingItems}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.card }]}
      onPress={() => onViewDetails(order.id)}
      activeOpacity={0.9}
    >
      {/* Верхняя часть с основной информацией */}
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <View style={styles.orderNumberContainer}>
            <Text style={[styles.orderLabel, { color: theme.textSecondary }]}>
              {t('orders.order')}
            </Text>
            <Text style={[styles.orderNumber, { color: theme.heading }]}>
              #{order.orderNumber}
            </Text>
          </View>
          
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.date, { color: theme.textSecondary }]}>
              {formatDate(order.orderDate)} • {formatTime(order.orderDate)}
            </Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor() + '20' },
            ]}
          >
            <Ionicons
              name={getStatusIcon() as any}
              size={14}
              color={getStatusColor()}
            />
            <Text
              style={[styles.statusText, { color: getStatusColor() }]}
              numberOfLines={1}
            >
              {t(`orderStatus.${order.status}`)}
            </Text>
          </View>
        </View>
      </View>

      {/* Средняя часть с товарами */}
      <View style={styles.body}>
        {renderItemsPreview()}
        
        <View style={styles.details}>
          <Text style={[styles.itemsCount, { color: theme.text }]}>
            {order.items.length} {t('orders.items')}
          </Text>
          
          <View style={styles.amountContainer}>
            <Text style={[styles.amountLabel, { color: theme.textSecondary }]}>
              {t('orders.amount')}
            </Text>
            <Text style={[styles.amount, { color: theme.heading }]}>
              {order.currency} {order.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Нижняя часть с действиями */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        {/* Основное действие в зависимости от статуса */}
        <TouchableOpacity
          style={[styles.primaryAction, { backgroundColor: theme.primary }]}
          onPress={() => onViewDetails(order.id)}
        >
          <Text style={[styles.primaryActionText, { color: theme.heading }]}>
            {t('orders.viewDetails')}
          </Text>
        </TouchableOpacity>

        {/* Дополнительные действия */}
        <View style={styles.secondaryActions}>
          {canTrack && order.trackingNumber && (
            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={() => onTrackOrder(order.id)}
            >
              <Ionicons name="navigate" size={18} color={theme.primary} />
              <Text style={[styles.secondaryActionText, { color: theme.primary }]}>
                {t('orders.trackOrder')}
              </Text>
            </TouchableOpacity>
          )}

          {canReorder && (
            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={() => onReorder(order.id)}
            >
              <Ionicons name="repeat" size={18} color={theme.secondary} />
              <Text style={[styles.secondaryActionText, { color: theme.secondary }]}>
                {t('orders.reorder')}
              </Text>
            </TouchableOpacity>
          )}

          {canCancel && (
            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={handleCancelOrder}
            >
              <Ionicons name="close-circle" size={18} color={theme.error} />
              <Text style={[styles.secondaryActionText, { color: theme.error }]}>
                {t('orders.cancelOrder')}
              </Text>
            </TouchableOpacity>
          )}

          {order.status === 'delivered' && (
            <TouchableOpacity style={styles.secondaryAction}>
              <Ionicons name="star" size={18} color={theme.primary} />
              <Text style={[styles.secondaryActionText, { color: theme.primary }]}>
                {t('orders.writeReview')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumberContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  orderLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 6,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '800',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    marginLeft: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 80,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFF',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingItems: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  remainingText: {
    fontSize: 14,
    fontWeight: '700',
  },
  details: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 50,
  },
  itemsCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  amount: {
    fontSize: 20,
    fontWeight: '800',
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: 16,
  },
  primaryAction: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  secondaryAction: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  secondaryActionText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default OrderCard;