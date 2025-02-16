import React from 'react';
import Accordion from '../../shared/Accordion';
import './Week2.css';

const DayFive = () => {
  return (
    <div className="day-content">
      <h1 className="day-title">Day 5: AI Trivia Challenge</h1>
      
      {/* Learning Objectives Section */}
      <Accordion title="Learning Objectives" defaultOpen={true}>
        <ul className="learning-objectives-list">
          <li>
            <strong>Knowledge Review:</strong> Review and engage with trivia questions created by each team, 
            reinforcing understanding of AI concepts covered throughout the week.
          </li>
          <li>
            <strong>Collaborative Learning:</strong> Foster friendly competition while demonstrating 
            mastery of course material through team-based trivia.
          </li>
        </ul>
      </Accordion>

      {/* Preparation Section */}
      <Accordion title="Preparation" defaultOpen={true}>
        <div className="materials">
          <h4>Required Materials</h4>
          <ul>
            <li>
              Team Answer Boards
              <span className="material-note">
                Whiteboards or paper for teams to write answers
              </span>
            </li>
            <li>
              Scoreboard
              <span className="material-note">
                For tracking team points throughout the game
              </span>
            </li>
            <li>
              Timer
              <span className="material-note">
                For managing answer time limits
              </span>
            </li>
            <li>
              Team Questions
              <span className="material-note">
                Collected and organized trivia questions from each team
              </span>
            </li>
          </ul>
        </div>

        <div className="setup-steps">
          <h4>Setup Steps</h4>
          <ol>
            <li>Arrange room for team-based competition</li>
            <li>Prepare scoreboard and scoring system</li>
            <li>Organize team questions in presentation order</li>
            <li>Set up timer for answer periods</li>
          </ol>
        </div>
      </Accordion>

      {/* Lesson Plan Section */}
      <Accordion title="Lesson Plan" defaultOpen={true}>
        <div className="lesson-section">
          <h4>
            1. Game Setup and Rules
            <span className="time">15 mins</span>
          </h4>
          <div className="activity-block">
            <h5>🎮 Competition Overview</h5>
            <ul>
              <li>
                <strong>Team Organization:</strong>
                <ul>
                  <li>Ensure teams have their answer boards</li>
                  <li>Review scoring system</li>
                  <li>Explain participation rules</li>
                </ul>
              </li>
              <li>
                <strong>Key Rules:</strong>
                <ul>
                  <li>Teams cannot answer their own questions</li>
                  <li>No answering questions you helped review</li>
                  <li>All teams reveal answers simultaneously</li>
                </ul>
              </li>
            </ul>
            <div className="teacher-tip">
              Emphasize that the goal is both learning and fun - maintain a positive, encouraging atmosphere.
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            2. Trivia Round One
            <span className="time">30 mins</span>
          </h4>
          <div className="content-block">
            <h5>🏆 First Half Competition</h5>
            <ul>
              <li>
                <strong>Process:</strong>
                <ul>
                  <li>Teams present their questions in turn</li>
                  <li>Allow time for teams to write answers</li>
                  <li>Coordinate simultaneous answer reveals</li>
                  <li>Award points for correct answers</li>
                </ul>
              </li>
              <li>
                <strong>Timing:</strong>
                <ul>
                  <li>30-45 seconds per question for answers</li>
                  <li>Brief discussion after each question</li>
                </ul>
              </li>
            </ul>
            <div className="teacher-tip">
              Use incorrect answers as learning opportunities to clarify concepts.
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            3. Break and Midpoint Review
            <span className="time">10 mins</span>
          </h4>
          <div className="activity-block">
            <h5>📊 Progress Check</h5>
            <ul>
              <li>
                <strong>Activities:</strong>
                <ul>
                  <li>Review current scores</li>
                  <li>Brief team strategy time</li>
                  <li>Address any rule clarifications</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            4. Trivia Round Two
            <span className="time">30 mins</span>
          </h4>
          <div className="content-block">
            <h5>🎯 Final Competition Round</h5>
            <ul>
              <li>
                <strong>Process:</strong>
                <ul>
                  <li>Continue with remaining questions</li>
                  <li>Maintain energy and engagement</li>
                  <li>Track scores carefully</li>
                </ul>
              </li>
            </ul>
            <div className="teacher-tip">
              Keep the pace lively while ensuring all teams have fair chances to participate.
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h4>
            5. Winners and Wrap-Up
            <span className="time">15 mins</span>
          </h4>
          <div className="activity-block">
            <h5>🎉 Celebration and Review</h5>
            <ul>
              <li>
                <strong>Final Activities:</strong>
                <ul>
                  <li>Announce final scores and winners</li>
                  <li>Recognize team achievements</li>
                  <li>Review interesting questions and answers</li>
                  <li>Reflect on week's learning journey</li>
                </ul>
              </li>
            </ul>
            <div className="teacher-tip">
              End on a positive note by highlighting how much students have learned about AI throughout the week.
            </div>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default DayFive;
