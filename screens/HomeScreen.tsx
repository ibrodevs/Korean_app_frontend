import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ProductCard from '../components/ProductCard';
import Text from '../components/Text';
import { BorderRadius, Shadows, Spacing, Typography } from '../constants/theme';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { MainTabScreenProps } from '../types/navigation';
import { Category, Product } from '../types/product';

type HomeScreenProps = MainTabScreenProps<'HomeTab'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const PRIMARY_COLOR = '#1779F3';
const PRIMARY_GRADIENT = ['#1779F3', '#4A9DFF'];
const HEADER_MAX_HEIGHT = 140;
const HEADER_MIN_HEIGHT = 70;
const TAB_BAR_HEIGHT = 60;

// Modern categories with icons
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

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'Титановый корпус, динамический остров',
    price: 129990,
    originalPrice: 149990,
    discount: 13,
    currency: 'RUB',
    category: 'Электроника',
    images: ['https://picsum.photos/400/400?random=1'],
    rating: 4.9,
    reviewCount: 1245,
    stock: 50,
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    tags: ['apple', 'premium', '2024'],
    seller: { id: 'apple', name: 'Apple Store' },
    inStock: true,
  },
  {
    id: '2',
    name: 'Nike Air Force 1',
    description: 'Классические белые кроссовки',
    price: 12990,
    originalPrice: 14990,
    discount: 13,
    currency: 'RUB',
    category: 'Обувь',
    images: ['https://picsum.photos/400/400?random=2'],
    rating: 4.8,
    reviewCount: 892,
    stock: 100,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    tags: ['nike', 'sneakers'],
    seller: { id: 'nike', name: 'Nike Official' },
    inStock: true,
  },
  {
    id: '3',
    name: 'MacBook Air M3',
    description: '13.6", 8GB, 256GB, Space Gray',
    price: 99990,
    originalPrice: 119990,
    discount: 17,
    currency: 'RUB',
    category: 'Ноутбуки',
    images: ['https://picsum.photos/400/400?random=3'],
    rating: 4.9,
    reviewCount: 2156,
    stock: 25,
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    tags: ['apple', 'laptop', 'm3'],
    seller: { id: 'apple', name: 'Apple Store' },
    inStock: true,
  },
  {
    id: '4',
    name: 'AirPods Pro 2',
    description: 'Активное шумоподавление',
    price: 24990,
    originalPrice: 29990,
    discount: 17,
    currency: 'RUB',
    category: 'Аудио',
    images: ['https://picsum.photos/400/400?random=4'],
    rating: 4.7,
    reviewCount: 543,
    stock: 80,
    isNew: false,
    isFeatured: true,
    isBestSeller: false,
    tags: ['apple', 'wireless'],
    seller: { id: 'apple', name: 'Apple Store' },
    inStock: true,
  },
  {
    id: '5',
    name: 'Samsung Galaxy S24',
    description: 'Искусственный интеллект в каждом кадре',
    price: 89990,
    originalPrice: 99990,
    discount: 10,
    currency: 'RUB',
    category: 'Смартфоны',
    images: ['https://picsum.photos/400/400?random=5'],
    rating: 4.8,
    reviewCount: 1567,
    stock: 45,
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    tags: ['samsung', 'android', 'ai'],
    seller: { id: 'samsung', name: 'Samsung Official' },
    inStock: true,
  },
  {
    id: '6',
    name: 'PlayStation 5',
    description: 'Консоль нового поколения',
    price: 49990,
    originalPrice: 59990,
    discount: 17,
    currency: 'RUB',
    category: 'Игры',
    images: ['https://picsum.photos/400/400?random=6'],
    rating: 4.9,
    reviewCount: 3124,
    stock: 30,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    tags: ['sony', 'gaming'],
    seller: { id: 'sony', name: 'Sony Official' },
    inStock: true,
  },
];

const bannerData = [
  { 
    id: '1', 
    title: 'Черная пятница', 
    subtitle: 'Скидки до 70%',
    gradient: ['#1779F3', '#4A9DFF', '#83C5FF']
  },
  { 
    id: '2', 
    title: 'Новая коллекция', 
    subtitle: 'Весна 2026',
    gradient: ['#FF6B8B', '#FF8E9E', '#FFB6C1']
  },
  { 
    id: '3', 
    title: 'Бесплатная доставка', 
    subtitle: 'При заказе от 2999₽',
    gradient: ['#10B981', '#34D399', '#6EE7B7']
  },
];

