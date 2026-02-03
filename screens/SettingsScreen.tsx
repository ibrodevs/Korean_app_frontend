import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
  Platform,
  Share,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, ThemeType } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SettingsHeader from '../components/settings/SettingsHeader';
import SettingsSection from '../components/settings/SettingsSection';
import { AppSettings, DEFAULT_SETTINGS, SettingItem } from '../types/settings';
import * as Application from 'expo-application';

const SettingsScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const navigation = useNavigation();

  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
      
      // Применяем изменения
      if (settings.language !== 'auto') {
        await i18n.changeLanguage(settings.language);
      }
      
      if (settings.theme !== 'auto') {
        setTheme(settings.theme === 'dark');
      }
      
      setHasChanges(false);
      Alert.alert(t('common.success'), t('settings.settingsSaved'));
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert(t('common.error'), t('settings.saveError'));
    }
  };

  const resetSettings = () => {
    Alert.alert(
      t('common.confirm'),
      t('settings.resetConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: async () => {
            setSettings(DEFAULT_SETTINGS);
            await AsyncStorage.removeItem('appSettings');
            setHasChanges(false);
            Alert.alert(t('common.success'), t('settings.settingsReset'));
          },
        },
      ]
    );
  };

  const handleSettingChange = (id: string, value: any) => {
    setHasChanges(true);
    
    // Общие настройки
    if (id === 'language') {
      setSettings((prev: AppSettings) => ({ ...prev, language: value }));
    } else if (id === 'theme') {
      setSettings((prev: AppSettings) => ({ ...prev, theme: value }));
    } else if (id === 'currency') {
      setSettings((prev: AppSettings) => ({ ...prev, currency: value }));
    }
    // Уведомления
    else if (id.startsWith('notifications_')) {
      const key = id.replace('notifications_', '') as keyof AppSettings['notifications'];
      setSettings((prev: AppSettings) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: value,
        },
      }));
    }
    // Конфиденциальность
    else if (id.startsWith('privacy_')) {
      const key = id.replace('privacy_', '') as keyof AppSettings['privacy'];
      setSettings((prev: AppSettings) => ({
        ...prev,
        privacy: {
          ...prev.privacy,
          [key]: value,
        },
      }));
    }
  };

  const handleSettingPress = (id: string) => {
    switch (id) {
      case 'clearCache':
        Alert.alert(
          t('common.confirm'),
          t('settings.clearCacheConfirm'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('common.confirm'),
              onPress: () => {
                // Логика очистки кэша
                Alert.alert(t('common.success'), t('settings.cacheCleared'));
              },
            },
          ]
        );
        break;

      case 'clearSearchHistory':
        Alert.alert(
          t('common.confirm'),
          t('settings.clearSearchConfirm'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('common.confirm'),
              onPress: () => {
                // Логика очистки истории поиска
                Alert.alert(t('common.success'), t('settings.searchCleared'));
              },
            },
          ]
        );
        break;

      case 'deleteAccount':
        Alert.alert(
          t('common.warning'),
          t('settings.deleteAccountConfirm'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('settings.deleteAccount'),
              style: 'destructive',
              onPress: () => {
                // Логика удаления аккаунта
                Alert.alert(t('common.success'), 'Account deletion request submitted');
              },
            },
          ]
        );
        break;

      case 'terms':
        Linking.openURL('https://koreanstore.com/terms');
        break;

      case 'privacyPolicy':
        Linking.openURL('https://koreanstore.com/privacy');
        break;

      case 'rateApp':
        const storeUrl = Platform.OS === 'ios'
          ? 'itms-apps://itunes.apple.com/app/idYOUR_APP_ID'
          : 'market://details?id=com.koreanstore.app';
        Linking.openURL(storeUrl).catch(() => {
          Alert.alert(t('common.error'), t('settings.cannotOpenStore'));
        });
        break;

      case 'shareApp':
        Share.share({
          message: 'Check out KoreanStore - Best Korean products app!',
          url: 'https://koreanstore.com',
          title: 'KoreanStore',
        });
        break;

      case 'contactSupport':
        navigation.navigate('Support' as never);
        break;

      case 'faq':
        navigation.navigate('Support' as never);
        break;

      case 'reportIssue':
        Linking.openURL('mailto:support@koreanstore.com?subject=Bug Report');
        break;

      case 'suggestFeature':
        Linking.openURL('mailto:suggestions@koreanstore.com?subject=Feature Suggestion');
        break;

      default:
        console.log('Unknown setting pressed:', id);
    }
  };

  // Генерация элементов настроек
  const generateSettingsItems = (): SettingItem[] => {
    return [
      // Общие настройки
      {
        id: 'language',
        title: t('settings.language'),
        description: t('settings.languageDescription'),
        type: 'select',
        value: settings.language,
        options: [
          { label: t('languages.auto'), value: 'auto' },
          { label: t('languages.en'), value: 'en' },
          { label: t('languages.ru'), value: 'ru' },
          { label: t('languages.ko'), value: 'ko' },
        ],
        section: 'general',
        icon: 'language-outline',
      },
      {
        id: 'theme',
        title: t('settings.theme'),
        description: t('settings.themeDescription'),
        type: 'select',
        value: settings.theme,
        options: [
          { label: t('settings.auto'), value: 'auto' },
          { label: t('settings.light'), value: 'light' },
          { label: t('settings.dark'), value: 'dark' },
        ],
        section: 'general',
        icon: 'color-palette-outline',
      },
      {
        id: 'currency',
        title: t('settings.currency'),
        description: t('settings.currencyDescription'),
        type: 'select',
        value: settings.currency,
        options: [
          { label: t('currencies.usd'), value: 'usd' },
          { label: t('currencies.eur'), value: 'eur' },
          { label: t('currencies.krw'), value: 'krw' },
          { label: t('currencies.rub'), value: 'rub' },
        ],
        section: 'general',
        icon: 'cash-outline',
      },

      // Уведомления
      {
        id: 'notifications_pushEnabled',
        title: t('settings.pushNotifications'),
        description: t('settings.pushNotifications'),
        type: 'switch',
        value: settings.notifications.pushEnabled,
        section: 'notifications',
        icon: 'notifications-outline',
      },
      {
        id: 'notifications_orderUpdates',
        title: t('settings.orderUpdates'),
        description: t('settings.orderUpdates'),
        type: 'switch',
        value: settings.notifications.orderUpdates,
        section: 'notifications',
        icon: 'cart-outline',
      },
      {
        id: 'notifications_promotions',
        title: t('settings.promotions'),
        description: t('settings.promotions'),
        type: 'switch',
        value: settings.notifications.promotions,
        section: 'notifications',
        icon: 'pricetag-outline',
      },
      {
        id: 'notifications_priceDrops',
        title: t('settings.priceDrops'),
        description: t('settings.priceDrops'),
        type: 'switch',
        value: settings.notifications.priceDrops,
        section: 'notifications',
        icon: 'trending-down-outline',
      },
      {
        id: 'notifications_newArrivals',
        title: t('settings.newArrivals'),
        description: t('settings.newArrivals'),
        type: 'switch',
        value: settings.notifications.newArrivals,
        section: 'notifications',
        icon: 'newspaper-outline',
      },

      // Конфиденциальность
      {
        id: 'privacy_dataCollection',
        title: t('settings.dataCollection'),
        description: t('settings.dataCollectionDescription'),
        type: 'switch',
        value: settings.privacy.dataCollection,
        section: 'privacy',
        icon: 'analytics-outline',
      },
      {
        id: 'privacy_personalizedAds',
        title: t('settings.personalizedAds'),
        description: t('settings.personalizedAdsDescription'),
        type: 'switch',
        value: settings.privacy.personalizedAds,
        section: 'privacy',
        icon: 'megaphone-outline',
      },
      {
        id: 'privacy_showActivity',
        title: t('settings.showActivity'),
        description: t('settings.showActivityDescription'),
        type: 'switch',
        value: settings.privacy.showActivity,
        section: 'privacy',
        icon: 'eye-outline',
      },
      {
        id: 'clearCache',
        title: t('settings.clearCache'),
        description: t('settings.clearCache'),
        type: 'button',
        section: 'privacy',
        icon: 'trash-outline',
        iconColor: theme.error,
      },
      {
        id: 'clearSearchHistory',
        title: t('settings.clearSearchHistory'),
        description: t('settings.clearSearchHistory'),
        type: 'button',
        section: 'privacy',
        icon: 'search-outline',
        iconColor: theme.error,
      },
      {
        id: 'deleteAccount',
        title: t('settings.deleteAccount'),
        description: t('settings.deleteAccount'),
        type: 'button',
        section: 'privacy',
        icon: 'person-remove-outline',
        iconColor: theme.error,
        danger: true,
      },

      // О приложении
      {
        id: 'version',
        title: t('settings.version'),
        description: t('settings.version'),
        type: 'info',
        value: settings.appInfo.version,
        section: 'about',
        icon: 'information-circle-outline',
      },
      {
        id: 'buildNumber',
        title: t('settings.buildNumber'),
        description: t('settings.buildNumber'),
        type: 'info',
        value: settings.appInfo.buildNumber,
        section: 'about',
        icon: 'code-slash-outline',
      },
      {
        id: 'terms',
        title: t('settings.terms'),
        description: t('settings.terms'),
        type: 'button',
        section: 'about',
        icon: 'document-text-outline',
      },
      {
        id: 'privacyPolicy',
        title: t('settings.privacyPolicy'),
        description: t('settings.privacyPolicy'),
        type: 'button',
        section: 'about',
        icon: 'shield-checkmark-outline',
      },
      {
        id: 'rateApp',
        title: t('settings.rateApp'),
        description: t('settings.rateApp'),
        type: 'button',
        section: 'about',
        icon: 'star-outline',
      },
      {
        id: 'shareApp',
        title: t('settings.shareApp'),
        description: t('settings.shareApp'),
        type: 'button',
        section: 'about',
        icon: 'share-social-outline',
      },

      // Поддержка
      {
        id: 'contactSupport',
        title: t('settings.contactSupport'),
        description: t('settings.contactSupport'),
        type: 'button',
        section: 'support',
        icon: 'headset-outline',
      },
      {
        id: 'faq',
        title: t('settings.faq'),
        description: t('settings.faq'),
        type: 'button',
        section: 'support',
        icon: 'help-circle-outline',
      },
      {
        id: 'reportIssue',
        title: t('settings.reportIssue'),
        description: t('settings.reportIssue'),
        type: 'button',
        section: 'support',
        icon: 'bug-outline',
      },
      {
        id: 'suggestFeature',
        title: t('settings.suggestFeature'),
        description: t('settings.suggestFeature'),
        type: 'button',
        section: 'support',
        icon: 'bulb-outline',
      },
    ];
  };

  // Группировка настроек по секциям
  const settingsItems = generateSettingsItems();
  const groupedSettings = settingsItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, SettingItem[]>);

  const sections = [
    { key: 'general', title: t('settings.sections.general') },
    { key: 'notifications', title: t('settings.sections.notifications') },
    { key: 'privacy', title: t('settings.sections.privacy') },
    { key: 'about', title: t('settings.sections.about') },
    { key: 'support', title: t('settings.sections.support') },
  ];

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        t('common.unsavedChanges'),
        t('settings.unsavedChangesWarning'),
        [
          { text: t('common.discard'), style: 'destructive', onPress: () => navigation.goBack() },
          { text: t('common.save'), onPress: saveSettings },
          { text: t('common.cancel'), style: 'cancel' },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <SettingsHeader
        onBack={handleBack}
        onReset={resetSettings}
        onSave={hasChanges ? saveSettings : undefined}
        showSaveButton={hasChanges}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sections.map((section) => (
          groupedSettings[section.key] && (
            <SettingsSection
              key={section.key}
              title={section.title}
              items={groupedSettings[section.key]}
              onItemChange={handleSettingChange}
              onItemPress={handleSettingPress}
            />
          )
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
});

export default SettingsScreen;