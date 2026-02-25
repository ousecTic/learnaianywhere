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
              </p>
              
              <p>
                We're working with <a href="https://learningequality.org" target="_blank" rel="noopener noreferrer">learningequality.org</a> to 
                make this available on Kolibri, so it can reach learners in offline and limited-resource 
                settings.
              </p>

              <h3>What's Included:</h3>
              <ul className="features-list">
                <li>Guided video lessons (we model it)</li>
                <li>Self-paced learning (1 hour total)</li>
                <li>For students ages 11+ and educators</li>
                <li>Works offline via Kolibri platform</li>
              </ul>

              <div className="back-link">
                <p>Follow the written instructions, then give it a try!</p>
                <Link to="/curriculum/intro-to-ai" className="download-link">
                  <span className="download-icon">📥</span>
                  Download the lesson materials
                </Link>
              </div>
            </div>

            {/* Right Column - Signup Box */}
            <div className="signup-box">
              <div className="signup-content">
                <h3>Access This Course</h3>
                <p>
                  Fill out this Google Form to access the course.
                </p>

                <Button 
                  href="https://forms.gle/sazrZAv2E3xkEF2M6" 
                  variant="primary" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="signup-button"
                >
                  Sign Up →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILiteracyForEveryone;
