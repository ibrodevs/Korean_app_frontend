import React from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Text from '../Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

interface QuickFiltersBarProps {
  activeFilters: string[];
  onFilterPress: (filterId: string) => void;
  onClearAll: () => void;
}

const QuickFiltersBar: React.FC<QuickFiltersBarProps> = ({
  activeFilters,
  onFilterPress,
  onClearAll,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const quickFilters = [
    { id: 'new', label: t('sort.newest'), icon: 'sparkles' },
    { id: 'cheap', label: t('sort.priceLowHigh'), icon: 'trending-down' },
    { id: 'expensive', label: t('sort.priceHighLow'), icon: 'trending-up' },
    { id: 'popular', label: t('sort.popularity'), icon: 'flame' },
    { id: 'rated', label: t('sort.rating'), icon: 'star' },
    { id: 'sale', label: t('filters.onSale'), icon: 'pricetag' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tailwind('px-4')}
      >
        {quickFilters.map((filter) => {
          const isActive = activeFilters.includes(filter.id);
          
          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                {
                  backgroundColor: isActive ? theme.primary : theme.border,
                },
              ]}
              onPress={() => onFilterPress(filter.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={isActive ? theme.heading : theme.text}
                style={tailwind('mr-2')}
              />
              <Text
                style={[
                  styles.filterText,
                  {
                    color: isActive ? theme.heading : theme.text,
                  },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {activeFilters.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={onClearAll}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle" size={16} color={theme.error} />
          <Text style={[styles.clearText, { color: theme.error }]}>
            {t('filters.clearAll')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default QuickFiltersBar;