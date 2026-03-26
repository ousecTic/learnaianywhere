import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/shared/Button';
import './IntroToAI.css';
import './CourseSection.css';

const IntroToAI = () => {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isGuideDownloadOpen, setIsGuideDownloadOpen] = useState(false);
  const [isSlidesModalOpen, setIsSlidesModalOpen] = useState(false);
  const [isSlidesDownloadOpen, setIsSlidesDownloadOpen] = useState(false);
  const [isWorksheetDownloadOpen, setIsWorksheetDownloadOpen] = useState(false);
  const [isWorksheetModalOpen, setIsWorksheetModalOpen] = useState(false);
  const [worksheetTab, setWorksheetTab] = useState('blank'); // 'blank' or 'example'

  // Course content data
  const content = {
    teacherGuide: {
      docId: "1HR-jHOO6u2KP2W7AmyYazaIJ5ZlI_Xb1PhFD84oGFXY"
    },
    lessonSlides: {
      presentationId: "1doNrQbeZj2uF44VZ14HBnOxUnAmetZrx9vbTNycjFBQ"
    },
    worksheets: {
      blankDocId: "1dftfmVrvqI3hYJMuCug9KmYF7ZWk1wJH3dpqpXJWju4",
      exampleDocId: "1ciIyvJjLcOVH_wvOesb_S9GYqlYAk3_w95PYW5BXtHA"
    }
  };

  const getGoogleDocUrls = (docId) => ({
    pdf: `https://docs.google.com/document/d/${docId}/export?format=pdf`,
    docx: `https://docs.google.com/document/d/${docId}/export?format=doc`,
    embed: `https://docs.google.com/document/d/${docId}/preview`
  });

  const getGooglePresentationUrls = (presentationId) => ({
    pptx: `https://docs.google.com/presentation/d/${presentationId}/export/pptx`,
    pdf: `https://docs.google.com/presentation/d/${presentationId}/export/pdf`,
    embed: `https://docs.google.com/presentation/d/${presentationId}/preview`
  });

  const getDriveDownloadUrl = (url) => {
    const fileIdMatch = url.match(/\/d\/([^\/]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
    }
    return url;
  };

  const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );

  const teacherGuideUrls = getGoogleDocUrls(content.teacherGuide.docId);
  const lessonSlidesUrls = getGooglePresentationUrls(content.lessonSlides.presentationId);

  return (
    <div className="intro-ai-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <h1>Introduction to Artificial Intelligence</h1>
          <p className="hero-description">
            Students learn what AI is, how machine learning works, and the ethical implications of AI while building their own image classifier. Works completely offline with no prior AI knowledge required.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Featured: Teacher Guide */}
        <section className="featured-guide">
          <div className="featured-header">
            <div className="featured-icon">📚</div>
            <div className="featured-text">
              <h2>Start Here: Teacher Guide</h2>
            </div>
          </div>
          <div className="featured-content">
            <p className="featured-description">Below you'll find a guide on how to teach this material. If you prefer to see the course in action, we have a video course of us teaching it which you can immediately share with students (ages 11+) or watch as an educator to see how we teach the lessons.</p>
            <div className="featured-actions">
              <Button onClick={() => setIsGuideModalOpen(true)} variant="secondary">
                Preview
              </Button>
              <div className="dropdown-wrapper">
                <Button 
                  onClick={() => setIsGuideDownloadOpen(!isGuideDownloadOpen)} 
                  variant="primary"
                >
                  <DownloadIcon /> Download
                </Button>
                {isGuideDownloadOpen && (
                  <div className="dropdown-menu">
                    <a href={teacherGuideUrls.pdf} download className="dropdown-item">
                      <DownloadIcon /> PDF
                    </a>
                    <a href={teacherGuideUrls.docx} download className="dropdown-item">
                      <DownloadIcon /> DOCX
                    </a>
                  </div>
                )}
              </div>
              <Button to="/courses/ai-literacy-for-everyone" variant="primary">
                Video Course →
              </Button>
            </div>
          </div>
        </section>

        {/* What You'll Need */}
        <section className="whats-included">
          <h2>What You'll Need to Teach</h2>
          <div className="included-grid-three">
            <div className="included-card">
              <div className="card-icon">💻</div>
              <h3>Lesson Slides</h3>
              <p>PowerPoint with all 4 lessons ready to teach</p>
              <div className="card-actions">
                <Button onClick={() => setIsSlidesModalOpen(true)} variant="secondary">
                  Preview
                </Button>
                <div className="dropdown-wrapper">
                  <Button 
                    onClick={() => setIsSlidesDownloadOpen(!isSlidesDownloadOpen)} 
                    variant="primary"
                  >
                    <DownloadIcon /> Download
                  </Button>
                  {isSlidesDownloadOpen && (
                    <div className="dropdown-menu">
                      <a href={lessonSlidesUrls.pptx} download className="dropdown-item">
                        <DownloadIcon /> PPTX
                      </a>
                      <a href={lessonSlidesUrls.pdf} download className="dropdown-item">
                        <DownloadIcon /> PDF
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="included-card">
              <div className="card-icon">📱</div>
              <h3>Neuropocket App</h3>
              <p>Students use this app to build their image classifier. Available for Windows and Android (requires 2GB RAM and camera)</p>
              <div className="card-actions">
                <Button href="https://neuropocket.com" variant="primary" target="_blank" rel="noopener noreferrer">
                  Get App →
                </Button>
              </div>
            </div>
            <div className="included-card">
              <div className="card-icon">📝</div>
              <h3>Project Worksheet <span className="optional-badge">(Optional)</span></h3>
              <p>Guides students through designing their classifier</p>
              <div className="card-actions">
                <Button onClick={() => setIsWorksheetModalOpen(true)} variant="secondary">
                  Preview
                </Button>
                <div className="dropdown-wrapper">
                  <Button 
                    onClick={() => setIsWorksheetDownloadOpen(!isWorksheetDownloadOpen)} 
                    variant="primary"
                  >
                    <DownloadIcon /> Download
                  </Button>
                  {isWorksheetDownloadOpen && (
                    <div className="dropdown-menu">
                      <a href={getGoogleDocUrls(content.worksheets.blankDocId).pdf} download className="dropdown-item">
                        <DownloadIcon /> Blank Template (PDF)
                      </a>
                      <a href={getGoogleDocUrls(content.worksheets.exampleDocId).pdf} download className="dropdown-item">
                        <DownloadIcon /> Example (PDF)
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support CTA */}
        <section className="support-cta">
          <h2>Need Additional Support?</h2>
          <p>Our team is here to help you implement these resources effectively in your classroom.</p>
          <Button to="/contact" variant="primary">Contact Support</Button>
        </section>
      </div>

      {/* Teacher Guide Preview Modal */}
      {isGuideModalOpen && (
        <div className="modal-overlay" onClick={() => setIsGuideModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Teacher Guide Preview</h3>
              <button className="modal-close" onClick={() => setIsGuideModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <iframe
                src={teacherGuideUrls.embed}
                title="Teacher Guide Preview"
                width="100%"
                height="600"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Slides Preview Modal */}
      {isSlidesModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSlidesModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Lesson Slides Preview</h3>
              <button className="modal-close" onClick={() => setIsSlidesModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <iframe
                src={lessonSlidesUrls.embed}
                title="Lesson Slides Preview"
                width="100%"
                height="600"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Worksheet Preview Modal */}
      {isWorksheetModalOpen && (
        <div className="modal-overlay" onClick={() => setIsWorksheetModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Project Worksheet Preview</h3>
              <button className="modal-close" onClick={() => setIsWorksheetModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal-tabs">
              <button 
                className={`modal-tab ${worksheetTab === 'blank' ? 'active' : ''}`}
                onClick={() => setWorksheetTab('blank')}
              >
                Blank Template
              </button>
              <button 
                className={`modal-tab ${worksheetTab === 'example' ? 'active' : ''}`}
                onClick={() => setWorksheetTab('example')}
              >
                Example (Filled)
              </button>
            </div>
            <div className="modal-body">
              <iframe
                src={worksheetTab === 'blank' 
                  ? getGoogleDocUrls(content.worksheets.blankDocId).embed
                  : getGoogleDocUrls(content.worksheets.exampleDocId).embed
                }
                title="Worksheet Preview"
                width="100%"
                height="600"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntroToAI;
