import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

// Screens
import FavoritesScreen from '../../screens/FavoritesScreenNew';
import ProductDetailScreen from '../../screens/ProductDetailScreen';

// Types
import { FavoritesStackParamList } from '../../types/navigation';

const Stack = createNativeStackNavigator<FavoritesStackParamList>();

const FavoritesStackNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const screenOptions = {
    headerStyle: {
      backgroundColor: theme.navBackground,
    },
    headerTintColor: theme.heading,
    headerTitleStyle: {
      fontWeight: '600' as '600',
    },
    headerShadowVisible: false,
    contentStyle: {
      backgroundColor: theme.background,
    },
  };

  return (
    <Stack.Navigator
      initialRouteName="FavoritesMain"
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="FavoritesMain"
        component={FavoritesScreen}
        options={{
          title: t('navigation.favorites'),
        }}
      />
      
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({ route }) => ({
          title: route.params?.productName || t('product.details'),
          headerBackTitle: t('common.back'),
        })}
      />
    </Stack.Navigator>
  );
};

export default FavoritesStackNavigator;