import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from './contexts/ThemeContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { CartProvider } from './contexts/CartContext';
import i18n from './utils/i18n';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ActionSheetProvider>
        <ThemeProvider>
          <CurrencyProvider>
              <CartProvider>
                <I18nextProvider i18n={i18n}>
                  <StatusBar style="auto" />
                  <RootNavigator />
                </I18nextProvider>
              </CartProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </ActionSheetProvider>
    </SafeAreaProvider>
  );
}