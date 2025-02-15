import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close menu if click is outside navbar and menu is open
      if (navRef.current && !navRef.current.contains(event.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    // Close menu when clicking anywhere on mobile
    document.addEventListener('mousedown', handleClickOutside);
    
    // Close menu when scrolling (common mobile pattern)
    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar" ref={navRef}>
      <div className="container">
        <Link to="/" className="logo">
          <img src={logo} alt="Learn AI Anywhere" />
        </Link>

        <button className="menu-btn" onClick={toggleMenu}>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <div className="nav-item-dropdown">
            <Link to="/curriculum" className="nav-item">
              Curriculum
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="dropdown-arrow"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </Link>
            <div className="dropdown-content">
              <Link to="/curriculum/intro-to-ai">Introduction to AI</Link>
              <Link to="/curriculum/intro-to-generative-ai">Introduction to Generative AI</Link>
            </div>
          </div>
          <Link to="/get-involved" className="nav-link">Get Involved</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/contact" className="contact-btn">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
