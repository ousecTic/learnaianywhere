import React, { useState } from 'react';
import './QuizStyles.css';

const AIOrNot = () => {
  const quizData = [
    {
      id: 1,
      image: '/quiz-images/ai-or-not/question-1.jpg',
      question: 'As you type a message on your phone, it shows words you might want to use next. These are based on how you have typed in the past.',
      correctAnswer: 'This Is AI',
      explanation: 'Yes, it is Autonomous – It assists you by suggesting words independently.\n\nYes, it is Adaptive – It analyzes your past typing to suggest words that match your style.'
    },
    {
      id: 2,
      image: '/quiz-images/ai-or-not/question-2.jpg',
      question: 'A phone that lets you make calls or send messages, but only when you type the message or dial the number yourself',
      correctAnswer: 'This Is Not AI',
      explanation: 'No, it is not Autonomous - It only does what you tell it. You have to manually do everything.\n\nNo, it is not Adaptive - It doesn\'t analyze new data to improve. It always works the same way.'
    },
    {
      id: 3,
      image: '/quiz-images/ai-or-not/question-3.jpg',
      question: 'You can unlock your phone by showing your face. The more pictures it analyzes, the better it gets at recognizing you.',
      correctAnswer: 'This Is AI',
      explanation: 'Yes, it is Autonomous - It unlocks the phone independently when it sees your face. You don\'t have to press anything.\n\nYes, it is Adaptive - It analyzes more pictures of your face to improve recognition, even if your appearance changes.'
    },
    {
      id: 4,
      image: '/quiz-images/ai-or-not/question-4.jpg',
      question: 'When you watch videos online, the website shows you more videos based on what you watched in the past. It makes suggestions without you asking.',
      correctAnswer: 'This Is AI',
      explanation: 'Yes, it is Autonomous - It suggests videos on its own without you needing to search for them.\n\nYes, it is Adaptive - It looks at what you have watched before and uses that to suggest new videos that are similar or related.'
    },
    {
      id: 5,
      image: '/quiz-images/ai-or-not/question-5.jpg',
      question: 'A motion sensor light turns on when it detects movement and turns off when no one is there. It reacts the same way every time.',
      correctAnswer: 'This Is Not AI',
      explanation: 'Yes, it is Autonomous - It turns on and off independently when it senses movement. You don\'t have to control it.\n\nNo, it is not Adaptive - It always reacts the same way, no matter what moves.'
    },
    {
      id: 6,
      image: '/quiz-images/ai-or-not/question-6.jpg',
      question: 'A technology you can have a conversation with. It replies based on what you say and changes its response depending on how you ask or what you\'ve said before.',
      correctAnswer: 'This Is AI',
      explanation: 'Yes, it is Autonomous - It gives replies independently without you telling it exactly what to say.\n\nYes, it is Adaptive - It changes its replies based on how you ask or what you\'ve said before.'
    }
  ];

  const [currentScreen, setCurrentScreen] = useState('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const formatExplanation = (explanationText) => {
    const parts = explanationText.split('\n\n');
    return parts.map((part, index) => {
      const trimmedPart = part.trim();
      if (!trimmedPart) return null;

      let label = '';
      let labelClass = '';
      let content = trimmedPart;

      if (trimmedPart.startsWith('Yes, it is Autonomous')) {
        label = 'Autonomy: Yes, it is Autonomous';
        labelClass = 'positive';
        content = trimmedPart.substring('Yes, it is Autonomous'.length).trim();
        if (content.startsWith('–') || content.startsWith('-')) {
          content = content.substring(1).trim();
        }
      } else if (trimmedPart.startsWith('No, it is not Autonomous')) {
        label = 'Autonomy: No, it is not Autonomous';
        labelClass = 'negative';
        content = trimmedPart.substring('No, it is not Autonomous'.length).trim();
        if (content.startsWith('–') || content.startsWith('-')) {
          content = content.substring(1).trim();
        }
      } else if (trimmedPart.startsWith('Yes, it is Adaptive')) {
        label = 'Adaptivity: Yes, it is Adaptive';
        labelClass = 'positive';
        content = trimmedPart.substring('Yes, it is Adaptive'.length).trim();
        if (content.startsWith('–') || content.startsWith('-')) {
          content = content.substring(1).trim();
        }
      } else if (trimmedPart.startsWith('No, it is not Adaptive')) {
        label = 'Adaptivity: No, it is not Adaptive';
        labelClass = 'negative';
        content = trimmedPart.substring('No, it is not Adaptive'.length).trim();
        if (content.startsWith('–') || content.startsWith('-')) {
          content = content.substring(1).trim();
        }
      }

      if (label) {
        return (
          <div key={index} className="explanation-item">
            <div className={`explanation-label ${labelClass}`}>{label}</div>
            <div className="explanation-content">{content}</div>
          </div>
        );
      } else {
        return (
          <div key={index} className="explanation-content">
            {trimmedPart}
          </div>
        );
      }
    });
  };

  const startQuiz = () => {
    setCurrentScreen('question');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleAnswer = (answer) => {
    const question = quizData[currentQuestionIndex];
    const isCorrect = answer === question.correctAnswer;

    setSelectedAnswer(answer);
    setShowFeedback(true);

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
      setShowFeedback(false);
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
                <h1>Let's Play AI or Not!</h1>
                <p className="subtitle">Test your understanding of AI concepts</p>
              </div>

              <div className="intro-list">
                <ol>
                  <li>I will describe a situation</li>
                  <li>Observe whether it involves autonomy and adaptivity</li>
                  <li>Decide if it is AI or Not</li>
                  <li>Share your reasoning</li>
                </ol>
              </div>

              <button className="btn-primary" onClick={startQuiz}>
                Start Game
              </button>

              <div className="footer">
                <p>Learn AI Anywhere</p>
                <p>6 questions • Educational game</p>
              </div>
            </div>
          )}

          {currentScreen === 'question' && (
            <div>
              <p className="progress">
                Round {currentQuestionIndex + 1} of {quizData.length}
              </p>

              <div className="header">
                <h1>AI or Not?</h1>
              </div>

              <img
                src={question.image}
                alt={`Question ${currentQuestionIndex + 1} illustration`}
                className="question-image"
              />

              <p className="question-text">{question.question}</p>

              <div className="answer-buttons">
                <button
                  className={`answer-btn ${
                    selectedAnswer === 'This Is AI'
                      ? selectedAnswer === question.correctAnswer
                        ? 'correct'
                        : 'incorrect'
                      : selectedAnswer && question.correctAnswer === 'This Is AI'
                      ? 'correct'
                      : ''
                  }`}
                  onClick={() => handleAnswer('This Is AI')}
                  disabled={selectedAnswer !== null}
                >
                  This Is AI
                </button>
                <button
                  className={`answer-btn ${
                    selectedAnswer === 'This Is Not AI'
                      ? selectedAnswer === question.correctAnswer
                        ? 'correct'
                        : 'incorrect'
                      : selectedAnswer && question.correctAnswer === 'This Is Not AI'
                      ? 'correct'
                      : ''
                  }`}
                  onClick={() => handleAnswer('This Is Not AI')}
                  disabled={selectedAnswer !== null}
                >
                  This Is Not AI
                </button>
              </div>

              {showFeedback && (
                <>
                  <div
                    className={`feedback-message ${
                      selectedAnswer === question.correctAnswer ? 'correct' : 'incorrect'
                    }`}
                  >
                    {selectedAnswer === question.correctAnswer
                      ? `✓ Correct! ${question.correctAnswer}.`
                      : `✗ Incorrect. The correct answer is: ${question.correctAnswer}.`}
                  </div>

                  <div className="explanation">
                    <h3>Explanation:</h3>
                    {formatExplanation(question.explanation)}
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
                <h1>Game Complete!</h1>
                <p className="subtitle">Here's how you did</p>
              </div>

              <div className="score-display">
                You got {score} out of {quizData.length} correct!
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
                        <div className="review-item-title">Round {index + 1}</div>
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
                Play Again
              </button>

              <div className="footer">
                <p>Learn AI Anywhere</p>
                <p>Keep learning about AI!</p>
              </div>
            </div>
          )}

          {currentScreen === 'reviewQuestion' && (
            <div>
              <p className="progress">
                Round {currentQuestionIndex + 1} of {quizData.length} (Review Mode)
              </p>

              <div className="header">
                <h1>AI or Not?</h1>
              </div>

              <img
                src={question.image}
                alt={`Question ${currentQuestionIndex + 1} illustration`}
                className="question-image"
              />

              <p className="question-text">{question.question}</p>

              <div className="answer-buttons">
                <button
                  className={`answer-btn ${
                    answer.userAnswer === 'This Is AI'
                      ? answer.isCorrect
                        ? 'correct'
                        : 'incorrect'
                      : question.correctAnswer === 'This Is AI'
                      ? 'correct'
                      : ''
                  }`}
                  disabled
                >
                  This Is AI
                </button>
                <button
                  className={`answer-btn ${
                    answer.userAnswer === 'This Is Not AI'
                      ? answer.isCorrect
                        ? 'correct'
                        : 'incorrect'
                      : question.correctAnswer === 'This Is Not AI'
                      ? 'correct'
                      : ''
                  }`}
                  disabled
                >
                  This Is Not AI
                </button>
              </div>

              <div className={`feedback-message ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                {answer.isCorrect
                  ? `✓ Correct! ${question.correctAnswer}.`
                  : `✗ Incorrect. The correct answer is: ${question.correctAnswer}.`}
              </div>

              <div className="explanation">
                <h3>Explanation:</h3>
                {formatExplanation(question.explanation)}
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

export default AIOrNot;
