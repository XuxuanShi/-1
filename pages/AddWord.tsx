import React, { useState } from 'react';
import { Button } from '../components/Button';
import { generateCardContent } from '../services/geminiService';
import { Card, CardStatus } from '../types';
import { Wand2, Loader2, Save, ArrowLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface AddWordProps {
  onAddCard: (card: Card) => void;
  onCancel: () => void;
}

export const AddWord: React.FC<AddWordProps> = ({ onAddCard, onCancel }) => {
  const [mandarinInput, setMandarinInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<Partial<Card> | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!mandarinInput.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    // Check if API key is selected (simulated check as per instructions, using process.env)
    if (!process.env.API_KEY) {
       setError("API Key is missing. Please configure it.");
       setIsLoading(false);
       return;
    }

    try {
      const data = await generateCardContent(mandarinInput);
      setGeneratedData({
        cantonese: data.cantonese,
        jyutping: data.jyutping,
        mandarin: data.mandarin_meaning,
        example: data.example_sentence,
        exampleJyutping: data.example_jyutping,
        exampleMeaning: data.example_meaning,
        tags: data.tags,
        level: 1, // Default
      });
    } catch (err) {
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedData) return;

    const newCard: Card = {
      id: uuidv4(),
      cantonese: generatedData.cantonese!,
      jyutping: generatedData.jyutping!,
      mandarin: generatedData.mandarin!,
      example: generatedData.example,
      exampleJyutping: generatedData.exampleJyutping,
      exampleMeaning: generatedData.exampleMeaning,
      level: generatedData.level || 1,
      tags: generatedData.tags || [],
      status: CardStatus.NEW,
      interval: 0,
      repetition: 0,
      ef: 2.5,
      nextReviewDate: 0,
      createdAt: Date.now(),
    };

    onAddCard(newCard);
    setMandarinInput('');
    setGeneratedData(null);
  };

  return (
    <div className="p-6 h-full overflow-y-auto pb-32 animate-fade-in bg-slate-50">
      <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Add New Word</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Mandarin / Concept (e.g. "厉害")
            </label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={mandarinInput}
                    onChange={(e) => setMandarinInput(e.target.value)}
                    placeholder="Enter word..."
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !mandarinInput}
                    className="bg-secondary text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
                Click the wand to auto-fill Cantonese translation, Jyutping, and examples using AI.
            </p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {generatedData && (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 space-y-4 animate-slide-up">
            <h3 className="font-bold text-slate-800 border-b pb-2">Preview</h3>
            
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Cantonese</label>
              <input 
                value={generatedData.cantonese || ''} 
                onChange={(e) => setGeneratedData({...generatedData, cantonese: e.target.value})}
                className="w-full text-lg font-bold text-slate-800 border-b border-dashed border-slate-200 focus:border-primary outline-none py-1"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Jyutping</label>
               <input 
                value={generatedData.jyutping || ''} 
                onChange={(e) => setGeneratedData({...generatedData, jyutping: e.target.value})}
                className="w-full text-primary font-medium border-b border-dashed border-slate-200 focus:border-primary outline-none py-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Meaning</label>
               <input 
                value={generatedData.mandarin || ''} 
                onChange={(e) => setGeneratedData({...generatedData, mandarin: e.target.value})}
                className="w-full text-slate-600 border-b border-dashed border-slate-200 focus:border-primary outline-none py-1"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-lg">
                <label className="text-xs font-bold text-slate-400 uppercase">Example</label>
                <textarea 
                    value={generatedData.example || ''} 
                    onChange={(e) => setGeneratedData({...generatedData, example: e.target.value})}
                    className="w-full bg-transparent text-slate-800 text-sm mt-1 border-none focus:ring-0 resize-none p-0"
                    rows={2}
                />
                 <textarea 
                    value={generatedData.exampleJyutping || ''} 
                    onChange={(e) => setGeneratedData({...generatedData, exampleJyutping: e.target.value})}
                    className="w-full bg-transparent text-slate-500 text-xs italic border-none focus:ring-0 resize-none p-0"
                    rows={1}
                />
            </div>

            <Button onClick={handleSave} fullWidth size="lg" className="mt-4 flex items-center justify-center gap-2">
                <Save size={18} /> Save to Collection
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};