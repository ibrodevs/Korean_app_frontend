import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { OrderFilter, OrderHistory, OrderSort, OrderStats } from '../../types/order';
import Text from '../Text';

interface OrdersHeaderProps {
  stats: OrderStats;
  filter: OrderFilter;
  sort: OrderSort;
  onFilterChange: (filter: OrderFilter) => void;
  onSortChange: (sort: OrderSort) => void;
  onSearch?: (query: string) => void;
}

const { width } = Dimensions.get('window');

const OrdersHeader: React.FC<OrdersHeaderProps> = ({
  stats,
  filter,
  sort,
  onFilterChange,
  onSortChange,
  onSearch,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [slideAnim] = useState(new Animated.Value(width));
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const nextQuery = filter.searchQuery ?? '';
    if (nextQuery !== searchQuery) {
      setSearchQuery(nextQuery);
    }
  }, [filter.searchQuery, searchQuery]);

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

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  const openFilterModal = () => {
    setShowFilterModal(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const closeFilterModal = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowFilterModal(false);
    });
  };

  const openSortModal = () => {
    setShowSortModal(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const closeSortModal = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSortModal(false);
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Мягкий градиентный фон */}
      <LinearGradient
        colors={['transparent', `${theme.navBackground}10`]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <View style={styles.headerContent}>
        {/* Заголовок */}
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.heading }]}>
              {t('orders.title')}
            </Text>
            <View style={styles.subtitleContainer}>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {stats.totalOrders} {t('orders.allOrders')}
              </Text>
            </View>
          </View>
          
          {/* Статистика */}
          <View style={styles.statsContainer}>
              <View style={[styles.statsCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
              <View style={[styles.statIconContainer, { backgroundColor: `${theme.primary}15` }]}>
                <Ionicons name="wallet-outline" size={18} color={theme.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: theme.primary }]}>
                  {formatCurrency(stats.totalSpent)}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  {t('orders.totalSpent')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Поиск */}
        <View style={[styles.searchContainer, { 
          backgroundColor: theme.card,
          borderColor: isSearchFocused ? theme.primary : theme.border
        }]}>
          <Ionicons 
            name="search" 
            size={18} 
            color={isSearchFocused ? theme.primary : theme.textSecondary} 
          />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={t('orders.search')}
            placeholderTextColor={`${theme.textSecondary}70`}
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Быстрые действия */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { 
              backgroundColor: theme.card,
              borderColor: theme.border,
            }]}
            onPress={openFilterModal}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: `${theme.primary}15` }]}>
              <Ionicons name="filter" size={16} color={theme.primary} />
            </View>
            <Text style={[styles.actionText, { color: theme.heading }]}>
              {t('orders.filter')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { 
              backgroundColor: theme.card,
              borderColor: theme.border,
            }]}
            onPress={openSortModal}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: `${theme.secondary}15` }]}>
              <Ionicons name="swap-vertical" size={16} color={theme.secondary} />
            </View>
            <Text style={[styles.actionText, { color: theme.heading }]}>
              {t('orders.sort')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { 
              backgroundColor: theme.card,
              borderColor: theme.border,
            }]}
            activeOpacity={0.7}
            onPress={() => {
              setSearchQuery('');
              onSearch?.('');
              onFilterChange({});
            }}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: `${theme.error}15` }]}>
              <Ionicons name="refresh" size={16} color={theme.error} />
            </View>
            <Text style={[styles.actionText, { color: theme.heading }]}>
              {t('common.clearAll')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Активные фильтры */}
        {(filter.status?.length > 0 || filter.dateRange) && (
          <View style={styles.activeFiltersContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.activeFiltersScroll}
            >
              {filter.status?.map((status) => (
                <View
                  key={status}
                  style={[styles.activeFilterChip, { 
                    backgroundColor: `${getStatusColor(status)}15`,
                  }]}
                >
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(status) }]} />
                  <Text style={[styles.activeFilterText, { color: getStatusColor(status) }]}>
                    {t(`orderStatus.${status}`)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      const newStatuses = filter.status?.filter(s => s !== status);
                      onFilterChange({ ...filter, status: newStatuses?.length ? newStatuses : undefined });
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={14} color={getStatusColor(status)} />
                  </TouchableOpacity>
                </View>
              ))}

              {filter.dateRange && (
                <View
                  style={[styles.activeFilterChip, { 
                    backgroundColor: `${theme.primary}15`,
                  }]}
                >
                  <Ionicons name="calendar-outline" size={12} color={theme.primary} />
                  <Text style={[styles.activeFilterText, { color: theme.primary }]}>
                    {t(`filters.${filter.dateRange.id}`)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      onFilterChange({ ...filter, dateRange: undefined });
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={14} color={theme.primary} />
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Модальное окно фильтров */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={closeFilterModal}
      >
        <FilterModal
          currentFilter={filter}
          onApply={(newFilter: OrderFilter) => {
            onFilterChange(newFilter);
            closeFilterModal();
          }}
          onCancel={closeFilterModal}
          theme={theme}
          t={t}
        />
      </Modal>

      {/* Модальное окно сортировки */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={closeSortModal}
      >
        <SortModal
          currentSort={sort}
          onApply={(newSort: OrderSort) => {
            onSortChange(newSort);
            closeSortModal();
          }}
          onCancel={closeSortModal}
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
  const [selectedDateRange, setSelectedDateRange] = useState(currentFilter.dateRange?.id);

  const statusOptions = [
    { value: 'pending', icon: 'time-outline', color: theme.textSecondary, label: t('orderStatus.pending') },
    { value: 'processing', icon: 'sync-outline', color: theme.textSecondary, label: t('orderStatus.processing') },
    { value: 'shipped', icon: 'rocket-outline', color: theme.primary, label: t('orderStatus.shipped') },
    { value: 'delivered', icon: 'checkmark-circle-outline', color: theme.secondary, label: t('orderStatus.delivered') },
    { value: 'cancelled', icon: 'close-circle-outline', color: theme.error, label: t('orderStatus.cancelled') },
    { value: 'returned', icon: 'refresh-circle-outline', color: theme.error, label: t('orderStatus.returned') },
  ];

  const dateRangeOptions = [
    { id: '7days', label: t('filters.last7Days'), icon: 'calendar-number-outline' },
    { id: '30days', label: t('filters.last30Days'), icon: 'calendar-outline' },
    { id: '6months', label: t('filters.last6Months'), icon: 'calendar-clear-outline' },
    { id: '1year', label: t('filters.lastYear'), icon: 'calendar-sharp' },
  ];

  const handleApply = () => {
    onApply({
      ...currentFilter,
      status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      dateRange: selectedDateRange ? { id: selectedDateRange } : undefined,
    });
  };

  const handleClear = () => {
    setSelectedStatuses([]);
    setSelectedDateRange(undefined);
  };

  return (
    <TouchableWithoutFeedback onPress={onCancel}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback>
          <View 
            style={[
              styles.modalSheet, 
              { 
                backgroundColor: theme.card,
              }
            ]}
          >
            {/* Хендл */}
            <View style={[styles.modalHandle, { backgroundColor: `${theme.border}60` }]} />

            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.heading }]}>
                {t('orders.filter')}
              </Text>
              <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                <Ionicons name="close" size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Фильтр по статусу */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: theme.heading }]}>
                  {t('orders.status')}
                </Text>
                <View style={styles.statusGrid}>
                  {statusOptions.map((status) => (
                    <TouchableOpacity
                      key={status.value}
                      style={[
                        styles.statusOption,
                        {
                          backgroundColor: selectedStatuses.includes(status.value)
                            ? `${status.color}12`
                            : `${theme.border}15`,
                        },
                      ]}
                      onPress={() => {
                        if (selectedStatuses.includes(status.value)) {
                          setSelectedStatuses(selectedStatuses.filter(s => s !== status.value));
                        } else {
                          setSelectedStatuses([...selectedStatuses, status.value]);
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.statusIconContainer,
                        { backgroundColor: selectedStatuses.includes(status.value) ? status.color : 'transparent' }
                      ]}>
                        <Ionicons 
                          name={status.icon as any} 
                          size={14} 
                          color={selectedStatuses.includes(status.value) ? '#FFFFFF' : status.color} 
                        />
                      </View>
                      <Text
                        style={[
                          styles.statusOptionText,
                          {
                            color: selectedStatuses.includes(status.value)
                              ? status.color
                              : theme.text,
                          },
                        ]}
                      >
                        {status.label}
                      </Text>
                      {selectedStatuses.includes(status.value) && (
                        <Ionicons name="checkmark" size={16} color={status.color} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Фильтр по дате */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: theme.heading }]}>
                  {t('orders.dateRange')}
                </Text>
                <View style={styles.dateGrid}>
                  {dateRangeOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.dateOption,
                        {
                          backgroundColor: selectedDateRange === option.id
                            ? `${theme.primary}12`
                            : `${theme.border}15`,
                        },
                      ]}
                      onPress={() => {
                        setSelectedDateRange(selectedDateRange === option.id ? undefined : option.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons 
                        name={option.icon as any} 
                        size={16} 
                        color={selectedDateRange === option.id ? theme.primary : theme.textSecondary} 
                      />
                      <Text
                        style={[
                          styles.dateOptionText,
                          {
                            color: selectedDateRange === option.id
                              ? theme.primary
                              : theme.text,
                          },
                        ]}
                      >
                        {option.label}
                      </Text>
                      {selectedDateRange === option.id && (
                        <View style={[styles.dateSelectedIndicator, { backgroundColor: theme.primary }]} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Кнопки действий */}
            <View style={[styles.modalFooter, { borderTopColor: `${theme.border}30` }]}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { 
                  backgroundColor: 'transparent',
                  borderColor: theme.border
                }]}
                onPress={handleClear}
                activeOpacity={0.7}
              >
                <Ionicons name="close-outline" size={18} color={theme.textSecondary} />
                <Text style={[styles.modalButtonText, { color: theme.textSecondary }]}>
                  {t('common.clear')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.applyButton]}
                onPress={handleApply}
                activeOpacity={0.7}
              >
                <View style={[styles.applyButtonInner, { backgroundColor: theme.primary }]}>
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                    {t('common.applyFilters')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Компонент модального окна сортировки
const SortModal: React.FC<any> = ({ currentSort, onApply, onCancel, theme, t }) => {
  const [selectedSort, setSelectedSort] = useState(currentSort);

  const sortOptions = [
    { field: 'date', direction: 'desc', label: t('sortOptions.newest'), icon: 'arrow-down-outline' },
    { field: 'date', direction: 'asc', label: t('sortOptions.oldest'), icon: 'arrow-up-outline' },
    { field: 'amount', direction: 'desc', label: t('sortOptions.highestAmount'), icon: 'trending-down-outline' },
    { field: 'amount', direction: 'asc', label: t('sortOptions.lowestAmount'), icon: 'trending-up-outline' },
  ];

  return (
    <TouchableWithoutFeedback onPress={onCancel}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback>
          <View style={[styles.sortModalSheet, { backgroundColor: theme.card }]}>
            <View style={[styles.modalHandle, { backgroundColor: `${theme.border}60` }]} />
            
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.heading }]}>
                {t('orders.sortBy')}
              </Text>
              <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                <Ionicons name="close" size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.sortOptionsContainer}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={`${option.field}-${option.direction}`}
                  style={[
                    styles.sortOption,
                    {
                      backgroundColor: 
                        selectedSort.field === option.field && 
                        selectedSort.direction === option.direction
                          ? `${theme.primary}12`
                          : 'transparent',
                    },
                  ]}
                  onPress={() => setSelectedSort({ field: option.field, direction: option.direction })}
                  activeOpacity={0.7}
                >
                  <View style={styles.sortOptionContent}>
                    <View style={[
                      styles.sortIconContainer,
                      { backgroundColor: `${theme.primary}15` }
                    ]}>
                      <Ionicons 
                        name={option.icon as any} 
                        size={18} 
                        color={theme.primary} 
                      />
                    </View>
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
                  </View>
                  {selectedSort.field === option.field && selectedSort.direction === option.direction && (
                    <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.sortApplyButton}
              onPress={() => onApply(selectedSort)}
              activeOpacity={0.7}
            >
              <View style={[styles.sortApplyInner, { backgroundColor: theme.primary }]}>
                <Text style={[styles.sortApplyText, { color: '#FFFFFF' }]}>
                  {t('common.apply')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContent: {
    position: 'relative',
    zIndex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.7,
  },
  statsContainer: {
    marginLeft: 16,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    marginLeft: 10,
    marginRight: 8,
    padding: 0,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
  },
  actionIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeFiltersContainer: {
    marginTop: 4,
  },
  activeFiltersScroll: {
    paddingVertical: 6,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    gap: 6,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  modalBody: {
    paddingHorizontal: 20,
  },
  filterSection: {
    marginBottom: 28,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 14,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    minWidth: '47%',
  },
  statusIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  dateGrid: {
    gap: 8,
  },
  dateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  dateOptionText: {
    fontSize: 14,
    flex: 1,
  },
  dateSelectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    borderWidth: 1,
  },
  applyButton: {
    flex: 2,
  },
  applyButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
    width: '100%',
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  sortModalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
    maxHeight: '65%',
  },
  sortOptionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  sortOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  sortIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortOptionText: {
    fontSize: 15,
    flex: 1,
  },
  sortApplyButton: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sortApplyInner: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  sortApplyText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

// Стили для модалки деталей заказа (сохранил отдельно чтобы не мешали)
const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '80%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 6,
  },
  emptyState: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  summaryCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
  },
  summaryHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  statusPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryBody: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  itemsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 12,
  },
  imagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

