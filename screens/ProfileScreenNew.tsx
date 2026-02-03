import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import Text from '../components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency, CurrencyType } from '../contexts/CurrencyContext';
import { ProfileStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BlueBg from '../assets/Ellipse.svg';

type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

type ProfileData = {
  id: string;
  avatar: string;
  fullName: string;
  email: string;
  birthDate?: string;
  gender?: string;
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { t } = useTranslation();
  const { theme, isDark, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    id: '1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    fullName: 'Albert Flores',
    email: 'albertflores@mail.com',
    birthDate: '01/01/1988',
    gender: 'Male',
  });

  const handleEditProfile = () => {
    console.log('Edit Profile pressed');
    navigation.navigate('EditProfile', {
      profile,
      onSave: (updatedProfile: ProfileData) => setProfile(updatedProfile),
    });
  };

  const handleSettings = () => {
    navigation.navigate('Settings' as never);
  };

  const handlePaymentMethods = () => {
    navigation.navigate('PaymentMethods');
  };

  const handleCurrencySelect = (selectedCurrency: CurrencyType) => {
    console.log('Selecting currency:', selectedCurrency);
    setCurrency(selectedCurrency);
    setShowCurrencyDropdown(false);
  };

  const handleThemeSelect = (isDarkTheme: boolean) => {
    console.log('Selecting theme:', isDarkTheme ? 'Dark' : 'Light');
    setTheme(isDarkTheme);
    setShowThemeDropdown(false);
  };

  const currencies: CurrencyType[] = ['Som', 'USD', 'EUR', 'RUB', 'KRW'];
  const themes = [
    { label: t('profile.light'), value: false },
    { label: t('profile.dark'), value: true }
  ];

  const closeAllDropdowns = () => {
    setShowCurrencyDropdown(false);
    setShowThemeDropdown(false);
  };

  const blueBgSource = typeof BlueBg === 'string' ? { uri: BlueBg } : BlueBg;

  return (
    <TouchableWithoutFeedback onPress={closeAllDropdowns}>
      <View style={[styles.container]}>
        <StatusBar barStyle="light-content" />
        <Image source={blueBgSource} style={styles.blueimg} resizeMode="cover" />

        {/* Header like screenshot */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('profile.title')}</Text>

          {/* User Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: profile.avatar,
                }}
                style={styles.avatar}
              />
            </View>

            <Text style={styles.userName}>{profile.fullName}</Text>

            <View style={styles.emailContainer}>
              <Text style={styles.userEmail}>{profile.email}</Text>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" style={styles.verifiedIcon} />
            </View>

            <Pressable
              style={[
                styles.editButton,
                {
                  backgroundColor: isDark ? 'rgba(45, 55, 72, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  borderColor: 'transparent',
                },
              ]}
              onPress={handleEditProfile}
            >
              <Text
                style={[
                  styles.editButtonText,
                  { color: isDark ? '#E5E7EB' : '#6B7280' },
                ]}
              >
                {t('profile.editProfile')}
              </Text>
              <Ionicons name="chevron-down" size={16} color={isDark ? '#E5E7EB' : '#6B7280'} />
            </Pressable>
          </View>

          <View style={styles.waveContainer}>
            <View style={styles.wave} />
          </View>
        </View>

        {/* Settings Section */}
        <ScrollView 
          style={styles.settingsContainer}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={closeAllDropdowns}
          scrollEventThrottle={16}
        >
          {/* Currency Setting */}
          <View style={[styles.dropdownContainer, showCurrencyDropdown && styles.activeDropdownContainer]}>
            <View style={[styles.glassRow, {
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }]}>
              <Pressable 
                style={styles.settingRowContent}
                onPress={(e) => {
                  e.stopPropagation();
                  setShowThemeDropdown(false);
                  setShowCurrencyDropdown(!showCurrencyDropdown);
                }}
              >
                <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#1A202C' }]}>{t('profile.currency')}</Text>
                <View style={[styles.dropdown, { 
                  backgroundColor: 'transparent',
                  borderColor: 'transparent'
                }]}>
                  <Text style={[styles.dropdownText, { color: isDark ? '#FFFFFF' : '#2D3748' }]}>{currency}</Text>
                  <Ionicons 
                    name={showCurrencyDropdown ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color={isDark ? '#A0AEC0' : '#718096'} 
                  />
                </View>
              </Pressable>
            </View>
            {showCurrencyDropdown && (
              <View style={[styles.dropdownMenu, { 
                backgroundColor: isDark ? 'rgba(45, 55, 72, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(74, 85, 104, 0.8)' : 'rgba(226, 232, 240, 0.8)',
              }]}>
                {currencies.map((curr) => (
                  <Pressable
                    key={curr}
                    style={[styles.dropdownOption, {
                      backgroundColor: currency === curr 
                        ? (isDark ? '#4A90E240' : '#EBF4FF') 
                        : 'transparent'
                    }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleCurrencySelect(curr);
                    }}
                  >
                    <Text style={[styles.dropdownOptionText, {
                      color: currency === curr 
                        ? '#4A90E2' 
                        : (isDark ? '#FFFFFF' : '#2D3748'),
                      fontWeight: currency === curr ? '600' : '500'
                    }]}>
                      {curr}
                    </Text>
                    {currency === curr && (
                      <Ionicons name="checkmark" size={16} color="#4A90E2" />
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </View>
          <View style={[styles.separator, { backgroundColor: isDark ? 'rgba(74, 85, 104, 0.3)' : 'rgba(226, 232, 240, 0.3)' }]} />
          
          {/* Theme Setting */}
          <View style={[styles.dropdownContainer, showThemeDropdown && styles.activeDropdownContainer]}>
            <View style={[styles.glassRow, {
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }]}>
              <Pressable 
                style={styles.settingRowContent}
                onPress={(e) => {
                  e.stopPropagation();
                  setShowCurrencyDropdown(false);
                  setShowThemeDropdown(!showThemeDropdown);
                }}
              >
                <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#1A202C' }]}>{t('profile.theme')}</Text>
                <View style={[styles.dropdown, { 
                  backgroundColor: 'transparent',
                  borderColor: 'transparent'
                }]}>
                  <Text style={[styles.dropdownText, { color: isDark ? '#FFFFFF' : '#2D3748' }]}>{isDark ? t('profile.dark') : t('profile.light')}</Text>
                  <Ionicons 
                    name={showThemeDropdown ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color={isDark ? '#A0AEC0' : '#718096'} 
                  />
                </View>
              </Pressable>
            </View>
            {showThemeDropdown && (
              <View style={[styles.dropdownMenu, { 
                backgroundColor: isDark ? 'rgba(45, 55, 72, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(74, 85, 104, 0.8)' : 'rgba(226, 232, 240, 0.8)',
              }]}>
                {themes.map((themeOption) => (
                  <Pressable
                    key={themeOption.label}
                    style={[styles.dropdownOption, {
                      backgroundColor: isDark === themeOption.value 
                        ? (isDark ? '#4A90E240' : '#EBF4FF') 
                        : 'transparent'
                    }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleThemeSelect(themeOption.value);
                    }}
                  >
                    <Text style={[styles.dropdownOptionText, {
                      color: isDark === themeOption.value 
                        ? '#4A90E2' 
                        : (isDark ? '#FFFFFF' : '#2D3748'),
                      fontWeight: isDark === themeOption.value ? '600' : '500'
                    }]}>
                      {themeOption.label}
                    </Text>
                    {isDark === themeOption.value && (
                      <Ionicons name="checkmark" size={16} color="#4A90E2" />
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </View>
          
          <View style={[styles.separator, { backgroundColor: isDark ? 'rgba(74, 85, 104, 0.3)' : 'rgba(226, 232, 240, 0.3)' }]} />
          
          {/* Settings */}
          <View style={[styles.glassRow, {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          }]}>
            <Pressable style={styles.settingRowContent} onPress={handleSettings}>
              <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#1A202C' }]}>{t('profile.settings')}</Text>
              <Ionicons name="chevron-forward" size={16} color={isDark ? '#A0AEC0' : '#718096'} />
            </Pressable>
          </View>
          <View style={[styles.separator, { backgroundColor: isDark ? 'rgba(74, 85, 104, 0.3)' : 'rgba(226, 232, 240, 0.3)' }]} />
          
          {/* Payment Methods */}
          <View style={[styles.glassRow, {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          }]}>
            <Pressable style={styles.settingRowContent} onPress={handlePaymentMethods}>
              <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#1A202C' }]}>{t('profile.paymentMethods')}</Text>
              <Ionicons name="chevron-forward" size={16} color={isDark ? '#A0AEC0' : '#718096'} />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blueimg:{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: 400,
  },
  header: {
    backgroundColor: 'transparent',
    paddingTop: 64,
    paddingBottom: 72,
    position: 'relative',
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'left',
    marginLeft: 24,
    marginBottom: 28,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 0,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EAF2FF',
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: 8,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 230,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 8,
  },
  waveContainer: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 70,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: -40,
    right: -40,
    height: 120,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
  },
  settingsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingTop: 12,
    zIndex: 1,
  },
  glassRow: {
    borderRadius: 12,
    borderWidth: 0,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  settingRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },

  settingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 0,
    borderColor: 'transparent',
    minWidth: 96,
  },
  dropdownText: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#EBF4FF',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
    elevation: 1,
    marginBottom: 8,
  },
  activeDropdownContainer: {
    zIndex: 1000,
    elevation: 1000,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    elevation: 999,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 100,
    zIndex: 100,
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 4,
    marginVertical: 1,
  },
  dropdownOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});