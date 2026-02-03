import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import Text from '../components/Text';

import {
  UserProfile,
  UserPreferences,
} from '../types/profile';

import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

const ProfileScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, isDark, toggleTheme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Мок-данные для профиля
  const mockProfile: UserProfile = {
    id: '1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    fullName: 'Albert Flores',
    email: 'albertflores@mail.com',
    phone: '+1 (555) 123-4567',
    emailVerified: true,
    phoneVerified: false,
    memberSince: '2023-01-01',
    tier: 'premium',
    loyaltyPoints: 1250,
    birthDate: '01/01/1988',
    gender: 'male',
    stats: {
      totalOrders: 15,
      totalSpent: 489.99,
      wishlistItems: 12,
      reviewsCount: 8,
      savedAddresses: 2,
      savedPaymentMethods: 3,
    },
    preferences: {
      language: 'en',
      theme: 'light',
      notifications: {
        pushEnabled: true,
        emailEnabled: true,
        smsEnabled: false,
        orderUpdates: true,
        promotions: true,
        priceDrops: true,
        newArrivals: false,
        restockNotifications: true,
      },
      privacy: {
        showActivity: true,
        showWishlist: true,
        personalizedAds: true,
        dataCollection: false,
      },
    },
  };

  const [profile, setProfile] = useState<UserProfile>(mockProfile);

  const handleEditProfile = () => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('EditProfile', {
        profile,
        onSave: (updatedProfile: Partial<UserProfile>) => {
          setProfile(prev => ({ ...prev, ...updatedProfile }));
        },
      });
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('authToken');
            const parentNavigation = navigation.getParent();
            if (parentNavigation) {
              parentNavigation.navigate('Auth', { screen: 'Login' });
            }
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
        <TouchableOpacity onPress={() => {}} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profile.avatar }}
              style={styles.avatar}
            />
          </View>
          
          <Text style={[styles.profileName, { color: theme.text }]}>
            {profile.fullName}
          </Text>
          
          <View style={styles.emailContainer}>
            <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
              {profile.email}
            </Text>
            {profile.emailVerified && (
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" style={{ marginLeft: 4 }} />
            )}
          </View>

          <TouchableOpacity
            style={[styles.editButton, { 
              backgroundColor: isDark ? '#333' : '#F5F5F5',
              borderColor: theme.border 
            }]}
            onPress={handleEditProfile}
          >
            <Text style={[styles.editButtonText, { color: theme.text }]}>
              Edit Profile
            </Text>
            <Ionicons name="chevron-down" size={16} color={theme.textSecondary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  settingsButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 40,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  profileEmail: {
    fontSize: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderRadius: 25,
    minWidth: 120,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileScreen;