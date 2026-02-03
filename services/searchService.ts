import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchHistoryItem, PopularSearch, Brand, ColorOption, SizeOption } from '../types/product';

const SEARCH_HISTORY_KEY = '@search_history';
const MAX_HISTORY_ITEMS = 10;

export const searchService = {
  // Получение истории поиска
  getSearchHistory: async (): Promise<SearchHistoryItem[]> => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (history) {
        const items = JSON.parse(history);
        // Сортируем по времени (новые сначала)
        return items.sort((a: SearchHistoryItem, b: SearchHistoryItem) => 
          b.timestamp - a.timestamp
        ).slice(0, MAX_HISTORY_ITEMS);
      }
      return [];
    } catch (error) {
      console.error('Error getting search history:', error);
      return [];
    }
  },

  // Добавление в историю
  addToHistory: async (query: string, resultCount: number): Promise<void> => {
    try {
      const currentHistory = await searchService.getSearchHistory();
      
      // Удаляем дубликаты
      const filteredHistory = currentHistory.filter(item => item.query !== query);
      
      // Добавляем новый элемент
      const newItem: SearchHistoryItem = {
        id: Date.now().toString(),
        query,
        timestamp: Date.now(),
        resultCount,
      };

      const updatedHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
      
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error adding to search history:', error);
    }
  },

  // Очистка истории
  clearHistory: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  },

  // Получение популярных запросов
  getPopularSearches: async (): Promise<PopularSearch[]> => {
    // Моковые данные
    return [
      { id: '1', query: 'Korean face mask', count: 145, category: 'skincare' },
      { id: '2', query: 'BB cream', count: 98, category: 'cosmetics' },
      { id: '3', query: 'K-pop hoodie', count: 76, category: 'fashion' },
      { id: '4', query: 'Korean snacks', count: 234, category: 'snacks' },
      { id: '5', query: 'Sheet mask', count: 87, category: 'skincare' },
      { id: '6', query: 'Ceramic mug', count: 54, category: 'homeDecor' },
    ];
  },

  // Получение брендов
  getBrands: async (): Promise<Brand[]> => {
    return [
      { id: '1', name: 'Innisfree', productCount: 42 },
      { id: '2', name: 'Etude House', productCount: 38 },
      { id: '3', name: 'Tony Moly', productCount: 31 },
      { id: '4', name: 'Laneige', productCount: 27 },
      { id: '5', name: 'Sulwhasoo', productCount: 19 },
      { id: '6', name: 'Cosrx', productCount: 45 },
    ];
  },

  // Получение цветов
  getColors: async (): Promise<ColorOption[]> => {
    return [
      { id: '1', name: 'Red', color: '#DC2626', productCount: 23 },
      { id: '2', name: 'Blue', color: '#1774F3', productCount: 18 },
      { id: '3', name: 'Yellow', color: '#FBBF24', productCount: 12 },
      { id: '4', name: 'Purple', color: '#7C3AED', productCount: 15 },
      { id: '5', name: 'Green', color: '#059669', productCount: 21 },
      { id: '6', name: 'Black', color: '#0F172A', productCount: 34 },
      { id: '7', name: 'White', color: '#F8FAFC', productCount: 28 },
      { id: '8', name: 'Pink', color: '#EC4899', productCount: 17 },
    ];
  },

  // Получение размеров
  getSizes: async (): Promise<SizeOption[]> => {
    return [
      { id: '1', name: 'XS', productCount: 15 },
      { id: '2', name: 'S', productCount: 28 },
      { id: '3', name: 'M', productCount: 42 },
      { id: '4', name: 'L', productCount: 31 },
      { id: '5', name: 'XL', productCount: 19 },
      { id: '6', name: 'XXL', productCount: 8 },
      { id: '7', name: 'One Size', productCount: 24 },
    ];
  },

  // Расширенный поиск с фильтрами
  advancedSearch: async (filters: any) => {
    // Имитация сетевого запроса
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Здесь будет логика применения всех фильтров
    // В демо-версии возвращаем пустой массив
    return [];
  },
};