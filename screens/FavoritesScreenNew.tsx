import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
} from 'react-native';
import Text from '../components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../contexts/FavoritesContext';
import ProductCard from '../components/ProductCard';
import { Product } from '../types/product';
import { FavoritesStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type FavoritesScreenProps = NativeStackScreenProps<FavoritesStackParamList, 'FavoritesMain'>;

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Carrot',
    description: 'Premium quality product',
    price: 400,
    originalPrice: 700,
    discount: 43,
    currency: 'сом',
    category: 'vegetables',
    images: ['gradient'],
    rating: 4.9,
    reviewCount: 245,
    stock: 50,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    tags: ['featured'],
    seller: {
      id: 'seller1',
      name: 'Organic Farm'
    },
    inStock: true,
  },
  {
    id: '2',
    name: 'Fresh Tomato',
    description: 'Premium quality product',
    price: 500,
    originalPrice: 800,
    discount: 38,
    currency: 'сом',
    category: 'vegetables',
    images: ['gradient'],
    rating: 4.8,
    reviewCount: 180,
    stock: 30,
    isNew: false,
    isFeatured: true,
    isBestSeller: false,
    tags: ['organic'],
    seller: {
      id: 'seller2',
      name: 'Local Market'
    },
    inStock: true,
  },
];

export default function FavoritesScreen({ navigation }: FavoritesScreenProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Get favorite products from mock data
  const favoriteProducts = mockProducts.filter(product => favorites.includes(product.id));

  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product.name);
    // navigation.navigate('ProductDetail', { product });
  };

  const handleToggleWishlist = (product: Product) => {
    toggleFavorite(product.id);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productColumn}>
      <ProductCard
        product={item}
        onPress={handleProductPress}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={isFavorite(item.id)}
        onAddToCart={(product) => {
          console.log('Added to cart:', product.name);
        }}
      />
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.navBackground,
      paddingTop: StatusBar.currentHeight || 0,
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
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 10,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.heading,
    },
    scrollView: {
      flex: 1,
    },
    productsContainer: {
      paddingHorizontal: 8,
      paddingVertical: 16,
    },
    productRow: {
      justifyContent: 'space-between',
      paddingHorizontal: 0,
    },
    productColumn: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginTop: 16,
      marginBottom: 8,
      color: theme.text,
    },
    emptySubtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>{t('favorites.title')}</Text>
        </View>
      </View>

      {favoriteProducts.length > 0 ? (
        <FlatList
          data={favoriteProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
          columnWrapperStyle={styles.productRow}
          style={styles.scrollView}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={theme.textSecondary} />
          <Text style={styles.emptyTitle}>
            {t('favorites.empty')}
          </Text>
          <Text style={styles.emptySubtitle}>
            {t('favorites.emptyDescription')}
          </Text>
        </View>
      )}
    </View>
  );
}