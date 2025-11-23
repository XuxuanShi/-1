import React, { useState, useEffect } from 'react';
import { Card, Difficulty } from '../types';
import { Flashcard } from '../components/Flashcard';
import { Button } from '../components/Button';
import { X, Check } from 'lucide-react';

interface StudyProps {
  queue: Card[];
  onComplete: (results: { cardId: string; difficulty: Difficulty }[]) => void;
  onExit: () => void;
}

export const Study: React.FC<StudyProps> = ({ queue, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<{ cardId: string; difficulty: Difficulty }[]>([]);
  const [sessionQueue, setSessionQueue] = useState<Card[]>(queue);

  useEffect(() => {
    setSessionQueue(queue);
  }, [queue]);

  if (sessionQueue.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <Check size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">All Caught Up!</h2>
        <p className="text-slate-500 mb-8">You've completed your study queue for now.</p>
        <Button onClick={onExit} fullWidth>Back to Home</Button>
      </div>
    );
  }

  const currentCard = sessionQueue[currentIndex];

  const handleRating = (difficulty: Difficulty) => {
    const newResult = { cardId: currentCard.id, difficulty };
    const newResults = [...results, newResult];
    setResults(newResults);

    // If user forgot (AGAIN), re-queue it at the end of THIS session for immediate reinforcement
    if (difficulty === Difficulty.AGAIN) {
       setSessionQueue(prev => [...prev, currentCard]);
    }

    if (currentIndex < sessionQueue.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      // Session complete
      onComplete(newResults);
    }
  };

  const progress = ((currentIndex) / sessionQueue.length) * 100;

  return (
    <div className="h-full flex flex-col relative bg-slate-50">
      {/* Header / Progress */}
      <div className="px-6 pt-6 pb-2 flex items-center gap-4">
        <button onClick={onExit} className="text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-xs font-bold text-slate-400">
          {currentIndex + 1} / {sessionQueue.length}
        </span>
      </div>

      {/* Card Area */}
      <div className="flex-1 flex items-center justify-center p-6 pb-32">
        <Flashcard 
          card={currentCard} 
          isFlipped={isFlipped} 
          onFlip={() => setIsFlipped(!isFlipped)} 
        />
      </div>

      {/* Controls */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-6 pb-8 shadow-lg z-20">
        {!isFlipped ? (
          <Button onClick={() => setIsFlipped(true)} fullWidth size="lg">
            Show Answer
          </Button>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <button 
              onClick={() => handleRating(Difficulty.AGAIN)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95 transition-all"
            >
              <span className="font-bold text-lg mb-1">Again</span>
              <span className="text-[10px] uppercase opacity-70">Forgot</span>
            </button>
            <button 
              onClick={() => handleRating(Difficulty.HARD)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 active:scale-95 transition-all"
            >
              <span className="font-bold text-lg mb-1">Hard</span>
              <span className="text-[10px] uppercase opacity-70">Vague</span>
            </button>
            <button 
              onClick={() => handleRating(Difficulty.GOOD)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-teal-50 text-teal-600 hover:bg-teal-100 active:scale-95 transition-all"
            >
              <span className="font-bold text-lg mb-1">Good</span>
              <span className="text-[10px] uppercase opacity-70">Okay</span>
            </button>
            <button 
              onClick={() => handleRating(Difficulty.EASY)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95 transition-all"
            >
              <span className="font-bold text-lg mb-1">Easy</span>
              <span className="text-[10px] uppercase opacity-70">Solid</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};