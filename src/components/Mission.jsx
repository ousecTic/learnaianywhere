import React from 'react';
import './Mission.css';

const Mission = () => {
  return (
    <section className="mission">
      <div className="container">
        <p className="mission-statement">
          AI literacy programs are built for ideal conditions, but many classrooms lack the connectivity, devices, and support to run them.
        </p>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">2.2B</div>
            <p className="stat-description">
              people remain offline worldwide (
              <a href="https://www.itu.int/en/ITU-D/Statistics/Pages/facts/default.aspx" target="_blank" rel="noopener noreferrer">ITU, 2025</a>
              )
            </p>
          </div>
          <div className="stat-card">
            <div className="stat-number">2/3</div>
            <p className="stat-description">
              of educators surveyed across 59 countries lacked sufficient computers at their institution (
              <a href="https://iite.unesco.org/wp-content/uploads/2025/12/Guidelines-Gender-ICT-Global-South-Edu-fnl.pdf" target="_blank" rel="noopener noreferrer">UNESCO IITE, 2022</a>
              )
            </p>
          </div>
          <div className="stat-card">
            <div className="stat-number">41%</div>
            <p className="stat-description">
              of teachers in low-income countries receive practical ICT guidance (
              <a href="https://teachertaskforce.org/blog/improve-state-education-around-world-we-need-support-teachers-how" target="_blank" rel="noopener noreferrer">UNESCO Teacher Task Force</a>
              )
            </p>
          </div>
        </div>
        <p className="mission-solution">
          That's why we created Learn AI Anywhere - offline-first AI education designed for real-world classrooms, not just ideal ones.
        </p>
      </div>
    </section>
  );
};

export default Mission;
