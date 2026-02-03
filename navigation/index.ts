export { default as RootNavigator } from './RootNavigator';
export { default as MainTabNavigator } from './MainTabNavigator';
export { default as AuthNavigator } from './AuthNavigator';

// Stack Navigators
export { default as HomeStackNavigator } from './stacks/HomeStackNavigator';
export { default as SearchStackNavigator } from './stacks/SearchStackNavigator';
export { default as OrdersStackNavigator } from './stacks/OrdersStackNavigator';
export { default as ProfileStackNavigator } from './stacks/ProfileStackNavigator';
export { default as CartStackNavigator } from './stacks/CartStackNavigator';
export { default as CheckoutStackNavigator } from './stacks/CheckoutStackNavigator';

// Re-export types
export type {
  RootStackParamList,
  MainTabParamList,
  HomeStackParamList,
  SearchStackParamList,
  OrdersStackParamList,
  ProfileStackParamList,
  AuthStackParamList,
  RootNavigationProp,
  MainTabNavigationProp,
  HomeScreenProps,
  SearchScreenProps,
  OrdersScreenProps,
  ProfileScreenProps,
  ProductDetailScreenProps,
} from '../types/navigation';