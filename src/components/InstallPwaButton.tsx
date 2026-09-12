import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';
import { sound } from '../audio/soundEffects';

export const InstallPwaButton: React.FC = () => {
  // Store the install prompt event
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    sound.playTypewriter();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        sound.playVictory();
      }
      setDeferredPrompt(null);
    } else {
      // iOS / manual tip
      alert('To install Sleuth on your home screen:\n\n• On iPhone (Safari): Tap Share (square with arrow) → "Add to Home Screen".\n• On Android (Chrome): Tap three dots menu → "Install app".');
    }
  };

  if (isInstalled) return null;

  return (
    <button
      type="button"
      onClick={handleInstallClick}
      title="Install Sleuth as a Home Screen App"
      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#221F1C] border border-[#3A352F] hover:border-amber-400 hover:bg-[#2B2620] text-[#DDD5C7] text-xs font-mono transition-colors"
    >
      <Smartphone className="w-3.5 h-3.5 text-amber-400" />
      <span>Install App</span>
    </button>
  );
};
