import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import Text from '../Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OrderTracking, Carrier, OrderItem } from '../../types/tracking';

interface DeliveryInfoProps {
  tracking: OrderTracking;
  onTrackCarrier: (carrier: Carrier) => void;
  onContactDriver: () => void;
  onViewMap: () => void;
}

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({
  tracking,
  onTrackCarrier,
  onContactDriver,
  onViewMap,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleCallCarrier = () => {
    Linking.openURL(`tel:${tracking.carrier.phone}`);
  };

  const handleOpenCarrierWebsite = () => {
    Linking.openURL(tracking.carrier.website);
  };

  const getDeliveryWindowText = () => {
    if (!tracking.deliveryWindow) return null;
    
    const windowTypes = {
      morning: t('delivery.morning'),
      afternoon: t('delivery.afternoon'),
      evening: t('delivery.evening'),
    };
    
    return windowTypes[tracking.deliveryWindow.type];
  };

  return (
    <View style={styles.container}>
      {/* Информация о перевозчике */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.heading }]}>
          {t('tracking.carrier')}
        </Text>
        
        <View style={styles.carrierInfo}>
          <View style={styles.carrierHeader}>
            <View style={[styles.carrierLogo, { backgroundColor: theme.background }]}>
              <Text style={[styles.carrierInitials, { color: theme.primary }]}>
                {tracking.carrier.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.carrierDetails}>
              <Text style={[styles.carrierName, { color: theme.text }]}>
                {tracking.carrier.name}
              </Text>
              <Text style={[styles.trackingNumber, { color: theme.textSecondary }]}>
                {t('tracking.trackingNumber')}: {tracking.trackingNumber}
              </Text>
            </View>
          </View>

          <View style={styles.carrierActions}>
            <TouchableOpacity
              style={[styles.carrierButton, { borderColor: theme.primary }]}
              onPress={() => onTrackCarrier(tracking.carrier)}
            >
              <Ionicons name="open-outline" size={16} color={theme.primary} />
              <Text style={[styles.carrierButtonText, { color: theme.primary }]}>
                {t('tracking.trackShipment')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.carrierButton, { borderColor: theme.border }]}
              onPress={handleCallCarrier}
            >
              <Ionicons name="call-outline" size={16} color={theme.text} />
              <Text style={[styles.carrierButtonText, { color: theme.text }]}>
                {t('delivery.contactDriver')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Информация о доставке */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.heading }]}>
          {t('delivery.deliveryWindow')}
        </Text>

        <View style={styles.deliveryDetails}>
          {tracking.deliveryWindow && (
            <View style={styles.deliveryWindow}>
              <Ionicons name="time-outline" size={20} color={theme.primary} />
              <View style={styles.windowInfo}>
                <Text style={[styles.windowTitle, { color: theme.text }]}>
                  {getDeliveryWindowText()}
                </Text>
                <Text style={[styles.windowTime, { color: theme.textSecondary }]}>
                  {tracking.deliveryWindow.start} - {tracking.deliveryWindow.end}
                </Text>
              </View>
            </View>
          )}

          {tracking.currentLocation && (
            <TouchableOpacity
              style={styles.locationContainer}
              onPress={onViewMap}
            >
              <Ionicons name="navigate-outline" size={20} color={theme.secondary} />
              <View style={styles.locationInfo}>
                <Text style={[styles.locationTitle, { color: theme.text }]}>
                  {t('delivery.liveTracking')}
                </Text>
                <Text style={[styles.locationAddress, { color: theme.textSecondary }]}>
                  {tracking.currentLocation.address}
                </Text>
                <Text style={[styles.locationTime, { color: theme.textSecondary }]}>
                  {new Date(tracking.currentLocation.timestamp).toLocaleTimeString()}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}

          {tracking.driver && (
            <View style={styles.driverInfo}>
              <Ionicons name="person-outline" size={20} color={theme.primary} />
              <View style={styles.driverDetails}>
                <Text style={[styles.driverName, { color: theme.text }]}>
                  {tracking.driver.name}
                </Text>
                <Text style={[styles.driverPhone, { color: theme.textSecondary }]}>
                  {tracking.driver.phone}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.contactButton, { backgroundColor: theme.primary }]}
                onPress={onContactDriver}
              >
                <Ionicons name="chatbubble" size={16} color={theme.heading} />
              </TouchableOpacity>
            </View>
          )}

          {tracking.deliveryNotes && (
            <View style={styles.notesContainer}>
              <Ionicons name="document-text-outline" size={20} color={theme.textSecondary} />
              <Text style={[styles.notesText, { color: theme.textSecondary }]}>
                {tracking.deliveryNotes}
              </Text>
            </View>
          )}

          {tracking.signatureRequired && (
            <View style={styles.signatureContainer}>
              <Ionicons name="create-outline" size={20} color={theme.error} />
              <Text style={[styles.signatureText, { color: theme.error }]}>
                {t('delivery.signatureRequired')}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Список товаров */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.heading }]}>
          {t('tracking.packageInfo')} ({tracking.items.length})
        </Text>

        <View style={styles.itemsContainer}>
          {tracking.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={[styles.itemImage, { backgroundColor: theme.border }]}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.image} />
                ) : (
                  <Ionicons name="cube-outline" size={24} color={theme.textSecondary} />
                )}
              </View>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={[styles.itemQuantity, { color: theme.textSecondary }]}>
                  x{item.quantity}
                </Text>
              </View>
              {item.tracking && (
                <TouchableOpacity
                  style={[styles.itemTrackButton, { borderColor: theme.border }]}
                  onPress={() => onTrackCarrier(tracking.carrier)}
                >
                  <Text style={[styles.trackButtonText, { color: theme.primary }]}>
                    {t('tracking.trackShipment')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 20,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  carrierInfo: {
    gap: 16,
  },
  carrierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carrierLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  carrierInitials: {
    fontSize: 24,
    fontWeight: '800',
  },
  carrierDetails: {
    flex: 1,
  },
  carrierName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  trackingNumber: {
    fontSize: 14,
  },
  carrierActions: {
    flexDirection: 'row',
    gap: 12,
  },
  carrierButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  carrierButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  deliveryDetails: {
    gap: 16,
  },
  deliveryWindow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  windowInfo: {
    flex: 1,
  },
  windowTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  windowTime: {
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    marginBottom: 2,
  },
  locationTime: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  driverPhone: {
    fontSize: 14,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  notesText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  signatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(247, 108, 108, 0.1)',
  },
  signatureText: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemsContainer: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
  },
  itemTrackButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  trackButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DeliveryInfo;