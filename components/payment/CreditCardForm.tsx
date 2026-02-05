import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Keyboard,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

// Компоненты
import InputField from '../auth/InputField';
import Checkbox from '../auth/Checkbox';

// Типы и утилиты
import { PaymentCard } from '../../types/payment';
import { validateCardNumber, validateExpiry, validateCVV } from '../../utils/paymentValidation';

interface CreditCardFormProps {
  onCardSubmit: (cardData: {
    number: string;
    expiry: string;
    cvv: string;
    cardHolder: string;
    saveCard: boolean;
  }) => void;
  loading?: boolean;
  existingCard?: PaymentCard | null;
}

const { width } = Dimensions.get('window');
const CARD_ASPECT_RATIO = 1.586; // Стандартное соотношение сторон банковской карты

const CreditCardForm: React.FC<CreditCardFormProps> = ({
  onCardSubmit,
  loading = false,
  existingCard = null,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    number: existingCard ? `**** **** **** ${existingCard.lastFour}` : '',
    expiry: existingCard ? `${existingCard.expiryMonth}/${existingCard.expiryYear.slice(-2)}` : '',
    cvv: '',
    cardHolder: existingCard?.cardHolder || '',
    saveCard: existingCard?.isDefault || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'>('unknown');
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardAnimation] = useState(new Animated.Value(0));
  const [formAnimation] = useState(new Animated.Value(0));

  // Анимация при загрузке
  useEffect(() => {
    Animated.spring(formAnimation, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  // Анимация переворота карты
  const flipCard = () => {
    const toValue = isFlipped ? 0 : 180;
    setIsFlipped(!isFlipped);
    Animated.spring(cardAnimation, {
      toValue,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  // Интерполяция для анимации переворота
  const frontInterpolate = cardAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = cardAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return 'logo-cc-visa';
      case 'mastercard':
        return 'logo-cc-mastercard';
      case 'amex':
        return 'logo-cc-amex';
      case 'discover':
        return 'logo-cc-discover';
      default:
        return 'card-outline';
    }
  };

  const getCardColors = () => {
    switch (cardType) {
      case 'visa':
        return { primary: '#1A1F71', secondary: '#F6AC00' };
      case 'mastercard':
        return { primary: '#EB001B', secondary: '#F79E1B' };
      case 'amex':
        return { primary: '#108C80', secondary: '#FFFFFF' };
      case 'discover':
        return { primary: '#FF6000', secondary: '#FFFFFF' };
      default:
        return { primary: theme.primary, secondary: theme.secondary };
    }
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    // Определяем тип карты по первым цифрам
    if (numbers.startsWith('4')) setCardType('visa');
    else if (numbers.match(/^5[1-5]/)) setCardType('mastercard');
    else if (numbers.startsWith('34') || numbers.startsWith('37')) setCardType('amex');
    else if (numbers.startsWith('6')) setCardType('discover');
    else setCardType('unknown');

    // Форматируем по группам
    if (cardType === 'amex') {
      return numbers
        .replace(/(\d{4})/, '$1 ')
        .replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        .trim();
    } else {
      return numbers
        .replace(/(\d{4})/, '$1 ')
        .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
        .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
        .trim();
    }
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    }
    return numbers;
  };

  const formatCVV = (value: string) => {
    return value.replace(/\D/g, '').slice(0, cardType === 'amex' ? 4 : 3);
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    let formattedValue = value;
    
    if (typeof value === 'string') {
      switch (field) {
        case 'number':
          formattedValue = formatCardNumber(value);
          break;
        case 'expiry':
          formattedValue = formatExpiry(value);
          break;
        case 'cvv':
          formattedValue = formatCVV(value);
          // Автоматически переворачиваем карту при вводе CVV
          if (value.length > 0 && !isFlipped) {
            flipCard();
          } else if (value.length === 0 && isFlipped) {
            flipCard();
          }
          break;
      }
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const cardError = validateCardNumber(formData.number.replace(/\s/g, ''));
    if (cardError) newErrors.number = t(cardError);

    const expiryError = validateExpiry(formData.expiry);
    if (expiryError) newErrors.expiry = t(expiryError);

    const cvvError = validateCVV(formData.cvv, cardType === 'amex');
    if (cvvError) newErrors.cvv = t(cvvError);

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = t('validation.nameRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    if (!validateForm()) return;

    onCardSubmit({
      number: formData.number.replace(/\s/g, ''),
      expiry: formData.expiry,
      cvv: formData.cvv,
      cardHolder: formData.cardHolder,
      saveCard: formData.saveCard,
    });
  };

  const cardColors = getCardColors();

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: formAnimation,
          transform: [{
            translateY: formAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        },
      ]}
    >
      {/* Анимированная банковская карта */}
      <View style={styles.cardContainer}>
        {/* Лицевая сторона карты */}
        <Animated.View 
          style={[
            styles.card,
            styles.cardFront,
            frontAnimatedStyle,
            { backgroundColor: cardColors.primary },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons
              name="chip"
              size={32}
              color={cardColors.secondary}
            />
            <Ionicons
              name="wifi"
              size={24}
              color={cardColors.secondary}
              style={styles.cardWifi}
            />
          </View>
          
          <View style={styles.cardNumberContainer}>
            <Text style={styles.cardNumberText}>
              {formData.number || '•••• •••• •••• ••••'}
            </Text>
          </View>
          
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardLabel}>{t('payment.cardHolder')}</Text>
              <Text style={styles.cardValue}>
                {formData.cardHolder || t('payment.yourName')}
              </Text>
            </View>
            <View style={styles.cardExpiry}>
              <Text style={styles.cardLabel}>{t('payment.expires')}</Text>
              <Text style={styles.cardValue}>
                {formData.expiry || 'MM/YY'}
              </Text>
            </View>
            <Ionicons
              name={getCardIcon() as any}
              size={32}
              color={cardColors.secondary}
            />
          </View>
        </Animated.View>

        {/* Обратная сторона карты */}
        <Animated.View 
          style={[
            styles.card,
            styles.cardBack,
            backAnimatedStyle,
            { backgroundColor: cardColors.primary },
          ]}
        >
          <View style={styles.cardMagneticStripe} />
          <View style={styles.cardCvvContainer}>
            <View style={styles.cardCvvLabel}>
              <Text style={styles.cardCvvText}>CVV</Text>
            </View>
            <View style={[styles.cardCvvField, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
              <Text style={styles.cardCvvValue}>
                {formData.cvv || (cardType === 'amex' ? '••••' : '•••')}
              </Text>
            </View>
          </View>
          <View style={styles.cardBackFooter}>
            <Ionicons
              name={getCardIcon() as any}
              size={32}
              color={cardColors.secondary}
            />
          </View>
        </Animated.View>

        {/* Кнопка переворота карты */}
        <TouchableOpacity
          style={styles.flipButton}
          onPress={flipCard}
          activeOpacity={0.8}
        >
          <Ionicons
            name="repeat"
            size={20}
            color={theme.textSecondary}
          />
          <Text style={[styles.flipButtonText, { color: theme.textSecondary }]}>
            {isFlipped ? t('payment.showFront') : t('payment.showBack')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Форма */}
      <View style={styles.form}>
        <InputField
          label={t('payment.cardNumber')}
          placeholder="1234 5678 9012 3456"
          value={formData.number}
          onChangeText={(value) => handleInputChange('number', value)}
          error={errors.number}
          icon="card-outline"
          keyboardType="numeric"
          maxLength={cardType === 'amex' ? 17 : 19}
          editable={!loading && !existingCard}
          style={styles.inputField}
        />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <InputField
              label={t('payment.expiryDate')}
              placeholder="MM/YY"
              value={formData.expiry}
              onChangeText={(value) => handleInputChange('expiry', value)}
              error={errors.expiry}
              keyboardType="numeric"
              maxLength={5}
              editable={!loading && !existingCard}
              style={styles.inputField}
            />
          </View>
          <View style={styles.halfInput}>
            <InputField
              label={t('payment.cvv')}
              placeholder={cardType === 'amex' ? '1234' : '123'}
              value={formData.cvv}
              onChangeText={(value) => handleInputChange('cvv', value)}
              error={errors.cvv}
              secureTextEntry
              keyboardType="numeric"
              maxLength={cardType === 'amex' ? 4 : 3}
              editable={!loading}
              style={styles.inputField}
              onFocus={() => !isFlipped && flipCard()}
            />
          </View>
        </View>

        <InputField
          label={t('payment.cardHolder')}
          placeholder={t('payment.cardHolder')}
          value={formData.cardHolder}
          onChangeText={(value) => handleInputChange('cardHolder', value)}
          error={errors.cardHolder}
          icon="person-outline"
          autoCapitalize="words"
          editable={!loading && !existingCard}
          style={styles.inputField}
        />

        {!existingCard && (
          <Checkbox
            checked={formData.saveCard}
            onToggle={(checked) => handleInputChange('saveCard', checked)}
            label={t('payment.saveCard')}
            style={styles.checkbox}
          />
        )}

        {/* Информация о безопасности */}
        <View style={[styles.securityInfo, { backgroundColor: theme.background + 'CC', borderColor: theme.secondary + '40' }]}>
          <View style={[styles.securityIcon, { backgroundColor: theme.secondary + '20' }]}>
            <Ionicons name="shield-checkmark" size={24} color={theme.secondary} />
          </View>
          <View style={styles.securityText}>
            <Text style={[styles.securityTitle, { color: theme.heading }]}>
              {t('payment.securePayment')}
            </Text>
            <Text style={[styles.securitySubtitle, { color: theme.textSecondary }]}>
              {t('payment.poweredBy')} Stripe ∙ 256-bit encryption
            </Text>
          </View>
          <Ionicons name="lock-closed" size={16} color={theme.secondary} />
        </View>
      </View>

      {/* Кнопка оплаты */}
      <TouchableOpacity
        style={[
          styles.payButton,
          { 
            backgroundColor: loading ? theme.secondary + '40' : theme.primary,
            shadowColor: theme.primary,
          },
        ]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.9}
      >
        <View style={styles.payButtonContent}>
          {loading ? (
            <>
              <Ionicons name="refresh" size={20} color={theme.heading} style={styles.loadingIcon} />
              <Text style={[styles.payButtonText, { color: theme.heading }]}>
                {t('payment.processing')}
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="lock-closed" size={20} color={theme.heading} />
              <Text style={[styles.payButtonText, { color: theme.heading }]}>
                {t('payment.payNow')}
              </Text>
            </>
          )}
        </View>
        {!loading && (
          <Ionicons name="arrow-forward" size={20} color={theme.heading} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 32,
    height: (width - 40) / CARD_ASPECT_RATIO,
  },
  card: {
    width: width - 40,
    height: (width - 40) / CARD_ASPECT_RATIO,
    borderRadius: 16,
    padding: 20,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardFront: {
    justifyContent: 'space-between',
  },
  cardBack: {
    justifyContent: 'flex-start',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardWifi: {
    transform: [{ rotate: '90deg' }],
  },
  cardNumberContainer: {
    marginVertical: 20,
  },
  cardNumberText: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 2,
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardExpiry: {
    alignItems: 'flex-start',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardMagneticStripe: {
    height: 48,
    backgroundColor: '#000000',
    width: '100%',
    marginTop: 20,
  },
  cardCvvContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  cardCvvLabel: {
    flex: 1,
  },
  cardCvvText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
  },
  cardCvvField: {
    flex: 2,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cardCvvValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  cardBackFooter: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  flipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: -30,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  flipButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  form: {
    gap: 20,
  },
  inputField: {
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  checkbox: {
    marginTop: 8,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  securityText: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  securitySubtitle: {
    fontSize: 12,
    opacity: 0.8,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 32,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  loadingIcon: {
    transform: [{ rotate: '0deg' }],
    animationKeyframes: {
      '0%': { transform: [{ rotate: '0deg' }] },
      '100%': { transform: [{ rotate: '360deg' }] },
    },
    animationDuration: '1s',
    animationIterationCount: 'infinite',
  },
});

export default CreditCardForm;