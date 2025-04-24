import React, { useState, useEffect } from 'react';
import '../styles/Timeline.css';
import './IntroToGenerativeAI.css';
import { Link } from 'react-router-dom';

// Accordion component for collapsible sections
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

const IntroToGenerativeAI = () => {
  // Course content data from Overview.jsx
  const content = {
    overview: {
      title: "Overview",
      mainObjective: "Students will gain a foundational understanding of generative AI, specifically language models, including their mechanics, applications, limitations, and ethical considerations.",
      keyOutcomes: [
        "Understand how language models work and their capabilities",
        "Create and evaluate AI-generated content responsibly",
        "Develop critical thinking skills for fact-checking",
        "Apply ethical decision-making in AI interactions",
        "Create an engaging trivia quiz using AI tools"
      ],
      approach: "Through hands-on activities and guided experiments, students will learn to interact with language models, evaluate AI-generated content, and develop responsible AI usage habits. Each day builds towards creating a well-researched, ethically-sound trivia quiz project."
    },
    setup: {
      title: "Setup",
      items: [
        {
          text: "Offline Research Tools",
          subitems: [
            "Kiwix (offline Wikipedia) or similar offline wikis",
            "Community-driven dictionaries for fact verification",
            {
              type: "note",
              content: "These tools are essential for cross-checking and basic fact verification when working with AI-generated content."
            }
          ]
        },
        {
          text: "AI Tools",
          subitems: [
            "TinyLlama or Llama 3.2 1b (offline versions preferred)",
            "Alternative generative AI tools for experimentation",
            {
              type: "tip",
              content: "Having offline AI tools ensures reliable access throughout the course."
            }
          ]
        },
        {
          text: "Group Work Materials",
          subitems: [
            "Paper and writing tools (pens/pencils)",
            "Sticky notes or cut-up paper for activities",
            "Notebooks for recreating project worksheets",
            {
              type: "note",
              content: "Since printing may not be available, ensure students can easily copy materials into their notebooks."
            }
          ]
        },
        {
          text: "Visual Aids",
          subitems: [
            "Projector or screen for displaying content",
            "Access to presentation slides",
            {
              type: "tip",
              content: "Visual aids are crucial for demonstrating AI interactions and sharing examples."
            }
          ]
        }
      ]
    },
    lessonPlan: {
      title: "Lesson Plan",
      presentationId: "1HC9RVzA5huGHU2tESsKlwqGMsiZxpfUxhBL3GbgDCDc" // Updated GenAI presentation ID
    },
    projectWorksheet: {
      title: "Project Worksheet",
      docId: "1cNtWXnFO0BRAGrnYWZKVxbG7SaKFJi45KHEClGzyrEc",
      exampleDocId: "14fzVQ66VjAzl3785UFFt59pM47NWUX6hXp78kdzsAO0"
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

  const renderRequirementsList = (items) => {
    return items.map((item, index) => {
      if (typeof item === 'string') {
        return <li key={index}>{item}</li>;
      }
      return <li key={index} data-type={item.type}>{item.content}</li>;
    });
  };

  const renderWorksheetSection = () => {
    const { projectWorksheet } = content;
    const urls = getGoogleDocUrls(projectWorksheet.docId);
    const exampleUrls = projectWorksheet.exampleDocId ? getGoogleDocUrls(projectWorksheet.exampleDocId) : null;
    
    return (
      <div className="worksheet-container">
        <div className="worksheet-section">
          <h3 className="worksheet-title">Blank Template</h3>
          <div className="worksheet-header">
            <div className="download-options">
              <a 
                href={urls.pdf}
                className="worksheet-download pdf"
                download
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download PDF
              </a>
              <a 
                href={urls.docx}
                className="worksheet-download docx"
                download
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Word
              </a>
            </div>
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

        {exampleUrls && (
          <div className="worksheet-section example-section">
            <h3 className="worksheet-title">Example (Filled Version)</h3>
            <div className="worksheet-header">
              <div className="download-options">
                <a 
                  href={exampleUrls.pdf}
                  className="worksheet-download pdf"
                  download
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download PDF
                </a>
                <a 
                  href={exampleUrls.docx}
                  className="worksheet-download docx"
                  download
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download Word
                </a>
              </div>
            </div>
            <div className="worksheet-preview">
              <iframe
                src={exampleUrls.embed}
                title="Example Worksheet"
                width="100%"
                height="842"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        )}
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

  return (
    <div className="week-page">
      <div className="week-header">
        <div className="container">
          <h1>Introduction to Generative AI</h1>
          <p>A foundational course focused on generative AI, specifically Large Language Models (LLMs), and their impact on society.</p>
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

export default IntroToGenerativeAI;
