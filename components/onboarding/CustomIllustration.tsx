import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CustomIllustrationProps {
  type: 'search' | 'delivery' | 'tracking' | 'payment';
}

const CustomIllustration: React.FC<CustomIllustrationProps> = ({ type }) => {
  const { theme } = useTheme();
  const size = SCREEN_WIDTH * 0.6;

  const getIllustration = () => {
    switch (type) {
      case 'search':
        return (
          <Svg width={size} height={size} viewBox="0 0 200 200">
            {/* Основная форма магазина */}
            <Rect x="40" y="60" width="120" height="80" rx="10" fill={theme.secondary} />
            <Rect x="60" y="80" width="80" height="40" rx="5" fill={theme.background} />
            
            {/* Поисковая лупа */}
            <Circle cx="130" cy="100" r="25" fill={theme.primary} />
            <Path
              d="M145 115L160 130"
              stroke={theme.heading}
              strokeWidth="4"
              strokeLinecap="round"
            />
            
            {/* Продукты */}
            <Circle cx="80" cy="100" r="8" fill={theme.error} />
            <Rect x="90" y="94" width="12" height="12" rx="3" fill={theme.primary} />
            <Path
              d="M105 100C105 104.418 101.418 108 97 108C92.5817 108 89 104.418 89 100C89 95.5817 92.5817 92 97 92C101.418 92 105 95.5817 105 100Z"
              fill={theme.heading}
            />
          </Svg>
        );

      case 'delivery':
        return (
          <Svg width={size} height={size} viewBox="0 0 200 200">
            {/* Грузовик */}
            <Rect x="50" y="100" width="100" height="40" rx="5" fill={theme.secondary} />
            <Rect x="130" y="80" width="30" height="20" rx="3" fill={theme.primary} />
            
            {/* Колеса */}
            <Circle cx="70" cy="140" r="12" fill={theme.heading} />
            <Circle cx="70" cy="140" r="6" fill={theme.background} />
            <Circle cx="130" cy="140" r="12" fill={theme.heading} />
            <Circle cx="130" cy="140" r="6" fill={theme.background} />
            
            {/* Коробки */}
            <Rect x="60" y="70" width="25" height="25" rx="3" fill={theme.error} />
            <Rect x="90" y="65" width="20" height="30" rx="3" fill={theme.primary} />
            <Rect x="115" y="75" width="20" height="20" rx="3" fill={theme.heading} />
            
            {/* Линия маршрута */}
            <Path
              d="M30 140L180 140"
              stroke={theme.textSecondary}
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.5"
            />
          </Svg>
        );

      case 'tracking':
        return (
          <Svg width={size} height={size} viewBox="0 0 200 200">
            {/* Карта */}
            <Rect x="50" y="60" width="100" height="80" rx="10" fill={theme.background} />
            <Path
              d="M60 80C60 80 80 65 100 80C120 95 140 75 140 75"
              stroke={theme.primary}
              strokeWidth="4"
              fill="none"
            />
            
            {/* Точки маршрута */}
            <Circle cx="60" cy="80" r="8" fill={theme.error} />
            <Circle cx="100" cy="95" r="8" fill={theme.primary} />
            <Circle cx="140" cy="75" r="8" fill={theme.secondary} />
            
            {/* Иконка отслеживания */}
            <Circle cx="100" cy="120" r="20" fill={theme.heading} />
            <Path
              d="M100 110L100 130M90 120H110"
              stroke={theme.background}
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Линия прогресса */}
            <Rect x="55" y="145" width="90" height="6" rx="3" fill={theme.border} />
            <Rect x="55" y="145" width="60" height="6" rx="3" fill={theme.primary} />
          </Svg>
        );

      case 'payment':
        return (
          <Svg width={size} height={size} viewBox="0 0 200 200">
            {/* Карта */}
            <Rect x="50" y="70" width="100" height="60" rx="10" fill={theme.background} />
            <Rect x="60" y="80" width="80" height="40" rx="5" fill={theme.secondary} />
            
            {/* Чип карты */}
            <Rect x="70" y="95" width="20" height="15" rx="3" fill={theme.primary} />
            
            {/* Номер карты */}
            <Path
              d="M100 105H120M100 110H125M100 115H130"
              stroke={theme.heading}
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Иконка безопасности */}
            <Circle cx="150" cy="100" r="20" fill={theme.error} opacity="0.8" />
            <Path
              d="M140 100L148 108L160 92"
              stroke={theme.background}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Иконка замка */}
            <Rect x="75" y="140" width="50" height="30" rx="5" fill={theme.heading} />
            <Rect x="85" y="135" width="30" height="10" rx="3" fill={theme.heading} />
            <Circle cx="100" cy="155" r="8" fill={theme.primary} />
          </Svg>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {getIllustration()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomIllustration;