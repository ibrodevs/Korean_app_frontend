import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

interface SettingItemProps {
  title: string;
  description?: string;
  type: 'switch' | 'select' | 'button' | 'info' | 'action';
  value?: any;
  options?: Array<{ label: string; value: any }>;
  onValueChange?: (value: any) => void;
  onPress?: () => void;
  icon?: string;
  selectedValue?: string;
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
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const renderContent = () => {
    switch (type) {
      case 'switch':
        return (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#FFF"
            ios_backgroundColor={theme.border}
          />
        );

      case 'select':
        return (
          <TouchableOpacity
            style={styles.selectContainer}
            onPress={onPress}
          >
            <Text style={[styles.selectValue, { color: theme.textSecondary }]}>
              {selectedValue || t('common.select')}
            </Text>
            <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        );

      case 'button':
        return (
          <TouchableOpacity onPress={onPress}>
            <Ionicons 
              name={(icon as any) || 'arrow-forward'} 
              size={20} 
              color={theme.primary} 
            />
          </TouchableOpacity>
        );

      case 'info':
        return (
          <Text style={[styles.infoValue, { color: theme.textSecondary }]}>
            {value}
          </Text>
        );

      case 'action':
        return (
          <TouchableOpacity onPress={onPress}>
            <Ionicons 
              name={(icon as any) || 'arrow-forward'} 
              size={20} 
              color={theme.primary} 
            />
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <TouchableOpacity
        style={styles.content}
        onPress={type === 'select' || type === 'button' ? onPress : undefined}
        disabled={type === 'switch' || type === 'info'}
        activeOpacity={0.7}
      >
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]}>
            {title}
          </Text>
          {description && (
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {description}
            </Text>
          )}
        </View>

        {renderContent()}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  selectValue: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SettingItem;