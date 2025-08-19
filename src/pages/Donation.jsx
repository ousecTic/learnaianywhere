import React, { useEffect } from 'react';
import './Donation.css';

const Donation = () => {
  useEffect(() => {
    // Load DonorBox script
    const script = document.createElement('script');
    script.src = 'https://donorbox.org/widget.js';
    script.setAttribute('paypalExpress', 'false');
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://donorbox.org/widget.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="donation-page">
      {/* Hero Section */}
      <div className="donation-hero">
        <div className="container">
          <div className="donation-header">
            <h1>Support Learn AI Anywhere</h1>
            <p className="donation-subtitle">
              Help us make AI education accessible to anyone, anywhere
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="donation-content">
          <div className="donation-info">
            <h2>How Your Donation Helps</h2>
            <p className="donation-description">
              Every dollar you contribute directly supports our mission to bring AI education to limited-resource communities. Here's the tangible impact of your generosity:
            </p>
            <div className="impact-grid">
              <div className="impact-item">
                <div className="impact-visual">
                  <div className="impact-amount">$10</div>
                  <div className="impact-icon-large">📚</div>
                </div>
                <div className="impact-content">
                  <h3>Student Materials</h3>
                  <p>Covers printing 250 student worksheets for projects.</p>
                </div>
              </div>
              <div className="impact-item">
                <div className="impact-visual">
                  <div className="impact-amount">$20</div>
                  <div className="impact-icon-large">🎓</div>
                </div>
                <div className="impact-content">
                  <h3>Workshop Day</h3>
                  <p>Helps us run a full-day free AI Literacy student workshop.</p>
                </div>
              </div>
              <div className="impact-item">
                <div className="impact-visual">
                  <div className="impact-amount">$30</div>
                  <div className="impact-icon-large">📱</div>
                </div>
                <div className="impact-content">
                  <h3>Testing & Donation</h3>
                  <p>Buys a basic phone we use for testing, then donate to a school in need.</p>
                </div>
              </div>
            </div>
            <div className="impact-summary">
              <h3>Making AI Education Accessible</h3>
              <p>Your support helps us test our curriculum in real-world settings and provide resources directly to schools that need them most. Together, we're building a future where AI literacy is available to anyone, anywhere.</p>
            </div>
          </div>

          <div className="donation-widget">
            <div className="widget-container">
              <iframe 
                src="https://donorbox.org/embed/learn-ai-anywhere?show_content=true" 
                name="donorbox" 
                allowPaymentRequest="allowpaymentrequest" 
                seamless="seamless" 
                frameBorder="0" 
                scrolling="no" 
                height="900px" 
                width="100%" 
                style={{
                  maxWidth: '500px', 
                  minWidth: '250px', 
                  maxHeight: 'none !important'
                }} 
                allow="payment"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Donation;
