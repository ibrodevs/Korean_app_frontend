import React, { useRef, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  StatusBar 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import Text from '../components/Text';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  gradient: string[];
  features: string[];
  recommended?: boolean;
  disabled?: boolean;
}

const PaymentScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'credit_card',
      title: t('payment.creditCard', 'Credit Card'),
      description: t('payment.creditCardDesc', 'Pay securely with your credit or debit card'),
      icon: 'card-outline',
      iconColor: '#4F46E5',
      gradient: ['#4F46E5', '#7C3AED'],
      features: ['Secure 256-bit encryption', 'Instant processing', 'Visa/Mastercard/Amex'],
      recommended: true,
    },
    {
      id: 'digital_wallet',
      title: t('payment.digitalWallet', 'Digital Wallet'),
      description: t('payment.digitalWalletDesc', 'Pay with your preferred digital wallet'),
      icon: 'wallet-outline',
      iconColor: '#059669',
      gradient: ['#059669', '#10B981'],
      features: ['Apple Pay & Google Pay', 'One-tap payment', 'Biometric authentication'],
    },
    {
      id: 'bank_transfer',
      title: t('payment.bankTransfer', 'Bank Transfer'),
      description: t('payment.bankTransferDesc', 'Transfer directly from your bank account'),
      icon: 'business-outline',
      iconColor: '#2563EB',
      gradient: ['#2563EB', '#3B82F6'],
      features: ['Direct bank transfer', 'No card needed', '1-2 business days'],
    },
    {
      id: 'paypal',
      title: 'PayPal',
      description: 'Pay with your PayPal account or credit card',
      icon: 'logo-paypal',
      iconColor: '#003087',
      gradient: ['#003087', '#009CDE'],
      features: ['Buyer protection', 'Instant checkout', 'Pay in installments'],
    },
    {
      id: 'crypto',
      title: 'Cryptocurrency',
      description: 'Pay with Bitcoin, Ethereum and other cryptocurrencies',
      icon: 'logo-bitcoin',
      iconColor: '#F59E0B',
      gradient: ['#F59E0B', '#FBBF24'],
      features: ['Low fees', 'Global payments', 'Decentralized'],
      disabled: false,
    },
  ];

  const handleMethodPress = (method: PaymentMethod) => {
    if (method.disabled) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMethod(method.id);
    
    // Анимация выбора
    setTimeout(() => {
      switch (method.id) {
        case 'credit_card':
          (navigation as any).navigate('CreditCard');
          break;
        case 'bank_transfer':
          (navigation as any).navigate('BankTransfer');
          break;
        case 'digital_wallet':
          (navigation as any).navigate('DigitalWallet');
          break;
        case 'paypal':
          (navigation as any).navigate('PayPal');
          break;
        case 'crypto':
          (navigation as any).navigate('Crypto');
          break;
      }
    }, 300);
  };

  const renderMethodCard = (method: PaymentMethod, index: number) => {
    const isSelected = selectedMethod === method.id;
    const isDisabled = method.disabled;
    
    return (
      <TouchableOpacity
        key={method.id}
        activeOpacity={isDisabled ? 1 : 0.8}
        onPress={() => handleMethodPress(method)}
        style={styles.methodCardWrapper}
      >
        <Animated.View
          style={[
            styles.methodCard,
            {
              backgroundColor: theme.card,
              borderColor: isSelected ? method.iconColor + '40' : 'transparent',
              transform: [{ scale: isSelected ? 0.98 : 1 }],
            },
            isDisabled && styles.methodCardDisabled,
          ]}
        >
          {/* Декоративный градиентный элемент */}
          <LinearGradient
            colors={method.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.methodGradientAccent}
          />
          
          <View style={styles.methodHeader}>
            <View style={styles.methodIconContainer}>
              <LinearGradient
                colors={method.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.methodIconGradient}
              >
                <Ionicons name={method.icon as any} size={24} color="#FFFFFF" />
              </LinearGradient>
            </View>
            
            <View style={styles.methodTextContainer}>
              <View style={styles.methodTitleRow}>
                <Text style={[styles.methodTitle, { color: theme.text }]}>
                  {method.title}
                </Text>
                
                {method.recommended && (
                  <View style={[styles.recommendedBadge, { backgroundColor: method.iconColor }]}>
                    <Text style={styles.recommendedText}>Recommended</Text>
                  </View>
                )}
                
                {isDisabled && (
                  <View style={[styles.disabledBadge, { backgroundColor: theme.textSecondary }]}>
                    <Text style={styles.disabledText}>Coming Soon</Text>
                  </View>
                )}
              </View>
              
              <Text style={[styles.methodDescription, { color: theme.textSecondary }]}>
                {method.description}
              </Text>
            </View>
            
            {!isDisabled && (
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.textSecondary} 
                style={styles.chevronIcon}
              />
            )}
          </View>
          
          {/* Особенности метода */}
          {!isDisabled && (
            <View style={styles.featuresContainer}>
              {method.features.map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={12} color={method.iconColor} />
                  <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Индикатор выбора */}
          {isSelected && !isDisabled && (
            <Animated.View 
              style={[
                styles.selectedIndicator,
                { backgroundColor: method.iconColor }
              ]} 
            />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      
      {/* Анимированный заголовок */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ scale: headerScale }],
          },
        ]}
      >
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.card }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Payment Methods</Text>
          <Text style={styles.headerSubtitle}>
            Choose your preferred way to pay
          </Text>
        </LinearGradient>
      </Animated.View>
      
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Информация о заказе */}
        <View style={[styles.orderInfo, { backgroundColor: theme.card }]}>
          <View style={styles.orderInfoRow}>
            <Text style={[styles.orderLabel, { color: theme.textSecondary }]}>
              Order Total
            </Text>
            <Text style={[styles.orderAmount, { color: theme.text }]}>
              $189.99
            </Text>
          </View>
          <View style={[styles.orderDivider, { backgroundColor: theme.border }]} />
          <View style={styles.orderInfoRow}>
            <Text style={[styles.orderLabel, { color: theme.textSecondary }]}>
              Items
            </Text>
            <Text style={[styles.orderValue, { color: theme.text }]}>
              3 items
            </Text>
          </View>
        </View>
        
        {/* Список методов оплаты */}
        <View style={styles.methodsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Select Payment Method
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            All methods are secure and encrypted
          </Text>
          
          <View style={styles.methodsList}>
            {paymentMethods.map((method, index) => 
              renderMethodCard(method, index)
            )}
          </View>
        </View>
        
        {/* Информация о безопасности */}
        <View style={[styles.securityInfo, { backgroundColor: theme.card }]}>
          <View style={styles.securityHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            <Text style={[styles.securityTitle, { color: theme.text }]}>
              Secure Payment Guaranteed
            </Text>
          </View>
          <View style={styles.securityFeatures}>
            <View style={styles.securityFeature}>
              <Ionicons name="lock-closed" size={16} color="#10B981" />
              <Text style={[styles.securityText, { color: theme.textSecondary }]}>
                256-bit SSL encryption
              </Text>
            </View>
            <View style={styles.securityFeature}>
              <Ionicons name="card" size={16} color="#10B981" />
              <Text style={[styles.securityText, { color: theme.textSecondary }]}>
                PCI DSS compliant
              </Text>
            </View>
            <View style={styles.securityFeature}>
              <Ionicons name="refresh" size={16} color="#10B981" />
              <Text style={[styles.securityText, { color: theme.textSecondary }]}>
                24/7 fraud monitoring
              </Text>
            </View>
          </View>
        </View>
        
        {/* Информация о возврате */}
        <View style={[styles.refundInfo, { backgroundColor: '#FEF3C7' }]}>
          <Ionicons name="arrow-undo" size={20} color="#D97706" />
          <View style={styles.refundTextContainer}>
            <Text style={styles.refundTitle}>30-Day Refund Policy</Text>
            <Text style={styles.refundDescription}>
              Full refund available within 30 days if not satisfied
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
      
      {/* Кнопка продолжения */}
      {selectedMethod && (
        <Animated.View 
          style={[
            styles.footer,
            { backgroundColor: theme.background + 'EE' },
          ]}
        >
          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: '#4F46E5' }]}
            onPress={() => {
              const method = paymentMethods.find(m => m.id === selectedMethod);
              if (method) handleMethodPress(method);
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueButtonGradient}
            >
              <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
              <Text style={styles.continueButtonText}>
                Continue with {paymentMethods.find(m => m.id === selectedMethod)?.title}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={[styles.footerNote, { color: theme.textSecondary }]}>
            You won't be charged until you confirm the order
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerGradient: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  orderInfo: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderAmount: {
    fontSize: 28,
    fontWeight: '700',
  },
  orderDivider: {
    height: 1,
    marginVertical: 12,
  },
  orderValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  methodsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  methodsList: {
    gap: 12,
  },
  methodCardWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  methodCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  methodCardDisabled: {
    opacity: 0.6,
  },
  methodGradientAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodIconContainer: {
    marginRight: 12,
  },
  methodIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTextContainer: {
    flex: 1,
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  recommendedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  disabledBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  disabledText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  methodDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  featuresContainer: {
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 11,
    fontWeight: '400',
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  securityInfo: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  securityFeatures: {
    gap: 8,
  },
  securityFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    flex: 1,
  },
  refundInfo: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  refundTextContainer: {
    flex: 1,
  },
  refundTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  refundDescription: {
    fontSize: 12,
    color: '#92400E',
    opacity: 0.8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  footerNote: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '400',
  },
});

export default PaymentScreen;