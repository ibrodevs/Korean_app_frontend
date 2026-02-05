import { tw } from '@/utils/tailwind';
import React from 'react';
import { Text as RNText, View as RNView, TextProps, TextStyle, ViewProps, ViewStyle } from 'react-native';

// Функция для парсинга className в стили
const parseClassName = (className: string): any[] => {
  if (!className) return [];
  
  return className
    .split(' ')
    .filter(Boolean)
    .map(cls => tw[cls as keyof typeof tw])
    .filter(Boolean);
};

// Типы для props с className
interface ClassNameViewProps extends Omit<ViewProps, 'style'> {
  className?: string;
  style?: ViewStyle | ViewStyle[];
}

interface ClassNameTextProps extends Omit<TextProps, 'style'> {
  className?: string;
  style?: TextStyle | TextStyle[];
}

// View компонент с поддержкой className
export const View: React.FC<ClassNameViewProps> = ({ className, style, children, ...props }) => {
  const classNameStyles = parseClassName(className || '');
  const combinedStyles = [
    ...classNameStyles,
    ...(Array.isArray(style) ? style : style ? [style] : [])
  ];

  return (
    <RNView style={combinedStyles} {...props}>
      {children}
    </RNView>
  );
};

// Text компонент с поддержкой className
export const Text: React.FC<ClassNameTextProps> = ({ className, style, children, ...props }) => {
  const classNameStyles = parseClassName(className || '');
  const combinedStyles = [
    ...classNameStyles,
    ...(Array.isArray(style) ? style : style ? [style] : [])
  ];

  return (
    <RNText style={combinedStyles} {...props}>
      {children}
    </RNText>
  );
};