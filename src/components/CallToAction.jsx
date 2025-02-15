import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <div className="cta-section">
      <h2>Ready to Make a Difference?</h2>
      <p>Join us in our mission to bring AI literacy to underserved communities worldwide.</p>
      <Link to="/contact" className="btn-primary">Contact Us</Link>
    </div>
  );
};

export default CallToAction;
