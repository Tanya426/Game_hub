import React, { useState, useEffect } from 'react';
import { ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { quizQuestions } from '../utils/gameData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GameStats } from '../types';

interface QuizArenaProps {
  onBack: () => void;
}

export default function QuizArena({ onBack }: QuizArenaProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStats, setGameStats] = useLocalStorage<GameStats>('gameStats', {});

  const questions = quizQuestions.slice().sort(() => Math.random() - 0.5).slice(0, 5);
  const currentQ = questions[currentQuestion];

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && selectedAnswer === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswer === null) {
      handleNextQuestion();
    }
  }, [timeLeft, gameOver, selectedAnswer]);

  const updateStats = (finalScore: number) => {
    const gameId = 'quiz-arena';
    const currentStats = gameStats[gameId] || { gamesPlayed: 0, bestScore: 0, totalScore: 0, averageScore: 0 };
    
    const newStats = {
      gamesPlayed: currentStats.gamesPlayed + 1,
      bestScore: Math.max(currentStats.bestScore, finalScore),
      totalScore: currentStats.totalScore + finalScore,
      averageScore: 0,
    };
    newStats.averageScore = Math.round(newStats.totalScore / newStats.gamesPlayed);

    setGameStats({ ...gameStats, [gameId]: newStats });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === currentQ.correct) {
      setScore(score + timeLeft + 10);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setGameOver(true);
      updateStats(score + (selectedAnswer === currentQ.correct ? timeLeft + 10 : 0));
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setGameOver(false);
    setTimeLeft(30);
  };

  if (gameOver) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Quiz Complete!</h2>
          <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            {score}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You answered {questions.filter((_, i) => i <= currentQuestion).length} questions
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={resetGame}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Play Again</span>
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🧠 Quiz Arena</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
            <div className="text-2xl font-bold text-purple-400">{score}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-green-400'}`}>
              {timeLeft}s
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
              {currentQ.category}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white leading-relaxed">
          {currentQ.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              className={`p-4 rounded-lg text-left transition-all duration-200 ${
                selectedAnswer === null
                  ? 'bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900 border border-transparent hover:border-purple-300 dark:hover:border-purple-600'
                  : selectedAnswer === index
                  ? index === currentQ.correct
                    ? 'bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300'
                  : index === currentQ.correct
                  ? 'bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-800 opacity-50'
              }`}
            >
              <span className="font-medium text-gray-700 dark:text-gray-300 mr-3">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          ))}
        </div>

        {selectedAnswer !== null && (
          <div className="text-center">
            <button
              onClick={handleNextQuestion}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 mx-auto"
            >
              <span>{currentQuestion + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}