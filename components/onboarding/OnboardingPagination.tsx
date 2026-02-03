import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTheme } from '../../contexts/ThemeContext';
import { OnboardingPaginationProps } from '../../types/onboarding';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OnboardingPagination: React.FC<OnboardingPaginationProps> = ({
  slides,
  currentIndex,
  onDotPress,
}) => {
  const tailwind = useTailwind();
  const { theme } = useTheme();

  const renderDots = () => {
    return slides.map((_, index) => {
      const isActive = index === currentIndex;
      
      const dotStyle = useAnimatedStyle(() => {
        return {
          width: withSpring(isActive ? 32 : 8),
          backgroundColor: withSpring(isActive ? theme.primary : theme.border),
        };
      });

      return (
        <TouchableOpacity
          key={index}
          onPress={() => onDotPress?.(index)}
          activeOpacity={0.7}
          style={tailwind('mx-1')}
        >
          <Animated.View
            style={[
              styles.dot,
              dotStyle,
            ]}
          />
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        {renderDots()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

export default OnboardingPagination;