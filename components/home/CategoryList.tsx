import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Text from '../../components/Text';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Category } from '../../types/product';
import { useTailwind } from '../../utils/tailwindUtilities';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryPress: (category: Category) => void;
  onSeeAllPress: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onCategoryPress,
  onSeeAllPress,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const tailwind = useTailwind();

  const getIconName = (icon: string) => {
    const iconMap: Record<string, string> = {
      cosmetics: 'color-palette-outline',
      skincare: 'water-outline',
      snacks: 'fast-food-outline',
      fashion: 'shirt-outline',
      homeDecor: 'home-outline',
      electronics: 'phone-portrait-outline',
    };
    return iconMap[icon] || 'cube-outline';
  };

  const getLocalizedName = (categoryName: string) => {
    const categoryMap: Record<string, string> = {
      cosmetics: t('categories.cosmetics'),
      skincare: t('categories.skincare'),
      snacks: t('categories.snacks'),
      fashion: t('categories.fashion'),
      homeDecor: t('categories.homeDecor'),
      electronics: t('categories.electronics'),
      all: t('categories.all'),
    };
    return categoryMap[categoryName] || categoryName;
  };

  return (
    <View style={{ marginBottom: 24 }}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.heading }]}>
          {t('home.categories')}
        </Text>
        <TouchableOpacity
          onPress={onSeeAllPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.seeAllText, { color: theme.primary }]}>
            {t('home.seeAll')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Список категорий */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          
          return (
            <TouchableOpacity
              key={category.id}
              style={tailwind('mr-4')}
              onPress={() => onCategoryPress(category)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: isSelected ? category.color : theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: isSelected
                        ? theme.background
                        : category.color + '20',
                    },
                  ]}
                >
                  <Ionicons
                    name={getIconName(category.icon) as any}
                    size={24}
                    color={isSelected ? category.color : theme.text}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryName,
                    {
                      color: isSelected ? theme.heading : theme.text,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {getLocalizedName(category.name)}
                </Text>
                <Text
                  style={[
                    styles.productCount,
                    {
                      color: isSelected ? theme.textSecondary : theme.textSecondary,
                    },
                  ]}
                >
                  {category.productCount}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryCard: {
    alignItems: 'center',
    width: 80,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  productCount: {
    fontSize: 10,
    fontWeight: '400',
    opacity: 0.7,
  },
});

export default CategoryList;