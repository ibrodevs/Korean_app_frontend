import React from 'react';
import {
  View,
  
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Product } from '../../types/product';

interface ProductHeaderProps {
  product: Product;
  isFavorite: boolean;
  onBackPress: () => void;
  onFavoritePress: () => void;
  onSharePress: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  product,
  isFavorite,
  onBackPress,
  onFavoritePress,
  onSharePress,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const hasDiscount = product.discount && product.discount > 0;
  const finalPrice = hasDiscount
    ? product.price * (1 - product.discount! / 100)
    : product.price;

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {/* Верхняя панель с кнопками */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.card }]}
          onPress={onBackPress}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <View style={styles.rightActions}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.card }]}
            onPress={onSharePress}
          >
            <Ionicons name="share-outline" size={22} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.card }]}
            onPress={onFavoritePress}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? theme.error : theme.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Название и категория */}
      <View style={styles.titleSection}>
        <Text style={[styles.category, { color: theme.textSecondary }]}>
          {product.category}
        </Text>
        <Text style={[styles.title, { color: theme.heading }]}>
          {product.name}
        </Text>
      </View>

      {/* Рейтинг и отзывы */}
      <View style={styles.ratingSection}>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color={theme.primary} />
          <Text style={[styles.rating, { color: theme.text }]}>
            {product.rating.toFixed(1)}
          </Text>
          <Text style={[styles.reviewCount, { color: theme.textSecondary }]}>
            ({product.reviewCount} {t('product.reviews')})
          </Text>
        </View>
        <View style={styles.stockContainer}>
          <View
            style={[
              styles.stockDot,
              {
                backgroundColor: product.stock > 0 ? theme.secondary : theme.error,
              },
            ]}
          />
          <Text
            style={[
              styles.stockText,
              { color: product.stock > 0 ? theme.text : theme.error },
            ]}
          >
            {product.stock > 0
              ? `${t('product.inStock')} • ${product.stock} left`
              : t('product.outOfStock')}
          </Text>
        </View>
      </View>

      {/* Цена */}
      <View style={styles.priceSection}>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: theme.heading }]}>
            {product.currency} {finalPrice.toFixed(2)}
          </Text>
          {hasDiscount && (
            <>
              <Text style={[styles.originalPrice, { color: theme.textSecondary }]}>
                {product.currency} {product.price.toFixed(2)}
              </Text>
              <View style={[styles.discountBadge, { backgroundColor: theme.error }]}>
                <Text style={styles.discountText}>
                  -{product.discount}%
                </Text>
              </View>
            </>
          )}
        </View>

        {product.isBestSeller && (
          <View style={[styles.badge, { backgroundColor: theme.primary }]}>
            <Text style={[styles.badgeText, { color: theme.heading }]}>
              🏆 {t('home.bestSellers')}
            </Text>
          </View>
        )}
        {product.isNew && (
          <View style={[styles.badge, { backgroundColor: theme.secondary }]}>
            <Text style={[styles.badgeText, { color: theme.heading }]}>
              ✨ {t('home.new')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  rightActions: {
    flexDirection: 'row',
  },
  titleSection: {
    marginBottom: 12,
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 6,
  },
  reviewCount: {
    fontSize: 14,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default ProductHeader;