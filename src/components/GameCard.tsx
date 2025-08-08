import React from 'react';
import { Play, BarChart3 } from 'lucide-react';
import { Game } from '../types';
import { getDifficultyColor } from '../utils/gameData';

interface GameCardProps {
  game: Game;
  onPlay: (gameId: string) => void;
}

export default function GameCard({ game, onPlay }: GameCardProps) {
  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl text-2xl group-hover:scale-110 transition-transform duration-200">
            {game.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
              {game.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {game.category}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(game.difficulty)} bg-gray-100 dark:bg-gray-800`}>
          {game.difficulty}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
        {game.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <BarChart3 className="w-4 h-4" />
            <span>{game.gamesPlayed} plays</span>
          </div>
          {game.bestScore && (
            <div>Best: {game.bestScore}</div>
          )}
        </div>
        
        <button
          onClick={() => onPlay(game.id)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
        >
          <Play className="w-4 h-4" />
          <span>Play</span>
        </button>
      </div>
    </div>
  );
}