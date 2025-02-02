import React from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  return (
    <section className="features">
      <div className="container">
        <h2>How Learn AI Anywhere Works</h2>
        <p>Our platform empowers teachers to bring AI education to high school students in low-tech environments through adaptable, engaging lessons.</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Access Curriculum</h3>
            <p>Teachers can access our comprehensive AI
            daily lessons, activities, and resources</p>
            <Link to="/curriculum" className="view-more">View More →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Teach AI Concepts</h3>
            <p>Use our lesson plans to deliver engaging lessons on core AI concepts and principles</p>
            <Link to="/teach" className="view-more">View More →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Engage & Inspire Students</h3>
            <p>Implement hands-on activities and discussions to
            make AI learning accessible and engaging</p>
            <Link to="/engage" className="view-more">View More →</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
