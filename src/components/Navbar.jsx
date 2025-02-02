import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            <img src={logo} alt="Learn AI Anywhere" />
          </Link>
          <button className="mobile-menu-button" onClick={toggleMenu} aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/curriculum">Curriculum</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact" className="contact-btn">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
