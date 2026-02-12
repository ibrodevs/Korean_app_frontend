import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTailwind } from '../../utils/tailwindUtilities';
import Text from '../Text';

interface OrderActionsProps {
  orderNumber: string;
  trackingNumber: string;
  onViewOrderDetails: () => void;
  onContactSupport: () => void;
  onCancelOrder?: () => void;
  canCancel?: boolean;
}

const OrderActions: React.FC<OrderActionsProps> = ({ 
  orderNumber,
  trackingNumber,
  onViewOrderDetails,
  onContactSupport,
  onCancelOrder,
  canCancel = false,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleCopyTracking = () => {
    // В React Native нет прямого доступа к clipboard
    // Можно использовать @react-native-clipboard/clipboard
    Alert.alert(
      t('tracking.trackingNumber'),
      trackingNumber,
      [
        { text: t('common.ok'), style: 'default' },
      ]
    );
  };

  const handleCancelOrder = () => {
    Alert.alert(
      t('orders.cancelOrder'),
      t('orders.cancelConfirmation'),
      [
        { text: t('common.no'), style: 'cancel' },
        { 
          text: t('common.yes'), 
          onPress: onCancelOrder,
          style: 'destructive'
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        {t('tracking.orderActions')}
      </Text>

      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionItem, { backgroundColor: theme.backgroundSecondary }]}
          onPress={onViewOrderDetails}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="receipt-outline" size={24} color={theme.primary} />
          </View>
          <Text style={[styles.actionText, { color: theme.text }]}>
            {t('orders.viewDetails')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionItem, { backgroundColor: theme.backgroundSecondary }]}
          onPress={handleCopyTracking}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: theme.info + '20' }]}>
            <Ionicons name="copy-outline" size={24} color={theme.info} />
          </View>
          <Text style={[styles.actionText, { color: theme.text }]}>
            {t('tracking.copyTracking')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionItem, { backgroundColor: theme.backgroundSecondary }]}
          onPress={onContactSupport}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: theme.info + '20' }]}>
            <Ionicons name="help-circle-outline" size={24} color={theme.info} />
          </View>
          <Text style={[styles.actionText, { color: theme.text }]}>
            {t('support.contactSupport')}
          </Text>
        </TouchableOpacity>

        {canCancel && (
          <TouchableOpacity
            style={[styles.actionItem, { backgroundColor: theme.backgroundSecondary }]}
            onPress={handleCancelOrder}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.error + '20' }]}>
              <Ionicons name="close-circle-outline" size={24} color={theme.error} />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>
              {t('orders.cancelOrder')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default OrderActions;