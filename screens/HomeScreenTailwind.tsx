import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import 'nativewind';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FlatList,
    RefreshControl,
    ScrollView,
    StatusBar,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import BannerCarousel from '../components/BannerCarousel';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import Text from '../components/Text';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { MainTabScreenProps } from '../types/navigation';
import { Category, Product } from '../types/product';

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
  const { addToCart } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(mockProducts);

  const bannerImages = useMemo(() => [
    'https://picsum.photos/300/300?random=1',
    'https://picsum.photos/300/300?random=2',
    'https://picsum.photos/300/300?random=3',
    'https://picsum.photos/300/300?random=4',
  ], []);

  const loadFeaturedProducts = useCallback(async () => {
    // Simulate API call
    setFeaturedProducts(mockProducts);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFeaturedProducts();
    setRefreshing(false);
  }, [loadFeaturedProducts]);

  const handleProductPress = useCallback((product: Product) => {
    const rootNavigation = navigation.getParent();
    rootNavigation?.navigate('ProductDetail', { product });
  }, [navigation]);

  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product, 1);
    console.log('Added to cart:', product.name);
  }, [addToCart]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      const rootNavigation = navigation.getParent();
      rootNavigation?.navigate('AdvancedSearch', { query: searchQuery });
    }
  }, [navigation, searchQuery]);
  
  const handleCartPress = useCallback(() => {
    navigation.navigate('CartTab' as never);
  }, [navigation]);

  const handleCategoryPress = useCallback((category: Category) => {
    const rootNavigation = navigation.getParent();
    rootNavigation?.navigate('AdvancedSearch', { category: category.id });
  }, [navigation]);

  useEffect(() => {
    loadFeaturedProducts();
  }, [loadFeaturedProducts]);

  const renderCategory = useCallback(({ item }: { item: Category }) => (
    <CategoryCard
      category={item}
      onPress={handleCategoryPress}
    />
  ), [handleCategoryPress]);

  const renderProduct = useCallback(({ item, index }: { item: Product; index: number }) => (
    <View className="flex-1">
      <ProductCard
        product={item}
        onPress={handleProductPress}
        onAddToCart={handleAddToCart}
      />
    </View>
  ), [handleProductPress, handleAddToCart]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header with search */}
      <View 
        className="bg-blue-600 px-5 pb-5 rounded-b-3xl shadow-lg"
        style={{ 
          paddingTop: (StatusBar.currentHeight || 0) + 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8
        }}
      >
        {/* Header top */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Text className="text-white font-bold text-3xl tracking-wider">Korean Shop</Text>
            <View className="ml-2 bg-white bg-opacity-20 rounded-lg p-2">
              <Ionicons name="business-outline" size={18} color="white" />
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity 
              className="w-10 h-10 rounded-full justify-center items-center bg-white bg-opacity-20" 
              onPress={handleCartPress}
            >
              <Ionicons name="cart-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Search */}
        <View className="mt-4">
          <View className="flex-row items-center bg-white rounded-3xl px-4 py-3 shadow-sm" style={{ elevation: 3 }}>
            <Ionicons name="search" size={20} color="#9CA3AF" className="mr-3" />
            <TextInput
              className="flex-1 text-base text-gray-700 py-0"
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
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Banner Section */}
        <BannerCarousel images={bannerImages} />

        {/* Categories */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4 px-5">
            <Text className="text-gray-700 text-2xl font-bold">Categories</Text>
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
        <View className="mb-8 px-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text 
              className="text-xl font-bold" 
              style={{ color: theme.text }}
            >
              {t('home.featured')}
            </Text>
            <TouchableOpacity onPress={() => {
              const rootNavigation = navigation.getParent();
              rootNavigation?.navigate('Search');
            }}>
              <Text 
                className="text-sm font-semibold" 
                style={{ color: theme.primary }}
              >
                {t('common.seeAll')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            className="pt-1"
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            ItemSeparatorComponent={() => <View className="h-0" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}