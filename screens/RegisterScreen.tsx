import { Text } from '@/components/styled';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { AuthStackParamList } from '../types/navigation';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const RegisterScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  // Анимационные значения
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const formSlideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  useEffect(() => {
    // Анимация появления
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(formSlideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Проверка сложности пароля
    if (field === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }
    
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;
    
    if (length >= 8 && hasLetters && hasNumbers && hasSpecial) {
      setPasswordStrength('strong');
    } else if (length >= 6 && ((hasLetters && hasNumbers) || (hasLetters && hasSpecial) || (hasNumbers && hasSpecial))) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('weak');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleBack = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => navigation.goBack());
  };

  const validateForm = () => {
    if (!formData.name || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return false;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Ошибка', 'Введите корректный email адрес');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен содержать минимум 6 символов');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate registration process
      await AsyncStorage.setItem('authToken', 'demo-token');
      
      Alert.alert(
        'Регистрация успешна',
        'Ваш аккаунт успешно создан. Добро пожаловать в Korean Shop!',
        [
          {
            text: 'Начать покупки',
            onPress: () => navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'Main',
                    params: {
                      screen: 'HomeTab',
                      params: { screen: 'HomeMain' }
                    }
                  }
                ],
              })
            )
          }
        ]
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось завершить регистрацию. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return '#FF6B6B';
      case 'medium': return '#FFB347';
      case 'strong': return '#4ECDC4';
      default: return 'rgba(255,255,255,0.2)';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return 'Слабый пароль';
      case 'medium': return 'Средний пароль';
      case 'strong': return 'Надежный пароль';
      default: return 'Введите пароль';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1774F3" />
      
      {/* Фоновый градиент */}
      <View style={styles.backgroundGradient} />

      <SafeAreaView style={styles.safeArea}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Header */}
          <Animated.View 
            style={[
              styles.header,
              {
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Регистрация</Text>
            <View style={{ width: 28 }} />
          </Animated.View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <Animated.View 
                style={[
                  styles.formContainer,
                  {
                    transform: [{ translateY: formSlideAnim }],
                    opacity: fadeAnim,
                  }
                ]}
              >
                {/* Welcome Text */}
                <View style={styles.welcomeContainer}>
                  <Text style={styles.welcomeTitle}>Создание аккаунта</Text>
                  <Text style={styles.welcomeSubtitle}>
                    Заполните форму для регистрации в Korean Shop
                  </Text>
                </View>

                {/* Form Section */}
                <View style={styles.formSection}>
                  {/* Name Row */}
                  <View style={styles.nameRow}>
                    {/* Name Field */}
                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.inputLabel}>Имя</Text>
                      <View style={[
                        styles.inputWrapper,
                        focusedField === 'name' && styles.inputWrapperFocused
                      ]}>
                        <Ionicons 
                          name="person-outline" 
                          size={20} 
                          color="rgba(255, 255, 255, 0.7)" 
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="Иван"
                          placeholderTextColor="rgba(255, 255, 255, 0.5)"
                          value={formData.name}
                          onChangeText={(value) => handleInputChange('name', value)}
                          autoCapitalize="words"
                          autoCorrect={false}
                          selectionColor="#FFFFFF"
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </View>
                    </View>

                    {/* Last Name Field */}
                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.inputLabel}>Фамилия</Text>
                      <View style={[
                        styles.inputWrapper,
                        focusedField === 'lastName' && styles.inputWrapperFocused
                      ]}>
                        <Ionicons 
                          name="person-outline" 
                          size={20} 
                          color="rgba(255, 255, 255, 0.7)" 
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="Иванов"
                          placeholderTextColor="rgba(255, 255, 255, 0.5)"
                          value={formData.lastName}
                          onChangeText={(value) => handleInputChange('lastName', value)}
                          autoCapitalize="words"
                          autoCorrect={false}
                          selectionColor="#FFFFFF"
                          onFocus={() => setFocusedField('lastName')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Email Field */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={[
                      styles.inputWrapper,
                      focusedField === 'email' && styles.inputWrapperFocused
                    ]}>
                      <Ionicons 
                        name="mail-outline" 
                        size={20} 
                        color="rgba(255, 255, 255, 0.7)" 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="yourmail@company.com"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={formData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        selectionColor="#FFFFFF"
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </View>
                  </View>

                  {/* Password Field */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Пароль</Text>
                    <View style={[
                      styles.inputWrapper,
                      focusedField === 'password' && styles.inputWrapperFocused
                    ]}>
                      <Ionicons 
                        name="lock-closed-outline" 
                        size={20} 
                        color="rgba(255, 255, 255, 0.7)" 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="••••••••"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={formData.password}
                        onChangeText={(value) => handleInputChange('password', value)}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        selectionColor="#FFFFFF"
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={togglePasswordVisibility}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={showPassword ? "eye-off-outline" : "eye-outline"}
                          size={22}
                          color="rgba(255, 255, 255, 0.7)"
                        />
                      </TouchableOpacity>
                    </View>
                    
                    {/* Password Strength Indicator */}
                    {formData.password.length > 0 && (
                      <View style={styles.passwordStrengthContainer}>
                        <View style={styles.passwordStrengthBars}>
                          <View style={[
                            styles.strengthBar,
                            { backgroundColor: passwordStrength === 'weak' || passwordStrength === 'medium' || passwordStrength === 'strong' ? getPasswordStrengthColor() : 'rgba(255,255,255,0.2)' }
                          ]} />
                          <View style={[
                            styles.strengthBar,
                            { backgroundColor: passwordStrength === 'medium' || passwordStrength === 'strong' ? getPasswordStrengthColor() : 'rgba(255,255,255,0.2)' }
                          ]} />
                          <View style={[
                            styles.strengthBar,
                            { backgroundColor: passwordStrength === 'strong' ? getPasswordStrengthColor() : 'rgba(255,255,255,0.2)' }
                          ]} />
                        </View>
                        <Text style={[styles.strengthText, { color: getPasswordStrengthColor() }]}>
                          {getPasswordStrengthText()}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Confirm Password Field */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Подтверждение пароля</Text>
                    <View style={[
                      styles.inputWrapper,
                      focusedField === 'confirmPassword' && styles.inputWrapperFocused,
                      formData.confirmPassword && formData.password !== formData.confirmPassword && styles.inputWrapperError
                    ]}>
                      <Ionicons 
                        name="shield-checkmark-outline" 
                        size={20} 
                        color="rgba(255, 255, 255, 0.7)" 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="••••••••"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={formData.confirmPassword}
                        onChangeText={(value) => handleInputChange('confirmPassword', value)}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        selectionColor="#FFFFFF"
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={toggleConfirmPasswordVisibility}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                          size={22}
                          color="rgba(255, 255, 255, 0.7)"
                        />
                      </TouchableOpacity>
                    </View>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <Text style={styles.errorText}>Пароли не совпадают</Text>
                    )}
                  </View>

                  {/* Terms and Conditions */}
                  <View style={styles.termsContainer}>
                    <Ionicons name="information-circle-outline" size={18} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.termsText}>
                      Регистрируясь, вы соглашаетесь с{' '}
                      <Text style={styles.termsLink}>условиями использования</Text>
                      {' '}и{' '}
                      <Text style={styles.termsLink}>политикой конфиденциальности</Text>
                    </Text>
                  </View>

                  {/* Register Button */}
                  <TouchableOpacity
                    style={[
                      styles.registerButton,
                      isLoading && styles.registerButtonDisabled,
                      (!formData.name || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword) && styles.registerButtonInactive
                    ]}
                    onPress={handleRegister}
                    disabled={isLoading || !formData.name || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword}
                    activeOpacity={0.9}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <Ionicons name="sync" size={20} color="#1774F3" style={styles.loadingIcon} />
                        <Text style={styles.registerButtonText}>Создание аккаунта...</Text>
                      </View>
                    ) : (
                      <View style={styles.buttonContent}>
                        <Text style={styles.registerButtonText}>Создать аккаунт</Text>
                        <Ionicons name="arrow-forward" size={20} color="#1774F3" />
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Login Link */}
                  <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Уже есть аккаунт? </Text>
                    <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
                      <Text style={styles.loginLink}>Войти в систему</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1774F3',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1774F3',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  welcomeContainer: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 1,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  formSection: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  inputWrapperError: {
    borderColor: '#FF6B6B',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 50,
    fontSize: 16,
    color: '#FFFFFF',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -11 }],
    padding: 4,
  },
  passwordStrengthContainer: {
    marginTop: 8,
  },
  passwordStrengthBars: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  strengthText: {
    fontSize: 13,
    fontWeight: '500',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 24,
    gap: 12,
  },
  termsText: {
    flex: 1,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    lineHeight: 18,
  },
  termsLink: {
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonInactive: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingIcon: {
    transform: [{ rotate: '0deg' }],
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1774F3',
    letterSpacing: 0.5,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 15,
  },
  loginLink: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#FFFFFF',
    paddingBottom: 2,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -80,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -60,
    left: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeLine: {
    position: 'absolute',
    top: '20%',
    right: -20,
    width: 100,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transform: [{ rotate: '45deg' }],
  },
  decorativeDots: {
    position: 'absolute',
    bottom: '30%',
    right: 60,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default RegisterScreen;