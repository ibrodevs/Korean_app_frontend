import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from './Text';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types/product';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 64) / 2; // 64 = 16 padding left + 16 padding right + 16 gap left + 16 gap right

export default function ProductCard({
  product,
  onPress,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderRadius: 16,
      marginHorizontal: 8,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 0.5,
      borderColor: 'rgba(255, 255, 255, 0.8)',
      overflow: 'hidden',
      width: cardWidth,
      height: 300, // Fixed height for consistent sizing
    },
    imageContainer: {
      position: 'relative',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: 'hidden',
      height: 120, // Reduced height
    },
    gradientBackground: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    gradientText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '800',
      textShadow: '0px 2px 4px rgba(0,0,0,0.4)',
      letterSpacing: 0.5,
    },
    wishlistButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 18,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    discountBadge: {
      position: 'absolute',
      top: 16,
      left: 16,
      backgroundColor: '#FF3B30',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 6,
      shadowColor: '#FF3B30',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    discountText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '800',
    },
    content: {
      padding: 12,
      flex: 1,
      justifyContent: 'space-between',
    },
    productInfo: {
      flex: 1,
      marginBottom: 8,
    },
    categoryBadge: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
      borderRadius: 8,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginBottom: 6,
    },
    categoryText: {
      fontSize: 10,
      color: '#007AFF',
      fontWeight: '600',
    },
    productName: {
      fontSize: 13,
      fontWeight: '700',
      color: '#1C1C1E',
      marginBottom: 6,
      lineHeight: 16,
      minHeight: 32, // Ensure consistent height for 2 lines
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    price: {
      fontSize: 15,
      fontWeight: '800',
      color: '#FF3B30',
    },
    originalPrice: {
      fontSize: 11,
      fontWeight: '500',
      color: '#8E8E93',
      textDecorationLine: 'line-through',
      marginLeft: 4,
    },
    addToCartButton: {
      backgroundColor: '#007AFF',
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#007AFF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
      marginTop: 'auto',
    },
    addToCartText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.2,
    },
  });

  const getDiscountPercentage = () => {
    if (product.originalPrice && product.price) {
      const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return product.discount || 0;
  };

  const formatPrice = (price: number) => {
    return `${price} сом`;
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={() => onPress(product)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.imageContainer}>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899', '#F59E0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <Text style={styles.gradientText}>ФОТКА</Text>
          </LinearGradient>
          
          {getDiscountPercentage() > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{getDiscountPercentage()}%</Text>
            </View>
          )}

          {onToggleWishlist && (
            <Pressable
              style={styles.wishlistButton}
              onPress={() => onToggleWishlist(product)}
            >
              <Ionicons
                name={isWishlisted ? 'heart' : 'heart-outline'}
                size={20}
                color={isWishlisted ? '#FF3B30' : '#8E8E93'}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.productInfo}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
            
            <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>
              {product.name}
            </Text>

            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: theme.text }]}>{formatPrice(product.price)}</Text>
              {product.originalPrice && product.originalPrice > product.price && (
                <Text style={[styles.originalPrice, { color: theme.textSecondary }]}>
                  {formatPrice(product.originalPrice)}
                </Text>
              )}
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.addToCartButton,
              { opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => onAddToCart?.(product)}
          >
            <Text style={styles.addToCartText}>{t('common.addToCart')}</Text>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}