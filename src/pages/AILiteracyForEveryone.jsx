import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/shared/Button';
import './AILiteracyForEveryone.css';
import youtubeLogo from '../assets/images/logos/youtube-logo.png';
import kolibriLogo from '../assets/images/logos/learning-equality-logo.svg';
import laiaLogo from '../assets/images/logos/laia-logo.jpg';

const AILiteracyForEveryone = () => {
  // Extract Google Drive file ID for embedding
  const driveFileId = '1vitkG1eQ_6ks_EDyIg_ko6OfzTPrfg2i';
  const videoEmbedUrl = `https://drive.google.com/file/d/${driveFileId}/preview`;

  return (
    <div className="ai-literacy-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
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
                We know circumstances vary, so we created an easy-to-access, downloadable video version
                of our course. This one-hour video course is based on our Introduction to AI lessons and
                is designed to help students ages 11 and up learn AI fundamentals. Educators can also use
                this course to see how the lessons are taught and adapt them for their own classrooms.
                Follow the written instructions, then give it a try! You can also{' '}
                <Link to="/curriculum/intro-to-ai">download the lesson materials</Link>.
              </p>

              <h3>What's Included:</h3>
              <ul className="features-list">
                <li>Guided video lessons (we model it)</li>
                <li>Self-paced learning (1 hour total)</li>
                <li>For students ages 11+ and educators</li>
                <li>Works offline via Kolibri platform</li>
              </ul>
            </div>

            {/* Right Column - Access Options */}
            <div className="access-options-section">
              <h2 className="access-title">Choose How to Access the Course</h2>
              
              <div className="access-panels">
                {/* Panel 1: YouTube */}
                <div className="access-panel">
                  <img src={youtubeLogo} alt="YouTube" className="panel-logo" />
                  <h3>Watch Online</h3>
                  <p>Stream the course on YouTube</p>
                  <Button 
                    href="https://www.youtube.com/watch?v=tchN4xa4pfg" 
                    variant="primary" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="panel-button"
                  >
                    Watch Now →
                  </Button>
                </div>

                {/* Panel 2: Learning Equality */}
                <div className="access-panel">
                  <img src={kolibriLogo} alt="Learning Equality" className="panel-logo" />
                  <h3>Use Offline</h3>
                  <p>Access via Kolibri platform</p>
                  <div className="platform-links">
                    <a 
                      href="https://docs.google.com/document/d/10xXu_L2pvKAAREcTpuIpC9y6eGcPKi1L_rVNcicWPOg/edit?usp=sharing" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="platform-link"
                    >
                      Windows / macOS →
                    </a>
                    <a 
                      href="https://docs.google.com/document/d/1y9YVa08yoA3LaydCHUS5YfOz9vvb5bnPkW4U_111QBk/edit?usp=sharing" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="platform-link"
                    >
                      Android →
                    </a>
                  </div>
                </div>

                {/* Panel 3: Download ZIP */}
                <div className="access-panel">
                  <img src={laiaLogo} alt="Learn AI Anywhere" className="panel-logo" />
                  <h3>Download All Videos</h3>
                  <p>Get the ZIP file with all videos</p>
                  <Button 
                    href="https://drive.google.com/file/d/1zRTVzgzZwVCtij55JnFTLtPFwsSlZo-t/view?usp=sharing" 
                    variant="primary" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="panel-button"
                  >
                    Download →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILiteracyForEveryone;
