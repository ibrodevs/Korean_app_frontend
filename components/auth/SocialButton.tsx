import React from 'react';
import {
  TouchableOpacity,
  
  StyleSheet,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

interface SocialButtonProps {
  provider: 'google' | 'apple' | 'facebook';
  onPress: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({ provider, onPress }) => {
  const tailwind = useTailwind();
  const { theme } = useTheme();

  const getProviderConfig = () => {
    switch (provider) {
      case 'google':
        return {
          icon: 'logo-google',
          text: 'Google',
          bgColor: theme.card,
          textColor: theme.text,
          iconColor: '#DB4437',
        };
      case 'apple':
        return {
          icon: 'logo-apple',
          text: 'Apple',
          bgColor: theme.text,
          textColor: theme.card,
          iconColor: theme.card,
        };
      case 'facebook':
        return {
          icon: 'logo-facebook',
          text: 'Facebook',
          bgColor: '#1877F2',
          textColor: '#FFFFFF',
          iconColor: '#FFFFFF',
        };
    }
  };

  const config = getProviderConfig();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: config.bgColor, borderColor: theme.border },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={config.icon as any}
        size={20}
        color={config.iconColor}
        style={tailwind('mr-3')}
      />
      <Text style={[styles.buttonText, { color: config.textColor }]}>
        {config.text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SocialButton;