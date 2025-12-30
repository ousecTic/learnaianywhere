import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/shared/Button';
import './AILiteracyForEveryone.css';

const AILiteracyForEveryone = () => {
  // Extract Google Drive file ID for embedding
  const driveFileId = '1vitkG1eQ_6ks_EDyIg_ko6OfzTPrfg2i';
  const videoEmbedUrl = `https://drive.google.com/file/d/${driveFileId}/preview`;

  return (
    <div className="ai-literacy-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="header-badge">BETA</div>
          <h1>AI Literacy for Everyone</h1>
          <p className="subtitle">A video course based on our Introduction to AI curriculum</p>
        </div>
      </div>

      {/* Video Trailer Section */}
      <div className="video-section">
        <div className="container">
          <div className="video-wrapper">
            <iframe
              src={videoEmbedUrl}
              title="AI Literacy for Everyone - Course Trailer"
              allow="autoplay"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          <div className="content-grid">
            {/* Left Column - Course Info */}
            <div className="course-info">
              <h2>About the Course</h2>
              <p>
                If you prefer learning by watching, we've created a 1-hour video course based on this 
                Introduction to AI curriculum. This is designed for ages 11+ and educators needing 
                guidance on how to implement the course in their own environments.
              </p>
              
              <p>
                We're working with <a href="https://learningequality.org" target="_blank" rel="noopener noreferrer">learningequality.org</a> to 
                make this available on Kolibri, so it can reach learners in offline and limited-resource 
                settings.
              </p>

              <h3>What's Included:</h3>
              <ul className="features-list">
                <li>Guided video lessons (we teach you)</li>
                <li>Self-paced learning (1 hour total)</li>
                <li>Designed for ages 11+ and educators</li>
                <li>Works offline via Kolibri platform</li>
              </ul>

              <div className="back-link">
                <p>
                  Prefer to teach it yourself? <Link to="/curriculum/intro-to-ai">Download the lesson materials</Link>
                </p>
              </div>
            </div>

            {/* Right Column - Beta Signup Box */}
            <div className="signup-box">
              <div className="signup-content">
                <h3>Join Beta Testing</h3>
                <p>
                  Beta testers who complete the course and share feedback by <strong>February 13, 2026</strong> will 
                  receive a contributor certificate and badge.
                </p>
                
                <div className="signup-benefits">
                  <div className="benefit-item">
                    <span className="benefit-icon">🎓</span>
                    <span>Contributor Certificate</span>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">🏅</span>
                    <span>Digital Badge</span>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">🌟</span>
                    <span>Early Access</span>
                  </div>
                </div>

                <Button 
                  href="https://forms.gle/sazrZAv2E3xkEF2M6" 
                  variant="primary" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="signup-button"
                >
                  Sign Up for Beta Testing →
                </Button>

                <p className="deadline-note">
                  Deadline: February 13, 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILiteracyForEveryone;
