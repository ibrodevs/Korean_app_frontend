import React, { useState } from 'react';
import {
  View,
  
  StyleSheet,
  TouchableOpacity,
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

  const formatCardNumber = (value: string) => {
    // Удаляем все нецифровые символы
    const numbers = value.replace(/\D/g, '');
    
    // Определяем тип карты по первым цифрам
    if (numbers.startsWith('4')) setCardType('visa');
    else if (numbers.match(/^5[1-5]/)) setCardType('mastercard');
    else if (numbers.startsWith('34') || numbers.startsWith('37')) setCardType('amex');
    else if (numbers.startsWith('6')) setCardType('discover');
    else setCardType('unknown');

    // Форматируем по группам
    if (cardType === 'amex') {
      // Amex: 4-6-5
      return numbers
        .replace(/(\d{4})/, '$1 ')
        .replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        .trim();
    } else {
      // Visa/Mastercard/Discover: 4-4-4-4
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
          break;
      }
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Валидация номера карты
    const cardError = validateCardNumber(formData.number.replace(/\s/g, ''));
    if (cardError) newErrors.number = t(cardError);

    // Валидация срока действия
    const expiryError = validateExpiry(formData.expiry);
    if (expiryError) newErrors.expiry = t(expiryError);

    // Валидация CVV
    const cvvError = validateCVV(formData.cvv, cardType === 'amex');
    if (cvvError) newErrors.cvv = t(cvvError);

    // Валидация имени владельца
    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = t('validation.nameRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onCardSubmit({
      number: formData.number.replace(/\s/g, ''),
      expiry: formData.expiry,
      cvv: formData.cvv,
      cardHolder: formData.cardHolder,
      saveCard: formData.saveCard,
    });
  };

  return (
    <View style={styles.container}>
      {/* Иконка типа карты */}
      <View style={styles.cardTypeContainer}>
        <Ionicons
          name={getCardIcon() as any}
          size={32}
          color={theme.text}
        />
        {cardType !== 'unknown' && (
          <Text style={[styles.cardTypeText, { color: theme.textSecondary }]}>
            {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
          </Text>
        )}
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
        />

        {!existingCard && (
          <Checkbox
            checked={formData.saveCard}
            onToggle={(checked) => handleInputChange('saveCard', checked)}
            label={t('payment.saveCard')}
          />
        )}

        {/* Безопасность */}
        <View style={[styles.securityInfo, { backgroundColor: theme.secondary + '20' }]}>
          <Ionicons name="shield-checkmark" size={20} color={theme.secondary} />
          <View style={styles.securityText}>
            <Text style={[styles.securityTitle, { color: theme.heading }]}>
              {t('payment.securePayment')}
            </Text>
            <Text style={[styles.securitySubtitle, { color: theme.textSecondary }]}>
              {t('payment.poweredBy')} Stripe
            </Text>
          </View>
        </View>
      </View>

      {/* Кнопка оплаты */}
      <TouchableOpacity
        style={[
          styles.payButton,
          { backgroundColor: theme.primary },
          loading && styles.payButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <Text style={[styles.payButtonText, { color: theme.heading }]}>
            {t('payment.processing')}
          </Text>
        ) : (
          <>
            <Ionicons name="lock-closed" size={20} color={theme.heading} />
            <Text style={[styles.payButtonText, { color: theme.heading }]}>
              {t('payment.pay')}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  cardTypeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  securityText: {
    marginLeft: 12,
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  securitySubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
});

export default CreditCardForm;