import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Text from '../Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

interface SearchResultsHeaderProps {
  query: string;
  resultCount: number;
  showingCount: number;
  sortBy: string;
  onSortPress: () => void;
  onFilterPress: () => void;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  query,
  resultCount,
  showingCount,
  sortBy,
  onSortPress,
  onFilterPress,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const getSortLabel = (value: string) => {
    const sortOptions = {
      'relevance': t('sort.relevance'),
      'newest': t('sort.newest'),
      'price-asc': t('sort.priceLowHigh'),
      'price-desc': t('sort.priceHighLow'),
      'popularity': t('sort.popularity'),
      'rating': t('sort.rating'),
    };
    return sortOptions[value as keyof typeof sortOptions] || value;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Результаты поиска */}
      <View style={styles.resultsInfo}>
        <Text style={[styles.resultsText, { color: theme.text }]}>
          {t('search.showing')}{' '}
          <Text style={{ fontWeight: '700' }}>{showingCount}</Text>{' '}
          {t('search.of')}{' '}
          <Text style={{ fontWeight: '700' }}>{resultCount}</Text>{' '}
          {t('search.results')}
        </Text>
        {query && (
          <Text style={[styles.queryText, { color: theme.primary }]}>
            "{query}"
          </Text>
        )}
      </View>

      {/* Контролы сортировки и фильтрации */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onSortPress}
          activeOpacity={0.7}
        >
          <Ionicons name="swap-vertical" size={18} color={theme.text} />
          <Text style={[styles.controlText, { color: theme.text }]}>
            {getSortLabel(sortBy)}
          </Text>
          <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={onFilterPress}
          activeOpacity={0.7}
        >
          <Ionicons name="filter" size={18} color={theme.text} />
          <Text style={[styles.controlText, { color: theme.text }]}>
            {t('search.filters')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  resultsInfo: {
    marginBottom: 12,
  },
  resultsText: {
    fontSize: 14,
    marginBottom: 4,
  },
  queryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  controlText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 6,
  },
});

export default SearchResultsHeader;