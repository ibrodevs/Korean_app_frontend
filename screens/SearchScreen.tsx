import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
} from 'react-native';
import Text from '../components/Text';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing } from '../constants/theme';
import { Product } from '../types/product';
import ProductCard from '../components/ProductCard';
import Input from '../components/Input';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Korean Ginseng Tea',
    description: 'Premium Korean red ginseng tea for health and vitality',
    price: 35000,
    images: ['https://picsum.photos/300/300?random=4'],
    category: 'K-Food',
    inStock: true,
    rating: 4.7,
    reviewCount: 123,
    seller: { id: '1', name: 'Ginseng Masters', rating: 4.8 },
  },
  {
    id: '2',
    name: 'K-Pop Merch T-Shirt',
    description: 'Official K-Pop merchandise high-quality cotton t-shirt',
    price: 45000,
    discountPrice: 35000,
    images: ['https://picsum.photos/300/300?random=5'],
    category: 'K-Fashion',
    inStock: true,
    rating: 4.9,
    reviewCount: 89,
    seller: { id: '2', name: 'K-Style Store', rating: 4.7 },
  },
];

export default function SearchScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.header,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.lg,
      paddingTop: (StatusBar.currentHeight || 0) + Spacing.lg,
    },
    searchContainer: {
      marginBottom: Spacing.sm,
    },
    content: {
      flex: 1,
      paddingHorizontal: Spacing.lg,
    },
    resultsHeader: {
      paddingVertical: Spacing.md,
    },
    resultsCount: {
      ...Typography.body,
      color: colors.textSecondary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
    },
    emptyText: {
      ...Typography.h3,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    emptySubtext: {
      ...Typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    productItem: {
      marginBottom: Spacing.md,
    },
  });

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = async () => {
    setLoading(true);
    try {
      // Simulate API search
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filtered = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: Product) => {
    // Navigate to product detail
    console.log('Product pressed:', product.name);
  };

  const renderProduct = ({ item }: { item: Product }) => {
    return (
      <View style={styles.productItem}>
        <ProductCard product={item} onPress={handleProductPress} />
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchQuery.trim() ? t('errors.noProducts') : t('search.startSearching')}
        </Text>
        <Text style={styles.emptySubtext}>
          {searchQuery.trim() ? t('search.tryDifferentKeywords') : t('search.searchInstructions')}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.header} />
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Input
            placeholder={t('home.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search-outline"
            style={{ backgroundColor: '#FFFFFF' }}
          />
        </View>
      </View>
      <View style={styles.content}>
        {searchQuery.trim() && searchResults.length > 0 ? (
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {t('search.resultsCount', { count: searchResults.length })}
            </Text>
          </View>
        ) : null}
        <FlatList
          data={searchResults}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={searchResults.length === 0 ? { flex: 1 } : undefined}
        />
      </View>
    </View>
  );
}