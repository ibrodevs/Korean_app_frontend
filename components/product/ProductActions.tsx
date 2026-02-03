import React, { useState } from 'react';
import {
  View,
  
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Product, ColorVariant, SizeVariant } from '../../types/product';

interface ProductActionsProps {
  product: Product;
  colors: ColorVariant[];
  sizes: SizeVariant[];
  onAddToCart: (quantity: number, selectedColor?: ColorVariant, selectedSize?: SizeVariant) => void;
  onBuyNow: (quantity: number, selectedColor?: ColorVariant, selectedSize?: SizeVariant) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  colors,
  sizes,
  onAddToCart,
  onBuyNow,
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeVariant | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product.stock === 0) {
      Alert.alert('Out of Stock', 'This product is currently unavailable.');
      return;
    }

    if (colors.length > 0 && !selectedColor) {
      setShowOptionsModal(true);
      return;
    }

    if (sizes.length > 0 && !selectedSize) {
      setShowOptionsModal(true);
      return;
    }

    onAddToCart(quantity, selectedColor || undefined, selectedSize || undefined);
    Alert.alert(t('product.addedToCart'), `${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (product.stock === 0) {
      Alert.alert('Out of Stock', 'This product is currently unavailable.');
      return;
    }

    if (colors.length > 0 && !selectedColor) {
      setShowOptionsModal(true);
      return;
    }

    if (sizes.length > 0 && !selectedSize) {
      setShowOptionsModal(true);
      return;
    }

    onBuyNow(quantity, selectedColor || undefined, selectedSize || undefined);
  };

  const renderOptionsModal = () => (
    <Modal
      visible={showOptionsModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowOptionsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Select Options
            </Text>
            <TouchableOpacity onPress={() => setShowOptionsModal(false)}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {colors.length > 0 && (
            <View style={styles.optionSection}>
              <Text style={[styles.optionTitle, { color: theme.text }]}>
                {t('product.color')}
              </Text>
              <View style={styles.colorsContainer}>
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color.id}
                    onPress={() => setSelectedColor(color)}
                    style={[
                      styles.colorOption,
                      {
                        backgroundColor: color.hex,
                        borderColor: selectedColor?.id === color.id
                          ? theme.primary
                          : theme.border,
                      },
                    ]}
                  >
                    {selectedColor?.id === color.id && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={theme.background}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {sizes.length > 0 && (
            <View style={styles.optionSection}>
              <Text style={[styles.optionTitle, { color: theme.text }]}>
                {t('product.size')}
              </Text>
              <View style={styles.sizesContainer}>
                {sizes.map((size) => (
                  <TouchableOpacity
                    key={size.id}
                    style={[
                      styles.sizeOption,
                      {
                        backgroundColor: selectedSize?.id === size.id
                          ? theme.primary
                          : theme.border,
                        opacity: size.available ? 1 : 0.5,
                      },
                      !size.available && styles.sizeOptionDisabled,
                    ]}
                    onPress={() => size.available && setSelectedSize(size)}
                    disabled={!size.available}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        {
                          color: selectedSize?.id === size.id
                            ? theme.background
                            : theme.text,
                        },
                      ]}
                    >
                      {size.name}
                    </Text>
                    {!size.available && (
                      <Text style={styles.sizeUnavailable}>X</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: theme.primary }]}
            onPress={() => {
              setShowOptionsModal(false);
              handleAddToCart();
            }}
          >
            <Text style={[styles.confirmButtonText, { color: '#FFFFFF' }]}>
              Confirm Selection
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {/* Выбранные опции */}
      {(selectedColor || selectedSize) && (
        <View style={styles.selectedOptions}>
          {selectedColor && (
            <View style={styles.selectedOption}>
              <Text style={[styles.optionLabel, { color: theme.textSecondary }]}>
                {t('product.color')}:
              </Text>
              <View style={styles.optionValue}>
                <View
                  style={[
                    styles.selectedColor,
                    { backgroundColor: selectedColor.hex },
                  ]}
                />
                <Text style={[styles.optionText, { color: theme.text }]}>
                  {selectedColor.name}
                </Text>
              </View>
            </View>
          )}
          {selectedSize && (
            <View style={styles.selectedOption}>
              <Text style={[styles.optionLabel, { color: theme.textSecondary }]}>
                {t('product.size')}:
              </Text>
              <View style={styles.optionValue}>
                <Text style={[styles.optionText, { color: theme.text }]}>
                  {selectedSize.name}
                </Text>
              </View>
            </View>
          )}
          <TouchableOpacity
            onPress={() => {
              setSelectedColor(null);
              setSelectedSize(null);
            }}
            style={styles.changeButton}
          >
            <Text style={[styles.changeText, { color: theme.primary }]}>
              Change
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Количество */}
      <View style={styles.quantitySection}>
        <Text style={[styles.quantityLabel, { color: theme.text }]}>
          {t('product.quantity')}
        </Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: theme.border }]}
            onPress={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Ionicons name="remove" size={20} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.quantityValue, { color: theme.text }]}>
            {quantity}
          </Text>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: theme.border }]}
            onPress={() => handleQuantityChange(1)}
            disabled={quantity >= product.stock}
          >
            <Ionicons name="add" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.stockText, { color: theme.textSecondary }]}>
          {product.stock} {t('product.inStock')}
        </Text>
      </View>

      {/* Кнопки действий */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            {
              backgroundColor: product.stock > 0 ? theme.secondary : theme.border,
              borderColor: product.stock > 0 ? theme.secondary : theme.border,
            },
          ]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}
        >
          <Ionicons
            name="cart-outline"
            size={20}
            color={product.stock > 0 ? theme.text : theme.textSecondary}
          />
          <Text
            style={[
              styles.addToCartText,
              {
                color: product.stock > 0 ? theme.text : theme.textSecondary,
              },
            ]}
          >
            {product.stock > 0
              ? t('product.addToCart')
              : t('product.outOfStock')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.buyNowButton,
            {
              backgroundColor: product.stock > 0 ? theme.primary : theme.border,
            },
          ]}
          onPress={handleBuyNow}
          disabled={product.stock === 0}
        >
          <Text
            style={[
              styles.buyNowText,
              {
                color: product.stock > 0 ? '#FFFFFF' : theme.textSecondary,
              },
            ]}
          >
            {t('product.buyNow')}
          </Text>
        </TouchableOpacity>
      </View>

      {renderOptionsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginTop: -20,
  },
  selectedOptions: {
    marginBottom: 20,
  },
  selectedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  changeButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  stockText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buyNowButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  optionSection: {
    marginBottom: 24,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
    position: 'relative',
  },
  sizeOptionDisabled: {
    opacity: 0.5,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sizeUnavailable: {
    position: 'absolute',
    top: -5,
    right: -5,
    color: '#DC2626',
    fontWeight: 'bold',
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ProductActions;