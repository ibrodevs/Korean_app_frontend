import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
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
    headerShown: false,
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