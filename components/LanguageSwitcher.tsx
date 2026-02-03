import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import Text from './Text';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const { theme } = useTheme();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const showLanguageOptions = () => {
    const options = languages.map(lang => ({
      text: `${lang.flag} ${lang.name}`,
      onPress: () => changeLanguage(lang.code),
      style: i18n.language === lang.code ? 'default' : 'cancel' as any,
    }));

    Alert.alert(
      t('common.selectLanguage') || 'Select Language',
      '',
      [
        ...options,
        { text: t('common.cancel') || 'Cancel', style: 'cancel' },
      ]
    );
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
      onPress={showLanguageOptions}
    >
      <Text style={[styles.languageText, { color: theme.white }]}>
        {currentLanguage?.flag || '🌐'}
      </Text>
      <Ionicons name="chevron-down" size={16} color={theme.white} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  languageText: {
    fontSize: 16,
    marginRight: 4,
  },
});

export default LanguageSwitcher;