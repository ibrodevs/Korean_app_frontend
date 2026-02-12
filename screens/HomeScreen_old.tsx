import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ProductCard from '../components/ProductCard';
import Text from '../components/Text';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { MainTabScreenProps } from '../types/navigation';
import { Category, Product } from '../types/product';

type HomeScreenProps = MainTabScreenProps<'HomeTab'>;

const PRIMARY_COLOR = '#1774F3';

// Modern categories with icons
const mockCategories: Category[] = [
  { id: '1', name: 'Электроника', icon: 'laptop-outline', color: '#1774F3', productCount: 150 },
  { id: '2', name: 'Одежда', icon: 'shirt-outline', color: '#1774F3', productCount: 89 },
  { id: '3', name: 'Дом', icon: 'home-outline', color: '#1774F3', productCount: 200 },
  { id: '4', name: 'Красота', icon: 'sparkles-outline', color: '#1774F3', productCount: 75 },
  { id: '5', name: 'Спорт', icon: 'basketball-outline', color: '#1774F3', productCount: 45 },
  { id: '6', name: 'Книги', icon: 'book-outline', color: '#1774F3', productCount: 120 },
  { id: '7', name: 'Авто', icon: 'car-outline', color: '#1774F3', productCount: 65 },
  { id: '8', name: 'Еда', icon: 'fast-food-outline', color: '#1774F3', productCount: 180 },
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
    title: 'Premium Selection', 
    subtitle: 'Эксклюзивные товары',
    description: 'Только лучшее из Кореи'
  },
  { 
    id: '2', 
    title: 'Fast Delivery', 
    subtitle: 'Доставка 1-3 дня',
    description: 'По всей России'
  },
  { 
    id: '3', 
    title: 'Official Warranty', 
    subtitle: '100% гарантия',
    description: 'Сертифицированные товары'
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
  isActive?: boolean;
}) => (
  <TouchableOpacity
    style={[styles.categoryCard, isActive && styles.categoryCardActive]}
    onPress={() => onPress(item)}
    activeOpacity={0.7}
  >
    <View style={[
      styles.categoryIconContainer,
      isActive && styles.categoryIconContainerActive
    ]}>
      <Ionicons 
        name={item.icon as any} 
        size={24} 
        color={isActive ? '#FFFFFF' : PRIMARY_COLOR} 
      />
    </View>
    <Text 
      style={[
        styles.categoryName,
        isActive && styles.categoryNameActive
      ]} 
      numberOfLines={1}
    >
      {item.name}
    </Text>
    <Text style={styles.categoryCount}>
      {item.productCount}
    </Text>
  </TouchableOpacity>
));

