import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Platform,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import { BorderRadius } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import Text from './Text';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  gradient?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  gradient = variant === 'primary',
  style,
  textStyle,
  children,
}: ButtonProps) {
  const { theme, isDark } = useTheme();
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;
    onPress();
  };

  const getButtonColors = () => {
    const colorsMap = {
      primary: {
        background: theme.primary,
        text: '#FFFFFF',
        border: theme.primary,
        gradient: [theme.primary, theme.primaryHover],
        shadow: theme.primary,
      },
      secondary: {
        background: theme.card,
        text: theme.text,
        border: theme.border,
        gradient: [theme.card, theme.cardHover || theme.card],
        shadow: theme.shadow,
      },
      outline: {
        background: 'transparent',
        text: theme.primary,
        border: theme.primary,
        gradient: [theme.primary, theme.primary],
        shadow: theme.primary,
      },
      ghost: {
        background: 'transparent',
        text: theme.text,
        border: 'transparent',
        gradient: ['transparent', 'transparent'],
        shadow: 'transparent',
      },
      danger: {
        background: theme.error,
        text: '#FFFFFF',
        border: theme.error,
        gradient: [theme.error, theme.error + 'DD'],
        shadow: theme.error,
      },
      success: {
        background: theme.success,
        text: '#FFFFFF',
        border: theme.success,
        gradient: [theme.success, theme.success + 'DD'],
        shadow: theme.success,
      },
    };

    return colorsMap[variant];
  };

  const getSizeStyles = (): ViewStyle => {
    const styles: ViewStyle = {
      minHeight: 40,
      paddingVertical: 12,
      paddingHorizontal: 24,
    };

    switch (size) {
      case 'small':
        styles.minHeight = 36;
        styles.paddingVertical = 8;
        styles.paddingHorizontal = 16;
        styles.borderRadius = BorderRadius.md;
        break;
      case 'large':
        styles.minHeight = 52;
        styles.paddingVertical = 16;
        styles.paddingHorizontal = 32;
        styles.borderRadius = BorderRadius.xl;
        break;
      case 'xlarge':
        styles.minHeight = 60;
        styles.paddingVertical = 20;
        styles.paddingHorizontal = 40;
        styles.borderRadius = BorderRadius.xl;
        break;
      default:
        styles.minHeight = 48;
        styles.paddingVertical = 14;
        styles.paddingHorizontal = 24;
        styles.borderRadius = BorderRadius.lg;
    }

    if (fullWidth) {
      styles.width = '100%';
    }

    return styles;
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      case 'xlarge':
        return 20;
      default:
        return 16;
    }
  };

  const getShadowStyles = () => {
    const shadowColor = getButtonColors().shadow;
    const shadowOpacity = shadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.5],
    });

    return {
      shadowColor,
      shadowOffset: {
        width: 0,
        height: shadowAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [4, 8],
        }),
      },
      shadowOpacity,
      shadowRadius: shadowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [12, 20],
      }),
      elevation: shadowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [8, 16],
      }),
    };
  };

  const buttonColors = getButtonColors();
  const sizeStyles = getSizeStyles();
  const textSize = getTextSize();
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  const renderButtonContent = () => {
    const content = (
      <>
        {loading && (
          <ActivityIndicator
            size={textSize - 4}
            color={isOutline || isGhost ? buttonColors.text : buttonColors.text}
            style={{ marginRight: 8 }}
          />
        )}
        
        {!loading && leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <Text
          style={[
            styles.text,
            {
              color: buttonColors.text,
              fontSize: textSize,
              fontWeight: '700',
              letterSpacing: -0.3,
              opacity: loading ? 0 : 1,
            },
            textStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        
        {!loading && rightIcon && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
        
        {children}
      </>
    );

    // Для градиентных кнопок оборачиваем в LinearGradient
    if (gradient && !isOutline && !isGhost && !disabled && !loading) {
      return (
        <LinearGradient
          colors={buttonColors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      );
    }

    return content;
  };

  return (
    <Animated.View
      style={[
        getShadowStyles(),
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[
          styles.container,
          sizeStyles,
          {
            backgroundColor: buttonColors.background,
            borderWidth: isOutline ? 2 : 0,
            borderColor: buttonColors.border,
          },
          (disabled || loading) && styles.disabled,
          variant === 'ghost' && styles.ghost,
          style,
        ]}
      >
        {renderButtonContent()}
        
        {/* Эффект нажатия для iOS */}
        {Platform.OS === 'ios' && !disabled && !loading && !isGhost && (
          <View style={styles.touchFeedback} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  iconContainer: {
    marginHorizontal: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  touchFeedback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    opacity: 0,
  },
});