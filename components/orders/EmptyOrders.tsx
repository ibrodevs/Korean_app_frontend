import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '../Text';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface EmptyOrdersProps {
  onStartShopping: () => void;
}

const EmptyOrders: React.FC<EmptyOrdersProps> = ({ onStartShopping }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.image, { backgroundColor: theme.card, borderColor: theme.primary, borderWidth: 2 }]}>
        <Text style={[styles.title, { color: theme.primary, fontSize: 48 }]}>📦</Text>
      </View>
      
      <Text style={[styles.title, { color: theme.heading }]}>
        {t('orders.emptyTitle')}
      </Text>
      
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {t('orders.emptyDescription')}
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={onStartShopping}
      >
        <Text style={[styles.buttonText, { color: theme.heading }]}>
          {t('orders.startShopping')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EmptyOrders;