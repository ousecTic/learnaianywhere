import React from 'react';
import Accordion from '../../shared/Accordion';
import './Week2.css';

const DayThree = () => {
  return (
    <div className="day-content">
      <h1 className="day-title">Day 3: Understanding Language Model Mechanics</h1>
      
      {/* Learning Objectives Section */}
      <Accordion title="Learning Objectives" defaultOpen={true}>
        <ul className="learning-objectives-list">
          <li>
            <strong>Hands-on Experience:</strong> Experience the mechanics of language model responses, 
            observing how word prediction works and how data limitations can impact accuracy.
          </li>
          <li>
            <strong>Comparative Understanding:</strong> Understand the differences between human and 
            AI-generated responses, recognizing that AI lacks a purposeful goal and instead generates 
            responses based on probability.
          </li>
          <li>
            <strong>Technical Knowledge:</strong> Learn the fundamentals of prompt engineering, including 
            how to structure prompts to guide AI towards desired outcomes.
          </li>
          <li>
            <strong>Practical Application:</strong> Apply prompt engineering techniques to create varied 
            trivia questions, experimenting with prompt specificity to influence AI-generated responses.
          </li>
        </ul>
      </Accordion>

      {/* Preparation Section */}
      <Accordion title="Preparation" defaultOpen={true}>
        <div className="materials">
          <h4>Required Materials</h4>
          <ul>
            <li>
              Word Cards or Sticky Notes
              <span className="material-note">
                For the "Act Like a Language Model" game
              </span>
            </li>
            <li>
              Limited Vocabulary List
              <span className="material-note">
                Prepared list of words for Level 3 of the game
              </span>
            </li>
            <li>
              Small Language Model
              <span className="material-note">
                For demonstrating prompt engineering concepts
              </span>
            </li>
            <li>
              Student Worksheets
              <span className="material-note">
                For recording prompt engineering experiments
              </span>
            </li>
          </ul>
        </div>

        <div className="setup-steps">
          <h4>Setup Steps</h4>
          <ol>
            <li>Prepare word cards or sticky notes for the game</li>
            <li>Create a limited vocabulary list for Level 3</li>
            <li>Test example prompts with the language model</li>
            <li>Print discussion questions for tomorrow's ethics discussion</li>
          </ol>
        </div>

        <div className="presentation-preview">
          <div className="preview-header">
            <h4>Presentation Preview</h4>
            <a 
              href="https://docs.google.com/presentation/d/1u_I3Fs8Lrl0uEzREQJvlz3mJGB5uVjMpI6XMwdJrkrQ/export/pptx" 
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
            src="https://docs.google.com/presentation/d/1u_I3Fs8Lrl0uEzREQJvlz3mJGB5uVjMpI6XMwdJrkrQ/preview"
            title="Presentation Preview"
            allowFullScreen
          ></iframe>
        </div>
      </Accordion>

      {/* Lesson Plan Section */}
      <Accordion title="Lesson Plan" defaultOpen={true}>
        <div className="lesson-section">
          <h4>
            1. Act Like a Language Model Game
            <span className="time">20 mins</span>
          </h4>
          <div className="activity-block">
            <h5>🎮 Interactive Simulation</h5>
            <ul>
              <li>
                <strong>Game Setup:</strong> Explain the three levels of the game
              </li>
              <li>
                <strong>Activity Flow:</strong>
                <ul>
                  <li>Level 1: Individual responses to questions</li>
                  <li>Level 2: Collaborative word-by-word sentence building</li>
                  <li>Level 3: Sentence building with limited vocabulary</li>
                </ul>
              </li>
              <li>
                <strong>Reflection:</strong> Discuss how constraints affected responses
              </li>
            </ul>
            <div className="teacher-tip">
              Use student observations to highlight the differences between human and AI thinking processes.
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            2. Understanding Language Model Mechanics
            <span className="time">25 mins</span>
          </h4>
          <div className="content-block">
            <h5>🤖 Breaking Down Each Level</h5>
            <ul>
              <li>
                <strong>Level 1 Analysis:</strong>
                <ul>
                  <li>Compare human goal-oriented thinking vs. AI word prediction</li>
                  <li>Discuss the importance of planning in human responses</li>
                </ul>
              </li>
              <li>
                <strong>Level 2 Analysis:</strong>
                <ul>
                  <li>Explore probability-based word selection</li>
                  <li>Demonstrate how meaning can shift unexpectedly</li>
                </ul>
              </li>
              <li>
                <strong>Level 3 Analysis:</strong>
                <ul>
                  <li>Examine the impact of limited training data</li>
                  <li>Connect to AI hallucinations and accuracy issues</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            3. Prompt Engineering Fundamentals
            <span className="time">25 mins</span>
          </h4>
          <div className="content-block">
            <h5>✍️ Crafting Better Prompts</h5>
            <ul>
              <li>
                <strong>Key Principles:</strong>
                <ul>
                  <li>Be detailed and specific in prompts</li>
                  <li>Iterate and refine based on responses</li>
                  <li>Provide relevant context</li>
                </ul>
              </li>
              <li>
                <strong>Examples:</strong>
                <ul>
                  <li>Compare basic vs. detailed prompts</li>
                  <li>Analyze how specificity affects outputs</li>
                </ul>
              </li>
            </ul>
            <div className="teacher-tip">
              Use real-time demonstrations to show how different prompts lead to different results.
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            4. Project Work and Ethics Preview
            <span className="time">20 mins</span>
          </h4>
          <div className="activity-block">
            <h5>📝 Practical Application</h5>
            <ul>
              <li>
                <strong>Trivia Question Development:</strong>
                <ul>
                  <li>Experiment with prompts for answer choices</li>
                  <li>Test and refine prompting strategies</li>
                </ul>
              </li>
              <li>
                <strong>Ethics Preview:</strong>
                <ul>
                  <li>Introduce tomorrow's Fishbowl Discussion topics</li>
                  <li>Share key ethical questions for preparation</li>
                  <li>Discuss guidelines for respectful debate</li>
                </ul>
              </li>
            </ul>
            <div className="teacher-tip">
              Encourage students to think about their stance on the ethical questions overnight.
            </div>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default DayThree;
