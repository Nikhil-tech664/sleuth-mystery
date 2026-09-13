import React, { useState } from 'react';
import type { Suspect, Weapon, Location } from '../types/game';
import { Users, Crosshair, MapPin, Eye, MessageSquare } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface SuspectDossierProps {
  suspects: Suspect[];
  weapons: Weapon[];
  locations: Location[];
  onInterrogateSuspect: (suspect: Suspect) => void;
}

export const SuspectDossier: React.FC<SuspectDossierProps> = ({
  suspects,
  weapons,
  locations,
  onInterrogateSuspect,
}) => {
  const [activeTab, setActiveTab] = useState<'suspects' | 'weapons' | 'locations'>('suspects');

  return (
    <div className="rounded-xl manila-dossier p-5 shadow-xl relative overflow-hidden">
      {/* Brass Eyelet Grommet */}
      <div className="absolute top-3 right-4 w-3 h-3 rounded-full bg-[#D4AF37]/40 border border-[#8C6207] shadow-inner pointer-events-none" />

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-[#3E352B] pb-3 mb-4">
        <button
          onClick={() => {
            sound.playTypewriter();
            setActiveTab('suspects');
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
            activeTab === 'suspects'
              ? 'bg-[#C69214] text-[#121110] shadow-md scale-105'
              : 'bg-[#221F1C] text-[#A89E92] hover:text-[#FAF7F2]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Suspects ({suspects.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playTypewriter();
            setActiveTab('weapons');
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
            activeTab === 'weapons'
              ? 'bg-[#C69214] text-[#121110] shadow-md scale-105'
              : 'bg-[#221F1C] text-[#A89E92] hover:text-[#FAF7F2]'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>Weapons ({weapons.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playTypewriter();
            setActiveTab('locations');
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
            activeTab === 'locations'
              ? 'bg-[#C69214] text-[#121110] shadow-md scale-105'
              : 'bg-[#221F1C] text-[#A89E92] hover:text-[#FAF7F2]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Locations ({locations.length})</span>
        </button>
      </div>

      {/* Tab Content: Suspects */}
      {activeTab === 'suspects' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suspects.map((suspect) => (
            <div
              key={suspect.id}
              className="group vintage-index-card rounded-xl p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#C69214]/60 shadow-lg flex flex-col justify-between relative"
            >
              {/* Paperclip clipping suspect photo card */}
              <div className="paperclip-clip -top-3 left-4" />

              <div>
                {/* Polaroid Mugshot Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-16 h-16 rounded bg-[#FAF6F0] p-1 border border-[#3E352B] shadow-inner group-hover:scale-105 transition-all shrink-0">
                    <div className="w-full h-full rounded overflow-hidden bg-[#121110] relative">
                      {suspect.portraitUrl ? (
                        <>
                          <img
                            src={suspect.portraitUrl}
                            alt={suspect.name}
                            className="w-full h-full object-cover object-top filter contrast-110"
                          />
                          <span className="absolute bottom-0.5 right-0.5 text-[9px] bg-black/80 px-1 py-0.2 rounded text-amber-200 border border-white/10 leading-none">
                            {suspect.avatarEmoji}
                          </span>
                        </>
                      ) : (
                        <span className="flex items-center justify-center h-full text-3xl">
                          {suspect.avatarEmoji}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#FAF6F0] font-serif truncate">
                      {suspect.name}
                    </div>
                    <div className="text-[11px] font-mono text-[#C69214] truncate font-semibold">
                      "{suspect.alias}"
                    </div>
                    <div className="text-[11px] text-[#A89E92] truncate font-sans">
                      {suspect.role}
                    </div>
                  </div>
                </div>

                {/* Motive & Bio */}
                <div className="space-y-2 text-xs">
                  <div className="bg-[#181513] rounded p-2 border border-[#2F2922]">
                    <span className="font-mono text-[#E5B54F] font-bold block mb-0.5 text-[10px] uppercase">
                      Suspicious Motive:
                    </span>
                    <p className="text-[#CCC4B8] leading-tight font-sans">
                      {suspect.motive}
                    </p>
                  </div>
                  <div className="text-[#999083] text-[11px] italic font-sans flex items-start gap-1">
                    <Eye className="w-3 h-3 text-[#C69214] shrink-0 mt-0.5" />
                    <span>"{suspect.quirk}"</span>
                  </div>

                  {/* Interrogate Action Button */}
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTypewriter();
                      onInterrogateSuspect(suspect);
                    }}
                    className="w-full mt-2 py-1.5 px-3 rounded-lg bg-[#292215] border border-[#C69214]/50 hover:bg-[#382D1B] hover:border-[#C69214] text-amber-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Cross-Examine Under Polygraph</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Weapons */}
      {activeTab === 'weapons' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weapons.map((weapon) => (
            <div
              key={weapon.id}
              className="bg-[#211E1B] border border-[#332E28] rounded-xl p-4 shadow-md flex items-start gap-3"
            >
              <div className="w-12 h-12 rounded-lg bg-[#141311] border border-[#3A352F] flex items-center justify-center text-2xl shrink-0">
                {weapon.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-[#F5EFEB] font-serif">
                    {weapon.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2B2723] text-[#C69214] font-mono uppercase">
                    {weapon.category}
                  </span>
                </div>
                <p className="text-xs text-[#AAA194] leading-relaxed font-sans">
                  {weapon.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Locations */}
      {activeTab === 'locations' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-[#211E1B] border border-[#332E28] rounded-xl p-4 shadow-md flex items-start gap-3"
            >
              <div className="w-12 h-12 rounded-lg bg-[#141311] border border-[#3A352F] flex items-center justify-center text-2xl shrink-0">
                {loc.icon}
              </div>
              <div>
                <div className="text-sm font-bold text-[#F5EFEB] font-serif mb-1">
                  {loc.name}
                </div>
                <p className="text-xs text-[#AAA194] leading-relaxed font-sans">
                  {loc.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
