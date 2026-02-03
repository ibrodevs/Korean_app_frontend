import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

// Screens
import OrdersScreen from '../../screens/OrdersScreen';

// Types
import { OrdersStackParamList } from '../../types/navigation';

const Stack = createNativeStackNavigator<OrdersStackParamList>();

const OrdersStackNavigator: React.FC = () => {
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
    <Stack.Navigator initialRouteName="OrdersMain" screenOptions={screenOptions}>
      <Stack.Screen
        name="OrdersMain"
        component={OrdersScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default OrdersStackNavigator;