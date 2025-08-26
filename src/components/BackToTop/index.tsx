import React from 'react';
import { useBackToTop } from '@/hooks/useUI';
import styles from './index.module.css';

export const BackToTop: React.FC = () => {
  const { isVisible, scrollToTop } = useBackToTop();

  return (
    <button
      className={`${styles.backToTop} ${isVisible ? styles.visible : ''}`}
      title="返回顶部"
      onClick={scrollToTop}
    />
  );
};