import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import Text from './Text';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  success?: boolean;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  required?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
}

export default function Input({
  label,
  error,
  success,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  secureTextEntry,
  onFocus,
  onBlur,
  value,
  placeholder,
  required,
  variant = 'default',
  size = 'medium',
  ...props
}: InputProps) {
  const { colors, isDark } = useTheme();
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const sizes = {
    small: {
      height: 40,
      paddingHorizontal: Spacing.md,
      fontSize: 14,
      iconSize: 16,
    },
    medium: {
      height: 48,
      paddingHorizontal: Spacing.md,
      fontSize: 16,
      iconSize: 20,
    },
    large: {
      height: 56,
      paddingHorizontal: Spacing.lg,
      fontSize: 18,
      iconSize: 22,
    },
  };

  const variants = {
    default: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : colors.card,
      borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
      borderWidth: 1.5,
      shadow: isFocused ? {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
      } : {},
    },
    filled: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.02)',
      borderColor: 'transparent',
      borderWidth: 0,
      borderBottomWidth: 2,
      borderBottomColor: error ? colors.error : isFocused ? colors.primary : colors.border,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
      borderWidth: 2,
    },
  };

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value || isDirty ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, isDirty]);

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    setIsDirty(true);
    onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleRightIconPress = () => {
    if (secureTextEntry) {
      setIsSecure(!isSecure);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const getRightIcon = () => {
    if (secureTextEntry) {
      return isSecure ? 'eye-off-outline' : 'eye-outline';
    }
    if (error) {
      return 'alert-circle-outline';
    }
    if (success) {
      return 'checkmark-circle-outline';
    }
    return rightIcon;
  };

  const getIconColor = () => {
    if (error) return colors.error;
    if (success) return colors.success;
    if (isFocused) return colors.primary;
    return colors.textSecondary;
  };

  const borderWidth = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const styles = StyleSheet.create({
    container: {
      marginBottom: Spacing.md,
      position: 'relative',
    },
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    label: {
      ...Typography.body,
      color: colors.text,
      fontWeight: '500',
      fontSize: 14,
    },
    required: {
      color: colors.error,
      fontSize: 12,
      marginLeft: 2,
    },
    inputWrapper: {
      position: 'relative',
      borderRadius: BorderRadius.md,
      ...variants[variant],
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: sizes[size].height,
      paddingHorizontal: sizes[size].paddingHorizontal,
    },
    input: {
      flex: 1,
      ...Typography.body,
      color: colors.text,
      fontSize: sizes[size].fontSize,
      paddingVertical: Platform.OS === 'ios' ? Spacing.sm : 0,
      paddingHorizontal: 0,
      includeFontPadding: false,
    },
    animatedBorder: {
      position: 'absolute',
      bottom: variant === 'filled' ? -2 : 0,
      left: 0,
      right: 0,
      height: borderWidth,
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
    },
    icon: {
      marginHorizontal: Spacing.xs,
    },
    leftIcon: {
      marginRight: Spacing.sm,
    },
    rightIcon: {
      marginLeft: Spacing.sm,
    },
    hint: {
      ...Typography.caption,
      color: colors.textSecondary,
      marginTop: Spacing.xs,
      fontSize: 12,
    },
    error: {
      ...Typography.caption,
      color: colors.error,
      marginTop: Spacing.xs,
      fontSize: 12,
    },
    successText: {
      ...Typography.caption,
      color: colors.success,
      marginTop: Spacing.xs,
      fontSize: 12,
    },
    counter: {
      ...Typography.caption,
      color: colors.textSecondary,
      fontSize: 11,
      alignSelf: 'flex-end',
      marginTop: Spacing.xs,
    },
  });

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [sizes[size].height / 2 - 8, -8],
  });

  const labelFontSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [sizes[size].fontSize, 12],
  });

  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textSecondary, error ? colors.error : colors.primary],
  });

  const placeholderColor = isFocused ? colors.primary : colors.textSecondary;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Анимированный лейбл */}
      {(label || placeholder) && (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              top: labelTop,
              left: sizes[size].paddingHorizontal + (leftIcon ? sizes[size].iconSize + Spacing.sm : 0),
              zIndex: 1,
              pointerEvents: 'none',
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.label,
              {
                fontSize: labelFontSize,
                color: labelColor,
                backgroundColor: variants[variant].backgroundColor,
                paddingHorizontal: 4,
              },
            ]}
            numberOfLines={1}
          >
            {label || placeholder}
            {required && <Text style={styles.required}> *</Text>}
          </Animated.Text>
        </Animated.View>
      )}

      {/* Контейнер инпута */}
      <View style={styles.inputWrapper}>
        <Animated.View style={[styles.animatedBorder]} />
        
        <View style={styles.inputContainer}>
          {/* Левая иконка */}
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={sizes[size].iconSize}
              color={getIconColor()}
              style={[styles.icon, styles.leftIcon]}
            />
          )}

          {/* Текстовое поле */}
          <TextInput
            ref={inputRef}
            style={[styles.input, style]}
            placeholderTextColor={placeholderColor}
            secureTextEntry={isSecure}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            placeholder={isFocused || !label ? placeholder : ''}
            {...props}
          />

          {/* Правая иконка */}
          {(getRightIcon() || secureTextEntry || error || success) && (
            <TouchableOpacity onPress={handleRightIconPress} activeOpacity={0.7}>
              <Ionicons
                name={getRightIcon() as keyof typeof Ionicons.glyphMap}
                size={sizes[size].iconSize}
                color={getIconColor()}
                style={[styles.icon, styles.rightIcon]}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Счетчик символов (если есть maxLength) */}
      {props.maxLength && value && (
        <Text style={styles.counter}>
          {value.length}/{props.maxLength}
        </Text>
      )}

      {/* Сообщение об ошибке или успехе */}
      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xs }}>
          <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
          <Text style={styles.error}> {error}</Text>
        </View>
      ) : success ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xs }}>
          <Ionicons name="checkmark-circle-outline" size={14} color={colors.success} />
          <Text style={styles.successText}> {hint || 'Valid'}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}