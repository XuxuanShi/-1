import { Card, CardStatus, Difficulty } from '../types';

// Modified SM-2 Algorithm
export const calculateNextReview = (card: Card, difficulty: Difficulty): Card => {
  let { interval, repetition, ef } = card;
  const now = Date.now();

  // If user forgot the card
  if (difficulty === Difficulty.AGAIN) {
    repetition = 0;
    interval = 1; // Reset to 1 day
    return {
      ...card,
      status: CardStatus.LEARNING,
      repetition,
      interval,
      nextReviewDate: now + (interval * 24 * 60 * 60 * 1000), // Next day
    };
  }

  // Calculate new Easiness Factor (EF)
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  // We map our Difficulty (1-3) to SM-2 quality (3-5) roughly
  // HARD(1) -> 3, GOOD(2) -> 4, EASY(3) -> 5
  const quality = difficulty + 2; 
  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < 1.3) ef = 1.3;

  // Calculate new Interval
  if (repetition === 0) {
    interval = 1;
  } else if (repetition === 1) {
    interval = 6;
  } else {
    interval = Math.ceil(interval * ef);
  }

  repetition += 1;

  return {
    ...card,
    status: CardStatus.REVIEW,
    repetition,
    interval,
    ef,
    nextReviewDate: now + (interval * 24 * 60 * 60 * 1000),
  };
};

export const getDailyQueue = (cards: Card[], limit: number): Card[] => {
  const now = Date.now();
  
  // 1. Due Reviews: cards with review date <= now
  const dueReviews = cards.filter(c => 
    c.status !== CardStatus.NEW && c.nextReviewDate <= now
  ).sort((a, b) => a.nextReviewDate - b.nextReviewDate);

  // 2. New Cards: up to daily limit
  const newCards = cards.filter(c => c.status === CardStatus.NEW)
    .slice(0, limit);

  // Mix them: Put reviews first, then new cards
  return [...dueReviews, ...newCards];
};