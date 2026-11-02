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
              people remain offline, most of them in low- and middle-income countries (
              <a href="https://www.itu.int/en/ITU-D/Statistics/Pages/facts/default.aspx" target="_blank" rel="noopener noreferrer">ITU, 2025</a>
              )
            </p>
          </div>
          <div className="stat-card">
            <div className="stat-number">2/3</div>
            <p className="stat-description">
              of educators surveyed across 59 countries said their school lacked sufficient computers for students; many in rural areas also lacked electricity or internet (
              <a href="https://iite.unesco.org/wp-content/uploads/2023/07/Analytical-report-fnl5.pdf" target="_blank" rel="noopener noreferrer">UNESCO IITE, 2022</a>
              )
            </p>
          </div>
          <div className="stat-card">
            <div className="stat-number">50%</div>
            <p className="stat-description">
              of secondary teachers in sub-Saharan Africa have received even minimum training, and it often leaves out ICT. Teachers need training to teach with technology, and that support is scarcest in low-income countries (
              <a href="https://www.unesco.org/en/articles/startling-digital-divides-distance-learning-emerge" target="_blank" rel="noopener noreferrer">UNESCO, 2020</a>
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
