import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { OrderHistory } from '../../types/order';
import Text from '../Text';

interface OrderDetailsModalProps {
  order: OrderHistory | null;
  visible: boolean;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
  onReorder: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  onWriteReview?: (orderId: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  visible,
  onClose,
  onTrackOrder,
  onReorder,
  onCancelOrder,
  onWriteReview,
}) => {
  const { theme } = useTheme();

  const handleClose = () => {
    onClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return '-';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    if (amount === undefined || amount === null) {
      return '-';
    }
    const symbol = currency === 'USD' ? '$' : '₽';
    return `${amount.toFixed(2)} ${symbol}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { backgroundColor: theme.background }]}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleClose}
            >
              <Ionicons 
                name="close" 
                size={24} 
                color={theme.text} 
              />
            </TouchableOpacity>
            
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Детали заказа
            </Text>
            
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              {order ? `Заказ #${order.id.slice(-6).toUpperCase()}` : ''}
            </Text>
          </View>

          <ScrollView style={styles.content}>
            {!order ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  Заказ не выбран
                </Text>
              </View>
            ) : (
              <View style={styles.orderContent}>
                {/* Order Status */}
                <View style={[styles.section, { backgroundColor: theme.card }]}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Статус заказа
                  </Text>
                  <Text style={[styles.statusText, { color: theme.text }]}>
                    {order.status}
                  </Text>
                  <Text style={[styles.dateText, { color: theme.textSecondary }]}>
                    {formatDate(order.orderDate)}
                  </Text>
                </View>

                {/* Order Items */}
                <View style={[styles.section, { backgroundColor: theme.card }]}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Товары ({order.items?.length || 0})
                  </Text>
                  {order.items?.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                      <Image 
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                      />
                      <View style={styles.itemInfo}>
                        <Text style={[styles.itemName, { color: theme.text }]}>
                          {item.name}
                        </Text>
                        <Text style={[styles.itemDetails, { color: theme.textSecondary }]}>
                          Количество: {item.quantity}
                        </Text>
                        <Text style={[styles.itemPrice, { color: theme.primary }]}>
                          {formatCurrency(item.price, order.currency)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Order Summary */}
                <View style={[styles.section, { backgroundColor: theme.card }]}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Итого
                  </Text>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                      Подытог:
                    </Text>
                    <Text style={[styles.summaryValue, { color: theme.text }]}>
                      {formatCurrency(order.totalAmount * 0.85, order.currency)}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                      Доставка:
                    </Text>
                    <Text style={[styles.summaryValue, { color: theme.text }]}>
                      {formatCurrency(500, order.currency)}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: theme.text }]}>
                      Всего:
                    </Text>
                    <Text style={[styles.totalValue, { color: theme.text }]}>
                      {formatCurrency(order.totalAmount, order.currency)}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.primary }]}
                    onPress={() => onTrackOrder(order.id)}
                  >
                    <Ionicons name="navigate" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Отследить заказ</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.success || '#28a745' }]}
                    onPress={() => onReorder(order.id)}
                  >
                    <Ionicons name="refresh" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Заказать снова</Text>
                  </TouchableOpacity>
                  
                  {onCancelOrder && ['pending', 'processing'].includes(order.status) && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: theme.error || '#dc3545' }]}
                      onPress={() => onCancelOrder(order.id)}
                    >
                      <Ionicons name="close-circle" size={20} color="white" />
                      <Text style={styles.actionButtonText}>Отменить заказ</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  orderContent: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f8f9fa',
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
    fontSize: 14,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionsContainer: {
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderDetailsModal;