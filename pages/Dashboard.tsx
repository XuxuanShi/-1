import React from 'react';
import { UserStats, Card } from '../types';
import { LEVEL_THRESHOLDS } from '../constants';
import { Trophy, Flame, CheckCircle, BarChart2 } from 'lucide-react';
import { Button } from '../components/Button';

interface DashboardProps {
  stats: UserStats;
  totalCards: number;
  dueCount: number;
  onStartStudy: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, totalCards, dueCount, onStartStudy }) => {
  const nextLevelXp = LEVEL_THRESHOLDS[stats.level as keyof typeof LEVEL_THRESHOLDS] || LEVEL_THRESHOLDS[3];
  const nextLevelTarget = LEVEL_THRESHOLDS[((stats.level + 1) as keyof typeof LEVEL_THRESHOLDS)] || 10000;
  
  // Calculate Progress
  const currentLevelBase = nextLevelXp;
  const progress = Math.min(100, Math.max(0, ((stats.xp - currentLevelBase) / (nextLevelTarget - currentLevelBase)) * 100));

  return (
    <div className="p-6 pb-24 space-y-6 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back!</h1>
          <p className="text-slate-500">Ready to learn some Cantonese?</p>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-sm font-bold border border-amber-100">
          <Flame size={16} fill="currentColor" />
          <span>{stats.streak} Days</span>
        </div>
      </header>

      {/* Level Card */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex justify-between items-center mb-2">
                <span className="font-semibold opacity-90">Current Level</span>
                <span className="font-bold bg-white/20 px-2 py-1 rounded-lg text-xs">XP {stats.xp} / {nextLevelTarget}</span>
            </div>
            <div className="text-4xl font-bold mb-4 flex items-center gap-3">
                <Trophy size={32} className="text-yellow-300" fill="currentColor" />
                Lv. {stats.level}
            </div>
            
            <div className="w-full bg-black/20 rounded-full h-2.5 mb-1">
                <div 
                    className="bg-yellow-300 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-xs opacity-80 text-right">
                {Math.round(nextLevelTarget - stats.xp)} XP to next level
            </p>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute -right-6 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -left-6 -top-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                <BarChart2 size={20} />
            </div>
            <span className="text-2xl font-bold text-slate-800">{totalCards}</span>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total Cards</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-2">
                <CheckCircle size={20} />
            </div>
            <span className="text-2xl font-bold text-slate-800">{stats.cardsLearnedToday}</span>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Learned Today</span>
        </div>
      </div>

      {/* Study Action */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md">
         <h3 className="text-lg font-bold text-slate-800 mb-2">Daily Session</h3>
         <p className="text-slate-500 mb-6 text-sm">
            You have <span className="font-bold text-primary">{dueCount} cards</span> to review today plus your daily mix of new words.
         </p>
         <Button 
            onClick={onStartStudy} 
            fullWidth 
            size="lg"
            disabled={dueCount === 0 && stats.cardsLearnedToday >= stats.dailyNewLimit}
         >
            {dueCount > 0 ? 'Start Review' : (stats.cardsLearnedToday < stats.dailyNewLimit ? 'Learn New Words' : 'Daily Goal Met!')}
         </Button>
      </div>
    </div>
  );
};