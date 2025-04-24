import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Timeline.css';
import './IntroToAI.css';
import Overview from '../components/course/week1/Overview';

const IntroToAI = () => {

  return (
    <div className="week-page">
      <div className="week-header">
        <div className="container">
          <h1>Introduction to Artificial Intelligence</h1>
          <p>A foundational course providing students with an understanding of artificial intelligence (AI) concepts through hands-on experience.</p>
        </div>
      </div>

      <div className="container">
        <div className="tab-content">
          <Overview />
        </div>

        <div className="support-section">
          <h2>Need Additional Support?</h2>
          <p>Our team is here to help you implement these resources effectively in your classroom.</p>
          <div className="support-buttons">
            <Link to="/contact" className="primary-btn">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroToAI;
