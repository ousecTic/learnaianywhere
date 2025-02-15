import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Learn AI Anywhere</h3>
            <p>Bringing AI literacy to underserved communities worldwide.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/curriculum">Curriculum</Link></li>
              <li><Link to="/get-involved">Get Involved</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Curriculum</h3>
            <ul>
              <li><Link to="/curriculum/intro-to-ai">Introduction to AI</Link></li>
              <li><Link to="/curriculum/intro-to-generative-ai">Introduction to Generative AI</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Connect</h3>
            <ul>
              <li><Link to="/get-involved">Volunteer</Link></li>
              <li><Link to="/get-involved">Partner with Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Learn AI Anywhere, an IRS 501(c)3 Public Charity (81-1631000). All rights reserved. Unless stated otherwise, the Learn AI Anywhere curriculum is licensed under a <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a> (the "Learn AI Anywhere Creative Commons license").</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
