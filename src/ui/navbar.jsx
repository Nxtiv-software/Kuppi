import React from 'react';
import styles from './navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <div className={styles.logo}>
          Kuppi.<span className={styles.lk}>LK</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#home" className={styles.navLink}>Home</a>
          <a href="#popular" className={styles.navLink}>Popular Sessions</a>
          <a href="#about" className={styles.navLink}>About Us</a>
          <a href="#contact" className={styles.navLink}>Contact Us</a>
        </div>
        <div className={styles.navRight}>
          <div className={styles.langSelect}>
            <span>En</span>
            <span className={styles.globe}>🌐</span>
            <span className={styles.dropdown}>▼</span>
          </div>
          <a href="#login" className={styles.loginBtn}>Log in</a>
          <a href="#signup" className={styles.signupBtn}>Sign Up</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;