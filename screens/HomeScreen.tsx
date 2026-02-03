import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  TextInput,
} from 'react-native';
import Text from '../components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import { Product, Category } from '../types/product';
import { BorderRadius, Spacing, Typography } from '../constants/theme';
import { MainTabScreenProps } from '../types/navigation';
import ProductCard from '../components/ProductCard';

type HomeScreenProps = MainTabScreenProps<'HomeTab'>;

// Mock data
const mockCategories: Category[] = [
  { id: '1', name: 'category', icon: '📱', color: '#4A90E2', productCount: 150 },
  { id: '2', name: 'category', icon: '📱', color: '#4A90E2', productCount: 89 },
  { id: '3', name: 'category', icon: '📱', color: '#4A90E2', productCount: 200 },
  { id: '4', name: 'category', icon: '📱', color: '#4A90E2', productCount: 75 },
  { id: '5', name: 'categ', icon: '📱', color: '#4A90E2', productCount: 45 },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Organic Tomatoes',
    description: 'Premium quality organic tomatoes from local farms',
    price: 400,
    originalPrice: 700,
    discount: 43,
    currency: 'SOM',
    category: 'Vegetables',
    images: ['https://picsum.photos/300/300?random=1'],
    rating: 4.9,
    reviewCount: 245,
    stock: 50,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    tags: ['organic', 'fresh', 'vegetables'],
    seller: {
      id: 'seller1',
      name: 'name of thing'
    },
    inStock: true,
  },
  {
    id: '2',
    name: 'Sweet Red Apples',
    description: 'Crispy and sweet red apples perfect for snacking',
    price: 350,
    originalPrice: 500,
    discount: 30,
    currency: 'SOM',
    category: 'Fruits',
    images: ['https://picsum.photos/300/300?random=2'],
    rating: 4.8,
    reviewCount: 189,
    stock: 100,
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    tags: ['fresh', 'sweet', 'fruits'],
    seller: {
      id: 'seller2',
      name: 'name of thing'
    },
    inStock: true,
  },
  {
    id: '3',
    name: 'Premium Beef Steak',
    description: 'High-quality beef steak, perfect for grilling',
    price: 1200,
    originalPrice: 1500,
    discount: 20,
    currency: 'SOM',
    category: 'Meat & Eggs',
    images: ['https://picsum.photos/300/300?random=3'],
    rating: 4.7,
    reviewCount: 156,
    stock: 25,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    tags: ['meat', 'premium', 'beef'],
    seller: {
      id: 'seller3',
      name: 'name of thing'
    },
    inStock: true,
  },
  {
    id: '4',
    name: 'Fresh Milk',
    description: 'Pure and fresh milk from local dairy farms',
    price: 150,
    currency: 'SOM',
    category: 'Drinks',
    images: ['https://picsum.photos/300/300?random=4'],
    rating: 4.6,
    reviewCount: 98,
    stock: 200,
    isNew: false,
    isFeatured: true,
    isBestSeller: false,
    tags: ['milk', 'fresh', 'dairy'],
    seller: {
      id: 'seller4',
      name: 'Dairy Farm'
    },
    inStock: true,
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps['navigation']>();
  const { t } = useTranslation();
  const { colors, theme } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(mockProducts);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: '#4A90E2',
      paddingTop: (StatusBar.currentHeight || 0) + 10,
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    logo: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 28,
      letterSpacing: 0.5,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoIcon: {
      marginLeft: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 8,
      padding: 6,
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 0,
    },
    searchContainer: {
      marginTop: 15,
      paddingHorizontal: 0,
    },
    searchInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 25,
      paddingHorizontal: 16,
      paddingVertical: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: '#374151',
      paddingVertical: 0,
    },
    scrollView: {
      flex: 1,
    },
    section: {
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    sectionTitle: {
      ...Typography.h3,
      color: colors.text,
      fontWeight: 'bold',
    },
    seeAllButton: {
      ...Typography.body,
      color: colors.primary,
      fontWeight: '600',
    },
    bannerContainer: {
      height: 160,
      marginBottom: 20,
      marginTop: 20,
    },
    banner: {
      flex: 1,
      backgroundColor: '#4A90E2',
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 10,
    },
    bannerLeft: {
      flex: 1,
    },
    bannerRight: {
      width: 120,
      height: 120,
      borderRadius: 15,
      backgroundColor: '#F59E0B',
      marginLeft: 15,
      overflow: 'hidden',
    },
    discountText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
    },
    discountPercent: {
      color: '#FFFFFF',
      fontSize: 36,
      fontWeight: '800',
      marginBottom: 4,
    },
    discountSubtitle: {
      color: '#FFFFFF',
      fontSize: 14,
      marginBottom: 12,
      opacity: 0.9,
    },
    seeDetailButton: {
      backgroundColor: '#F59E0B',
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    seeDetailText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    bannerImage: {
      width: '100%',
      height: '100%',
    },
    sliderIndicators: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 12,
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    activeIndicator: {
      backgroundColor: '#4A90E2',
      width: 20,
    },
    inactiveIndicator: {
      backgroundColor: '#D1D5DB',
    },
    bannerText: {
      color: colors.heading,
      fontWeight: '700',
      textAlign: 'center',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
    },
    categoriesContainer: {
      paddingLeft: Spacing.lg,
    },
    categoryCard: {
      width: 80,
      alignItems: 'center',
      marginRight: 20,
    },
    categoryIconContainer: {
      width: 64,
      height: 64,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    categoryIcon: {
      fontSize: 32,
    },
    categoryName: {
      fontSize: 12,
      fontWeight: '600',
      color: '#374151',
      textAlign: 'center',
      lineHeight: 14,
    },
    categoryCount: {
      ...Typography.caption,
      color: colors.textSecondary,
      fontSize: 10,
    },
    productsGrid: {
      paddingHorizontal: 8,
      paddingTop: 4,
    },
    productRow: {
      justifyContent: 'space-between',
      paddingHorizontal: 0,
    },
    productColumn: {
      flex: 1,
    },
  });

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

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
    // Навигация на уровне Root Navigator
    const rootNavigation = navigation.getParent();
    rootNavigation?.navigate('ProductDetail', { product });
  };

  const handleToggleWishlist = (product: Product) => {
    toggleFavorite(product.id);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    // Можно добавить Toast или Alert для подтверждения
    console.log('Added to cart:', product.name);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const rootNavigation = navigation.getParent();
      rootNavigation?.navigate('AdvancedSearch', { query: searchQuery });
    }
  };
  
  const handleCartPress = () => {
    navigation.navigate('CartTab' as never);
  };

  const handleCategoryPress = (category: Category) => {
    const rootNavigation = navigation.getParent();
    rootNavigation?.navigate('AdvancedSearch', { category: category.id });
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
    >
      <View style={[styles.categoryIconContainer, { backgroundColor: item.color }]}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.categoryName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <View style={styles.productColumn}>
      <ProductCard
        product={item}
        onPress={handleProductPress}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={isFavorite(item.id)}
        onAddToCart={handleAddToCart}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>Korean Shop</Text>
            <View style={styles.logoIcon}>
              <Ionicons name="business-outline" size={18} color="white" />
            </View>
          </View>
          <View style={styles.headerIcons}>
            <LanguageSwitcher />
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
              onPress={() => navigation.navigate('TestScreen' as any)}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600' }}>🧪</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]} 
              onPress={handleCartPress}
            >
              <Ionicons name="cart-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for fruits, vegetables, groce..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Discount Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <View style={styles.bannerLeft}>
              <Text style={styles.discountText}>Discount</Text>
              <Text style={styles.discountPercent}>25%</Text>
              <Text style={styles.discountSubtitle}>All Vegetables & Fruits</Text>
              <TouchableOpacity style={styles.seeDetailButton}>
                <Text style={styles.seeDetailText}>See Detail</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bannerRight}>
              <Text style={[styles.categoryIcon, { fontSize: 60, textAlign: 'center', lineHeight: 120 }]}>🥬🍎🍅</Text>
            </View>
          </View>
          <View style={styles.sliderIndicators}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={[styles.indicator, styles.inactiveIndicator]} />
            <View style={[styles.indicator, styles.inactiveIndicator]} />
            <View style={[styles.indicator, styles.inactiveIndicator]} />
          </View>
        </View>

        {/* Categories */}
        <View style={[styles.section, { paddingHorizontal: 20 }]}>
          <View style={[styles.sectionHeader, { marginBottom: 15 }]}>
            <Text style={[styles.sectionTitle, { color: '#374151', fontSize: 22, fontWeight: '700' }]}>Categories</Text>
          </View>
          
          <FlatList
            data={mockCategories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20 }}
          />
        </View>

        {/* Featured Products */}
        <View style={[styles.section, { paddingHorizontal: 20 }]}>
          <View style={[styles.sectionHeader, { marginBottom: 15 }]}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 20, fontWeight: '700' }]}>{t('home.featured')}</Text>
            <TouchableOpacity onPress={() => {
              const rootNavigation = navigation.getParent();
              rootNavigation?.navigate('Search');
            }}>
              <Text style={[styles.seeAllButton, { color: theme.primary, fontSize: 14, fontWeight: '600' }]}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
            columnWrapperStyle={styles.productRow}
            ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
          />
        </View>
      </ScrollView>
    </View>
  );
}