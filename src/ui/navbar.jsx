import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './navbar.module.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <div className={styles.logo}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Kuppi.<span className={styles.lk}>LK</span>
          </Link>
        </div>
        <div className={styles.navLinks}>
          <Link 
            to="/home" 
            className={`${styles.navLink} ${location.pathname === '/home' || location.pathname === '/' ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/popular" 
            className={`${styles.navLink} ${location.pathname === '/popular' ? styles.active : ''}`}
          >
            Popular Sessions
          </Link>
          <Link 
            to="/about" 
            className={`${styles.navLink} ${location.pathname === '/about' ? styles.active : ''}`}
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            className={`${styles.navLink} ${location.pathname === '/contact' ? styles.active : ''}`}
          >
            Contact Us
          </Link>
        </div>
        <div className={styles.navRight}>
          <div className={styles.langSelect}>
            <span>En</span>
            <span className={styles.globe}>🌐</span>
            <span className={styles.dropdown}>▼</span>
          </div>
          <Link to="/login" className={styles.loginBtn}>Log in</Link>
          <Link to="/signup" className={styles.signupBtn}>Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;