import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, DEFAULT_SETTINGS } from '../types/settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  };

  const updateSetting = useCallback(async (key: keyof AppSettings, value: any) => {
    const newSettings = {
      ...settings,
      [key]: value,
    };
    const success = await saveSettings(newSettings);
    return success;
  }, [settings]);

  const resetSettings = async () => {
    try {
      await AsyncStorage.removeItem('appSettings');
      setSettings(DEFAULT_SETTINGS);
      return true;
    } catch (error) {
      console.error('Error resetting settings:', error);
      return false;
    }
  };

  return {
    settings,
    isLoading,
    saveSettings,
    updateSetting,
    resetSettings,
    reloadSettings: loadSettings,
  };
};