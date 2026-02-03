import React, { useState, useRef } from 'react';
import {
  View,
  
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import Text from '../components/Text';
import { useTailwind } from '../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Компоненты
import OnboardingSlide from '../components/onboarding/OnboardingSlide';
import OnboardingPagination from '../components/onboarding/OnboardingPagination';
import CustomIllustration from '../components/onboarding/CustomIllustration';

// Типы
import { RootStackParamList } from '../types/navigation';
import { OnboardingSlide as OnboardingSlideType } from '../types/onboarding';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const OnboardingScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Данные для слайдов
  const slides: OnboardingSlideType[] = [
    {
      id: '1',
      title: t('onboarding.title1'),
      description: t('onboarding.description1'),
      illustration: <CustomIllustration type="search" />,
    },
    {
      id: '2',
      title: t('onboarding.title2'),
      description: t('onboarding.description2'),
      illustration: <CustomIllustration type="delivery" />,
    },
    {
      id: '3',
      title: t('onboarding.title3'),
      description: t('onboarding.description3'),
      illustration: <CustomIllustration type="tracking" />,
    },
    {
      id: '4',
      title: t('onboarding.title4'),
      description: t('onboarding.description4'),
      illustration: <CustomIllustration type="payment" />,
    },
  ];

  const handleSkip = async () => {
    await AsyncStorage.setItem('onboarding-completed', 'true');
    navigation.replace('Auth', { screen: 'Login' }); // Или 'Main' если будет сразу авторизация
  };

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await AsyncStorage.setItem('onboarding-completed', 'true');
      navigation.replace('Auth', { screen: 'Login' }); // Или 'Main' если будет сразу авторизация
    }
  };

  const handleDotPress = (index: number) => {
    slidesRef.current?.scrollToIndex({ index });
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlideType; index: number }) => {
    return (
      <OnboardingSlide
        id={item.id}
        title={item.title}
        description={item.description}
        illustration={item.illustration}
        index={index}
        currentIndex={currentIndex}
      />
    );
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.background }
    ]}>
      {/* Кнопка пропуска */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.skipText,
          { color: theme.textSecondary }
        ]}>
          {t('onboarding.skip')}
        </Text>
      </TouchableOpacity>

      {/* Карусель слайдов */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={slidesRef}
          data={slides}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
        />
      </View>

      {/* Пагинация */}
      <OnboardingPagination
        slides={slides}
        currentIndex={currentIndex}
        onDotPress={handleDotPress}
      />

      {/* Кнопка Далее/Начать */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: theme.primary }
          ]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.nextButtonText,
            { color: theme.heading }
          ]}>
            {currentIndex === slides.length - 1 
              ? t('onboarding.getStarted') 
              : t('onboarding.next')
            }
          </Text>
        </TouchableOpacity>
      </View>

      {/* Прогресс бар */}
      <View style={styles.progressContainer}>
        <View style={[
          styles.progressBackground,
          { backgroundColor: theme.border }
        ]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: scrollX.interpolate({
                  inputRange: [
                    0,
                    SCREEN_WIDTH * (slides.length - 1),
                    SCREEN_WIDTH * slides.length,
                  ],
                  outputRange: ['0%', '100%', '100%'],
                }),
                backgroundColor: theme.primary,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  progressBackground: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default OnboardingScreen;