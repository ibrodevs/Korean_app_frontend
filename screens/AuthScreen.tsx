import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '../components/Text';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BlueImg from '../assets/Ellipse.svg'
import ShopImg from '../assets/Shoppingbag.png'
import WelcomeImg from '../assets/Welcome.png'

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const AuthScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const slideUpAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideUpAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
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
      <StatusBar barStyle="light-content" />

            <Text style={styles.headerTitle}>Korean Shop</Text>
            {/* <img style={styles.shopbag} src={ShopImg} alt="" /> */}
          <View style={styles.shopbag}>
          <Image style={styles.blueimg} source={BlueImg} />
          <Image style={styles.WelcomePhoto} source={WelcomeImg} />
          </View>

        <View style={styles.content}>
          <Animated.View style={[styles.buttonsContainer, { transform: [{ translateY: slideUpAnim }] }]}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            <View style={styles.dividerSection}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or login with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialPlaceholder}>
              <View style={styles.socialLine} />
            </View>
          </Animated.View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  shopbag:{
    flex: 1
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  WelcomePhoto:{
    marginBottom: 320
  },
  blueimg:{
    marginBottom: -300

  },
  header: {
    paddingTop: 130,
    fontSize: 32,
    fontWeight: '700',
    backgroundColor: '#1779F3',
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
  boldSampleText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 4,
    marginBottom: 8,
  },
  dividerLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: '100%',
    marginVertical: 20,
  },
  buttonsContainer: {
    paddingBottom: 40,
  },
  loginButton: {
    backgroundColor: '#1779F3',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  registerButton: {
    fontWeight: 800,
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#1779F3',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1779F3',
  },
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#333333',
  },
  dividerText: {
    color: '#333333',
    fontSize: 14,
    marginHorizontal: 16,
    fontWeight: '500',
  },
  socialPlaceholder: {
    alignItems: 'center',
    height: 38,
  },
  socialLine: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BDBDBD',
  }
});

export default AuthScreen;