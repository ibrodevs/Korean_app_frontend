// Modern Design System - Korean App 2026
export const Colors = {
  light: {
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
    
    // Text Colors
    text: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#64748B',
    textHint: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#FFFFFF',
    
    // Background Colors
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',
    backgroundTertiary: '#F1F5F9',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    
    // UI Elements
    card: '#FFFFFF',
    cardHover: '#F8FAFC',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderHover: '#CBD5E1',
    divider: '#E2E8F0',
    
    // Navigation
    navBackground: '#FFFFFF',
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    tabActive: '#1774F3',
    tabInactive: '#64748B',
    
    // Deprecated (for backward compatibility)
    header: '#0F172A',
    navigation: '#1774F3',
    heading: '#0F172A',
    secondary: '#475569',
    accent: '#1774F3',
    
    // Base Colors
    white: '#FFFFFF',
    black: '#0F172A',
    gray: '#475569',
    lightGray: '#E2E8F0',
    
    // Shadows & Effects
    shadow: 'rgba(15, 23, 42, 0.08)',
    shadowMedium: 'rgba(15, 23, 42, 0.12)',
    shadowLarge: 'rgba(15, 23, 42, 0.16)',
    overlay: 'rgba(15, 23, 42, 0.6)',
  },
  dark: {
    // Brand Colors
    primary: '#1774F3',
    primaryHover: '#2563EB',
    primaryActive: '#1D4ED8',
    primaryDisabled: '#93C5FD',
    primaryLight: '#1E3A8A',
    
    // Semantic Colors
    error: '#F87171',
    errorLight: '#7F1D1D',
    success: '#34D399',
    successLight: '#064E3B',
    warning: '#FBBF24',
    warningLight: '#78350F',
    info: '#38BDF8',
    infoLight: '#0C4A6E',
    
    // Text Colors
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    textHint: '#64748B',
    textMuted: '#64748B',
    textInverse: '#0F172A',
    
    // Background Colors
    background: '#0B1120',
    backgroundSecondary: '#111827',
    backgroundTertiary: '#1F2937',
    backgroundHover: '#374151',
    surface: '#1E293B',
    surfaceElevated: '#334155',
    
    // UI Elements
    card: '#1E293B',
    cardHover: '#334155',
    border: '#334155',
    borderLight: '#1E293B',
    borderHover: '#475569',
    divider: '#334155',
    
    // Navigation
    navBackground: '#0B1120',
    tabBarBackground: '#1E293B',
    tabBarBorder: '#334155',
    tabActive: '#1774F3',
    tabInactive: '#94A3B8',
    
    // Deprecated (for backward compatibility)
    header: '#F8FAFC',
    navigation: '#1774F3',
    heading: '#F8FAFC',
    secondary: '#CBD5E1',
    accent: '#1774F3',
    
    // Base Colors
    white: '#F8FAFC',
    black: '#0B1120',
    gray: '#CBD5E1',
    lightGray: '#334155',
    
    // Shadows & Effects
    shadow: 'rgba(0, 0, 0, 0.4)',
    shadowMedium: 'rgba(0, 0, 0, 0.5)',
    shadowLarge: 'rgba(0, 0, 0, 0.6)',
    overlay: 'rgba(0, 0, 0, 0.75)',
  },
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const Typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  
  // Body Text
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 28,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  
  // Labels & Captions
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  captionSmall: {
    fontSize: 10,
    fontWeight: '400' as const,
    lineHeight: 14,
  },
  
  // Special
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
  full: 9999,
};

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const Transitions = {
  fast: 150,
  normal: 200,
  slow: 300,
};