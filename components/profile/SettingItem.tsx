import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface SettingItemProps {
  title: string;
  description?: string;
  type: 'switch' | 'select' | 'button' | 'info' | 'action' | 'danger' | 'color';
  value?: any;
  options?: Array<{ label: string; value: any; icon?: string; color?: string }>;
  onValueChange?: (value: any) => void;
  onPress?: () => void;
  icon?: string;
  selectedValue?: string;
  accentColor?: string;
  disabled?: boolean;
  loading?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  description,
  type,
  value,
  options,
  onValueChange,
  onPress,
  icon,
  selectedValue,
  accentColor,
  disabled = false,
  loading = false,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const accent = accentColor || theme.primary;
  const isDanger = type === 'danger';

  // Пульсирующая анимация для загрузки
  React.useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [loading]);

  const handlePressIn = () => {
    if (disabled || loading || type === 'info') return;
    
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
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled || loading || type === 'info') return;
    
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
    ]).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;
    
    if (type === 'select') {
      setModalVisible(true);
    } else if (onPress) {
      onPress();
    }
  };

  const handleOptionSelect = (optionValue: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onValueChange) {
      onValueChange(optionValue);
    }
    setModalVisible(false);
  };

  const getIcon = () => {
    if (icon) return icon;
    
    const icons: Record<string, string> = {
      'switch': 'toggle',
      'select': 'chevron-down',
      'button': 'arrow-forward',
      'info': 'information-circle',
      'action': 'arrow-forward',
      'danger': 'alert-circle',
      'color': 'color-palette',
    };
    return icons[type] || 'settings';
  };

  const getIconColor = () => {
    if (disabled) return theme.textSecondary + '80';
    if (isDanger) return theme.error;
    if (accentColor) return accentColor;
    if (type === 'color') return accent;
    return accent;
  };

  const getBackgroundColor = () => {
    if (disabled) return theme.card + '80';
    if (isDanger) return theme.error + '15';
    return theme.card;
  };

  const getBorderColor = () => {
    if (disabled) return theme.border + '80';
    if (isDanger) return theme.error + '30';
    return 'transparent';
  };

  const renderSwitch = () => (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <Switch
        value={value}
        onValueChange={(newValue) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onValueChange?.(newValue);
        }}
        trackColor={{ 
          false: theme.border + '80', 
          true: accent + '80' 
        }}
        thumbColor={value ? accent : '#FFFFFF'}
        ios_backgroundColor={theme.border + '80'}
        disabled={disabled || loading}
        style={styles.switch}
      />
    </Animated.View>
  );

  const renderSelect = () => {
    const selectedOption = options?.find(opt => opt.value === value) || 
                         options?.find(opt => opt.label === selectedValue);
    
    return (
      <Animated.View 
        style={[
          styles.selectContainer,
          { 
            backgroundColor: theme.card,
            borderColor: theme.border,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {selectedOption?.icon && (
          <Ionicons 
            name={selectedOption.icon as any} 
            size={16} 
            color={accent} 
            style={styles.selectIcon}
          />
        )}
        <Text style={[styles.selectValue, { color: theme.textSecondary }]} numberOfLines={1}>
          {selectedOption?.label || selectedValue || t('common.select')}
        </Text>
        <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
      </Animated.View>
    );
  };

  const renderButton = () => (
    <LinearGradient
      colors={isDanger ? ['#EF4444', '#DC2626'] : [accent, accent + 'CC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.actionButton, disabled && styles.actionButtonDisabled]}
    >
      <Ionicons 
        name={getIcon() as any} 
        size={18} 
        color="#FFFFFF" 
      />
      {loading && (
        <Animated.View style={{ opacity: pulseAnim }}>
          <Ionicons name="ellipsis-horizontal" size={18} color="#FFFFFF" />
        </Animated.View>
      )}
    </LinearGradient>
  );

  const renderInfo = () => (
    <View style={styles.infoContainer}>
      <Text style={[styles.infoValue, { color: theme.textSecondary }]} numberOfLines={1}>
        {value}
      </Text>
      {loading && (
        <Animated.View style={[styles.loadingDots, { opacity: pulseAnim }]}>
          <View style={[styles.loadingDot, { backgroundColor: theme.textSecondary }]} />
          <View style={[styles.loadingDot, { backgroundColor: theme.textSecondary }]} />
          <View style={[styles.loadingDot, { backgroundColor: theme.textSecondary }]} />
        </Animated.View>
      )}
    </View>
  );

  const renderColor = () => (
    <View style={[styles.colorPreview, { backgroundColor: value || accent }]} />
  );

  const renderContent = () => {
    switch (type) {
      case 'switch':
        return renderSwitch();
      case 'select':
        return renderSelect();
      case 'button':
      case 'action':
      case 'danger':
        return renderButton();
      case 'info':
        return renderInfo();
      case 'color':
        return renderColor();
      default:
        return null;
    }
  };

  return (
    <>
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
            },
            disabled && styles.containerDisabled,
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          activeOpacity={1}
          disabled={disabled || (type !== 'select' && type !== 'button' && type !== 'action' && type !== 'danger')}
        >
          {/* Декоративный акцент */}
          {!disabled && (isDanger || type === 'color') && (
            <View 
              style={[
                styles.accentBar,
                { 
                  backgroundColor: isDanger ? theme.error : accent,
                  opacity: 0.3,
                },
              ]} 
            />
          )}

          {/* Иконка */}
          <View style={[
            styles.iconContainer,
            isDanger && styles.iconContainerDanger,
            disabled && styles.iconContainerDisabled,
          ]}>
            <Ionicons 
              name={getIcon() as any} 
              size={20} 
              color={getIconColor()} 
            />
          </View>

          {/* Текстовая информация */}
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text 
                style={[
                  styles.title, 
                  { 
                    color: disabled ? theme.textSecondary + '80' : theme.text,
                  },
                  isDanger && styles.titleDanger,
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>
              
              {/* Индикатор загрузки */}
              {loading && (
                <Animated.View style={[styles.loadingIndicator, { opacity: pulseAnim }]}>
                  <View style={[styles.loadingDotSmall, { backgroundColor: accent }]} />
                  <View style={[styles.loadingDotSmall, { backgroundColor: accent }]} />
                  <View style={[styles.loadingDotSmall, { backgroundColor: accent }]} />
                </Animated.View>
              )}
            </View>
            
            {description && (
              <Text 
                style={[
                  styles.description, 
                  { 
                    color: disabled ? theme.textSecondary + '60' : theme.textSecondary,
                  },
                ]}
                numberOfLines={2}
              >
                {description}
              </Text>
            )}
          </View>

          {/* Правая часть (контент) */}
          {renderContent()}
        </TouchableOpacity>
      </Animated.View>

      {/* Модальное окно для выбора */}
      {type === 'select' && options && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
              <View style={[styles.modalHeader, { backgroundColor: theme.card }]}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  {title}
                </Text>
                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color={theme.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalOptions}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionItem,
                      { 
                        backgroundColor: theme.card,
                        borderBottomColor: theme.border,
                      },
                      index === options.length - 1 && styles.optionItemLast,
                    ]}
                    onPress={() => handleOptionSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionContent}>
                      {option.icon && (
                        <Ionicons 
                          name={option.icon as any} 
                          size={20} 
                          color={option.color || accent} 
                          style={styles.optionIcon}
                        />
                      )}
                      <Text style={[styles.optionLabel, { color: theme.text }]}>
                        {option.label}
                      </Text>
                    </View>
                    
                    {option.value === value && (
                      <Ionicons name="checkmark" size={20} color={accent} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </>
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
    elevation: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    position: 'relative',
    minHeight: 76,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconContainerDanger: {
    backgroundColor: 'rgba(239,68,68,0.1)',
  },
  iconContainerDisabled: {
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
    flex: 1,
  },
  titleDanger: {
    color: '#EF4444',
  },
  description: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.2,
    lineHeight: 18,
  },
  switch: {
    transform: Platform.OS === 'ios' ? [{ scale: 0.9 }] : [{ scale: 1 }],
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    minWidth: 120,
  },
  selectIcon: {
    marginRight: 8,
  },
  selectValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  colorPreview: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  loadingDotSmall: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalOptions: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  optionItemLast: {
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});

export default SettingItem;