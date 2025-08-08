import React from 'react';
import { Trophy, Medal, Award, BarChart3 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GameStats } from '../types';
import { games } from '../utils/gameData';

export default function Leaderboard() {
  const [gameStats] = useLocalStorage<GameStats>('gameStats', {});

  const getIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1: return <Medal className="w-6 h-6 text-gray-400" />;
      case 2: return <Award className="w-6 h-6 text-orange-500" />;
      default: return <BarChart3 className="w-6 h-6 text-gray-500" />;
    }
  };

  const getGameData = () => {
    return games.map(game => {
      const stats = gameStats[game.id];
      return {
        ...game,
        ...stats,
        gamesPlayed: stats?.gamesPlayed || 0,
        bestScore: stats?.bestScore || 0,
        averageScore: stats?.averageScore || 0,
      };
    }).sort((a, b) => b.bestScore - a.bestScore);
  };

  const gameData = getGameData();
  const totalGames = gameData.reduce((sum, game) => sum + game.gamesPlayed, 0);
  const totalScore = gameData.reduce((sum, game) => sum + (game.totalScore || 0), 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          🏆 Leaderboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress across all games
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">{totalGames}</div>
          <div className="text-gray-600 dark:text-gray-400">Total Games Played</div>
        </div>
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">{totalScore.toLocaleString()}</div>
          <div className="text-gray-600 dark:text-gray-400">Total Score</div>
        </div>
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">{gameData.length}</div>
          <div className="text-gray-600 dark:text-gray-400">Games Available</div>
        </div>
      </div>

      {/* Game Rankings */}
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Game Rankings</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {gameData.map((game, index) => (
            <div key={game.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {getIcon(index)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-2xl">{game.icon}</span>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {game.name}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {game.category} • {game.difficulty}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {game.bestScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {game.gamesPlayed} games • Avg: {Math.round(game.averageScore || 0)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}