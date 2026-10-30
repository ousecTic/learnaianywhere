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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
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

  return (
    <nav className="navbar" ref={navRef}>
      <div className="container">
        <Link to="/" className="logo">
          <img src={logo} alt="Learn AI Anywhere" style={{ width: '180px', height: 'auto' }} />
        </Link>

        <button className="menu-btn" onClick={toggleMenu}>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <div className={`nav-item-dropdown ${isDropdownOpen ? 'open' : ''}`}>
            <span className="nav-item" onClick={toggleDropdown}>
              AI Lessons
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
            </span>
            <div className="dropdown-content">
              <Link to="/courses/ai-literacy-for-everyone" onClick={() => setIsMenuOpen(false)}>AI Literacy for Everyone</Link>
              <Link to="/curriculum/intro-to-generative-ai" onClick={() => setIsMenuOpen(false)}>Introduction to Generative AI</Link>
            </div>
          </div>
          <Link to="/get-involved" className="nav-link" onClick={() => setIsMenuOpen(false)}>Get Involved</Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About Us</Link>
          <Link to="/donate" className="nav-link" onClick={() => setIsMenuOpen(false)}>Donate</Link>
          <Button to="/contact" variant="primary" size="small" onClick={() => setIsMenuOpen(false)}>Contact</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
