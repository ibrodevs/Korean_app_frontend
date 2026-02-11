import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Text from '../components/Text';
import { CartItem, useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTheme } from '../contexts/ThemeContext';
import { CartStackParamList } from '../types/navigation';

const { width, height } = Dimensions.get('window');
const PRIMARY_COLOR = '#1774F3';

const CartScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { currency, getCurrencySymbol } = useCurrency();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<CartStackParamList>>();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  // Анимации
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const totalScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleIncrement = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
      animateTotal();
      
      // Вибрация для подтверждения действия
      if (Platform.OS !== 'web') {
        // Импортировать Haptics при необходимости
      }
    }
  };

  const handleDecrement = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
      animateTotal();
      
      // Вибрация для подтверждения действия
      if (Platform.OS !== 'web') {
        // Импортировать Haptics при необходимости
      }
    }
  };

  const handleRemove = (id: string, itemName?: string) => {
    Alert.alert(
      'Удаление товара',
      `Вы уверены, что хотите удалить ${itemName || 'товар'} из корзины?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => {
            removeFromCart(id);
            // Показать уведомление об успешном удалении
            Alert.alert('Товар удален', 'Товар успешно удален из корзины');
          }
        }
      ]
    );
  };

  const animateTotal = () => {
    Animated.sequence([
      Animated.timing(totalScaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(totalScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigation.navigate('Checkout', {
        screen: 'CheckoutMain'
      });
    }
  };

  const handleContinueShopping = () => {
    // Переход к главному экрану через родительскую навигацию
    const parentNav = navigation.getParent();
    if (parentNav) {
      parentNav.navigate('HomeTab', { screen: 'HomeMain' });
    } else {
      // Альтернативный способ навигации
      navigation.navigate('Checkout' as any, { replace: true });
      navigation.goBack();
    }
  };

  const getTotalPrice = () => {
    return getCartTotal();
  };

  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('ru-RU')} ₽`;
  };

  const renderCartItem = (item: CartItem) => (
    <Animated.View
      key={item.id}
      style={[
        styles.cartItem,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }]
        }
      ]}
    >
      <View style={styles.cartItemCard}>
        {/* Изображение товара */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.itemImage} 
          />
          {item.product?.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{item.product.discount}%</Text>
            </View>
          )}
        </View>

        {/* Информация о товаре */}
        <View style={styles.itemInfo}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemCategory} numberOfLines={1}>
              {item.product?.category || 'Товар'}
            </Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemove(item.id, item.name)}
              hitSlop={8}
            >
              <Ionicons name="close-outline" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.itemDetails}>
            <View style={styles.priceContainer}>
              <Text style={styles.itemPrice}>
                {formatPrice(item.price)}
              </Text>
              {item.product?.originalPrice && (
                <Text style={styles.itemOriginalPrice}>
                  {formatPrice(item.product.originalPrice)}
                </Text>
              )}
            </View>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  item.quantity === 1 && styles.quantityButtonDisabled
                ]}
                onPress={() => handleDecrement(item.id)}
                disabled={item.quantity === 1}
              >
                <Ionicons 
                  name="remove" 
                  size={16} 
                  color={item.quantity === 1 ? '#CBD5E1' : PRIMARY_COLOR} 
                />
              </TouchableOpacity>
              
              <Text style={styles.quantity}>
                {item.quantity}
              </Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleIncrement(item.id)}
              >
                <Ionicons name="add" size={16} color={PRIMARY_COLOR} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header с градиентом */}
      <LinearGradient
        colors={[PRIMARY_COLOR, '#0E4A7A']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Корзина</Text>
          <View style={{ width: 40 }} />
        </View>
        
        {cartItems.length > 0 && (
          <View style={styles.headerStats}>
            <BlurView intensity={20} tint="light" style={styles.headerStatsBlur}>
              <Ionicons name="cart" size={16} color="#FFFFFF" />
              <Text style={styles.headerStatsText}>
                {totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}
              </Text>
            </BlurView>
          </View>
        )}
      </LinearGradient>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <View style={styles.emptyCartIconContainer}>
            <LinearGradient
              colors={['rgba(23, 116, 243, 0.1)', 'rgba(23, 116, 243, 0.05)']}
              style={styles.emptyCartIcon}
            >
              <Ionicons name="cart-outline" size={48} color={PRIMARY_COLOR} />
            </LinearGradient>
          </View>
          <Text style={styles.emptyCartTitle}>Корзина пуста</Text>
          <Text style={styles.emptyCartText}>
            Добавьте товары из каталога,{'\n'}чтобы оформить заказ
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinueShopping}
          >
            <LinearGradient
              colors={[PRIMARY_COLOR, '#0E4A7A']}
              style={styles.continueButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.continueButtonText}>Перейти к покупкам</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView 
            style={styles.cartList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cartListContent}
          >
            {cartItems.map(renderCartItem)}

            {/* Блок рекомендаций */}
            <View style={styles.recommendationSection}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationTitle}>С этим также покупают</Text>
                <TouchableOpacity onPress={() => {
                  const parentNav = navigation.getParent();
                  if (parentNav) {
                    parentNav.navigate('HomeTab', { screen: 'HomeMain' });
                  }
                }}>
                  <Text style={styles.recommendationLink}>Все</Text>
                </TouchableOpacity>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendationList}
              >
                {[1, 2, 3].map((_, index) => {
                  const mockProduct = {
                    id: `rec_${index}`,
                    name: `Товар ${index + 1}`,
                    price: 2490 + (index * 500),
                    image: `https://images.unsplash.com/photo-${1560472354 + index}?w=400`
                  };
                  
                  return (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.recommendationItem}
                      onPress={() => {
                        // Переход к детальной странице товара
                        const parentNav = navigation.getParent();
                        if (parentNav) {
                          parentNav.navigate('ProductDetail', {
                            product: {
                              id: mockProduct.id,
                              name: mockProduct.name,
                              price: mockProduct.price,
                              images: [mockProduct.image],
                              description: `Описание товара ${index + 1}`,
                              category: 'recommended',
                              rating: 4.5,
                              reviewCount: 10 + index,
                              stock: 20,
                              currency: '₽'
                            }
                          });
                        }
                      }}
                    >
                      <View style={styles.recommendationImage} />
                      <Text style={styles.recommendationItemPrice}>{mockProduct.price.toLocaleString('ru-RU')} ₽</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </ScrollView>

          {/* Нижняя панель с итогом */}
          <BlurView 
            intensity={80} 
            tint={isDark ? 'dark' : 'light'} 
            style={styles.footer}
          >
            <View style={styles.footerContent}>
              <View style={styles.totalDetails}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Товары ({totalItems})</Text>
                  <Text style={styles.totalValue}>
                    {formatPrice(getTotalPrice())}
                  </Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Доставка</Text>
                  <Text style={styles.totalValueFree}>Бесплатно</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabelBold}>Итого</Text>
                  <Animated.Text 
                    style={[
                      styles.totalPrice,
                      { transform: [{ scale: totalScaleAnim }] }
                    ]}
                  >
                    {formatPrice(getTotalPrice())}
                  </Animated.Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={[PRIMARY_COLOR, '#0E4A7A']}
                  style={styles.checkoutButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.checkoutButtonText}>Оформить заказ</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.paymentMethods}>
                <Text style={styles.paymentMethodsText}>Принимаем к оплате</Text>
                <View style={styles.paymentIcons}>
                  <View style={styles.paymentIcon}>
                    <Ionicons name="card-outline" size={20} color="#64748B" />
                  </View>
                  <View style={styles.paymentIcon}>
                    <Ionicons name="logo-apple" size={20} color="#64748B" />
                  </View>
                  <View style={styles.paymentIcon}>
                    <Ionicons name="logo-google" size={20} color="#64748B" />
                  </View>
                </View>
              </View>
            </View>
          </BlurView>
        </>
      )}

      {/* Декоративные элементы */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : Platform.OS === 'web' ? 20 : (Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0) + 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerStats: {
    marginTop: 12,
    paddingHorizontal: 20,
  },
  headerStatsBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  headerStatsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cartList: {
    flex: 1,
  },
  cartListContent: {
    padding: 16,
    paddingBottom: 300,
  },
  cartItem: {
    marginBottom: 12,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  discountBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    flex: 1,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    lineHeight: 20,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: PRIMARY_COLOR,
    marginBottom: 2,
  },
  itemOriginalPrice: {
    fontSize: 11,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 2,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantity: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  recommendationSection: {
    marginTop: 24,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  recommendationLink: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  recommendationList: {
    paddingRight: 16,
    gap: 12,
  },
  recommendationItem: {
    width: 100,
    marginRight: 12,
  },
  recommendationImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginBottom: 8,
  },
  recommendationItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyCartIconContainer: {
    marginBottom: 24,
  },
  emptyCartIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  continueButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.5)',
  },
  footerContent: {
    padding: 20,
  },
  totalDetails: {
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  totalLabelBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  totalValueFree: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: PRIMARY_COLOR,
  },
  checkoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  checkoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  paymentMethods: {
    alignItems: 'center',
  },
  paymentMethodsText: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 12,
  },
  paymentIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativeCircle1: {
    position: 'absolute',
    bottom: 100,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(23, 116, 243, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(23, 116, 243, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    top: 200,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(23, 116, 243, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(23, 116, 243, 0.1)',
  },
});

export default CartScreen;