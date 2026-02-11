import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren, ReactElement } from 'react';
import { Platform, StatusBar, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollOffset,
    withSpring
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 280;
const HEADER_MAX_HEIGHT = HEADER_HEIGHT;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 100 : 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface HeaderOverlayProps {
  scrollOffset: SharedValue<number>;
  backgroundColor: string;
}

function HeaderOverlay({ scrollOffset, backgroundColor }: HeaderOverlayProps) {
  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      [0, 0.5, 0.9],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      backgroundColor,
    };
  });

  return <Animated.View style={[StyleSheet.absoluteFill, overlayStyle]} />;
}

interface BlurHeaderProps {
  scrollOffset: SharedValue<number>;
}

function BlurHeader({ scrollOffset }: BlurHeaderProps) {
  const blurStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [HEADER_SCROLL_DISTANCE * 0.5, HEADER_SCROLL_DISTANCE * 0.8, HEADER_SCROLL_DISTANCE],
      [0, 0.5, 1],
      Extrapolation.CLAMP
    );

    const height = interpolate(
      scrollOffset.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollOffset.value,
      [0, HEADER_SCROLL_DISTANCE],
      [-HEADER_MIN_HEIGHT, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      height,
      transform: [{ translateY }],
    };
  });

  if (Platform.OS !== 'ios') return null;

  return (
    <Animated.View style={[styles.blurContainer, blurStyle]}>
      <BlurView
        intensity={90}
        tint="regular"
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  overlayColor?: { dark: string; light: string };
  showBlurHeader?: boolean;
  contentStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  parallaxFactor?: number;
  fadeOutContent?: boolean;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  overlayColor = { dark: 'rgba(0,0,0,0.6)', light: 'rgba(0,0,0,0.4)' },
  showBlurHeader = true,
  contentStyle,
  headerStyle,
  parallaxFactor = 0.5,
  fadeOutContent = true,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  // Параллакс анимация для хедера
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollOffset.value,
      [-HEADER_MAX_HEIGHT, 0, HEADER_MAX_HEIGHT],
      [-HEADER_MAX_HEIGHT * parallaxFactor, 0, HEADER_MAX_HEIGHT * 0.7],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollOffset.value,
      [-HEADER_MAX_HEIGHT, 0, HEADER_MAX_HEIGHT],
      [1.8, 1, 1],
      Extrapolation.CLAMP
    );

    const height = interpolate(
      scrollOffset.value,
      [0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateY: withSpring(translateY, { damping: 20, stiffness: 90 }) },
        { scale: withSpring(scale, { damping: 20, stiffness: 90 }) },
      ],
      height,
    };
  });

  // Анимация для контента
  const contentAnimatedStyle = useAnimatedStyle(() => {
    if (!fadeOutContent) return {};

    const opacity = interpolate(
      scrollOffset.value,
      [0, HEADER_SCROLL_DISTANCE * 0.3, HEADER_SCROLL_DISTANCE * 0.6],
      [1, 0.8, 0],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollOffset.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0, -50],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Анимация для градиента внизу хедера
  const gradientAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, HEADER_SCROLL_DISTANCE * 0.7],
      [1, 0],
      Extrapolation.CLAMP
    );

    const height = interpolate(
      scrollOffset.value,
      [0, HEADER_SCROLL_DISTANCE],
      [100, 50],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      height,
    };
  });

  // Анимация для тени хедера
  const shadowAnimatedStyle = useAnimatedStyle(() => {
    const elevation = interpolate(
      scrollOffset.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0, 8],
      Extrapolation.CLAMP
    );

    const shadowOpacity = interpolate(
      scrollOffset.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0, 0.2],
      Extrapolation.CLAMP
    );

    return {
      elevation,
      shadowOpacity,
    };
  });

  // Анимация для безопасной области сверху
  const safeAreaAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolate(
      scrollOffset.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      backgroundColor: `rgba(255,255,255,${backgroundColor})`,
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]}
      overScrollMode="never"
      bounces={true}
      scrollToOverflowEnabled={true}
    >
      {/* Фиксированный верхний бар (для iOS) */}
      {showBlurHeader && Platform.OS === 'ios' && (
        <BlurHeader scrollOffset={scrollOffset} />
      )}

      {/* Основной хедер с параллакс эффектом */}
      <Animated.View 
        style={[
          styles.headerContainer,
          headerStyle,
          shadowAnimatedStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}
        >
          {headerImage}
          
          {/* Оверлей сверху изображения */}
          <HeaderOverlay 
            scrollOffset={scrollOffset} 
            backgroundColor={overlayColor[colorScheme]}
          />

          {/* Градиент снизу для плавного перехода к контенту */}
          <Animated.View style={[styles.gradientContainer, gradientAnimatedStyle]}>
            <LinearGradient
              colors={['transparent', backgroundColor]}
              locations={[0, 0.8]}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>

      {/* Основной контент */}
      <ThemedView style={[styles.contentContainer, contentStyle]}>
        <Animated.View style={[styles.contentWrapper, contentAnimatedStyle]}>
          {children}
        </Animated.View>
      </ThemedView>

      {/* Декоративные элементы для глубины */}
      <Animated.View style={[styles.shadowOverlay, shadowAnimatedStyle]} />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: HEADER_MAX_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  header: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    overflow: 'hidden',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150,150,150,0.2)',
  },
  gradientContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: -40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    paddingTop: 40,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    gap: 20,
  },
  shadowOverlay: {
    position: 'absolute',
    top: HEADER_MAX_HEIGHT - 10,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowRadius: 20,
    elevation: 10,
    zIndex: 5,
  },
  safeAreaTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 44 : Platform.OS === 'web' ? 0 : (StatusBar.currentHeight || 0),
    zIndex: 30,
  },
});