import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import Text from '../components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import BlueBg from '../assets/Ellipse.svg';

export default function AddCardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const blueBgSource = typeof BlueBg === 'string' ? { uri: BlueBg } : BlueBg;

  const onAdd = (route as any)?.params?.onAdd || null;
  
  const [formData, setFormData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = 'Card holder name is required';
    }
    
    if (!formData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Format: MM/YY';
    }
    
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const rawNumber = formData.cardNumber.replace(/\D/g, '');
      const cardType = rawNumber.startsWith('4')
        ? 'VISA'
        : rawNumber.startsWith('5')
          ? 'MASTERCARD'
          : 'AMEX';

      const newCard = {
        id: Date.now().toString(),
        cardHolder: formData.cardHolder.trim(),
        cardNumber: formData.cardNumber,
        cardNumberRaw: rawNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        type: cardType,
      };

      if (onAdd) {
        onAdd(newCard);
        navigation.goBack();
      } else {
        (navigation as any).dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'PaymentMethods', params: { newCard } }],
          })
        );
      }
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor="#1779F3" barStyle="light-content" />

      <Image source={blueBgSource} style={styles.blueimg} resizeMode="cover" />

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Payment methods</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={[styles.sheet, { backgroundColor: theme.backgroundSecondary }]}>
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Add Card</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Card Holder</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }, errors.cardHolder ? styles.inputError : null]}
            placeholder="Required"
            placeholderTextColor={theme.textHint}
            value={formData.cardHolder}
            onChangeText={(text) => handleInputChange('cardHolder', text)}
            autoCapitalize="words"
          />
          {errors.cardHolder && (
            <Text style={styles.errorText}>{errors.cardHolder}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Card Number</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }, errors.cardNumber ? styles.inputError : null]}
            placeholder="Required"
            placeholderTextColor={theme.textHint}
            value={formData.cardNumber}
            onChangeText={(text) => {
              const formatted = formatCardNumber(text);
              handleInputChange('cardNumber', formatted);
            }}
            keyboardType="numeric"
            maxLength={19}
          />
          {errors.cardNumber && (
            <Text style={styles.errorText}>{errors.cardNumber}</Text>
          )}
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: theme.text }]}>Valid</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, color: theme.text }, errors.expiryDate ? styles.inputError : null]}
              placeholder="Required"
              placeholderTextColor={theme.textHint}
              value={formData.expiryDate}
              onChangeText={(text) => {
                const formatted = formatExpiryDate(text);
                handleInputChange('expiryDate', formatted);
              }}
              keyboardType="numeric"
              maxLength={5}
            />
            {errors.expiryDate && (
              <Text style={styles.errorText}>{errors.expiryDate}</Text>
            )}
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: theme.text }]}>CVV</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, color: theme.text }, errors.cvv ? styles.inputError : null]}
              placeholder="Required"
              placeholderTextColor={theme.textHint}
              value={formData.cvv}
              onChangeText={(text) => {
                if (text.length <= 4) {
                  handleInputChange('cvv', text);
                }
              }}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
            {errors.cvv && (
              <Text style={styles.errorText}>{errors.cvv}</Text>
            )}
          </View>
        </View>

          <Pressable style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  blueimg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sheet: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F1F3FF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#1E78F2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});