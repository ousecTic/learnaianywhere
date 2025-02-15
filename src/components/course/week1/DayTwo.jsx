import React from 'react';
import Accordion from '../../shared/Accordion';
import './Week1.css';

const DayTwo = () => {
  return (
    <div className="day-content">
      <h1 className="day-title">Day 2: Components of Machine Learning</h1>
      
      {/* Learning Objectives Section */}
      <Accordion title="Learning Objectives" defaultOpen={true}>
        <ul className="learning-objectives-list">
          <li>
            <strong>Understanding ML Components:</strong> Students will understand the three main components 
            of machine learning (data, training, and models) and relate them to studying for an exam.
          </li>
          <li>
            <strong>Hands-on AI Experience:</strong> Students will explore AI through the Pocket AutoML app, 
            creating their own simple machine learning models using real-world items.
          </li>
          <li>
            <strong>Project Development:</strong> Students will begin developing ideas for their group projects 
            by identifying problems that AI can help solve and creating a data collection strategy.
          </li>
        </ul>
      </Accordion>

      {/* Preparation Section */}
      <Accordion title="Preparation" defaultOpen={true}>
        <div className="materials">
          <h4>Required Materials</h4>
          <ul>
            <li>
              Student Worksheet
              <span className="material-note">
                Project planning worksheet for data collection strategy
              </span>
            </li>
            <li>
              <a 
                href="https://github.com/ousecTic/offline-teachable-machine-app/releases/tag/v1.0.0-alpha.1" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Offline Teachable Machine App
              </a>
              <span className="material-note">
                Install on student devices before class
              </span>
            </li>
            <li>
              Various objects for classification
              <span className="material-note">
                Have students bring items or use classroom materials
              </span>
            </li>
          </ul>
        </div>

        <div className="setup-steps">
          <h4>Setup Steps</h4>
          <ol>
            <li>Install the Offline Teachable Machine App on student devices</li>
            <li>Prepare project worksheets</li>
            <li>Test the app with sample objects</li>
          </ol>
        </div>
      </Accordion>

      {/* Lesson Plan Section */}
      <Accordion title="Lesson Plan" defaultOpen={true}>
        <div className="lesson-section">
          <h4>
            1. Warm-Up & Engagement Activity
            <span className="time">10 mins</span>
          </h4>
          <div className="activity-block">
            <h5>📚 Exam Preparation Analogy</h5>
            <ul>
              <li>
                <strong>Prompt:</strong> Ask students "How do you prepare for an exam?"
              </li>
              <li>
                <strong>Discussion:</strong> Guide students to share their study methods and strategies
              </li>
              <li>
                <strong>Connection:</strong> Link their responses to how computers learn
              </li>
            </ul>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            2. Introduction to Machine Learning Components
            <span className="time">20 mins</span>
          </h4>
          <div className="content-block">
            <h5>🧠 Core Components Through Analogy</h5>
            <ul>
              <li>
                <strong>Data = Study Materials:</strong>
                <ul>
                  <li>Books, notes, practice problems</li>
                  <li>Examples and information the system learns from</li>
                </ul>
              </li>
              <li>
                <strong>Training = Studying Process:</strong>
                <ul>
                  <li>Reading, practicing, reviewing</li>
                  <li>Algorithm learning from the data</li>
                </ul>
              </li>
              <li>
                <strong>Model = Trained Brain:</strong>
                <ul>
                  <li>Knowledge ready to apply to new problems</li>
                  <li>Trained system ready to make predictions</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            3. Core Activity: Offline Teachable Machine
            <span className="time">25 mins</span>
          </h4>
          <div className="activity-block">
            <h5>🤖 App Introduction</h5>
            <ul>
              <li>Demonstrate the Teachable Machine app with simple examples</li>
              <li>Show how to:
                <ul>
                  <li>Capture images for different classes</li>
                  <li>Train the model</li>
                  <li>Test predictions</li>
                </ul>
              </li>
            </ul>
            <div className="teacher-tip">
              Start with clearly distinct objects to ensure initial success
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            4. Exploration Time
            <span className="time">25 mins</span>
          </h4>
          <div className="activity-block">
            <h5>🔍 Data Collection and Model Creation</h5>
            <ul>
              <li>Students explore and gather data for their classifiers</li>
              <li>Guide with questions:
                <ul>
                  <li>"Why did you choose these items?"</li>
                  <li>"What features make them unique?"</li>
                  <li>"How varied is your training data?"</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            5. Project Work Time
            <span className="time">15 mins</span>
          </h4>
          <div className="content-block">
            <h5>📝 Project Planning</h5>
            <ul>
              <li>Students work on project worksheets focusing on data strategy</li>
              <li>Example project ideas:
                <ul>
                  <li>Recyclable material sorting</li>
                  <li>Sign language recognition</li>
                  <li>Plant species identification</li>
                </ul>
              </li>
            </ul>
            <div className="teacher-tip">
              Encourage students to think about data collection methods and potential challenges
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            6. Recap & Preview
            <span className="time">5 mins</span>
          </h4>
          <div className="content-block">
            <ul>
              <li>Review the three components of machine learning</li>
              <li>Highlight importance of data quality</li>
              <li>Preview Day 3: Deeper dive into how AI models learn</li>
            </ul>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default DayTwo;
