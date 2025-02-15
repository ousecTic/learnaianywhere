import React from 'react';
import Accordion from '../../shared/Accordion';
import './Week1.css';

const DayThree = () => {
  return (
    <div className="day-content">
      <h1 className="day-title">Day 3: How do Machines Learn?</h1>
      
      {/* Learning Objectives Section */}
      <Accordion title="Learning Objectives" defaultOpen={true}>
        <ul className="learning-objectives-list">
          <li>
            <strong>Algorithm Understanding:</strong> Students will learn how AI algorithms are trained 
            by breaking down problem-solving processes into detailed steps, simulating the training 
            process with relatable daily life examples.
          </li>
          <li>
            <strong>Instruction Writing:</strong> Through interactive games, students will practice 
            writing precise instructions (algorithms) and understand the importance of clarity in 
            AI problem-solving.
          </li>
          <li>
            <strong>Project Progress:</strong> Students will continue collecting data for their group 
            projects, documenting the data and justifying their choices.
          </li>
        </ul>
      </Accordion>

      {/* Preparation Section */}
      <Accordion title="Preparation" defaultOpen={true}>
        <div className="materials">
          <h4>Required Materials</h4>
          <ul>
            <li>
              Image Pattern Recognition Game
              <span className="material-note">
                <a 
                  href="https://www.notion.so/Image-Pattern-Recognition-Flashcards-Machine-Learning-c780d1bcd50b48c59ef05e1a222018de" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Access game materials here
                </a>
              </span>
            </li>
            <li>
              Describer-Drawer Game Materials
              <span className="material-note">
                <a 
                  href="https://www.notion.so/The-Describer-Drawer-Game-Algorithm-391cea34e69c402db73c5e4f4a5c53d0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Access game instructions here
                </a>
              </span>
            </li>
            <li>
              Project Worksheets
              <span className="material-note">
                Question 3 focuses on data features
              </span>
            </li>
            <li>
              Drawing supplies for algorithm game
              <span className="material-note">
                Paper and markers/pencils for each student
              </span>
            </li>
          </ul>
        </div>

        <div className="setup-steps">
          <h4>Setup Steps</h4>
          <ol>
            <li>Prepare Image Pattern Recognition Game materials</li>
            <li>Set up drawing supplies for algorithm games</li>
            <li>Print or prepare digital project worksheets</li>
          </ol>
        </div>

        <div className="presentation-preview">
          <div className="preview-header">
            <h4>Presentation Preview</h4>
            <a 
              href="https://docs.google.com/presentation/d/1sG_HIzklkR06IY2dEVJ8vVps19oRraPUVnRVFg0d4gM/export/pptx" 
              className="download-btn"
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PowerPoint
            </a>
          </div>
          <iframe 
            src="https://docs.google.com/presentation/d/1sG_HIzklkR06IY2dEVJ8vVps19oRraPUVnRVFg0d4gM/preview"
            title="Presentation Preview"
            allowFullScreen
          ></iframe>
        </div>
      </Accordion>

      {/* Lesson Plan Section */}
      <Accordion title="Lesson Plan" defaultOpen={true}>
        <div className="lesson-section">
          <h4>
            1. Warm-Up & Engagement Activity
            <span className="time">15 mins</span>
          </h4>
          <div className="activity-block">
            <h5>🎮 Image Pattern Recognition Game</h5>
            <ul>
              <li>Introduce and play the pattern recognition game</li>
              <li>Connect game improvement to AI learning:
                <ul>
                  <li>Practice leads to better performance</li>
                  <li>Learning from mistakes</li>
                  <li>Pattern recognition skills</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            2. Warm-Up Reflection
            <span className="time">10 mins</span>
          </h4>
          <div className="content-block">
            <h5>🤔 Algorithmic Thinking</h5>
            <ul>
              <li>Guide students to reflect on their problem-solving process</li>
              <li>Discuss how their thinking mirrors algorithmic processes</li>
            </ul>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            3. Introduction to Algorithms
            <span className="time">15 mins</span>
          </h4>
          <div className="content-block">
            <h5>🔍 Understanding Algorithms</h5>
            <ul>
              <li>Define algorithms as step-by-step instructions</li>
              <li>Emphasize key points:
                <ul>
                  <li>Precision in instructions</li>
                  <li>Clear, unambiguous steps</li>
                  <li>Importance of completeness</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            4. Core Activity: "I Am the Computer"
            <span className="time">20 mins</span>
          </h4>
          <div className="activity-block">
            <h5>💻 Algorithm Practice</h5>
            <ul>
              <li>Teacher acts as "computer"</li>
              <li>Students provide square-drawing instructions</li>
              <li>Demonstrate literal interpretation</li>
              <li>Present correct solution and discuss</li>
            </ul>
            <div className="teacher-tip">
              Intentionally misinterpret vague instructions to highlight importance of precision
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            5. Hands-On Activity: Describer-Drawer Game
            <span className="time">25 mins</span>
          </h4>
          <div className="activity-block">
            <h5>🎨 Partner Activity</h5>
            <ul>
              <li>Pair students and assign roles</li>
              <li>Provide images to describers</li>
              <li>Monitor progress and encourage detail</li>
              <li>Compare results and discuss challenges</li>
            </ul>
            <div className="teacher-tip">
              Use simple images first, then gradually increase complexity
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            6. Project Work Time
            <span className="time">15 mins</span>
          </h4>
          <div className="content-block">
            <h5>📝 Data Collection & Documentation</h5>
            <ul>
              <li>Guide students through worksheet Question 3</li>
              <li>Document data features and choices</li>
              <li>Photograph items for model training</li>
            </ul>
            <div className="teacher-tip">
              Encourage students to think about what makes their data unique and valuable
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            7. Reflection & Preview
            <span className="time">10 mins</span>
          </h4>
          <div className="content-block">
            <ul>
              <li>Discuss game insights and AI learning connections</li>
              <li>Share project progress and challenges</li>
              <li>Preview Day 4: Data diversity and bias</li>
            </ul>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default DayThree;
