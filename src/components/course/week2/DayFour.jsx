import React from 'react';
import Accordion from '../../shared/Accordion';
import './Week2.css';

const DayFour = () => {
  return (
    <div className="day-content">
      <h1 className="day-title">Day 4: Ethics in AI - Discussion and Debate</h1>
      
      {/* Learning Objectives Section */}
      <Accordion title="Learning Objectives" defaultOpen={true}>
        <ul className="learning-objectives-list">
          <li>
            <strong>Critical Analysis:</strong> Encourage students to critically analyze ethical 
            implications of language model use through structured discussion and debate.
          </li>
          <li>
            <strong>Collaborative Learning:</strong> Facilitate a thoughtful, collaborative discussion 
            on accountability, academic integrity, and AI's impact on jobs.
          </li>
        </ul>
      </Accordion>

      {/* Preparation Section */}
      <Accordion title="Preparation" defaultOpen={true}>
        <div className="materials">
          <h4>Required Materials</h4>
          <ul>
            <li>
              Room Setup Materials
              <span className="material-note">
                Chairs arranged for either 4 Corners or Fishbowl format
              </span>
            </li>
            <li>
              Corner Labels (if using 4 Corners)
              <span className="material-note">
                "Strongly Agree," "Agree," "Disagree," "Strongly Disagree"
              </span>
            </li>
            <li>
              Discussion Questions
              <span className="material-note">
                Printed copies for reference during discussion
              </span>
            </li>
            <li>
              Timer
              <span className="material-note">
                For managing discussion segments
              </span>
            </li>
          </ul>
        </div>

        <div className="setup-steps">
          <h4>Setup Steps</h4>
          <ol>
            <li>Arrange room according to chosen discussion format</li>
            <li>Post corner labels if using 4 Corners format</li>
            <li>Prepare discussion questions and guidelines</li>
            <li>Set up presentation for key points and prompts</li>
          </ol>
        </div>

        <div className="presentation-preview">
          <div className="preview-header">
            <h4>Presentation Preview</h4>
            <a 
              href="https://docs.google.com/presentation/d/1mePxTpgtG4X2_LN6jh4qcqnBBRe9n6t5vS5LanImY6k/export/pptx" 
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
            src="https://docs.google.com/presentation/d/1mePxTpgtG4X2_LN6jh4qcqnBBRe9n6t5vS5LanImY6k/preview"
            title="Presentation Preview"
            allowFullScreen
          ></iframe>
        </div>
      </Accordion>

      {/* Lesson Plan Section */}
      <Accordion title="Lesson Plan" defaultOpen={true}>
        <div className="lesson-section">
          <h4>
            1. Introduction to Ethical Questions
            <span className="time">15 mins</span>
          </h4>
          <div className="activity-block">
            <h5>🤔 Opening Discussion</h5>
            <ul>
              <li>
                <strong>Key Questions:</strong>
                <ul>
                  <li>Should language models be held accountable for spreading misinformation?</li>
                  <li>Is it ethical for students to submit AI-generated content as their own work?</li>
                  <li>Will AI systems like language models replace human jobs?</li>
                </ul>
              </li>
              <li>
                <strong>Process:</strong> Small group discussions to formulate initial thoughts
              </li>
            </ul>
            <div className="teacher-tip">
              Encourage students to consider multiple perspectives before forming their opinions.
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            2. Discussion Format Setup
            <span className="time">10 mins</span>
          </h4>
          <div className="content-block">
            <h5>🎯 Choose and Explain Format</h5>
            <ul>
              <li>
                <strong>Option 1: 4 Corners Debate</strong>
                <ul>
                  <li>Label corners with agreement levels</li>
                  <li>Students move to express opinions</li>
                  <li>Structured argumentation process</li>
                </ul>
              </li>
              <li>
                <strong>Option 2: Fishbowl Discussion (Recommended)</strong>
                <ul>
                  <li>Inner circle for active speakers</li>
                  <li>Outer circle for observers</li>
                  <li>Rotation system for participation</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            3. Main Discussion
            <span className="time">40 mins</span>
          </h4>
          <div className="content-block">
            <h5>💭 Guided Discussion Topics</h5>
            <ul>
              <li>
                <strong>Accountability Discussion:</strong>
                <ul>
                  <li>User responsibility vs. developer responsibility</li>
                  <li>Role of AI in information spread</li>
                </ul>
              </li>
              <li>
                <strong>Academic Integrity:</strong>
                <ul>
                  <li>Boundaries of acceptable AI use</li>
                  <li>Guidelines for academic settings</li>
                </ul>
              </li>
              <li>
                <strong>Workforce Impact:</strong>
                <ul>
                  <li>Job displacement concerns</li>
                  <li>New opportunities and adaptations</li>
                </ul>
              </li>
            </ul>
            <div className="teacher-tip">
              Ensure all students have opportunities to contribute and maintain respectful discourse.
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            4. Wrap-Up and Reflection
            <span className="time">15 mins</span>
          </h4>
          <div className="activity-block">
            <h5>📝 Final Thoughts</h5>
            <ul>
              <li>
                <strong>Discussion Summary:</strong>
                <ul>
                  <li>Recap main arguments and insights</li>
                  <li>Highlight key takeaways</li>
                </ul>
              </li>
              <li>
                <strong>Reflection Questions:</strong>
                <ul>
                  <li>What surprised you during the discussion?</li>
                  <li>How has your understanding of AI ethics evolved?</li>
                  <li>What new perspectives did you gain?</li>
                </ul>
              </li>
            </ul>
            <div className="teacher-tip">
              Encourage students to continue thinking about these ethical considerations as they work with AI.
            </div>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default DayFour;
