import React from 'react';
import Button from './shared/Button';
import homeVideo from '../assets/home-video.gif';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <h1 className="text-4xl font-bold">AI Education That Works Anywhere</h1>
            <p className="text-lg">Offline first AI lessons that work in fully connected classrooms and areas with limited technology access.</p>
            <div className="hero-buttons">
              <Button to="/curriculum" variant="primary">View AI Lessons</Button>
              <Button to="/about" variant="secondary">About Us</Button>
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
