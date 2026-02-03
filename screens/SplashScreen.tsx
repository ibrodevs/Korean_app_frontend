import React, { useEffect, useRef } from 'react';
import {
  Image,
  View,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Text from '../components/Text';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BlueImg from '../assets/Ellipse.svg'
import ShopImg from '../assets/Shoppingbag.png'
import WelcomeImg from '../assets/Welcome.png'
import SplashGif from '../assets/splash.gif'
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

  useEffect(() => {
    const initializeApp = async () => {
      if (hasNavigated.current) {
        return;
      }

      try {
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 500,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 1000,
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
  }, [onFinish, slideAnim, opacityAnim]);

  return (
    <View style={[
      { backgroundColor: theme.background }
    ]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
                  <Text style={styles.headerTitle}>Korean Shop</Text>
      
      <View style={styles.shopbag}>
                <Image style={styles.blueimg} source={BlueImg} />
                <Image style={styles.WelcomePhoto} source={WelcomeImg} />
      </View>

      <Animated.View style={[styles.loadingContainer, { transform: [{ translateY: slideAnim }], opacity: opacityAnim }]}>
        <Image source={SplashGif} style={styles.logo} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    backgroundColor: '#1779F3',
    textAlign: 'center',
    paddingTop: 120,
  },
  loadingContainer:{
    width: '100%',
    height: 200,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  logoInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  appNameContainer: {
    marginTop: 24,
  },
  appName: {
    fontSize: 32,
    marginTop: -250,
    fontWeight: '700',
    textAlign: 'center',
    color: '#fff'
  },
  welcomeImg: {
    width: 430,
    height: 300,
    marginTop: -150
  },
  indicator: {
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  shopbag:{
    flex: 1
  },
  blueimg:{
    marginBottom: -300
  },
  WelcomePhoto:{

  },
});

export default SplashScreen;