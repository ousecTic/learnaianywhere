import React, { useState } from 'react';
import './Week1.css';

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

const Overview = () => {
  const content = {
    objectiveOverview: {
      title: "Course Objective",
      mainObjective: "Students will learn to build their own AI image classifier while gaining hands-on experience with artificial intelligence concepts.",
      keyOutcomes: [
        "Build and train a custom image classifier",
        "Understand core AI concepts through hands-on activities",
        "Learn how to collect and prepare data for AI models",
        "Gain practical experience with real AI tools"
      ],
      approach: "Through guided activities and hands-on projects, you'll learn AI concepts by doing, not just reading. Each day builds on the previous one, leading to your own working AI model."
    },
    requirements: {
      title: "What You'll Need",
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
          text: "Setup",
          subitems: [
            "Download required apps before class (works offline after installation)",
            "Ensure each student has the worksheet or can copy questions in their notebook",
            {
              type: "tip",
              content: " Pro Tip: Review all lessons and download apps in advance for a smoother experience."
            }
          ]
        }
      ]
    },
    studentWorksheet: {
      title: "Student Worksheet",
      docId: "1rWrdbg78nggEbtYnVz0giyQDjm0KpjuuZDZ87i3JONo"
    }
  };

  const getGoogleDocUrls = (docId) => ({
    pdf: `https://docs.google.com/document/d/${docId}/export?format=pdf`,
    embed: `https://docs.google.com/document/d/${docId}/preview`
  });

  const renderWorksheetSection = () => {
    const { studentWorksheet } = content;
    const urls = getGoogleDocUrls(studentWorksheet.docId);
    
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
            title={studentWorksheet.title}
            width="100%"
            height="842"
            frameBorder="0"
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
    <div className="overview-content">
      <Accordion title={content.objectiveOverview.title} defaultOpen={true}>
        <p className="main-objective">{content.objectiveOverview.mainObjective}</p>
        <div className="key-outcomes">
          <h3>By the end of this course, you will:</h3>
          <ul>
            {content.objectiveOverview.keyOutcomes.map((outcome, index) => (
              <li key={index}>{outcome}</li>
            ))}
          </ul>
        </div>
        <p className="approach">{content.objectiveOverview.approach}</p>
      </Accordion>

      <Accordion title={content.requirements.title}>
        <div className="requirements-list">
          {content.requirements.items.map((item, index) => (
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

      <Accordion title={content.studentWorksheet.title}>
        {renderWorksheetSection()}
      </Accordion>
    </div>
  );
};

export default Overview;
