import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import SettingItem from '../profile/SettingItem';
import { SettingItem as SettingItemType } from '../../types/settings';

interface SettingsSectionProps {
  title: string;
  items: SettingItemType[];
  onItemChange?: (id: string, value: any) => void;
  onItemPress?: (id: string) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  items,
  onItemChange,
  onItemPress,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleValueChange = (id: string, value: any) => {
    onItemChange?.(id, value);
  };

  const handlePress = (id: string) => {
    onItemPress?.(id);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.heading }]}>
        {title}
      </Text>
      
      <View style={styles.sectionContent}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemWrapper}>
            <SettingItem
              title={item.title}
              description={item.description}
              type={item.type}
              value={item.value}
              options={item.options}
              icon={item.icon}
              selectedValue={item.options?.find(opt => opt.value === item.value)?.label}
              onValueChange={(value) => handleValueChange(item.id, value)}
              onPress={() => handlePress(item.id)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 20,
    marginBottom: 12,
  },
  sectionContent: {
    paddingHorizontal: 20,
  },
  itemWrapper: {
    marginBottom: 8,
  },
});

export default SettingsSection;