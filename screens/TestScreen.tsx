import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import Button from '../components/Button';
import Text from '../components/Text';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';

// Mock продукт для тестирования
const mockProduct = {
  id: 'test-1',
  name: 'Test Korean Product',
  description: 'Test product for functionality testing',
  price: 25.99,
  currency: 'USD',
  category: 'Test',
  images: ['https://picsum.photos/300/300?random=test'],
  rating: 4.8,
  reviewCount: 120,
  stock: 50,
  isNew: true,
  isFeatured: true,
  isBestSeller: false,
  tags: ['test'],
  seller: { id: '1', name: 'Test Store', rating: 4.9 },
  inStock: true,
};

const TestScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { addToCart, cartItems, getCartItemsCount } = useCart();

  const testAddToCart = () => {
    addToCart(mockProduct, 1);
    Alert.alert('Success', `Added ${mockProduct.name} to cart!`);
  };

  const testNavigation = (screen: string) => {
    try {
      const parentNavigation = navigation.getParent();
      if (parentNavigation) {
        switch (screen) {
          case 'Cart':
            parentNavigation.navigate('Main', { screen: 'CartTab' });
            break;
          case 'Home':
            parentNavigation.navigate('Main', { screen: 'HomeTab' });
            break;
          case 'Profile':
            parentNavigation.navigate('Main', { screen: 'ProfileTab' });
            break;
          case 'Orders':
            parentNavigation.navigate('Main', { screen: 'OrdersTab' });
            break;
          case 'Favorites':
            parentNavigation.navigate('Main', { screen: 'FavoritesTab' });
            break;
          default:
            Alert.alert('Test', `Navigation to ${screen} tested`);
        }
      }
    } catch (error) {
      Alert.alert('Error', `Navigation to ${screen} failed: ${error.message}`);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 30,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 15,
    },
    info: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 10,
      textAlign: 'center',
    },
    button: {
      marginBottom: 10,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Button Functionality Test</Text>
      
      <Text style={styles.info}>
        Cart Items: {getCartItemsCount()} | 
        Product in Favorites: {isFavorite(mockProduct.id) ? 'Yes' : 'No'}
      </Text>

      {/* Cart Functions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cart Functions</Text>
        <Button
          title="Add Test Product to Cart"
          onPress={testAddToCart}
          style={styles.button}
        />
        <Button
          title="Go to Cart"
          onPress={() => testNavigation('Cart')}
          variant="outline"
          style={styles.button}
        />
      </View>

      {/* Navigation Functions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigation Functions</Text>
        <Button
          title="Go to Home"
          onPress={() => testNavigation('Home')}
          variant="outline"
          style={styles.button}
        />
        <Button
          title="Go to Profile"
          onPress={() => testNavigation('Profile')}
          variant="outline"
          style={styles.button}
        />
        <Button
          title="Go to Orders"
          onPress={() => testNavigation('Orders')}
          variant="outline"
          style={styles.button}
        />
      </View>

      {/* Alert Functions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Functions</Text>
        <Button
          title="Test Success Alert"
          onPress={() => Alert.alert('Success', 'All buttons are working correctly!')}
          variant="outline"
          style={styles.button}
        />
        <Button
          title="Test Confirmation Alert"
          onPress={() => 
            Alert.alert(
              'Confirmation', 
              'Do you want to test this?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: () => Alert.alert('Result', 'Confirmed!') }
              ]
            )
          }
          variant="outline"
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

export default TestScreen;