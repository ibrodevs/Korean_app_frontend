export interface UserProfile {
  id: string;
  avatar: string;
  fullName: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  location?: string;
  memberSince: string;
  tier: 'regular' | 'premium' | 'vip';
  loyaltyPoints: number;
  stats: UserStats;
  preferences: UserPreferences;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  wishlistItems: number;
  reviewsCount: number;
  savedAddresses: number;
  savedPaymentMethods: number;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  priceDrops: boolean;
  newArrivals: boolean;
  restockNotifications: boolean;
}

export interface PrivacyPreferences {
  showActivity: boolean;
  showWishlist: boolean;
  personalizedAds: boolean;
  dataCollection: boolean;
}

export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  action?: () => void;
  type: 'link' | 'action';
  badge?: number;
  showChevron?: boolean;
  danger?: boolean;
}

export interface SupportTopic {
  id: string;
  title: string;
  icon: string;
  description: string;
  route: string;
}

export interface SettingItem {
  id: string;
  title: string;
  description?: string;
  type: 'switch' | 'select' | 'button' | 'info';
  value?: any;
  options?: Array<{ label: string; value: any }>;
  onValueChange?: (value: any) => void;
  onPress?: () => void;
}