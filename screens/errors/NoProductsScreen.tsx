import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import ErrorScreen from '../../components/errors/ErrorScreen';

interface NoProductsScreenProps {
  searchQuery?: string;
  filters?: any;
  onClearFilters?: () => void;
  onBrowseAll?: () => void;
}

const NoProductsScreen: React.FC<NoProductsScreenProps> = ({
  searchQuery,
  filters,
  onClearFilters,
  onBrowseAll,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    } else {
      // Default behavior
      navigation.goBack();
    }
  };

  const handleBrowseAll = () => {
    if (onBrowseAll) {
      onBrowseAll();
    } else {
      navigation.navigate('Products' as never);
    }
  };

  const title = searchQuery
    ? `${t('errors.noProducts.title')}: "${searchQuery}"`
    : t('errors.noProducts.title');

  const errorState = {
    type: 'noProducts' as const,
    title,
    description: t('errors.noProducts.description'),
    icon: 'cube-outline',
    showImage: true,
  };

  const customActions = [
    {
      label: t('errors.noProducts.clearFilters'),
      onPress: handleClearFilters,
      variant: 'primary' as const,
      icon: 'filter-outline',
    },
    {
      label: t('errors.noProducts.browseAll'),
      onPress: handleBrowseAll,
      variant: 'outline' as const,
      icon: 'grid-outline',
    },
  ];

  return (
    <ErrorScreen
      error={errorState}
      customActions={customActions}
      fullScreen={false}
    />
  );
};

export default NoProductsScreen;