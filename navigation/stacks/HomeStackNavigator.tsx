import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

// Screens
import HomeScreen from '../../screens/HomeScreen';
import ProductDetailScreen from '../../screens/ProductDetailScreenNew';

// Types
import { HomeStackParamList } from '../../types/navigation';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const screenOptions = {
    headerStyle: {
      backgroundColor: theme.navBackground,
    },
    headerTintColor: theme.heading,
    headerTitleStyle: {
      fontWeight: '700' as const,
      fontSize: 18,
    },
    headerBackTitle: t('common.back'),
    headerShadowVisible: false,
    contentStyle: {
      backgroundColor: theme.background,
    },
    animation: 'slide_from_right' as const,
  };

  return (
    <Stack.Navigator initialRouteName="HomeMain" screenOptions={screenOptions}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({ route }) => ({
          title: route.params.product.name || t('product.details'),
          headerBackTitleVisible: true,
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;