const BannerItem = ({ item }: { item: typeof bannerData[0] }) => (
  <View style={styles.bannerWrapper}>
    <View style={styles.banner}>
      <View style={styles.bannerContent}>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>KOREAN SHOP</Text>
        </View>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
        <Text style={styles.bannerDescription}>{item.description}</Text>
      </View>
    </View>
  </View>
);

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { theme } = useTheme();
  const { cartItems, addToCart } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(mockProducts);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = (() => {
    let products = featuredProducts;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory) {
      products = products.filter(p => 
        p.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    
    return products;
  })();

  // Обработчики
  const loadFeaturedProducts = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFeaturedProducts(mockProducts);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeaturedProducts();
    setRefreshing(false);
  };

  const handleProductPress = (product: Product) => {
    navigation.getParent()?.navigate('ProductDetail', { product });
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.getParent()?.navigate('AdvancedSearch', { query: searchQuery });
    }
  };

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(prev => prev === category.name ? null : category.name);
    navigation.getParent()?.navigate('AdvancedSearch', { category: category.name });
  };

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <View style={[
      styles.productColumn, 
      { marginLeft: index % 2 === 1 ? 16 : 0 }
    ]}>
      <ProductCard
        product={item}
        onPress={handleProductPress}
        onAddToCart={handleAddToCart}
      />
    </View>
  );

  const renderListHeader = useCallback(() => (
    <>
      {/* Banner Carousel */}
      <Animated.View style={[
        styles.bannerContainer,
        { transform: [{ scale: bannerParallax }] }
      ]}>
        <FlatList
          ref={bannerScrollRef}
          data={bannerData}
          renderItem={({ item }) => (
            <BannerItem 
              item={item} 
              onPress={() => navigation.navigate('SearchTab')} 
            />
          )}
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

      {/* Categories Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Категории
            </Text>
            <Text style={styles.sectionSubtitle}>
              Выберите категорию для поиска
            </Text>
          </View>
          <TouchableOpacity onPress={() => setSelectedCategory(null)}>
            <Text style={styles.resetButton}>
              Сбросить
            </Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={mockCategories}
          renderItem={({ item }) => (
            <CategoryItem 
              item={item} 
              onPress={handleCategoryPress}
              isActive={selectedCategory === item.name}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          initialNumToRender={8}
        />
      </View>

      {/* Featured Products Header */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Рекомендуемые товары
            </Text>
            <Text style={styles.sectionSubtitle}>
              {filteredProducts.length} товаров в наличии
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={handleSeeAllProducts}
          >
            <Text style={styles.seeAllButtonText}>
              Все товары
            </Text>
            <Ionicons name="arrow-forward" size={16} color={PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  ), [currentBannerIndex, selectedCategory, filteredProducts.length, handleCategoryPress, handleSeeAllProducts, bannerParallax]);

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        translucent 
        backgroundColor="transparent" 
      />
      
      {/* Простой заголовок */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Text style={styles.logo}>KS</Text>
              </View>
              <View>
                <Text style={styles.logoText}>
                  KOREAN SHOP
                </Text>
                <Text style={styles.logoSubtext}>
                  Premium Store
                </Text>
              </View>
            </View>
            
            <View style={styles.headerIcons}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => {}}
              >
                <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => navigation.navigate('CartTab', { screen: 'Cart' })}
              >
                <Ionicons name="cart-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Поисковая строка */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons 
                name="search" 
                size={20} 
                color="#94A3B8"
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Поиск товаров..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  onPress={() => setSearchQuery('')} 
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={20} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={PRIMARY_COLOR}
            colors={[PRIMARY_COLOR]}
          />
        }
        ListHeaderComponent={() => (
          <>
            {/* Banner Carousel */}
            <View style={styles.bannerContainer}>
              <FlatList
                data={bannerData}
                renderItem={({ item }) => <BannerItem item={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
              />
            </View>

            {/* Categories Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>
                    Категории
                  </Text>
                  <Text style={styles.sectionSubtitle}>
                    Выберите категорию для поиска
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                  <Text style={styles.resetButton}>
                    Сбросить
                  </Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={mockCategories}
                renderItem={({ item }) => (
                  <CategoryItem 
                    item={item} 
                    onPress={handleCategoryPress}
                    isActive={selectedCategory === item.name}
                  />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              />
            </View>

            {/* Featured Products Header */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>
                    Рекомендуемые товары
                  </Text>
                  <Text style={styles.sectionSubtitle}>
                    {filteredProducts.length} товаров в наличии
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#94A3B8" />
            <Text style={styles.emptyText}>
              Товары не найдены
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
            >
              <Text style={styles.emptyButtonText}>
                Сбросить фильтры
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    fontSize: 20,
    fontWeight: '800',
    color: PRIMARY_COLOR,
    letterSpacing: 1,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  logoSubtext: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  bannerContainer: {
    marginBottom: 24,
    height: 180,
  },
  bannerWrapper: {
    width: 300,
    marginHorizontal: 16,
  },
  banner: {
    height: 160,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(23, 116, 243, 0.1)',
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  bannerBadge: {
    backgroundColor: 'rgba(23, 116, 243, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  bannerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    letterSpacing: 1,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  bannerDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  resetButton: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.xs,
  },
  seeAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    gap: 12,
  },
  categoryCard: {
    alignItems: 'center',
    width: 90,
    paddingVertical: 12,
  },
  categoryCardActive: {
    transform: [{ scale: 1.05 }],
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 116, 243, 0.1)',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(23, 116, 243, 0.2)',
  },
  categoryIconContainerActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  categoryNameActive: {
    color: PRIMARY_COLOR,
  },
  categoryCount: {
    fontSize: 10,
    color: '#94A3B8',
  },
  productColumn: {
    flex: 1,
    maxWidth: '48%',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 20,
  },
  emptyButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(23, 116, 243, 0.1)',
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
});