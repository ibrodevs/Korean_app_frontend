import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '../Text';
import { useTheme } from '../../contexts/ThemeContext';

interface OrderSuccessProps {
  orderNumber?: string;
  onContinueShopping?: () => void;
  onViewOrders?: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({
  orderNumber = '12345',
  onContinueShopping,
  onViewOrders,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
      paddingHorizontal: 20,
    },
    successIcon: {
      fontSize: 64,
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 8,
      textAlign: 'center',
    },
    orderNumber: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '600',
      marginBottom: 32,
      textAlign: 'center',
    },
    buttonContainer: {
      width: '100%',
      gap: 12,
    },
    button: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButton: {
      backgroundColor: theme.primary,
    },
    secondaryButton: {
      backgroundColor: theme.secondary,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    primaryButtonText: {
      color: theme.text,
    },
    secondaryButtonText: {
      color: theme.primary,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.successIcon}>✓</Text>
      <Text style={styles.title}>Order Placed Successfully!</Text>
      <Text style={styles.subtitle}>Thank you for your purchase</Text>
      <Text style={styles.orderNumber}>Order #{orderNumber}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={onContinueShopping}
        >
          <Text style={[styles.primaryButtonText]}>
            Continue Shopping
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={onViewOrders}
        >
          <Text style={[styles.secondaryButtonText]}>
            View Orders
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderSuccess;