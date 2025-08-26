import React from 'react';
import { useTheme } from '@/hooks/useUI';
import styles from './index.module.css';

interface HeaderProps {
  onSearchClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
  const { toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <h1 className={styles.siteTitle}>简约博客</h1>
        <div className={styles.headerRight}>
          <div className={styles.actions}>
            <button 
              className={styles.searchToggle} 
              title="搜索" 
              onClick={onSearchClick}
            >
              🔍
            </button>
            <button 
              className={styles.themeToggle} 
              title="切换主题" 
              onClick={toggleTheme}
            />
          </div>
        </div>
      </div>
    </header>
  );
};