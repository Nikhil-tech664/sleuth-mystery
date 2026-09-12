import React from 'react';
import { Search, Users, FileText, Grid, Skull } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface MobileDockProps {
  onAccuseClick: () => void;
  isSolved: boolean;
  currentView?: string;
  onSelectView?: (view: 'desk' | 'corkboard' | 'archive' | 'lab' | 'syndicate' | 'nightshift' | 'trophies' | 'generator') => void;
}

export const MobileDock: React.FC<MobileDockProps> = ({ 
  onAccuseClick, 
  isSolved,
  currentView = 'desk',
  onSelectView,
}) => {
  const scrollTo = (id: string) => {
    sound.playTypewriter();
    if (currentView !== 'desk' && onSelectView) {
      onSelectView('desk');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40">
      <div className="bg-[#181614]/95 backdrop-blur-md border-2 border-[#C69214]/40 rounded-2xl p-2 shadow-2xl flex items-center justify-between gap-1 text-[10px] font-mono font-bold">
        <button
          type="button"
          onClick={() => scrollTo('crime-scene-section')}
          className="flex-1 py-1.5 rounded-lg bg-[#221F1C] hover:bg-[#2B2723] text-[#CCC4B8] flex flex-col items-center gap-0.5 active:scale-95 transition-all"
        >
          <Search className="w-3.5 h-3.5 text-[#C69214]" />
          <span>Scene</span>
        </button>

        <button
          type="button"
          onClick={() => scrollTo('suspects-section')}
          className="flex-1 py-1.5 rounded-lg bg-[#221F1C] hover:bg-[#2B2723] text-[#CCC4B8] flex flex-col items-center gap-0.5 active:scale-95 transition-all"
        >
          <Users className="w-3.5 h-3.5 text-[#C69214]" />
          <span>Suspects</span>
        </button>

        <button
          type="button"
          onClick={() => scrollTo('clues-section')}
          className="flex-1 py-1.5 rounded-lg bg-[#221F1C] hover:bg-[#2B2723] text-[#CCC4B8] flex flex-col items-center gap-0.5 active:scale-95 transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-[#C69214]" />
          <span>Clues</span>
        </button>

        <button
          type="button"
          onClick={() => scrollTo('logic-grid-section')}
          className="flex-1 py-1.5 rounded-lg bg-[#221F1C] hover:bg-[#2B2723] text-[#CCC4B8] flex flex-col items-center gap-0.5 active:scale-95 transition-all"
        >
          <Grid className="w-3.5 h-3.5 text-[#C69214]" />
          <span>Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playTypewriter();
            onAccuseClick();
          }}
          className={`flex-1 py-1.5 rounded-lg flex flex-col items-center gap-0.5 active:scale-95 transition-all shadow-md ${
            isSolved
              ? 'bg-emerald-900 border border-emerald-500 text-emerald-100'
              : 'bg-red-800 hover:bg-red-700 text-white border border-red-500/50'
          }`}
        >
          <Skull className="w-3.5 h-3.5" />
          <span>{isSolved ? 'Verdict' : 'Accuse'}</span>
        </button>
      </div>
    </div>
  );
};
