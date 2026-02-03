import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  badge?: number;
  showChevron?: boolean;
  danger?: boolean;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  badge,
  showChevron = true,
  danger = false,
  onPress,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const getIconColor = () => {
    if (danger) return theme.error;
    return theme.text;
  };

  const getTitleColor = () => {
    if (danger) return theme.error;
    return theme.text;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={22} color={getIconColor()} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: getTitleColor() }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.rightContent}>
          {badge !== undefined && badge > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.error }]}>
              <Text style={styles.badgeText}>
                {badge > 99 ? '99+' : badge}
              </Text>
            </View>
          )}
          
          {showChevron && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textSecondary}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
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
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default MenuItem;