import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ErrorState, ErrorAction } from '../../types/errors';

interface ErrorScreenProps {
  error: ErrorState;
  onRetry?: () => void;
  onGoBack?: () => void;
  customActions?: ErrorAction[];
  showHeader?: boolean;
  fullScreen?: boolean;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  error,
  onRetry,
  onGoBack,
  customActions,
  showHeader = false,
  fullScreen = false,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Получаем переводы для типа ошибки
  const getErrorTranslations = (type: string) => {
    const path = type.split('.'); // например: 'noInternet.title'
    let translation = t(`errors.${type}`);
    
    // Если это сложный путь (noInternet.title)
    if (translation.includes('errors.')) {
      return {
        title: t(`errors.${type}.title`) || t('errors.somethingWentWrong'),
        description: t(`errors.${type}.description`) || t('errors.tryAgain'),
      };
    }
    
    return {
      title: translation,
      description: '',
    };
  };

  const errorTranslations = getErrorTranslations(error.type);
  const title = error.title || errorTranslations.title;
  const description = error.description || errorTranslations.description;

  // Стандартные действия
  const defaultActions: ErrorAction[] = [];
  
  if (onRetry) {
    defaultActions.push({
      label: t('actions.retry'),
      onPress: onRetry,
      variant: 'primary',
      icon: 'refresh',
    });
  }
  
  if (onGoBack) {
    defaultActions.push({
      label: t('errors.goBack'),
      onPress: onGoBack,
      variant: 'secondary',
      icon: 'arrow-back',
    });
  }

  const actions = customActions || defaultActions;
  
