import React, { useState } from 'react';
import {
  View,
  
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Text from '../components/Text';
import { useTailwind } from '../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BlueImg from '../assets/blue2.svg'

// Компоненты
import InputField from '../components/auth/InputField';

// Сервисы и утилиты
import { authService } from '../services/authService';
import { validateEmail } from '../utils/validation';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ForgotPasswordScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const handleSendCode = async () => {
    const emailError = validateEmail(email);
    
    if (emailError) {
      setError(t(emailError));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        setIsCodeSent(true);
        setCanResend(false);
        setResendTimer(60);
        Alert.alert('Success', 'Verification code sent to your email');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert(
        t('auth.errors.networkError'),
        t('auth.errors.unknownError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setCanResend(false);
    setResendTimer(60);
    await handleSendCode();
  };

  const handleAccept = async () => {
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Here you would verify the code with your backend
      // For now, we'll simulate success
      Alert.alert(
        'Success',
        'Password reset code verified successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Auth', { screen: 'Login' }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        tailwind('flex-1'),
        { backgroundColor: theme.background },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={tailwind('flex-grow px-6 py-8')}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Заголовок */}
        <View style={tailwind('mb-10')}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tailwind('mb-6')}
            activeOpacity={0.7}
          >
            <Text style={[tailwind('text-lg'), { color: theme.primary }]}>
              ← Back
            </Text>
          </TouchableOpacity>
          
          <Text
            style={[
              tailwind('text-3xl font-bold'),
              { color: theme.heading },
            ]}
          >
            Forgot Password
          </Text>
          <Text
            style={[
              tailwind('text-base mt-2'),
              { color: theme.textSecondary },
            ]}
          >
            {isCodeSent
              ? 'Enter the verification code sent to your email'
              : 'Enter your email to receive a verification code'
            }
          </Text>
        </View>

        {/* Form */}
        <View style={tailwind('mb-8')}>
          {/* Email Field */}
          <InputField
            label="Email"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={(value: string) => {
              setEmail(value);
              setError('');
            }}
            error={!isCodeSent ? error : ''}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading && !isCodeSent}
          />

          {!isCodeSent ? (
            /* Send Code Button */
            <TouchableOpacity
              style={[
                tailwind('rounded-xl py-4 items-center mt-6'),
                { backgroundColor: theme.primary },
                isLoading && tailwind('opacity-70'),
              ]}
              onPress={handleSendCode}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  tailwind('text-lg font-semibold'),
                  { color: '#FFFFFF' },
                ]}
              >
                {isLoading ? 'Sending...' : 'Send a code'}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              {/* Verification Code Field */}
              <View style={tailwind('mt-6')}>
                <Text
                  style={[
                    tailwind('text-sm mb-2'),
                    { color: theme.text },
                  ]}
                >
                  Code from message
                </Text>
                <InputField
                  label=""
                  placeholder="Your code"
                  value={verificationCode}
                  onChangeText={(value: string) => {
                    setVerificationCode(value);
                    setError('');
                  }}
                  error={error}
                  icon="lock-closed-outline"
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  editable={!isLoading}
                  maxLength={6}
                />
              </View>

              {/* Resend Code Button */}
              <TouchableOpacity
                style={[
                  tailwind('py-3 items-center mt-4'),
                  !canResend && tailwind('opacity-50'),
                ]}
                onPress={handleResendCode}
                disabled={!canResend || isLoading}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    tailwind('text-base'),
                    { color: theme.primary },
                  ]}
                >
                  {canResend ? 'Resend the code' : `Resend in ${resendTimer}s`}
                </Text>
              </TouchableOpacity>

              {/* Accept Button */}
              <TouchableOpacity
                style={[
                  tailwind('rounded-xl py-4 items-center mt-8'),
                  { backgroundColor: theme.primary },
                  isLoading && tailwind('opacity-70'),
                ]}
                onPress={handleAccept}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    tailwind('text-lg font-semibold'),
                    { color: '#FFFFFF' },
                  ]}
                >
                  {isLoading ? 'Verifying...' : 'Accept'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;