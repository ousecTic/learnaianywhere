import React from 'react';
import Button from './shared/Button';

const Features = () => {
  return (
    <section className="features">
      <div className="container">
        <h2>How Learn AI Anywhere Works</h2>
        <p>Our AI literacy lessons are built for these realities. Offline-first, mobile-friendly, and paired with video guidance for teachers and students, they're designed to work in any environment.</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Offline-First</h3>
            <p>Download once and teach anywhere, no internet required.</p>
            <Button to="/curriculum/intro-to-ai" variant="text">Get Started →</Button>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile-Friendly</h3>
            <p>Access and deliver our AI lessons on any device - mobile, tablet, or desktop.</p>
            <Button to="/curriculum/intro-to-ai" variant="text">Get Started →</Button>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎥</div>
            <h3>Video Guidance</h3>
            <p>Videos to guide educators on delivering our AI lessons offline and online.</p>
            <Button to="/courses/ai-literacy-for-everyone" variant="text">Watch Videos →</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
