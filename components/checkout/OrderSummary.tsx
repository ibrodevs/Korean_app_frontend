import React from 'react';
import {
  View,
  
  StyleSheet,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discount?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shipping,
  tax,
  total,
  discount = 0,
}) => {
  const tailwind = useTailwind();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.heading }]}>
        {t('checkout.orderSummary')}
      </Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>
          {t('checkout.subtotal')}
        </Text>
        <Text style={[styles.value, { color: theme.text }]}>
          ${subtotal.toFixed(2)}
        </Text>
      </View>

      {discount > 0 && (
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>
            {t('checkout.discount')}
          </Text>
          <Text style={[styles.discount, { color: theme.error }]}>
            -${discount.toFixed(2)}
          </Text>
        </View>
      )}

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>
          {t('checkout.shipping')}
        </Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {shipping === 0 ? t('checkout.free') : `$${shipping.toFixed(2)}`}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>
          {t('checkout.tax')}
        </Text>
        <Text style={[styles.value, { color: theme.text }]}>
          ${tax.toFixed(2)}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.totalRow}>
        <Text style={[styles.totalLabel, { color: theme.heading }]}>
          {t('checkout.total')}
        </Text>
        <Text style={[styles.totalValue, { color: theme.heading }]}>
          ${total.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  discount: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
  },
});

export default OrderSummary;