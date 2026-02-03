import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Text from '../Text';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ShippingMethod } from '../../types/order';

interface ShippingMethodSelectorProps {
  selected: ShippingMethod | null;
  onSelect: (method: ShippingMethod) => void;
}

const ShippingMethodSelector: React.FC<ShippingMethodSelectorProps> = ({
  selected,
  onSelect,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const shippingMethods: ShippingMethod[] = [
    {
      id: '1',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: 10,
      estimatedDays: 5,
      icon: 'package-outline',
    },
    {
      id: '2',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 25,
      estimatedDays: 2,
      icon: 'flash-outline',
    },
    {
      id: '3',
      name: 'Overnight Shipping',
      description: 'Next business day',
      price: 50,
      estimatedDays: 1,
      icon: 'rocket-outline',
    },
  ];

  return (
    <View>
      {shippingMethods.map((method) => (
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
            <View style={styles.methodInfo}>
              <Text style={[styles.methodName, { color: theme.text }]}>
                {method.name}
              </Text>
              <Text style={[styles.methodDays, { color: theme.textSecondary }]}>
                {method.estimatedDays} days
              </Text>
            </View>
            <Text style={[styles.methodPrice, { color: theme.heading }]}>
              ${method.price}
            </Text>
          </View>
          {selected?.id === method.id && (
            <View style={styles.checkmark}>
              <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
            </View>
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  methodDays: {
    fontSize: 14,
  },
  methodPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 16,
  },
  checkmark: {
    marginLeft: 12,
  },
});

export default ShippingMethodSelector;
