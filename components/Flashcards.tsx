import React, { useState } from 'react';
import { generateFlashcards } from '../services/geminiService';
import { Flashcard } from '../types';
import { Loader2, RotateCw, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

const Flashcards: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setLoading(true);
    setCards([]); // Clear old cards
    try {
      const generatedCards = await generateFlashcards(topic);
      setCards(generatedCards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      alert("Error generating flashcards");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(c => c + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(c => c - 1), 150);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6 flex-shrink-0">
        <h2 className="text-3xl font-bold text-slate-900">Flashcards</h2>
        <p className="text-slate-500 mt-2">Master any topic with AI-generated decks.</p>
      </div>

      {cards.length === 0 && !loading ? (
         <div className="flex-1 flex items-center justify-center">
           <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
             <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <RotateCw className="w-8 h-8 text-indigo-600" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Create a New Deck</h3>
             <p className="text-slate-500 mb-6">Enter a subject, and Trace will generate a study set for you instantly.</p>
             <form onSubmit={handleGenerate} className="flex gap-2">
               <input
                 type="text"
                 value={topic}
                 onChange={(e) => setTopic(e.target.value)}
                 placeholder="e.g. Photosynthesis, World War II..."
                 className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
               />
               <button 
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
               >
                 Go
               </button>
             </form>
           </div>
         </div>
      ) : loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p>Generating flashcards for "{topic}"...</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          {/* Progress Bar */}
          <div className="w-full max-w-lg mb-6 flex items-center justify-between text-sm font-medium text-slate-500">
             <span>Card {currentIndex + 1} of {cards.length}</span>
             <div className="flex gap-2">
                <button 
                  onClick={() => setCards([])}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  New Deck
                </button>
             </div>
          </div>

          {/* Card Container */}
          <div className="relative w-full max-w-lg aspect-[3/2] perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`w-full h-full transition-all duration-500 transform-style-3d shadow-xl rounded-2xl ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <span className="absolute top-4 left-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Front</span>
                <p className="text-2xl font-semibold text-slate-800">{cards[currentIndex].front}</p>
                <p className="absolute bottom-6 text-sm text-slate-400">Click to flip</p>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <span className="absolute top-4 left-6 text-xs font-bold text-indigo-200 uppercase tracking-widest">Back</span>
                <p className="text-xl font-medium text-white leading-relaxed">{cards[currentIndex].back}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center gap-8">
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              disabled={currentIndex === 0}
              className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            {/* Spaced Repetition Buttons */}
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-2 bg-rose-100 text-rose-700 rounded-lg font-medium hover:bg-rose-200 transition-colors">
                <X className="w-4 h-4" /> Still learning
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition-colors">
                <Check className="w-4 h-4" /> Got it
              </button>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              disabled={currentIndex === cards.length - 1}
              className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