  const getVariantStyle = (variant: string = 'primary') => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: theme.primary };
      case 'secondary':
        return { backgroundColor: theme.secondary };
      case 'danger':
        return { backgroundColor: theme.error };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.primary,
        };
      default:
        return { backgroundColor: theme.primary };
    }
  };

  const getVariantTextColor = (variant: string = 'primary') => {
    switch (variant) {
      case 'outline':
        return theme.primary;
      default:
        return theme.heading;
    }
  };

  const getIconForErrorType = () => {
    switch (error.type) {
      case 'noInternet':
        return 'wifi-outline';
      case 'noProducts':
        return 'cube-outline';
      case 'paymentError':
        return 'card-outline';
      case 'emptyCart':
        return 'cart-outline';
      case 'emptyOrders':
        return 'list-outline';
      case 'emptyWishlist':
        return 'heart-outline';
      case 'serverError':
        return 'server-outline';
      case 'notFound':
        return 'compass-outline';
      case 'unauthorized':
        return 'lock-closed-outline';
      default:
        return 'alert-circle-outline';
    }
  };

  const renderErrorDetails = () => {
    switch (error.type) {
      case 'noInternet':
        return (
          <View style={styles.tipsContainer}>
            <Text style={[styles.tipsTitle, { color: theme.heading }]}>
              {t('errors.noInternet.tips')}
            </Text>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Ionicons name="airplane-outline" size={20} color={theme.primary} />
                <Text style={[styles.tipText, { color: theme.text }]}>
                  {t('errors.noInternet.airplaneMode')}
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="wifi-outline" size={20} color={theme.primary} />
                <Text style={[styles.tipText, { color: theme.text }]}>
                  {t('errors.noInternet.wifi')}
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="cellular-outline" size={20} color={theme.primary} />
                <Text style={[styles.tipText, { color: theme.text }]}>
                  {t('errors.noInternet.mobileData')}
                </Text>
              </View>
            </View>
          </View>
        );

      case 'paymentError':
        return (
          <View style={styles.tipsContainer}>
            <Text style={[styles.tipsTitle, { color: theme.heading }]}>
              {t('errors.paymentError.commonReasons')}
            </Text>
            <View style={styles.reasonsList}>
              <View style={styles.reasonItem}>
                <Ionicons name="close-circle" size={16} color={theme.error} />
                <Text style={[styles.reasonText, { color: theme.text }]}>
                  {t('errors.paymentError.insufficientFunds')}
                </Text>
              </View>
              <View style={styles.reasonItem}>
                <Ionicons name="close-circle" size={16} color={theme.error} />
                <Text style={[styles.reasonText, { color: theme.text }]}>
                  {t('errors.paymentError.expiredCard')}
                </Text>
              </View>
              <View style={styles.reasonItem}>
                <Ionicons name="close-circle" size={16} color={theme.error} />
                <Text style={[styles.reasonText, { color: theme.text }]}>
                  {t('errors.paymentError.declined')}
                </Text>
              </View>
            </View>
            <Text style={[styles.advice, { color: theme.textSecondary }]}>
              {t('errors.paymentError.tryDifferentMethod')}
            </Text>
          </View>
        );

      case 'noProducts':
        return (
          <View style={styles.tipsContainer}>
            <Text style={[styles.tipsTitle, { color: theme.heading }]}>
              {t('errors.noProducts.tryDifferentFilters')}
            </Text>
            <Text style={[styles.advice, { color: theme.textSecondary }]}>
              {t('errors.noProducts.checkBack')}
            </Text>
          </View>
        );

      case 'emptySearch':
        return (
          <View style={styles.tipsContainer}>
            <Text style={[styles.tipsTitle, { color: theme.heading }]}>
              {t('errors.emptySearch.searchTips')}
            </Text>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={theme.secondary} />
                <Text style={[styles.tipText, { color: theme.text }]}>
                  {t('errors.emptySearch.checkSpelling')}
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={theme.secondary} />
                <Text style={[styles.tipText, { color: theme.text }]}>
                  {t('errors.emptySearch.broaderTerms')}
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={theme.secondary} />
                <Text style={[styles.tipText, { color: theme.text }]}>
                  {t('errors.emptySearch.fewerFilters')}
                </Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const renderContent = () => (
    <View style={[
      styles.container,
      fullScreen ? styles.fullScreen : {},
      { backgroundColor: theme.background }
    ]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {error.showImage && error.imageSource ? (
          <Image
            source={error.imageSource}
            style={styles.errorImage}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.iconContainer, { backgroundColor: theme.navBackground + '50' }]}>
            <Ionicons
              name={error.icon || getIconForErrorType() as any}
              size={80}
              color={theme.textSecondary}
            />
          </View>
        )}

        <Text style={[styles.title, { color: theme.heading }]}>
          {title}
        </Text>

        {description ? (
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {description}
          </Text>
        ) : null}

        {renderErrorDetails()}

        {error.customContent}

        {actions.length > 0 && (
          <View style={styles.actionsContainer}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.actionButton,
                  getVariantStyle(action.variant),
                ]}
                onPress={action.onPress}
              >
                {action.icon && (
                  <Ionicons
                    name={action.icon as any}
                    size={20}
                    color={getVariantTextColor(action.variant)}
                    style={styles.actionIcon}
                  />
                )}
                <Text style={[
                  styles.actionText,
                  { color: getVariantTextColor(action.variant) },
                ]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );

  if (fullScreen) {
    return renderContent();
  }

  return (
    <View style={styles.wrapper}>
      {showHeader && (
        <View style={[styles.header, { backgroundColor: theme.navBackground }]}>
          <TouchableOpacity onPress={onGoBack}>
            <Ionicons name="arrow-back" size={24} color={theme.heading} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.heading }]}>
            {title}
          </Text>
          <View style={styles.headerPlaceholder} />
        </View>
      )}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    paddingTop: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerPlaceholder: {
    width: 24,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 300,
  },
  tipsContainer: {
    marginTop: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  tipsList: {
    width: '100%',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  tipText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  reasonsList: {
    width: '100%',
    marginBottom: 16,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  reasonText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  advice: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minHeight: 50,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ErrorScreen;