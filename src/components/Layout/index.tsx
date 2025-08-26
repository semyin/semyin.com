import React, { useState } from 'react';
import { Header } from '../Header';
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';
import { BackToTop } from '../BackToTop';
import { SearchModal } from '../SearchModal';
import styles from './index.module.css';

interface ArticleListItem {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface LayoutProps {
  children: React.ReactNode;
  articles?: ArticleListItem[];
}

export const Layout: React.FC<LayoutProps> = ({ children, articles = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={styles.pageWrapper}>
      <Header onSearchClick={openSearchModal} />
      <Navigation />
      
      <main className={styles.mainContent}>
        {children}
      </main>
      
      <Footer />
      <BackToTop />
      
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        articles={articles}
      />
    </div>
  );
};