import React, { useRef, useEffect, useState } from 'react';
import {
  X,
  Flashlight,
  Eye,
} from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface Interactive3DSceneModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseTitle: string;
  onDiscoverClue?: (clueText: string) => void;
}

interface SceneHotspot {
  id: string;
  x: number;
  y: number;
  radius: number;
  title: string;
  forensicNote: string;
  isUvOnly: boolean;
  discovered: boolean;
  evidenceEmoji: string;
}

export const Interactive3DSceneModal: React.FC<Interactive3DSceneModalProps> = ({
  isOpen,
  onClose,
  caseTitle,
  onDiscoverClue,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isUvMode, setIsUvMode] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 350, y: 250 });
  const [selectedHotspot, setSelectedHotspot] = useState<SceneHotspot | null>(null);
  const [discoveredCount, setDiscoveredCount] = useState<number>(0);

  const [hotspots, setHotspots] = useState<SceneHotspot[]>([
    {
      id: 'snifter',
      x: 380,
      y: 220,
      radius: 28,
      title: 'Poisoned Crystal Snifter',
      forensicNote:
        'Residue of bitter almond cyanide crystalized on the rim. Inverted loop fingerprint lifted from base.',
      isUvOnly: false,
      discovered: false,
      evidenceEmoji: '🍷',
    },
    {
      id: 'fireplace_ashes',
      x: 520,
      y: 150,
      radius: 30,
      title: 'Scorched Will in Hearth',
      forensicNote:
        'Partially burnt parchment fragment reading "...bequeath all properties to the London Hospital, disinheriting Vivienne..."',
      isUvOnly: false,
      discovered: false,
      evidenceEmoji: '🔥',
    },
    {
      id: 'uv_blood_spatter',
      x: 230,
      y: 320,
      radius: 35,
      title: 'Latent Blood Spatter Pattern',
      forensicNote:
        'Fluoresces neon green under ultraviolet light. High-velocity impact spatter indicating sudden trauma from behind.',
      isUvOnly: true,
      discovered: false,
      evidenceEmoji: '🩸',
    },
    {
      id: 'uv_wall_cipher',
      x: 180,
      y: 120,
      radius: 32,
      title: 'Glow-in-the-Dark Cipher on Wainscoting',
      forensicNote:
        'Scratched with a signet ring into the oak panel: "TENEBRAS - COUNCIL ROOM 4".',
      isUvOnly: true,
      discovered: false,
      evidenceEmoji: '📜',
    },
  ]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // 1. Clear background
      ctx.fillStyle = isUvMode ? '#100B1E' : '#0B0908';
      ctx.fillRect(0, 0, w, h);

      // 2. Draw 3D Isometric Room Perspective
      // Back wall
      const wallGradient = ctx.createLinearGradient(0, 0, 0, h * 0.55);
      wallGradient.addColorStop(0, isUvMode ? '#1E1238' : '#1C1611');
      wallGradient.addColorStop(1, isUvMode ? '#150A2A' : '#14100C');
      ctx.fillStyle = wallGradient;
      ctx.fillRect(0, 0, w, h * 0.55);

      // Wood floorboards (perspective lines)
      ctx.fillStyle = isUvMode ? '#120A24' : '#18120B';
      ctx.fillRect(0, h * 0.55, w, h * 0.45);

      ctx.strokeStyle = isUvMode ? '#2B1B4A' : '#261D13';
      ctx.lineWidth = 1.5;
      for (let x = -100; x < w + 200; x += 55) {
        ctx.beginPath();
        ctx.moveTo(w * 0.5 + (x - w * 0.5) * 0.3, h * 0.55);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Horizontal floor lines
      for (let y = h * 0.55; y < h; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Fireplace on right wall
      ctx.fillStyle = isUvMode ? '#190F2D' : '#2A1F16';
      ctx.fillRect(470, 90, 110, 120);
      ctx.fillStyle = isUvMode ? '#2A1747' : '#140D08';
      ctx.fillRect(490, 125, 70, 85);
      // Faint glowing embers
      ctx.fillStyle = isUvMode ? '#A855F7' : '#EA580C';
      ctx.beginPath();
      ctx.arc(525, 185, 8, 0, Math.PI * 2);
      ctx.fill();

      // Large Mahogany Desk in center
      ctx.fillStyle = isUvMode ? '#22153D' : '#332213';
      ctx.beginPath();
      ctx.moveTo(310, 190);
      ctx.lineTo(450, 190);
      ctx.lineTo(470, 260);
      ctx.lineTo(290, 260);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = isUvMode ? '#3C2366' : '#47311D';
      ctx.stroke();

      // Desk legs
      ctx.fillStyle = isUvMode ? '#170E28' : '#22160C';
      ctx.fillRect(295, 260, 12, 45);
      ctx.fillRect(460, 260, 12, 45);

      // Victim silhouette chalk outline
      ctx.strokeStyle = isUvMode ? '#A78BFA' : '#C4BCB0';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Body chalk outline
      ctx.ellipse(380, 285, 38, 18, -0.2, 0, Math.PI * 2);
      ctx.stroke();
      // Head chalk outline
      ctx.beginPath();
      ctx.arc(335, 280, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Broken window on left wall
      ctx.fillStyle = isUvMode ? '#1C1236' : '#18242A';
      ctx.fillRect(80, 60, 80, 120);
      ctx.strokeStyle = isUvMode ? '#3D256D' : '#334850';
      ctx.strokeRect(80, 60, 80, 120);

      // 3. Render Latent UV Elements if UV mode is active
      if (isUvMode) {
        // Glowing neon green/violet blood spatter
        ctx.fillStyle = '#22C55E';
        ctx.shadowColor = '#4ADE80';
        ctx.shadowBlur = 15;
        for (let i = 0; i < 7; i++) {
          ctx.beginPath();
          ctx.arc(220 + i * 8, 315 + (i % 3) * 6, 3 + (i % 2) * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Glowing cipher writing on wall
        ctx.font = '12px Courier New';
        ctx.fillStyle = '#C084FC';
        ctx.shadowColor = '#A855F7';
        ctx.shadowBlur = 12;
        ctx.fillText('TENEBRAS - COUNCIL', 140, 125);
        ctx.shadowBlur = 0;
      }

      // 4. Flashlight Lighting Mask (Cone / Spotlight)
      // Save canvas state
      ctx.save();
      const lightRadius = isUvMode ? 140 : 180;
      const flashGrad = ctx.createRadialGradient(
        mousePos.x,
        mousePos.y,
        15,
        mousePos.x,
        mousePos.y,
        lightRadius
      );

      if (isUvMode) {
        flashGrad.addColorStop(0, 'rgba(168, 85, 247, 0.45)');
        flashGrad.addColorStop(0.5, 'rgba(126, 34, 206, 0.25)');
        flashGrad.addColorStop(1, 'rgba(15, 10, 26, 0.94)');
      } else {
        flashGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
        flashGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.12)');
        flashGrad.addColorStop(1, 'rgba(10, 8, 7, 0.93)');
      }

      // Draw darkness overlay everywhere except the flashlight circle
      ctx.fillStyle = flashGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // 5. Draw interactive hotspot markers
      hotspots.forEach((hSpot) => {
        // Only show UV-only hotspots if UV mode is active
        if (hSpot.isUvOnly && !isUvMode) return;

        // Check distance to mouse flashlight cone
        const dist = Math.hypot(hSpot.x - mousePos.x, hSpot.y - mousePos.y);
        const isLit = dist < lightRadius * 0.9;

        if (isLit) {
          ctx.save();
          // Glowing pulsator ring
          ctx.strokeStyle = hSpot.discovered
            ? '#10B981'
            : isUvMode
            ? '#A855F7'
            : '#F59E0B';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(hSpot.x, hSpot.y, hSpot.radius * 0.7, 0, Math.PI * 2);
          ctx.stroke();

          // Icon indicator
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(hSpot.evidenceEmoji, hSpot.x, hSpot.y);
          ctx.restore();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isOpen, isUvMode, mousePos, hotspots]);

  if (!isOpen) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    setMousePos({ x, y });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Check hit on hotspots
    const hit = hotspots.find((h) => {
      if (h.isUvOnly && !isUvMode) return false;
      const dist = Math.hypot(h.x - clickX, h.y - clickY);
      return dist <= h.radius;
    });

    if (hit) {
      sound.playMagnifier();
      setSelectedHotspot(hit);
      if (!hit.discovered) {
        setHotspots((prev) =>
          prev.map((item) => (item.id === hit.id ? { ...item, discovered: true } : item))
        );
        setDiscoveredCount((prev) => prev + 1);
        if (onDiscoverClue) {
          onDiscoverClue(`[3D Crime Scene Clue]: ${hit.title} - ${hit.forensicNote}`);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[94vh] flex flex-col rounded-2xl bg-[#141210] border-2 border-[#C69214]/70 shadow-[0_0_50px_rgba(198,146,20,0.25)] overflow-hidden text-[#DDD5C7]">
        {/* Header */}
        <div className="border-b border-[#2C261F] p-4 bg-[#1A1612] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#2D2111] border border-[#C69214]/60 flex items-center justify-center text-xl text-amber-400">
              🔦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-[#FAF7F2]">
                  CRIME SCENE 3D FLASHLIGHT INVESTIGATOR
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                  {discoveredCount}/4 DISCOVERED
                </span>
              </div>
              <p className="text-xs text-[#A89F91] font-mono">
                {caseTitle} • Move flashlight cone across room • Click glowing hotspots
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* UV Blacklight Toggle */}
            <button
              type="button"
              onClick={() => {
                sound.playLampClick();
                setIsUvMode(!isUvMode);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                isUvMode
                  ? 'bg-purple-950 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)] ring-1 ring-purple-400'
                  : 'bg-[#221D17] hover:bg-[#2C251D] border-[#382E20] text-stone-300'
              }`}
            >
              <Eye className="w-4 h-4 text-purple-400" />
              <span>{isUvMode ? 'UV Blacklight: ON' : 'UV Blacklight: OFF'}</span>
            </button>

            <button
              onClick={() => {
                sound.playCassetteClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-[#221D17] hover:bg-[#2F261E] border border-[#3E3427] text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas Body */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden cursor-crosshair">
          <canvas
            ref={canvasRef}
            width={700}
            height={440}
            onMouseMove={handleMouseMove}
            onClick={handleCanvasClick}
            className="w-full h-auto max-h-[55vh] object-contain select-none"
          />

          {/* Floating Instructions */}
          <div className="absolute top-3 left-3 pointer-events-none bg-black/75 px-3 py-1.5 rounded-lg border border-stone-800 text-[11px] font-mono text-stone-300 backdrop-blur-sm flex items-center gap-2">
            <Flashlight className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Move cursor to illuminate crime scene</span>
          </div>

          {/* Optical Loupe Zoom Popup on Selected Hotspot */}
          {selectedHotspot && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-[#161310]/95 border-2 border-amber-500/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center justify-between border-b border-[#2C241B] pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedHotspot.evidenceEmoji}</span>
                  <div className="text-xs font-serif font-bold text-amber-200">
                    {selectedHotspot.title}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedHotspot(null)}
                  className="text-stone-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs font-typewriter text-stone-200 leading-relaxed mb-3">
                "{selectedHotspot.forensicNote}"
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 font-bold pt-1 border-t border-[#262017]">
                <span>✓ FORENSIC CLUE RECORDED</span>
                <span>+50 XP</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#262018] p-3 bg-[#171411] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Turn on UV Blacklight to expose invisible blood splatter & secret ciphers!</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#252019] hover:bg-[#332A20] text-amber-300 font-bold"
          >
            Close Scene
          </button>
        </div>
      </div>
    </div>
  );
};
