import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

interface SettingsHeaderProps {
  onBack: () => void;
  onReset?: () => void;
  onSave?: () => void;
  showSaveButton?: boolean;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onBack,
  onReset,
  onSave,
  showSaveButton = false,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.navBackground }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.heading} />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.heading }]}>
            {t('settings.title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t('settings.subtitle')}
          </Text>
        </View>
        
        <View style={styles.rightButtons}>
          {onReset && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={onReset}
            >
              <Text style={[styles.resetText, { color: theme.error }]}>
                {t('settings.reset')}
              </Text>
            </TouchableOpacity>
          )}
          
          {showSaveButton && onSave && (
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.primary }]}
              onPress={onSave}
            >
              <Text style={[styles.saveText, { color: theme.heading }]}>
                {t('settings.save')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SettingsHeader;