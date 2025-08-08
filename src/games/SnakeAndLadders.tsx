import React, { useState, useRef, useEffect } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RotateCcw, Trophy, Zap, TrendingUp } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GameStats } from '../types';

interface SnakeAndLaddersProps {
  onBack: () => void;
}

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const snakes = {
  16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78
};

const ladders = {
  1: 38, 4: 14, 9: 21, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100
};

export default function SnakeAndLadders({ onBack }: SnakeAndLaddersProps) {
  const [playerPosition, setPlayerPosition] = useState(1);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [animationMessage, setAnimationMessage] = useState('');
  const [gameStats, setGameStats] = useLocalStorage<GameStats>('gameStats', {});
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawBoard();
  }, [playerPosition, isMoving]);

  const drawBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 50;
    const boardSize = 10;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw cells with alternating colors
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const x = col * cellSize;
        const y = (boardSize - 1 - row) * cellSize;
        
        let cellNumber;
        if (row % 2 === 0) {
          cellNumber = row * boardSize + col + 1;
        } else {
          cellNumber = row * boardSize + (boardSize - col);
        }

        // Alternating cell colors
        ctx.fillStyle = (row + col) % 2 === 0 ? '#ffffff' : '#f1f5f9';
        ctx.fillRect(x, y, cellSize, cellSize);
        
        // Cell border
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);
        
        // Cell number
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(cellNumber.toString(), x + cellSize / 2, y + 5);
        
        // Special cells highlighting
        if (cellNumber === 100) {
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
          ctx.fillStyle = '#92400e';
          ctx.font = 'bold 12px Arial';
          ctx.fillText('🏆', x + cellSize / 2, y + cellSize / 2 + 5);
        }
        
        // Draw snakes
        if (snakes[cellNumber as keyof typeof snakes]) {
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 20px Arial';
          ctx.textBaseline = 'middle';
          ctx.fillText('🐍', x + cellSize / 2, y + cellSize / 2);
        }
        
        // Draw ladders
        if (ladders[cellNumber as keyof typeof ladders]) {
          ctx.fillStyle = '#10b981';
          ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 20px Arial';
          ctx.textBaseline = 'middle';
          ctx.fillText('🪜', x + cellSize / 2, y + cellSize / 2);
        }
        
        // Draw player
        if (cellNumber === playerPosition) {
          ctx.fillStyle = '#8b5cf6';
          ctx.beginPath();
          ctx.arc(x + cellSize / 2, y + cellSize - 12, 12, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px Arial';
          ctx.textBaseline = 'middle';
          ctx.fillText('👤', x + cellSize / 2, y + cellSize - 12);
          
          // Player glow effect
          if (isMoving) {
            ctx.shadowColor = '#8b5cf6';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(x + cellSize / 2, y + cellSize - 12, 15, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }
    }
  };

  const rollDice = async () => {
    if (isRolling || gameWon || isMoving) return;
    
    setIsRolling(true);
    setAnimationMessage('Rolling dice...');
    
    // Animate dice roll
    for (let i = 0; i < 15; i++) {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      await new Promise(resolve => setTimeout(resolve, 80));
    }
    
    const finalDice = Math.floor(Math.random() * 6) + 1;
    setDiceValue(finalDice);
    setMoves(prev => prev + 1);
    setIsRolling(false);
    
    // Move player with animation
    await movePlayer(finalDice);
  };

  const movePlayer = async (diceRoll: number) => {
    setIsMoving(true);
    let newPosition = playerPosition + diceRoll;
    
    // Check if player goes beyond 100
    if (newPosition > 100) {
      newPosition = 100 - (newPosition - 100);
      setAnimationMessage('Bounced back from 100!');
    } else {
      setAnimationMessage(`Moving ${diceRoll} spaces...`);
    }
    
    // Animate movement step by step
    for (let i = playerPosition + 1; i <= Math.min(newPosition, 100); i++) {
      setPlayerPosition(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Check for snakes or ladders
    if (snakes[newPosition as keyof typeof snakes]) {
      setAnimationMessage('Oh no! Hit a snake! 🐍');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const snakeEnd = snakes[newPosition as keyof typeof snakes];
      // Animate sliding down
      for (let i = newPosition - 1; i >= snakeEnd; i--) {
        setPlayerPosition(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      setPlayerPosition(snakeEnd);
    } else if (ladders[newPosition as keyof typeof ladders]) {
      setAnimationMessage('Great! Found a ladder! 🪜');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const ladderTop = ladders[newPosition as keyof typeof ladders];
      // Animate climbing up
      for (let i = newPosition + 1; i <= ladderTop; i++) {
        setPlayerPosition(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      setPlayerPosition(ladderTop);
      
      if (ladderTop === 100) {
        setGameWon(true);
        setAnimationMessage('🎉 You won!');
        updateStats();
      }
    } else {
      setPlayerPosition(newPosition);
    }
    
    // Check for win
    if (newPosition === 100 && !snakes[newPosition as keyof typeof snakes]) {
      setGameWon(true);
      setAnimationMessage('🎉 You won!');
      updateStats();
    }
    
    setIsMoving(false);
    if (!gameWon) {
      setTimeout(() => setAnimationMessage(''), 2000);
    }
  };

  const updateStats = () => {
    const gameId = 'snake-ladders';
    const currentStats = gameStats[gameId] || { gamesPlayed: 0, bestScore: 0, totalScore: 0, averageScore: 0 };
    
    const score = Math.max(0, 1000 - moves * 10);
    
    const newStats = {
      gamesPlayed: currentStats.gamesPlayed + 1,
      bestScore: Math.max(currentStats.bestScore, score),
      totalScore: currentStats.totalScore + score,
      averageScore: 0,
    };
    newStats.averageScore = Math.round(newStats.totalScore / newStats.gamesPlayed);

    setGameStats({ ...gameStats, [gameId]: newStats });
  };

  const resetGame = () => {
    setPlayerPosition(1);
    setDiceValue(1);
    setMoves(0);
    setGameWon(false);
    setIsRolling(false);
    setIsMoving(false);
    setAnimationMessage('');
  };

  const DiceIcon = diceIcons[diceValue - 1];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🐍 Snake & Ladders</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="w-full max-w-lg mx-auto border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-lg"
            />
            
            {animationMessage && (
              <div className="text-center mt-4">
                <div className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-bold text-lg animate-pulse">
                  {animationMessage}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Game Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-purple-400">{playerPosition}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Position</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">{moves}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Moves</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{Math.max(0, 1000 - moves * 10)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Dice Roll</h3>
            <div className="flex justify-center mb-4">
              <div className={`p-6 rounded-2xl ${isRolling ? 'animate-spin' : isMoving ? 'animate-pulse' : ''} bg-gradient-to-br from-purple-400 to-blue-400 shadow-lg`}>
                <DiceIcon className="w-16 h-16 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{diceValue}</div>
            <button
              onClick={rollDice}
              disabled={isRolling || gameWon || isMoving}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-lg transition-all duration-200 font-bold hover:scale-105 disabled:scale-100"
            >
              {isRolling ? 'Rolling...' : isMoving ? 'Moving...' : 'Roll Dice'}
            </button>
          </div>

          {gameWon && (
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">🎉 Victory!</h2>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                {Math.max(0, 1000 - moves * 10)}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Completed in {moves} moves!
              </p>
              <button
                onClick={resetGame}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 mx-auto hover:scale-105"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Play Again</span>
              </button>
            </div>
          )}

          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Game Rules
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                🪜 Ladders boost you up
              </li>
              <li className="flex items-center">
                <div className="w-4 h-4 mr-2 bg-red-400 rounded-full"></div>
                🐍 Snakes slide you down
              </li>
              <li>• Roll dice to move forward</li>
              <li>• Reach square 100 to win!</li>
              <li>• Fewer moves = higher score</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}