import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import SplashScreen from '../screens/SplashScreen';

// Navigators
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

// Modal/Detail Screens
import AdvancedSearchScreen from '../screens/AdvancedSearchScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Error Screens
import NoInternetScreen from '../screens/errors/NoInternetScreen';
import NoProductsScreen from '../screens/errors/NoProductsScreen';
import PaymentErrorScreen from '../screens/errors/PaymentErrorScreen';

// Other Screens
import EditProfileScreen from '../screens/EditProfileScreen';
import PaymentScreen from '../screens/PaymentScreen';
import SupportScreen from '../screens/SupportScreen';
import TestScreen from '../screens/TestScreen';

// Types
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('=== Initializing App ===');
      
      // Check first launch
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      const isFirstLaunch = hasLaunched === null;
      setIsFirstLaunch(isFirstLaunch);
      
      console.log('Has launched before:', !isFirstLaunch);
      
      // Если это первый запуск, очистим все данные
      if (isFirstLaunch) {
        console.log('First launch detected, clearing storage...');
        await AsyncStorage.clear();
      }
      
      // Check authentication status - более строгая проверка
      const token = await AsyncStorage.getItem('authToken');
      const isValidToken = token && token.trim() !== '' && token !== 'null' && token !== 'undefined';
      
      console.log('Token from storage:', token);
      console.log('Is valid token:', isValidToken);
      
      setIsAuthenticated(isValidToken);
      
      // Добавим небольшую задержку для лучшего UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('=== App initialization complete ===');
      console.log('isAuthenticated:', isValidToken);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing app:', error);
      // В случае ошибки считаем пользователя не аутентифицированным
      setIsAuthenticated(false);
      setIsFirstLaunch(false);
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('hasLaunched', 'true');
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.background,
          },
          animation: 'slide_from_right',
        }}
      >
        {/* Splash Screen */}
        <Stack.Screen 
          name="Splash" 
          options={{ headerShown: false }}
        >
          {(props) => (
            <SplashScreen
              {...props}
              onFinish={() => {
                console.log('Splash finishing, isAuthenticated:', isAuthenticated);
                // Убедимся что инициализация завершена
                if (isLoading) {
                  console.log('Still loading, waiting...');
                  return;
                }
                
                if (isAuthenticated) {
                  console.log('Navigating to Main');
                  props.navigation.replace('Main');
                } else {
                  console.log('Navigating to Auth');
                  props.navigation.replace('Auth');
                }
              }}
            />
          )}
        </Stack.Screen>

        {/* Onboarding */}
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />

        {/* Auth Navigator */}
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />

        {/* Main Tab Navigator */}
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />

        {/* Detail Screens */}
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="OrderTracking"
          component={OrderTrackingScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AdvancedSearch"
          component={AdvancedSearchScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />

        {/* Error Screens */}
        <Stack.Group
          screenOptions={{
            presentation: 'modal',
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="NoInternet"
            component={NoInternetScreen}
          />

          <Stack.Screen
            name="NoProducts"
            component={NoProductsScreen}
          />

          <Stack.Screen
            name="PaymentError"
            component={PaymentErrorScreen}
          />
        </Stack.Group>

        {/* Other Screens */}
        <Stack.Group
          screenOptions={{
            presentation: 'card',
          }}
        >
          <Stack.Screen
            name="Support"
            component={SupportScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="TestScreen"
            component={TestScreen}
            options={{ headerShown: false }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;