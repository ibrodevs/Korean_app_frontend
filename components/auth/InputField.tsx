import React, { useState } from 'react';
import {
  View,
  
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import Text from '../../components/Text';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  secureTextEntry?: boolean;
  icon?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  secureTextEntry = false,
  icon,
  value,
  onChangeText,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const toggleSecure = () => setIsSecure(!isSecure);

  return (
    <View style={{ marginBottom: 16 }}>
      {/* Label */}
      <Text
        style={[
          styles.label,
          { color: theme.textSecondary },
          error ? { color: theme.error } : null,
        ]}
      >
        {label}
      </Text>

      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error
              ? theme.error
              : isFocused
              ? theme.primary
              : theme.border,
            backgroundColor: theme.card,
          },
        ]}
      >
        {/* Icon */}
        {icon && (
          <Ionicons
            name={icon as any}
            size={20}
            color={isFocused ? theme.primary : theme.textSecondary}
            style={{ marginRight: 12 }}
          />
        )}

        {/* Text Input */}
        <TextInput
          style={[
            styles.input,
            { color: theme.text },
            icon ? { paddingLeft: 0 } : null,
          ]}
          placeholderTextColor={theme.textSecondary}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isSecure}
          autoCapitalize="none"
          {...props}
        />

        {/* Show/Hide Password Button */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={toggleSecure}
            style={{ marginLeft: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons
            name="alert-circle-outline"
            size={14}
            color={theme.error}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.errorText, { color: theme.error }]}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '400',
  },
});

export default InputField;