import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const { theme } = useTheme();

  const languages = [
    { code: 'en', name: 'EN', flag: '🇺🇸' },
    { code: 'ko', name: 'KO', flag: '🇰🇷' },
    { code: 'ru', name: 'RU', flag: '🇷🇺' },
  ];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <View style={styles.container}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.languageButton,
            {
              backgroundColor: i18n.language === lang.code ? theme.primary : 'transparent',
              borderColor: theme.border,
            },
          ]}
          onPress={() => changeLanguage(lang.code)}
        >
          <Text style={styles.flag}>{lang.flag}</Text>
          <Text
            style={[
              styles.languageText,
              {
                color: i18n.language === lang.code ? theme.heading : theme.text,
                fontWeight: i18n.language === lang.code ? '700' : '400',
              },
            ]}
          >
            {lang.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  flag: {
    fontSize: 16,
  },
  languageText: {
    fontSize: 12,
  },
});

export default LanguageSwitcher;