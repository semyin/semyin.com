import { useState, useEffect, useCallback } from 'react';

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof localStorage !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return { theme, toggleTheme };
};

export const useBackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return { isVisible, scrollToTop };
};

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const history = localStorage.getItem('searchHistory');
        setSearchHistory(history ? JSON.parse(history) : []);
      } catch (e) {
        setSearchHistory([]);
      }
    }
  }, []);

  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return;

    const newHistory = searchHistory.filter(item => item.query !== query.trim());
    newHistory.unshift({
      query: query.trim(),
      timestamp: Date.now()
    });

    const limitedHistory = newHistory.slice(0, 10);
    setSearchHistory(limitedHistory);

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('searchHistory', JSON.stringify(limitedHistory));
      } catch (e) {
        console.error('保存搜索历史失败:', e);
      }
    }
  }, [searchHistory]);

  const removeFromHistory = useCallback((query: string) => {
    const newHistory = searchHistory.filter(item => item.query !== query);
    setSearchHistory(newHistory);

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      } catch (e) {
        console.error('删除搜索历史失败:', e);
      }
    }
  }, [searchHistory]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem('searchHistory');
      } catch (e) {
        console.error('清除搜索历史失败:', e);
      }
    }
  }, []);

  return {
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory
  };
};