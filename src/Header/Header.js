import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';

const cx = classNames.bind(styles);

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  // Kiểm tra chế độ sáng/tối theo thời gian trong ngày
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 19 || currentHour <= 6) {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    } else {
      setDarkMode(false);
      document.body.classList.remove('dark-mode');
    }
  }, []);

  // Thêm hiệu ứng khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        console.log(window.scrollY);

        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevState) => !prevState);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <header className={cx('header', { dark: darkMode, scrolled: scrolling })}>
      <div className={cx('container')}>
        <div className={cx('logo')}>
          <a href="/">MyWebsite</a>
        </div>
        <nav className={cx('navbar', { active: menuOpen })}>
          <ul className={cx('nav-list')}>
            <li className={cx('nav-item')}>
              <a href="#home" className={cx('nav-link')}>
                Home
              </a>
            </li>
            <li className={cx('nav-item')}>
              <a href="#about" className={cx('nav-link')}>
                About
              </a>
            </li>
            <li className={cx('nav-item')}>
              <a href="#services" className={cx('nav-link')}>
                Services
              </a>
            </li>
            <li className={cx('nav-item')}>
              <a href="#contact" className={cx('nav-link')}>
                Contact
              </a>
            </li>
            <li className={cx('nav-item')}>
              <div className={cx('search')}>
                <input type="text" placeholder="Search..." />
                <FaSearch className={cx('search-icon')} />
              </div>
            </li>
          </ul>
        </nav>
        <div className={cx('menu-icon')} onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
        <div className={cx('dark-mode-toggle')} onClick={toggleDarkMode}>
          {darkMode ? '🌙' : '🌞'}
        </div>
      </div>
    </header>
  );
}

export default Header;
