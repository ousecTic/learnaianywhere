import React from 'react';
import Accordion from '../../shared/Accordion';
import './Week1.css';

const DayFour = () => {
  return (
    <div className="day-content">
      <h1 className="day-title">Day 4: AI Bias</h1>
      
      {/* Learning Objectives Section */}
      <Accordion title="Learning Objectives" defaultOpen={true}>
        <ul className="learning-objectives-list">
          <li>
            <strong>Understanding Bias:</strong> Students will identify and understand the concept 
            of bias in AI algorithms through a hands-on challenge with Pocket AutoML.
          </li>
          <li>
            <strong>Societal Impact:</strong> Students will reflect on the societal impact of 
            algorithmic bias, discussing the importance of diversity in data and decision-making.
          </li>
          <li>
            <strong>Project Refinement:</strong> Students will refine their group projects by 
            addressing potential biases in their data collection and ensuring their AI models 
            are inclusive and representative.
          </li>
        </ul>
      </Accordion>

      {/* Preparation Section */}
      <Accordion title="Preparation" defaultOpen={true}>
        <div className="materials">
          <h4>Required Materials</h4>
          <ul>
            <li>
              2 Bad Apples Make a Good Pear Challenge
              <span className="material-note">
                <a 
                  href="https://www.notion.so/2-Bad-Apples-make-a-good-Pear-Challenge-Data-Bias-831594991e9144b0b279e0be8d3cc52a" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Access challenge materials here
                </a>
              </span>
            </li>
            <li>
              Project Worksheets
              <span className="material-note">
                Day 4 questions focus on data diversity
              </span>
            </li>
            <li>
              Pocket AutoML App
              <span className="material-note">
                Ensure app is installed and working on student devices
              </span>
            </li>
          </ul>
        </div>

        <div className="setup-steps">
          <h4>Setup Steps</h4>
          <ol>
            <li>Prepare the Bad Apples Challenge materials</li>
            <li>Review discussion prompts and examples</li>
            <li>Ensure project worksheets are ready</li>
          </ol>
        </div>

        <div className="presentation-preview">
          <div className="preview-header">
            <h4>Presentation Preview</h4>
            <a 
              href="https://docs.google.com/presentation/d/1DxQIIywUWq7YlYztSqvGfF6qrfmfTQC4wyGSPFzOkXE/export/pptx" 
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
            src="https://docs.google.com/presentation/d/1DxQIIywUWq7YlYztSqvGfF6qrfmfTQC4wyGSPFzOkXE/preview"
            title="Presentation Preview"
            allowFullScreen
          ></iframe>
        </div>
      </Accordion>

      {/* Lesson Plan Section */}
      <Accordion title="Lesson Plan" defaultOpen={true}>
        <div className="lesson-section">
          <h4>
            1. Engagement Activity
            <span className="time">25 mins</span>
          </h4>
          <div className="activity-block">
            <h5>🍎 2 Bad Apples Make a Good Pear Challenge</h5>
            <ul>
              <li>Introduce and run the challenge activity</li>
              <li>Guide students through:
                <ul>
                  <li>Classification process</li>
                  <li>Identifying errors</li>
                  <li>Pattern recognition</li>
                </ul>
              </li>
              <li>
                <strong>Reflection Prompt:</strong> Why did mistakes happen? What do these errors tell us?
              </li>
            </ul>
            <div className="teacher-tip">
              Encourage students to document their observations and unexpected outcomes
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            2. Reflection on Bias
            <span className="time">20 mins</span>
          </h4>
          <div className="content-block">
            <h5>🤔 Understanding AI Bias</h5>
            <ul>
              <li>
                <strong>Discussion Points:</strong>
                <ul>
                  <li>Classification mistakes and patterns</li>
                  <li>Unexpected model outcomes</li>
                  <li>Causes of bias in models</li>
                </ul>
              </li>
              <li>
                <strong>Key Concepts:</strong>
                <ul>
                  <li>Bias as favoring certain outcomes</li>
                  <li>Algorithmic bias in machine learning</li>
                  <li>Impact of training data quality</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            3. Societal Impact Discussion
            <span className="time">25 mins</span>
          </h4>
          <div className="content-block">
            <h5>🌍 Real-World Applications</h5>
            <ul>
              <li>Explore implications in:
                <ul>
                  <li>Hiring processes</li>
                  <li>Medical decisions</li>
                  <li>Legal judgments</li>
                </ul>
              </li>
              <li>
                <strong>Discussion Questions:</strong>
                <ul>
                  <li>Why is diverse decision-making important?</li>
                  <li>How does diversity improve AI systems?</li>
                  <li>What are the consequences of biased systems?</li>
                </ul>
              </li>
            </ul>
            <div className="teacher-tip">
              Use real-world examples to make the discussion more relatable
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            4. Project Work Time
            <span className="time">30 mins</span>
          </h4>
          <div className="content-block">
            <h5>📝 Project Refinement</h5>
            <ul>
              <li>Complete work from previous days</li>
              <li>Answer Day 4 worksheet questions:
                <ul>
                  <li>Identify areas for data diversification</li>
                  <li>Plan for inclusive data collection</li>
                  <li>Document potential biases</li>
                </ul>
              </li>
            </ul>
            <div className="teacher-tip">
              Help students identify concrete ways to make their projects more inclusive
            </div>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default DayFour;
