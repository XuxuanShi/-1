import React, { useState, useEffect } from 'react';
import { Card, UserStats, AppState, Difficulty } from './types';
import { SEED_CARDS, XP_REWARDS, INITIAL_DAILY_LIMIT, LEVEL_THRESHOLDS } from './constants';
import { calculateNextReview, getDailyQueue } from './services/srsService';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { Study } from './pages/Study';
import { AddWord } from './pages/AddWord';
import { Settings } from './pages/Settings';

const STORAGE_KEY = 'cantonese_memory_pro_v1';

const INITIAL_STATE: AppState = {
  cards: SEED_CARDS,
  stats: {
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDate: null,
    cardsLearnedToday: 0,
    dailyNewLimit: INITIAL_DAILY_LIMIT,
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [studyQueue, setStudyQueue] = useState<Card[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Handle streak calculation logic on load
        const lastDate = parsed.stats.lastStudyDate ? new Date(parsed.stats.lastStudyDate) : null;
        const today = new Date();
        const isSameDay = lastDate && lastDate.getDate() === today.getDate() && lastDate.getMonth() === today.getMonth() && lastDate.getFullYear() === today.getFullYear();
        
        // Reset daily counters if new day
        if (!isSameDay) {
          parsed.stats.cardsLearnedToday = 0;
          // Logic for broken streak could go here (e.g. if diff > 1 day)
        }
        
        setState(parsed);
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleStartStudy = () => {
    const queue = getDailyQueue(state.cards, state.stats.dailyNewLimit - state.stats.cardsLearnedToday);
    if (queue.length > 0) {
      setStudyQueue(queue);
      setIsStudyMode(true);
    }
  };

  const handleStudyComplete = (results: { cardId: string; difficulty: Difficulty }[]) => {
    let newCards = [...state.cards];
    let newStats = { ...state.stats };
    const today = Date.now();

    // Update Cards
    results.forEach(res => {
      const cardIndex = newCards.findIndex(c => c.id === res.cardId);
      if (cardIndex !== -1) {
        const updatedCard = calculateNextReview(newCards[cardIndex], res.difficulty);
        newCards[cardIndex] = updatedCard;

        // Add XP
        newStats.xp += XP_REWARDS[updatedCard.status] || 5;
      }
    });

    // Update Daily Stats
    if (!newStats.lastStudyDate || new Date(newStats.lastStudyDate).getDate() !== new Date(today).getDate()) {
       newStats.streak += 1;
       newStats.lastStudyDate = today;
       newStats.cardsLearnedToday = 0; // Reset happened earlier, but ensure safety
    }
    
    // Count ONLY newly learned cards for the limit (approximate)
    const uniqueCardsInSession = new Set(results.map(r => r.cardId)).size;
    newStats.cardsLearnedToday += uniqueCardsInSession;

    // Check Level Up
    const nextLevelXp = LEVEL_THRESHOLDS[newStats.level as keyof typeof LEVEL_THRESHOLDS];
    if (nextLevelXp && newStats.xp >= nextLevelXp) {
        // Simple level up logic
        if (newStats.level < 3) newStats.level += 1;
    }

    setState({ cards: newCards, stats: newStats });
    setIsStudyMode(false);
    setActiveTab('dashboard');
  };

  const handleAddCard = (card: Card) => {
    setState(prev => ({
      ...prev,
      cards: [...prev.cards, card]
    }));
    setActiveTab('study'); // Redirect to allow seeing it eventually or go to list
    alert("Card added successfully!");
  };

  const handleReset = () => {
    setState(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  // Calculate current due count for dashboard
  const dueCount = state.cards.filter(c => c.status !== 'NEW' && c.nextReviewDate <= Date.now()).length;

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col font-sans">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {isStudyMode ? (
          <div className="absolute inset-0 z-50 bg-white">
            <Study 
              queue={studyQueue} 
              onComplete={handleStudyComplete} 
              onExit={() => setIsStudyMode(false)} 
            />
          </div>
        ) : (
            <div className="h-full overflow-y-auto no-scrollbar">
                {activeTab === 'dashboard' && (
                    <Dashboard 
                        stats={state.stats} 
                        totalCards={state.cards.length}
                        dueCount={dueCount}
                        onStartStudy={handleStartStudy}
                    />
                )}
                {activeTab === 'study' && (
                    <div className="p-6 text-center mt-20">
                        <h2 className="text-xl font-bold text-slate-700">Study Deck</h2>
                        <p className="text-slate-500 mb-4">Browse your collection</p>
                        <div className="space-y-3 pb-24">
                            {state.cards.map(card => (
                                <div key={card.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center text-left">
                                    <div>
                                        <div className="font-bold text-lg text-slate-800">{card.cantonese}</div>
                                        <div className="text-sm text-slate-500">{card.mandarin}</div>
                                    </div>
                                    <div className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">
                                        Lv.{card.level}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'add' && (
                    <AddWord onAddCard={handleAddCard} onCancel={() => setActiveTab('dashboard')} />
                )}
                {activeTab === 'settings' && (
                    <Settings cards={state.cards} stats={state.stats} onReset={handleReset} />
                )}
            </div>
        )}
      </main>

      {/* Navigation - Hidden in Study Mode */}
      {!isStudyMode && (
        <Navigation currentTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}