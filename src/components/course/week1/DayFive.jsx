import React from 'react';
import Accordion from '../../shared/Accordion';
import './Week1.css';

const DayFive = () => {
  return (
    <div className="day-content">
      <h1 className="day-title">Day 5: Project Presentations</h1>
      
      {/* Learning Objectives Section */}
      <Accordion title="Learning Objectives" defaultOpen={true}>
        <ul className="learning-objectives-list">
          <li>
            <strong>Project Synthesis:</strong> Students will synthesize their learning from the week 
            by presenting their AI-powered projects, demonstrating how they applied AI to solve a 
            local problem.
          </li>
          <li>
            <strong>Technical Communication:</strong> Through their presentations, students will 
            explain their data collection process, how they addressed data bias, and showcase 
            their AI models in action.
          </li>
          <li>
            <strong>Critical Reflection:</strong> Students will reflect on the challenges they 
            faced throughout the week and what they learned about AI's capabilities, limitations, 
            and ethical considerations.
          </li>
        </ul>
      </Accordion>

      {/* Preparation Section */}
      <Accordion title="Preparation" defaultOpen={true}>
        <div className="materials">
          <h4>Required Materials</h4>
          <ul>
            <li>
              Student Projects
              <span className="material-note">
                Ensure all groups have their classifiers and materials ready
              </span>
            </li>
            <li>
              Presentation Space
              <span className="material-note">
                Set up area for demonstrations and posters
              </span>
            </li>
            <li>
              Evaluation Rubrics
              <span className="material-note">
                For assessing presentations and projects
              </span>
            </li>
          </ul>
        </div>

        <div className="setup-steps">
          <h4>Setup Steps</h4>
          <ol>
            <li>Arrange presentation space</li>
            <li>Test all devices and connections</li>
            <li>Prepare feedback forms if using</li>
            <li>Set up demonstration stations</li>
          </ol>
        </div>
      </Accordion>

      {/* Lesson Plan Section */}
      <Accordion title="Lesson Plan" defaultOpen={true}>
        <div className="lesson-section">
          <h4>
            1. Final Preparations
            <span className="time">15 mins</span>
          </h4>
          <div className="activity-block">
            <h5>🔧 Project Setup and Review</h5>
            <ul>
              <li>Groups finalize:
                <ul>
                  <li>Posters and visual aids</li>
                  <li>Data organization</li>
                  <li>Classifier demonstrations</li>
                </ul>
              </li>
              <li>Teacher responsibilities:
                <ul>
                  <li>Circulate and assist groups</li>
                  <li>Troubleshoot technical issues</li>
                  <li>Provide encouragement</li>
                </ul>
              </li>
            </ul>
            <div className="teacher-tip">
              Help boost student confidence by reviewing key points they can highlight
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            2. Group Presentations
            <span className="time">35 mins</span>
          </h4>
          <div className="content-block">
            <h5>🎯 Presentation Guidelines</h5>
            <ul>
              <li>
                <strong>Each presentation should cover:</strong>
                <ul>
                  <li>Project Theme and Purpose
                    <ul>
                      <li>Classifier's function and goals</li>
                      <li>Problem being solved</li>
                    </ul>
                  </li>
                  <li>Data Collection Process
                    <ul>
                      <li>Methods and sources</li>
                      <li>Bias considerations</li>
                      <li>Challenges faced</li>
                    </ul>
                  </li>
                  <li>Training and Development
                    <ul>
                      <li>Model training process</li>
                      <li>Adjustments made</li>
                      <li>Unexpected outcomes</li>
                    </ul>
                  </li>
                  <li>Live Demonstration
                    <ul>
                      <li>Show classifier in action</li>
                      <li>Highlight key features</li>
                    </ul>
                  </li>
                  <li>Reflection and Learning
                    <ul>
                      <li>Key takeaways</li>
                      <li>AI insights gained</li>
                      <li>Future improvements</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="teacher-tip">
              Encourage peer questions and discussion after each presentation
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            3. Week Reflection
            <span className="time">10 mins</span>
          </h4>
          <div className="content-block">
            <h5>💭 Final Thoughts</h5>
            <ul>
              <li>Discuss overall learning journey</li>
              <li>Share AI insights and surprises</li>
              <li>Consider future applications</li>
              <li>Address remaining questions</li>
            </ul>
            <div className="teacher-tip">
              End with positive reinforcement of students' growth and achievements
            </div>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default DayFive;
