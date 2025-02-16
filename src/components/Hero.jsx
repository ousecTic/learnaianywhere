import React from 'react';
import { Link } from 'react-router-dom';
import homeVideo from '../assets/homevideo.gif';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <h1 className="text-4xl font-bold">AI Literacy for Low-Tech Environments</h1>
            <p className="text-lg">Learn AI Anywhere empowers educators to bring AI education to students, even in areas with limited technology access.</p>
            <div className="hero-buttons">
              <Link to="/curriculum" className="primary-btn">View Curriculum</Link>
              <Link to="/about" className="secondary-btn">About Us</Link>
            </div>
          </div>
          <div className="hero-video">
            <img src={homeVideo} alt="Learn AI Anywhere Platform Demo" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
