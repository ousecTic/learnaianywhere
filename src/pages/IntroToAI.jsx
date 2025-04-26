import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/shared/Button';
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
      mainObjective: "By the end of this course, students will understand the fundamentals of AI, build their own image classifier, and develop critical thinking about AI's societal impacts.",
      overviewText: "This Introduction to AI course explores three core concepts: What AI is, How AI works, and the Societal impacts of AI (both positive and negative). Students engage through interactive activities using completely offline apps that run on various devices - smart phones, tablets, or computers with a minimum of 3GB RAM.",
      courseStructure: "The course consists of 4 lessons, each designed to be completed in 30 minutes. After each lesson, we recommend a 15-minute hands-on project where students progressively build their own image classifier, applying the concepts they've learned.",
      lessonObjectives: [
        {
          title: "Lesson 1: Introduction to AI",
          objectives: [
            "Describe what artificial intelligence (AI) is",
            "Identify what makes a tool or app an example of AI"
          ]
        },
        {
          title: "Lesson 2: How AI Works - Data & Machine Learning",
          objectives: [
            "Name the three main parts of a machine learning system",
            "Explain what each part does",
            "Understand why good data is crucial for effective AI"
          ]
        },
        {
          title: "Lesson 3: Algorithms & Information Processing",
          objectives: [
            "Explain what algorithms are with real-life examples",
            "Describe why algorithms are essential for machine learning",
            "Outline how machines learn at a high level",
            "Compare human vs. machine information processing"
          ]
        },
        {
          title: "Lesson 4: AI Ethics & Societal Impact",
          objectives: [
            "Explain how AI systems can make incorrect or unfair predictions",
            "Describe the societal implications of algorithmic bias",
            "Understand ways to identify and reduce bias in AI systems"
          ]
        }
      ],
      approach: "Students complete the worksheet after each lesson, documenting their understanding while simultaneously building their image classifier step-by-step. By the end of Lesson 4, students will give a presentation showcasing the items they've classified, demonstrating their practical understanding of AI concepts."
    },
    setup: {
      title: "Setup",
      requiredApps: {
        title: "Required Apps (Devices need minimum 3GB RAM)",
        installNote: "Important: Both apps must be installed on EACH device students will use for this course, whether Android or Windows.",
        androidApps: [
          {
            name: "Neuropocket",
            description: "For building image classifiers",
            url: "https://github.com/ousecTic/neuropocket/releases/download/v1.1.1/neuropocket-1.1.1.apk"
          },
          {
            name: "Plant Diseases App",
            description: "For demonstrating AI applications",
            url: "https://github.com/ousecTic/offline-plant-diseases-detection/releases/download/v1.0.0-alpha.2/plant-diseases-detection.apk"
          }
        ],
        windowsApps: [
          {
            name: "Neuropocket Desktop",
            url: "https://github.com/ousecTic/neuropocket/releases/download/v1.1.1/Neuropocket.Setup.1.1.1.exe"
          },
          {
            name: "Plant Diseases App",
            url: "https://github.com/ousecTic/offline-plant-diseases-detection/releases/download/v1.0.0-alpha.2/plant-diseases-detection.apk"
          }
        ],
        note: "Computers must have cameras to take pictures for the image classification activities."
      },
      internetNote: "If internet is limited, you can download these apps once to a USB drive and install them on each device. Currently, we focus on Android and Windows devices as they're most accessible in diverse learning environments.",
      teacherPrep: "We've designed this curriculum without separate teacher or student guides. The presentations are self-contained and don't require prior AI knowledge—you can learn alongside your students. However, we strongly recommend reviewing the lesson and worksheet before class to understand the learning journey.",
      contactNote: "If you encounter any difficulties with the setup process or have questions about implementing this course, please don't hesitate to contact us. We're here to help make your AI teaching experience successful."
    },
    lessonPlan: {
      title: "Lesson Plan",
      presentationId: "1fdyUyrwimfpUbtm3plBn_yMd7GElq5JGacIXnFJ7ry0" // Updated presentation ID
    },
    projectWorksheet: {
      title: "Project Worksheet",
      docId: "1rWrdbg78nggEbtYnVz0giyQDjm0KpjuuZDZ87i3JONo",
      exampleDocId: "1IrRP3hIivydP1WmO2JMeqd6gZgCLA43KK_JoOZONEf4"
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
              <Button 
                href={urls.pdf}
                variant="secondary"
                download
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download PDF
              </Button>
              <Button 
                href={urls.docx}
                variant="primary"
                download
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download DOCX
              </Button>
            </div>
          </div>
          <div className="worksheet-preview">
            <iframe
              src={urls.embed}
              title={projectWorksheet.title}
              width="100%"
              height="842"

            ></iframe>
          </div>
        </div>

        {exampleUrls && (
          <div className="worksheet-section example-section">
            <h3 className="worksheet-title">Example (Filled Version)</h3>
            <div className="worksheet-header">
              <div className="download-options">
                <Button 
                  href={exampleUrls.pdf}
                  variant="secondary"
                  download
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download PDF
                </Button>
                <Button 
                  href={exampleUrls.docx}
                  variant="primary"
                  download
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download Word
                </Button>
              </div>
            </div>
            <div className="worksheet-preview">
              <iframe
                src={exampleUrls.embed}
                title="Example Worksheet"
                width="100%"
                height="842"

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
            <Button 
              href={urls.pptx}
              variant="primary"
              download
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PowerPoint
            </Button>
            <Button 
              href={urls.pdf}
              variant="secondary"
              download
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PDF
            </Button>
          </div>
        </div>
        <div className="presentation-preview">
          <iframe
            src={urls.embed}
            title={lessonPlan.title}
            width="100%"
            height="500"
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
              <h3 className="section-subtitle">Course Goal</h3>
              <p className="main-objective">{content.overview.mainObjective}</p>
              
              <h3 className="section-subtitle">Course Overview</h3>
              <p className="overview-text">{content.overview.overviewText}</p>
              
              <h3 className="section-subtitle">Course Structure</h3>
              <p className="overview-text">{content.overview.courseStructure}</p>
              
              <h3 className="section-subtitle">Learning Objectives</h3>
              <div className="lesson-objectives">
                {content.overview.lessonObjectives.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="lesson-objective-group">
                    <h4>{lesson.title}</h4>
                    <ul>
                      {lesson.objectives.map((objective, objIndex) => (
                        <li key={objIndex}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <h3 className="section-subtitle">Learning Approach</h3>
              <p className="approach">{content.overview.approach}</p>
            </Accordion>

            <Accordion title={content.setup.title}>
              <div className="setup-section">
                <h3 className="setup-subtitle">{content.setup.requiredApps.title}</h3>
                <p className="setup-important">{content.setup.requiredApps.installNote}</p>
                
                <div className="app-section">
                  <h4 className="platform-title">For Android devices:</h4>
                  <ul className="app-list">
                    {content.setup.requiredApps.androidApps.map((app, index) => (
                      <li key={index} className="app-item">
                        <Button href={app.url} variant="text" target="_blank" rel="noopener noreferrer">{app.name}</Button>
                        {app.description && <span className="app-description"> - {app.description}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="app-section">
                  <h4 className="platform-title">For Windows computers:</h4>
                  <ul className="app-list">
                    {content.setup.requiredApps.windowsApps.map((app, index) => (
                      <li key={index} className="app-item">
                        <Button href={app.url} variant="text" target="_blank" rel="noopener noreferrer">{app.name}</Button>
                      </li>
                    ))}
                  </ul>
                  <p className="setup-note">{content.setup.requiredApps.note}</p>
                </div>
                
                <p className="setup-paragraph">{content.setup.internetNote}</p>
                
                <h3 className="setup-subtitle">Teacher Preparation</h3>
                <p className="setup-paragraph">{content.setup.teacherPrep}</p>
                
                <h3 className="setup-subtitle">Need Help?</h3>
                <p className="setup-paragraph">{content.setup.contactNote}</p>
                <div className="setup-contact-buttons">
                  <Button to="/contact" variant="primary">Contact Us</Button>
                </div>
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
            <Button to="/contact" variant="primary">Contact Support</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroToAI;
