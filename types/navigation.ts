import { 
  NativeStackNavigationProp,
  NativeStackScreenProps 
} from '@react-navigation/native-stack';
import { 
  BottomTabNavigationProp,
  BottomTabScreenProps 
} from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { Product } from './product';
import { Order } from './order';

// Main Tab Navigator
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>; // Возвращаем обратно HomeTab
  FavoritesTab: NavigatorScreenParams<FavoritesStackParamList>;
  OrdersTab: NavigatorScreenParams<OrdersStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
  CartTab: NavigatorScreenParams<CartStackParamList>;
};

// Home Stack
export type HomeStackParamList = {
  HomeMain: undefined;
  ProductDetail: { product: Product };
};

// Favorites Stack (instead of Search)
export type FavoritesStackParamList = {
  FavoritesMain: undefined;
  ProductDetail: { productId: string; productName?: string };
};

// Orders Stack
export type OrdersStackParamList = {
  OrdersMain: undefined;
};

// Profile Stack
export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: { 
    profile: any; 
    onSave: (updatedProfile: any) => void;
  };
  Settings: NavigatorScreenParams<SettingsStackParamList>;
  PaymentMethods: undefined;
  Support: undefined;
};

// Settings Stack
export type SettingsStackParamList = {
  SettingsMain: undefined;
};

// Search Stack
export type SearchStackParamList = {
  SearchMain: undefined;
  SearchResults: { query: string };
  AdvancedSearch: { query?: string; category?: string };
};

// Cart Stack
export type CartStackParamList = {
  CartMain: undefined;
  Checkout: NavigatorScreenParams<CheckoutStackParamList>;
};

// Checkout Stack
export type CheckoutStackParamList = {
  CheckoutMain: undefined;
};

// Auth Stack
export type AuthStackParamList = {
  AuthScreen: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyEmail: { email: string };
};

// Root Stack
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  ProductDetail: { product?: Product; productId?: string };
  Checkout: undefined;
  OrderTracking: { orderId: string };
  AdvancedSearch: { query?: string; category?: string };
  Search: undefined;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
  EditProfile: { 
    profile: any; 
    onSave: (updatedProfile: any) => void;
  };
  // Modal screens
  ProductDetailModal: { productId: string; productName?: string };
  QuickView: { productId: string };
  FilterModal: { initialFilters?: any; onApplyFilters?: (filters: any) => void };
  // Error screens
  NoInternet: undefined;
  NoProducts: undefined;
  PaymentError: { errorCode?: string; errorMessage?: string };
  Support: undefined;
  Payment: undefined;
  TestScreen: undefined;
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

export type MainTabScreenProps<Screen extends keyof MainTabParamList> = BottomTabScreenProps<MainTabParamList, Screen>;

export type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;
export type OrdersScreenProps = NativeStackScreenProps<OrdersStackParamList, 'OrdersMain'>;
export type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;
export type ProductDetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'ProductDetail'>;
export type SearchScreenProps = NativeStackScreenProps<SearchStackParamList, 'SearchMain'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 