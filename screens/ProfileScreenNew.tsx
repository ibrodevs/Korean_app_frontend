import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';
import SettingItem from '../components/profile/SettingItem';
import Text from '../components/Text';
import { CurrencyType, useCurrency } from '../contexts/CurrencyContext';
import { useTheme } from '../contexts/ThemeContext';
import { ProfileStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

type ProfileData = {
  id: string;
  avatar: string;
  fullName: string;
  email: string;
  birthDate?: string;
  gender?: string;
  tier?: 'basic' | 'premium' | 'vip';
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { theme, isDark, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const [profile, setProfile] = useState<ProfileData>({
    id: '1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    fullName: 'Albert Flores',
    email: 'albertflores@mail.com',
    birthDate: '01/01/1988',
    gender: 'Male',
    tier: 'premium',
  });

  // Анимация фона при скролле
  const bgTranslateY = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, -150],
    extrapolate: 'clamp',
  });

  const bgScale = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 1.5],
    extrapolate: 'clamp',
  });

  const bgOpacity = scrollY.interpolate({
    inputRange: [0, 200, 300],
    outputRange: [1, 0.7, 0.5],
    extrapolate: 'clamp',
  });

  // Анимация header при скролле
  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const avatarScale = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const handleEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('EditProfile', {
      profile,
      onSave: (updatedProfile: ProfileData) => setProfile(updatedProfile),
    });
  };

  const handleSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Settings' as never);
  };

  const handlePaymentMethods = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('PaymentMethods');
  };

  const handleCurrencySelect = (selectedCurrency: CurrencyType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrency(selectedCurrency);
  };

  const handleThemeSelect = (isDarkTheme: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTheme(isDarkTheme);
  };

  const currencies: CurrencyType[] = ['Som', 'USD', 'EUR', 'RUB', 'KRW'];
  const themes = [
    { label: 'Светлая', value: false, icon: 'sunny' },
    { label: 'Темная', value: true, icon: 'moon' },
  ];

  const selectedThemeLabel = themes.find((item) => item.value === isDark)?.label;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Анимированный синий фон */}
      <Animated.View 
        style={[
          styles.blueBgContainer,
          {
            transform: [
              { translateY: bgTranslateY },
              { scale: bgScale },
            ],
            opacity: bgOpacity,
          },
        ]}
      >
        <Svg width={width} height={400} viewBox="0 0 375 377">
          <Ellipse cx="140" cy="132.5" rx="298" ry="244.5" fill="#1779F3" />
        </Svg>
      </Animated.View>

      {/* Спиннер для всей страницы */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        onScrollBeginDrag={() => undefined}
      >
        {/* Header секция */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [{ scale: headerScale }],
            },
          ]}
        >
          <View style={styles.headerContent}>
            <Animated.View 
              style={[
                styles.avatarContainer,
                { transform: [{ scale: avatarScale }] },
              ]}
            >
              <TouchableWithoutFeedback onPress={handleEditProfile}>
                <View>
                  <Image
                    source={{ uri: profile.avatar }}
                    style={styles.avatar}
                  />
                  <View style={[styles.editAvatarButton, { backgroundColor: theme.primary }]}>
                    <Ionicons name="camera" size={16} color="#FFFFFF" />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName} numberOfLines={1}>
                  {profile.fullName}
                </Text>
              </View>

              <View style={styles.emailContainer}>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {profile.email}
                </Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </View>

          <TouchableWithoutFeedback onPress={handleEditProfile}>
            <LinearGradient
              colors={['#FFFFFF', '#F3F4F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.editProfileButton}
            >
              <Ionicons name="create-outline" size={20} color="#4F46E5" />
              <Text style={styles.editProfileText}>Редактировать профиль</Text>
            </LinearGradient>
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Карточка статистики */}
        <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
          <View style={[styles.statsContainer, { borderTopColor: theme.border }]}>
            <Pressable style={styles.statItem} onPress={handlePaymentMethods}>
              <Text style={[styles.statValue, { color: theme.text }]}>12</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Заказы</Text>
            </Pressable>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>$2,849</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Потрачено</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>258</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Баллы</Text>
            </View>
          </View>
        </View>

        {/* Настройки */}
        <View style={styles.settingsSection}>
          
          {/* Валюта */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <SettingItem
              title="Валюта"
              description="Выберите предпочитаемую валюту"
              type="select"
              value={currency}
              options={currencies.map(curr => ({ label: curr, value: curr }))}
              onValueChange={handleCurrencySelect}
              selectedValue={currency}
              icon="cash"
              accentColor="#10B981"
            />
          </Animated.View>

          {/* Тема */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <SettingItem
              title="Тема"
              description="Выберите внешний вид приложения"
              type="select"
              value={isDark}
              options={themes}
              onValueChange={handleThemeSelect}
              selectedValue={selectedThemeLabel}
              icon="color-palette"
              accentColor="#F59E0B"
            />
          </Animated.View>

          {/* Настройки */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <SettingItem
              title="Настройки"
              description="Управляйте настройками приложения"
              type="action"
              onPress={handleSettings}
              icon="settings"
              accentColor="#6366F1"
            />
          </Animated.View>

          {/* Методы оплаты */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <SettingItem
              title="Способы оплаты"
              description="Управляйте способами оплаты"
              type="action"
              onPress={handlePaymentMethods}
              icon="card"
              accentColor="#EC4899"
            />
          </Animated.View>
        </View>
      </Animated.ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blueBgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 12,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tierText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: 8,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberSince: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  editProfileText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 10,
  },
  settingsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  securityCard: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  securityDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  spacer: {
    height: 40,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'flex-end',
  },
  dropdownContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
  },
  dropdownTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  dropdownOptionSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  dropdownOptionText: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
    marginLeft: 16,
  },
  dropdownOptionTextSelected: {
    fontWeight: '600',
  },
});