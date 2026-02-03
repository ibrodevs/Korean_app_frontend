import React, { useRef, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { Banner } from '../../types/product';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 40;

interface BannerCarouselProps {
  banners: Banner[];
  onBannerPress: (banner: Banner) => void;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners, onBannerPress }) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const renderBanner = ({ item, index }: { item: Banner; index: number }) => {
    const inputRange = [
      (index - 1) * BANNER_WIDTH,
      index * BANNER_WIDTH,
      (index + 1) * BANNER_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
    });

    return (
      <TouchableOpacity
        onPress={() => onBannerPress(item)}
        activeOpacity={0.9}
        style={{ width: BANNER_WIDTH }}
      >
        <Animated.View
          style={[
            styles.bannerContainer,
            {
              backgroundColor: item.backgroundColor || theme.secondary,
              opacity,
              transform: [{ scale }],
            },
          ]}
        >
          <View style={styles.bannerContent}>
            <View style={tailwind('flex-1 pr-4')}>
              <Text style={[styles.bannerTitle, { color: theme.heading }]}>
                {item.title}
              </Text>
              <Text style={[styles.bannerSubtitle, { color: theme.heading }]}>
                {item.subtitle}
              </Text>
              <TouchableOpacity
                style={[
                  styles.bannerButton,
                  { backgroundColor: theme.primary },
                ]}
                activeOpacity={0.8}
              >
                <Text style={[styles.bannerButtonText, { color: theme.heading }]}>
                  {t('home.specialOffers')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bannerImageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {banners.map((_, index) => {
          const inputRange = [
            (index - 1) * BANNER_WIDTH,
            index * BANNER_WIDTH,
            (index + 1) * BANNER_WIDTH,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const dotColor = scrollX.interpolate({
            inputRange,
            outputRange: [theme.textSecondary, theme.primary, theme.textSecondary],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                {
                  width: dotWidth,
                  backgroundColor: dotColor,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  if (banners.length === 0) {
    return null;
  }

  return (
    <View style={tailwind('my-6')}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderBanner}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_WIDTH + 20}
        decelerationRate="fast"
        contentContainerStyle={tailwind('px-5')}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / BANNER_WIDTH
          );
          setCurrentIndex(newIndex);
        }}
        scrollEventThrottle={16}
      />
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    borderRadius: 20,
    padding: 20,
    height: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  bannerContent: {
    flexDirection: 'row',
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 24,
  },
  bannerSubtitle: {
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 18,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bannerButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bannerImageContainer: {
    width: 100,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default BannerCarousel;