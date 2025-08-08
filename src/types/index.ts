export interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  bestScore?: number;
  gamesPlayed: number;
}

export interface Player {
  name: string;
  score: number;
  game: string;
  date: string;
}

export interface GameStats {
  [gameId: string]: {
    gamesPlayed: number;
    bestScore: number;
    totalScore: number;
    averageScore: number;
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  category: string;
}

export interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}