interface OrderDetailsModalProps {
  order: OrderHistory | null;
  visible: boolean;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
  onReorder: (orderId: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  visible,
  onClose,
  onTrackOrder,
  onReorder,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  if (!visible) {
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return '-';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    if (amount === undefined || amount === null) {
      return '-';
    }
    const symbol = currency === 'USD' ? '$' : '';
    return `${symbol}${amount.toFixed(2)}`;
  };

  const canTrack = order
    ? ['shipped', 'outForDelivery', 'delivered'].includes(order.status)
    : false;
  const canReorder = order ? order.canReorder && order.status !== 'cancelled' : false;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={[modalStyles.sheet, { backgroundColor: theme.card }]}>
        <View style={modalStyles.header}>
          <Text style={[modalStyles.title, { color: theme.heading }]}>
            {t('orderDetails.title')}
          </Text>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
            <Ionicons name="close" size={22} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {!order ? (
          <View style={modalStyles.emptyState}>
            <Text style={[modalStyles.emptyText, { color: theme.textSecondary }]}>
              {t('orderDetails.noOrderSelected')}
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={modalStyles.summaryCard}>
              <LinearGradient
                colors={[theme.primary, `${theme.primary}CC`]}
                style={modalStyles.summaryHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={modalStyles.summaryTitle}>#{order.orderNumber}</Text>
                <View style={modalStyles.statusPill}>
                  <Text style={modalStyles.statusText}>
                    {t(`orderStatus.${order.status}`)}
                  </Text>
                </View>
              </LinearGradient>

              <View style={modalStyles.summaryBody}>
                <View style={modalStyles.summaryRow}>
                  <Text style={[modalStyles.summaryLabel, { color: theme.textSecondary }]}>
                    {t('orderDetails.orderDate')}
                  </Text>
                  <Text style={[modalStyles.summaryValue, { color: theme.heading }]}>
                    {formatDate(order.orderDate)}
                  </Text>
                </View>
                <View style={modalStyles.summaryRow}>
                  <Text style={[modalStyles.summaryLabel, { color: theme.textSecondary }]}>
                    {t('orderDetails.total')}
                  </Text>
                  <Text style={[modalStyles.summaryValue, { color: theme.heading }]}>
                    {formatCurrency(order.totalAmount, order.currency)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={modalStyles.itemsSection}>
              <Text style={[modalStyles.sectionTitle, { color: theme.heading }]}>
                {t('orderDetails.items')}
              </Text>
              {order.items.map((item) => (
                <View
                  key={item.id}
                  style={[modalStyles.itemRow, { borderColor: theme.border }]}
                >
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={modalStyles.itemImage} />
                  ) : (
                    <View
                      style={[modalStyles.imagePlaceholder, { backgroundColor: theme.border }]}
                    >
                      <Ionicons name="cube-outline" size={20} color={theme.textSecondary} />
                    </View>
                  )}
                  <View style={modalStyles.itemInfo}>
                    <Text style={[modalStyles.itemName, { color: theme.heading }]}>
                      {item.name || item.product?.name}
                    </Text>
                    <Text style={[modalStyles.itemMeta, { color: theme.textSecondary }]}>
                      {t('orderDetails.quantity')} {item.quantity}
                    </Text>
                  </View>
                  <Text style={[modalStyles.itemPrice, { color: theme.heading }]}>
                    {formatCurrency(item.price, order.currency)}
                  </Text>
                </View>
              ))}
            </View>

            <View style={modalStyles.actions}>
              {canTrack && (
                <TouchableOpacity
                  style={[modalStyles.actionButton, { borderColor: theme.primary }]}
                  onPress={() => onTrackOrder(order.id)}
                >
                  <Ionicons name="navigate" size={18} color={theme.primary} />
                  <Text style={[modalStyles.actionText, { color: theme.primary }]}>
                    {t('orders.trackOrder')}
                  </Text>
                </TouchableOpacity>
              )}

              {canReorder && (
                <TouchableOpacity
                  style={[modalStyles.actionButton, { borderColor: theme.secondary }]}
                  onPress={() => onReorder(order.id)}
                >
                  <Ionicons name="repeat" size={18} color={theme.secondary} />
                  <Text style={[modalStyles.actionText, { color: theme.secondary }]}>
                    {t('orders.reorder')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

export { OrderDetailsModal };
export default OrdersHeader;