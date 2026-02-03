import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import Text from '../Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OrderTracking } from '../../types/tracking';

interface OrderHeaderProps {
  tracking: OrderTracking;
  onRefresh: () => void;
  onViewDetails: () => void;
  onContactSupport: () => void;
  refreshing?: boolean;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({
  tracking,
  onRefresh,
  onViewDetails,
  onContactSupport,
  refreshing = false,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleShareTracking = async () => {
    try {
      await Share.share({
        message: `Track your KoreanStore order #${tracking.orderNumber}\nTracking number: ${tracking.trackingNumber}\nStatus: ${t(`orderStatus.${tracking.status}`)}\n${tracking.carrier.trackingUrl}`,
        title: `Order Tracking - ${tracking.orderNumber}`,
      });
    } catch (error) {
      console.error('Error sharing tracking:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = () => {
    switch (tracking.status) {
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

  const isDelayed = () => {
    if (tracking.status === 'delivered' && tracking.actualDelivery) {
      const estimated = new Date(tracking.estimatedDelivery);
      const actual = new Date(tracking.actualDelivery);
      return actual > estimated;
    }
    if (tracking.status !== 'delivered') {
      const estimated = new Date(tracking.estimatedDelivery);
      const now = new Date();
      return now > estimated;
    }
    return false;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.navBackground }]}>
      {/* Информация о заказе */}
      <View style={styles.infoSection}>
        <View style={styles.orderInfo}>
          <Text style={[styles.orderLabel, { color: theme.primary }]}>
            {t('tracking.orderNumber')}
          </Text>
          <Text style={[styles.orderNumber, { color: theme.primary }]}>
            #{tracking.orderNumber}
          </Text>
          <Text style={[styles.orderDate, { color: theme.text }]}>
            {formatDate(tracking.orderDate)}
          </Text>
        </View>

        {/* Кнопки действий */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.card }]}
            onPress={onRefresh}
            disabled={refreshing}
          >
            <Ionicons
              name={refreshing ? 'refresh' : 'refresh-outline'}
              size={20}
              color={refreshing ? theme.primary : theme.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.card }]}
            onPress={handleShareTracking}
          >
            <Ionicons name="share-outline" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Статус и прогноз */}
      <View style={[styles.statusSection, { backgroundColor: theme.card }]}>
        <View style={styles.statusInfo}>
          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>
              {t('tracking.currentStatus')}
            </Text>
            <View style={styles.statusBadgeContainer}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor() },
                ]}
              />
              <Text
                style={[styles.statusText, { color: getStatusColor() }]}
                numberOfLines={1}
              >
                {t(`orderStatus.${tracking.status}`)}
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>
              {t('tracking.estimatedDelivery')}
            </Text>
            <View style={styles.deliveryInfo}>
              <Text style={[styles.deliveryDate, { color: theme.text }]}>
                {formatDate(tracking.estimatedDelivery)}
              </Text>
              {isDelayed() ? (
                <View style={[styles.delayedBadge, { backgroundColor: theme.error }]}>
                  <Ionicons name="time-outline" size={12} color="#FFFFFF" />
                  <Text style={styles.delayedText}>
                    {t('tracking.delayed')}
                  </Text>
                </View>
              ) : (
                <View style={[styles.onTimeBadge, { backgroundColor: theme.secondary }]}>
                  <Ionicons name="checkmark" size={12} color={theme.heading} />
                  <Text style={[styles.onTimeText, { color: theme.heading }]}>
                    {t('tracking.onTime')}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {tracking.actualDelivery && (
            <View style={styles.statusRow}>
              <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>
                {t('tracking.deliveredOn')}
              </Text>
              <Text style={[styles.actualDate, { color: theme.text }]}>
                {formatDate(tracking.actualDelivery)}
              </Text>
            </View>
          )}
        </View>

        {/* Прогресс бар */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBackground, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${tracking.progress}%`,
                  backgroundColor: getStatusColor(),
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {tracking.progress}% {t('tracking.deliveryProgress')}
          </Text>
        </View>
      </View>

      {/* Кнопки навигации */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[styles.navButton, { borderColor: theme.border }]}
          onPress={onViewDetails}
        >
          <Ionicons name="document-text-outline" size={18} color={theme.text} />
          <Text style={[styles.navButtonText, { color: theme.text }]}>
            {t('tracking.viewDetails')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, { borderColor: theme.border }]}
          onPress={onContactSupport}
        >
          <Ionicons name="chatbubble-outline" size={18} color={theme.text} />
          <Text style={[styles.navButtonText, { color: theme.text }]}>
            {t('tracking.contactSupport')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderInfo: {
    flex: 1,
  },
  orderLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusInfo: {
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryDate: {
    fontSize: 14,
    fontWeight: '600',
  },
  delayedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  delayedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  onTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  onTimeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  actualDate: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBackground: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OrderHeader;