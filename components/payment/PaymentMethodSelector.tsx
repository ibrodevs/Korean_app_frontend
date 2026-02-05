import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PaymentMethod } from '../../types/payment';
import { paymentService } from '../../services/paymentService';
import SkeletonLoader from '../../components/SkeletonLoader';

// Включаем анимации для Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  showDescription?: boolean;
  compact?: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelect,
  showDescription = true,
  compact = false,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  // Анимации для каждого метода
  const scaleAnimations = useRef(paymentMethods.map(() => new Animated.Value(1))).current;
  const opacityAnimations = useRef(paymentMethods.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  useEffect(() => {
    // Обновляем рефы анимаций при изменении списка методов
    scaleAnimations.length = paymentMethods.length;
    opacityAnimations.length = paymentMethods.length;
    for (let i = paymentMethods.length; i < scaleAnimations.length; i++) {
      scaleAnimations[i] = new Animated.Value(1);
      opacityAnimations[i] = new Animated.Value(1);
    }
  }, [paymentMethods.length]);

  const loadPaymentMethods = async () => {
    try {
      const methods = await paymentService.getPaymentMethods();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMethodPress = (method: PaymentMethod, index: number) => {
    // Анимация нажатия
    Animated.sequence([
      Animated.timing(scaleAnimations[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimations[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    onSelect(method);
    setExpandedMethod(expandedMethod === method.id ? null : method.id);
  };

  const getMethodIcon = (type: string) => {
    const icons: Record<string, string> = {
      'card': 'card-outline',
      'credit_card': 'card-outline',
      'paypal': 'logo-paypal',
      'apple': 'logo-apple',
      'apple_pay': 'logo-apple',
      'google': 'logo-google',
      'google_pay': 'logo-google',
      'cod': 'cash-outline',
      'cash': 'cash-outline',
      'bank': 'business-outline',
      'bank_transfer': 'business-outline',
      'wallet': 'wallet-outline',
      'crypto': 'logo-bitcoin',
      'venmo': 'logo-venmo',
    };
    return icons[type] || 'wallet-outline';
  };

  const getMethodName = (method: PaymentMethod) => {
    const methodMap: Record<string, string> = {
      'card': t('payment.creditCard'),
      'credit_card': t('payment.creditCard'),
      'paypal': t('payment.paypal'),
      'apple': t('payment.applePay'),
      'apple_pay': t('payment.applePay'),
      'google': t('payment.googlePay'),
      'google_pay': t('payment.googlePay'),
      'cod': t('payment.cashOnDelivery'),
      'cash': t('payment.cashOnDelivery'),
      'bank': t('payment.bankTransfer'),
      'bank_transfer': t('payment.bankTransfer'),
      'wallet': t('payment.digitalWallet'),
      'crypto': t('payment.cryptocurrency'),
      'venmo': t('payment.venmo'),
    };
    return methodMap[method.type] || method.name;
  };

  const getMethodColors = (method: PaymentMethod, isSelected: boolean) => {
    const colors: Record<string, { primary: string; secondary: string; gradient: string[] }> = {
      'card': { 
        primary: '#4F46E5', 
        secondary: '#818CF8',
        gradient: ['#4F46E5', '#6366F1']
      },
      'paypal': { 
        primary: '#003087', 
        secondary: '#009CDE',
        gradient: ['#003087', '#009CDE']
      },
      'apple': { 
        primary: '#000000', 
        secondary: '#A2AAAD',
        gradient: ['#000000', '#1D1D1F']
      },
      'google': { 
        primary: '#4285F4', 
        secondary: '#34A853',
        gradient: ['#4285F4', '#34A853']
      },
      'cod': { 
        primary: '#059669', 
        secondary: '#10B981',
        gradient: ['#059669', '#10B981']
      },
      'bank': { 
        primary: '#7C3AED', 
        secondary: '#A78BFA',
        gradient: ['#7C3AED', '#8B5CF6']
      },
    };

    const defaultColors = { 
      primary: theme.primary, 
      secondary: theme.secondary,
      gradient: [theme.primary, theme.secondary]
    };
    
    return colors[method.type] || defaultColors;
  };

  const renderMethodCard = (method: PaymentMethod, index: number) => {
    const isSelected = selectedMethod?.id === method.id;
    const isExpanded = expandedMethod === method.id;
    const colors = getMethodColors(method, isSelected);
    
    return (
      <Animated.View
        key={method.id}
        style={[
          styles.methodCard,
          {
            transform: [{ scale: scaleAnimations[index] || 1 }],
            opacity: opacityAnimations[index] || 1,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.methodContainer,
            {
              backgroundColor: isSelected ? colors.primary + '15' : theme.surface,
              borderColor: isSelected ? colors.primary + '40' : 'transparent',
            },
          ]}
          onPress={() => handleMethodPress(method, index)}
          activeOpacity={0.8}
        >
          {/* Декоративный элемент */}
          <View 
            style={[
              styles.methodAccent,
              { backgroundColor: colors.primary + '20' }
            ]} 
          />
          
          <View style={styles.methodContent}>
            <View style={styles.methodHeader}>
              <View style={styles.methodInfo}>
                {/* Иконка метода оплаты */}
                <View 
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: isSelected ? colors.primary : theme.card,
                      shadowColor: colors.primary,
                    },
                  ]}
                >
                  <Ionicons
                    name={getMethodIcon(method.type) as any}
                    size={compact ? 20 : 24}
                    color={isSelected ? '#FFFFFF' : colors.primary}
                  />
                </View>
                
                {/* Текстовая информация */}
                <View style={styles.textContainer}>
                  <View style={styles.methodTitleRow}>
                    <Text 
                      style={[
                        styles.methodName,
                        { 
                          color: isSelected ? colors.primary : theme.text,
                          fontSize: compact ? 14 : 16,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {getMethodName(method)}
                    </Text>
                    
                    {/* Индикатор выбора */}
                    <View style={styles.selectionIndicator}>
                      {isSelected ? (
                        <View 
                          style={[
                            styles.selectedDot,
                            { backgroundColor: colors.primary }
                          ]}
                        >
                          <Ionicons name="checkmark" size={compact ? 10 : 12} color="#FFFFFF" />
                        </View>
                      ) : (
                        <View 
                          style={[
                            styles.unselectedDot,
                            { borderColor: theme.textSecondary }
                          ]} 
                        />
                      )}
                    </View>
                  </View>
                  
                  {/* Описание метода */}
                  {showDescription && method.description && !compact && (
                    <Text 
                      style={[
                        styles.methodDescription, 
                        { color: isSelected ? colors.primary + 'CC' : theme.textSecondary }
                      ]}
                      numberOfLines={1}
                    >
                      {method.description}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* Дополнительная информация (комиссия и т.д.) */}
            {(isSelected || isExpanded) && (
              <Animated.View 
                style={[
                  styles.methodDetails,
                  {
                    opacity: isSelected ? 1 : 0.7,
                  },
                ]}
              >
                {/* Комиссия */}
                {method.fee !== undefined && method.fee > 0 && (
                  <View style={styles.feeContainer}>
                    <View style={styles.feeLabelContainer}>
                      <Ionicons 
                        name="information-circle-outline" 
                        size={14} 
                        color={theme.textSecondary} 
                      />
                      <Text style={[styles.feeLabel, { color: theme.textSecondary }]}>
                        Processing fee:
                      </Text>
                    </View>
                    <View style={styles.feeAmountContainer}>
                      <Text style={[styles.feeAmount, { color: colors.primary }]}>
                        ${method.fee.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Время обработки */}
                {method.processingTime && (
                  <View style={styles.processingTime}>
                    <Ionicons 
                      name="time-outline" 
                      size={12} 
                      color={theme.textSecondary} 
                    />
                    <Text style={[styles.processingText, { color: theme.textSecondary }]}>
                      {method.processingTime}
                    </Text>
                  </View>
                )}

                {/* Безопасность */}
                {method.secure && (
                  <View style={styles.securityBadge}>
                    <Ionicons 
                      name="shield-checkmark-outline" 
                      size={12} 
                      color={colors.primary} 
                    />
                    <Text style={[styles.securityText, { color: colors.primary }]}>
                      Secure payment
                    </Text>
                  </View>
                )}
              </Animated.View>
            )}

            {/* Индикатор выбранного метода (полоска снизу) */}
            {isSelected && (
              <View 
                style={[
                  styles.selectedIndicator,
                  { backgroundColor: colors.primary }
                ]} 
              />
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Загрузка
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {[1, 2, 3].map((i) => (
          <SkeletonLoader
            key={i}
            style={[
              styles.skeletonCard,
              { backgroundColor: theme.surface }
            ]}
          >
            <View style={styles.skeletonContent}>
              <SkeletonLoader 
                width={48} 
                height={48} 
                borderRadius={24} 
                style={{ marginRight: 12 }}
              />
              <View style={styles.skeletonTextContainer}>
                <SkeletonLoader width={120} height={16} borderRadius={4} />
                <SkeletonLoader width={80} height={12} borderRadius={4} style={{ marginTop: 6 }} />
              </View>
            </View>
          </SkeletonLoader>
        ))}
      </View>
    );
  }

  // Пустой список
  if (paymentMethods.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.surface }]}>
        <View style={[styles.emptyIcon, { backgroundColor: theme.card }]}>
          <Ionicons name="card-outline" size={48} color={theme.textSecondary} />
        </View>
        <Text style={[styles.emptyTitle, { color: theme.text }]}>
          No payment methods available
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
          Add a payment method to continue
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {/* Заголовок секции */}
      {!compact && (
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Select Payment Method
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Choose how you want to pay
          </Text>
        </View>
      )}

      {/* Список методов оплаты */}
      <View style={[styles.methodsList, compact && styles.methodsListCompact]}>
        {paymentMethods.map((method, index) => renderMethodCard(method, index))}
      </View>

      {/* Информация о безопасности */}
      {!compact && selectedMethod && (
        <View style={[styles.securityInfo, { backgroundColor: theme.card }]}>
          <Ionicons name="lock-closed" size={16} color={theme.primary} />
          <Text style={[styles.securityInfoText, { color: theme.textSecondary }]}>
            Your payment is secured with 256-bit encryption
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  containerCompact: {
    gap: 4,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
  },
  loadingContainer: {
    gap: 8,
  },
  skeletonCard: {
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
  },
  skeletonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonTextContainer: {
    flex: 1,
  },
  emptyContainer: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  methodsList: {
    gap: 8,
  },
  methodsListCompact: {
    gap: 6,
  },
  methodCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  methodContainer: {
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  methodAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
  },
  methodContent: {
    padding: 16,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  selectionIndicator: {
    marginLeft: 12,
  },
  selectedDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  methodDescription: {
    fontSize: 12,
    fontWeight: '400',
  },
  methodDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    gap: 8,
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feeLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feeLabel: {
    fontSize: 12,
    marginLeft: 4,
  },
  feeAmountContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  feeAmount: {
    fontSize: 12,
    fontWeight: '700',
  },
  processingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  processingText: {
    fontSize: 11,
    fontWeight: '400',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  securityText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 12,
  },
  securityInfoText: {
    fontSize: 12,
    flex: 1,
  },
});

export default PaymentMethodSelector;