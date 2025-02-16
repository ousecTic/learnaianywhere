import React, { useState, useEffect } from 'react';

const Week2 = () => {
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
    { id: 'day1', label: 'Day 1' },
    { id: 'day2', label: 'Day 2' },
    { id: 'day3', label: 'Day 3' },
    { id: 'day4', label: 'Day 4' },
    { id: 'day5', label: 'Day 5' }
  ];

  const weekContent = {
    overview: {
      title: "Week Two: Generative AI and Language Models",
      description: "This week introduces students to generative AI, focusing on language models and their applications while emphasizing responsible AI usage and ethical considerations.",
      content: {
        objectiveOverview: {
          title: "Objective Overview",
          text: [
            "Throughout this week, students will explore the fascinating world of generative AI, with a focus on language models and their real-world applications. They will learn about prompt engineering, experiment with AI tools, and develop their own creative projects.",
            "By the end of the week, students will understand how generative AI works, be able to effectively interact with AI models, and appreciate the importance of ethical considerations in AI development and deployment."
          ]
        },
        requirements: {
          title: "Requirements",
          items: [
            {
              text: "Computer with Internet Access: Required for accessing AI tools and completing exercises.",
              subitems: []
            },
            {
              text: "Web Browser: Modern browser for accessing web-based AI tools.",
              subitems: []
            },
            {
              text: "Project Materials: Materials for documenting and presenting AI experiments.",
              subitems: [
                "Digital or physical notebooks",
                "Presentation materials"
              ]
            }
          ]
        },
        optional: {
          title: "Optional",
          items: [
            "Additional AI tools and platforms as recommended throughout the week"
          ]
        }
      }
    },
    day1: {
      title: "Day 1: Introduction to Generative AI",
      content: "Content for Day 1"
    },
    day2: {
      title: "Day 2: Exploring Language Models",
      content: "Content for Day 2"
    },
    day3: {
      title: "Day 3: Prompt Engineering",
      content: "Content for Day 3"
    },
    day4: {
      title: "Day 4: Ethics and Responsible AI Use",
      content: "Content for Day 4"
    },
    day5: {
      title: "Day 5: Project Presentations",
      content: "Content for Day 5"
    }
  };

  const renderOverviewContent = () => {
    const { objectiveOverview, requirements, optional } = weekContent.overview.content;
    
    return (
      <div className="overview-content">
        <div className="section">
          <h2>{objectiveOverview.title}</h2>
          {objectiveOverview.text.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="section">
          <h2>{requirements.title}</h2>
          <ul>
            {requirements.items.map((item, index) => (
              <li key={index}>
                {item.text}
                {item.subitems.length > 0 && (
                  <ul>
                    {item.subitems.map((subitem, subIndex) => (
                      <li key={subIndex}>{subitem}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h2>{optional.title}</h2>
          <ul>
            {optional.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === 'overview') {
      return renderOverviewContent();
    }
    return <div>{weekContent[activeTab].content}</div>;
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
      </div>
    </div>
  );
};

export default Week2;
