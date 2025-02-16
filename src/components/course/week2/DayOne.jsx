import React from 'react';
import Accordion from '../../shared/Accordion';
import './Week2.css';

const DayOne = () => {
  return (
    <div className="day-content">
      <h1 className="day-title">Day 1: Introduction to Generative AI</h1>
      
      {/* Learning Objectives Section */}
      <Accordion title="Learning Objectives" defaultOpen={true}>
        <ul className="learning-objectives-list">
          <li>
            <strong>Understanding Language Models:</strong> Be introduced to the concept of language models 
            and understand how they generate responses based on prompts.
          </li>
          <li>
            <strong>Creative Applications:</strong> Explore the potential of language models as tools for 
            idea generation and brainstorming.
          </li>
          <li>
            <strong>Prompt Engineering:</strong> Understand how prompts influence AI responses and begin 
            thinking about effective prompts.
          </li>
          <li>
            <strong>Research Skills:</strong> Use the offline Kiwix tool to gather three accurate facts 
            as a foundation for creating trivia questions.
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
                Students will copy questions into their notebooks
              </span>
            </li>
            <li>
              Kiwix (offline Wikipedia)
              <span className="material-note">
                Install and download relevant content before class
              </span>
            </li>
            <li>
              Small Language Model (TinyLlama or Llama 3.2 1b)
              <span className="material-note">
                Ensure offline access is configured
              </span>
            </li>
            <li>
              Sticky notes or cut-up paper
              <span className="material-note">
                For the "Data Points of Thought" activity
              </span>
            </li>
          </ul>
        </div>

        <div className="setup-steps">
          <h4>Setup Steps</h4>
          <ol>
            <li>Review presentation content and prepare examples for "AI or Human?" game</li>
            <li>Set up and test the language model on teaching device</li>
            <li>Prepare sticky notes or paper slips for the thought activity</li>
            <li>Test Kiwix installation and content availability</li>
          </ol>
        </div>

        <div className="presentation-preview">
          <div className="preview-header">
            <h4>Presentation Preview</h4>
            <a 
              href="https://docs.google.com/presentation/d/1uCs8isYB0ec7koQzvm694T4ZSzdEeEUUcoM7sE1KpvM/export/pptx" 
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
            src="https://docs.google.com/presentation/d/1uCs8isYB0ec7koQzvm694T4ZSzdEeEUUcoM7sE1KpvM/preview"
            title="Presentation Preview"
            allowFullScreen
          ></iframe>
        </div>
      </Accordion>

      {/* Lesson Plan Section */}
      <Accordion title="Lesson Plan" defaultOpen={true}>
        <div className="lesson-section">
          <h4>
            1. Warm-Up Activity: AI or Human?
            <span className="time">15 mins</span>
          </h4>
          <div className="activity-block">
            <h5>🎯 Guessing Game</h5>
            <ul>
              <li>
                <strong>Setup:</strong> Present various examples of content (text, images, videos) - some AI-generated, some human-created.
              </li>
              <li>
                <strong>Activity:</strong> Students try to identify which content is AI-generated vs. human-created.
              </li>
              <li>
                <strong>Discussion:</strong> Explore the characteristics that helped students make their decisions.
              </li>
            </ul>
            <div className="teacher-tip">
              Choose examples that challenge assumptions and spark discussion about AI capabilities.
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            2. Introduction to Generative AI
            <span className="time">15 mins</span>
          </h4>
          <div className="content-block">
            <h5>🤖 Core Concepts</h5>
            <ul>
              <li>
                Define generative AI:
                <ul>
                  <li>AI systems that create new content based on patterns in training data</li>
                  <li>Focus on text-to-text generation and language models</li>
                </ul>
              </li>
              <li>
                <strong>Key Points:</strong>
                <ul>
                  <li>How language models learn from text data</li>
                  <li>The role of patterns in generating responses</li>
                  <li>The importance of prompts in guiding AI output</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            3. Data Points of Thought Activity
            <span className="time">20 mins</span>
          </h4>
          <div className="activity-block">
            <h5>💭 Thought Collection Exercise</h5>
            <ul>
              <li>
                <strong>Prompt:</strong> "What is a thoughtful gift you would give to a friend?"
              </li>
              <li>
                <strong>Process:</strong>
                <ul>
                  <li>Give students 90 seconds to write responses on sticky notes</li>
                  <li>Collect and display responses on a board or in a container</li>
                  <li>Discuss the variety and personalization in responses</li>
                </ul>
              </li>
              <li>
                <strong>Connection:</strong> Explain how these responses are like "data points" that help train AI models
              </li>
            </ul>
            <div className="teacher-tip">
              Emphasize the contrast between thoughtful human responses and AI's rapid generation capabilities.
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            4. Language Model Interaction
            <span className="time">20 mins</span>
          </h4>
          <div className="content-block">
            <h5>🔄 Hands-on Practice</h5>
            <ul>
              <li>
                <strong>Demo:</strong> Show how to interact with the small language model
              </li>
              <li>
                <strong>Practice:</strong> Students experiment with different prompts
              </li>
              <li>
                <strong>Compare:</strong> Students analyze AI responses vs. their own answers from the previous activity
              </li>
            </ul>
            <div className="teacher-tip">
              Guide students to notice both the strengths and limitations of the AI's responses.
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            5. Trivia Quiz Project Introduction
            <span className="time">15 mins</span>
          </h4>
          <div className="activity-block">
            <h5>📝 Project Overview</h5>
            <ul>
              <li>
                <strong>Project Goals:</strong>
                <ul>
                  <li>Research interesting facts using Kiwix</li>
                  <li>Create engaging trivia questions</li>
                  <li>Test questions using the language model</li>
                  <li>Generate and verify answer choices</li>
                </ul>
              </li>
              <li>
                <strong>First Steps:</strong> Guide students to:
                <ul>
                  <li>Start researching their first three facts</li>
                  <li>Record findings in their worksheets</li>
                </ul>
              </li>
            </ul>
            <div className="teacher-tip">
              Encourage students to choose diverse topics that interest them to maintain engagement throughout the project.
            </div>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default DayOne;
