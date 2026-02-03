import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Text from '../../components/Text';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import { SortOption, FilterOptions, Category } from '../../types/product';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FilterSortBarProps {
  sortOptions: SortOption[];
  selectedSort: string;
  onSortChange: (sortValue: string) => void;
  filterOptions: FilterOptions;
  onFilterChange: (options: FilterOptions) => void;
  categories: Category[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const FilterSortBar: React.FC<FilterSortBarProps> = ({
  sortOptions,
  selectedSort,
  onSortChange,
  filterOptions,
  onFilterChange,
  categories,
  viewMode,
  onViewModeChange,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempSort, setTempSort] = useState(selectedSort);
  const [tempFilters, setTempFilters] = useState(filterOptions);

  const selectedSortLabel = sortOptions.find(s => s.value === selectedSort)?.label || '';

  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      categories: [],
      priceRange: { min: 0, max: 1000 },
      minRating: 0,
      inStockOnly: false,
    };
    setTempFilters(clearedFilters);
    onFilterChange(clearedFilters);
    setShowFilterModal(false);
  };

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSortModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.heading }]}>
              {t('home.sort.default')}
            </Text>
            <TouchableOpacity onPress={() => setShowSortModal(false)}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.sortOption,
                  {
                    backgroundColor: tempSort === option.value
                      ? theme.primary + '20'
                      : 'transparent',
                  },
                ]}
                onPress={() => setTempSort(option.value)}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    {
                      color: tempSort === option.value
                        ? theme.primary
                        : theme.text,
                    },
                  ]}
                >
                  {option.label}
                </Text>
                {tempSort === option.value && (
                  <Ionicons name="checkmark" size={20} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.border }]}
              onPress={() => setShowSortModal(false)}
            >
              <Text style={[styles.modalButtonText, { color: theme.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.primary }]}
              onPress={() => {
                onSortChange(tempSort);
                setShowSortModal(false);
              }}
            >
              <Text style={[styles.modalButtonText, { color: theme.heading }]}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.heading }]}>
              {t('home.filter.title')}
            </Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Категории */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: theme.heading }]}>
                {t('home.filter.category')}
              </Text>
              <View style={styles.categoryTags}>
                {categories.map((category) => {
                  const isSelected = tempFilters.categories.includes(category.id);
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryTag,
                        {
                          backgroundColor: isSelected
                            ? theme.primary
                            : theme.border,
                        },
                      ]}
                      onPress={() => {
                        setTempFilters(prev => ({
                          ...prev,
                          categories: isSelected
                            ? prev.categories.filter(id => id !== category.id)
                            : [...prev.categories, category.id],
                        }));
                      }}
                    >
                      <Text
                        style={[
                          styles.categoryTagText,
                          {
                            color: isSelected
                              ? theme.heading
                              : theme.text,
                          },
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Диапазон цен */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: theme.heading }]}>
                {t('home.filter.priceRange')}
              </Text>
              <View style={{ paddingHorizontal: 16 }}>
                <Slider
                  minimumValue={0}
                  maximumValue={1000}
                  minimumTrackTintColor={theme.primary}
                  maximumTrackTintColor={theme.border}
                  thumbTintColor={theme.primary}
                  value={tempFilters.priceRange.max}
                  onValueChange={(value) => {
                    setTempFilters(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, max: value },
                    }));
                  }}
                />
                <View style={styles.priceRangeLabels}>
                  <Text style={[styles.priceLabel, { color: theme.text }]}>
                    $0
                  </Text>
                  <Text style={[styles.priceLabel, { color: theme.text }]}>
                    ${tempFilters.priceRange.max.toFixed(0)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Рейтинг */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: theme.heading }]}>
                {t('home.filter.rating')}
              </Text>
              <View style={styles.ratingFilter}>
                {[4, 3, 2, 1].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingOption,
                      {
                        backgroundColor: tempFilters.minRating === rating
                          ? theme.primary + '20'
                          : 'transparent',
                      },
                    ]}
                    onPress={() => {
                      setTempFilters(prev => ({
                        ...prev,
                        minRating: prev.minRating === rating ? 0 : rating,
                      }));
                    }}
                  >
                    <View style={styles.starsContainer}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name={i < rating ? 'star' : 'star-outline'}
                          size={16}
                          color={i < rating ? theme.primary : theme.textSecondary}
                        />
                      ))}
                    </View>
                    <Text style={[styles.ratingText, { color: theme.text }]}>
                      {rating}+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Наличие */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => {
                  setTempFilters(prev => ({
                    ...prev,
                    inStockOnly: !prev.inStockOnly,
                  }));
                }}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: tempFilters.inStockOnly
                        ? theme.primary
                        : theme.border,
                      backgroundColor: tempFilters.inStockOnly
                        ? theme.primary
                        : 'transparent',
                    },
                  ]}
                >
                  {tempFilters.inStockOnly && (
                    <Ionicons name="checkmark" size={16} color={theme.heading} />
                  )}
                </View>
                <Text style={[styles.checkboxLabel, { color: theme.text }]}>
                  {t('home.filter.inStock')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.border }]}
              onPress={handleClearFilters}
            >
              <Text style={[styles.modalButtonText, { color: theme.text }]}>
                {t('home.filter.clear')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.primary }]}
              onPress={handleApplyFilters}
            >
              <Text style={[styles.modalButtonText, { color: theme.heading }]}>
                {t('home.filter.apply')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {/* Левая часть: Фильтр и Сортировка */}
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="filter-outline"
            size={20}
            color={theme.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.buttonText, { color: theme.text }]}>
            {t('home.filter.title')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowSortModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="swap-vertical-outline"
            size={20}
            color={theme.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.buttonText, { color: theme.text }]}>
            {selectedSortLabel}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Правая часть: Вид (Grid/List) */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'grid' && {
              backgroundColor: theme.primary,
            },
          ]}
          onPress={() => onViewModeChange('grid')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="grid-outline"
            size={20}
            color={viewMode === 'grid' ? theme.heading : theme.text}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'list' && {
              backgroundColor: theme.primary,
            },
          ]}
          onPress={() => onViewModeChange('list')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="list-outline"
            size={20}
            color={viewMode === 'list' ? theme.heading : theme.text}
          />
        </TouchableOpacity>
      </View>

      {renderSortModal()}
      {renderFilterModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewModeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 8,
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
  },
  modalTitle: {
    fontSize: 18,
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
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryTagText: {
    fontSize: 14,
  },
  priceRangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
  },
  ratingFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ratingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default FilterSortBar;