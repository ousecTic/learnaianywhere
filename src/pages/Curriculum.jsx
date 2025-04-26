import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/shared/Button';

const Curriculum = () => {
  const weeks = [
    {
      number: 1,
      title: 'Introduction to AI',
      description: 'Introduction to artificial intelligence and its basic concepts',
      lessons: [
        'Day 1: What is AI',
        'Day 2: Components of Machine Learning',
        'Day 3: How do Machine Learn?',
        'Day 4: Can Machine be Biased?',
        'Day 5: Presentation Day'
      ]
    },
    {
      number: 2,
      title: 'Introduction to Generative AI',
      description: 'Introduction to generative artificial intelligence and its basic concepts',
      lessons: [
        'Day 1: What is Generative AI (Hello Language Models)',
        'Day 2: Can Language Models lie?',
        'Day 3: How do Language Models work?',
        'Day 4: Language Model Ethical Discussion',
        'Day 5: Presentation Day'
      ]
    }
  ];

  return (
    <div className="curriculum-page">
      <div className="curriculum-header">
        <div className="container">
          <h1>AI Lessons Overview</h1>
          <p>Our AI lessons are designed for teachers to deliver engaging content in low-tech environments, focusing on core AI concepts and their real-world implications. Completely beginner-friendly for both students and teachers.</p>
        </div>
      </div>

      <div className="container">
        <div className="curriculum-weeks">
          {weeks.map((week, index) => (
            <div key={week.number} className="week-card">
              <h2>Week {week.number}: {week.title}</h2>
              <p className="week-description">{week.description}</p>
              <div className="lessons">
                <h3>Lessons:</h3>
                <ul>
                  {week.lessons.map((lesson, lessonIndex) => (
                    <li key={lessonIndex}>{lesson}</li>
                  ))}
                </ul>
              </div>
              {index === 0 ? (
                <Button to="/curriculum/intro-to-ai" variant="primary">View Lessons →</Button>
              ) : (
                <Button to="/curriculum/intro-to-generative-ai" variant="primary">View Lessons →</Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Curriculum;