// Memoized Components
const CategoryItem = memo(({ 
  item, 
  onPress,
  isActive 
}: { 
  item: Category; 
  onPress: (category: Category) => void;
  isActive: boolean;
}) => (
  <TouchableOpacity
    style={[styles.categoryCard, isActive && styles.categoryCardActive]}
    onPress={() => onPress(item)}
    activeOpacity={0.7}
  >
    <LinearGradient
      colors={isActive ? PRIMARY_GRADIENT : ['#FFFFFF', '#F8FAFC']}
      style={styles.categoryIconContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Ionicons 
        name={item.icon as any} 
        size={24} 
        color={isActive ? '#FFFFFF' : item.color} 
      />
    </LinearGradient>
    <Text 
      style={[
        styles.categoryName, 
        isActive && styles.categoryNameActive
      ]} 
      numberOfLines={1}
    >
      {item.name}
    </Text>
  </TouchableOpacity>
));

const BannerItem = memo(({ item, onPress }: { item: typeof bannerData[0]; onPress: () => void }) => (
  <TouchableOpacity 
    activeOpacity={0.9}
    onPress={onPress}
  >
    <LinearGradient
      colors={item.gradient}
      style={styles.banner}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.bannerContent}>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>🔥 ГОРЯЧЕЕ</Text>
        </View>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
));

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const { cartItems, addToCart } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(mockProducts);
  const [refreshing, setRefreshing] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('1');
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const bannerScrollRef = useRef<FlatList>(null);
  const categoriesScrollRef = useRef<FlatList>(null);

  // Animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const searchTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  const bannerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  // Memoized values
  const cartItemCount = useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const filteredProducts = useMemo(() => {
    let products = featuredProducts;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      products = products.filter(p => 
        p.category === mockCategories.find(c => c.id === selectedCategory)?.name
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    return products;
  }, [featuredProducts, selectedCategory, searchQuery]);

  // Effects
  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentBannerIndex + 1) % bannerData.length;
      setCurrentBannerIndex(nextIndex);
      bannerScrollRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [currentBannerIndex]);

  // Handlers
  const loadFeaturedProducts = useCallback(async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFeaturedProducts(mockProducts);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFeaturedProducts();
    setRefreshing(false);
  }, [loadFeaturedProducts]);

  const handleProductPress = useCallback((product: Product) => {
    navigation.getParent()?.navigate('ProductDetail', { product });
  }, [navigation]);

  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product, 1);
  }, [addToCart]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      navigation.getParent()?.navigate('AdvancedSearch', { query: searchQuery });
    }
  }, [searchQuery, navigation]);

  const handleCartPress = useCallback(() => {
    navigation.navigate('CartTab');
  }, [navigation]);

  const handleCategoryPress = useCallback((category: Category) => {
    setSelectedCategory(category.id);
    // Scroll category into view
    const categoryIndex = mockCategories.findIndex(c => c.id === category.id);
    categoriesScrollRef.current?.scrollToIndex({
      index: categoryIndex,
      animated: true,
      viewPosition: 0.5,
    });
  }, []);

  const handleSeeAllProducts = useCallback(() => {
    navigation.getParent()?.navigate('Search');
  }, [navigation]);

  const renderProduct = useCallback(({ item, index }: { item: Product; index: number }) => (
    <View style={[
      styles.productColumn, 
      { marginLeft: index % 2 === 1 ? Spacing.sm : 0 }
    ]}>
      <ProductCard
        product={item}
        onPress={handleProductPress}
        onAddToCart={handleAddToCart}
      />
    </View>
  ), [handleProductPress, handleAddToCart]);

  const renderListHeader = useCallback(() => (
    <>
      {/* Banner Carousel */}
      <Animated.View style={[
        styles.bannerContainer,
        { transform: [{ scale: bannerScale }] }
      ]}>
        <FlatList
          ref={bannerScrollRef}
          data={bannerData}
          renderItem={({ item }) => <BannerItem item={item} onPress={() => navigation.navigate('SearchTab')} />}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={screenWidth - Spacing.lg * 2}
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / (screenWidth - Spacing.lg * 2)
            );
            setCurrentBannerIndex(index);
          }}
          initialScrollIndex={0}
        />
        <View style={styles.bannerPagination}>
          {bannerData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentBannerIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </Animated.View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Популярные категории
          </Text>
          <TouchableOpacity onPress={() => setSelectedCategory('all')}>
            <Text style={[styles.seeAllButton, { color: PRIMARY_COLOR }]}>
              Все
            </Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          ref={categoriesScrollRef}
          data={mockCategories}
          renderItem={({ item }) => (
            <CategoryItem 
              item={item} 
              onPress={handleCategoryPress}
              isActive={selectedCategory === item.id}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          initialNumToRender={6}
        />
      </View>

      {/* Featured Products Header */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Рекомендуем для вас
            </Text>
          </View>
          <TouchableOpacity onPress={handleSeeAllProducts}>
            <Text style={[styles.seeAllButton, { color: PRIMARY_COLOR }]}>
              Смотреть все
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  ), [currentBannerIndex, selectedCategory, theme, handleCategoryPress, handleSeeAllProducts, bannerScale]);

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <StatusBar 
        barStyle="dark-content" 
        translucent 
        backgroundColor="transparent" 
      />
      
      {/* Animated Header Background */}
      <Animated.View 
        style={[
          styles.headerBackground,
          {
            height: headerHeight,
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          }
        ]}
      >
        <LinearGradient
          colors={PRIMARY_GRADIENT}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Main Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            height: HEADER_MIN_HEIGHT,
            transform: [{ translateY: headerTranslateY }],
          }
        ]}
      >
        <View style={styles.headerContent}>
          {/* Logo and Search */}
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#FFFFFF', '#F1F5F9']}
                style={styles.logoWrapper}
              >
                <Text style={styles.logo}>K</Text>
              </LinearGradient>
              <Text style={[styles.logoText, { color: '#FFFFFF' }]}>
                <Text style={styles.logoTextBold}>Korean</Text>Shop
              </Text>
            </View>
            
            <View style={styles.headerIcons}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={handleCartPress}
              >
                <Ionicons name="cart-outline" size={22} color="#FFFFFF" />
                {cartItemCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <Animated.View 
            style={[
              styles.searchContainer,
              { transform: [{ translateY: searchTranslateY }] }
            ]}
          >
            <View style={styles.searchInputWrapper}>
              <TouchableOpacity 
                onPress={handleSearch}
                activeOpacity={0.8}
                style={styles.searchIconContainer}
              >
                <Ionicons 
                  name="search" 
                  size={20} 
                  color={PRIMARY_COLOR}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.searchInput}
                placeholder="Что вы ищете?"
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Product Grid */}
      <Animated.FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: HEADER_MAX_HEIGHT + 20 }
        ]}
        ListHeaderComponent={renderListHeader}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={PRIMARY_COLOR}
            colors={[PRIMARY_COLOR]}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={100}
        windowSize={10}
        removeClippedSubviews={Platform.OS === 'android'}
        ListFooterComponent={<View style={{ height: TAB_BAR_HEIGHT + 100 }} />}
      />

      {/* Floating Button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ChatTab')}
      >
        <LinearGradient
          colors={PRIMARY_GRADIENT}
          style={styles.floatingButtonGradient}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  logo: {
    fontSize: 24,
    fontWeight: '900',
    color: PRIMARY_COLOR,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '300',
  },
  logoTextBold: {
    fontWeight: '800',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF4757',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    paddingHorizontal: 4,
  },
  searchContainer: {
    marginBottom: Spacing.sm,
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
  searchIconContainer: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: '#1E293B',
    fontSize: 16,
  },
  clearButton: {
    marginLeft: Spacing.sm,
  },
  contentContainer: {
    paddingBottom: TAB_BAR_HEIGHT + 50,
  },
  bannerContainer: {
    marginBottom: Spacing.xl,
    height: 180,
  },
  banner: {
    width: screenWidth - Spacing.lg * 2,
    height: 160,
    borderRadius: 24,
    marginHorizontal: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: Spacing.xl,
  },
  bannerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginBottom: Spacing.md,
  },
  bannerBadgeText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 10,
  },
  bannerTitle: {
    ...Typography.h2,
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  bannerSubtitle: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 16,
  },
  bannerPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(23, 121, 243, 0.2)',
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: PRIMARY_COLOR,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  quickAction: {
    alignItems: 'center',
    width: (screenWidth - Spacing.lg * 2 - Spacing.md * 3) / 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  quickActionText: {
    ...Typography.caption,
    color: '#64748B',
    fontWeight: '600',
    fontSize: 12,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionSubtitle: {
    ...Typography.caption,
    marginTop: 2,
  },
  seeAllButton: {
    ...Typography.label,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.lg,
    paddingRight: Spacing.md,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: Spacing.md,
    width: 80,
  },
  categoryCardActive: {
    transform: [{ scale: 1.05 }],
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  categoryName: {
    ...Typography.caption,
    color: '#64748B',
    fontWeight: '600',
    fontSize: 12,
  },
  categoryNameActive: {
    color: PRIMARY_COLOR,
    fontWeight: '700',
  },
  productColumn: {
    flex: 1,
    maxWidth: '48%',
    marginBottom: Spacing.md,
  },
  floatingButton: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT + 20,
    right: Spacing.lg,
    zIndex: 99,
  },
  floatingButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
});