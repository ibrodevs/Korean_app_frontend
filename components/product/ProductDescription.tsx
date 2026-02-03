import React, { useState } from 'react';
import {
  View,
  
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ProductDetail } from '../../types/product';

interface ProductDescriptionProps {
  product: ProductDetail;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const descriptionLines = showFullDescription 
    ? product.description
    : `${product.description.substring(0, 150)}...`;

  const renderDescription = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.heading }]}>
        {t('product.description')}
      </Text>
      <Text style={[styles.description, { color: theme.text }]}>
        {descriptionLines}
      </Text>
      {product.description.length > 150 && (
        <TouchableOpacity
          onPress={() => setShowFullDescription(!showFullDescription)}
          style={styles.readMoreButton}
        >
          <Text style={[styles.readMoreText, { color: theme.primary }]}>
            {showFullDescription ? t('common.showLess') : t('common.readMore')}
          </Text>
          <Ionicons
            name={showFullDescription ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={theme.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSpecifications = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.heading }]}>
        {t('product.specifications')}
      </Text>
      <View style={styles.specsGrid}>
        {product.specifications && Object.entries(product.specifications).map(([key, value], index) => (
          <View key={index} style={styles.specRow}>
            <Text style={[styles.specLabel, { color: theme.textSecondary }]}>
              {key}
            </Text>
            <Text style={[styles.specValue, { color: theme.text }]}>
              {value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderShippingInfo = () => (
    <View style={[styles.shippingCard, { backgroundColor: theme.card }]}>
      <Ionicons name="car-outline" size={24} color={theme.primary} />
      <View style={styles.shippingInfo}>
        <Text style={[styles.shippingTitle, { color: theme.heading }]}>
          {t('product.shipping')}
        </Text>
        <View style={styles.shippingOptions}>
          {product.shippingInfo && (
            <View style={styles.shippingOption}>
              <Text style={[styles.shippingName, { color: theme.text }]}>
                {product.shippingInfo.freeShipping 
                  ? t('product.freeShipping') 
                  : t('product.standardShipping')
                }
              </Text>
              <Text style={[styles.shippingPrice, { color: theme.heading }]}>
                {product.shippingInfo.freeShipping 
                  ? t('product.freeShipping')
                  : `${product.currency} 5.99`
                }
              </Text>
              <Text style={[styles.shippingTime, { color: theme.textSecondary }]}>
                {product.shippingInfo.deliveryTime}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderSellerInfo = () => (
    <View style={[styles.sellerCard, { backgroundColor: theme.card }]}>
      <View style={styles.sellerHeader}>
        <Ionicons name="business" size={24} color={theme.primary} />
        <View style={styles.sellerInfo}>
          <Text style={[styles.sellerName, { color: theme.heading }]}>
            {product.seller.name}
          </Text>
          <View style={styles.sellerStats}>
            {product.seller.rating && product.seller.reviewCount && (
              <Text style={[styles.sellerRating, { color: theme.text }]}>
                ⭐ {product.seller.rating.toFixed(1)} ({product.seller.reviewCount})
              </Text>
            )}
            {product.seller.responseRate && (
              <Text style={[styles.sellerResponse, { color: theme.textSecondary }]}>
                {product.seller.responseRate}% {t('product.responseRate')}
              </Text>
            )}
          </View>
        </View>
      </View>
      <TouchableOpacity style={[styles.contactButton, { borderColor: theme.primary }]}>
        <Text style={[styles.contactButtonText, { color: theme.primary }]}>
          {t('product.contactSeller')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Табы */}
      <View style={[styles.tabContainer, { backgroundColor: theme.card }]}>
        {(['description', 'specs', 'reviews'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              {
                borderBottomColor: activeTab === tab ? theme.primary : 'transparent',
              },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tab,
                {
                  color: activeTab === tab ? theme.primary : theme.text,
                },
              ]}
            >
              {t(`product.${tab}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'description' && (
          <>
            {renderDescription()}
            {renderShippingInfo()}
            {renderSellerInfo()}
          </>
        )}

        {activeTab === 'specs' && renderSpecifications()}

        {activeTab === 'reviews' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.heading }]}>
              {t('product.reviews')} ({product.reviewCount})
            </Text>
            {/* Здесь будет компонент отзывов */}
            <Text style={[styles.placeholder, { color: theme.textSecondary }]}>
              Reviews component coming soon...
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  specsGrid: {
    marginTop: 8,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  specLabel: {
    fontSize: 14,
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  shippingCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  shippingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  shippingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  shippingOptions: {
    marginTop: 8,
  },
  shippingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  shippingName: {
    fontSize: 14,
    flex: 2,
  },
  shippingPrice: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  shippingTime: {
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
  },
  sellerCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sellerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  sellerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sellerRating: {
    fontSize: 14,
  },
  sellerResponse: {
    fontSize: 12,
  },
  contactButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  placeholder: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default ProductDescription;