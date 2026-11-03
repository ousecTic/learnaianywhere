import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from './shared/Button';
import logo from '../assets/learnAIAnywhere-logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar" ref={navRef}>
      <div className="container">
        <Link to="/" className="logo">
          <img src={logo} alt="Learn AI Anywhere" style={{ width: '180px', height: 'auto' }} />
        </Link>

        <button type="button" className="menu-btn" onClick={toggleMenu} aria-label="Menu" aria-expanded={isMenuOpen}>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <div className={`nav-item-dropdown ${isDropdownOpen ? 'open' : ''}`}>
            <button type="button" className="nav-item" onClick={toggleDropdown} aria-expanded={isDropdownOpen}>
              AI Courses
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
                style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div className="dropdown-content">
              <Link to="/courses/ai-literacy-for-everyone" onClick={closeAll}>AI Literacy for Everyone</Link>
              <Link to="/curriculum/intro-to-generative-ai" onClick={closeAll}>Introduction to Generative AI</Link>
            </div>
          </div>
          <Link to="/get-involved" className="nav-link" onClick={closeAll}>Get Involved</Link>
          <Link to="/about" className="nav-link" onClick={closeAll}>About Us</Link>
          <Link to="/donate" className="nav-link" onClick={closeAll}>Donate</Link>
          <Button to="/contact" variant="primary" size="small" onClick={closeAll}>Contact</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
