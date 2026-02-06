import { View as StyledView, Text } from '@/components/styled';
import { useTheme } from '@/contexts/ThemeContext';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Animated,
  StatusBar
} from 'react-native';
interface SplashScreenProps {
  onFinish?: () => Promise<void> | void;
  navigation?: any; 
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, navigation }) => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const hasNavigated = useRef(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const initializeApp = async () => {
      if (hasNavigated.current) {
        return;
      }

      try {
        // Анимация появления
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start();

        await new Promise(resolve => setTimeout(resolve, 3000));

        // Анимация исчезновения
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => {
          hasNavigated.current = true;

          if (typeof onFinish === 'function') {
            const result = onFinish();
            if (result instanceof Promise) {
              result.catch(error => console.error('onFinish error:', error));
            }
          }
        });
      } catch (error) {
        console.error('Splash screen initialization error:', error);
        if (typeof onFinish === 'function') {
          const result = onFinish();
          if (result instanceof Promise) {
            result.catch(error => console.error('onFinish error:', error));
          }
        }
      }
    };

    initializeApp();
  }, [onFinish, slideAnim, opacityAnim, scaleAnim, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <StyledView className="flex-1 bg-primary">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1779F3"
      />

      <StyledView className="flex-1 justify-center items-center px-8">
        {/* Основной контент */}
        <Animated.View
          style={{
            transform: [
              { scale: scaleAnim },
              { rotate: rotate }
            ],
            opacity: opacityAnim,
          }}
          className="items-center"
        >
          {/* Логотип/Иконка */}
          <StyledView className="w-24 h-24 bg-white rounded-full justify-center items-center mb-8 shadow-lg">
            <Text className="text-4xl">🛒</Text>
          </StyledView>

          {/* Название приложения */}
          <Text className="text-3xl font-bold text-white mb-2 tracking-wide">
            Korean Shop
          </Text>

          {/* Подзаголовок */}
          <Text className="text-lg text-white/80 text-center mb-8">
            Лучшие товары из Кореи
          </Text>

          {/* Анимированный индикатор загрузки */}
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
              opacity: opacityAnim,
            }}
            className="items-center"
          >
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text className="text-white/70 mt-4 text-sm">
              Загрузка...
            </Text>
          </Animated.View>
        </Animated.View>

        {/* Декоративные элементы */}
        <StyledView className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full" />
        <StyledView className="absolute top-40 right-16 w-8 h-8 bg-white/10 rounded-full" />
        <StyledView className="absolute bottom-32 left-20 w-12 h-12 bg-white/10 rounded-full" />
        <StyledView className="absolute bottom-20 right-10 w-6 h-6 bg-white/10 rounded-full" />
      </StyledView>
    </StyledView>
  );
};

export default SplashScreen;