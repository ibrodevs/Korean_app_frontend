// Modern Design System Colors - Korean App 2026
export const COLORS = {
  // Brand Colors
  primary: '#1774F3',
  primaryHover: '#2563EB',
  primaryActive: '#1D4ED8',
  primaryDisabled: '#93C5FD',
  primaryLight: '#DBEAFE',
  
  // Semantic Colors
  error: '#DC2626',
  errorLight: '#FEE2E2',
  success: '#059669',
  successLight: '#D1FAE5',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  info: '#0284C7',
  infoLight: '#E0F2FE',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#0F172A',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
};

export const lightTheme = {
  // Brand
  primary: COLORS.primary,
  primaryHover: COLORS.primaryHover,
  primaryActive: COLORS.primaryActive,
  primaryDisabled: COLORS.primaryDisabled,
  
  // Semantic
  error: COLORS.error,
  errorLight: COLORS.errorLight,
  success: COLORS.success,
  successLight: COLORS.successLight,
  warning: COLORS.warning,
  warningLight: COLORS.warningLight,
  info: COLORS.info,
  infoLight: COLORS.infoLight,
  
  // Text
  text: COLORS.gray900,
  textSecondary: COLORS.gray600,
  textTertiary: COLORS.gray500,
  textHint: COLORS.gray400,
  textMuted: COLORS.gray500,
  textInverse: COLORS.white,
  
  // Backgrounds
  background: COLORS.white,
  backgroundSecondary: COLORS.gray50,
  backgroundTertiary: COLORS.gray100,
  surface: COLORS.white,
  surfaceElevated: COLORS.white,
  card: COLORS.white,
  cardHover: COLORS.gray50,
  
  // Borders
  border: COLORS.gray200,
  borderLight: COLORS.gray100,
  borderHover: COLORS.gray300,
  divider: COLORS.gray200,
  
  // Navigation
  navBackground: COLORS.white,
  tabBarBackground: COLORS.white,
  tabBarBorder: COLORS.gray200,
  tabActive: COLORS.primary,
  tabInactive: COLORS.gray500,
  
  // Others
  shadow: 'rgba(15, 23, 42, 0.08)',
  shadowMedium: 'rgba(15, 23, 42, 0.12)',
  shadowLarge: 'rgba(15, 23, 42, 0.16)',
  overlay: 'rgba(15, 23, 42, 0.6)',
  gradient: [COLORS.primary, COLORS.primaryHover],
  gradientReverse: [COLORS.primaryHover, COLORS.primary],
};

export const darkTheme = {
  // Brand
  primary: COLORS.primary,
  primaryHover: COLORS.primaryHover,
  primaryActive: COLORS.primaryActive,
  primaryDisabled: COLORS.primaryDisabled,
  
  // Semantic
  error: '#F87171',
  errorLight: '#7F1D1D',
  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FBBF24',
  warningLight: '#78350F',
  info: '#38BDF8',
  infoLight: '#0C4A6E',
  
  // Text
  text: COLORS.gray50,
  textSecondary: COLORS.gray300,
  textTertiary: COLORS.gray400,
  textHint: COLORS.gray500,
  textMuted: COLORS.gray500,
  textInverse: COLORS.gray900,
  
  // Backgrounds
  background: '#0B1120',
  backgroundSecondary: '#111827',
  backgroundTertiary: '#1F2937',
  surface: '#1E293B',
  surfaceElevated: '#334155',
  card: '#1E293B',
  cardHover: '#334155',
  
  // Borders
  border: COLORS.gray700,
  borderLight: COLORS.gray800,
  borderHover: COLORS.gray600,
  divider: COLORS.gray700,
  
  // Navigation
  navBackground: '#0B1120',
  tabBarBackground: '#1E293B',
  tabBarBorder: COLORS.gray700,
  tabActive: COLORS.primary,
  tabInactive: COLORS.gray400,
  
  // Others
  shadow: 'rgba(0, 0, 0, 0.4)',
  shadowMedium: 'rgba(0, 0, 0, 0.5)',
  shadowLarge: 'rgba(0, 0, 0, 0.6)',
  overlay: 'rgba(0, 0, 0, 0.75)',
  gradient: [COLORS.primary, COLORS.primaryActive],
  gradientReverse: [COLORS.primaryActive, COLORS.primary],
};

export type ThemeType = typeof lightTheme;
export type ColorKey = keyof typeof COLORS;