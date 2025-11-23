import React, { useState } from 'react';
import { Button } from '../components/Button';
import { generateCardContent, generateBatchContent } from '../services/geminiService';
import { Card, CardStatus } from '../types';
import { Wand2, Loader2, Save, Search, Sparkles, CheckSquare, Square, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { DISCOVERY_TOPICS } from '../constants';

interface AddWordProps {
  onAddCard: (card: Card) => void;
  onCancel: () => void;
}

type Mode = 'search' | 'discover';

export const AddWord: React.FC<AddWordProps> = ({ onAddCard, onCancel }) => {
  const [mode, setMode] = useState<Mode>('search');
  
  // Search Mode State
  const [mandarinInput, setMandarinInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<Partial<Card> | null>(null);
  
  // Discover Mode State
  const [selectedTopic, setSelectedTopic] = useState('');
  const [generatedBatch, setGeneratedBatch] = useState<Partial<Card>[]>([]);
  const [selectedBatchIndices, setSelectedBatchIndices] = useState<number[]>([]);

  const [error, setError] = useState('');

  // --- SEARCH MODE HANDLERS ---
  const handleGenerateSingle = async () => {
    if (!mandarinInput.trim()) return;
    setIsLoading(true);
    setError('');
    
    if (!process.env.API_KEY) {
       setError("API Key is missing.");
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
        level: 1,
      });
    } catch (err) {
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSingle = () => {
    if (!generatedData) return;
    const newCard = createCard(generatedData);
    onAddCard(newCard);
    setMandarinInput('');
    setGeneratedData(null);
  };

  // --- DISCOVER MODE HANDLERS ---
  const handleGenerateBatch = async () => {
    if (!selectedTopic) return;
    setIsLoading(true);
    setError('');
    setGeneratedBatch([]);
    setSelectedBatchIndices([]);

    if (!process.env.API_KEY) {
       setError("API Key is missing.");
       setIsLoading(false);
       return;
    }

    try {
      // Generate 3 words at a time to be fast
      const rawDataArray = await generateBatchContent(selectedTopic, 3);
      const batch = rawDataArray.map((data: any) => ({
        cantonese: data.cantonese,
        jyutping: data.jyutping,
        mandarin: data.mandarin_meaning,
        example: data.example_sentence,
        exampleJyutping: data.example_jyutping,
        exampleMeaning: data.example_meaning,
        tags: data.tags,
        level: 1,
      }));
      setGeneratedBatch(batch);
      // Select all by default
      setSelectedBatchIndices(batch.map((_: any, idx: number) => idx));
    } catch (err) {
      setError("Failed to generate batch. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBatchSelection = (index: number) => {
    if (selectedBatchIndices.includes(index)) {
      setSelectedBatchIndices(prev => prev.filter(i => i !== index));
    } else {
      setSelectedBatchIndices(prev => [...prev, index]);
    }
  };

  const handleSaveBatch = () => {
    selectedBatchIndices.forEach(index => {
      const cardData = generatedBatch[index];
      onAddCard(createCard(cardData));
    });
    // Reset after save
    setGeneratedBatch([]);
    setSelectedBatchIndices([]);
    alert(`Saved ${selectedBatchIndices.length} new words!`);
  };

  // Helper
  const createCard = (data: Partial<Card>): Card => ({
    id: uuidv4(),
    cantonese: data.cantonese!,
    jyutping: data.jyutping!,
    mandarin: data.mandarin!,
    example: data.example,
    exampleJyutping: data.exampleJyutping,
    exampleMeaning: data.exampleMeaning,
    level: data.level || 1,
    tags: data.tags || [],
    status: CardStatus.NEW,
    interval: 0,
    repetition: 0,
    ef: 2.5,
    nextReviewDate: 0,
    createdAt: Date.now(),
  });

  return (
    <div className="p-6 h-full overflow-y-auto pb-32 animate-fade-in bg-slate-50">
      <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Add Words</h2>
          {/* Toggle */}
          <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
             <button 
                onClick={() => setMode('search')}
                className={`p-2 rounded-md transition-all ${mode === 'search' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
             >
                <Search size={18} />
             </button>
             <button 
                onClick={() => setMode('discover')}
                className={`p-2 rounded-md transition-all ${mode === 'discover' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
             >
                <Sparkles size={18} />
             </button>
          </div>
      </div>

      {/* --- SEARCH MODE --- */}
      {mode === 'search' && (
        <div className="space-y-4 animate-fade-in">
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
                      onClick={handleGenerateSingle}
                      disabled={isLoading || !mandarinInput}
                      className="bg-secondary text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                      {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                  </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                  Auto-fill Cantonese translation, Jyutping, and examples using AI.
              </p>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {generatedData && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 space-y-4 animate-slide-up">
              <h3 className="font-bold text-slate-800 border-b pb-2">Preview</h3>
              <PreviewCardEditor data={generatedData} setData={setGeneratedData} />
              <Button onClick={handleSaveSingle} fullWidth size="lg" className="mt-4 flex items-center justify-center gap-2">
                  <Save size={18} /> Save to Collection
              </Button>
            </div>
          )}
        </div>
      )}

      {/* --- DISCOVER MODE --- */}
      {mode === 'discover' && (
        <div className="space-y-6 animate-fade-in">
           <div className="space-y-3">
              <h3 className="font-bold text-slate-700">Choose a topic</h3>
              <div className="grid grid-cols-2 gap-2">
                 {DISCOVERY_TOPICS.map(topic => (
                    <button
                        key={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className={`p-3 rounded-xl text-left text-xs font-medium border transition-all ${selectedTopic === topic ? 'border-primary bg-teal-50 text-primary' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'}`}
                    >
                        {topic}
                    </button>
                 ))}
              </div>
           </div>

           <Button 
              onClick={handleGenerateBatch}
              disabled={!selectedTopic || isLoading}
              fullWidth 
              size="lg"
              className="flex items-center justify-center gap-2"
           >
              {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              Generate New Words
           </Button>
           
           {error && <p className="text-red-500 text-sm">{error}</p>}

           {generatedBatch.length > 0 && (
             <div className="space-y-4 animate-slide-up">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Results</h3>
                    <span className="text-xs text-slate-500">{selectedBatchIndices.length} selected</span>
                </div>
                
                {generatedBatch.map((card, idx) => {
                    const isSelected = selectedBatchIndices.includes(idx);
                    return (
                        <div 
                           key={idx} 
                           onClick={() => toggleBatchSelection(idx)}
                           className={`relative p-4 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-white border-primary shadow-sm' : 'bg-slate-100 border-transparent opacity-75'}`}
                        >
                            <div className="absolute top-4 right-4 text-primary">
                                {isSelected ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-400" />}
                            </div>
                            <div className="pr-8">
                                <h4 className="text-xl font-bold text-slate-800">{card.cantonese}</h4>
                                <p className="text-primary font-medium text-sm">{card.jyutping}</p>
                                <p className="text-slate-600 text-sm mt-1">{card.mandarin}</p>
                                <p className="text-slate-400 text-xs mt-2 italic">"{card.example}"</p>
                            </div>
                        </div>
                    )
                })}

                <Button onClick={handleSaveBatch} disabled={selectedBatchIndices.length === 0} fullWidth variant="primary" className="sticky bottom-20 shadow-xl">
                   <Plus size={18} className="mr-2 inline" /> Add Selected ({selectedBatchIndices.length})
                </Button>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

// Sub-component for editing the preview in search mode
const PreviewCardEditor = ({ data, setData }: { data: Partial<Card>, setData: any }) => {
    return (
        <div className="space-y-4">
             <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Cantonese</label>
              <input 
                value={data.cantonese || ''} 
                onChange={(e) => setData({...data, cantonese: e.target.value})}
                className="w-full text-lg font-bold text-slate-800 border-b border-dashed border-slate-200 focus:border-primary outline-none py-1"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Jyutping</label>
               <input 
                value={data.jyutping || ''} 
                onChange={(e) => setData({...data, jyutping: e.target.value})}
                className="w-full text-primary font-medium border-b border-dashed border-slate-200 focus:border-primary outline-none py-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Meaning</label>
               <input 
                value={data.mandarin || ''} 
                onChange={(e) => setData({...data, mandarin: e.target.value})}
                className="w-full text-slate-600 border-b border-dashed border-slate-200 focus:border-primary outline-none py-1"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-lg">
                <label className="text-xs font-bold text-slate-400 uppercase">Example</label>
                <textarea 
                    value={data.example || ''} 
                    onChange={(e) => setData({...data, example: e.target.value})}
                    className="w-full bg-transparent text-slate-800 text-sm mt-1 border-none focus:ring-0 resize-none p-0"
                    rows={2}
                />
                 <textarea 
                    value={data.exampleJyutping || ''} 
                    onChange={(e) => setData({...data, exampleJyutping: e.target.value})}
                    className="w-full bg-transparent text-slate-500 text-xs italic border-none focus:ring-0 resize-none p-0"
                    rows={1}
                />
            </div>
        </div>
    )
}