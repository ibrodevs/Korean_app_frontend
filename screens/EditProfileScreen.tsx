import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Text from '../components/Text';
import DateOfBirthPicker from '../components/DateOfBirthPicker';

interface EditProfileScreenProps {
  route: {
    params: {
      profile: {
        id: string;
        avatar?: string;
        fullName: string;
        email: string;
        phone?: string;
        birthDate?: string;
        gender?: string;
      };
      onSave: (updatedProfile: any) => void;
    };
  };
}
const EditProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();
  const route = useRoute();
  
  // Мок-данные, если нет параметров
  const mockProfile = {
    id: '1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    fullName: 'Albert Flores',
    email: 'albertflores@mail.com',
    phone: '+1 (555) 123-4567',
    birthDate: '01/01/1988',
    gender: 'Male'
  };

  const initialProfile = (route as any)?.params?.profile || mockProfile;
  const onSave = (route as any)?.params?.onSave || (() => {});

  const [profile, setProfile] = useState(initialProfile);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev: any) => {
      const updated = { ...prev, [field]: value };
      onSave(updated);
      return updated;
    });
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length) {
      handleInputChange('avatar', result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to your camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length) {
      handleInputChange('avatar', result.assets[0].uri);
    }
  };

  const handleAvatarActionSheet = () => {
    const options = ['Gallery', 'Cancel'];
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex) => {
        if (selectedIndex === 0) {
          handlePickImage();
        }
      }
    );
  };

  const handleSave = () => {
    onSave(profile);
    navigation.goBack();
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const formatDisplayDate = (dateString: string) => {
    // Преобразуем формат даты для отображения
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      return `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
    }
    return dateString;
  };

  const genderOptions = ['Male', 'Female'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          onPress={() => {
            onSave(profile);
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={30} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profile.avatar }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={[styles.editImageButton, { backgroundColor: theme.primary }]}
              onPress={handleAvatarActionSheet}
            >
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Name Field */}
          <View style={[styles.fieldContainer, { borderColor: theme.border, backgroundColor: theme.card }]}>
            <View style={styles.fieldContent}>
              <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
              <Text style={[styles.fieldValue, { color: theme.text }]}>
                {profile.fullName}
              </Text>
            </View>
          </View>

          {/* Date of Birth Field */}
          <TouchableOpacity
            style={[styles.fieldContainer, { borderColor: theme.border, backgroundColor: theme.card }]}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.fieldContent}>
              <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
              <Text style={[styles.fieldValue, { color: theme.text }]}>
                {formatDisplayDate(profile.birthDate)}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Email Field */}
          <View style={[styles.fieldContainer, { borderColor: theme.border, backgroundColor: theme.card }]}>
            <View style={styles.fieldContent}>
              <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
              <Text style={[styles.fieldValue, { color: theme.text }]}>
                {profile.email}
              </Text>
            </View>
          </View>

          {/* Gender Field */}
          <TouchableOpacity
            style={[styles.fieldContainer, { borderColor: theme.border, backgroundColor: theme.card }]}
            onPress={() => setShowGenderPicker(true)}
          >
            <View style={styles.fieldRowBetween}>
              <View style={styles.fieldContent}>
                <Ionicons name="male-female-outline" size={20} color={theme.textSecondary} />
                <Text style={[styles.fieldValue, { color: theme.text }]}>Gender</Text>
              </View>
              <View style={styles.genderValueRow}>
                <Text style={[styles.genderValue, { color: theme.textSecondary }]}> 
                  {profile.gender || 'Select'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Date of Birth Picker */}
      <DateOfBirthPicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={(date) => handleInputChange('birthDate', date)}
        initialDate={formatDisplayDate(profile.birthDate)}
      />

      <Modal
        visible={showGenderPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}> 
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Gender</Text>
              <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                <Ionicons name="close" size={22} color={theme.text} />
              </TouchableOpacity>
            </View>

            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  handleInputChange('gender', option);
                  setShowGenderPicker(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: theme.text }]}>{option}</Text>
                {profile.gender === option && (
                  <Ionicons name="checkmark" size={20} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
    marginTop: 8,
  },
  headerTitle: {
    textAlign: 'left',
    marginLeft: 12,
    marginTop: 6,
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  formSection: {
    paddingHorizontal: 20,
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  fieldContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 16,
  },
  fieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    fontSize: 17,
    fontWeight: '400',
  },
  fieldValue: {
    fontSize: 17,
    fontWeight: '400',
    marginLeft: 15,
  },
  genderValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderValue: {
    fontSize: 16,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  modalOptionText: {
    fontSize: 17,
  },
});

export default EditProfileScreen;