import React, { useState, useEffect } from 'react';
import { Volume2, RotateCw } from 'lucide-react';
import { Card } from '../types';

interface FlashcardProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ card, isFlipped, onFlip }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find a Cantonese voice, fallback to zh-HK or zh-CN
      const voices = window.speechSynthesis.getVoices();
      const cantoneseVoice = voices.find(v => v.lang === 'zh-HK');
      if (cantoneseVoice) utterance.voice = cantoneseVoice;
      else utterance.lang = 'zh-HK'; // Attempt to set lang anyway
      
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Preload voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  return (
    <div 
      className="relative w-full h-[420px] cursor-pointer group perspective-1000" 
      onClick={onFlip}
    >
      <div className={`relative w-full h-full duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front Face */}
        <div className="absolute w-full h-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col items-center justify-center backface-hidden">
          <div className="text-sm uppercase tracking-wider text-slate-400 font-semibold mb-4">
            Cantonese
          </div>
          <h2 className="text-5xl font-bold text-slate-800 text-center mb-6">
            {card.cantonese}
          </h2>
          <button 
            onClick={(e) => speak(card.cantonese, e)}
            className={`p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors ${isSpeaking ? 'text-primary' : 'text-slate-600'}`}
          >
            <Volume2 size={24} />
          </button>
          <div className="absolute bottom-8 text-slate-400 text-sm flex items-center gap-2">
            <RotateCw size={14} /> Tap to flip
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute w-full h-full bg-slate-50 rounded-3xl shadow-xl border border-slate-200 p-8 flex flex-col rotate-y-180 backface-hidden overflow-y-auto">
           <div className="flex justify-between items-start mb-4">
             <div>
                <h3 className="text-3xl font-bold text-slate-800">{card.cantonese}</h3>
                <p className="text-primary font-medium text-lg mt-1">{card.jyutping}</p>
             </div>
             <button 
                onClick={(e) => speak(card.cantonese, e)}
                className="p-2 rounded-full bg-white shadow-sm text-slate-600"
              >
                <Volume2 size={20} />
              </button>
           </div>
           
           <div className="space-y-4">
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
               <span className="text-xs font-bold text-slate-400 uppercase">Meaning</span>
               <p className="text-slate-700 text-lg">{card.mandarin}</p>
             </div>

             {card.example && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase">Example</span>
                  <p className="text-slate-800 font-medium mt-1">{card.example}</p>
                  <p className="text-slate-500 text-sm italic mt-1">{card.exampleJyutping}</p>
                  <p className="text-slate-600 text-sm mt-2">{card.exampleMeaning}</p>
                  <button 
                    onClick={(e) => card.example && speak(card.example, e)}
                    className="mt-2 text-primary text-xs font-medium flex items-center gap-1"
                  >
                    <Volume2 size={12} /> Play Sentence
                  </button>
                </div>
             )}

             <div className="flex flex-wrap gap-2 mt-2">
               {card.tags.map(tag => (
                 <span key={tag} className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-md font-medium">
                   #{tag}
                 </span>
               ))}
               <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-md font-medium">
                  Lv.{card.level}
               </span>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};