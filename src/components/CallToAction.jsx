import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2>Ready to Bring AI Education to Your Classroom?</h2>
          <p>Join teachers worldwide in empowering the next generation with essential AI knowledge.</p>
          <div className="cta-buttons">
            <Link to="/curriculum" className="primary-btn">View Curriculum</Link>
            <Link to="/about" className="secondary-btn">About Us</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
