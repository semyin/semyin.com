import React, { useEffect } from 'react';
import { useSearchHistory } from '@/hooks/useUI';
import styles from './index.module.css';

interface ArticleListItem {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  articles: ArticleListItem[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  articles
}) => {
  const { searchHistory, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      addToHistory(query);
    }
  };

  const searchFromHistory = (query: string) => {
    onSearchChange(query);
    addToHistory(query);
  };

  const filteredArticles = searchQuery && articles
    ? articles.filter((article: ArticleListItem) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const highlightSearchTerm = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={index}
          style={{
            background: 'var(--accent-color)',
            color: 'white',
            padding: '0.1rem 0.2rem',
            borderRadius: '3px'
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className={`${styles.searchOverlay} ${styles.active}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.searchModal}>
        <div className={styles.searchModalHeader}>
          <input
            type="text"
            className={styles.searchModalInput}
            placeholder="搜索文章..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit(searchQuery);
              }
            }}
            autoFocus
          />
          <button className={styles.searchClose} onClick={onClose}>✕</button>
        </div>

        {/* 搜索历史 */}
        {searchHistory.length > 0 && !searchQuery && (
          <div className={styles.searchHistory} style={{ display: 'block' }}>
            <div className={styles.searchHistoryHeader}>
              <span className={styles.searchHistoryTitle}>搜索历史</span>
              <button className={styles.searchHistoryClear} onClick={clearHistory}>清除</button>
            </div>
            <div className={styles.searchHistoryContent}>
              {searchHistory.map((item) => (
                <span
                  key={item.query}
                  className={styles.searchHistoryItem}
                  onClick={() => searchFromHistory(item.query)}
                >
                  {item.query}
                  <button
                    className={styles.searchHistoryDelete}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(item.query);
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.searchResults}>
          <div className={styles.searchResultsContent}>
            {searchQuery && filteredArticles.length === 0 ? (
              <div className={styles.searchNoResults}>
                未找到匹配 "{searchQuery}" 的文章
              </div>
            ) : searchQuery && filteredArticles.length > 0 ? (
              filteredArticles.map((article: ArticleListItem) => (
                <div
                  key={article.id}
                  className={styles.searchResultItem}
                  onClick={() => {
                    window.location.href = `/article/${article.id}`;
                    onClose();
                  }}
                >
                  <div className={styles.searchResultTitle}>
                    {highlightSearchTerm(article.title, searchQuery)}
                  </div>
                  <div className={styles.searchResultMeta}>
                    <span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};