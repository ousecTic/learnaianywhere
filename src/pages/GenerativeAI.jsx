import React, { useState, useEffect } from 'react';
import '../styles/Timeline.css';
import './IntroToAI.css';
import DayOne from '../components/course/week2/DayOne';
import DayTwo from '../components/course/week2/DayTwo';
import DayThree from '../components/course/week2/DayThree';
import DayFour from '../components/course/week2/DayFour';
import DayFive from '../components/course/week2/DayFive';

const GenerativeAI = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'day1', label: 'Day 1: Intro to Gen AI' },
    { id: 'day2', label: 'Day 2: Language Models' },
    { id: 'day3', label: 'Day 3: Prompt Engineering' },
    { id: 'day4', label: 'Day 4: Ethics & Responsibility' },
    { id: 'day5', label: 'Day 5: Presentation' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-content">
            <div className="section">
              <h2>Objective Overview</h2>
              <p>Throughout this week, students will explore the fascinating world of generative AI, with a focus on language models and their real-world applications. They will learn about prompt engineering, experiment with AI tools, and develop their own creative projects.</p>
              <p>By the end of the week, students will understand how generative AI works, be able to effectively interact with AI models, and appreciate the importance of ethical considerations in AI development and deployment.</p>
            </div>

            <div className="section">
              <h2>Requirements</h2>
              <ul>
                <li>
                  Computer with Internet Access
                  <span className="material-note">Required for accessing AI tools and completing exercises</span>
                </li>
                <li>
                  Web Browser
                  <span className="material-note">Modern browser for accessing web-based AI tools</span>
                </li>
                <li>
                  Project Materials
                  <ul>
                    <li>Digital or physical notebooks</li>
                    <li>Presentation materials</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="section">
              <h2>Optional</h2>
              <ul>
                <li>Additional AI tools and platforms as recommended throughout the week</li>
              </ul>
            </div>
          </div>
        );
      case 'day1':
        return <DayOne />;
      case 'day2':
        return <DayTwo />;
      case 'day3':
        return <DayThree />;
      case 'day4':
        return <DayFour />;
      case 'day5':
        return <DayFive />;
      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className="week-page">
      <div className="week-header">
        <div className="container">
          <h1>Generative AI and Language Models</h1>
          <p>This week introduces students to generative AI, focusing on language models and their applications while emphasizing responsible AI usage and ethical considerations.</p>
        </div>
      </div>

      <div className="container">
        {isMobile ? (
          <div className="tabs-dropdown">
            <div className="custom-select">
              <button 
                className="select-button"
                onClick={() => setIsOpen(!isOpen)}
                type="button"
              >
                {tabs.find(tab => tab.id === activeTab)?.label}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {isOpen && (
                <div className="select-options">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`select-option ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsOpen(false);
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
        <div className="tab-content">
          {renderContent()}
        </div>

        <div className="support-section">
          <h2>Need Additional Support?</h2>
          <p>Our team is here to help you implement these resources effectively in your classroom.</p>
          <div className="support-buttons">
            <button className="contact-btn">Contact Support</button>
            <button className="primary-btn">View FAQ</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerativeAI;
