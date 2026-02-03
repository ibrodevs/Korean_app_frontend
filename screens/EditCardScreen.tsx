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
  Alert,
  Image,
} from 'react-native';
import Text from '../components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import BlueBg from '../assets/Ellipse.svg';

interface PaymentCard {
  id: string;
  cardHolder: string;
  cardNumber: string;
  cardNumberRaw: string;
  expiryDate: string;
  cvv: string;
  type: 'VISA' | 'MASTERCARD' | 'AMEX';
}

export default function EditCardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const blueBgSource = typeof BlueBg === 'string' ? { uri: BlueBg } : BlueBg;
  
  // Get card data from route params or use default
  const cardData = (route.params as { card?: PaymentCard })?.card || {
    id: '1',
    cardHolder: 'Romina',
    cardNumber: '•••• •••• •••• 1579',
    cardNumberRaw: '4242424242421579',
    expiryDate: '12/28',
    cvv: '209',
    type: 'VISA' as const
  };

  const onSave = (route.params as { onSave?: (card: PaymentCard) => void })?.onSave || null;
  const onDelete = (route.params as { onDelete?: (cardId: string) => void })?.onDelete || null;

  const [formData, setFormData] = useState({
    cardHolder: cardData.cardHolder,
    cardNumber: cardData.cardNumberRaw,
    expiryDate: cardData.expiryDate,
    cvv: cardData.cvv,
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
    
    if (!formData.cardNumber.replace(/\D/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\D/g, '').length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Format: MM/YY';
    }
    
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const rawNumber = formData.cardNumber.replace(/\D/g, '');
      const updated: PaymentCard = {
        ...cardData,
        cardHolder: formData.cardHolder.trim(),
        cardNumberRaw: rawNumber,
        cardNumber: `•••• •••• •••• ${rawNumber.slice(-4)}`,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
      };
      if (onSave) {
        onSave(updated);
        navigation.goBack();
      } else {
        (navigation as any).dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'PaymentMethods', params: { updatedCard: updated } }],
          })
        );
      }
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (onDelete) {
              onDelete(cardData.id);
              navigation.goBack();
            } else {
              (navigation as any).dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'PaymentMethods', params: { deletedCardId: cardData.id } }],
                })
              );
            }
          }
        }
      ]
    );
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
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Edit Card</Text>
            <Pressable onPress={handleDelete} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </Pressable>
          </View>

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
            value={formatCardNumber(formData.cardNumber)}
            onChangeText={(text) => {
              const cleaned = text.replace(/\D/g, '').slice(0, 16);
              handleInputChange('cardNumber', cleaned);
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
              onChangeText={(text) => handleInputChange('expiryDate', formatExpiryDate(text))}
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
  placeholder: {
    width: 40,
  },
  sheet: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  deleteButton: {
    padding: 8,
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