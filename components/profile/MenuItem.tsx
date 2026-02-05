import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  badge?: number | string;
  showChevron?: boolean;
  danger?: boolean;
  disabled?: boolean;
  gradient?: boolean;
  highlight?: boolean;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  badge,
  showChevron = true,
  danger = false,
  disabled = false,
  gradient = false,
  highlight = false,
  onPress,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (disabled) return;
    onPress();
  };

  const getIconColor = () => {
    if (disabled) return theme.textSecondary + '80';
    if (danger) return theme.error;
    if (highlight) return theme.primary;
    return theme.text;
  };

  const getTitleColor = () => {
    if (disabled) return theme.textSecondary + '80';
    if (danger) return theme.error;
    if (highlight) return theme.primary;
    return theme.text;
  };

  const getBackgroundColor = () => {
    if (disabled) return theme.card + '80';
    if (gradient) return 'transparent';
    if (highlight) return theme.primary + '15';
    return theme.card;
  };

  const getBorderColor = () => {
    if (disabled) return theme.border + '80';
    if (highlight) return theme.primary + '30';
    if (danger) return theme.error + '30';
    return 'transparent';
  };

  const getGradientColors = () => {
    if (danger) return [theme.error, '#FCA5A5'];
    if (highlight) return [theme.primary, theme.secondary];
    return [theme.primary, theme.secondary];
  };

  return (
    <Animated.View
      style={[
        styles.containerWrapper,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.container,
          { 
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            opacity: disabled ? 0.6 : 1,
          },
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={1}
        disabled={disabled}
      >
        {/* Градиентный фон (если включен) */}
        {gradient && !disabled && (
          <Animated.View 
            style={[
              styles.gradientOverlay,
              {
                backgroundColor: getBackgroundColor(),
              },
            ]} 
          />
        )}

        {/* Декоративный акцент */}
        {highlight && !disabled && (
          <View 
            style={[
              styles.highlightAccent,
              { backgroundColor: theme.primary }
            ]} 
          />
        )}

        {/* Контент */}
        <View style={styles.content}>
          {/* Иконка */}
          <View style={[
            styles.iconContainer,
            danger && styles.iconContainerDanger,
            highlight && styles.iconContainerHighlight,
            disabled && styles.iconContainerDisabled,
          ]}>
            <Ionicons 
              name={icon as any} 
              size={20} 
              color={getIconColor()} 
            />
          </View>
          
          {/* Текст */}
          <View style={styles.textContainer}>
            <Text 
              style={[
                styles.title, 
                { color: getTitleColor() },
                disabled && styles.titleDisabled,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            
            {subtitle && (
              <Text 
                style={[
                  styles.subtitle, 
                  { color: theme.textSecondary },
                  disabled && styles.subtitleDisabled,
                ]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>

          {/* Правая часть (бейдж и шеврон) */}
          <View style={styles.rightContent}>
            {/* Бейдж */}
            {badge !== undefined && (
              <View style={[
                styles.badge,
                danger && styles.badgeDanger,
                highlight && styles.badgeHighlight,
                typeof badge === 'string' && styles.badgeString,
              ]}>
                <Text style={[
                  styles.badgeText,
                  (danger || highlight) && styles.badgeTextLight,
                ]}>
                  {typeof badge === 'string' 
                    ? badge 
                    : badge > 99 ? '99+' : badge
                  }
                </Text>
              </View>
            )}
            
            {/* Шеврон */}
            {showChevron && !disabled && (
              <View style={styles.chevronContainer}>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.textSecondary}
                />
              </View>
            )}
            
            {/* Индикатор для disabled */}
            {disabled && (
              <Text style={[styles.disabledText, { color: theme.textSecondary }]}>
                Soon
              </Text>
            )}
          </View>
        </View>

        {/* Индикатор нажатия (для iOS) */}
        {Platform.OS === 'ios' && !disabled && (
          <View style={styles.touchFeedback} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  container: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  highlightAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconContainerDanger: {
    backgroundColor: 'rgba(239,68,68,0.1)',
  },
  iconContainerHighlight: {
    backgroundColor: 'rgba(59,130,246,0.1)',
  },
  iconContainerDisabled: {
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  titleDisabled: {
    opacity: 0.6,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.2,
  },
  subtitleDisabled: {
    opacity: 0.5,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeDanger: {
    backgroundColor: '#EF4444',
  },
  badgeHighlight: {
    backgroundColor: '#3B82F6',
  },
  badgeString: {
    paddingHorizontal: 10,
  },
  badgeText: {
    color: '#374151',
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextLight: {
    color: '#FFFFFF',
  },
  chevronContainer: {
    opacity: 0.7,
  },
  disabledText: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 6,
  },
  touchFeedback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.02)',
    opacity: 0,
  },
});

export default MenuItem;