import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import ErrorScreen from '../../components/errors/ErrorScreen';

interface PaymentErrorScreenProps {
  errorCode?: string;
  errorMessage?: string;
  onRetryPayment?: () => void;
  onUseDifferentMethod?: () => void;
}

const PaymentErrorScreen: React.FC<PaymentErrorScreenProps> = ({
  errorCode,
  errorMessage,
  onRetryPayment,
  onUseDifferentMethod,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();

  const handleRetry = () => {
    if (onRetryPayment) {
      onRetryPayment();
    } else {
      // Default: go back to payment screen
      navigation.goBack();
    }
  };

  const handleDifferentMethod = () => {
    if (onUseDifferentMethod) {
      onUseDifferentMethod();
    } else {
      // Default: go back to payment method selection
      navigation.navigate('Payment' as never);
    }
  };

  const handleContactSupport = () => {
    navigation.navigate('Support' as never);
  };

  const description = errorMessage || t('errors.paymentError.description');

  const errorState = {
    type: 'paymentError' as const,
    title: t('errors.paymentError.title'),
    description,
    icon: 'card-outline',
    showImage: true,
  };

  const customActions = [
    {
      label: t('errors.paymentError.retryPayment'),
      onPress: handleRetry,
      variant: 'primary' as const,
      icon: 'refresh',
    },
    {
      label: t('errors.paymentError.tryDifferentMethod'),
      onPress: handleDifferentMethod,
      variant: 'outline' as const,
      icon: 'card-outline',
    },
    {
      label: t('errors.contactSupport'),
      onPress: handleContactSupport,
      variant: 'secondary' as const,
      icon: 'headset-outline',
    },
  ];

  return (
    <ErrorScreen
      error={errorState}
      customActions={customActions}
      fullScreen={false}
      showHeader
    />
  );
};

export default PaymentErrorScreen;