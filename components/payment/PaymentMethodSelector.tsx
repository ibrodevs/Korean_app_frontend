import React, { useState, useEffect } from 'react';
import {
  View,
  
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PaymentMethod } from '../../types/payment';
import { paymentService } from '../../services/paymentService';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  showDescription?: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelect,
  showDescription = true,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const methods = await paymentService.getPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return 'card-outline';
      case 'paypal':
        return 'logo-paypal';
      case 'apple':
        return 'logo-apple';
      case 'google':
        return 'logo-google';
      case 'cod':
        return 'cash-outline';
      case 'bank':
        return 'business-outline';
      default:
        return 'wallet-outline';
    }
  };

  const getMethodName = (method: PaymentMethod) => {
    const methodMap: Record<string, string> = {
      'card': t('payment.creditCard'),
      'paypal': t('payment.paypal'),
      'apple': t('payment.applePay'),
      'google': t('payment.googlePay'),
      'cod': t('payment.cashOnDelivery'),
      'bank': t('payment.bankTransfer'),
    };
    return methodMap[method.type] || method.name;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Loading payment methods...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodCard,
            {
              backgroundColor: selectedMethod?.id === method.id
                ? theme.primary + '20'
                : theme.card,
              borderColor: selectedMethod?.id === method.id
                ? theme.primary
                : theme.border,
            },
          ]}
          onPress={() => onSelect(method)}
          activeOpacity={0.7}
        >
          <View style={styles.methodHeader}>
            <View style={styles.methodInfo}>
              <View style={[
                styles.iconContainer,
                { backgroundColor: theme.card },
              ]}>
                <Ionicons
                  name={getMethodIcon(method.type) as any}
                  size={24}
                  color={selectedMethod?.id === method.id ? theme.primary : theme.text}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={[
                  styles.methodName,
                  { color: selectedMethod?.id === method.id ? theme.primary : theme.text },
                ]}>
                  {getMethodName(method)}
                </Text>
                {showDescription && method.description && (
                  <Text style={[styles.methodDescription, { color: theme.textSecondary }]}>
                    {method.description}
                  </Text>
                )}
              </View>
            </View>

            {selectedMethod?.id === method.id ? (
              <View style={[styles.selectedIndicator, { backgroundColor: theme.primary }]}>
                <Ionicons name="checkmark" size={16} color={theme.heading} />
              </View>
            ) : (
              <View style={[styles.unselectedIndicator, { borderColor: theme.border }]} />
            )}
          </View>

          {method.fee !== undefined && method.fee > 0 && (
            <View style={styles.feeContainer}>
              <Text style={[styles.feeLabel, { color: theme.textSecondary }]}>
                Fee:
              </Text>
              <Text style={[styles.feeAmount, { color: theme.heading }]}>
                ${method.fee.toFixed(2)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  methodCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 12,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  feeLabel: {
    fontSize: 12,
  },
  feeAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PaymentMethodSelector;