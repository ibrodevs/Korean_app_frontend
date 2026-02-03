import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

// Auth Screens
import AuthScreen from "../screens/AuthScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

// Types
import { AuthStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
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
      initialRouteName="AuthScreen"
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: t('auth.login'),
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: t('auth.register'),
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: t('auth.forgotPassword'),
          headerBackTitle: t('common.back'),
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;