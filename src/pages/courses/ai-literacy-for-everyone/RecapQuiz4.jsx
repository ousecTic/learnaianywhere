import React, { useState } from 'react';
import './QuizStyles.css';

const RecapQuiz4 = () => {
  const quizData = [
    {
      id: 1,
      question: 'Why can bias in data lead to wrong predictions?',
      options: [
        'The machine refuses to process new data',
        'The model focuses on feelings instead of numbers',
        'The machine bases its prediction on a limited perspective',
        'The machine forgets its training over time'
      ],
      correctAnswer: 'The machine bases its prediction on a limited perspective'
    },
    {
      id: 2,
      question: 'Who is responsible when an AI tool makes a harmful mistake?',
      options: [
        'The AI tool',
        'The humans who created or used it',
        'The data alone',
        'No one is responsible'
      ],
      correctAnswer: 'The humans who created or used it'
    },
    {
      id: 3,
      question: 'What are ways humans can reduce harm from AI predictions?',
      options: [
        'Let the AI fix its own mistakes',
        'Double-check AI predictions',
        'Ignore errors and hope they improve',
        'Use more AI models without changing anything'
      ],
      correctAnswer: 'Double-check AI predictions'
    },
    {
      id: 4,
      question: 'Which of the following respects people\'s data privacy?',
      options: [
        'Collecting data without telling people',
        'Sharing personal data with anyone who asks',
        'Getting permission and using the data for the reason it was collected',
        'Using data even if it\'s sensitive, as long as it helps the AI'
      ],
      correctAnswer: 'Getting permission and using the data for the reason it was collected'
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
                <h1>Lesson 4 Recap Quiz</h1>
                <p className="subtitle">Test your knowledge of AI ethics and responsibility</p>
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

export default RecapQuiz4;
