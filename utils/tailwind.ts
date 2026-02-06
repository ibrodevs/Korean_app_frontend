import { StyleSheet } from 'react-native';

// Цвета (Tailwind-подобные)
export const colors = {
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  primary: '#1774F3',
};

// Размеры
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  50: 200,
};

// Размеры шрифтов
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// Утилиты стилей (Tailwind-подобные)
export const tw = StyleSheet.create({
  // Flex
  'flex-1': { flex: 1 },
  'flex-row': { flexDirection: 'row' },

  // Alignment
  'items-center': { alignItems: 'center' },
  'justify-center': { justifyContent: 'center' },
  'justify-end': { justifyContent: 'flex-end' },

  // Background colors
  'bg-white': { backgroundColor: colors.white },
  'bg-primary': { backgroundColor: colors.primary },
  'bg-gray-100': { backgroundColor: colors.gray[100] },

  // Text colors
  'text-white': { color: colors.white },
  'text-gray-500': { color: colors.gray[500] },
  'text-gray-600': { color: colors.gray[600] },
  'text-gray-700': { color: colors.gray[700] },
  'text-primary': { color: colors.primary },

  // Font sizes
  'text-xs': { fontSize: fontSizes.xs },
  'text-sm': { fontSize: fontSizes.sm },
  'text-base': { fontSize: fontSizes.base },
  'text-lg': { fontSize: fontSizes.lg },
  'text-xl': { fontSize: fontSizes.xl },
  'text-2xl': { fontSize: fontSizes['2xl'] },
  'text-3xl': { fontSize: fontSizes['3xl'] },
  'text-4xl': { fontSize: fontSizes['4xl'] },

  // Font weights
  'font-normal': { fontWeight: '400' },
  'font-medium': { fontWeight: '500' },
  'font-semibold': { fontWeight: '600' },
  'font-bold': { fontWeight: '700' },

  // Letter spacing
  'tracking-wide': { letterSpacing: 0.5 },

  // Width & Height
  'w-20': { width: spacing[20] },
  'w-24': { width: spacing[24] },
  'h-8': { height: spacing[8] },
  'h-12': { height: spacing[12] },
  'h-16': { height: spacing[16] },
  'h-20': { height: spacing[20] },
  'h-24': { height: spacing[24] },
  'h-px': { height: 1 },

  // Margins
  'mb-2': { marginBottom: spacing[2] },
  'mb-6': { marginBottom: spacing[6] },
  'mb-8': { marginBottom: spacing[8] },
  'ml-2': { marginLeft: spacing[2] },
  'mr-3': { marginRight: spacing[3] },
  'mt-4': { marginTop: spacing[4] },
  'my-6': { marginVertical: spacing[6] },

  // Paddings
  'px-6': { paddingHorizontal: spacing[6] },
  'py-3': { paddingVertical: spacing[3] },
  'py-4': { paddingVertical: spacing[4] },
  'py-12': { paddingVertical: spacing[12] },
  'pb-12': { paddingBottom: spacing[12] },

  // Border radius
  'rounded-xl': { borderRadius: 12 },
  'rounded-2xl': { borderRadius: 16 },
  'rounded-3xl': { borderRadius: 24 },
  'rounded-full': { borderRadius: 9999 },

  // Text alignment
  'text-center': { textAlign: 'center' },

  // Border
  'border-2': { borderWidth: 2 },
  'border-primary': { borderColor: colors.primary },
  'border-gray-300': { borderColor: colors.gray[300] },

  // Position
  'absolute': { position: 'absolute' },

  // Top / Right / Bottom / Left
  'top-20': { top: spacing[20] },
  'top-40': { top: spacing[16] * 2.5 },
  'right-8': { right: spacing[8] },
  'right-10': { right: spacing[10] },
  'right-16': { right: spacing[16] },
  'bottom-20': { bottom: spacing[20] },
  'bottom-32': { bottom: spacing[32] },
  'bottom-40': { bottom: spacing[16] * 2.5 },
  'left-6': { left: spacing[6] },
  'left-10': { left: spacing[10] },
  'left-12': { left: spacing[12] },
  'left-20': { left: spacing[20] },

  // Opacity
  'text-white/70': { color: 'rgba(255, 255, 255, 0.7)' },
  'text-white/80': { color: 'rgba(255, 255, 255, 0.8)' },
  'text-white/90': { color: 'rgba(255, 255, 255, 0.9)' },
  'bg-white/10': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  'bg-primary/10': { backgroundColor: 'rgba(23, 116, 243, 0.1)' },

  // Shadows
  'shadow-md': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  'shadow-lg': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});

// Функция для комбинирования стилей
export const combine = (...styles: any[]) => {
  return styles.filter(Boolean);
};

// Функция для простого применения классов (как className)
export const cn = (...classNames: string[]) => {
  return classNames.map(className => tw[className as keyof typeof tw]).filter(Boolean);
};

// Типобезопасная версия
export const twStyle = (...classNames: (keyof typeof tw)[]) => {
  return classNames.map(className => tw[className]);
};
