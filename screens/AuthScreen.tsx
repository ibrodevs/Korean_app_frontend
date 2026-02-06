import { View as StyledView, Text } from '@/components/styled';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { AuthStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const AuthScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const slideUpAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleGoogleLogin = () => {
    console.log('Google login pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header с градиентом */}
      <StyledView style={styles.header}>
        <Animated.View
          style={{ opacity: fadeAnim }}
        >
          {/* Логотип */}
          <StyledView style={styles.logoContainer}>
            <Text style={styles.logoText}>🛒</Text>
          </StyledView>

          {/* Заголовок */}
          <Text style={styles.title}>
            Korean Shop
          </Text>

          {/* Подзаголовок */}
          <Text style={styles.subtitle}>
            Добро пожаловать!
          </Text>
        </Animated.View>
      </StyledView>

      {/* Основной контент */}
      <StyledView style={styles.content}>
        <Animated.View
          style={{ transform: [{ translateY: slideUpAnim }] }}
        >
          {/* Кнопка входа */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Войти</Text>
          </TouchableOpacity>

          {/* Кнопка регистрации */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Регистрация</Text>
          </TouchableOpacity>

          {/* Разделитель */}
          <StyledView style={styles.separator}>
            <StyledView style={styles.separatorLine} />
            <Text style={styles.separatorText}>или</Text>
            <StyledView style={styles.separatorLine} />
          </StyledView>

          {/* Социальный вход */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-google" size={20} color="#333" style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Войти через Google</Text>
          </TouchableOpacity>

          {/* Декоративные элементы */}
          <StyledView style={styles.decorative1} />
          <StyledView style={styles.decorative2} />
          <StyledView style={styles.decorative3} />
        </Animated.View>
      </StyledView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#1774F3',
    paddingHorizontal: 24,
    paddingVertical: 48,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  logoText: {
    fontSize: 36,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
    paddingBottom: 48,
  },
  loginButton: {
    backgroundColor: '#1774F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#1774F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonText: {
    color: '#1774F3',
    fontSize: 18,
    fontWeight: '600',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  separatorText: {
    color: '#6b7280',
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 18,
    fontWeight: '500',
  },
  decorative1: {
    position: 'absolute',
    top: 80,
    right: 32,
    width: 48,
    height: 48,
    backgroundColor: 'rgba(23, 116, 243, 0.1)',
    borderRadius: 24,
  },
  decorative2: {
    position: 'absolute',
    bottom: 160,
    left: 24,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(23, 116, 243, 0.1)',
    borderRadius: 16,
  },
  decorative3: {
    position: 'absolute',
    top: 160,
    left: 48,
    width: 24,
    height: 24,
    backgroundColor: 'rgba(23, 116, 243, 0.1)',
    borderRadius: 12,
  },
});

export default AuthScreen;