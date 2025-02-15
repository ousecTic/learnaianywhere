import React, { useState, useEffect } from 'react';

const Week1 = () => {
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
      title: "Week One: Introduction to Artificial Intelligence",
      description: "This week's lessons provides students with a foundational understanding of artificial intelligence (AI) through hands-on experience.",
      content: {
        objectiveOverview: {
          title: "Objective Overview",
          text: [
            "Over the course of the week, students will collaborate to build a personalized image classifier, exploring a theme of their choice. They will learn the essential steps involved in AI development, such as data collection, feature selection, and model training, while also examining the ethical implications of AI, including bias in datasets.",
            "By the end of the course, students will gain both theoretical knowledge and practical skills, empowering them to create their own basic AI models and articulate the value of responsible AI usage."
          ]
        },
        requirements: {
          title: "Requirements",
          items: [
            {
              text: "Computer with Display Capability: Ensure access to a computer or laptop with a screen large enough to display the PowerPoint presentation.",
              subitems: []
            },
            {
              text: "Whiteboard or Chalkboard: Use for additional explanations or illustrations during the lesson.",
              subitems: []
            },
            {
              text: "App Downloads: Install the following apps on all devices:",
              subitems: [
                "Offline Plant Disease Classifier",
                "Offline Image Classifier"
              ]
            },
            {
              text: "Worksheets: Print out the worksheets for students to complete their projects. If a printer is unavailable, students can easily replicate the worksheet in their notebooks",
              subitems: []
            }
          ]
        },
        optional: {
          title: "Optional",
          items: [
            "Open Camera App: Use this app if teams prefer to save their photos in separate folders. If it's acceptable to mix photos from different teams, the native camera app can also be used"
          ]
        }
      }
    },
    day1: {
      title: "Day 1: What is AI",
      content: "Content for Day 1"
    },
    day2: {
      title: "Day 2: Components of Machine Learning",
      content: "Content for Day 2"
    },
    day3: {
      title: "Day 3: How do Machine Learn?",
      content: "Content for Day 3"
    },
    day4: {
      title: "Day 4: Can Machine be Biased?",
      content: "Content for Day 4"
    },
    day5: {
      title: "Day 5: Presentation Day",
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

export default Week1;
