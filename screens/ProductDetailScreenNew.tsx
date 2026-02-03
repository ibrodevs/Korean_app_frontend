import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/Text';
import { Product } from '../types/product';
import { useFavorites } from '../contexts/FavoritesContext';

interface ProductDetailScreenProps {
  route: {
    params: {
      product: Product;
    };
  };
  navigation: any;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }: ProductDetailScreenProps) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(2);
  const [selectedTab, setSelectedTab] = useState('Description');
  const { toggleFavorite, isFavorite } = useFavorites();

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

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const isWishlisted = isFavorite(product.id);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>card details</Text>
        <Pressable
          onPress={() => toggleFavorite(product.id)}
          style={styles.wishlistButton}
        >
          <Ionicons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={20}
            color="#FFFFFF"
          />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899', '#F59E0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <Text style={styles.gradientText}>ФОТКА</Text>
          </LinearGradient>
          
          {/* Page Indicators */}
          <View style={styles.pageIndicators}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
        </View>

        {/* Product Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.categoryBadge}>{product.category}</Text>
          
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.priceContainer}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountIcon}>%</Text>
              <Text style={styles.priceText}>{formatPrice(product.price)}</Text>
            </View>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>{formatPrice(product.originalPrice)}</Text>
            )}
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tab, selectedTab === 'Description' && styles.activeTab]}
              onPress={() => setSelectedTab('Description')}
            >
              <Text style={[styles.tabText, selectedTab === 'Description' && styles.activeTabText]}>
                Description
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, selectedTab === 'Reviews' && styles.activeTab]}
              onPress={() => setSelectedTab('Reviews')}
            >
              <Text style={[styles.tabText, selectedTab === 'Reviews' && styles.activeTabText]}>
                Reviews
              </Text>
            </Pressable>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {selectedTab === 'Description' ? (
              <Text style={styles.descriptionText}>
                The carrot is a root vegetable, most commonly observed as orange in color, though purple, black, red, white, and yellow cultivars exist, all of which are domesticated forms of the wild carrot, Daucus carota, native to Europe and Southwestern Asia.
              </Text>
            ) : (
              <View style={styles.reviewsContainer}>
                <Text style={styles.descriptionText}>No reviews yet</Text>
              </View>
            )}
          </View>

          {/* Quantity Selector and Add to Cart */}
          <View style={styles.bottomContainer}>
            <View style={styles.quantityContainer}>
              <Pressable
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(-1)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </Pressable>
              <Text style={styles.quantityText}>{quantity}</Text>
              <Pressable
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </Pressable>
            </View>
            
            <Pressable style={styles.addToCartButton}>
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: 'absolute',
    top: (StatusBar.currentHeight || 0) + 10,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  wishlistButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: screenWidth,
    height: screenHeight * 0.45,
    position: 'relative',
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    textShadow: '0px 3px 6px rgba(0,0,0,0.4)',
    letterSpacing: 1,
  },
  pageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    minHeight: screenHeight * 0.6,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  discountIcon: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  originalPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    marginRight: 32,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  tabContent: {
    marginBottom: 40,
    minHeight: 120,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#48484A',
  },
  reviewsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    gap: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    paddingHorizontal: 16,
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flex: 1,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});