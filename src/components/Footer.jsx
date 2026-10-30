import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/learnAIAnywhere-logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <Link to="/" className="footer-logo">
              <img src={logo} alt="Learn AI Anywhere" />
            </Link>
            <p>Bringing AI literacy education Anywhere, even in areas with limited technology access.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/get-involved">Get Involved</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>AI Lessons</h3>
            <ul>
              <li><Link to="/courses/ai-literacy-for-everyone">AI Literacy for Everyone</Link></li>
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
            <div className="social-media">
              <a href="https://www.linkedin.com/company/learn-ai-anywhere/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Learn AI Anywhere, an IRS 501(c)3 Public Charity (81-1631000). All rights reserved. Unless stated otherwise, the Learn AI Anywhere AI lessons are licensed under a <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a> (the "Learn AI Anywhere Creative Commons license").</p>
          <p style={{ fontSize: '0.85em', color: '#888', marginTop: '4px' }}>
            Design by <a href="http://ktang.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'underline dotted' }}>Karen Tang</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
