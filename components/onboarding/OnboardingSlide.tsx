import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Text from '../Text';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTheme } from '../../contexts/ThemeContext';
import { OnboardingSlide as OnboardingSlideType } from '../../types/onboarding';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingSlideProps extends OnboardingSlideType {
  index: number;
  currentIndex: number;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  description,
  illustration,
  index,
  currentIndex,
}) => {
  const tailwind = useTailwind();
  const { theme } = useTheme();

  const slideStyle = useAnimatedStyle(() => {
    const isActive = index === currentIndex;
    return {
      opacity: withTiming(isActive ? 1 : 0.3),
      transform: [
        { scale: withTiming(isActive ? 1 : 0.9) },
        { translateX: withTiming((index - currentIndex) * SCREEN_WIDTH * 0.1) },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        slideStyle,
        { width: SCREEN_WIDTH },
      ]}
    >
      {/* Иллюстрация */}
      <View style={styles.illustrationContainer}>
        {illustration}
      </View>

      {/* Текстовая часть */}
      <View style={styles.textContainer}>
        <Text style={[
          styles.title,
          { color: theme.heading }
        ]}>
          {title}
        </Text>
        
        <Text style={[
          styles.description,
          { color: theme.textSecondary }
        ]}>
          {description}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    height: SCREEN_HEIGHT * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
});

export default OnboardingSlide;