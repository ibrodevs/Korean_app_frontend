import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp, MainTabNavigationProp } from '../types/navigation';

export const useAppNavigation = () => {
  const navigation = useNavigation<RootNavigationProp>();
  return navigation;
};

export const useTabNavigation = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  return navigation;
};

// Хелперы для быстрой навигации
export const useNavigationHelpers = () => {
  const navigation = useAppNavigation();

  const goToProduct = (productId: string, productName?: string) => {
    navigation.navigate('Main', {
      screen: 'HomeTab',
      params: {
        screen: 'ProductDetail',
        params: { productId, productName },
      },
    });
  };

  const goToCart = () => {
    navigation.navigate('Main', {
      screen: 'CartTab',
      params: { screen: 'CartMain' },
    });
  };

  const goToOrders = () => {
    navigation.navigate('Main', {
      screen: 'OrdersTab',
      params: { screen: 'OrdersMain' },
    });
  };

  const goToProfile = () => {
    navigation.navigate('Main', {
      screen: 'ProfileTab',
      params: { screen: 'ProfileMain' },
    });
  };

  const goToSearch = (query?: string) => {
    navigation.navigate('Main', {
      screen: 'SearchTab',
      params: query 
        ? {
            screen: 'SearchResults',
            params: { query },
          }
        : undefined,
    });
  };

  const openModal = (screen: string, params?: any) => {
    navigation.navigate(screen as any, params);
  };

  return {
    goToProduct,
    goToCart,
    goToOrders,
    goToProfile,
    goToSearch,
    openModal,
    navigation,
  };
};