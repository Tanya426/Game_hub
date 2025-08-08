import React, { useState, useEffect } from 'react';
import { RotateCcw, Shuffle, Trophy, Clock, Target } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GameStats } from '../types';

interface Puzzle15Props {
  onBack: () => void;
}

export default function Puzzle15({ onBack }: Puzzle15Props) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameStats, setGameStats] = useLocalStorage<GameStats>('gameStats', {});

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isGameWon && tiles.length > 0 && moves > 0) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameWon, tiles, moves]);

  useEffect(() => {
    if (tiles.length > 0 && moves > 0) {
      checkWinCondition();
    }
  }, [tiles]);

  const initializeGame = () => {
    const solvedState = Array.from({ length: 15 }, (_, i) => i + 1);
    solvedState.push(0); // 0 represents empty space
    
    // Generate a solvable puzzle by making random valid moves from solved state
    let puzzle = [...solvedState];
    const emptyIndex = 15;
    let currentEmpty = emptyIndex;
    
    // Make 1000 random valid moves to shuffle
    for (let i = 0; i < 1000; i++) {
      const validMoves = getValidMoves(currentEmpty);
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      
      // Swap empty space with the selected tile
      [puzzle[currentEmpty], puzzle[randomMove]] = [puzzle[randomMove], puzzle[currentEmpty]];
      currentEmpty = randomMove;
    }
    
    setTiles(puzzle);
    setMoves(0);
    setTimeElapsed(0);
    setIsGameWon(false);
    setIsAnimating(false);
  };

  const getValidMoves = (emptyIndex: number) => {
    const row = Math.floor(emptyIndex / 4);
    const col = emptyIndex % 4;
    const validMoves = [];
    
    // Up
    if (row > 0) validMoves.push(emptyIndex - 4);
    // Down
    if (row < 3) validMoves.push(emptyIndex + 4);
    // Left
    if (col > 0) validMoves.push(emptyIndex - 1);
    // Right
    if (col < 3) validMoves.push(emptyIndex + 1);
    
    return validMoves;
  };

  const isWinningState = (array: number[]) => {
    const target = [...Array.from({ length: 15 }, (_, i) => i + 1), 0];
    return array.every((tile, index) => tile === target[index]);
  };

  const checkWinCondition = () => {
    if (isWinningState(tiles) && !isGameWon) {
      setIsGameWon(true);
      updateStats();
    }
  };

  const updateStats = () => {
    const gameId = 'puzzle-15';
    const currentStats = gameStats[gameId] || { gamesPlayed: 0, bestScore: 0, totalScore: 0, averageScore: 0 };
    
    const timeBonus = Math.max(0, 300 - timeElapsed);
    const moveBonus = Math.max(0, 200 - moves);
    const score = Math.max(0, 1000 + timeBonus + moveBonus);
    
    const newStats = {
      gamesPlayed: currentStats.gamesPlayed + 1,
      bestScore: Math.max(currentStats.bestScore, score),
      totalScore: currentStats.totalScore + score,
      averageScore: 0,
    };
    newStats.averageScore = Math.round(newStats.totalScore / newStats.gamesPlayed);

    setGameStats({ ...gameStats, [gameId]: newStats });
  };

  const canMoveTile = (index: number) => {
    const emptyIndex = tiles.indexOf(0);
    const validMoves = getValidMoves(emptyIndex);
    return validMoves.includes(index);
  };

  const moveTile = async (index: number) => {
    if (!canMoveTile(index) || isGameWon || isAnimating) return;
    
    setIsAnimating(true);
    const emptyIndex = tiles.indexOf(0);
    const newTiles = [...tiles];
    
    [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
    
    setTiles(newTiles);
    setMoves(prev => prev + 1);
    
    // Small delay for animation
    setTimeout(() => setIsAnimating(false), 150);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTilePosition = (index: number) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    return { row, col };
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🔢 15-Puzzle</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
          <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(timeElapsed)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
        </div>
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
          <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{moves}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Moves</div>
        </div>
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {isGameWon ? Math.max(0, 1000 + Math.max(0, 300 - timeElapsed) + Math.max(0, 200 - moves)) : 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
        </div>
      </div>

      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        {isGameWon && (
          <div className="text-center mb-6">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🎉 Puzzle Solved!</h2>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              {Math.max(0, 1000 + Math.max(0, 300 - timeElapsed) + Math.max(0, 200 - moves))}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Completed in {moves} moves and {formatTime(timeElapsed)}!
            </p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto mb-6">
          {tiles.map((tile, index) => {
            const isEmpty = tile === 0;
            const canMove = canMoveTile(index);
            
            return (
              <button
                key={index}
                onClick={() => moveTile(index)}
                className={`aspect-square rounded-xl text-2xl font-bold transition-all duration-150 transform ${
                  isEmpty
                    ? 'bg-gray-100/20 dark:bg-gray-800/20 border-2 border-dashed border-gray-400/30'
                    : canMove && !isGameWon
                    ? 'bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl'
                    : isGameWon
                    ? 'bg-gradient-to-br from-green-400 to-blue-500 text-white shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-default'
                } ${isAnimating ? 'scale-95' : ''}`}
                disabled={isEmpty || isGameWon || isAnimating}
              >
                {!isEmpty && (
                  <span className="drop-shadow-sm">{tile}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={initializeGame}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <Shuffle className="w-5 h-5" />
            <span>New Puzzle</span>
          </button>
          <button
            onClick={initializeGame}
            className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 px-6 py-3 rounded-lg transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Click tiles adjacent to the empty space to move them. Arrange numbers 1-15 in order!
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            💡 Tip: Plan your moves carefully - fewer moves = higher score!
          </div>
        </div>
      </div>
    </div>
  );
}