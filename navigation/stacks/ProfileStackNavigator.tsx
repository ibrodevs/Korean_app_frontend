import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

// Screens
import ProfileScreen from '../../screens/ProfileScreenNew';
import EditProfileScreen from '../../screens/EditProfileScreen';
import SettingsStackNavigator from './SettingsStackNavigator';
import PaymentStackNavigator from './PaymentStackNavigator';
import SupportScreen from '../../screens/SupportScreen';

// Types
import { ProfileStackParamList } from '../../types/navigation';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator: React.FC = () => {
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
    <Stack.Navigator initialRouteName="ProfileMain" screenOptions={screenOptions}>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{
          title: t('profile.support'),
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;