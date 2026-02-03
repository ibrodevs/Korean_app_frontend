import React, { useState, useEffect } from 'react';
import {
  View,
  
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';

interface RelatedProductsProps {
  productId: string;
  category: string;
  onProductPress: (productId: string) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  productId,
  category,
  onProductPress,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRelatedProducts();
  }, [productId, category]);

  const loadRelatedProducts = async () => {
    try {
      setLoading(true);
      const products = await productService.getRelatedProducts(productId, category);
      setRelatedProducts(products);
    } catch (error) {
      console.error('Error loading related products:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: theme.card }]}
      onPress={() => onProductPress(item.id)}
    >
      <Image
        source={{ uri: item.images[0] }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text
          style={[styles.productName, { color: theme.text }]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text style={[styles.productPrice, { color: theme.text }]}>
          {item.currency} {item.price.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (relatedProducts.length === 0 && !loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>
        {t('product.relatedProducts')}
      </Text>
      {loading ? (
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Loading...
        </Text>
      ) : (
        <FlatList
          data={relatedProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tailwind('px-4')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  loadingText: {
    paddingHorizontal: 20,
    fontSize: 16,
    fontStyle: 'italic',
  },
  productCard: {
    width: 150,
    marginRight: 12,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    paddingHorizontal: 4,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default RelatedProducts;