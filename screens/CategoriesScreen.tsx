import React from 'react';
import { View } from 'react-native';
import Text from '../components/Text';
import { useTailwind } from '../utils/tailwindUtilities';
import { useTheme } from '../contexts/ThemeContext';

const CategoriesScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { theme } = useTheme();

  return (
    <View style={[tailwind('flex-1 justify-center items-center'), { backgroundColor: theme.background }]}>
      <Text style={{ color: theme.text }}>Categories Screen</Text>
    </View>
  );
};

export default CategoriesScreen;