import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_SIZE = SCREEN_WIDTH;
const THUMBNAIL_SIZE = 60;

interface ImageGalleryProps {
  images: string[];
  onImagePress?: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onImagePress }) => {
  const tailwind = useTailwind();
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const mainRef = useRef<FlatList>(null);
  const thumbRef = useRef<FlatList>(null);

  const renderImage = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onImagePress?.(index)}
      style={styles.imageContainer}
    >
      <Image
        source={{ uri: item }}
        style={styles.mainImage}
        resizeMode="cover"
      />
      {/* Индикатор видео (если есть видео) */}
      {item.includes('video') && (
        <View style={styles.videoIndicator}>
          <Ionicons name="play-circle" size={48} color={theme.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderThumbnail = ({ item, index }: { item: string; index: number }) => {
    const inputRange = [
      (index - 1) * IMAGE_SIZE,
      index * IMAGE_SIZE,
      (index + 1) * IMAGE_SIZE,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1.2, 0.8],
      extrapolate: 'clamp',
    });

    const borderColor = scrollX.interpolate({
      inputRange,
      outputRange: [theme.border, theme.primary, theme.border],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        onPress={() => {
          mainRef.current?.scrollToIndex({ index, animated: true });
          thumbRef.current?.scrollToIndex({ index, animated: true });
        }}
        activeOpacity={0.7}
        style={tailwind('mr-2')}
      >
        <Animated.View
          style={[
            styles.thumbnailContainer,
            {
              borderWidth: 2,
              borderColor,
              transform: [{ scale }],
            },
          ]}
        >
          <Image
            source={{ uri: item }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Основная галерея */}
      <FlatList
        ref={mainRef}
        data={images}
        renderItem={renderImage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / IMAGE_SIZE);
          setActiveIndex(index);
          thumbRef.current?.scrollToIndex({ index, animated: true });
        }}
        scrollEventThrottle={16}
      />

      {/* Пагинация */}
      <View style={styles.pagination}>
        {images.map((_, index) => {
          const inputRange = [
            (index - 1) * IMAGE_SIZE,
            index * IMAGE_SIZE,
            (index + 1) * IMAGE_SIZE,
          ];

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: theme.primary,
                  opacity,
                  transform: [{ scale }],
                },
              ]}
            />
          );
        })}
      </View>

      {/* Кнопки действий */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.card }]}
          onPress={() => console.log('Share')}
        >
          <Ionicons name="share-outline" size={20} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.card }]}
          onPress={() => console.log('Favorite')}
        >
          <Ionicons name="heart-outline" size={20} color={theme.error} />
        </TouchableOpacity>
      </View>

      {/* Миниатюры */}
      {images.length > 1 && (
        <View style={styles.thumbnailsContainer}>
          <FlatList
            ref={thumbRef}
            data={images}
            renderItem={renderThumbnail}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tailwind('px-4')}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
  },
  pagination: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  actionButtons: {
    position: 'absolute',
    top: 50,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  thumbnailsContainer: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
  },
  thumbnailContainer: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
});

export default ImageGallery;