import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useGoogleLogin } from '@react-oauth/google'; // Web
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios'

import { View as StyledView, Text } from '@/components/styled';
import { HomeStackParamList } from '../types/navigation';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Easing,
  Platform
} from 'react-native';
import { AuthStackParamList } from '../types/navigation';

const { width, height } = Dimensions.get('window');

GoogleSignin.configure({
    /**
     * this is google sign in config created by Adilhan
     */
    webClientId: '1074628944814-je4b5jgu8uccj26rk9v9i73a8guf0kvn.apps.googleusercontent.com', 
    offlineAccess: true,
  });

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const AuthScreen: React.FC = () => {
  const BASE_URL_API = process.env.EXPO_PUBLIC_API_BASE_URL

  const router = useRouter();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  // Анимационные значения
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.97)).current;
  const headerSlideAnim = useRef(new Animated.Value(-50)).current;
  const button1Anim = useRef(new Animated.Value(50)).current;
  const button2Anim = useRef(new Animated.Value(50)).current;
  const button3Anim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const navigationhome = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();


 

  useEffect(() => {
    // Параллельная анимация появления
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.2)),
      }),
    ]).start();

    // Последовательная анимация кнопок
    Animated.stagger(200, [
      Animated.timing(button1Anim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(button2Anim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(button3Anim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Бесконечная пульсация декоративного элемента
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();
  }, []);

  const pulseScale = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const handleLogin = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  

  const sendUserGoogleAuthDataToAPI = async(token, isIdToken = true) => {
    try{
      // Для мобильных отправляем как id_token, для веба как access_token
      const payload = isIdToken 
        ? { "id_token": token }
        : { "access_token": token };
      
      const response = await axios.post(`${BASE_URL_API}/api/auth/google/`, payload);
      console.log('response from api: ', response.data);
      return response.data;
    }
    catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error; 
    }
  }

  const handleGoogleLogin = async() => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("idToken", userInfo.data.idToken);
      
      const apiResponse = await sendUserGoogleAuthDataToAPI(userInfo.data.idToken, true);
      console.log('User info:', apiResponse);
    } catch (error) {
      console.error('Login Error:', error);
    }
  }

  const loginWeb = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    console.log('Web Login Success:', tokenResponse);
    await sendUserGoogleAuthDataToAPI(tokenResponse.access_token, false);
  },
  });

    const handleUniversalGoogleLogin = () => {
    if (Platform.OS === 'web') {
      loginWeb(); // Вызывает хук @react-oauth/google
    } else {
      handleGoogleLogin(); // Вызывает твою нативную функцию с GoogleSignin
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Header с градиентным эффектом через opacity */}
        <Animated.View 
          style={[
            styles.header,
            {
              transform: [{ translateY: headerSlideAnim }],
              opacity: fadeAnim,
            }
          ]}
        >
          <StyledView style={styles.headerBackground} />
          
          {/* Логотип с эффектом */}
          <Animated.View style={styles.logoWrapper}>
            <StyledView style={styles.logoContainer}>
              <Text style={styles.logoText}>K</Text>
              <StyledView style={styles.logoAccent} />
            </StyledView>
          </Animated.View>

          {/* Заголовок */}
          <Text style={styles.title}>
            KOREAN SHOP
          </Text>

          {/* Подзаголовок */}
          <Text style={styles.subtitle}>
            Премиум качество • Быстрая доставка
          </Text>
          
          {/* Статистика */}
          <StyledView style={styles.statsContainer}>
            <StyledView style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>товаров</Text>
            </StyledView>
            <StyledView style={styles.statDivider} />
            <StyledView style={styles.statItem}>
              <Text style={styles.statNumber}>50k+</Text>
              <Text style={styles.statLabel}>клиентов</Text>
            </StyledView>
            <StyledView style={styles.statDivider} />
            <StyledView style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>поддержка</Text>
            </StyledView>
          </StyledView>
        </Animated.View>

        {/* Основной контент с кнопками */}
        <StyledView style={styles.bottomContainer}>
          {/* Кнопка входа */}
          <Animated.View 
            style={[
              styles.buttonWrapper,
              {
                transform: [{ translateY: button1Anim }],
                opacity: fadeAnim,
              }
            ]}
          >
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.9}
            >
              <Text style={styles.loginButtonText}>Войти в аккаунт</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>

          {/* Кнопка регистрации */}
          <Animated.View 
            style={[
              styles.buttonWrapper,
              {
                transform: [{ translateY: button2Anim }],
                opacity: fadeAnim,
              }
            ]}
          >
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.9}
            >
              <Text style={styles.registerButtonText}>Создать аккаунт</Text>
              <Ionicons name="person-add-outline" size={20} color="#1774F3" />
            </TouchableOpacity>
          </Animated.View>

          {/* Разделитель */}
          <Animated.View 
            style={[
              styles.separator,
              {
                opacity: fadeAnim,
                transform: [{ translateY: button2Anim }],
              }
            ]}
          >
            <StyledView style={styles.separatorLine} />
            <Text style={styles.separatorText}>или</Text>
            <StyledView style={styles.separatorLine} />
          </Animated.View>

          {/* Социальный вход */}
          <Animated.View 
            style={[
              styles.buttonWrapper,
              {
                transform: [{ translateY: button3Anim }],
                opacity: fadeAnim,
              }
            ]}
          >
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleUniversalGoogleLogin}
              activeOpacity={0.9}
            >
              <Ionicons name="logo-google" size={20} color="#6b7280" />
              <Text style={styles.googleButtonText}>Продолжить с Google</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Дополнительная информация */}
          <Animated.View 
            style={[
              styles.infoContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: button3Anim }],
              }
            ]}
          >
            <Text style={styles.infoText}>
              Нажимая "Войти", вы принимаете{' '}
              <Text style={styles.infoLink}>условия использования</Text>
            </Text>
          </Animated.View>
        </StyledView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1774F3',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#1774F3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1774F3',
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 88,
    height: 88,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1774F3',
    letterSpacing: 1,
  },
  logoAccent: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#1774F3',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  buttonWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  loginButton: {
    backgroundColor: '#1774F3',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#1774F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1774F3',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  registerButtonText: {
    color: '#1774F3',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
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
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 12,
  },
  infoContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  infoLink: {
    color: '#1774F3',
    fontWeight: '600',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(23, 116, 243, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(23, 116, 243, 0.1)',
  },
  decorativeDot1: {
    position: 'absolute',
    bottom: 120,
    left: 30,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(23, 116, 243, 0.1)',
  },
  decorativeDot2: {
    position: 'absolute',
    top: 250,
    right: 40,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(23, 116, 243, 0.08)',
  },
  decorativeLine: {
    position: 'absolute',
    bottom: 200,
    right: 60,
    width: 60,
    height: 2,
    backgroundColor: 'rgba(23, 116, 243, 0.05)',
    transform: [{ rotate: '45deg' }],
  },
});



const WEB_CLIENT_ID =  '1074628944814-je4b5jgu8uccj26rk9v9i73a8guf0kvn.apps.googleusercontent.com';

const AuthScreenWithProvider = () => {
  if (Platform.OS === 'web') {
    return (
      <GoogleOAuthProvider clientId={WEB_CLIENT_ID}>
        <AuthScreen />
      </GoogleOAuthProvider>
    );
  }
  return <AuthScreen />;
};

export default AuthScreenWithProvider;