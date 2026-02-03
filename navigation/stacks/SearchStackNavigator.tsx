import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

// Screens
import SearchScreen from '../../screens/SearchScreen';
import AdvancedSearchScreen from '../../screens/AdvancedSearchScreen';
import ProductDetailScreen from '../../screens/ProductDetailScreen';

// Types
import { SearchStackParamList } from '../../types/navigation';

const Stack = createNativeStackNavigator<SearchStackParamList>();

const SearchStackNavigator: React.FC = () => {
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
    <Stack.Navigator initialRouteName="SearchMain" screenOptions={screenOptions}>
      <Stack.Screen
        name="SearchMain"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="AdvancedSearch"
        component={AdvancedSearchScreen}
        options={{
          title: t('search.advanced'),
          presentation: 'modal' as const,
        }}
      />
      
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({ route }) => ({
          title: t('product.details'),
          headerBackTitleVisible: true,
        })}
      />
    </Stack.Navigator>
  );
};

export default SearchStackNavigator;