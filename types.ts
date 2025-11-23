export enum CardStatus {
  NEW = 'NEW',
  LEARNING = 'LEARNING',
  REVIEW = 'REVIEW',
  GRADUATED = 'GRADUATED'
}

export enum Difficulty {
  AGAIN = 0, // Forgot
  HARD = 1,  // Vague
  GOOD = 2,  // Remembered
  EASY = 3   // Simple
}

export interface Card {
  id: string;
  cantonese: string; // The term (Hanzi)
  jyutping: string;
  mandarin: string; // Meaning
  example?: string;
  exampleJyutping?: string;
  exampleMeaning?: string;
  level: number; // 1-3
  tags: string[];
  
  // SRS Data
  status: CardStatus;
  interval: number; // Days until next review
  repetition: number; // Consecutive successful reviews
  ef: number; // Easiness Factor (SM-2)
  nextReviewDate: number; // Timestamp
  createdAt: number;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: number | null; // Timestamp of start of day
  cardsLearnedToday: number;
  dailyNewLimit: number;
}

export interface AppState {
  cards: Card[];
  stats: UserStats;
}