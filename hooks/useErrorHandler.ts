import { useState, useCallback } from 'react';
import { ErrorState, ErrorType } from '../types/errors';
import { useTranslation } from 'react-i18next';

export const useErrorHandler = () => {
  const { t } = useTranslation();
  const [error, setError] = useState<ErrorState | null>(null);

  const handleError = useCallback((type: ErrorType, options?: {
    title?: string;
    description?: string;
    retryFunction?: () => void;
    customActions?: any[];
  }) => {
    const errorState: ErrorState = {
      type,
      title: options?.title,
      description: options?.description,
      retryFunction: options?.retryFunction,
    };

    setError(errorState);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createErrorState = useCallback((type: ErrorType, customOptions?: any): ErrorState => {
    const baseState: ErrorState = { type };
    
    switch (type) {
      case 'noInternet':
        return {
          ...baseState,
          title: customOptions?.title || t('errors.noInternet.title'),
          description: customOptions?.description || t('errors.noInternet.description'),
          icon: 'wifi-outline',
          showImage: true,
        };
        
      case 'noProducts':
        return {
          ...baseState,
          title: customOptions?.title || t('errors.noProducts.title'),
          description: customOptions?.description || t('errors.noProducts.description'),
          icon: 'cube-outline',
          showImage: true,
        };
        
      case 'paymentError':
        return {
          ...baseState,
          title: customOptions?.title || t('errors.paymentError.title'),
          description: customOptions?.description || t('errors.paymentError.description'),
          icon: 'card-outline',
          showImage: true,
        };
        
      case 'emptyCart':
        return {
          ...baseState,
          title: customOptions?.title || t('errors.emptyCart.title'),
          description: customOptions?.description || t('errors.emptyCart.description'),
          icon: 'cart-outline',
          showImage: true,
        };
        
      case 'emptyOrders':
        return {
          ...baseState,
          title: customOptions?.title || t('errors.emptyOrders.title'),
          description: customOptions?.description || t('errors.emptyOrders.description'),
          icon: 'list-outline',
          showImage: true,
        };
        
      case 'serverError':
        return {
          ...baseState,
          title: customOptions?.title || t('errors.serverError.title'),
          description: customOptions?.description || t('errors.serverError.description'),
          icon: 'server-outline',
          showImage: true,
        };
        
      default:
        return {
          ...baseState,
          title: customOptions?.title || t('errors.somethingWentWrong'),
          description: customOptions?.description || t('errors.tryAgain'),
          icon: 'alert-circle-outline',
          showImage: true,
        };
    }
  }, [t]);

  return {
    error,
    handleError,
    clearError,
    createErrorState,
    hasError: !!error,
  };
};