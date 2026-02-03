import React, { useState } from 'react';
import {
  View,
  
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
import { ShippingAddress } from '../../types/order';
import { validateEmail, validatePhone } from '../../utils/validation';

interface AddressFormProps {
  initialData: ShippingAddress | null;
  onSave: (address: ShippingAddress) => void;
  onCancel: () => void;
  loading?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  initialData,
  onSave,
  onCancel,
  loading = false,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [formData, setFormData] = useState<ShippingAddress>(
    initialData || {
      fullName: '',
      phoneNumber: '',
      email: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'South Korea',
      isDefault: false,
      label: 'home',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedLabel, setSelectedLabel] = useState<'home' | 'work' | 'other'>(
    initialData?.label || 'home'
  );

  const handleInputChange = (field: keyof ShippingAddress, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('validation.nameRequired');
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t('validation.phoneRequired');
    } else {
      const phoneError = validatePhone(formData.phoneNumber);
      if (phoneError) newErrors.phoneNumber = t(phoneError);
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired');
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = t(emailError);
    }

    if (!formData.address.trim()) {
      newErrors.address = t('validation.addressRequired');
    }

    if (!formData.city.trim()) {
      newErrors.city = t('validation.cityRequired');
    }

    if (!formData.country.trim()) {
      newErrors.country = t('validation.countryRequired');
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = t('validation.zipRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert(t('common.error'), t('validation.pleaseFixErrors'));
      return;
    }

    onSave({
      ...formData,
      label: selectedLabel,
    });
  };

  const labelOptions = [
    { id: 'home', label: t('address.home'), icon: 'home-outline' },
    { id: 'work', label: t('address.work'), icon: 'business-outline' },
    { id: 'other', label: t('address.other'), icon: 'location-outline' },
  ];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Хедер */}
      <View style={[styles.header, { backgroundColor: theme.navBackground }]}>
        <TouchableOpacity onPress={onCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.primary }]}>
          {initialData ? t('address.editAddress') : t('checkout.addNewAddress')}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Выбор метки */}
        <View style={styles.labelSection}>
          <Text style={[styles.sectionTitle, { color: theme.heading }]}>
            {t('address.addressLabel')}
          </Text>
          <View style={styles.labelOptions}>
            {labelOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.labelOptionText,,
                  {
                    backgroundColor: selectedLabel === option.id
                      ? theme.primary
                      : theme.card,
                    borderColor: selectedLabel === option.id
                      ? theme.primary
                      : theme.border,
                  },
                ]}
                onPress={() => setSelectedLabel(option.id as any)}
              >
                <Ionicons
                  name={option.icon as any}
                  size={20}
                  color={selectedLabel === option.id ? theme.heading : theme.text}
                />
                <Text
                  style={[
                    styles.labelOptionText,
                    {
                      color: selectedLabel === option.id ? theme.heading : theme.text,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Форма */}
        <View style={styles.formSection}>
          <InputField
            label={t('form.fullName')}
            placeholder="John Doe"
            value={formData.fullName}
            onChangeText={(value) => handleInputChange('fullName', value)}
            error={errors.fullName}
            icon="person-outline"
            autoCapitalize="words"
            editable={!loading}
          />

          <InputField
            label={t('form.phoneNumber')}
            placeholder="+82 10-1234-5678"
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange('phoneNumber', value)}
            error={errors.phoneNumber}
            icon="call-outline"
            keyboardType="phone-pad"
            editable={!loading}
          />

          <InputField
            label={t('form.email')}
            placeholder="john@example.com"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            error={errors.email}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <InputField
            label={t('form.address')}
            placeholder="123 Gangnam-daero"
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            error={errors.address}
            icon="location-outline"
            autoCapitalize="words"
            editable={!loading}
          />

          <InputField
            label={t('form.apartment')}
            placeholder="Apt 4B"
            value={formData.apartment || ''}
            onChangeText={(value) => handleInputChange('apartment', value)}
            icon="business-outline"
            editable={!loading}
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <InputField
                label={t('form.city')}
                placeholder="Seoul"
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                error={errors.city}
                editable={!loading}
              />
            </View>
            <View style={styles.halfInput}>
              <InputField
                label={t('form.state')}
                placeholder="Gangnam-gu"
                value={formData.state}
                onChangeText={(value) => handleInputChange('state', value)}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <InputField
                label={t('form.zipCode')}
                placeholder="06164"
                value={formData.zipCode}
                onChangeText={(value) => handleInputChange('zipCode', value)}
                error={errors.zipCode}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
            <View style={styles.halfInput}>
              <InputField
                label={t('form.country')}
                placeholder="South Korea"
                value={formData.country}
                onChangeText={(value) => handleInputChange('country', value)}
                error={errors.country}
                editable={!loading}
              />
            </View>
          </View>

          <Checkbox
            checked={formData.isDefault || false}
            onToggle={(checked) => handleInputChange('isDefault', checked)}
            label={t('form.saveAddress')}
          />
        </View>

        {/* Кнопки */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton, { borderColor: theme.border }]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>
              {t('common.cancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: theme.heading }]}>
              {loading ? '...' : t('common.save')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  labelSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  labelOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  labelOptionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  formSection: {
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddressForm;