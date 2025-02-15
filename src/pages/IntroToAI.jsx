import React, { useState, useEffect } from 'react';
import '../styles/Timeline.css';
import './IntroToAI.css';
import Overview from '../components/course/week1/Overview';
import DayOne from '../components/course/week1/DayOne';
import DayTwo from '../components/course/week1/DayTwo';
import DayThree from '../components/course/week1/DayThree';
import DayFour from '../components/course/week1/DayFour';
import DayFive from '../components/course/week1/DayFive';

const IntroToAI = () => {
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
    { id: 'day1', label: 'Day 1: What is AI' },
    { id: 'day2', label: 'Day 2: Components of ML' },
    { id: 'day3', label: 'Day 3: How Machines Learn' },
    { id: 'day4', label: 'Day 4: AI Bias' },
    { id: 'day5', label: 'Day 5: Presentation' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
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
          <h1>Introduction to Artificial Intelligence</h1>
          <p>This week's lessons provides students with a foundational understanding of artificial intelligence (AI) through hands-on experience.</p>
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

export default IntroToAI;
