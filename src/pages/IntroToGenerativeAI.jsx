import React, { useState, useEffect } from 'react';
import '../styles/Timeline.css';
import './IntroToAI.css';
import Overview from '../components/course/week2/Overview';
import DayOne from '../components/course/week2/DayOne';
import DayTwo from '../components/course/week2/DayTwo';
import DayThree from '../components/course/week2/DayThree';
import DayFour from '../components/course/week2/DayFour';
import DayFive from '../components/course/week2/DayFive';

const IntroToGenerativeAI = () => {
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
    { id: 'day1', label: 'Day 1: Intro to LLMs' },
    { id: 'day2', label: 'Day 2: LLM Truth & Lies' },
    { id: 'day3', label: 'Day 3: How LLMs Work' },
    { id: 'day4', label: 'Day 4: LLM Ethics' },
    { id: 'day5', label: 'Day 5: Presentation' }
  ];

  const weekContent = {
    overview: {
      title: "Introduction to Generative AI",
      description: "This week's lessons introduce students to generative artificial intelligence, focusing on Large Language Models (LLMs) and their impact on society.",
      content: {
        objectiveOverview: {
          title: "Objective Overview",
          text: [
            "Throughout this week, students will explore the fascinating world of generative AI, with a special focus on Large Language Models. They will learn how these models work, their capabilities and limitations, and the ethical considerations surrounding their use.",
            "By the end of the week, students will understand how to interact responsibly with language models, recognize their potential biases, and develop critical thinking skills for evaluating AI-generated content."
          ]
        },
        requirements: {
          title: "Requirements",
          items: [
            {
              text: "Computer with Internet Access: Required for accessing language model demonstrations.",
              subitems: []
            },
            {
              text: "Whiteboard or Chalkboard: For class discussions and concept visualization.",
              subitems: []
            },
            {
              text: "Worksheets: Students will need worksheets for hands-on activities and ethical discussions.",
              subitems: []
            }
          ]
        },
        optional: {
          title: "Optional",
          items: [
            "Access to ChatGPT or similar LLM (teacher-supervised): For demonstration purposes only"
          ]
        }
      }
    },
    day1: {
      title: "Introduction to Language Models",
      content: "Content for Day 1"
    },
    day2: {
      title: "Truth and Lies in Language Models",
      content: "Content for Day 2"
    },
    day3: {
      title: "How Language Models Work",
      content: "Content for Day 3"
    },
    day4: {
      title: "Language Model Ethics",
      content: "Content for Day 4"
    },
    day5: {
      title: "Presentation Day",
      content: "Content for Day 5"
    }
  };

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
          <h1>{weekContent.overview.title}</h1>
          <p>{weekContent.overview.description}</p>
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

export default IntroToGenerativeAI;
