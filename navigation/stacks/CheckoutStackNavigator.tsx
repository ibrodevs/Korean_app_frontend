import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

// Screens
import CheckoutScreen from '../../screens/CheckoutScreen';

// Types
import { CheckoutStackParamList } from '../../types/navigation';

const Stack = createNativeStackNavigator<CheckoutStackParamList>();

const CheckoutStackNavigator: React.FC = () => {
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
    <Stack.Navigator initialRouteName="CheckoutMain" screenOptions={screenOptions}>
      <Stack.Screen
        name="CheckoutMain"
        component={CheckoutScreen}
        options={{
          title: t('checkout.title'),
        }}
      />
      
    </Stack.Navigator>
  );
};

export default CheckoutStackNavigator;