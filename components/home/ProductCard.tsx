import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  type?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  type = 'grid',
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleAddToCart = () => {
    // Анимация нажатия
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onAddToCart(product);
  };

  const renderBadges = () => {
    const badges = [];

    if (product.discount && product.discount > 0) {
      badges.push(
        <View
          key="sale"
          style={[styles.badge, { backgroundColor: theme.error }]}
        >
          <Text style={styles.badgeText}>
            -{product.discount}%
          </Text>
        </View>
      );
    }

    if (product.isNew) {
      badges.push(
        <View
          key="new"
          style={[styles.badge, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.badgeText}>
            {t('home.new')}
          </Text>
        </View>
      );
    }

    if (product.isBestSeller) {
      badges.push(
        <View
          key="best"
          style={[styles.badge, { backgroundColor: theme.secondary }]}
        >
          <Text style={styles.badgeText}>
            ★
          </Text>
        </View>
      );
    }

    return badges;
  };

  const renderPrice = () => {
    const hasDiscount = product.discount && product.discount > 0;
    const discountedPrice = hasDiscount
      ? product.price * (1 - product.discount! / 100)
      : product.price;

    return (
      <View style={styles.priceContainer}>
        <Text style={[styles.price, { color: theme.heading }]}>
          {product.currency} {discountedPrice.toFixed(2)}
        </Text>
        {hasDiscount && (
          <Text style={[styles.originalPrice, { color: theme.textSecondary }]}>
            {product.currency} {product.price.toFixed(2)}
          </Text>
        )}
      </View>
    );
  };

  const renderRating = () => (
    <View style={styles.ratingContainer}>
      <Ionicons name="star" size={12} color={theme.primary} />
      <Text style={[styles.ratingText, { color: theme.text }]}>
        {product.rating.toFixed(1)}
      </Text>
      <Text style={[styles.reviewCount, { color: theme.textSecondary }]}>
        ({product.reviewCount})
      </Text>
    </View>
  );

  if (type === 'list') {
    return (
      <TouchableOpacity
        style={[styles.listCard, { backgroundColor: theme.card }]}
        onPress={() => onPress(product)}
        activeOpacity={0.9}
      >
        {/* Изображение */}
        <View style={styles.listImageContainer}>
          <Image
            source={{ uri: product.images[0] }}
            style={styles.listImage}
            resizeMode="cover"
          />
          <View style={styles.badgeContainer}>
            {renderBadges()}
          </View>
        </View>

        {/* Информация */}
        <View style={styles.listInfoContainer}>
          <Text
            style={[styles.listProductName, { color: theme.heading }]}
            numberOfLines={2}
          >
            {product.name}
          </Text>
          
          <Text
            style={[styles.listProductDescription, { color: theme.textSecondary }]}
            numberOfLines={2}
          >
            {product.description}
          </Text>

          {renderRating()}

          <View style={styles.listBottomRow}>
            {renderPrice()}
            
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={[
                  styles.addButton,
                  {
                    backgroundColor: product.stock > 0
                      ? theme.primary
                      : theme.border,
                  },
                ]}
                onPress={handleAddToCart}
                disabled={product.stock === 0}
                activeOpacity={0.8}
              >
                {product.stock > 0 ? (
                  <Ionicons name="cart-outline" size={18} color={theme.heading} />
                ) : (
                  <Text style={[styles.outOfStockText, { color: theme.textSecondary }]}>
                    {t('home.outOfStock')}
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Grid view (по умолчанию)
  return (
    <TouchableOpacity
      style={tailwind('mb-4')}
      onPress={() => onPress(product)}
      activeOpacity={0.9}
    >
      <View style={[styles.gridCard, { backgroundColor: theme.card }]}>
        {/* Изображение и бейджи */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[0] }}
            style={styles.gridImage}
            resizeMode="cover"
          />
          <View style={styles.badgeContainer}>
            {renderBadges()}
          </View>
        </View>

        {/* Информация о товаре */}
        <View style={styles.infoContainer}>
          <Text
            style={[styles.productName, { color: theme.text }]}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          {renderRating()}

          {renderPrice()}
        </View>

        {/* Кнопка добавления в корзину */}
        <Animated.View style={[styles.actionContainer, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor: product.stock > 0
                  ? theme.primary
                  : theme.border,
              },
            ]}
            onPress={handleAddToCart}
            disabled={product.stock === 0}
            activeOpacity={0.8}
          >
            {product.stock > 0 ? (
              <>
                <Ionicons
                  name="cart-outline"
                  size={18}
                  color={theme.heading}
                  style={tailwind('mr-2')}
                />
                <Text style={[styles.addButtonText, { color: theme.heading }]}>
                  {t('home.addToCart')}
                </Text>
              </>
            ) : (
              <Text style={[styles.outOfStockText, { color: theme.textSecondary }]}>
                {t('home.outOfStock')}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Grid стили
  gridCard: {
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  gridImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  infoContainer: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 10,
  },
  actionContainer: {
    flexDirection: 'row',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  outOfStockText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // List стили
  listCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    marginRight: 12,
  },
  listImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  listInfoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  listProductName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  listProductDescription: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
  },
  listBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ProductCard;