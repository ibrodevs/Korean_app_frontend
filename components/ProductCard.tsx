import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Product } from '../types/product';
import Text from './Text';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - 48) / 2;
const CARD_HEIGHT = 280;

const ProductCard = memo(function ProductCard({
  product,
  onPress,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [wishlistPressed, setWishlistPressed] = useState(false);
  const [cartPressed, setCartPressed] = useState(false);

  const getDiscountPercentage = useCallback(() => {
    if (product.originalPrice && product.price) {
      const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return product.discount || 0;
  }, [product.originalPrice, product.price, product.discount]);

  const formatPrice = useCallback((price: number) => {
    return `${price.toLocaleString('ru-RU')} ₽`;
  }, []);

  const discountPercentage = getDiscountPercentage();
  const hasDiscount = discountPercentage > 0;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handlePress = () => {
    onPress(product);
  };

  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  const handleToggleWishlist = () => {
    onToggleWishlist?.(product);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.95 : 1 },
      ]}
      onPress={handlePress}
      android_ripple={{ color: 'rgba(0,0,0,0.05)', borderless: false }}
    >
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {product.imageUrl ? (
            <>
              <Image
                style={styles.image}
                source={{ uri: product.imageUrl }}
                contentFit="cover"
                onLoadEnd={handleImageLoad}
              />
              {!imageLoaded && (
                <View style={styles.imagePlaceholder}>
                  <LinearGradient
                    colors={['#667EEA', '#764BA2']}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
              )}
            </>
          ) : (
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              style={styles.gradientBackground}
            >
              <Text style={styles.gradientText}>
                {product.name.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discountPercentage}%</Text>
            </View>
          )}

          {/* Wishlist Button */}
          {onToggleWishlist && (
            <Pressable
              style={({ pressed }) => [
                styles.wishlistButton,
                { transform: [{ scale: pressed ? 0.9 : 1 }] },
              ]}
              onPress={handleToggleWishlist}
              onPressIn={() => setWishlistPressed(true)}
              onPressOut={() => setWishlistPressed(false)}
              hitSlop={8}
            >
              <Ionicons
                name={isWishlisted ? 'heart' : 'heart-outline'}
                size={20}
                color={isWishlisted ? '#FF3B30' : theme.textSecondary}
              />
            </Pressable>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          {/* Category */}
          <View style={[styles.categoryBadge, { backgroundColor: `${theme.primary}15` }]}>
            <Text style={[styles.categoryText, { color: theme.primary }]}>
              {product.category}
            </Text>
          </View>

          {/* Product Name */}
          <Text
            style={[styles.productName, { color: theme.text }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {product.name}
          </Text>

          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={[styles.price, { color: theme.primary }]}>
              {formatPrice(product.price)}
            </Text>
            {product.originalPrice && product.originalPrice > product.price && (
              <Text style={[styles.originalPrice, { color: theme.textSecondary }]}>
                {formatPrice(product.originalPrice)}
              </Text>
            )}
          </View>

          {/* Add to Cart Button */}
          <Pressable
            style={({ pressed }) => [
              styles.addToCartButton,
              { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 },
            ]}
            onPress={handleAddToCart}
            onPressIn={() => setCartPressed(true)}
            onPressOut={() => setCartPressed(false)}
            disabled={!onAddToCart}
          >
            <Ionicons
              name="cart-outline"
              size={16}
              color="#FFFFFF"
              style={styles.cartIcon}
            />
            <Text style={styles.addToCartText}>{t('common.addToCart')}</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: 6,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    height: CARD_WIDTH * 0.75,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    opacity: 0.8,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
    marginBottom: 8,
    flex: 1,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 12,
    fontWeight: '500',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  cartIcon: {
    marginRight: 6,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ProductCard;