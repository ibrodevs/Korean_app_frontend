import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { OrderFilter, OrderSort, OrderStats } from '../../types/order';
import { useTailwind } from '../../utils/tailwindUtilities';
import Text from '../Text';

interface OrdersHeaderProps {
  stats: OrderStats;
  filter: OrderFilter;
  sort: OrderSort;
  onFilterChange: (filter: OrderFilter) => void;
  onSortChange: (sort: OrderSort) => void;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({
  stats,
  filter,
  sort,
  onFilterChange,
  onSortChange,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.navBackground }]}>
      {/* Заголовок и статистика */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.primary }]}>
            {t('orders.title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            {stats.totalOrders} {t('orders.all')}
          </Text>
        </View>
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {formatCurrency(stats.totalSpent)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.text }]}>
              {t('orders.orderTotal')}
            </Text>
          </View>
        </View>
      </View>

      {/* Панель фильтров и поиска */}
      <View style={styles.controls}>
        {/* Кнопки фильтра и сортировки */}
        <View style={styles.controlButtons}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.card }]}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="filter" size={20} color={theme.text} />
            <Text style={[styles.controlButtonText, { color: theme.text }]}>
              {t('orders.filter')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.card }]}
            onPress={() => setShowSortModal(true)}
          >
            <Ionicons name="swap-vertical" size={20} color={theme.text} />
            <Text style={[styles.controlButtonText, { color: theme.text }]}>
              {t('orders.sort')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Активные фильтры */}
      {filter.status?.length && (
        <View style={styles.activeFilters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            
            {filter.status?.map((status) => (
              <View
                key={status}
                style={[styles.filterChip, { backgroundColor: getStatusColor(status) }]}
              >
                <Text style={[styles.filterChipText, { color: theme.heading }]}>
                  {t(`orderStatus.${status}`)}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const newStatuses = filter.status?.filter(s => s !== status);
                    onFilterChange({ ...filter, status: newStatuses });
                  }}
                >
                  <Ionicons name="close" size={16} color={theme.heading} />
                </TouchableOpacity>
              </View>
            ))}
            
            {filter.status?.length && (
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={() => {
                  onFilterChange({});
                }}
              >
                <Text style={[styles.clearAllText, { color: theme.primary }]}>
                  {t('common.clearAll')}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}

      {/* Модальное окно фильтров */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <FilterModal
          currentFilter={filter}
          onApply={(newFilter) => {
            onFilterChange(newFilter);
            setShowFilterModal(false);
          }}
          onCancel={() => setShowFilterModal(false)}
          theme={theme}
          t={t}
        />
      </Modal>

      {/* Модальное окно сортировки */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <SortModal
          currentSort={sort}
          onApply={(newSort) => {
            onSortChange(newSort);
            setShowSortModal(false);
          }}
          onCancel={() => setShowSortModal(false)}
          theme={theme}
          t={t}
        />
      </Modal>
    </View>
  );
};

// Компонент модального окна фильтров
const FilterModal: React.FC<any> = ({ currentFilter, onApply, onCancel, theme, t }) => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    currentFilter.status || []
  );
  const [dateRange, setDateRange] = useState(currentFilter.dateRange);

  const statusOptions = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'returned',
  ];

  const handleApply = () => {
    onApply({
      ...currentFilter,
      status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      dateRange,
    });
  };

  const handleClear = () => {
    setSelectedStatuses([]);
    setDateRange(undefined);
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: theme.heading }]}>
            {t('orders.filter')}
          </Text>
          <TouchableOpacity onPress={onCancel}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          {/* Фильтр по статусу */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: theme.heading }]}>
              {t('orders.status')}
            </Text>
            <View style={styles.statusOptions}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    {
                      backgroundColor: selectedStatuses.includes(status)
                        ? theme.primary
                        : theme.border,
                    },
                  ]}
                  onPress={() => {
                    if (selectedStatuses.includes(status)) {
                      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
                    } else {
                      setSelectedStatuses([...selectedStatuses, status]);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      {
                        color: selectedStatuses.includes(status)
                          ? theme.heading
                          : theme.text,
                      },
                    ]}
                  >
                    {t(`orderStatus.${status}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Фильтр по дате */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: theme.heading }]}>
              {t('orders.date')}
            </Text>
            <View style={styles.dateOptions}>
              {[
                { id: '30days', label: t('filters.last30Days') },
                { id: '6months', label: t('filters.last6Months') },
                { id: '1year', label: t('filters.lastYear') },
                { id: 'custom', label: t('filters.customRange') },
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.dateOption,
                    {
                      backgroundColor: dateRange?.id === option.id
                        ? theme.primary + '20'
                        : 'transparent',
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => {
                    // Здесь будет логика установки диапазона дат
                    setDateRange({ id: option.id } as any);
                  }}
                >
                  <Text
                    style={[
                      styles.dateOptionText,
                      {
                        color: dateRange?.id === option.id
                          ? theme.primary
                          : theme.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton, { borderColor: theme.border }]}
            onPress={handleClear}
          >
            <Text style={[styles.modalButtonText, { color: theme.text }]}>
              {t('common.clear')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.applyButton, { backgroundColor: theme.primary }]}
            onPress={handleApply}
          >
            <Text style={[styles.modalButtonText, { color: theme.heading }]}>
              {t('common.apply')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Компонент модального окна сортировки
const SortModal: React.FC<any> = ({ currentSort, onApply, onCancel, theme, t }) => {
  const [selectedSort, setSelectedSort] = useState(currentSort);

  const sortOptions = [
    { field: 'date', direction: 'desc', label: t('sortOptions.newest') },
    { field: 'date', direction: 'asc', label: t('sortOptions.oldest') },
    { field: 'amount', direction: 'desc', label: t('sortOptions.highestAmount') },
    { field: 'amount', direction: 'asc', label: t('sortOptions.lowestAmount') },
  ];

  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: theme.heading }]}>
            {t('orders.sort')}
          </Text>
          <TouchableOpacity onPress={onCancel}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.modalBody}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={`${option.field}-${option.direction}`}
              style={[
                styles.sortOption,
                {
                  backgroundColor: 
                    selectedSort.field === option.field && 
                    selectedSort.direction === option.direction
                      ? theme.primary + '20'
                      : 'transparent',
                },
              ]}
              onPress={() => setSelectedSort({ field: option.field, direction: option.direction })}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  {
                    color: 
                      selectedSort.field === option.field && 
                      selectedSort.direction === option.direction
                        ? theme.primary
                        : theme.text,
                  },
                ]}
              >
                {option.label}
              </Text>
              {selectedSort.field === option.field && selectedSort.direction === option.direction && (
                <Ionicons name="checkmark" size={20} color={theme.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.modalButton, styles.applyButton, { backgroundColor: theme.primary }]}
            onPress={() => onApply(selectedSort)}
          >
            <Text style={[styles.modalButtonText, { color: theme.heading }]}>
              {t('common.apply')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  stats: {
    alignItems: 'flex-end',
  },
  statItem: {
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeFilters: {
    marginTop: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    gap: 6,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  applyButton: {},
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateOptions: {
    gap: 8,
  },
  dateOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  sortOptionText: {
    fontSize: 16,
  },
});

export default OrdersHeader;