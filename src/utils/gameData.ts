import { Game, QuizQuestion } from '../types';

export const games: Game[] = [
  {
    id: 'quiz-arena',
    name: 'Quiz Arena',
    description: 'Test your knowledge with challenging questions',
    icon: '🧠',
    difficulty: 'Medium',
    category: 'Knowledge',
    gamesPlayed: 0,
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic-Tac-Toe',
    description: 'Classic strategy game for two players or vs AI',
    icon: '⚡',
    difficulty: 'Easy',
    category: 'Strategy',
    gamesPlayed: 0,
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Flip cards and match pairs to test your memory',
    icon: '🧩',
    difficulty: 'Easy',
    category: 'Memory',
    gamesPlayed: 0,
  },
  {
    id: 'puzzle-15',
    name: '15-Puzzle',
    description: 'Slide numbered tiles to solve the classic puzzle',
    icon: '🔢',
    difficulty: 'Hard',
    category: 'Logic',
    gamesPlayed: 0,
  },
  {
    id: 'word-guess',
    name: 'Word Guess',
    description: 'Guess the hidden word letter by letter',
    icon: '📝',
    difficulty: 'Medium',
    category: 'Word',
    gamesPlayed: 0,
  },
  {
    id: 'snake-ladders',
    name: 'Snake & Ladders',
    description: 'Classic board game with snakes and ladders',
    icon: '🐍',
    difficulty: 'Easy',
    category: 'Board',
    gamesPlayed: 0,
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correct: 2,
    category: 'Geography',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correct: 1,
    category: 'Science',
  },
  {
    question: 'Who painted the Mona Lisa?',
    options: ['Van Gogh', 'Picasso', 'Leonardo da Vinci', 'Michelangelo'],
    correct: 2,
    category: 'Art',
  },
  {
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correct: 3,
    category: 'Geography',
  },
  {
    question: 'In which year did World War II end?',
    options: ['1944', '1945', '1946', '1947'],
    correct: 1,
    category: 'History',
  },
  {
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Au', 'Ag', 'Gd'],
    correct: 1,
    category: 'Science',
  },
  {
    question: 'Which is the smallest country in the world?',
    options: ['Monaco', 'Nauru', 'Vatican City', 'San Marino'],
    correct: 2,
    category: 'Geography',
  },
  {
    question: 'Who wrote "Romeo and Juliet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    correct: 1,
    category: 'Literature',
  },
];

export const memoryEmojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎪', '🎸'];

export const wordsToGuess = [
  'JAVASCRIPT', 'COMPUTER', 'PROGRAMMING', 'ALGORITHM', 'DATABASE',
  'NETWORK', 'SECURITY', 'SOFTWARE', 'HARDWARE', 'INTERNET',
  'WEBSITE', 'CODING', 'DEBUGGING', 'FUNCTION', 'VARIABLE',
];

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Easy': return 'text-green-400';
    case 'Medium': return 'text-yellow-400';
    case 'Hard': return 'text-red-400';
    default: return 'text-gray-400';
  }
};