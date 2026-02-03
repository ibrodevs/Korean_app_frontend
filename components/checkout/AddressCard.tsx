import React from 'react';
import {
  View,
  
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ShippingAddress } from '../../types/order';

interface AddressCardProps {
  address: ShippingAddress;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const tailwind = useTailwind();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const getLabelIcon = () => {
    switch (address.label) {
      case 'home':
        return 'home-outline';
      case 'work':
        return 'business-outline';
      default:
        return 'location-outline';
    }
  };

  const getLabelColor = () => {
    switch (address.label) {
      case 'home':
        return '#059669';
      case 'work':
        return '#1774F3';
      default:
        return '#64748B';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: selected ? theme.primary + '20' : theme.card,
          borderColor: selected ? theme.primary : theme.border,
        },
      ]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      {/* Заголовок и метка */}
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          <Ionicons
            name={getLabelIcon() as any}
            size={16}
            color={getLabelColor()}
          />
          <Text style={[styles.label, { color: getLabelColor() }]}>
            {address.label === 'home' ? t('address.home') :
             address.label === 'work' ? t('address.work') : t('address.other')}
          </Text>
          {address.isDefault && (
            <View style={[styles.defaultBadge, { backgroundColor: theme.secondary }]}>
              <Text style={[styles.defaultText, { color: theme.heading }]}>
                {t('address.default')}
              </Text>
            </View>
          )}
        </View>

        {/* Кнопки действий */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onEdit}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="create-outline" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color={theme.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Информация об адресе */}
      <View style={styles.addressInfo}>
        <Text style={[styles.name, { color: theme.heading }]}>
          {address.fullName}
        </Text>
        <Text style={[styles.phone, { color: theme.text }]}>
          {address.phoneNumber}
        </Text>
        <Text style={[styles.address, { color: theme.text }]}>
          {address.address}
          {address.apartment && `, ${address.apartment}`}
        </Text>
        <Text style={[styles.city, { color: theme.text }]}>
          {address.city}, {address.state} {address.zipCode}
        </Text>
        <Text style={[styles.country, { color: theme.textSecondary }]}>
          {address.country}
        </Text>
      </View>

      {/* Выбранный маркер */}
      {selected && (
        <View style={[styles.selectedMarker, { backgroundColor: theme.primary }]}>
          <Ionicons name="checkmark" size={16} color={theme.heading} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 8,
  },
  defaultBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 4,
  },
  addressInfo: {
    marginLeft: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  city: {
    fontSize: 14,
    marginBottom: 2,
  },
  country: {
    fontSize: 14,
  },
  selectedMarker: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddressCard;