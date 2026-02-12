import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { OrderItem } from '../../types/tracking';
import { useTailwind } from '../../utils/tailwindUtilities';
import Text from '../Text';

interface OrderItemsProps {
  items: OrderItem[];
  onItemPress?: (item: OrderItem) => void;
}

const OrderItems: React.FC<OrderItemsProps> = ({ 
  items, 
  onItemPress 
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const renderItem = ({ item }: { item: OrderItem }) => (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: theme.background }]}
      onPress={() => onItemPress?.(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/60' }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.itemDetails}>
          <Text style={[styles.itemQuantity, { color: theme.textSecondary }]}>
            {t('common.quantity')}: {item.quantity}
          </Text>
          {item.tracking && (
            <View style={styles.trackingBadge}>
              <Ionicons name="checkmark-circle" size={12} color={theme.success} />
              <Text style={[styles.trackingText, { color: theme.success }]}>
                {t('tracking.tracked')}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          {t('tracking.orderItems')}
        </Text>
        <Text style={[styles.itemCount, { color: theme.textSecondary }]}>
          {items.length} {items.length === 1 ? t('common.item') : t('common.items')}
        </Text>
      </View>
      
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  itemCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemQuantity: {
    fontSize: 14,
  },
  trackingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  trackingText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default OrderItems;