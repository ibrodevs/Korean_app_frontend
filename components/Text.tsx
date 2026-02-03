import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

// Расширяем TextProps для поддержки всех стандартных свойств
export interface CustomTextProps extends RNTextProps {
  children?: React.ReactNode;
}

// Создаем обертку над Text для корректной работы в веб-среде
const Text: React.FC<CustomTextProps> = ({ style, ...props }) => {
  const { theme } = useTheme();
  
  // Объединяем стили темы с переданными стилями
  const mergedStyle = [
    { color: theme.text }, // Цвет по умолчанию из темы
    style, // Пользовательские стили имеют приоритет
  ];

  return React.createElement(RNText, { ...props, style: mergedStyle }, props.children);
};

Text.displayName = 'Text';

export default Text;