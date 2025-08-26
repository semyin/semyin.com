import React from 'react';
import styles from './index.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.copyright}>&copy; 2024 简约博客. 专注内容，简约至上.</p>
      </div>
    </footer>
  );
};