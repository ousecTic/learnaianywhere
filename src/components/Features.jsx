import React from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  return (
    <section className="features">
      <div className="container">
        <h2>How Learn AI Anywhere Works</h2>
        <p>Our offline-first, project-based, mobile-friendly curriculum empowers educators to bring AI literacy to students in low-tech environments.</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Project-Based</h3>
            <p>Learn AI through hands-on team projects that foster collaboration and real-world problem solving</p>
            <Link to="/curriculum" className="view-more">Get Started →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile-Friendly</h3>
            <p>Access the curriculum on any device - mobile, tablet, or desktop. Works offline once apps are downloaded</p>
            <Link to="/curriculum" className="view-more">Get Started →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Offline-First</h3>
            <p>Designed for low-tech environments with minimal requirements to make AI education available to everyone</p>
            <Link to="/curriculum" className="view-more">Get Started →</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
