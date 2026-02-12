import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Dimensions, Pressable, StyleSheet, View } from 'react-native';
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
const CARD_HEIGHT = 300;
const PRIMARY_COLOR = '#1774F3';

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
  const [imageError, setImageError] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const addToCartScaleAnim = useRef(new Animated.Value(1)).current;

  const getDiscountPercentage = useCallback(() => {
    if (product.originalPrice && product.price) {
      const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return product.discount || 0;
  }, [product.originalPrice, product.price, product.discount]);

  const formatPrice = useCallback((price: number) => {
    return `${price.toLocaleString('ru-RU')} сом`;
  }, []);

  const discountPercentage = getDiscountPercentage();
  const hasDiscount = discountPercentage > 0;
  
  const isNew = useMemo(() => {
    return product.isNew || false;
  }, [product.isNew]);

  const isBestSeller = useMemo(() => {
    return product.isBestSeller || false;
  }, [product.isBestSeller]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handlePress = () => {
    onPress(product);
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    
    // Анимация bounce для кнопки
    Animated.sequence([
      Animated.timing(addToCartScaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addToCartScaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addToCartScaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addToCartScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onAddToCart?.(product);
  };

  const handleToggleWishlist = (e: any) => {
    e.stopPropagation();
    onToggleWishlist?.(product);
  };

  const getStockStatus = useMemo(() => {
    if (product.stock === undefined) return null;
    if (product.stock > 10) return { label: 'В наличии', color: '#10B981' };
    if (product.stock > 0) return { label: 'Мало', color: '#F59E0B' };
    return { label: 'Нет в наличии', color: '#EF4444' };
  }, [product.stock]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <View style={[styles.card, isPressed && styles.cardPressed]}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {!imageError && product.images && product.images[0] ? (
            <>
              <Image
                style={styles.image}
                source={{ uri: product.images[0] }}
                contentFit="cover"
                transition={200}
                onLoad={handleImageLoad}
                onError={handleImageError}
                cachePolicy="memory-disk"
              />
              {!imageLoaded && (
                <View style={styles.imagePlaceholder}>
                  <View style={styles.placeholderShimmer} />
                </View>
              )}
            </>
          ) : (
            <View style={styles.placeholderContainer}>
              <View style={styles.placeholderLogo}>
                <Text style={styles.placeholderLogoText}>
                  KS
                </Text>
              </View>
              <Text style={styles.placeholderText}>
                {product.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
              </Text>
            </View>
          )}

          {/* Status Badges */}
          <View style={styles.badgeContainer}>
            {hasDiscount && (
              <View style={[styles.badge, styles.discountBadge]}>
                <Ionicons name="pricetag" size={10} color="#FFFFFF" />
                <Text style={styles.badgeText}>-{discountPercentage}%</Text>
              </View>
            )}
            
            {isNew && !hasDiscount && (
              <View style={[styles.badge, styles.newBadge]}>
                <Ionicons name="sparkles" size={10} color="#FFFFFF" />
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            )}
            
            {isBestSeller && !hasDiscount && !isNew && (
              <View style={[styles.badge, styles.bestsellerBadge]}>
                <Ionicons name="trophy" size={10} color="#FFFFFF" />
                <Text style={styles.badgeText}>TOP</Text>
              </View>
            )}
          </View>

          {/* Stock Status */}
          {getStockStatus && (
            <View style={[
              styles.stockBadge,
              { backgroundColor: `${getStockStatus.color}15` }
            ]}>
              <View style={[
                styles.stockIndicator,
                { backgroundColor: getStockStatus.color }
              ]} />
              <Text style={[
                styles.stockText,
                { color: getStockStatus.color }
              ]}>
                {getStockStatus.label}
              </Text>
            </View>
          )}

          {/* Wishlist Button */}
          {onToggleWishlist && (
            <Pressable
              style={({ pressed }) => [
                styles.wishlistButton,
                pressed && styles.wishlistButtonPressed,
                isWishlisted && styles.wishlistButtonActive,
              ]}
              onPress={handleToggleWishlist}
              hitSlop={8}
            >
              <Ionicons
                name={isWishlisted ? 'heart' : 'heart-outline'}
                size={18}
                color={isWishlisted ? '#FFFFFF' : '#64748B'}
              />
            </Pressable>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          {/* Category & Rating */}
          <View style={styles.metaContainer}>
            <View style={[styles.categoryBadge]}>
              <Text style={styles.categoryText} numberOfLines={1}>
                {product.category}
              </Text>
            </View>
            
            {product.rating && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color="#FFB800" />
                <Text style={styles.ratingText}>
                  {product.rating}
                </Text>
                {product.reviewCount && (
                  <Text style={styles.reviewCountText}>
                    ({product.reviewCount})
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Product Name */}
          <Text
            style={styles.productName}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {product.name}
          </Text>

          {/* Description */}
          {product.description && (
            <Text
              style={styles.productDescription}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {product.description}
            </Text>
          )}

          {/* Price */}
          <View style={styles.priceContainer}>
            <View style={styles.priceSection}>
              <Text style={styles.price}>
                {formatPrice(product.price)}
              </Text>
              {product.originalPrice && product.originalPrice > product.price && (
                <Text style={styles.originalPrice}>
                  {formatPrice(product.originalPrice)}
                </Text>
              )}
            </View>
          </View>

          {/* Add to Cart Button */}
          {onAddToCart && product.inStock !== false && product.stock !== 0 && (
            <Animated.View
              style={[
                styles.addToCartButton,
                {
                  transform: [{ scale: addToCartScaleAnim }],
                },
              ]}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.addToCartButtonInner,
                  pressed && styles.addToCartButtonPressed,
                ]}
                onPress={handleAddToCart}
                disabled={!onAddToCart}
              >
                <BlurView 
                  intensity={20} 
                  tint="light" 
                  style={styles.addToCartBlur}
                >
                  <Ionicons
                    name="cart-outline"
                    size={16}
                    color={PRIMARY_COLOR}
                    style={styles.cartIcon}
                  />
                  <Text style={styles.addToCartText}>
                    Добавить в корзину
                  </Text>
                </BlurView>
              </Pressable>
            </Animated.View>
          )}
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: 12,
  },
  containerPressed: {
    transform: [{ scale: 0.98 }],
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    height: CARD_WIDTH * 0.75,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F1F5F9',
  },
  placeholderShimmer: {
    flex: 1,
    backgroundColor: '#E2E8F0',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  placeholderLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderLogoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 2,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    gap: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  discountBadge: {
    backgroundColor: '#EF4444',
  },
  newBadge: {
    backgroundColor: '#10B981',
  },
  bestsellerBadge: {
    backgroundColor: '#F59E0B',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  stockBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  stockIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockText: {
    fontSize: 10,
    fontWeight: '600',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  wishlistButtonPressed: {
    transform: [{ scale: 0.9 }],
  },
  wishlistButtonActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: 'rgba(23, 116, 243, 0.08)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flex: 1,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: PRIMARY_COLOR,
    textTransform: 'uppercase',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
  },
  reviewCountText: {
    fontSize: 10,
    color: '#94A3B8',
    marginLeft: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 18,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 14,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceSection: {
    flexDirection: 'column',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: PRIMARY_COLOR,
  },
  originalPrice: {
    fontSize: 11,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  addToCartButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  addToCartButtonInner: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  addToCartButtonPressed: {
    transform: [{ scale: 0.97 }],
  },
  addToCartBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(23, 116, 243, 0.08)',
  },
  cartIcon: {
    marginRight: 6,
  },
  addToCartText: {
    color: PRIMARY_COLOR,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ProductCard;