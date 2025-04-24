import React from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  return (
    <section className="features">
      <div className="container">
        <h2>How Learn AI Anywhere Works</h2>
        <p>Our offline-first, project-based, mobile-friendly curriculum empowers educators to teach AI - no prior AI experience needed. We provide comprehensive teaching guides and support every step of the way.</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>No AI Experience Needed</h3>
            <p>Step-by-step teaching guides and detailed lesson plans help you confidently teach AI concepts, even if you're new to the subject</p>
            <Link to="/curriculum" className="view-more">Get Started →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Project-Based</h3>
            <p>Guide students through collaborative team projects that develop real-world AI problem-solving skills</p>
            <Link to="/curriculum" className="view-more">Get Started →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile-Friendly</h3>
            <p>Access and deliver the curriculum on any device - mobile, tablet, or desktop. Works offline once apps are downloaded</p>
            <Link to="/curriculum" className="view-more">Get Started →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Offline-First</h3>
            <p>Teach AI effectively in low-tech environments with minimal technical requirements and ready-to-use lesson plans</p>
            <Link to="/curriculum" className="view-more">Get Started →</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
