import React, { useEffect } from 'react';
import './Donation.css';
import classroomWorkshop from '../assets/images/about/classroom-workshop.png';

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
              Your support enables our distributed team to continuously test and refine our curriculum across diverse environments worldwide, ensuring AI education works anywhere.
            </p>
            <div className="donation-image-container">
              <img 
                src={classroomWorkshop} 
                alt="Students in a classroom learning AI literacy" 
                className="donation-impact-image"
              />
              <p className="donation-image-caption">One of our volunteer educators teaching new resources</p>
            </div>
            <div className="impact-summary">
              <p>No matter the size, your contribution helps us reach more learners and ensure AI literacy is available to anyone, anywhere.</p>
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
