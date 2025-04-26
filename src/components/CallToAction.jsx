import React from 'react';
import Button from './shared/Button';

const CallToAction = () => {
  return (
    <div className="cta-section">
      <div className="container">
        <h2>Ready to Make a Difference?</h2>
        <p>Join us in bringing AI literacy education Anywhere, even in areas with limited technology access.</p>
        <Button to="/contact" variant="primary">Contact Us</Button>
      </div>
    </div>
  );
};

export default CallToAction;
