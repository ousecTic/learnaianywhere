import React from 'react';

const CurriculumFeatures = () => {
  const features = [
    {
      title: "Low-Tech Approach",
      description: "Lessons designed for environments with limited technology access",
      icon: "💻",
      ariaLabel: "computer"
    },
    {
      title: "Comprehensive Content",
      description: "Curriculum contains pre-made daily lessons, activities and resources",
      icon: "📚",
      ariaLabel: "books"
    },
    {
      title: "Hands-On Activities",
      description: "Engaging exercises that don't require advanced technology",
      icon: "💡",
      ariaLabel: "light bulb"
    },
    {
      title: "Real-World Applications",
      description: "Examples of AI in everyday life and various industries",
      icon: "🌍",
      ariaLabel: "globe"
    },
    {
      title: "Ethical Considerations",
      description: "Discussions on the societal impact and ethics of AI",
      icon: "💭",
      ariaLabel: "speech"
    },
    {
      title: "Teacher Resources",
      description: "Supplementary materials to support effective instruction",
      icon: "👩‍🏫",
      ariaLabel: "teacher"
    }
  ];

  return (
    <section className="curriculum-features">
      <div className="container">
        <h2>Curriculum Features</h2>
        <div className="curriculum-grid">
          {features.map((feature, index) => (
            <div key={index} className="curriculum-card">
              <h3>
                <span role="img" aria-label={feature.ariaLabel}>{feature.icon}</span>
                {feature.title}
              </h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurriculumFeatures;
