import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Text from '../Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapViewProps {
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  destinationLocation: {
    latitude: number;
    longitude: number;
  };
  route?: {
    latitude: number;
    longitude: number;
  }[];
  deliveryPersonLocation?: {
    latitude: number;
    longitude: number;
  };
  onLocationPress?: () => void;
}

const MapViewComponent: React.FC<MapViewProps> = ({
  currentLocation,
  destinationLocation,
  route,
  deliveryPersonLocation,
  onLocationPress,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Заглушка карты для веб-платформы или когда react-native-maps недоступен
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={[styles.mapPlaceholder, { backgroundColor: theme.card }]}>
          <Ionicons name="map-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.placeholderTitle, { color: theme.heading }]}>
            {t('tracking.mapNotAvailable')}
          </Text>
          <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
            {t('tracking.mapNotAvailableDescription')}
          </Text>
          
          {/* Информация о местоположениях */}
          <View style={styles.locationInfo}>
            <View style={[styles.locationItem, { borderBottomColor: theme.border }]}>
              <Ionicons name="location" size={20} color={theme.primary} />
              <View style={styles.locationDetails}>
                <Text style={[styles.locationTitle, { color: theme.heading }]}>
                  {t('tracking.currentLocation')}
                </Text>
                <Text style={[styles.locationCoords, { color: theme.textSecondary }]}>
                  {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
            
            <View style={[styles.locationItem, { borderBottomColor: theme.border }]}>
              <Ionicons name="flag" size={20} color={theme.error} />
              <View style={styles.locationDetails}>
                <Text style={[styles.locationTitle, { color: theme.heading }]}>
                  {t('tracking.destination')}
                </Text>
                <Text style={[styles.locationCoords, { color: theme.textSecondary }]}>
                  {destinationLocation.latitude.toFixed(6)}, {destinationLocation.longitude.toFixed(6)}
                </Text>
              </View>
            </View>

            {deliveryPersonLocation && (
              <View style={styles.locationItem}>
                <Ionicons name="person" size={20} color={theme.secondary} />
                <View style={styles.locationDetails}>
                  <Text style={[styles.locationTitle, { color: theme.heading }]}>
                    {t('tracking.deliveryPerson')}
                  </Text>
                  <Text style={[styles.locationCoords, { color: theme.textSecondary }]}>
                    {deliveryPersonLocation.latitude.toFixed(6)}, {deliveryPersonLocation.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Кнопки управления */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.card }]}
            onPress={onLocationPress}
          >
            <Ionicons name="navigate" size={20} color={theme.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.card }]}
            onPress={() => {/* Zoom in logic */}}
          >
            <Ionicons name="add" size={20} color={theme.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.card }]}
            onPress={() => {/* Zoom out logic */}}
          >
            <Ionicons name="remove" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Для мобильных платформ также показываем заглушку пока не установим react-native-maps
  return (
    <View style={styles.container}>
      <View style={[styles.mapPlaceholder, { backgroundColor: theme.card }]}>
        <Ionicons name="construct-outline" size={64} color={theme.textSecondary} />
        <Text style={[styles.placeholderTitle, { color: theme.heading }]}>
          {t('tracking.mapNotReady')}
        </Text>
        <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
          {t('tracking.mapNotReadyDescription')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    margin: 16,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  locationInfo: {
    width: '100%',
    maxWidth: 300,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  locationDetails: {
    marginLeft: 12,
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: 16,
    gap: 8,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default MapViewComponent;