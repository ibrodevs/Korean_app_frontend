import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ProductCard from '../components/ProductCard';
import Text from '../components/Text';
import { BorderRadius, Shadows, Spacing, Typography } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

// Типы и сервисы
import { productService } from '../services/productService';
import { searchService } from '../services/searchService';
import { Category, PopularSearch, Product, SearchFilters, SearchHistoryItem } from '../types/product';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PRIMARY_COLOR = '#1779F3';
const PRIMARY_GRADIENT = ['#1779F3', '#4A9DFF'];
const HEADER_HEIGHT = 120;

// Моковые категории
const mockCategories: Category[] = [
  { id: '1', name: 'Электроника', icon: 'phone-portrait-outline', color: '#1779F3', productCount: 150 },
  { id: '2', name: 'Одежда', icon: 'shirt-outline', color: '#FF6B8B', productCount: 89 },
  { id: '3', name: 'Дом', icon: 'home-outline', color: '#10B981', productCount: 200 },
  { id: '4', name: 'Красота', icon: 'sparkles-outline', color: '#F59E0B', productCount: 75 },
  { id: '5', name: 'Спорт', icon: 'basketball-outline', color: '#8B5CF6', productCount: 45 },
  { id: '6', name: 'Книги', icon: 'book-outline', color: '#6366F1', productCount: 120 },
  { id: '7', name: 'Авто', icon: 'car-outline', color: '#3B82F6', productCount: 65 },
  { id: '8', name: 'Еда', icon: 'fast-food-outline', color: '#EC4899', productCount: 180 },
];

type AdvancedSearchScreenRouteProp = RouteProp<{
  AdvancedSearch: {
    query?: string;
    category?: string;
  };
}, 'AdvancedSearch'>;

const AdvancedSearchScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<AdvancedSearchScreenRouteProp>();
  const { query: initialQuery, category: initialCategory } = route.params || {};

  // Состояния
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [popularSearches, setPopularSearches] = useState<PopularSearch[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery || '',
    categories: initialCategory ? [initialCategory] : [],
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Загрузка истории и популярных запросов
  useEffect(() => {
    loadSearchData();
    // Запускаем анимации
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Если есть изначальный запрос или категория, выполняем поиск
    if (initialQuery || initialCategory) {
      handleSearch(initialQuery);
    }
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
    setSelectedCategories([]);
  };

  // Обработчик категорий
  const handleCategoryPress = useCallback((category: Category) => {
    const isSelected = selectedCategories.includes(category.name);
    const newCategories = isSelected 
      ? selectedCategories.filter(c => c !== category.name)
      : [...selectedCategories, category.name];
    
    setSelectedCategories(newCategories);
    setFilters(prev => ({ ...prev, categories: newCategories }));
  }, [selectedCategories]);

  // Обработчик обновления
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSearchData();
    if (searchQuery) {
      await handleSearch();
    }
    setRefreshing(false);
  }, [searchQuery]);

  // Обработчик нажатия на товар
  const handleProductPress = useCallback((product: Product) => {
    navigation.navigate('ProductDetail' as never, { product } as never);
  }, [navigation]);

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
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[PRIMARY_COLOR + '20', PRIMARY_COLOR + '10']}
        style={styles.popularIconContainer}
      >
        <Ionicons name="trending-up" size={16} color={PRIMARY_COLOR} />
      </LinearGradient>
      <Text style={[styles.popularText, { color: theme.text }]} numberOfLines={1}>
        {item.query}
      </Text>
      <View style={[styles.countBadge, { backgroundColor: PRIMARY_COLOR + '20' }]}>
        <Text style={[styles.popularCount, { color: PRIMARY_COLOR }]}>
          {item.count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Рендер категории
  const renderCategoryItem = ({ item }: { item: Category }) => {
    const isSelected = selectedCategories.includes(item.name);
    return (
      <TouchableOpacity
        style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={isSelected ? PRIMARY_GRADIENT : ['#FFFFFF', '#F8FAFC']}
          style={styles.categoryIconContainer}
        >
          <Ionicons 
            name={item.icon as any} 
            size={20} 
            color={isSelected ? '#FFFFFF' : item.color} 
          />
        </LinearGradient>
        <Text style={[
          styles.categoryName, 
          { color: isSelected ? PRIMARY_COLOR : theme.text }
        ]}>
          {item.name}
        </Text>
        <Text style={[styles.categoryCount, { color: theme.textSecondary }]}>
          {item.productCount}
        </Text>
      </TouchableOpacity>
    );
  };

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
            Цена
          </Text>
          <View style={styles.priceSliderContainer}>
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
            Наличие
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
                  {availability === 'all' ? 'Все' : 
                   availability === 'inStock' ? 'В наличии' : 'Нет в наличии'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Чекбокс фильтры */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterTitle, { color: theme.heading }]}>
            Доставка
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
                  {shipping === 'all' ? 'Все' : 
                   shipping === 'free' ? 'Бесплатная доставка' : 'Платная доставка'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Булевые фильтры */}
        <View style={styles.filterSection}>
          <View style={styles.booleanFilters}>
            {[
              { key: 'onSale', label: 'По скидке' },
              { key: 'newArrivals', label: 'Новинки' },
              { key: 'highRated', label: 'Высокий рейтинг' },
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
            Рейтинг покупателей
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
      style={[styles.container, { backgroundColor: '#FFFFFF' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Анимированный хедер */}
      <Animated.View 
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <LinearGradient
          colors={PRIMARY_GRADIENT}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <View style={styles.backButtonContainer}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>
                Расширенный поиск
              </Text>
              {selectedCategories.length > 0 && (
                <Text style={styles.headerSubtitle}>
                  {selectedCategories.length} категорий выбрано
                </Text>
              )}
            </View>

            <TouchableOpacity 
              onPress={toggleFilters} 
              style={styles.filterButton}
              activeOpacity={0.7}
            >
              <View style={[
                styles.filterButtonContainer,
                { backgroundColor: showFilters ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)' }
              ]}>
                <Ionicons 
                  name="options" 
                  size={20} 
                  color="#FFFFFF" 
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Строка поиска */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={20} color={PRIMARY_COLOR} />
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                placeholder="Что вы ищете?"
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => handleSearch()}
                returnKeyType="search"
                autoFocus={!initialQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={handleClearSearch}>
                  <Ionicons name="close-circle" size={20} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Панель фильтров */}
      {renderFiltersPanel()}

      {/* Основной контент */}
      <Animated.View style={[
        styles.contentContainer,
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}>
        <FlatList
          data={searchResults.length > 0 ? searchResults : []}
          ListHeaderComponent={
            <>
              {/* Категории */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>
                      Категории
                    </Text>
                    <Text style={styles.sectionSubtitle}>
                      Выберите категории для поиска
                    </Text>
                  </View>
                  {selectedCategories.length > 0 && (
                    <TouchableOpacity 
                      onPress={() => {
                        setSelectedCategories([]);
                        setFilters(prev => ({ ...prev, categories: [] }));
                      }}
                    >
                      <Text style={[styles.clearText, { color: PRIMARY_COLOR }]}>
                        Очистить все
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                <FlatList
                  data={mockCategories}
                  renderItem={renderCategoryItem}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesContainer}
                />
              </View>

              {searchResults.length === 0 && (
                <>
                  {/* История поиска */}
                  {searchHistory.length > 0 && (
                    <View style={styles.section}>
                      <View style={styles.sectionHeader}>
                        <View>
                          <Text style={styles.sectionTitle}>
                            Недавние поиски
                          </Text>
                        </View>
                        <TouchableOpacity onPress={handleClearHistory}>
                          <Text style={[styles.clearText, { color: PRIMARY_COLOR }]}>
                            Очистить историю
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <FlatList
                        data={searchHistory}
                        renderItem={renderHistoryItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.historiesContainer}
                      />
                    </View>
                  )}

                  {/* Популярные запросы */}
                  {popularSearches.length > 0 && (
                    <View style={styles.section}>
                      <View style={styles.sectionHeader}>
                        <View>
                          <Text style={styles.sectionTitle}>
                            Популярные запросы
                          </Text>
                          <Text style={styles.sectionSubtitle}>
                            В тренде
                          </Text>
                        </View>
                      </View>
                      <FlatList
                        data={popularSearches}
                        renderItem={renderPopularItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.popularContainer}
                      />
                    </View>
                  )}
                </>
              )}
            </>
          }
          ListEmptyComponent={
            searchQuery.length > 0 ? (
              <View style={styles.noResults}>
                <LinearGradient
                  colors={[PRIMARY_COLOR + '20', PRIMARY_COLOR + '10']}
                  style={styles.noResultsIcon}
                >
                  <Ionicons name="search-outline" size={48} color={PRIMARY_COLOR} />
                </LinearGradient>
                <Text style={styles.noResultsText}>
                  Ничего не найдено
                </Text>
                <Text style={styles.noResultsSubtext}>
                  Попробуйте другие ключевые слова
                </Text>
                <TouchableOpacity 
                  style={styles.tryAgainButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Text style={styles.tryAgainText}>
                    Попробовать снова
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
          renderItem={({ item, index }) => (
            <View style={[
              styles.productColumn,
              { marginLeft: index % 2 === 1 ? Spacing.sm : 0 }
            ]}>
              <ProductCard
                product={item}
                onPress={handleProductPress}
                onAddToCart={() => {}}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={PRIMARY_COLOR}
              colors={[PRIMARY_COLOR]}
            />
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      </Animated.View>

      {/* Кнопки действий для фильтров */}
      {showFilters && (
        <View style={[styles.filterActions, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={[styles.filterAction, { backgroundColor: theme.border }]}
            onPress={handleResetFilters}
          >
            <Text style={[styles.filterActionText, { color: theme.text }]}>
              Сбросить фильтры
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterAction, { backgroundColor: theme.primary }]}
            onPress={handleApplyFilters}
          >
            <Text style={[styles.filterActionText, { color: theme.heading }]}>
              Применить фильтры
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    position: 'relative',
    zIndex: 100,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : Platform.OS === 'web' ? 20 : ((StatusBar.currentHeight || 0) + 10),
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  backButtonContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h3,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerSubtitle: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  filterButton: {
    marginLeft: Spacing.md,
  },
  filterButtonContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginTop: Spacing.md,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    ...Shadows.lg,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: '#1E293B',
    fontSize: 16,
    marginLeft: Spacing.sm,
  },
  contentContainer: {
    flex: 1,
    marginTop: -12,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: '#1E293B',
    fontWeight: '700',
  },
  sectionSubtitle: {
    ...Typography.caption,
    color: '#64748B',
    marginTop: 2,
  },
  clearText: {
    ...Typography.label,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.lg,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: Spacing.md,
    width: 100,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  categoryItemSelected: {
    backgroundColor: PRIMARY_COLOR + '10',
    transform: [{ scale: 1.02 }],
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  categoryName: {
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  categoryCount: {
    ...Typography.caption,
    fontSize: 10,
    marginTop: 2,
  },
  historiesContainer: {
    paddingHorizontal: Spacing.lg,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.sm,
    width: 200,
    backgroundColor: '#F8FAFC',
    ...Shadows.sm,
  },
  historyText: {
    flex: 1,
    ...Typography.body,
    fontSize: 14,
    marginLeft: Spacing.sm,
    color: '#1E293B',
  },
  historyCount: {
    ...Typography.caption,
    fontSize: 11,
    color: '#64748B',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  popularContainer: {
    paddingHorizontal: Spacing.lg,
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.sm,
    width: 180,
    backgroundColor: '#FFFFFF',
    ...Shadows.sm,
  },
  popularIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  popularText: {
    flex: 1,
    ...Typography.body,
    fontSize: 14,
    color: '#1E293B',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularCount: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '600',
  },
  resultsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  productColumn: {
    flex: 1,
    maxWidth: '48%',
    marginBottom: Spacing.md,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: Spacing.xl,
  },
  noResultsIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  noResultsText: {
    ...Typography.h4,
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  noResultsSubtext: {
    ...Typography.body,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  tryAgainButton: {
    backgroundColor: PRIMARY_COLOR + '15',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  tryAgainText: {
    ...Typography.label,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  filterActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...Shadows.lg,
  },
  filterAction: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    ...Shadows.sm,
  },
  filterActionText: {
    ...Typography.button,
    fontWeight: '600',
  },
  filtersPanel: {
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    ...Shadows.md,
  },
  filterSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterTitle: {
    ...Typography.h5,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: Spacing.md,
  },
  priceSliderContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  priceLabel: {
    ...Typography.caption,
    color: '#64748B',
  },
  quickFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickFilter: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  quickFilterText: {
    ...Typography.label,
    fontWeight: '500',
  },
  checkboxFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  checkboxLabel: {
    ...Typography.body,
    fontSize: 14,
  },
  booleanFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  booleanFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  booleanCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  booleanLabel: {
    ...Typography.body,
    fontSize: 14,
  },
  ratingFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ratingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: Spacing.xs,
  },
  ratingText: {
    ...Typography.label,
    fontWeight: '500',
  },
});

export default AdvancedSearchScreen;