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
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  primary: '#1774F3', // Добавляем primary цвет
};

// Размеры
export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
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
  50: 200, // h-50
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
  'flex-col': { flexDirection: 'column' },
  
  // Alignment
  'items-center': { alignItems: 'center' },
  'items-start': { alignItems: 'flex-start' },
  'items-end': { alignItems: 'flex-end' },
  'justify-center': { justifyContent: 'center' },
  'justify-start': { justifyContent: 'flex-start' },
  'justify-end': { justifyContent: 'flex-end' },
  'justify-between': { justifyContent: 'space-between' },
  
  // Background colors
  'bg-white': { backgroundColor: colors.white },
  'bg-black': { backgroundColor: colors.black },
  'bg-primary': { backgroundColor: colors.primary },
  'bg-gray-100': { backgroundColor: colors.gray[100] },
  'bg-gray-200': { backgroundColor: colors.gray[200] },
  'bg-gray-300': { backgroundColor: colors.gray[300] },
  'bg-blue-50': { backgroundColor: colors.blue[50] },
  'bg-blue-100': { backgroundColor: colors.blue[100] },
  'bg-blue-500': { backgroundColor: colors.blue[500] },
  'bg-white/20': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  
  // Text colors
  'text-white': { color: colors.white },
  'text-black': { color: colors.black },
  'text-gray-500': { color: colors.gray[500] },
  'text-gray-600': { color: colors.gray[600] },
  'text-gray-700': { color: colors.gray[700] },
  'text-blue-500': { color: colors.blue[500] },
  'text-blue-600': { color: colors.blue[600] },
  'text-red-500': { color: colors.red[500] },
  'text-green-500': { color: colors.green[500] },
  
  // Font sizes
  'text-xs': { fontSize: fontSizes.xs },
  'text-sm': { fontSize: fontSizes.sm },
  'text-base': { fontSize: fontSizes.base },
  'text-lg': { fontSize: fontSizes.lg },
  'text-xl': { fontSize: fontSizes.xl },
  'text-2xl': { fontSize: fontSizes['2xl'] },
  'text-3xl': { fontSize: fontSizes['3xl'] },
  
  // Font weights
  'font-normal': { fontWeight: '400' },
  'font-medium': { fontWeight: '500' },
  'font-semibold': { fontWeight: '600' },
  'font-bold': { fontWeight: '700' },
  
  // Letter spacing
  'tracking-wide': { letterSpacing: 0.5 },
  
  // Line height
  'leading-3.5': { lineHeight: 14 },
  
  // Width & Height
  'w-2': { width: spacing[2] },
  'w-5': { width: spacing[5] },
  'w-10': { width: spacing[10] },
  'w-16': { width: spacing[16] },
  'w-20': { width: spacing[20] },
  'h-2': { height: spacing[2] },
  'h-10': { height: spacing[10] },
  'h-16': { height: spacing[16] },
  'h-50': { height: spacing[50] },
  
  // Margins
  'm-1': { margin: spacing[1] },
  'm-2': { margin: spacing[2] },
  'm-4': { margin: spacing[4] },
  'mt-1': { marginTop: spacing[1] },
  'mt-2': { marginTop: spacing[2] },
  'mt-3': { marginTop: spacing[3] },
  'mt-4': { marginTop: spacing[4] },
  'mb-1': { marginBottom: spacing[1] },
  'mb-2': { marginBottom: spacing[2] },
  'mb-4': { marginBottom: spacing[4] },
  'mb-6': { marginBottom: spacing[6] },
  'ml-2': { marginLeft: spacing[2] },
  'ml-3': { marginLeft: spacing[3] },
  'ml-5': { marginLeft: spacing[5] },
  'mr-3': { marginRight: spacing[3] },
  'mr-5': { marginRight: spacing[5] },
  'mx-1': { marginHorizontal: spacing[1] },
  'mx-2': { marginHorizontal: spacing[2] },
  'mx-2.5': { marginHorizontal: spacing[2.5] },
  'mx-4': { marginHorizontal: spacing[4] },
  'my-2': { marginVertical: spacing[2] },
  'my-4': { marginVertical: spacing[4] },
  'my-5': { marginVertical: spacing[5] },
  
  // Paddings
  'p-1': { padding: spacing[1] },
  'p-1.5': { padding: spacing[1.5] },
  'p-2': { padding: spacing[2] },
  'p-4': { padding: spacing[4] },
  'px-2': { paddingHorizontal: spacing[2] },
  'px-4': { paddingHorizontal: spacing[4] },
  'px-5': { paddingHorizontal: spacing[5] },
  'py-2': { paddingVertical: spacing[2] },
  'py-3': { paddingVertical: spacing[3] },
  'py-4': { paddingVertical: spacing[4] },
  'pb-5': { paddingBottom: spacing[5] },
  
  // Border radius
  'rounded': { borderRadius: 4 },
  'rounded-md': { borderRadius: 6 },
  'rounded-lg': { borderRadius: 8 },
  'rounded-xl': { borderRadius: 12 },
  'rounded-2xl': { borderRadius: 16 },
  'rounded-3xl': { borderRadius: 24 },
  'rounded-full': { borderRadius: 9999 },
  
  // Text alignment
  'text-center': { textAlign: 'center' },
  'text-left': { textAlign: 'left' },
  'text-right': { textAlign: 'right' },
  
  // Shadows (iOS)
  'shadow-sm': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  'shadow': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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