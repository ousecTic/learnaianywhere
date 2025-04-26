import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/shared/Button';

const GetInvolved = () => {
  const [activeTab, setActiveTab] = React.useState('volunteers');

  const tabs = [
    { id: 'volunteers', label: 'Volunteers' },
    { id: 'partnerships', label: 'Partnerships' }
  ];

  const volunteerRoles = [
    {
      title: 'Teachers',
      description: 'Ensures curriculum relevance and alignment with educational goals.',
      responsibilities: [
        'Implement the curriculum in classrooms or community spaces.',
        'Provide before and after feedback to measure student learning outcomes.',
        'Share their own insights about the curriculum\'s usability and effectiveness.',
        'Submit qualitative data, such as completed worksheets and presentation videos, to help refine lesson content and delivery.'
      ]
    },
    {
      title: 'Translators',
      description: 'Adapt curriculum materials into local languages to enhance accessibility and cultural relevance.',
      responsibilities: []
    },
    {
      title: 'Ambassadors',
      description: 'Advocate for the program in their communities, helping to recruit other volunteers and establish partnerships.',
      responsibilities: []
    }
  ];

  return (
    <div className="get-involved-page">
      <div className="page-header">
        <div className="container">
          <h1>Get Involved</h1>
          <p>Join us in our mission to make AI education accessible to everyone, everywhere. Whether you're an individual or an organization, there are many ways to contribute and make a difference.</p>
        </div>
      </div>

      <div className="container">
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'volunteers' && (
            <div className="volunteers-section">
              <div className="section-intro">
                <h2>Volunteers</h2>
                <p>Our volunteers are at the heart of advancing AI literacy in underserved communities. By helping to implement our curriculum, volunteers directly shape the educational experience for students who need it most.</p>
                <p>Beyond classroom support, volunteers like translators or ambassadors help us build long-term relationships and expand the reach of our program.</p>
              </div>

              <div className="role-cards">
                {volunteerRoles.map((role) => (
                  <div key={role.title} className="role-card">
                    <h3>{role.title}</h3>
                    <p>{role.description}</p>
                    {role.responsibilities.length > 0 && (
                      <ul>
                        {role.responsibilities.map((responsibility, index) => (
                          <li key={index}>{responsibility}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'partnerships' && (
            <div className="partnerships-section">
              <div className="section-intro">
                <h2>Partnerships</h2>
                <p>Even with a dedicated team and individual volunteers, we need strong partnerships to provide expertise, scalable solutions, and funding.</p>
                <p>Partnerships are a cornerstone of sustainability, enabling us to expand testing, development, and adoption of our curriculum to reach more communities.</p>
              </div>

              <div className="role-cards">
                <div className="role-card">
                  <h3>Partners</h3>
                  <p>Ensures curriculum relevance and alignment with educational goals.</p>
                  <ul>
                    <li>Expert Guidance: Provide expertise in curriculum design, pedagogy, and implementation strategies.</li>
                    <li>Technological Innovation: Collaborate on developing or improving offline-friendly educational tools.</li>
                    <li>Academic Research: Partner with universities or research institutions to assess curriculum impact.</li>
                    <li>Localized Implementation Support: Work with nonprofits and NGOs to adapt the curriculum to cultural contexts.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="container">
          <div className="cta-section">
            <h2>Ready to Make a Difference?</h2>
            <p>Join us in our mission to bring AI literacy to underserved communities worldwide.</p>
            <div className="cta-buttons">
              <Button to="/contact" variant="primary">Contact Us</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetInvolved;
