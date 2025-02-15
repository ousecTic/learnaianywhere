import React from 'react';
import Accordion from '../../shared/Accordion';
import './Week1.css';

const DayOne = () => {
  return (
    <div className="day-content">
      <h1 className="day-title">Day 1: What is AI?</h1>
      
      {/* Learning Objectives Section */}
      <Accordion title="Learning Objectives" defaultOpen={true}>
        <ul className="learning-objectives-list">
          <li>
            <strong>Understanding AI Fundamentals:</strong> Define artificial intelligence through the lens 
            of adaptability and autonomy.
          </li>
          <li>
            <strong>Real-World AI Recognition:</strong> Identify and analyze AI systems in everyday life 
            based on their adaptive and autonomous characteristics.
          </li>
          <li>
            <strong>Hands-on AI Experience:</strong> Explore practical applications of AI through the 
            plant disease detection app and begin planning an image classifier project.
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
                Either printed copies or electronic version for students to copy questions onto their own paper
              </span>
            </li>
            <li>
              <a 
                href="https://github.com/ousecTic/offline-plant-diseases-detection" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Offline Plant Disease Detection App
              </a>
              <span className="material-note">
                Install on student devices before class
              </span>
            </li>
            <li>
              Soft object for popcorn activity (optional)
              <span className="material-note">
                e.g., beanbag or soft ball for the warm-up discussion
              </span>
            </li>
          </ul>
        </div>

        <div className="setup-steps">
          <h4>Setup Steps</h4>
          <ol>
            <li>Review presentation content</li>
            <li>Install the Plant Disease Detection App on all student devices</li>
            <li>Prepare student worksheets (printed or electronic version)</li>
          </ol>
        </div>

        <div className="presentation-preview">
          <div className="preview-header">
            <h4>Presentation Preview</h4>
            <a 
              href="https://docs.google.com/presentation/d/11iNuXRgu4ePFUKYEfFV2sB5xT_nTUuiFOwazv5z6QRg/export/pptx" 
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
            src="https://docs.google.com/presentation/d/11iNuXRgu4ePFUKYEfFV2sB5xT_nTUuiFOwazv5z6QRg/preview"
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
            <span className="time">10 mins</span>
          </h4>
          <div className="activity-block">
            <h5>🎯 What Makes Human Intelligence?</h5>
            <ul>
              <li>
                <strong>Prompt:</strong> Begin by asking the question, "What do you think makes human intelligence?" 
                Give students a minute to think quietly about their response.
              </li>
              <li>
                <strong>Popcorn Method:</strong> Toss a soft object (e.g., a beanbag) to a student, who then shares 
                their answer. That student then tosses it to someone else, who can either add a new idea or build 
                on the previous response.
              </li>
            </ul>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            2. Introduction to Adaptability and Autonomy
            <span className="time">15 mins</span>
          </h4>
          <div className="content-block">
            <h5>🤖 Core Concepts Discussion</h5>
            <ul>
              <li>Introduce two main traits that make humans intelligent:
                <ul>
                  <li><strong>Adaptability:</strong> The ability to learn and grow from experiences.</li>
                  <li><strong>Autonomy:</strong> The ability to make decisions independently.</li>
                </ul>
              </li>
              <li>
                <strong>Transition to AI:</strong> Explain that these are also the traits that AI systems try to replicate.
              </li>
              <li>
                <strong>Introduction to AI:</strong> Brief explanation of Artificial Intelligence with examples 
                like self-driving cars, robots, and everyday applications like YouTube or Google search.
              </li>
            </ul>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            3. Core Activity: Examples of AI in Everyday Life
            <span className="time">25 mins</span>
          </h4>
          <div className="content-block">
            <h5>🔍 Exploring AI Technologies</h5>
            <ul>
              <li>Advanced AI technologies:
                <ul>
                  <li>Self-Driving Cars</li>
                  <li>Humanoid Robots</li>
                  <li>YouTube Recommendations</li>
                  <li>Mobile Phone Voice Commands</li>
                  <li>ChatGPT</li>
                  <li>Google's Personalized Search</li>
                </ul>
              </li>
              <li>
                For each example, explore adaptability and autonomy aspects:
                <div className="emphasis-block">
                  <strong>Example:</strong> YouTube Recommendations adapt by learning user preferences and autonomously make suggestions
                </div>
              </li>
            </ul>
            <h5>💭 Analysis Questions</h5>
            <ul>
              <li>Guide students to consider:
                <ul>
                  <li><em>Adaptive:</em> Does it learn from more data and experience?</li>
                  <li><em>Autonomous:</em> Can it perform tasks without human intervention?</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            4. Activity: "AI or Not" Game
            <span className="time">20 mins</span>
          </h4>
          <div className="activity-block">
            <h5>🎮 Game Instructions</h5>
            <ul>
              <li>Show various scenarios (some AI, some not)</li>
              <li>Students work in pairs/teams to identify AI examples</li>
              <li>Teams must justify answers based on adaptability and autonomy criteria</li>
            </ul>
            <div className="teacher-tip">
              If students struggle, ask guiding questions like "Can it learn?" or "Does it work without constant help?"
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            5. Plant Disease Detection Demo
            <span className="time">15 mins</span>
          </h4>
          <div className="content-block">
            <h5>🌱 Hands-On Exploration</h5>
            <ul>
              <li>Demonstrate example: farmers using Plant Village for plant health diagnosis</li>
              <li>
                Explore offline plant disease detection app
                <div className="resource-link">
                  <strong>App:</strong>
                  <a href="https://github.com/ousecTic/offline-plant-diseases-detection" target="_blank" rel="noopener noreferrer">
                    Offline Plant Disease Detection
                  </a>
                </div>
              </li>
              <li>
                <strong>Reflection Question:</strong> "How does this app show adaptability and autonomy in action?"
              </li>
            </ul>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            6. Project Introduction
            <span className="time">10 mins</span>
          </h4>
          <div className="content-block">
            <h5>📱 Image Classifier Project</h5>
            <ul>
              <li>Introduce week-long AI classifier project</li>
              <li>Show example uses:
                <ul>
                  <li>Metal, Plastic, Glass Identifier</li>
                  <li>Sign Language Recognition</li>
                </ul>
              </li>
              <li>Form teams and brainstorm classifier themes</li>
            </ul>
            <div className="teacher-tip">
              Walk around to check on teams, record team names, and help with brainstorming.
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            7. Recap & Preview
            <span className="time">5 mins</span>
          </h4>
          <div className="content-block">
            <h5>📝 Key Points Review</h5>
            <ul>
              <li>Two core traits of AI: adaptability and autonomy</li>
              <li>AI systems simulate human intelligence</li>
              <li>AI exists in many forms and impacts society</li>
            </ul>
            <div className="preview-note">
              Tomorrow, we'll dive deeper into machine learning and explore how AI systems learn and improve over time!
            </div>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default DayOne;
