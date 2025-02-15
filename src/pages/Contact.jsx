import React, { useState } from 'react';

const Contact = () => {
  const email = 'contact@learnaianywhere.org';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-content">
          <h1>Contact Us</h1>
          <p>Have questions or want to get involved? We'd love to hear from you.</p>
          
          <div className="contact-info">
            <p>Whether you're interested in volunteering, partnerships, or have general questions about Learn AI Anywhere, please reach out to us at:</p>
            
            <div className="email-container">
              <span className="email">{email}</span>
              <button 
                className="copy-btn"
                onClick={handleCopy}
              >
                {copied ? 'Copied!' : 'Copy Email'}
              </button>
            </div>

            <div className="contact-details">
              <h2>What to Include</h2>
              <p>To help us better assist you, please include in your email:</p>
              <ul>
                <li>Your name</li>
                <li>Your area of interest (Volunteering, Partnerships, General Inquiry, etc.)</li>
                <li>A brief description of how you'd like to get involved</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
