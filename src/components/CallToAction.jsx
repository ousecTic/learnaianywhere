import React from 'react';
import Button from './shared/Button';

const CallToAction = () => {
  return (
    <div className="cta-section">
      <h2>Ready to Make a Difference?</h2>
      <p>Join us in our mission to bring AI literacy to underserved communities worldwide.</p>
      <Button to="/contact" variant="primary">Contact Us</Button>
    </div>
  );
};

export default CallToAction;
