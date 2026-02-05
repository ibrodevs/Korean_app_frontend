import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { OrderHistory } from '../../types/order';
import Text from '../Text';

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

  const getStatusColors = () => {
    switch (order.status) {
      case 'delivered':
        return [theme.secondary, `${theme.secondary}DD`];
      case 'cancelled':
      case 'returned':
      case 'refunded':
        return [theme.error, `${theme.error}DD`];
      case 'shipped':
      case 'outForDelivery':
        return [theme.primary, `${theme.primary}DD`];
      default:
        return [`${theme.textSecondary}`, `${theme.textSecondary}DD`];
    }
  };

  const getStatusIcon = () => {
    switch (order.status) {
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
        return 'wallet';
      default:
        return 'time';
    }
  };

  const getStatusGradient = () => {
    const colors = getStatusColors();
    return colors;
  };

  const canTrack = ['shipped', 'outForDelivery', 'delivered'].includes(order.status);
  const canCancel = ['pending', 'confirmed', 'processing'].includes(order.status);
  const canReorder = order.canReorder && order.status !== 'cancelled';

  const handleCancelOrder = () => {
    Alert.alert(
      t('orders.cancelOrder'),
      t('orders.cancelConfirm'),
      [
        { 
          text: t('common.no'), 
          style: 'cancel',
          onPress: () => console.log('Cancel pressed')
        },
        {
          text: t('common.yes'),
          style: 'destructive',
          onPress: () => onCancelOrder(order.id),
        },
      ],
      { cancelable: true }
    );
  };

  const renderItemsPreview = () => {
    const maxItems = 4;
    const remainingItems = order.items.length - maxItems;
    
    return (
      <View style={styles.itemsContainer}>
        {order.items.slice(0, maxItems).map((item, index) => (
          <View 
            key={item.id} 
            style={[
              styles.itemImageWrapper,
              { 
                marginLeft: index > 0 ? -12 : 0,
                zIndex: maxItems - index,
              }
            ]}
          >
            <View style={styles.itemImageContainer}>
              {item.image ? (
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.itemImage} 
                  resizeMode="cover" 
                />
              ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: theme.border }]}>
                  <Ionicons name="cube-outline" size={20} color={theme.textSecondary} />
                </View>
              )}
              {index === 0 && (
                <View style={[styles.itemCountBadge, { backgroundColor: theme.primary }]}>
                  <Text style={styles.itemCountText}>
                    {order.items.length}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
        
        {remainingItems > 0 && (
          <View style={[styles.remainingItems, { marginLeft: -12 }]}>
            <LinearGradient
              colors={[theme.primary, `${theme.primary}DD`]}
              style={styles.remainingItemsGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={[styles.remainingText, { color: '#FFFFFF' }]}>
                +{remainingItems}
              </Text>
            </LinearGradient>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: `${theme.border}60` },
      ]}
      onPress={() => onViewDetails(order.id)}
      activeOpacity={0.95}
    >
      {/* Декоративная полоска статуса */}
      <LinearGradient
        colors={getStatusGradient()}
        style={styles.statusStrip}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      {/* Верхняя часть с основной информацией */}
      <View style={styles.header}>
        <View style={styles.orderHeader}>
          <View style={styles.orderNumberSection}>
            <Text style={[styles.orderLabel, { color: theme.textSecondary }]}>
              {t('orders.order')}
            </Text>
            <Text style={[styles.orderNumber, { color: theme.heading }]}>
              #{order.orderNumber}
            </Text>
          </View>
          
          <View style={styles.dateSection}>
            <View style={styles.dateIconContainer}>
              <Ionicons name="calendar" size={14} color={theme.primary} />
            </View>
            <Text style={[styles.date, { color: theme.textSecondary }]}>
              {formatDate(order.orderDate)} • {formatTime(order.orderDate)}
            </Text>
          </View>
        </View>

        {/* Статус в современном стиле */}
        <LinearGradient
          colors={getStatusGradient()}
          style={styles.statusBadge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons
            name={getStatusIcon() as any}
            size={16}
            color="#FFFFFF"
          />
          <Text
            style={[styles.statusText, { color: '#FFFFFF' }]}
            numberOfLines={1}
          >
            {t(`orderStatus.${order.status}`)}
          </Text>
        </LinearGradient>
      </View>

      {/* Средняя часть с товарами и суммой */}
      <View style={styles.body}>
        {renderItemsPreview()}
        
        <View style={styles.amountSection}>
          <View style={styles.amountContainer}>
            <Text style={[styles.amountLabel, { color: theme.textSecondary }]}>
              {t('orders.total')}
            </Text>
            <Text style={[styles.amount, { color: theme.heading }]}>
              {order.currency} {order.totalAmount.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.detailsButton}>
            <TouchableOpacity
              onPress={() => onViewDetails(order.id)}
              style={[styles.detailsButtonInner, { backgroundColor: `${theme.primary}15` }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.detailsButtonText, { color: theme.primary }]}>
                {t('orders.viewDetails')}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Нижняя часть с быстрыми действиями */}
      <View style={[styles.footer, { borderTopColor: `${theme.border}30` }]}>
        <View style={styles.actionButtons}>

          {canCancel && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: `${theme.error}10` }]}
              onPress={handleCancelOrder}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle" size={20} color={theme.error} />
              <Text style={[styles.actionButtonText, { color: theme.error }]}>
                {t('orders.cancel')}
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
    width: '100%',
    borderRadius: 20,
    padding: 0,
    marginHorizontal: 0,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
  },
  statusStrip: {
    height: 4,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 16,
  },
  orderHeader: {
    flex: 1,
    marginRight: 12,
  },
  orderNumberSection: {
    marginBottom: 8,
  },
  orderLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  orderNumber: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    minWidth: 100,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemImageWrapper: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCountBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  itemCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  remainingItems: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  remainingItemsGradient: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  remainingText: {
    fontSize: 16,
    fontWeight: '800',
  },
  amountSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountContainer: {
    alignItems: 'flex-start',
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    opacity: 0.7,
  },
  amount: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  detailsButton: {
    alignItems: 'flex-end',
  },
  detailsButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default OrderCard;