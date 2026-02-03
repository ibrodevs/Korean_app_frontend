import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';

export const useNetworkStatus = (showErrorScreen = true) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
      
      // Показать экран ошибки при отсутствии интернета
      if (showErrorScreen && !state.isConnected) {
        navigation.navigate('NoInternet' as never);
      }
    });

    // Проверяем текущее состояние при монтировании
    NetInfo.fetch().then((state: NetInfoState) => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
    });

    return () => {
      unsubscribe();
    };
  }, [showErrorScreen, navigation]);

  return {
    isConnected,
    isInternetReachable,
    isOffline: isConnected === false,
    isLoading: isConnected === null,
  };
};