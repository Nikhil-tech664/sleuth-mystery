import React, { useState } from 'react';
import { X, Mail, Bell, ShieldCheck, Send } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface DispatchSubscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DispatchSubscriberModal: React.FC<DispatchSubscriberModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(
    localStorage.getItem('sleuth_email_subscribed') === 'true'
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  if (!isOpen) return null;

  const handleSubscribeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      sound.playError();
      return;
    }
    sound.playStamp();
    localStorage.setItem('sleuth_email_subscribed', 'true');
    localStorage.setItem('sleuth_saved_email', email);
    setIsSubscribed(true);
  };

  const handleToggleNotifications = async () => {
    sound.playTypewriter();
    if (!('Notification' in window)) {
      alert('Browser notifications are not supported on this device.');
      return;
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
      new Notification('🕵️‍♂️ Sleuth Precinct Headquarters', {
        body: 'Case notifications activated! You will receive an alert at midnight when new homicide files arrive.',
        icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🕵️‍♂️</text></svg>',
      });
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        sound.playVictory();
        setNotificationsEnabled(true);
        new Notification('🕵️‍♂️ Sleuth Precinct Headquarters', {
          body: 'Badge verified! Morning case dispatches are now active.',
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border-2 border-[#C69214]/60 bg-[#161412] p-6 shadow-2xl text-center overflow-hidden">
        <button
          type="button"
          onClick={() => {
            sound.playTypewriter();
            onClose();
          }}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[#25221E] text-[#8C8478] hover:text-[#FAF6F0] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-[#241E15] border border-[#C69214]/40 flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-inner">
          <Mail className="w-7 h-7" />
        </div>

        <span className="text-[10px] font-mono text-[#C69214] font-bold uppercase tracking-widest">
          PRECINCT TELEGRAPH SUBSCRIPTION
        </span>
        <h3 className="text-xl font-bold font-serif text-[#FAF6F0] mt-1 mb-2">
          Never Miss a Crime Scene
        </h3>
        <p className="text-xs text-[#AAA194] leading-relaxed font-sans mb-5">
          Join 25,000+ detectives receiving today's mystery wire directly in their inbox every morning at 8:00 AM.
        </p>

        {/* Email Form */}
        {isSubscribed ? (
          <div className="bg-emerald-950/70 border border-emerald-500/50 rounded-xl p-4 mb-4 text-xs font-mono text-emerald-300 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Active Dispatch Subscription Confirmed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribeEmail} className="space-y-2 mb-4">
            <div className="relative">
              <input
                type="email"
                placeholder="inspector@scotlandyard.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#11100E] border border-[#332E28] rounded-xl px-4 py-2.5 text-xs font-mono text-[#FAF7F2] placeholder-[#5C5549] focus:outline-none focus:border-[#C69214]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Deliver Morning Dispatch</span>
            </button>
          </form>
        )}

        {/* Browser Push Alert Switch */}
        <div className="bg-[#1C1A17] border border-[#2D2822] rounded-xl p-3 text-left flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className={`w-4 h-4 ${notificationsEnabled ? 'text-amber-400' : 'text-[#777]'}`} />
            <div>
              <div className="text-xs font-bold text-[#FAF6F0] font-sans">
                Midnight Case Alerts
              </div>
              <div className="text-[10px] font-mono text-[#8C8478]">
                Get notified the second the new mystery drops
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleNotifications}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              notificationsEnabled
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/50'
                : 'bg-[#292218] text-[#D8CFBF] border border-[#3D3322] hover:border-amber-400'
            }`}
          >
            {notificationsEnabled ? '✓ Enabled' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
};
