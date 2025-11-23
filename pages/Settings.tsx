import React from 'react';
import { Card, UserStats } from '../types';
import { Download, Trash2, Database } from 'lucide-react';
import { Button } from '../components/Button';

interface SettingsProps {
  cards: Card[];
  stats: UserStats;
  onReset: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ cards, stats, onReset }) => {
  
  const handleExport = () => {
    const headers = ['ID', 'Cantonese', 'Jyutping', 'Meaning', 'Example', 'Example Jyutping', 'Status', 'Next Review'];
    const csvContent = [
      headers.join(','),
      ...cards.map(c => [
        c.id,
        c.cantonese,
        c.jyutping,
        c.mandarin,
        `"${c.example || ''}"`,
        `"${c.exampleJyutping || ''}"`,
        c.status,
        new Date(c.nextReviewDate).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cantonese_memory_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 h-full bg-slate-50 animate-fade-in">
       <h2 className="text-2xl font-bold text-slate-800 mb-6">Settings</h2>
       
       <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-4 text-slate-700">
                <Database size={24} />
                <h3 className="font-bold text-lg">Data Management</h3>
            </div>
            <p className="text-slate-500 text-sm mb-4">
                Export your flashcards and learning history to CSV for backup or Excel analysis.
            </p>
            <Button onClick={handleExport} variant="outline" fullWidth className="flex items-center gap-2 justify-center">
                <Download size={18} /> Export Data
            </Button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
             <h3 className="font-bold text-lg text-red-600 mb-2">Danger Zone</h3>
             <p className="text-slate-500 text-sm mb-4">
                Reset all progress. This cannot be undone.
             </p>
             <Button onClick={() => {
                 if(window.confirm("Are you sure? All progress will be lost.")) {
                     onReset();
                 }
             }} variant="danger" fullWidth className="flex items-center gap-2 justify-center">
                <Trash2 size={18} /> Reset All Progress
             </Button>
          </div>
          
          <div className="text-center text-xs text-slate-400 mt-8">
            <p>Cantonese Memory Pro v1.0.0</p>
            <p>Built with React & Gemini AI</p>
          </div>
       </div>
    </div>
  );
};