import React, { useState, useEffect } from 'react';
import { RotateCcw, Lightbulb, AlertTriangle } from 'lucide-react';
import { wordsToGuess } from '../utils/gameData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GameStats } from '../types';

interface WordGuessProps {
  onBack: () => void;
}

export default function WordGuess({ onBack }: WordGuessProps) {
  const [currentWord, setCurrentWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [score, setScore] = useState(0);
  const [gameStats, setGameStats] = useLocalStorage<GameStats>('gameStats', {});

  const maxWrongGuesses = 6;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (currentWord && gameStatus === 'playing') {
      const wordLetters = new Set(currentWord.split(''));
      const correctGuesses = new Set([...guessedLetters].filter(letter => wordLetters.has(letter)));
      
      if (correctGuesses.size === wordLetters.size) {
        setGameStatus('won');
        const finalScore = Math.max(0, 100 - (wrongGuesses * 10) + (currentWord.length * 5));
        setScore(finalScore);
        updateStats('win', finalScore);
      } else if (wrongGuesses >= maxWrongGuesses) {
        setGameStatus('lost');
        updateStats('loss', 0);
      }
    }
  }, [guessedLetters, wrongGuesses, currentWord]);

  const startNewGame = () => {
    const randomWord = wordsToGuess[Math.floor(Math.random() * wordsToGuess.length)];
    setCurrentWord(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameStatus('playing');
    setScore(0);
  };

  const updateStats = (result: 'win' | 'loss', finalScore: number) => {
    const gameId = 'word-guess';
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

  const guessLetter = (letter: string) => {
    if (guessedLetters.has(letter) || gameStatus !== 'playing') return;
    
    const newGuessedLetters = new Set([...guessedLetters, letter]);
    setGuessedLetters(newGuessedLetters);
    
    if (!currentWord.includes(letter)) {
      setWrongGuesses(prev => prev + 1);
    }
  };

  const getDisplayWord = () => {
    return currentWord.split('').map(letter => 
      guessedLetters.has(letter) ? letter : '_'
    ).join(' ');
  };

  const getHangmanArt = () => {
    const stages = [
      '',
      '  |\n  |',
      '  |\n  |\n  |',
      '  +---+\n  |   |\n      |',
      '  +---+\n  |   |\n  😵   |\n      |',
      '  +---+\n  |   |\n  😵   |\n  |   |\n      |',
      '  +---+\n  |   |\n  😵   |\n /|   |\n      |',
      '  +---+\n  |   |\n  😵   |\n /|\\  |\n      |\n +---+'
    ];
    return stages[Math.min(wrongGuesses, stages.length - 1)];
  };

  const getHint = () => {
    const hints: { [key: string]: string } = {
      'JAVASCRIPT': 'Popular programming language',
      'COMPUTER': 'Electronic device for processing data',
      'PROGRAMMING': 'The art of writing code',
      'ALGORITHM': 'Step-by-step solution method',
      'DATABASE': 'Organized collection of data',
      'NETWORK': 'Connected computer systems',
      'SECURITY': 'Protection from threats',
      'SOFTWARE': 'Computer programs',
      'HARDWARE': 'Physical computer components',
      'INTERNET': 'Global computer network',
      'WEBSITE': 'Collection of web pages',
      'CODING': 'Writing computer instructions',
      'DEBUGGING': 'Finding and fixing errors',
      'FUNCTION': 'Block of reusable code',
      'VARIABLE': 'Container for storing data',
    };
    return hints[currentWord] || 'A common programming term';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📝 Word Guess</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <pre className="text-2xl font-mono mb-4 text-gray-900 dark:text-white whitespace-pre-line">
              {getHangmanArt()}
            </pre>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-bold">{wrongGuesses}/{maxWrongGuesses}</span>
              </div>
              {gameStatus === 'playing' && (
                <div className="text-green-400 font-bold">
                  Score: {Math.max(0, 100 - (wrongGuesses * 10) + (currentWord.length * 5))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-4xl font-mono font-bold text-purple-400 mb-4 tracking-wider">
              {getDisplayWord()}
            </div>
            
            <div className="flex items-center justify-center space-x-2 mb-4 text-gray-600 dark:text-gray-400">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">{getHint()}</span>
            </div>

            {gameStatus === 'won' && (
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-green-400 mb-2">🎉 You Won!</h2>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Score: {score}
                </div>
              </div>
            )}

            {gameStatus === 'lost' && (
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-red-400 mb-2">😵 Game Over</h2>
                <p className="text-gray-600 dark:text-gray-400">The word was: <span className="font-bold text-purple-400">{currentWord}</span></p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Choose a letter:</h3>
          <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-2">
            {alphabet.map(letter => {
              const isGuessed = guessedLetters.has(letter);
              const isCorrect = isGuessed && currentWord.includes(letter);
              const isWrong = isGuessed && !currentWord.includes(letter);
              
              return (
                <button
                  key={letter}
                  onClick={() => guessLetter(letter)}
                  disabled={isGuessed || gameStatus !== 'playing'}
                  className={`aspect-square rounded-lg font-bold transition-all duration-200 text-sm ${
                    isCorrect
                      ? 'bg-green-500 text-white'
                      : isWrong
                      ? 'bg-red-500 text-white'
                      : gameStatus === 'playing'
                      ? 'bg-gray-200 dark:bg-gray-700 hover:bg-purple-200 dark:hover:bg-purple-800 text-gray-900 dark:text-white hover:scale-105'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={startNewGame}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            <span>New Word</span>
          </button>
        </div>
      </div>
    </div>
  );
}