import React, { useState, useCallback } from 'react';
import { RotateCcw, User, Bot } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GameStats } from '../types';

interface TicTacToeProps {
  onBack: () => void;
}

export default function TicTacToe({ onBack }: TicTacToeProps) {
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<'2player' | 'ai' | null>(null);
  const [gameStats, setGameStats] = useLocalStorage<GameStats>('gameStats', {});

  const checkWinner = useCallback((squares: Array<string | null>) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    return squares.every(square => square) ? 'tie' : null;
  }, []);

  const updateStats = (result: 'win' | 'loss' | 'tie') => {
    const gameId = 'tic-tac-toe';
    const currentStats = gameStats[gameId] || { gamesPlayed: 0, bestScore: 0, totalScore: 0, averageScore: 0 };
    
    let scoreToAdd = 0;
    if (result === 'win') scoreToAdd = 100;
    else if (result === 'tie') scoreToAdd = 50;

    const newStats = {
      gamesPlayed: currentStats.gamesPlayed + 1,
      bestScore: Math.max(currentStats.bestScore, scoreToAdd),
      totalScore: currentStats.totalScore + scoreToAdd,
      averageScore: 0,
    };
    newStats.averageScore = Math.round(newStats.totalScore / newStats.gamesPlayed);

    setGameStats({ ...gameStats, [gameId]: newStats });
  };

  const makeAIMove = useCallback((currentBoard: Array<string | null>) => {
    const emptySquares = currentBoard.map((square, index) => square === null ? index : null).filter(val => val !== null) as number[];
    
    if (emptySquares.length === 0) return;

    // AI strategy: try to win, then block player, then take center/corners
    for (let square of emptySquares) {
      const testBoard = [...currentBoard];
      testBoard[square] = 'O';
      if (checkWinner(testBoard) === 'O') {
        return square;
      }
    }

    // Block player from winning
    for (let square of emptySquares) {
      const testBoard = [...currentBoard];
      testBoard[square] = 'X';
      if (checkWinner(testBoard) === 'X') {
        return square;
      }
    }

    // Take center or corner
    const preferredSquares = [4, 0, 2, 6, 8].filter(square => emptySquares.includes(square));
    if (preferredSquares.length > 0) {
      return preferredSquares[0];
    }

    // Random move
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  }, [checkWinner]);

  const handleClick = (index: number) => {
    if (board[index] || winner || (gameMode === 'ai' && !isPlayerTurn)) return;

    const newBoard = [...board];
    newBoard[index] = isPlayerTurn ? 'X' : 'O';
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
      if (gameMode === 'ai') {
        if (gameResult === 'X') updateStats('win');
        else if (gameResult === 'O') updateStats('loss');
        else updateStats('tie');
      }
      return;
    }

    setIsPlayerTurn(!isPlayerTurn);

    // AI move
    if (gameMode === 'ai' && isPlayerTurn) {
      setTimeout(() => {
        const aiMove = makeAIMove(newBoard);
        if (aiMove !== undefined) {
          const aiBoard = [...newBoard];
          aiBoard[aiMove] = 'O';
          setBoard(aiBoard);
          
          const aiResult = checkWinner(aiBoard);
          if (aiResult) {
            setWinner(aiResult);
            if (aiResult === 'X') updateStats('win');
            else if (aiResult === 'O') updateStats('loss');
            else updateStats('tie');
          } else {
            setIsPlayerTurn(true);
          }
        }
      }, 500);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  const selectGameMode = (mode: '2player' | 'ai') => {
    setGameMode(mode);
    resetGame();
  };

  if (!gameMode) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            ← Back
          </button>
        </div>
        
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">⚡ Tic-Tac-Toe</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Choose your game mode</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => selectGameMode('2player')}
              className="p-6 bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl transition-all duration-200 hover:scale-105"
            >
              <User className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">2 Players</h3>
              <p className="text-blue-100">Play with a friend</p>
            </button>
            
            <button
              onClick={() => selectGameMode('ai')}
              className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl transition-all duration-200 hover:scale-105"
            >
              <Bot className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">vs AI</h3>
              <p className="text-purple-100">Challenge the computer</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setGameMode(null)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          ← Back to Mode Select
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">⚡ Tic-Tac-Toe</h1>
      </div>

      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <div className="text-center mb-6">
          {winner ? (
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {winner === 'tie' ? "It's a tie!" : `${winner === 'X' ? 'Player 1' : gameMode === 'ai' ? 'AI' : 'Player 2'} wins!`}
              </h2>
              <button
                onClick={resetGame}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 mx-auto"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Play Again</span>
              </button>
            </div>
          ) : (
            <h2 className="text-xl text-gray-900 dark:text-white mb-4">
              {gameMode === '2player' 
                ? `${isPlayerTurn ? 'Player 1' : 'Player 2'}'s turn (${isPlayerTurn ? 'X' : 'O'})`
                : isPlayerTurn ? 'Your turn (X)' : 'AI is thinking...'
              }
            </h2>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
          {board.map((square, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="aspect-square bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-4xl font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={Boolean(square) || Boolean(winner) || (gameMode === 'ai' && !isPlayerTurn)}
            >
              {square && (
                <span className={square === 'X' ? 'text-blue-500' : 'text-red-500'}>
                  {square}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {gameMode === 'ai' ? 'Get three in a row to beat the AI!' : 'Get three in a row to win!'}
          </p>
        </div>
      </div>
    </div>
  );
}