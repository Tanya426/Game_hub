import React, { useState } from 'react';
import Header from './components/Header';
import GameCard from './components/GameCard';
import Leaderboard from './components/Leaderboard';
import QuizArena from './games/QuizArena';
import TicTacToe from './games/TicTacToe';
import MemoryMatch from './games/MemoryMatch';
import Puzzle15 from './games/Puzzle15';
import WordGuess from './games/WordGuess';
import SnakeAndLadders from './games/SnakeAndLadders';
import { games } from './utils/gameData';

type ViewType = 'dashboard' | 'leaderboard' | 'game';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const handlePlayGame = (gameId: string) => {
    setCurrentGame(gameId);
    setCurrentView('game');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentGame(null);
  };

  const renderCurrentView = () => {
    if (currentView === 'leaderboard') {
      return <Leaderboard />;
    }

    if (currentView === 'game' && currentGame) {
      switch (currentGame) {
        case 'quiz-arena':
          return <QuizArena onBack={handleBackToDashboard} />;
        case 'tic-tac-toe':
          return <TicTacToe onBack={handleBackToDashboard} />;
        case 'memory-match':
          return <MemoryMatch onBack={handleBackToDashboard} />;
        case 'puzzle-15':
          return <Puzzle15 onBack={handleBackToDashboard} />;
        case 'word-guess':
          return <WordGuess onBack={handleBackToDashboard} />;
        case 'snake-ladders':
          return <SnakeAndLadders onBack={handleBackToDashboard} />;
        default:
          return <DashboardView onPlayGame={handlePlayGame} />;
      }
    }

    return <DashboardView onPlayGame={handlePlayGame} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="min-h-screen bg-white/5 dark:bg-black/20">
        <Header 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        <main className="py-8">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

interface DashboardViewProps {
  onPlayGame: (gameId: string) => void;
}

function DashboardView({ onPlayGame }: DashboardViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
          Welcome to Game Hub
        </h1>
        <p className="text-xl text-gray-300 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Dive into a collection of classic and modern games. Challenge yourself, compete with friends, 
          and track your progress across multiple exciting game modes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game) => (
          <GameCard 
            key={game.id} 
            game={game} 
            onPlay={onPlayGame}
          />
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">🎮 Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span>Local score tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Dark & light themes</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              <span>Responsive design</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>No installation required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;