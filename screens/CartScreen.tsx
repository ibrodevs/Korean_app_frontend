import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Text from '../components/Text';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CartScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { currency, getCurrencySymbol } = useCurrency();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const handleIncrement = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  const handleDecrement = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  const handleRemove = (id: string) => {
    Alert.alert(
      t('cart.removeItem'),
      t('cart.removeItemConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: () => {
            removeFromCart(id);
          },
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      const parentNavigation = navigation.getParent();
      if (parentNavigation) {
        parentNavigation.navigate('Checkout');
      }
    }
  };

  const getTotalPrice = () => {
    return getCartTotal();
  };

  const renderCartItem = (item: CartItem) => (
    <View key={item.id} style={[styles.cartItem, { 
      backgroundColor: isDark ? 'rgba(45, 55, 72, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      borderColor: isDark ? 'rgba(74, 85, 104, 0.3)' : 'rgba(226, 232, 240, 0.3)',
    }]}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.itemPrice, { color: theme.primary }]}>
          {getCurrencySymbol()}{item.price}
        </Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={[styles.quantityButton, { backgroundColor: theme.primary }]}
          onPress={() => handleDecrement(item.id)}
        >
          <Ionicons name="remove" size={16} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[styles.quantity, { color: theme.text }]}>{item.quantity}</Text>
        <TouchableOpacity
          style={[styles.quantityButton, { backgroundColor: theme.primary }]}
          onPress={() => handleIncrement(item.id)}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemove(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#F76C6C" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerTitle}>{t('cart.title')}</Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyCartText, { color: theme.textSecondary }]}>
            {t('cart.empty')}
          </Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.cartList}>
            {cartItems.map(renderCartItem)}
          </ScrollView>

          <View style={[styles.footer, { 
            backgroundColor: isDark ? 'rgba(45, 55, 72, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderTopColor: isDark ? 'rgba(74, 85, 104, 0.3)' : 'rgba(226, 232, 240, 0.3)',
          }]}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.text }]}>{t('cart.total')}</Text>
              <Text style={[styles.totalPrice, { color: theme.primary }]}>
                {getCurrencySymbol()}{getTotalPrice()}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.checkoutButton, { backgroundColor: theme.primary }]}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>{t('cart.checkout')}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  cartList: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    marginTop: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;