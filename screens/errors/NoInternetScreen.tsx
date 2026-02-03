import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import ErrorScreen from '../../components/errors/ErrorScreen';
import { useTheme } from '../../contexts/ThemeContext';
import NetInfo from '@react-native-community/netinfo';

const NoInternetScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleRetry = async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      navigation.goBack();
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const errorState = {
    type: 'noInternet' as const,
    title: t('errors.noInternet.title'),
    description: t('errors.noInternet.description'),
    icon: 'wifi-outline',
    showImage: true,
  };

  const customActions = [
    {
      label: t('actions.retry'),
      onPress: handleRetry,
      variant: 'primary' as const,
      icon: 'refresh',
    },
    {
      label: t('settings.title'),
      onPress: handleOpenSettings,
      variant: 'outline' as const,
      icon: 'settings-outline',
    },
    {
      label: t('errors.goBack'),
      onPress: handleGoBack,
      variant: 'secondary' as const,
      icon: 'arrow-back',
    },
  ];

  return (
    <ErrorScreen
      error={errorState}
      onRetry={handleRetry}
      onGoBack={handleGoBack}
      customActions={customActions}
      fullScreen
    />
  );
};

export default NoInternetScreen;