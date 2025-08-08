import React, { useState, useEffect } from 'react';
import { RotateCcw, Clock, Star } from 'lucide-react';
import { memoryEmojis } from '../utils/gameData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GameStats, MemoryCard } from '../types';

interface MemoryMatchProps {
  onBack: () => void;
}

export default function MemoryMatch({ onBack }: MemoryMatchProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameStats, setGameStats] = useLocalStorage<GameStats>('gameStats', {});

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!gameCompleted && cards.length > 0) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameCompleted, cards]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.emoji === secondCard.emoji) {
        setTimeout(() => {
          setCards(prev => prev.map((card, index) => 
            index === first || index === second 
              ? { ...card, isMatched: true }
              : card
          ));
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((card, index) => 
            index === first || index === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchedPairs === 8 && !gameCompleted) {
      setGameCompleted(true);
      updateStats();
    }
  }, [matchedPairs]);

  const initializeGame = () => {
    const gameEmojis = [...memoryEmojis, ...memoryEmojis];
    const shuffled = gameEmojis.sort(() => Math.random() - 0.5);
    
    const initialCards = shuffled.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimeElapsed(0);
    setGameCompleted(false);
  };

  const updateStats = () => {
    const gameId = 'memory-match';
    const currentStats = gameStats[gameId] || { gamesPlayed: 0, bestScore: 0, totalScore: 0, averageScore: 0 };
    
    const score = Math.max(0, 1000 - (moves * 10) - timeElapsed);
    
    const newStats = {
      gamesPlayed: currentStats.gamesPlayed + 1,
      bestScore: Math.max(currentStats.bestScore, score),
      totalScore: currentStats.totalScore + score,
      averageScore: 0,
    };
    newStats.averageScore = Math.round(newStats.totalScore / newStats.gamesPlayed);

    setGameStats({ ...gameStats, [gameId]: newStats });
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    setCards(prev => prev.map((card, i) => 
      i === index ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, index]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🧩 Memory Match</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
          <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(timeElapsed)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
        </div>
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
          <Star className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{moves}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Moves</div>
        </div>
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
          <div className="text-2xl font-bold text-purple-400">{matchedPairs}/8</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pairs</div>
        </div>
        <div className="text-center">
          <button
            onClick={initializeGame}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5" />
            <span>New Game</span>
          </button>
        </div>
      </div>

      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-lg text-3xl font-bold transition-all duration-300 transform hover:scale-105 ${
                card.isFlipped || card.isMatched
                  ? 'bg-gradient-to-br from-purple-400 to-blue-400 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              } ${card.isMatched ? 'opacity-75' : ''}`}
              disabled={gameCompleted}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '?'}
            </button>
          ))}
        </div>

        {gameCompleted && (
          <div className="text-center mt-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">🎉 Congratulations!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You completed the game in {moves} moves and {formatTime(timeElapsed)}!
            </p>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Score: {Math.max(0, 1000 - (moves * 10) - timeElapsed)}
            </div>
            <button
              onClick={initializeGame}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 mx-auto"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}