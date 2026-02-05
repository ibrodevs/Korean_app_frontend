import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { UserProfile } from '../../types/profile';
import LinearGradient from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditProfile: (updatedProfile: Partial<UserProfile>) => void;
  onViewOrders: () => void;
  onViewWishlist: () => void;
  onViewSettings?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onEditProfile,
  onViewOrders,
  onViewWishlist,
  onViewSettings,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [activeStat, setActiveStat] = useState<string | null>(null);

  const avatarScale = useRef(new Animated.Value(1)).current;
  const statsScale = useRef(new Animated.Value(1)).current;

  const handleEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setEditForm({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      birthDate: profile.birthDate,
      gender: profile.gender,
      location: profile.location,
    });
    setEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onEditProfile(editForm);
    setEditModalVisible(false);
    Alert.alert(t('common.success'), t('profile.saveSuccess'));
  };

  const handleStatPress = (statType: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveStat(statType);
    
    Animated.sequence([
      Animated.timing(statsScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(statsScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      if (statType === 'orders') onViewOrders();
      if (statType === 'wishlist') onViewWishlist();
    }, 200);
  };

  const getTierGradient = () => {
    switch (profile.tier) {
      case 'premium':
        return ['#8B5CF6', '#7C3AED'];
      case 'vip':
        return ['#F59E0B', '#D97706'];
      default:
        return ['#6B7280', '#4B5563'];
    }
  };

  const getTierIcon = () => {
    switch (profile.tier) {
      case 'premium':
        return 'diamond';
      case 'vip':
        return 'star';
      default:
        return 'person';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  };

  return (
    <View style={styles.container}>
      {/* Градиентный фон */}
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      />

      <View style={styles.content}>
        {/* Верхняя панель с настройками */}
        <View style={styles.topBar}>
          {onViewSettings && (
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
              onPress={onViewSettings}
            >
              <Ionicons name="settings" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Основная информация профиля */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleEditProfile} activeOpacity={0.9}>
            <Animated.View style={{ transform: [{ scale: avatarScale }] }}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ 
                    uri: profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=4F46E5&color=fff&size=120`
                  }}
                  style={styles.avatar}
                />
                <TouchableOpacity
                  style={[styles.editAvatarButton, { backgroundColor: theme.primary }]}
                  onPress={handleEditProfile}
                >
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {profile.fullName}
              </Text>
              
              <LinearGradient
                colors={getTierGradient()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tierBadge}
              >
                <Ionicons name={getTierIcon() as any} size={12} color="#FFFFFF" />
                <Text style={styles.tierText}>
                  {profile.tier?.toUpperCase() || 'MEMBER'}
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <Ionicons name="mail" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.contactText} numberOfLines={1}>
                  {profile.email}
                </Text>
                {profile.emailVerified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                  </View>
                )}
              </View>

              <View style={styles.contactRow}>
                <Ionicons name="call" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.contactText} numberOfLines={1}>
                  {profile.phone || 'Add phone number'}
                </Text>
                {profile.phoneVerified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.memberSince}>
              <Ionicons name="calendar" size={12} color="rgba(255,255,255,0.7)" />
              {' '}Member since {formatDate(profile.memberSince)}
            </Text>
          </View>
        </View>

        {/* Статистика */}
        <Animated.View 
          style={[
            styles.statsContainer,
            { transform: [{ scale: statsScale }] }
          ]}
        >
          <TouchableOpacity 
            style={[styles.statCard, activeStat === 'orders' && styles.statCardActive]}
            onPress={() => handleStatPress('orders')}
          >
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statIcon}
            >
              <Ionicons name="cart" size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.statValue}>{profile.stats.totalOrders}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, activeStat === 'wishlist' && styles.statCardActive]}
            onPress={() => handleStatPress('wishlist')}
          >
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statIcon}
            >
              <Ionicons name="heart" size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.statValue}>{profile.stats.wishlistItems}</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </TouchableOpacity>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statIcon}
            >
              <Ionicons name="cash" size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.statValue}>
              ${profile.stats.totalSpent.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statIcon}
            >
              <Ionicons name="trophy" size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.statValue}>{profile.loyaltyPoints}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </Animated.View>

        {/* Кнопка редактирования */}
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={handleEditProfile}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F3F4F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.editButtonGradient}
          >
            <Ionicons name="create-outline" size={18} color="#4F46E5" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Модальное окно редактирования профиля */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <EditProfileModal
          form={editForm}
          onChange={setEditForm}
          onSave={handleSaveProfile}
          onCancel={() => setEditModalVisible(false)}
          theme={theme}
          t={t}
        />
      </Modal>
    </View>
  );
};

// Модальное окно редактирования профиля
const EditProfileModal: React.FC<any> = ({
  form,
  onChange,
  onSave,
  onCancel,
  theme,
  t,
}) => {
  const [selectedGender, setSelectedGender] = useState(form.gender || '');
  const [activeField, setActiveField] = useState<string | null>(null);

  const genderOptions = [
    { value: 'male', label: 'Male', icon: 'male' },
    { value: 'female', label: 'Female', icon: 'female' },
    { value: 'other', label: 'Other', icon: 'person' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: 'eye-off' },
  ];

  const handleFieldFocus = (fieldName: string) => {
    setActiveField(fieldName);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleGenderSelect = (value: string) => {
    setSelectedGender(value);
    onChange({ ...form, gender: value });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
        {/* Заголовок модального окна */}
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.modalHeader}
        >
          <View style={styles.modalHeaderContent}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={onCancel}
            >
              <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <View style={styles.modalPlaceholder} />
          </View>
        </LinearGradient>

        <ScrollView 
          style={styles.modalBody}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalBodyContent}
        >
          {/* Аватар */}
          <View style={styles.avatarSection}>
            <Image
              source={{ 
                uri: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(form.fullName || 'User') + '&background=4F46E5&color=fff&size=120'
              }}
              style={styles.modalAvatar}
            />
            <TouchableOpacity style={styles.changePhotoButton}>
              <Ionicons name="camera" size={16} color="#4F46E5" />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Поля формы */}
          {[
            { key: 'fullName', label: 'Full Name', placeholder: 'John Doe', icon: 'person' },
            { key: 'email', label: 'Email', placeholder: 'john@example.com', icon: 'mail', keyboardType: 'email-address' },
            { key: 'phone', label: 'Phone', placeholder: '+1 (555) 123-4567', icon: 'call', keyboardType: 'phone-pad' },
            { key: 'birthDate', label: 'Birth Date', placeholder: 'YYYY-MM-DD', icon: 'calendar' },
            { key: 'location', label: 'Location', placeholder: 'New York, USA', icon: 'location' },
          ].map((field) => (
            <View key={field.key} style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Ionicons name={field.icon as any} size={16} color={theme.textSecondary} />
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  {field.label}
                </Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: activeField === field.key ? '#4F46E5' : theme.border,
                  },
                ]}
                value={form[field.key] || ''}
                onChangeText={(text) => onChange({ ...form, [field.key]: text })}
                placeholder={field.placeholder}
                placeholderTextColor={theme.textSecondary + '80'}
                onFocus={() => handleFieldFocus(field.key)}
                onBlur={() => setActiveField(null)}
                keyboardType={field.keyboardType}
              />
            </View>
          ))}

          {/* Выбор пола */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="transgender" size={16} color={theme.textSecondary} />
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Gender
              </Text>
            </View>
            <View style={styles.genderOptions}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderOption,
                    {
                      backgroundColor: selectedGender === option.value
                        ? '#4F46E5'
                        : theme.card,
                      borderColor: selectedGender === option.value
                        ? '#4F46E5'
                        : theme.border,
                    },
                  ]}
                  onPress={() => handleGenderSelect(option.value)}
                >
                  <Ionicons 
                    name={option.icon as any} 
                    size={16} 
                    color={selectedGender === option.value ? '#FFFFFF' : theme.text} 
                  />
                  <Text style={[
                    styles.genderOptionText,
                    {
                      color: selectedGender === option.value ? '#FFFFFF' : theme.text,
                    },
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Кнопки действий */}
        <View style={[styles.modalFooter, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onCancel}
            activeOpacity={0.8}
          >
            <Text style={[styles.modalButtonText, { color: theme.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.saveButton]}
            onPress={onSave}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButtonGradient}
            >
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={[styles.modalButtonText, styles.saveButtonText]}>
                Save Changes
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 28,
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
  contactInfo: {
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 8,
    marginRight: 8,
    flex: 1,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberSince: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statCardActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.3)',
    transform: [{ scale: 1.05 }],
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editProfileButton: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 10,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '90%',
  },
  modalHeader: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 20,
    paddingBottom: 16,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modalPlaceholder: {
    width: 40,
  },
  modalBody: {
    maxHeight: width * 1.5,
  },
  modalBodyContent: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 4,
    borderColor: '#F3F4F6',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  formGroup: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  genderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 10,
  },
  genderOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  saveButton: {},
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
});

export default ProfileHeader;