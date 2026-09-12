import React, { useState } from 'react';
import type { Case, DeductionState } from '../types/game';
import { sound } from '../audio/soundEffects';
import { Scissors, ArrowLeft, Pin, Activity } from 'lucide-react';

interface ConspiracyBoardViewProps {
  currentCase: Case;
  deductionState: DeductionState;
  onUpdateGridCell: (key: string) => void;
  onReturnToDesk: () => void;
}

interface YarnConnection {
  id: string;
  sourceType: 'suspect' | 'weapon' | 'location';
  sourceId: string;
  targetType: 'suspect' | 'weapon' | 'location';
  targetId: string;
  label?: string;
}

export const ConspiracyBoardView: React.FC<ConspiracyBoardViewProps> = ({
  currentCase,
  deductionState,
  onUpdateGridCell,
  onReturnToDesk,
}) => {
  // Active selected pin to initiate a yarn connection
  const [activePin, setActivePin] = useState<{
    type: 'suspect' | 'weapon' | 'location';
    id: string;
    title: string;
  } | null>(null);

  // Initial yarn connections generated from deduction grid or user-added
  const [connections, setConnections] = useState<YarnConnection[]>(() => {
    // Generate existing confirmed links from deductionState.grid
    const initialLinks: YarnConnection[] = [];
    Object.entries(deductionState.grid).forEach(([key, val]) => {
      if (val === 'yes') {
        const [partA, partB] = key.split('-');
        if (partA && partB) {
          const [catA, idA] = partA.split(':');
          const [catB, idB] = partB.split(':');
          if (catA && idA && catB && idB) {
            initialLinks.push({
              id: `${partA}-${partB}`,
              sourceType: catA as 'suspect' | 'weapon' | 'location',
              sourceId: idA,
              targetType: catB as 'suspect' | 'weapon' | 'location',
              targetId: idB,
            });
          }
        }
      }
    });
    return initialLinks;
  });

  // Handle pin click
  const handlePinClick = (type: 'suspect' | 'weapon' | 'location', id: string, title: string) => {
    sound.playPin();

    if (!activePin) {
      // Start drawing yarn from this pin
      setActivePin({ type, id, title });
    } else {
      if (activePin.type === type && activePin.id === id) {
        // Deselect
        setActivePin(null);
        return;
      }

      // Complete yarn connection between activePin and clicked pin
      const linkId = `${activePin.type}:${activePin.id}-${type}:${id}`;
      const reverseLinkId = `${type}:${id}-${activePin.type}:${activePin.id}`;

      // Check if connection already exists
      const exists = connections.some((c) => c.id === linkId || c.id === reverseLinkId);

      if (exists) {
        // Cut connection
        sound.playYarnTwang();
        setConnections((prev) => prev.filter((c) => c.id !== linkId && c.id !== reverseLinkId));
      } else {
        // Add new red yarn string
        sound.playYarnTwang();
        setConnections((prev) => [
          ...prev,
          {
            id: linkId,
            sourceType: activePin.type,
            sourceId: activePin.id,
            targetType: type,
            targetId: id,
          },
        ]);

        // Also reflect into deduction grid if valid pair
        if (activePin.type !== type) {
          onUpdateGridCell(`${activePin.type}:${activePin.id}-${type}:${id}`);
        }
      }

      setActivePin(null);
    }
  };

  // Pluck an existing yarn string
  const handlePluckString = () => {
    sound.playYarnTwang();
  };

  // Sever an existing yarn string
  const handleSeverString = (connId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTypewriter();
    setConnections((prev) => prev.filter((c) => c.id !== connId));
  };

  // Clear all strings
  const handleClearAll = () => {
    sound.playCassetteClick();
    setConnections([]);
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#181512] border border-[#352F27] p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playTypewriter();
              onReturnToDesk();
            }}
            className="p-2 bg-[#25211B] hover:bg-[#342D24] text-stone-300 hover:text-white rounded-xl border border-stone-700 transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Desk</span>
          </button>
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500 animate-pulse" />
              The Red Yarn Conspiracy Board
            </h2>
            <p className="text-xs text-stone-400 font-sans">
              Click any pushpin to anchor a red yarn cord, then click another pin to draw the
              criminal conspiracy web.
            </p>
          </div>
        </div>

        {/* Board Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {activePin && (
            <div className="px-3 py-1.5 bg-red-950/80 border border-red-600/80 text-red-200 text-xs font-mono rounded-xl animate-pulse flex items-center gap-2">
              <Pin className="w-3.5 h-3.5 text-red-400" />
              <span>Yarn Anchored: {activePin.title}</span>
              <button
                onClick={() => setActivePin(null)}
                className="hover:text-white font-bold ml-1"
              >
                ✕
              </button>
            </div>
          )}

          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 bg-[#25211B] hover:bg-red-950 text-stone-300 hover:text-red-300 border border-stone-700 hover:border-red-700/50 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Sever All Yarn</span>
          </button>
        </div>
      </div>

      {/* THE CORKBOARD SURFACE CONTAINER */}
      <div
        className="w-full min-h-[720px] rounded-3xl p-6 sm:p-8 shadow-2xl relative border-8 border-[#3D2817] overflow-hidden select-none"
        style={{
          backgroundColor: '#8B5A2B',
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(205, 149, 90, 0.4) 0%, rgba(110, 68, 30, 0.9) 100%),
            repeating-radial-gradient(circle at 17% 32%, rgba(0,0,0,0.06) 0, rgba(0,0,0,0.06) 2px, transparent 2px, transparent 8px),
            repeating-radial-gradient(circle at 83% 71%, rgba(0,0,0,0.06) 0, rgba(0,0,0,0.06) 3px, transparent 3px, transparent 9px)
          `,
          boxShadow: 'inset 0 0 80px rgba(0, 0, 0, 0.8), 0 20px 40px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Corkboard Texture Grain & Pushpin Shadow Overlays */}
        <div className="absolute inset-0 bg-amber-950/20 mix-blend-multiply pointer-events-none" />

        {/* Top Board Label Plaque */}
        <div className="relative z-10 flex justify-center mb-6">
          <div className="bg-[#1C1712]/90 border-2 border-amber-600/60 shadow-xl px-6 py-2 rounded-xl text-center">
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-500 font-bold block">
              PRECINCT #4 POLICE ARCHIVE • CONFIDENTIAL
            </span>
            <span className="text-sm font-serif font-bold text-amber-100">
              CASE #{currentCase.caseNumber}: {currentCase.title.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Active Red Yarn Strings Overview Banner */}
        {connections.length > 0 && (
          <div className="relative z-10 mb-4 bg-black/40 backdrop-blur-sm border border-red-900/50 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-red-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span>
                {connections.length} Red Yarn Tension Cord{connections.length > 1 ? 's' : ''} Active
              </span>
            </div>
            <span className="text-[11px] text-stone-400">
              Click any cord badge to pluck taut string (ASMR audio)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {connections.map((conn) => (
                <button
                  key={conn.id}
                  onClick={() => handlePluckString()}
                  className="px-2 py-0.5 bg-red-900/60 hover:bg-red-800 border border-red-600/70 rounded-md text-[10px] text-red-100 flex items-center gap-1.5 transition-transform hover:scale-105"
                  title="Click to pluck string or hover to sever"
                >
                  <span>
                    {conn.sourceId.replace('_', ' ')} ➔ {conn.targetId.replace('_', ' ')}
                  </span>
                  <span
                    onClick={(e) => handleSeverString(conn.id, e)}
                    className="text-red-400 hover:text-white font-bold ml-1 hover:scale-125"
                    title="Sever string"
                  >
                    ✂
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3 COLUMNS OF PHYSICAL EVIDENCE CARDS PINNED TO CORK */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* COLUMN 1: SUSPECT POLAROID PHOTOS */}
          <div className="space-y-4">
            <div className="bg-[#FAF6ED] text-[#241F1A] px-3 py-1.5 rounded shadow font-serif text-xs font-bold text-center border border-amber-900/40 uppercase tracking-wider rotate-[-1deg]">
              PERSONS OF INTEREST
            </div>

            {currentCase.suspects.map((suspect, idx) => {
              const isSelected = activePin?.type === 'suspect' && activePin.id === suspect.id;
              const hasConnectedCord = connections.some(
                (c) =>
                  (c.sourceType === 'suspect' && c.sourceId === suspect.id) ||
                  (c.targetType === 'suspect' && c.targetId === suspect.id)
              );

              // Alternate slight tilt angles for realistic organic corkboard look
              const rotationClass =
                idx === 0 ? 'rotate-[-1.5deg]' : idx === 1 ? 'rotate-[1.8deg]' : 'rotate-[-2deg]';

              return (
                <div
                  key={suspect.id}
                  className={`relative group bg-[#FAF6ED] p-3 rounded-lg shadow-2xl transition-all duration-200 border-2 ${rotationClass} ${
                    isSelected
                      ? 'ring-4 ring-red-500 scale-105 border-red-500 z-20'
                      : 'border-[#D9CFBE] hover:scale-102 hover:shadow-2xl z-10'
                  }`}
                >
                  {/* Brass Pushpin with red yarn anchor point */}
                  <button
                    onClick={() => handlePinClick('suspect', suspect.id, suspect.name)}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 group-hover:scale-125 transition-transform"
                    title="Click pushpin to anchor or connect red yarn cord"
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 transition-colors ${
                        isSelected
                          ? 'bg-red-600 border-white ring-4 ring-red-400'
                          : hasConnectedCord
                          ? 'bg-red-700 border-amber-300'
                          : 'bg-amber-400 border-amber-700'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white shadow-inner" />
                    </div>
                  </button>

                  {/* Polaroid Photo Frame */}
                  <div className="bg-[#1A1815] rounded p-4 text-center mb-2 shadow-inner relative overflow-hidden">
                    <div className="text-4xl mb-1 filter drop-shadow-md">
                      {suspect.avatarEmoji}
                    </div>
                    <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                      {suspect.role}
                    </div>
                    {hasConnectedCord && (
                      <div className="absolute top-1 right-1 bg-red-600 text-white text-[8px] font-mono px-1 rounded font-bold">
                        YARN LINKED
                      </div>
                    )}
                  </div>

                  {/* Handwritten Polaroid Label */}
                  <div className="text-center">
                    <div className="font-serif font-bold text-sm text-[#1A1815] leading-tight">
                      {suspect.name}
                    </div>
                    <div className="text-[10px] font-mono text-[#7D7465] italic mt-0.5">
                      &quot;{suspect.alias}&quot;
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#D9CFBE] text-[11px] text-[#4A4339] font-sans text-left leading-snug">
                      <span className="font-bold text-red-800">Motive:</span> {suspect.motive}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* COLUMN 2: MURDER WEAPON EVIDENCE TAGS */}
          <div className="space-y-4">
            <div className="bg-[#FAF6ED] text-[#241F1A] px-3 py-1.5 rounded shadow font-serif text-xs font-bold text-center border border-amber-900/40 uppercase tracking-wider rotate-[1.2deg]">
              INSTRUMENTS OF MORTALITY
            </div>

            {currentCase.weapons.map((weapon, idx) => {
              const isSelected = activePin?.type === 'weapon' && activePin.id === weapon.id;
              const hasConnectedCord = connections.some(
                (c) =>
                  (c.sourceType === 'weapon' && c.sourceId === weapon.id) ||
                  (c.targetType === 'weapon' && c.targetId === weapon.id)
              );

              const rotationClass =
                idx === 0 ? 'rotate-[1.5deg]' : idx === 1 ? 'rotate-[-1.2deg]' : 'rotate-[2deg]';

              return (
                <div
                  key={weapon.id}
                  className={`relative group bg-[#EADCC8] p-3.5 rounded-lg shadow-xl transition-all duration-200 border-2 ${rotationClass} ${
                    isSelected
                      ? 'ring-4 ring-red-500 scale-105 border-red-500 z-20'
                      : 'border-[#B8A38B] hover:scale-102 hover:shadow-2xl z-10'
                  }`}
                >
                  {/* Brass Pushpin Anchor */}
                  <button
                    onClick={() => handlePinClick('weapon', weapon.id, weapon.name)}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 group-hover:scale-125 transition-transform"
                    title="Click pushpin to anchor or connect red yarn cord"
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 transition-colors ${
                        isSelected
                          ? 'bg-red-600 border-white ring-4 ring-red-400'
                          : hasConnectedCord
                          ? 'bg-red-700 border-amber-300'
                          : 'bg-amber-400 border-amber-700'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white shadow-inner" />
                    </div>
                  </button>

                  {/* Manila Evidence Tag Header */}
                  <div className="flex items-center justify-between border-b border-[#B8A38B] pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{weapon.icon}</span>
                      <div>
                        <div className="font-serif font-bold text-sm text-[#2A231C]">
                          {weapon.name}
                        </div>
                        <span className="text-[9px] font-mono font-bold bg-[#7D634C] text-[#FAF6ED] px-1.5 py-0.2 rounded uppercase">
                          {weapon.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#42372D] font-sans leading-snug">
                    {weapon.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* COLUMN 3: CRIME SCENE POSTCARDS */}
          <div className="space-y-4">
            <div className="bg-[#FAF6ED] text-[#241F1A] px-3 py-1.5 rounded shadow font-serif text-xs font-bold text-center border border-amber-900/40 uppercase tracking-wider rotate-[-0.8deg]">
              SCENE POSTMARKS & LOCATIONS
            </div>

            {currentCase.locations.map((loc, idx) => {
              const isSelected = activePin?.type === 'location' && activePin.id === loc.id;
              const hasConnectedCord = connections.some(
                (c) =>
                  (c.sourceType === 'location' && c.sourceId === loc.id) ||
                  (c.targetType === 'location' && c.targetId === loc.id)
              );

              const rotationClass =
                idx === 0 ? 'rotate-[-1deg]' : idx === 1 ? 'rotate-[2.2deg]' : 'rotate-[-1.5deg]';

              return (
                <div
                  key={loc.id}
                  className={`relative group bg-[#F5EFEB] p-3.5 rounded-lg shadow-xl transition-all duration-200 border-2 ${rotationClass} ${
                    isSelected
                      ? 'ring-4 ring-red-500 scale-105 border-red-500 z-20'
                      : 'border-[#CEC3B4] hover:scale-102 hover:shadow-2xl z-10'
                  }`}
                >
                  {/* Brass Pushpin Anchor */}
                  <button
                    onClick={() => handlePinClick('location', loc.id, loc.name)}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 group-hover:scale-125 transition-transform"
                    title="Click pushpin to anchor or connect red yarn cord"
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 transition-colors ${
                        isSelected
                          ? 'bg-red-600 border-white ring-4 ring-red-400'
                          : hasConnectedCord
                          ? 'bg-red-700 border-amber-300'
                          : 'bg-amber-400 border-amber-700'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white shadow-inner" />
                    </div>
                  </button>

                  {/* Postcard Stamp Header */}
                  <div className="flex items-center justify-between border-b border-[#CEC3B4] pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{loc.icon}</span>
                      <div className="font-serif font-bold text-sm text-[#2A231C]">{loc.name}</div>
                    </div>
                    <div className="w-7 h-8 border border-dashed border-red-700/60 rounded bg-red-100 flex items-center justify-center text-[9px] font-mono text-red-800 font-bold">
                      STAMP
                    </div>
                  </div>

                  <p className="text-[11px] text-[#42372D] font-sans leading-snug">
                    {loc.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
