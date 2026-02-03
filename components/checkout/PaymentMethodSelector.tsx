import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Text from '../Text';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PaymentMethod } from '../../types/order';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selected,
  onSelect,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      name: 'Credit Card',
      icon: 'card-outline',
    },
    {
      id: '2',
      type: 'card',
      name: 'Debit Card',
      icon: 'card-outline',
    },
    {
      id: '3',
      type: 'paypal',
      name: 'PayPal',
      icon: 'logo-paypal',
    },
    {
      id: '4',
      type: 'apple',
      name: 'Apple Pay',
      icon: 'logo-apple',
    },
  ];

  return (
    <View>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodCard,
            {
              backgroundColor: theme.card,
              borderColor: selected?.id === method.id ? theme.primary : theme.border,
              borderWidth: selected?.id === method.id ? 2 : 1,
            },
          ]}
          onPress={() => onSelect(method)}
        >
          <View style={styles.methodContent}>
            <Ionicons name={method.icon as any} size={24} color={theme.text} style={styles.icon} />
            <Text style={[styles.methodName, { color: theme.text }]}>
              {method.name}
            </Text>
          </View>
          {selected?.id === method.id && (
            <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  methodCard: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentMethodSelector;
