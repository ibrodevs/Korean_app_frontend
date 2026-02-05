import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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
const cardWidth = (screenWidth - 64) / 2;

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
    // Основной контейнер с эффектом стекла
    container: {
      width: cardWidth,
      height: 300,
      marginHorizontal: 8,
      marginBottom: 16,
      overflow: 'hidden',
    },
    // Внешняя обертка для стеклянного эффекта
    glassWrapper: {
      flex: 1,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 10,
      overflow: 'hidden',
    },
    // Внутренний размытый фон
    blurContainer: {
      flex: 1,
      overflow: 'hidden',
      borderRadius: 20,
    },
    // Контент поверх размытого фона
    contentOverlay: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      padding: 12,
    },
    imageContainer: {
      position: 'relative',
      borderRadius: 16,
      overflow: 'hidden',
      height: 120,
      marginBottom: 12,
    },
    gradientBackground: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
    },
    gradientText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '800',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
      letterSpacing: 0.5,
    },
    wishlistButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 5,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    discountBadge: {
      position: 'absolute',
      top: 12,
      left: 12,
      backgroundColor: 'rgba(255, 59, 48, 0.95)',
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
      shadowColor: '#FF3B30',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    discountText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    productInfo: {
      flex: 1,
      marginBottom: 8,
    },
    categoryBadge: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(0, 122, 255, 0.15)',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: 'rgba(0, 122, 255, 0.2)',
    },
    categoryText: {
      fontSize: 10,
      color: '#007AFF',
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    productName: {
      fontSize: 14,
      fontWeight: '700',
      color: '#1C1C1E',
      marginBottom: 8,
      lineHeight: 18,
      minHeight: 36,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    price: {
      fontSize: 16,
      fontWeight: '800',
      color: '#FF3B30',
      textShadowColor: 'rgba(255, 59, 48, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    originalPrice: {
      fontSize: 12,
      fontWeight: '500',
      color: '#8E8E93',
      textDecorationLine: 'line-through',
      marginLeft: 6,
    },
    addToCartButton: {
      backgroundColor: 'rgba(0, 122, 255, 0.95)',
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#007AFF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.5)',
      overflow: 'hidden',
    },
    addToCartText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    // Эффект свечения при нажатии
    buttonGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 12,
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
        style={styles.container}
        onPress={() => onPress(product)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.glassWrapper}>
          {/* Убрал BlurView из-за возможных проблем с производительностью */}
          {/* Можно раскомментировать если нужно настоящее размытие */}
          {/* <BlurView intensity={20} tint="light" style={styles.blurContainer}> */}
            <View style={styles.contentOverlay}>
              <View style={styles.imageContainer}>
                <LinearGradient
                  colors={['#667EEA', '#764BA2', '#F093FB']}
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
                    style={({ pressed }) => [
                      styles.wishlistButton,
                      { transform: [{ scale: pressed ? 0.95 : 1 }] }
                    ]}
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
                  { opacity: pressed ? 0.9 : 1 }
                ]}
                onPress={() => onAddToCart?.(product)}
              >
                <View style={styles.buttonGlow} />
                <Text style={styles.addToCartText}>{t('common.addToCart')}</Text>
              </Pressable>
            </View>
          {/* </BlurView> */}
        </View>
      </Pressable>
    </Animated.View>
  );
}