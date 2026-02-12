import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTailwind } from '../../utils/tailwindUtilities';
import Text from '../Text';

interface PickupLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  workingHours: {
    weekdays: string;
    weekends: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: string;
}

interface PickupInfoProps {
  location: PickupLocation;
  onNavigate: (location: PickupLocation) => void;
  onCall: (phone: string) => void;
}

const PickupInfo: React.FC<PickupInfoProps> = ({ 
  location, 
  onNavigate, 
  onCall 
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleCall = () => {
    Alert.alert(
      t('common.call'),
      location.phone,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.call'), 
          onPress: () => onCall(location.phone),
          style: 'default'
        },
      ]
    );
  };

  const handleNavigate = () => {
    Alert.alert(
      t('tracking.navigate'),
      location.address,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('tracking.openMaps'), 
          onPress: () => onNavigate(location),
          style: 'default'
        },
      ]
    );
  };

  const getCurrentDay = () => {
    const today = new Date().getDay();
    return today === 0 || today === 6 ? 'weekends' : 'weekdays';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="storefront-outline" size={24} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>
            {t('tracking.pickupLocation')}
          </Text>
        </View>
        {location.distance && (
          <Text style={[styles.distance, { color: theme.textSecondary }]}>
            {location.distance}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.locationName, { color: theme.text }]}>
          {location.name}
        </Text>
        
        <View style={styles.addressContainer}>
          <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.address, { color: theme.textSecondary }]}>
            {location.address}
          </Text>
        </View>

        <View style={styles.hoursContainer}>
          <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
          <View style={styles.hoursInfo}>
            <Text style={[styles.hoursLabel, { color: theme.textSecondary }]}>
              {t('tracking.workingHours')}:
            </Text>
            <Text style={[styles.hoursText, { color: theme.text }]}>
              {location.workingHours[getCurrentDay()]}
            </Text>
          </View>
        </View>

        <View style={styles.phoneContainer}>
          <Ionicons name="call-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.phone, { color: theme.textSecondary }]}>
            {location.phone}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.navigationButton, { backgroundColor: theme.primary }]}
          onPress={handleNavigate}
          activeOpacity={0.7}
        >
          <Ionicons name="navigate" size={20} color="#FFFFFF" />
          <Text style={styles.navigationButtonText}>
            {t('tracking.navigate')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.callButton, { borderColor: theme.border }]}
          onPress={handleCall}
          activeOpacity={0.7}
        >
          <Ionicons name="call" size={20} color={theme.primary} />
          <Text style={[styles.callButtonText, { color: theme.primary }]}>
            {t('common.call')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  distance: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    marginBottom: 20,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hoursInfo: {
    marginLeft: 8,
    flex: 1,
  },
  hoursLabel: {
    fontSize: 14,
  },
  hoursText: {
    fontSize: 14,
    fontWeight: '500',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phone: {
    fontSize: 14,
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  navigationButton: {
    backgroundColor: '#007AFF',
  },
  navigationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  callButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PickupInfo;