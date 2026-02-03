import React, { useState } from 'react';
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
} from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { UserProfile } from '../../types/profile';

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditProfile: (updatedProfile: Partial<UserProfile>) => void;
  onViewOrders: () => void;
  onViewWishlist: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onEditProfile,
  onViewOrders,
  onViewWishlist,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});

  const handleEditProfile = () => {
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
    onEditProfile(editForm);
    setEditModalVisible(false);
    Alert.alert(t('common.success'), t('profile.saveSuccess'));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTierColor = () => {
    switch (profile.tier) {
      case 'premium':
        return theme.primary;
      case 'vip':
        return '#FFD700';
      default:
        return theme.textSecondary;
    }
  };

  const getTierName = () => {
    switch (profile.tier) {
      case 'premium':
        return t('profile.premium');
      case 'vip':
        return 'VIP';
      default:
        return t('profile.regular');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {/* Аватар и основная информация */}
      <View style={styles.mainInfo}>
        <TouchableOpacity onPress={handleEditProfile}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ 
                uri: profile.avatar || 'https://picsum.photos/120/120?random=7'
              }}
              style={styles.avatar}
            />
            <View style={[styles.editBadge, { backgroundColor: theme.primary }]}>
              <Ionicons name="camera" size={14} color={theme.heading} />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.heading }]}>
              {profile.fullName}
            </Text>
            <View style={[styles.tierBadge, { backgroundColor: getTierColor() + '20' }]}>
              <Text style={[styles.tierText, { color: getTierColor() }]}>
                {getTierName()}
              </Text>
            </View>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="mail" size={14} color={theme.textSecondary} />
              <Text style={[styles.contactText, { color: theme.text }]}>
                {profile.email}
              </Text>
              {profile.emailVerified && (
                <View style={[styles.verifiedBadge, { backgroundColor: theme.secondary }]}>
                  <Ionicons name="checkmark" size={10} color={theme.heading} />
                </View>
              )}
            </View>

            <View style={styles.contactItem}>
              <Ionicons name="call" size={14} color={theme.textSecondary} />
              <Text style={[styles.contactText, { color: theme.text }]}>
                {profile.phone}
              </Text>
              {profile.phoneVerified && (
                <View style={[styles.verifiedBadge, { backgroundColor: theme.secondary }]}>
                  <Ionicons name="checkmark" size={10} color={theme.heading} />
                </View>
              )}
            </View>
          </View>

          <Text style={[styles.memberSince, { color: theme.textSecondary }]}>
            {t('profile.memberSince')} {formatDate(profile.memberSince)}
          </Text>
        </View>
      </View>

      {/* Кнопка редактирования */}
      <TouchableOpacity
        style={[styles.editButton, { borderColor: theme.border }]}
        onPress={handleEditProfile}
      >
        <Ionicons name="create-outline" size={16} color={theme.primary} />
        <Text style={[styles.editButtonText, { color: theme.primary }]}>
          {t('profile.editProfile')}
        </Text>
      </TouchableOpacity>

      {/* Статистика */}
      <View style={[styles.statsContainer, { borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.statItem} onPress={onViewOrders}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {profile.stats.totalOrders}
          </Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>
            {t('profile.orders')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statItem} onPress={onViewWishlist}>
          <Text style={[styles.statValue, { color: theme.error }]}>
            {profile.stats.wishlistItems}
          </Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>
            {t('profile.wishlist')}
          </Text>
        </TouchableOpacity>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.secondary }]}>
            ${profile.stats.totalSpent.toLocaleString()}
          </Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>
            {t('profile.totalSpent')}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {profile.loyaltyPoints}
          </Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>
            {t('profile.points')}
          </Text>
        </View>
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

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  ];

  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: theme.heading }]}>
            {t('profile.editProfile')}
          </Text>
          <TouchableOpacity onPress={onCancel}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          {/* Полное имя */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t('profile.name')}
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.navBackground,
                color: theme.text,
                borderColor: theme.border,
              }]}
              value={form.fullName || ''}
              onChangeText={(text) => onChange({ ...form, fullName: text })}
              placeholder={t('profile.namePlaceholder')}
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          {/* Email */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t('profile.email')}
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.navBackground,
                color: theme.text,
                borderColor: theme.border,
              }]}
              value={form.email || ''}
              onChangeText={(text) => onChange({ ...form, email: text })}
              placeholder={t('profile.emailPlaceholder')}
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Телефон */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t('profile.phone')}
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.navBackground,
                color: theme.text,
                borderColor: theme.border,
              }]}
              value={form.phone || ''}
              onChangeText={(text) => onChange({ ...form, phone: text })}
              placeholder={t('profile.phonePlaceholder')}
              placeholderTextColor={theme.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          {/* Дата рождения */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t('profile.birthDate')}
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.navBackground,
                color: theme.text,
                borderColor: theme.border,
              }]}
              value={form.birthDate || ''}
              onChangeText={(text) => onChange({ ...form, birthDate: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          {/* Пол */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t('profile.gender')}
            </Text>
            <View style={styles.genderOptions}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderOption,
                    {
                      backgroundColor: selectedGender === option.value
                        ? theme.primary + '20'
                        : theme.navBackground,
                      borderColor: selectedGender === option.value
                        ? theme.primary
                        : theme.border,
                    },
                  ]}
                  onPress={() => {
                    setSelectedGender(option.value);
                    onChange({ ...form, gender: option.value });
                  }}
                >
                  <Text
                    style={[
                      styles.genderOptionText,
                      {
                        color: selectedGender === option.value
                          ? theme.primary
                          : theme.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Местоположение */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t('profile.location')}
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.navBackground,
                color: theme.text,
                borderColor: theme.border,
              }]}
              value={form.location || ''}
              onChangeText={(text) => onChange({ ...form, location: text })}
              placeholder={t('profile.locationPlaceholder')}
              placeholderTextColor={theme.textSecondary}
            />
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton, { borderColor: theme.border }]}
            onPress={onCancel}
          >
            <Text style={[styles.modalButtonText, { color: theme.text }]}>
              {t('profile.cancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={onSave}
          >
            <Text style={[styles.modalButtonText, { color: theme.heading }]}>
              {t('profile.save')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mainInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    marginRight: 8,
    marginBottom: 4,
  },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '700',
  },
  contactInfo: {
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 6,
    marginRight: 6,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberSince: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    gap: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {},
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  genderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genderOption: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  genderOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProfileHeader;