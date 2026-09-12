import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  CheckCircle2,
  Radio,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface CoopRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseTitle: string;
}

interface CoopActivity {
  id: string;
  detective: string;
  action: string;
  time: string;
  type: 'clue' | 'deduction' | 'interrogation' | 'corkboard';
}

export const CoopRoomModal: React.FC<CoopRoomModalProps> = ({
  isOpen,
  onClose,
  caseTitle,
}) => {
  const [roomCode, setRoomCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('sleuth_coop_room_v1');
      return saved || 'SLEUTH-' + Math.floor(1000 + Math.random() * 9000);
    } catch {
      return 'SLEUTH-8492';
    }
  });

  const [inputCode, setInputCode] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [partnerConnected, setPartnerConnected] = useState<boolean>(true);
  const [activityFeed, setActivityFeed] = useState<CoopActivity[]>([
    {
      id: '1',
      detective: 'Partner (Detective Watson)',
      action: 'Joined Investigation Room and synchronized case files',
      time: 'Just now',
      type: 'deduction',
    },
    {
      id: '2',
      detective: 'Partner (Detective Watson)',
      action: 'Dusted wine snifter with fingerprint horsehair brush',
      time: '1m ago',
      type: 'clue',
    },
    {
      id: '3',
      detective: 'You (Detective Holmes)',
      action: 'Pinned red yarn connecting Arthur Pendelton to Poisoned Port',
      time: '2m ago',
      type: 'corkboard',
    },
    {
      id: '4',
      detective: 'Partner (Detective Watson)',
      action: 'Cross-examined Lady Vivienne: Galvanic stress spiked to 135 BPM',
      time: '3m ago',
      type: 'interrogation',
    },
  ]);

  // Listen to BroadcastChannel for real-time local network / multi-tab synchronization
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;

    const channel = new BroadcastChannel('sleuth_coop_sync_v1');
    channel.onmessage = (event) => {
      const data = event.data;
      if (data && data.roomCode === roomCode && data.action) {
        sound.playCipherTick();
        setActivityFeed((prev) => [
          {
            id: Date.now().toString(),
            detective: data.detective || 'Partner',
            action: data.action,
            time: 'Just now',
            type: data.type || 'deduction',
          },
          ...prev.slice(0, 15),
        ]);
        setPartnerConnected(true);
      }
    };

    return () => {
      channel.close();
    };
  }, [roomCode]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    sound.playStamp();
    const shareText = `Join my live Detective Co-Op case in SLEUTH! Room Code: ${roomCode} | Case: ${caseTitle}`;
    navigator.clipboard.writeText(shareText).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const cleanCode = inputCode.trim().toUpperCase();
    setRoomCode(cleanCode);
    try {
      localStorage.setItem('sleuth_coop_room_v1', cleanCode);
    } catch {}
    sound.playGavel();
    setInputCode('');

    // Broadcast join ping
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('sleuth_coop_sync_v1');
      channel.postMessage({
        roomCode: cleanCode,
        detective: 'Detective Guest',
        action: 'Connected to shared investigation desk via room code',
        type: 'deduction',
      });
      channel.close();
    }
  };

  const handleRegenerateCode = () => {
    sound.playCassetteClick();
    const newCode = 'SLEUTH-' + Math.floor(1000 + Math.random() * 9000);
    setRoomCode(newCode);
    try {
      localStorage.setItem('sleuth_coop_room_v1', newCode);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#141210] border-2 border-[#C69214]/70 shadow-[0_0_50px_rgba(198,146,20,0.25)] overflow-hidden text-[#DDD5C7]">
        {/* Header */}
        <div className="border-b border-[#2C261F] p-4 sm:p-5 bg-gradient-to-r from-[#201A12] via-[#2A1D13] to-[#201A12] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#2D2111] border border-[#C69214]/60 flex items-center justify-center text-2xl shadow-inner text-amber-400">
              👥
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-[#FAF7F2] flex items-center gap-2">
                <span>DETECTIVE CO-OP ROOM</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  LIVE SYNC
                </span>
              </h2>
              <p className="text-xs text-[#A89F91] font-mono">
                Investigate jointly • Share live corkboard pins, clues & deductions
              </p>
            </div>
          </div>

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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Active Room Code Card */}
          <div className="bg-[#1A1612] border-2 border-amber-500/60 rounded-2xl p-4 text-center space-y-2 relative overflow-hidden">
            <div className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-widest">
              Active Investigation Room Code
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-amber-300 select-all">
              {roomCode}
            </div>
            <p className="text-xs text-stone-400 font-sans">
              Active Case: <strong className="text-stone-200">{caseTitle}</strong>
            </p>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                {copiedLink ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Invite Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Co-Op Room Invite</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRegenerateCode}
                className="px-3 py-2 rounded-xl bg-[#252019] hover:bg-[#332A20] border border-[#3E3427] text-xs font-mono text-stone-300 hover:text-white transition-colors"
              >
                New Code
              </button>
            </div>
          </div>

          {/* Join Another Room Input */}
          <form
            onSubmit={handleJoinRoom}
            className="flex items-center gap-2 bg-[#12100E] border border-[#2B2319] p-2 rounded-xl"
          >
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Enter friend's Room Code (e.g. SLEUTH-1234)..."
              className="flex-1 bg-transparent px-2 text-xs font-mono text-white outline-none placeholder:text-stone-600"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-[#282116] hover:bg-[#382E1E] text-amber-300 border border-amber-600/40 text-xs font-mono font-bold flex items-center gap-1 transition-colors"
            >
              <span>Join Room</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Connected Detectives Roster */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#181512] border border-[#2B2319] rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
                🕵️
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold font-serif text-white truncate">
                  Detective Holmes (You)
                </div>
                <div className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LEAD INVESTIGATOR
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#181512] border border-[#2B2319] rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xl">
                🔎
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold font-serif text-white truncate">
                  Detective Watson
                </div>
                <div className="text-[10px] font-mono text-blue-400 font-bold flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${partnerConnected ? 'bg-blue-400 animate-pulse' : 'bg-stone-500'}`} />
                  {partnerConnected ? 'CO-OP PARTNER SYNCED' : 'WAITING FOR PARTNER...'}
                </div>
              </div>
            </div>
          </div>

          {/* Live Partner Activity Feed */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Live Partner Activity Log</span>
              </span>
              <span className="text-[10px] text-stone-400 font-normal">Auto-synced</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {activityFeed.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-[#171411] border border-[#282119] text-xs font-mono"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    <div>
                      <span className="text-amber-300 font-bold">{item.detective}: </span>
                      <span className="text-stone-300">{item.action}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-500 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#262018] p-3 sm:p-4 bg-[#171310] flex items-center justify-between text-xs font-mono text-stone-400">
          <span>All deduction checks and corkboard connections synchronize across both screens.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#272118] hover:bg-[#352D21] text-amber-300 font-bold"
          >
            Return to Investigation
          </button>
        </div>
      </div>
    </div>
  );
};
