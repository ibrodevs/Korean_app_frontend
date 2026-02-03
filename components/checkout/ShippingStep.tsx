import React, { useState, useEffect } from 'react';
import {
  View,
  
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

// Компоненты
import InputField from '../auth/InputField';
import AddressCard from './AddressCard';
import AddressForm from './AddressForm';

// Типы и сервисы
import { ShippingAddress } from '../../types/order';
import { checkoutService } from '../../services/checkoutService';
import { validateEmail, validatePhone } from '../../utils/validation';

interface ShippingStepProps {
  shippingData: {
    address: ShippingAddress | null;
    notes: string;
  };
  onUpdate: (data: Partial<ShippingStepProps['shippingData']>) => void;
  onNext: () => void;
}

const ShippingStep: React.FC<ShippingStepProps> = ({
  shippingData,
  onUpdate,
  onNext,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSavedAddresses();
  }, []);

  const loadSavedAddresses = async () => {
    try {
      const savedAddresses = await checkoutService.getSavedAddresses();
      setAddresses(savedAddresses);
      
      // Автоматически выбираем адрес по умолчанию
      const defaultAddress = savedAddresses.find(addr => addr.isDefault);
      if (defaultAddress && !shippingData.address) {
        onUpdate({ address: defaultAddress });
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shippingData.address) {
      newErrors.address = t('checkout.selectAddress');
    } else {
      if (!shippingData.address.fullName.trim()) {
        newErrors.fullName = t('validation.nameRequired');
      }
      if (!shippingData.address.phoneNumber.trim()) {
        newErrors.phone = t('validation.phoneRequired');
      } else {
        const phoneError = validatePhone(shippingData.address.phoneNumber);
        if (phoneError) newErrors.phone = t(phoneError);
      }
      if (!shippingData.address.email.trim()) {
        newErrors.email = t('validation.emailRequired');
      } else {
        const emailError = validateEmail(shippingData.address.email);
        if (emailError) newErrors.email = t(emailError);
      }
      if (!shippingData.address.address.trim()) {
        newErrors.addressLine = t('validation.addressRequired');
      }
      if (!shippingData.address.city.trim()) {
        newErrors.city = t('validation.cityRequired');
      }
      if (!shippingData.address.country.trim()) {
        newErrors.country = t('validation.countryRequired');
      }
      if (!shippingData.address.zipCode.trim()) {
        newErrors.zipCode = t('validation.zipRequired');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) {
      Alert.alert(t('checkout.title'), t('validation.pleaseFillAllFields'));
      return;
    }
    onNext();
  };

  const handleSelectAddress = (address: ShippingAddress) => {
    onUpdate({ address });
  };

  const handleSaveAddress = async (address: ShippingAddress) => {
    try {
      setLoading(true);
      const savedAddress = await checkoutService.saveAddress(address);
      
      setAddresses(prev => {
        const existing = prev.find(a => a.id === savedAddress.id);
        if (existing) {
          return prev.map(a => a.id === savedAddress.id ? savedAddress : a);
        }
        return [...prev, savedAddress];
      });

      if (savedAddress.isDefault) {
        onUpdate({ address: savedAddress });
      }

      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to save address');
      console.error('Error saving address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    Alert.alert(
      t('common.delete'),
      t('common.areYouSure'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await checkoutService.deleteAddress(addressId);
              setAddresses(prev => prev.filter(addr => addr.id !== addressId));
              
              if (shippingData.address?.id === addressId) {
                onUpdate({ address: null });
              }
            } catch (error) {
              console.error('Error deleting address:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Заголовок шага */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.heading }]}>
          {t('checkout.step1')}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t('checkout.deliveryAddress')}
        </Text>
      </View>

      {/* Сохраненные адреса */}
      {addresses.length > 0 && (
        <View style={styles.addressesSection}>
          <Text style={[styles.sectionTitle, { color: theme.heading }]}>
            {t('checkout.selectAddress')}
          </Text>
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              selected={shippingData.address?.id === address.id}
              onSelect={() => handleSelectAddress(address)}
              onEdit={() => {
                setEditingAddress(address);
                setShowAddressForm(true);
              }}
              onDelete={() => address.id && handleDeleteAddress(address.id)}
            />
          ))}
        </View>
      )}

      {/* Добавить новый адрес */}
      <TouchableOpacity
        style={[styles.addButton, { borderColor: theme.primary }]}
        onPress={() => {
          setEditingAddress(null);
          setShowAddressForm(true);
        }}
      >
        <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
        <Text style={[styles.addButtonText, { color: theme.primary }]}>
          {t('checkout.addNewAddress')}
        </Text>
      </TouchableOpacity>

      {/* Комментарий к доставке */}
      <View style={styles.notesSection}>
        <Text style={[styles.sectionTitle, { color: theme.heading }]}>
          {t('form.notes')}
        </Text>
        <InputField
          label=""
          placeholder={t('form.notesPlaceholder')}
          value={shippingData.notes}
          onChangeText={(value) => onUpdate({ notes: value })}
          multiline
          numberOfLines={4}
          style={styles.notesInput}
        />
      </View>

      {/* Кнопка Далее */}
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: theme.primary }]}
        onPress={handleNext}
      >
        <Text style={[styles.nextButtonText, { color: theme.heading }]}>
          {t('checkout.next')}
        </Text>
      </TouchableOpacity>

      {/* Модальное окно формы адреса */}
      <Modal
        visible={showAddressForm}
        animationType="slide"
        onRequestClose={() => {
          setShowAddressForm(false);
          setEditingAddress(null);
        }}
      >
        <AddressForm
          initialData={editingAddress}
          onSave={handleSaveAddress}
          onCancel={() => {
            setShowAddressForm(false);
            setEditingAddress(null);
          }}
          loading={loading}
        />
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  addressesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 20,
    marginBottom: 24,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  notesSection: {
    marginBottom: 32,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ShippingStep;