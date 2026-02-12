import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

// Stack Navigators
import CartStackNavigator from './stacks/CartStackNavigator';
import HomeStackNavigator from './stacks/HomeStackNavigator';
import OrdersStackNavigator from './stacks/OrdersStackNavigator';
import ProfileStackNavigator from './stacks/ProfileStackNavigator';

// Types
import { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabBarIconProps {
  routeName: string;
  focused: boolean;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ 
  routeName, 
  focused, 
  color, 
  size
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  const getIconName = () => {
    switch (routeName) {
      case 'HomeTab':
        return focused ? 'home' : 'home-outline';
      case 'CartTab':
        return focused ? 'bag' : 'bag-outline';
      case 'OrdersTab':
        return focused ? 'list' : 'list-outline';
      case 'ProfileTab':
        return focused ? 'person' : 'person-outline';
      default:
        return 'help-circle-outline';
    }
  };

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          tension: 200,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(rotateAnim, {
          toValue: 1,
          tension: 200,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  }, [focused]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }, { rotate }] }}>
        <Ionicons 
          name={getIconName() as any} 
          size={focused ? size + 2 : size} 
          color={color}
        />
      </Animated.View>

      
      {/* Активный индикатор */}
      {focused && (
        <View style={[
          styles.activeIndicator,
          { backgroundColor: color }
        ]} />
      )}
    </View>
  );
};

interface TabBarButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  accessibilityState: { selected: boolean };
}

const TabBarButton: React.FC<TabBarButtonProps> = ({ 
  children, 
  onPress, 
  accessibilityState 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      tension: 200,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 200,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabBarButton}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const MainTabNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();

  const screenOptions = ({ route }: any) => ({
    headerShown: false,
    tabBarIcon: ({ focused, color, size }: any) => {
      return (
        <TabBarIcon
          routeName={route.name}
          focused={focused}
          color={color}
          size={size}
        />
      );
    },
    tabBarActiveTintColor: theme.primary,
    tabBarInactiveTintColor: theme.textHint,
    tabBarBackground: () => {
      if (Platform.OS === 'ios') {
        return (
          <BlurView
            intensity={90}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        );
      }
      
      return (
        <LinearGradient
          colors={[
            theme.background + 'FF',
            theme.background + 'F0',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      );
    },
    tabBarStyle: {
      backgroundColor: Platform.OS === 'ios' ? 'transparent' : theme.background,
      borderTopColor: theme.border,
      borderTopWidth: Platform.OS === 'ios' ? 0.5 : 1,
      height: Platform.OS === 'ios' ? 85 : 70,
      paddingTop: 8,
      paddingBottom: Platform.OS === 'ios' ? 30 : 8,
      elevation: 12,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 16,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600' as const,
      marginBottom: 4,
      marginTop: -2,
      letterSpacing: 0.2,
    },
    tabBarItemStyle: {
      paddingVertical: 6,
      minHeight: 50,
    },
    tabBarHideOnKeyboard: true,
    tabBarButton: (props: any) => <TabBarButton {...props} />,
  });

  // Анимированный компонент для градиента при нажатии
  const TabBarBackground = () => {
    if (Platform.OS === 'ios') {
      return (
        <BlurView
          intensity={90}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      );
    }

    return (
      <LinearGradient
        colors={[
          theme.background + 'FF',
          theme.background + 'F0',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    );
  };

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={screenOptions}
      backBehavior="history"
      sceneContainerStyle={{
        backgroundColor: theme.background,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: t('navigation.home'),
          tabBarAccessibilityLabel: t('navigation.home'),
        }}
      />
      
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStackNavigator}
        options={{
          title: t('navigation.orders'),
          tabBarAccessibilityLabel: t('navigation.orders'),
        }}
      />
      
      <Tab.Screen
        name="CartTab"
        component={CartStackNavigator}
        options={{
          title: t('navigation.cart'),
          tabBarAccessibilityLabel: t('navigation.cart'),
          tabBarBadgeStyle: {
            backgroundColor: '#FF3B30',
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: 'bold',
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            marginLeft: 10,
            marginBottom: Platform.OS === 'ios' ? 30 : 15,
          },
        }}
      />
      
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: t('navigation.profile'),
          tabBarAccessibilityLabel: t('navigation.profile'),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 4,
    marginRight: -4,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  tabBarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MainTabNavigator;