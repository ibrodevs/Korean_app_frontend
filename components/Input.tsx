import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import Text from './Text';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  secureTextEntry,
  ...props
}: InputProps) {
  const { colors } = useTheme();
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const styles = StyleSheet.create({
    container: {
      marginBottom: Spacing.md,
    },
    label: {
      ...Typography.body,
      color: colors.text,
      marginBottom: Spacing.xs,
      fontWeight: '500',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: error ? colors.error : colors.border,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.card,
      paddingHorizontal: Spacing.md,
      minHeight: 48,
    },
    input: {
      flex: 1,
      ...Typography.body,
      color: colors.text,
      paddingVertical: Spacing.sm,
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
    error: {
      ...Typography.caption,
      color: colors.error,
      marginTop: Spacing.xs,
    },
  });

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
    return rightIcon;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={colors.textSecondary}
            style={[styles.icon, styles.leftIcon]}
          />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isSecure}
          {...props}
        />
        {(rightIcon || secureTextEntry) && (
          <Ionicons
            name={getRightIcon() as keyof typeof Ionicons.glyphMap}
            size={20}
            color={colors.textSecondary}
            style={[styles.icon, styles.rightIcon]}
            onPress={handleRightIconPress}
          />
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}