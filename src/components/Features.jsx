import React from 'react';
import Button from './shared/Button';

const Features = () => {
  return (
    <section className="features">
      <div className="container">
        <h2>How Learn AI Anywhere Works</h2>
        <p>Our offline-first, project-based, mobile-friendly AI lessons empower educators to teach AI - completely beginner-friendly for both students and teachers</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Offline-First</h3>
            <p>Teach AI effectively in low-tech environments with minimal technical requirements and ready-to-use lesson plans</p>
            <Button to="/curriculum/intro-to-ai" variant="text">Get Started →</Button>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile-Friendly</h3>
            <p>Access and deliver our AI lessons on any device - mobile, tablet, or desktop. Works offline once apps are downloaded</p>
            <Button to="/curriculum/intro-to-ai" variant="text">Get Started →</Button>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Progressive Worksheets</h3>
            <p>Students build practical AI projects like image classifiers and learn how to effectively prompt and engage with language models through guided worksheets</p>
            <Button to="/curriculum/intro-to-ai" variant="text">Get Started →</Button>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Beginner-Friendly</h3>
            <p>Extremely accessible content that requires minimal AI knowledge. Educators should review materials beforehand, but no prior expertise is needed</p>
            <Button to="/curriculum/intro-to-ai" variant="text">Get Started →</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
