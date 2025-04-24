import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Timeline.css';
import './IntroToAI.css';

// Accordion component moved from Overview.jsx
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`accordion ${isOpen ? 'open' : ''}`}>
      <button 
        className="accordion-header" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h2>{title}</h2>
        <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
      </button>
      <div className={`accordion-content ${isOpen ? 'show' : ''}`}>
        {children}
      </div>
    </div>
  );
};

const IntroToAI = () => {
  // Course content data moved from Overview.jsx
  const content = {
    overview: {
      title: "Overview",
      mainObjective: "Students will learn to build their own AI image classifier while gaining hands-on experience with artificial intelligence concepts.",
      keyOutcomes: [
        "Build and train a custom image classifier",
        "Understand core AI concepts through hands-on activities",
        "Learn how to collect and prepare data for AI models",
        "Gain practical experience with real AI tools"
      ],
      approach: "Through guided activities and hands-on projects, you'll learn AI concepts by doing, not just reading. Each day builds on the previous one, leading to your own working AI model."
    },
    setup: {
      title: "Setup",
      items: [
        {
          text: "Basic Requirements",
          subitems: [
            "Computer with PowerPoint for presentations",
            "Android phones/tablets or computers for running apps",
            {
              type: "note",
              content: "Students work in teams and can share devices. iOS/Apple devices have limited support."
            },
            "Internet connection for initial app downloads",
            "Notebooks and writing materials"
          ]
        },
        {
          text: "Preparation",
          subitems: [
            "Download required apps before class (works offline after installation)",
            "Ensure each student has the worksheet or can copy questions in their notebook",
            {
              type: "tip",
              content: "Pro Tip: Review all lessons and download apps in advance for a smoother experience."
            }
          ]
        }
      ]
    },
    lessonPlan: {
      title: "Lesson Plan",
      presentationId: "1fdyUyrwimfpUbtm3plBn_yMd7GElq5JGacIXnFJ7ry0" // Updated presentation ID
    },
    projectWorksheet: {
      title: "Project Worksheet",
      docId: "1rWrdbg78nggEbtYnVz0giyQDjm0KpjuuZDZ87i3JONo"
    }
  };

  const getGoogleDocUrls = (docId) => ({
    pdf: `https://docs.google.com/document/d/${docId}/export?format=pdf`,
    embed: `https://docs.google.com/document/d/${docId}/preview`
  });

  const getGooglePresentationUrls = (presentationId) => ({
    pptx: `https://docs.google.com/presentation/d/${presentationId}/export/pptx`,
    pdf: `https://docs.google.com/presentation/d/${presentationId}/export/pdf`,
    embed: `https://docs.google.com/presentation/d/${presentationId}/preview`
  });

  const renderWorksheetSection = () => {
    const { projectWorksheet } = content;
    const urls = getGoogleDocUrls(projectWorksheet.docId);
    
    return (
      <div className="worksheet-container">
        <div className="worksheet-header">
          <a 
            href={urls.pdf}
            className="worksheet-download"
            download
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download PDF
          </a>
        </div>
        <div className="worksheet-preview">
          <iframe
            src={urls.embed}
            title={projectWorksheet.title}
            width="100%"
            height="842"
            frameBorder="0"
          ></iframe>
        </div>
      </div>
    );
  };

  const renderLessonPlanSection = () => {
    const { lessonPlan } = content;
    const urls = getGooglePresentationUrls(lessonPlan.presentationId);
    
    return (
      <div className="lesson-plan-container">
        <div className="presentation-header">
          <div className="download-options">
            <a 
              href={urls.pptx}
              className="presentation-download pptx"
              download
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PowerPoint
            </a>
            <a 
              href={urls.pdf}
              className="presentation-download pdf"
              download
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PDF
            </a>
          </div>
        </div>
        <div className="presentation-preview">
          <iframe
            src={urls.embed}
            title={lessonPlan.title}
            width="100%"
            height="500"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  };

  const renderRequirementsList = (items) => {
    return items.map((item, index) => {
      if (typeof item === 'string') {
        return <li key={index}>{item}</li>;
      }
      return <li key={index} data-type={item.type}>{item.content}</li>;
    });
  };

  return (
    <div className="week-page">
      <div className="week-header">
        <div className="container">
          <h1>Introduction to Artificial Intelligence</h1>
          <p>A foundational course providing students with an understanding of artificial intelligence (AI) concepts through hands-on experience.</p>
        </div>
      </div>

      <div className="container">
        <div className="tab-content">
          <div className="overview-content">
            <Accordion title={content.overview.title} defaultOpen={true}>
              <p className="main-objective">{content.overview.mainObjective}</p>
              <div className="key-outcomes">
                <h3>By the end of this course, you will:</h3>
                <ul>
                  {content.overview.keyOutcomes.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              </div>
              <p className="approach">{content.overview.approach}</p>
            </Accordion>

            <Accordion title={content.setup.title}>
              <div className="requirements-list">
                {content.setup.items.map((item, index) => (
                  <div key={index}>
                    <strong>{item.text}</strong>
                    {item.subitems.length > 0 && (
                      <ul>
                        {renderRequirementsList(item.subitems)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Accordion>

            <Accordion title={content.lessonPlan.title}>
              {renderLessonPlanSection()}
            </Accordion>

            <Accordion title={content.projectWorksheet.title}>
              {renderWorksheetSection()}
            </Accordion>
          </div>
        </div>

        <div className="support-section">
          <h2>Need Additional Support?</h2>
          <p>Our team is here to help you implement these resources effectively in your classroom.</p>
          <div className="support-buttons">
            <Link to="/contact" className="primary-btn">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroToAI;
