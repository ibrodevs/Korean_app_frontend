import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import Text from '../components/Text';
import { useTailwind } from '../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Slider from '@react-native-community/slider';

// Типы и сервисы
import { Product, SearchFilters, SearchHistoryItem, PopularSearch, Brand, ColorOption, SizeOption } from '../types/product';
import { productService } from '../services/productService';
import { searchService } from '../services/searchService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AdvancedSearchScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();

  // Состояния
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [popularSearches, setPopularSearches] = useState<PopularSearch[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    priceRange: { min: 0, max: 1000 },
    minRating: 0,
    availability: 'all',
    shipping: 'all',
    brands: [],
    colors: [],
    sizes: [],
    onSale: false,
    newArrivals: false,
    highRated: false,
  });

  // Анимации
  const filtersHeight = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);

  // Загрузка истории и популярных запросов
  useEffect(() => {
    loadSearchData();
  }, []);

  const loadSearchData = async () => {
    try {
      const [history, popular] = await Promise.all([
        searchService.getSearchHistory(),
        searchService.getPopularSearches(),
      ]);
      setSearchHistory(history);
      setPopularSearches(popular);
    } catch (error) {
      console.error('Error loading search data:', error);
    }
  };

  // Обработка поиска
  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const results = await productService.searchProducts(searchTerm);
      setSearchResults(results);
      
      // Сохраняем в историю
      await searchService.addToHistory(searchTerm, results.length);
      await loadSearchData(); // Обновляем историю
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Очистка поиска
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  // Очистка истории
  const handleClearHistory = async () => {
    await searchService.clearHistory();
    setSearchHistory([]);
  };

  // Управление фильтрами
  const toggleFilters = () => {
    Animated.timing(filtersHeight, {
      toValue: showFilters ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setShowFilters(!showFilters);
  };

  const handleApplyFilters = () => {
    toggleFilters();
    // Применяем фильтры к текущему поиску
    handleSearch();
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      categories: [],
      priceRange: { min: 0, max: 1000 },
      minRating: 0,
      availability: 'all',
      shipping: 'all',
      brands: [],
      colors: [],
      sizes: [],
      onSale: false,
      newArrivals: false,
      highRated: false,
    });
  };

  // Рендер элемента истории поиска
  const renderHistoryItem = ({ item }: { item: SearchHistoryItem }) => (
    <TouchableOpacity
      style={[styles.historyItem, { backgroundColor: theme.card }]}
      onPress={() => {
        setSearchQuery(item.query);
        handleSearch(item.query);
      }}
    >
      <Ionicons name="time-outline" size={20} color={theme.textSecondary} />
      <Text style={[styles.historyText, { color: theme.text }]} numberOfLines={1}>
        {item.query}
      </Text>
      <Text style={[styles.historyCount, { color: theme.textSecondary }]}>
        {item.resultCount}
      </Text>
    </TouchableOpacity>
  );

  // Рендер популярного запроса
  const renderPopularItem = ({ item }: { item: PopularSearch }) => (
    <TouchableOpacity
      style={[styles.popularItem, { backgroundColor: theme.card }]}
      onPress={() => {
        setSearchQuery(item.query);
        handleSearch(item.query);
      }}
    >
      <Ionicons name="trending-up-outline" size={20} color={theme.primary} />
      <Text style={[styles.popularText, { color: theme.text }]} numberOfLines={1}>
        {item.query}
      </Text>
      <Text style={[styles.popularCount, { color: theme.textSecondary }]}>
        {item.count}
      </Text>
    </TouchableOpacity>
  );

  // Панель фильтров
  const renderFiltersPanel = () => (
    <Animated.View style={[
      styles.filtersPanel,
      {
        backgroundColor: theme.card,
        maxHeight: filtersHeight.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 500],
        }),
        opacity: filtersHeight,
      },
    ]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Ценовой диапазон */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterTitle, { color: theme.heading }]}>
            {t('search.price')}
          </Text>
          <View style={tailwind('px-4 mb-4')}>
            <Slider
              minimumValue={0}
              maximumValue={1000}
              minimumTrackTintColor={theme.primary}
              maximumTrackTintColor={theme.border}
              thumbTintColor={theme.primary}
              value={filters.priceRange.max}
              onValueChange={(value) => {
                setFilters(prev => ({
                  ...prev,
                  priceRange: { ...prev.priceRange, max: value },
                }));
              }}
            />
            <View style={styles.priceLabels}>
              <Text style={[styles.priceLabel, { color: theme.text }]}>
                $0
              </Text>
              <Text style={[styles.priceLabel, { color: theme.text }]}>
                ${filters.priceRange.max.toFixed(0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Быстрые фильтры */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterTitle, { color: theme.heading }]}>
            {t('filters.availability')}
          </Text>
          <View style={styles.quickFilter}>
            {(['all', 'inStock', 'outOfStock'] as const).map((availability) => (
              <TouchableOpacity
                key={availability}
                style={[
                  styles.quickFilter,
                  {
                    backgroundColor: filters.availability === availability
                      ? theme.primary
                      : theme.border,
                  },
                ]}
                onPress={() => setFilters(prev => ({ ...prev, availability }))}
              >
                <Text style={[
                  styles.quickFilterText,
                  {
                    color: filters.availability === availability
                      ? theme.heading
                      : theme.text,
                  },
                ]}>
                  {t(`filters.${availability}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Чекбокс фильтры */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterTitle, { color: theme.heading }]}>
            {t('filters.shipping')}
          </Text>
          <View style={styles.checkboxFilters}>
            {(['all', 'free', 'paid'] as const).map((shipping) => (
              <TouchableOpacity
                key={shipping}
                style={styles.checkboxRow}
                onPress={() => setFilters(prev => ({ ...prev, shipping }))}
              >
                <View style={[
                  styles.checkbox,
                  {
                    borderColor: filters.shipping === shipping
                      ? theme.primary
                      : theme.border,
                    backgroundColor: filters.shipping === shipping
                      ? theme.primary
                      : 'transparent',
                  },
                ]}>
                  {filters.shipping === shipping && (
                    <Ionicons name="checkmark" size={16} color={theme.heading} />
                  )}
                </View>
                <Text style={[styles.checkboxLabel, { color: theme.text }]}>
                  {shipping === 'all' ? t('filters.all') : 
                   shipping === 'free' ? t('filters.freeShipping') : 'Paid Shipping'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Булевые фильтры */}
        <View style={styles.filterSection}>
          <View style={styles.booleanFilters}>
            {[
              { key: 'onSale', label: t('filters.onSale') },
              { key: 'newArrivals', label: t('filters.newArrivals') },
              { key: 'highRated', label: t('filters.highRated') },
            ].map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={styles.booleanFilter}
                onPress={() => setFilters(prev => ({ 
                  ...prev, 
                  [key]: !prev[key as keyof typeof filters] 
                }))}
              >
                <View style={[
                  styles.booleanCheckbox,
                  {
                    borderColor: filters[key as keyof typeof filters] 
                      ? theme.primary 
                      : theme.border,
                    backgroundColor: filters[key as keyof typeof filters] 
                      ? theme.primary 
                      : 'transparent',
                  },
                ]}>
                  {filters[key as keyof typeof filters] && (
                    <Ionicons name="checkmark" size={14} color={theme.heading} />
                  )}
                </View>
                <Text style={[styles.booleanLabel, { color: theme.text }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Рейтинг */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterTitle, { color: theme.heading }]}>
            {t('filters.customerRating')}
          </Text>
          <View style={styles.ratingFilters}>
            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.ratingOption,
                  {
                    backgroundColor: filters.minRating === rating
                      ? theme.primary + '20'
                      : 'transparent',
                  },
                ]}
                onPress={() => {
                  setFilters(prev => ({
                    ...prev,
                    minRating: prev.minRating === rating ? 0 : rating,
                  }));
                }}
              >
                <View style={styles.starsContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < Math.floor(rating) ? 'star' : 'star-outline'}
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
      </ScrollView>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      style={[tailwind('flex-1'), { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Хедер поиска */}
      <View style={[styles.searchHeader, { backgroundColor: theme.navBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>

        <View style={[styles.searchInputContainer, { backgroundColor: theme.card }]}>
          <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
          <TextInput
            ref={searchInputRef}
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={t('search.placeholder')}
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={toggleFilters} style={styles.filterButton}>
          <Ionicons 
            name="filter" 
            size={24} 
            color={showFilters ? theme.primary : theme.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      {/* Панель фильтров */}
      {renderFiltersPanel()}

      {/* Основной контент */}
      <FlatList
        data={searchResults.length > 0 ? searchResults : undefined}
        ListHeaderComponent={
          searchResults.length === 0 ? (
            <>
              {/* История поиска */}
              {searchHistory.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.heading }]}>
                      {t('search.recentSearches')}
                    </Text>
                    <TouchableOpacity onPress={handleClearHistory}>
                      <Text style={[styles.clearText, { color: theme.primary }]}>
                        {t('search.clearRecent')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={searchHistory}
                    renderItem={renderHistoryItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={tailwind('px-5')}
                  />
                </View>
              )}

              {/* Популярные запросы */}
              {popularSearches.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.heading }]}>
                    {t('search.popularSearches')}
                  </Text>
                  <FlatList
                    data={popularSearches}
                    renderItem={renderPopularItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={tailwind('px-5')}
                  />
                </View>
              )}

              {/* Категории для поиска */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.heading }]}>
                  {t('search.categories')}
                </Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                  {t('search.suggestions')}
                </Text>
              </View>
            </>
          ) : null
        }
        ListEmptyComponent={
          searchResults.length === 0 && searchQuery.length > 0 ? (
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={64} color={theme.textSecondary} />
              <Text style={[styles.noResultsText, { color: theme.text }]}>
                {t('search.noResults')}
              </Text>
              <Text style={[styles.noResultsSubtext, { color: theme.textSecondary }]}>
                Try different keywords or check filters
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.productItem, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          >
            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: theme.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.productPrice, { color: theme.heading }]}>
                ${item.price.toFixed(2)}
              </Text>
              <Text style={[styles.productCategory, { color: theme.textSecondary }]}>
                {item.category}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tailwind('pb-24')}
        showsVerticalScrollIndicator={false}
      />

      {/* Кнопки действий для фильтров */}
      {showFilters && (
        <View style={[styles.filterActions, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={[styles.filterAction, { backgroundColor: theme.border }]}
            onPress={handleResetFilters}
          >
            <Text style={[styles.filterActionText, { color: theme.text }]}>
              {t('search.resetFilters')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterAction, { backgroundColor: theme.primary }]}
            onPress={handleApplyFilters}
          >
            <Text style={[styles.filterActionText, { color: theme.heading }]}>
              {t('search.applyFilters')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  filterButton: {
    padding: 4,
  },
  filtersPanel: {
    overflow: 'hidden',
    borderBottomWidth: 1,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
  },
  quickFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  quickFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkboxFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  booleanFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  booleanFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  booleanCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  booleanLabel: {
    fontSize: 14,
  },
  ratingFilters: {
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
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 200,
  },
  historyText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 12,
    marginRight: 8,
  },
  historyCount: {
    fontSize: 12,
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 180,
  },
  popularText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 12,
    marginRight: 8,
  },
  popularCount: {
    fontSize: 12,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 4,
    borderRadius: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
  },
  filterActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
  },
  filterAction: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  filterActionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdvancedSearchScreen;