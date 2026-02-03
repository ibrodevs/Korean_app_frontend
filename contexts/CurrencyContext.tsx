import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CurrencyType = 'Som' | 'USD' | 'EUR' | 'RUB' | 'KRW';

interface CurrencyContextType {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  getCurrencySymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyType>('Som');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadCurrency();
  }, []);

  const loadCurrency = async () => {
    try {
      const savedCurrency = await AsyncStorage.getItem('app-currency');
      if (savedCurrency && ['Som', 'USD', 'EUR', 'RUB', 'KRW'].includes(savedCurrency)) {
        setCurrencyState(savedCurrency as CurrencyType);
      }
    } catch (error) {
      console.error('Error loading currency:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setCurrency = async (newCurrency: CurrencyType) => {
    try {
      setCurrencyState(newCurrency);
      await AsyncStorage.setItem('app-currency', newCurrency);
    } catch (error) {
      console.error('Error saving currency:', error);
    }
  };

  const getCurrencySymbol = (): string => {
    switch (currency) {
      case 'Som':
        return '⃀';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'RUB':
        return '₽';
      case 'KRW':
        return '₩';
      default:
        return '⃀';
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, getCurrencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};