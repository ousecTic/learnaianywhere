import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <Link to="/" className="footer-logo">
              <img src={logo} alt="Learn AI Anywhere" />
            </Link>
            <p>Making AI education accessible to everyone,
            everywhere.</p>
          </div>
          <div className="footer-section">
            <h4>Platform</h4>
            <Link to="/curriculum">Our Curriculum</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/about">About Us</Link>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <Link to="/lesson-plans">Lesson Plans</Link>
            <Link to="/activities">Activities</Link>
            <Link to="/guides">Teacher Guides</Link>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <Link to="/contact">Get in Touch</Link>
            <Link to="/support">Support</Link>
            <Link to="/faqs">FAQs</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="text-center"> {currentYear} Learn AI Anywhere, an IRS 501(c)3 Public Charity (81-1631000). All rights reserved. Unless stated otherwise, the Learn AI Anywhere curriculum is licensed under a <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a> (the "Learn AI Anywhere Creative Commons license").</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
