import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
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
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
        <TouchableOpacity onPress={() => {}} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleEditProfile}>
            <Image
              source={{ uri: profile.avatar }}
              style={styles.avatar}
            />
            <View style={[styles.editBadge, { backgroundColor: theme.primary }]}>
              <Ionicons name="pencil" size={12} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>
              {profile.fullName}
            </Text>
            <View style={styles.emailContainer}>
              <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
                {profile.email}
              </Text>
              {profile.emailVerified && (
                <Ionicons name="checkmark-circle" size={16} color={theme.success} />
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.editButton, { borderColor: theme.border }]}
            onPress={handleEditProfile}
          >
            <Text style={[styles.editButtonText, { color: theme.text }]}>
              Edit Profile
            </Text>
            <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileEmail: {
    fontSize: 16,
    opacity: 0.7,
    marginRight: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 16,
    marginRight: 8,
  },
});

export default ProfileScreen;