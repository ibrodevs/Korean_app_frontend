import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Animated,
    Dimensions,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Text from '../../components/Text';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  onMenuPress: () => void;
  onSearchPress: (query: string) => void;
  onCartPress: () => void;
  onSearchFocus?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Header: React.FC<HeaderProps> = ({ onMenuPress, onSearchPress, onCartPress }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearchPress(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearchPress('');
  };

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCartPress = () => {
    animatePress();
    onCartPress();
  };

  function onSearchFocus() {
    throw new Error('Function not implemented.');
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.navBackground }]}>
      {/* Верхняя часть: меню и корзина */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <Ionicons name="menu-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: '#FFFFFF' }]}>
            {t('home.title')}
          </Text>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleCartPress}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Поисковая строка */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchInputContainer,
            {
              backgroundColor: theme.card,
              borderColor: isSearchFocused ? theme.primary : theme.border,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={isSearchFocused ? theme.primary : theme.textSecondary}
            style={{ marginRight: 8 }}
          />

          <TextInput
            style={[
              styles.searchInput,
              { color: theme.text },
            ]}
            placeholder={t('home.searchPlaceholder')}
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => {
              setIsSearchFocused(true);
              onSearchFocus?.(); // Вызываем обработчик фокуса
            }}
            onBlur={() => setIsSearchFocused(false)}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color={theme.textSecondary}
              />
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
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#00000019',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  iconButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
});

export default Header;