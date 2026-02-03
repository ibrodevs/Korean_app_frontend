import { useState, useCallback } from 'react';
import { SearchFilters, Product } from '../types/product';
import { productService } from '../services/productService';

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    priceRange: { min: 0, max: 1000 },
    minRating: 0,
    availability: 'all',
    shipping: 'all',
    brands: [],
    colors: [],
    sizes: [],
    onSale: false,
    newArrivals: false,
    highRated: false,
  });

  // Поиск по названию и описанию
  const searchByNameAndDescription = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await productService.searchProducts(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Применение фильтров
  const applyFilters = useCallback(async (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    setIsSearching(true);
    try {
      // Здесь можно расширить логику фильтрации
      let results = await productService.searchProducts(updatedFilters.query);
      
      // Применяем фильтры
      if (updatedFilters.priceRange.max < 1000) {
        results = results.filter(p => p.price <= updatedFilters.priceRange.max);
      }
      
      if (updatedFilters.minRating > 0) {
        results = results.filter(p => p.rating >= updatedFilters.minRating);
      }
      
      if (updatedFilters.onSale) {
        results = results.filter(p => p.discount && p.discount > 0);
      }
      
      if (updatedFilters.newArrivals) {
        results = results.filter(p => p.isNew);
      }
      
      if (updatedFilters.highRated) {
        results = results.filter(p => p.rating >= 4.5);
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Filter error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [filters]);

  // Сортировка результатов
  const sortResults = useCallback((sortOption: string) => {
    const sortedResults = [...searchResults];
    
    switch (sortOption) {
      case 'price-asc':
        sortedResults.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedResults.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sortedResults.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popularity':
        sortedResults.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'rating':
        sortedResults.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Релевантность (по умолчанию)
        break;
    }
    
    setSearchResults(sortedResults);
  }, [searchResults]);

  return {
    searchResults,
    isSearching,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    searchByNameAndDescription,
    applyFilters,
    sortResults,
  };
};