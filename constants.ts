import { Card, CardStatus } from './types';

export const LEVEL_THRESHOLDS = {
  1: 0,
  2: 500, // XP needed for Level 2
  3: 1500, // XP needed for Level 3
};

export const XP_REWARDS = {
  [CardStatus.NEW]: 10,
  [CardStatus.LEARNING]: 5,
  [CardStatus.REVIEW]: 15,
};

export const INITIAL_DAILY_LIMIT = 5;

export const DISCOVERY_TOPICS = [
  "Daily Conversation (日常会话)",
  "Food & Dim Sum (饮食点心)",
  "Slang & Idioms (俗语潮语)",
  "Travel & Transport (旅游交通)",
  "Work & Business (职场工作)",
  "Emotions & Feelings (情绪表达)",
  "Shopping (购物)",
  "Romance (恋爱)",
  "Emergency (紧急情况)"
];

// Seed data to let the user start immediately
export const SEED_CARDS: Card[] = [
  {
    id: 'seed-1',
    cantonese: '你好',
    jyutping: 'nei5 hou2',
    mandarin: '你好',
    example: '你好吗？',
    exampleJyutping: 'nei5 hou2 maa3?',
    exampleMeaning: '你好吗？',
    level: 1,
    tags: ['问候', '基础'],
    status: CardStatus.NEW,
    interval: 0,
    repetition: 0,
    ef: 2.5,
    nextReviewDate: 0,
    createdAt: Date.now(),
  },
  {
    id: 'seed-2',
    cantonese: '多謝',
    jyutping: 'do1 ze6',
    mandarin: '谢谢 (礼物/帮助)',
    example: '多謝你的禮物。',
    exampleJyutping: 'do1 ze6 nei5 ge3 lai5 mat6.',
    exampleMeaning: '谢谢你的礼物。',
    level: 1,
    tags: ['问候', '基础'],
    status: CardStatus.NEW,
    interval: 0,
    repetition: 0,
    ef: 2.5,
    nextReviewDate: 0,
    createdAt: Date.now(),
  },
  {
    id: 'seed-3',
    cantonese: '唔該',
    jyutping: 'm4 goi1',
    mandarin: '谢谢 (服务/劳驾)',
    example: '唔該借歪。',
    exampleJyutping: 'm4 goi1 ze3 waai1.',
    exampleMeaning: '劳驾借过。',
    level: 1,
    tags: ['问候', '基础'],
    status: CardStatus.NEW,
    interval: 0,
    repetition: 0,
    ef: 2.5,
    nextReviewDate: 0,
    createdAt: Date.now(),
  },
  {
    id: 'seed-4',
    cantonese: '早晨',
    jyutping: 'zou2 san4',
    mandarin: '早上好',
    example: '各位早晨！',
    exampleJyutping: 'gok3 wai2 zou2 san4!',
    exampleMeaning: '各位早上好！',
    level: 1,
    tags: ['问候'],
    status: CardStatus.NEW,
    interval: 0,
    repetition: 0,
    ef: 2.5,
    nextReviewDate: 0,
    createdAt: Date.now(),
  },
  {
    id: 'seed-5',
    cantonese: '猴賽雷',
    jyutping: 'hau4 coi3 leoi4',
    mandarin: '好厉害 (音译梗)',
    example: '你真係猴賽雷呀！',
    exampleJyutping: 'nei5 zan1 hai6 hau4 coi3 leoi4 aa3!',
    exampleMeaning: '你真是好厉害啊！',
    level: 2,
    tags: ['俗语', '流行'],
    status: CardStatus.NEW,
    interval: 0,
    repetition: 0,
    ef: 2.5,
    nextReviewDate: 0,
    createdAt: Date.now(),
  }
];