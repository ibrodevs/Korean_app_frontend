import { View as StyledView, Text } from '@/components/styled';
import { useTheme } from '@/contexts/ThemeContext';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Animated,
  Easing,
  StatusBar
} from 'react-native';

interface SplashScreenProps {
  onFinish?: () => Promise<void> | void;
  navigation?: any;
}

const PRIMARY_COLOR = '#1774F3';

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, navigation }) => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const hasNavigated = useRef(false);
  
  // Анимационные значения
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const initializeApp = async () => {
      if (hasNavigated.current) return;

      try {
        // Параллельная анимация
        Animated.parallel([
          // Появление с масштабированием
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.out(Easing.back(1.5)),
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.out(Easing.back(1.5)),
          }),
          // Мягкое покачивание
          Animated.loop(
            Animated.sequence([
              Animated.timing(bounceAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.sin),
              }),
              Animated.timing(bounceAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.sin),
              }),
            ]),
            { iterations: 2 }
          ),
        ]).start();

        // Задержка перед завершением - увеличена для гарантии завершения инициализации
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Завершаем сплеш
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          if (!hasNavigated.current) {
            hasNavigated.current = true;
            onFinish?.();
          }
        });

      } catch (error) {
        console.error('Splash error:', error);
        onFinish?.();
      }
    };

    initializeApp();
  }, []);

  const bounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <StyledView style={{ 
      flex: 1, 
      backgroundColor: PRIMARY_COLOR,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />

      <Animated.View style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }, { translateY: bounce }],
        alignItems: 'center',
      }}>
        {/* Логотип */}
        <StyledView style={{
          width: 96,
          height: 96,
          backgroundColor: 'white',
          borderRadius: 24,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 8,
        }}>
          <Text style={{ fontSize: 48, color: PRIMARY_COLOR, fontWeight: 'bold' }}>
            KS
          </Text>
        </StyledView>

        {/* Название */}
        <Text style={{
          fontSize: 28,
          fontWeight: '700',
          color: 'white',
          marginBottom: 8,
          letterSpacing: 2,
        }}>
          KOREAN SHOP
        </Text>

        {/* Индикатор */}
        <StyledView style={{ marginTop: 32 }}>
          <ActivityIndicator size="large" color="white" />
        </StyledView>
      </Animated.View>
    </StyledView>
  );
};

export default SplashScreen;