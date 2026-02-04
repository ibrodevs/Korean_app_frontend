import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform } from 'react-native';

// Stack Navigators
import HomeStackNavigator from './stacks/HomeStackNavigator';
import OrdersStackNavigator from './stacks/OrdersStackNavigator';
import ProfileStackNavigator from './stacks/ProfileStackNavigator';
import CartStackNavigator from './stacks/CartStackNavigator';

// Types
import { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { getCartItemsCount } = useCart();

  const getTabBarIcon = (routeName: string, focused: boolean, color: string, size: number) => {
    let iconName: string;
    
    switch (routeName) {
      case 'HomeTab':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'CartTab':
        iconName = focused ? 'bag' : 'bag-outline';
        break;
      case 'OrdersTab':
        iconName = focused ? 'list' : 'list-outline';
        break;
      case 'ProfileTab':
        iconName = focused ? 'person' : 'person-outline';
        break;
      default:
        iconName = 'help-circle-outline';
    }

    return <Ionicons name={iconName as any} size={size} color={color} />;
  };

  const screenOptions = ({ route }: any) => ({
    headerShown: false,
    tabBarIcon: ({ focused, color, size }: any) =>
      getTabBarIcon(route.name, focused, color, size),
    tabBarActiveTintColor: theme.primary,
    tabBarInactiveTintColor: theme.textHint,
    tabBarStyle: {
      backgroundColor: theme.background,
      borderTopColor: theme.border,
      borderTopWidth: 1,
      height: 70,
      paddingTop: 8,
      paddingBottom: Platform.OS === 'ios' ? 25 : 8,
      elevation: 12,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600' as const,
      marginBottom: 2,
      marginTop: -2,
    },
    tabBarItemStyle: {
      paddingVertical: 6,
      minHeight: 50,
    },
    tabBarHideOnKeyboard: true,
  });

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={screenOptions}
      backBehavior="history"
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: t('navigation.home'),
        }}
      />
      
      <Tab.Screen
        name="CartTab"
        component={CartStackNavigator}
        options={{
          title: t('navigation.cart'),
          tabBarBadge: getCartItemsCount() > 0 ? getCartItemsCount() : undefined,
        }}
      />
      
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStackNavigator}
        options={{
          title: t('navigation.orders'),
        }}
      />
      
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: t('navigation.profile'),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;