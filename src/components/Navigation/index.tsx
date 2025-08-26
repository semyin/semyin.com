import React from 'react';
import { NavLink } from 'react-router';
import styles from './index.module.css';

export const Navigation: React.FC = () => {
  return (
    <nav className={styles.mainNav}>
      <div className="container">
        <div className={styles.navLinks}>
          <NavLink 
            to="/categories" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            分类
          </NavLink>
          <NavLink 
            to="/tags" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            标签
          </NavLink>
          <a href="#" className={styles.navLink}>RSS</a>
          <NavLink 
            to="/about" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            关于
          </NavLink>
        </div>
      </div>
    </nav>
  );
};