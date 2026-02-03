export interface AppSettings {
  language: 'en' | 'ru' | 'ko' | 'auto';
  theme: 'light' | 'dark' | 'auto';
  currency: 'usd' | 'eur' | 'krw' | 'rub';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  appInfo: AppInfo;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  priceDrops: boolean;
  stockAlerts: boolean;
  newArrivals: boolean;
}

export interface PrivacySettings {
  dataCollection: boolean;
  personalizedAds: boolean;
  showActivity: boolean;
  searchHistoryEnabled: boolean;
}

export interface AppInfo {
  version: string;
  buildNumber: string;
  lastUpdated: string;
}

export interface SettingItem {
  id: string;
  title: string;
  description?: string;
  type: 'switch' | 'select' | 'button' | 'info' | 'action';
  value?: any;
  options?: Array<{ label: string; value: any }>;
  icon?: string;
  iconColor?: string;
  onValueChange?: (value: any) => void;
  onPress?: () => void;
  section: 'general' | 'notifications' | 'privacy' | 'about' | 'support';
  requiresRestart?: boolean;
  danger?: boolean;
}

// Мок-данные для настроек
export const DEFAULT_SETTINGS: AppSettings = {
  language: 'auto',
  theme: 'auto',
  currency: 'usd',
  notifications: {
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    orderUpdates: true,
    promotions: true,
    priceDrops: true,
    stockAlerts: false,
    newArrivals: true,
  },
  privacy: {
    dataCollection: true,
    personalizedAds: true,
    showActivity: true,
    searchHistoryEnabled: true,
  },
  appInfo: {
    version: '1.0.0',
    buildNumber: '100',
    lastUpdated: '2024-01-01',
  },
};