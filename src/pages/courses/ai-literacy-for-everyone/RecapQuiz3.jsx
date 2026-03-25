import React, { useState } from 'react';
import './QuizStyles.css';

const RecapQuiz3 = () => {
  const quizData = [
    {
      id: 1,
      question: 'What is an algorithm?',
      options: [
        'A type of computer',
        'A random guess a machine makes',
        'A step-by-step way to complete a task',
        'A rule that never changes'
      ],
      correctAnswer: 'A step-by-step way to complete a task'
    },
    {
      id: 2,
      question: 'Why does a machine need clear and detailed algorithms?',
      options: [
        'So it can talk with humans naturally',
        'Because it can\'t understand like humans and needs exact steps to follow',
        'So it can decide on its own without help',
        'So it can work quickly without clear instructions'
      ],
      correctAnswer: 'Because it can\'t understand like humans and needs exact steps to follow'
    },
    {
      id: 3,
      question: 'What happens during training for a machine?',
      options: [
        'It memorizes every example without checking for mistakes',
        'It waits for humans to fix errors and tell it the right answers',
        'It calculates a prediction, measures its error, and adjusts its equation',
        'It keeps making the same prediction without improving'
      ],
      correctAnswer: 'It calculates a prediction, measures its error, and adjusts its equation'
    },
    {
      id: 4,
      question: 'How do humans and machines process features differently?',
      options: [
        'Humans focus on what feels important, and machines use numbers',
        'Humans turn features into numbers, and machines rely on feeling',
        'Humans and machines both guess randomly',
        'Machines understand emotions better than humans'
      ],
      correctAnswer: 'Humans focus on what feels important, and machines use numbers'
    }
  ];

  const [currentScreen, setCurrentScreen] = useState('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const startQuiz = () => {
    setCurrentScreen('question');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answer) => {
    const question = quizData[currentQuestionIndex];
    const isCorrect = answer === question.correctAnswer;

    setSelectedAnswer(answer);

    const newAnswer = {
      questionId: question.id,
      userAnswer: answer,
      correctAnswer: question.correctAnswer,
      isCorrect: isCorrect
    };

    setUserAnswers([...userAnswers, newAnswer]);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setCurrentScreen('review');
    }
  };

  const viewQuestionFromReview = (index) => {
    setCurrentQuestionIndex(index);
    setCurrentScreen('reviewQuestion');
  };

  const backToReview = () => {
    setCurrentScreen('review');
  };

  const question = quizData[currentQuestionIndex];
  const answer = userAnswers[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="container">
        <div className="card">
          {currentScreen === 'intro' && (
            <div>
              <div className="header">
                <h1>Lesson 3 Recap Quiz</h1>
                <p className="subtitle">Test your knowledge of algorithms and training</p>
              </div>

              <button className="btn-primary" onClick={startQuiz}>
                Start Quiz
              </button>

              <div className="footer">
                <p>Learn AI Anywhere</p>
                <p>4 questions • Multiple choice</p>
              </div>
            </div>
          )}

          {currentScreen === 'question' && (
            <div>
              <p className="progress">
                Question {currentQuestionIndex + 1} of {quizData.length}
              </p>

              <div className="header">
                <h1>Recap Quiz</h1>
              </div>

              <p className="question-text">{question.question}</p>

              <div className="answer-options">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    className={`answer-option ${
                      selectedAnswer === option
                        ? selectedAnswer === question.correctAnswer
                          ? 'correct'
                          : 'incorrect'
                        : selectedAnswer && option === question.correctAnswer
                        ? 'correct'
                        : selectedAnswer
                        ? 'neutral'
                        : ''
                    }`}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {selectedAnswer && (
                <>
                  <div
                    className={`feedback-message ${
                      selectedAnswer === question.correctAnswer ? 'correct' : 'incorrect'
                    }`}
                  >
                    {selectedAnswer === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                  </div>

                  <div className="correct-answer">
                    <div className="correct-answer-label">Correct Answer:</div>
                    <div className="correct-answer-text">{question.correctAnswer}</div>
                  </div>

                  <button className="btn-primary" onClick={nextQuestion}>
                    Next Question
                  </button>
                </>
              )}
            </div>
          )}

          {currentScreen === 'review' && (
            <div>
              <div className="header">
                <h1>Quiz Complete!</h1>
                <p className="subtitle">Here's how you did</p>
              </div>

              <div className="score-display">
                You got {score} out of {quizData.length} correct! (
                {Math.round((score / quizData.length) * 100)}%)
              </div>

              <div className="review-list">
                {quizData.map((q, index) => {
                  const ans = userAnswers[index];
                  return (
                    <div
                      key={q.id}
                      className="review-item"
                      onClick={() => viewQuestionFromReview(index)}
                    >
                      <div className="review-item-header">
                        <div className="review-item-title">Question {index + 1}</div>
                        <div className={`review-item-result ${ans.isCorrect ? 'correct' : 'incorrect'}`}>
                          {ans.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </div>
                      </div>
                      <div className="review-item-details">
                        Your answer: {ans.userAnswer} | Correct answer: {ans.correctAnswer}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="btn-primary" onClick={startQuiz}>
                Retake Quiz
              </button>

              <div className="footer">
                <p>Learn AI Anywhere</p>
                <p>Great job completing the quiz!</p>
              </div>
            </div>
          )}

          {currentScreen === 'reviewQuestion' && (
            <div>
              <p className="progress">
                Question {currentQuestionIndex + 1} of {quizData.length} (Review Mode)
              </p>

              <div className="header">
                <h1>Recap Quiz</h1>
              </div>

              <p className="question-text">{question.question}</p>

              <div className="answer-options">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    className={`answer-option ${
                      answer.userAnswer === option
                        ? answer.isCorrect
                          ? 'correct'
                          : 'incorrect'
                        : option === question.correctAnswer
                        ? 'correct'
                        : 'neutral'
                    }`}
                    disabled
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className={`feedback-message ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                {answer.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </div>

              <div className="correct-answer">
                <div className="correct-answer-label">Correct Answer:</div>
                <div className="correct-answer-text">{question.correctAnswer}</div>
              </div>

              <button className="btn-primary" onClick={backToReview}>
                Back to Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecapQuiz3;
