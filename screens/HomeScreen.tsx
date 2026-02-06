import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ProductCard from '../components/ProductCard';
import Text from '../components/Text';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { MainTabScreenProps } from '../types/navigation';
import { Category, Product } from '../types/product';

type HomeScreenProps = MainTabScreenProps<'HomeTab'>;

// Modern categories with better icons
const mockCategories: Category[] = [
  { id: '1', name: 'Электроника', icon: '📱', color: '#6366F1', productCount: 150 },
  { id: '2', name: 'Одежда', icon: '👕', color: '#EC4899', productCount: 89 },
  { id: '3', name: 'Дом и сад', icon: '🏠', color: '#10B981', productCount: 200 },
  { id: '4', name: 'Красота', icon: '💄', color: '#F59E0B', productCount: 75 },
  { id: '5', name: 'Спорт', icon: '⚽', color: '#3B82F6', productCount: 45 },
  { id: '6', name: 'Книги', icon: '📚', color: '#8B5CF6', productCount: 120 },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Последний смартфон Apple с продвинутой камерой',
    price: 999,
    originalPrice: 1199,
    discount: 17,
    currency: 'USD',
    category: 'Electronics',
    images: [],
    rating: 4.9,
    reviewCount: 1245,
    stock: 50,
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    tags: ['apple', 'premium', 'smartphone'],
    seller: { id: 'apple', name: 'Apple Store' },
    inStock: true,
  },
  {
    id: '2',
    name: 'Air Jordan 1',
    description: 'Классические баскетбольные кроссовки',
    price: 150,
    originalPrice: 180,
    discount: 17,
    currency: 'USD',
    category: 'Fashion',
    images: [],
    rating: 4.8,
    reviewCount: 892,
    stock: 100,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    tags: ['nike', 'sneakers', 'limited'],
    seller: { id: 'nike', name: 'Nike Official' },
    inStock: true,
  },
  {
    id: '3',
    name: 'MacBook Air M2',
    description: 'Ультратонкий и мощный ноутбук',
    price: 1299,
    originalPrice: 1499,
    discount: 13,
    currency: 'USD',
    category: 'Electronics',
    images: [],
    rating: 4.9,
    reviewCount: 2156,
    stock: 25,
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    tags: ['apple', 'laptop', 'm2'],
    seller: { id: 'apple', name: 'Apple Store' },
    inStock: true,
  },
  {
    id: '4',
    name: 'Беспроводные наушники',
    description: 'Премиальные наушники с шумоподавлением',
    price: 299,
    originalPrice: 399,
    discount: 25,
    currency: 'USD',
    category: 'Electronics',
    images: [],
    rating: 4.7,
    reviewCount: 987,
    stock: 200,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    tags: ['audio', 'wireless', 'premium'],
    seller: { id: 'sony', name: 'Sony Electronics' },
    inStock: true,
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps['navigation']>();
  const { t } = useTranslation();
  const { colors, theme } = useTheme();
  const { addToCart, cartItems } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(mockProducts);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get('window');
  const bannerWidth = width - 48;

  const bannerColors = [
    '#6366F1',
    '#EC4899',
    '#10B981',
  ];

  const infiniteBannerColors = [...bannerColors, ...bannerColors];

  // Animated header background
  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ['rgba(23, 121, 243, 1)', 'rgba(23, 121, 243, 0.95)'],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80, 100],
    outputRange: [1, 0.9, 0.8],
    extrapolate: 'clamp',
  });

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight! + 20,
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    logo: {
      color: '#FFFFFF',
      fontWeight: '800',
      fontSize: 24,
      letterSpacing: -0.5,
    },
    logoHighlight: {
      color: '#FFD700',
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    cartBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: '#EF4444',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
    },
    cartBadgeText: {
      color: 'white',
      fontSize: 10,
      fontWeight: '700',
    },
    searchContainer: {
      marginTop: 15,
    },
    searchInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: '#1F2937',
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      paddingTop: Platform.OS === 'ios' ? 180 : 160,
    },
    section: {
      marginBottom: 32,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: -0.5,
    },
    seeAllButton: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
      opacity: 0.9,
    },
    bannerContainer: {
      marginBottom: 32,
    },
    banner: {
      width: bannerWidth,
      height: 160,
      borderRadius: 24,
      overflow: 'hidden',
      marginHorizontal: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
    bannerImage: {
      width: '100%',
      height: '100%',
    },
    bannerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    bannerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 8,
    },
    bannerSubtitle: {
      fontSize: 16,
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
    },
    bannerOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    bannerPagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
      paddingHorizontal: 24,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    categoriesContainer: {
      paddingLeft: 24,
    },
    categoryCard: {
      alignItems: 'center',
      marginRight: 20,
    },
    categoryIconContainer: {
      width: 72,
      height: 72,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    categoryIcon: {
      fontSize: 32,
    },
    categoryName: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      maxWidth: 80,
    },
    categoryCount: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    productsGrid: {
      paddingHorizontal: 20,
    },
    productRow: {
      justifyContent: 'space-between',
    },
    productColumn: {
      flex: 1,
      maxWidth: '48%',
    },
  });

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => {
        const next = (prev + 1) % bannerColors.length;
        const infiniteNext = (prev + 1) % infiniteBannerColors.length;
        flatListRef.current?.scrollTo({
          x: infiniteNext * (bannerWidth + 48),
          animated: true,
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [bannerColors.length]);

  const loadFeaturedProducts = async () => {
    // Simulate API call
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
    // Here you could add a success notification
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.getParent()?.navigate('AdvancedSearch', { query: searchQuery });
    }
  };

  const handleCartPress = () => {
    navigation.navigate('CartTab' as never);
  };

  const handleScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (bannerWidth + 48));
    let realIndex = index % bannerColors.length;
    setCurrentBannerIndex(realIndex);
    if (index >= bannerColors.length) {
      flatListRef.current?.scrollTo({
        x: realIndex * (bannerWidth + 48),
        animated: false,
      });
    }
  };

  const handleCategoryPress = (category: Category) => {
    navigation.getParent()?.navigate('AdvancedSearch', { category: category.id });
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.categoryIconContainer, { backgroundColor: item.color }]}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.categoryName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.categoryCount}>
        {item.productCount} товаров
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <View style={[styles.productColumn, { marginLeft: index % 2 === 1 ? 8 : 0 }]}>
      <ProductCard
        product={item}
        onPress={handleProductPress}
        onAddToCart={handleAddToCart}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, {
        backgroundColor: headerBackgroundColor,
        opacity: headerOpacity,
      }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>
              Korean<Text style={styles.logoHighlight}>Shop</Text>
            </Text>
          </View>
          
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleCartPress}>
              <Ionicons name="cart-outline" size={22} color="white" />
              {cartItemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchInputWrapper} onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск товаров, брендов и категорий..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              editable={false}
            />
            <Ionicons name="options-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Banner Slider */}
        <View style={styles.bannerContainer}>
          <ScrollView
            ref={flatListRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
            snapToInterval={bannerWidth + 48}
            snapToAlignment="center"
            decelerationRate="fast"
            scrollEventThrottle={16}
          >
            {infiniteBannerColors.map((color, index) => (
              <View key={index} style={[styles.banner, { backgroundColor: color }]}>
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>Специальные предложения</Text>
                  <Text style={styles.bannerSubtitle}>Скидки до 70%</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.bannerPagination}>
            {bannerColors.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor: index === currentBannerIndex
                      ? '#FFFFFF'
                      : 'rgba(255, 255, 255, 0.4)',
                    width: index === currentBannerIndex ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Категории</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>Все</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={mockCategories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Рекомендуемые товары</Text>
            <TouchableOpacity onPress={() => {
              navigation.getParent()?.navigate('Search');
            }}>
              <Text style={styles.seeAllButton}>Все</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
}