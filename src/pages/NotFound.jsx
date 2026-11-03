import React from 'react';
import Button from '../components/shared/Button';

// Shown for any address the site doesn't have. It borrows the Contact page's
// layout, so it needs no styles of its own.
const NotFound = () => (
  <div className="contact-page">
    <div className="container">
      <div className="contact-content">
        <h1>Page not found</h1>
        <p>This page doesn&rsquo;t exist, or it has moved.</p>
        <div className="email-container">
          <Button variant="primary" to="/courses/ai-literacy-for-everyone">See the course</Button>
          <Button variant="secondary" to="/">Go to the home page</Button>
        </div>
      </div>
    </div>
  </div>
);

export default NotFound;
