import React, { useState } from 'react';
import type { Case, DeductionState, Suspect } from '../types/game';
import { X, Download, Copy, Check } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface NewspaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: Case;
  state: DeductionState;
  rank: string;
  totalWins: number;
  isScandal?: boolean;
  accusedSuspect?: Suspect;
}

export const NewspaperModal: React.FC<NewspaperModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  state,
  rank,
  totalWins,
  isScandal = false,
  accusedSuspect,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  if (!isOpen) return null;

  const culprit =
    accusedSuspect ||
    currentCase.suspects.find((s) => s.id === currentCase.solution.culpritId) ||
    currentCase.suspects[0];
  const weapon =
    currentCase.weapons.find((w) => w.id === currentCase.solution.weaponId) ||
    currentCase.weapons[0];
  const location =
    currentCase.locations.find((l) => l.id === currentCase.solution.locationId) ||
    currentCase.locations[0];

  const elapsedSeconds = state.solvedTime
    ? Math.floor((state.solvedTime - state.startTime) / 1000)
    : 145;
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds}s`;

  // Download High-Resolution Vintage PNG Clipping via HTML5 Canvas
  const handleDownloadNewspaper = async () => {
    sound.playTypewriter();
    setIsGeneratingImg(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1400;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGeneratingImg(false);
      return;
    }

    // 1. Aged Vintage Newsprint Background
    ctx.fillStyle = '#F4EBD9';
    ctx.fillRect(0, 0, 1200, 1400);

    // Vignette / aged paper edge shadows
    const vignette = ctx.createRadialGradient(600, 700, 400, 600, 700, 850);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(120, 80, 40, 0.35)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, 1200, 1400);

    // 2. Double border rules
    ctx.strokeStyle = '#26211C';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 1340);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, 1128, 1328);

    // 3. Masthead Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1A1714';
    ctx.font = 'bold 22px serif';
    ctx.fillText('SPECIAL CRIME EDITION • SCOTLAND YARD DISPATCH', 600, 75);

    // Dividing rule
    ctx.beginPath();
    ctx.moveTo(50, 90);
    ctx.lineTo(1150, 90);
    ctx.stroke();

    // Giant Title Masthead
    ctx.font = '900 84px "Playfair Display", "Times New Roman", serif';
    ctx.fillText('THE DAILY CHRONICLE', 600, 175);

    // Sub-banner info
    ctx.font = 'italic 18px "Times New Roman", serif';
    ctx.fillText(
      `LONDON, ${currentCase.date.toUpperCase()} • NO. 18,942 • PRICE ONE PENNY • VERIFIED SOLVED`,
      600,
      210
    );

    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, 225);
    ctx.lineTo(1150, 225);
    ctx.stroke();

    // 4. Screaming Headline
    ctx.fillStyle = isScandal ? '#991B1B' : '#1A1714';
    ctx.font = '900 46px "Times New Roman", serif';
    const mainHeadline = isScandal
      ? 'SCOTLAND YARD SCANDAL: INNOCENT JAILED!'
      : `MURDER AT ${location.name.toUpperCase()} SOLVED!`;
    ctx.fillText(mainHeadline, 600, 285);

    ctx.fillStyle = '#4A4035';
    ctx.font = 'italic bold 24px "Times New Roman", serif';
    const subHeadline = isScandal
      ? 'True Culprit Escapes Down Thames as Mistrial is Declared'
      : `Master Sleuth Apprehends ${culprit.name} with Irrefutable Logic`;
    ctx.fillText(subHeadline, 600, 325);

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 345);
    ctx.lineTo(1150, 345);
    ctx.stroke();

    // 5. Suspect Mugshot with Prison Bars
    const imgX = 80;
    const imgY = 380;
    const imgW = 340;
    const imgH = 420;

    ctx.fillStyle = '#26211C';
    ctx.fillRect(imgX - 6, imgY - 6, imgW + 12, imgH + 12);
    ctx.fillStyle = '#E8DFCE';
    ctx.fillRect(imgX, imgY, imgW, imgH);

    // If suspect portrait image exists, draw it; else emoji fallback
    if (culprit.portraitUrl) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          img.src = culprit.portraitUrl!;
        });
        ctx.drawImage(img, imgX, imgY, imgW, imgH);
      } catch {}
    }

    // Heavy Iron Prison Bars over mugshot
    ctx.strokeStyle = '#1F1B17';
    ctx.lineWidth = 8;
    for (let bx = imgX + 45; bx < imgX + imgW; bx += 55) {
      ctx.beginPath();
      ctx.moveTo(bx, imgY);
      ctx.lineTo(bx, imgY + imgH);
      ctx.stroke();
    }

    // "CONVICTED" Red Stamp over mugshot
    ctx.save();
    ctx.translate(imgX + imgW / 2, imgY + imgH / 2);
    ctx.rotate(-0.18);
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 5;
    ctx.strokeRect(-140, -35, 280, 70);
    ctx.fillStyle = '#DC2626';
    ctx.font = '900 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isScandal ? 'WRONGLY JAILED' : 'CONVICTED', 0, 10);
    ctx.restore();

    // Caption under photo
    ctx.fillStyle = '#26211C';
    ctx.font = 'bold 16px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${culprit.name} ("${culprit.alias}") in Newgate Gaol`, imgX + imgW / 2, imgY + imgH + 30);

    // 6. News Story Column Text
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1A1714';
    ctx.font = '19px/30px "Times New Roman", serif';
    const textX = 460;
    let textY = 410;
    const lineHeight = 32;

    const storyParagraphs = [
      `LONDON — In an extraordinary display of deduction, Scotland Yard has officially`,
      `closed Incident File #${currentCase.caseNumber}. The deceased, ${currentCase.victim.name}, was`,
      `discovered inside ${location.name}, having met a foul end via ${weapon.name}.`,
      ``,
      `Suspicions initially fell upon several society figures, but through the rigorous`,
      `application of contradiction analysis, the truth was laid bare before the magistrate.`,
      `${culprit.name} broke under relentless interrogation, signing a full confession`,
      `as the iron handcuffs were ratcheted shut.`,
      ``,
      `"The logic was airtight," noted Chief Inspector Vance. "The Sleuth examined every`,
      `fingerprint ridge, chemical toxin, and alibi with mathematical precision."`,
    ];

    storyParagraphs.forEach((line) => {
      ctx.fillText(line, textX, textY);
      textY += lineHeight;
    });

    // 7. Detective Score Box
    ctx.fillStyle = '#E8DCBF';
    ctx.fillRect(460, 810, 680, 220);
    ctx.strokeStyle = '#6E5D46';
    ctx.lineWidth = 2;
    ctx.strokeRect(460, 810, 680, 220);

    ctx.fillStyle = '#1F1B17';
    ctx.font = 'bold 22px "Times New Roman", serif';
    ctx.fillText('OFFICIAL SCOTLAND YARD COMMENDATION', 490, 850);

    ctx.font = '18px monospace';
    ctx.fillText(`• Investigator Rank: ${rank}`, 490, 895);
    ctx.fillText(`• Time Elapsed:      ${timeFormatted}`, 490, 930);
    ctx.fillText(`• Total Cases Cleared: ${totalWins} Cases`, 490, 965);
    ctx.fillText(`• Verified Platform:  sleuth-mystery.vercel.app`, 490, 1000);

    // 8. Footer Masthead
    ctx.beginPath();
    ctx.moveTo(50, 1310);
    ctx.lineTo(1150, 1310);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'italic 16px "Times New Roman", serif';
    ctx.fillText('Printed on the Steam Press of Scotland Yard Gazette • Play free at sleuth-mystery.vercel.app', 600, 1335);

    // Export Canvas to PNG Download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Sleuth-Newspaper-Case-${currentCase.caseNumber}.png`;
    a.click();
    setIsGeneratingImg(false);
  };

  const handleCopyHeadline = () => {
    sound.playTypewriter();
    const shareText = `📰 THE DAILY CHRONICLE (1890): Murder at ${location.name} Solved!
Chief Sleuth apprehended ${culprit.name} in ${timeFormatted} using pure logic.
Can you solve the case? Play free in browser:
https://sleuth-mystery.vercel.app`;

    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#F6EFE2] text-[#1E1B18] p-5 sm:p-7 shadow-2xl border-4 border-[#3D3428] my-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playTypewriter();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#E2D4BC] hover:bg-[#D4C3A3] text-[#2A2318] transition-colors"
          title="Close Newspaper"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1890s Masthead */}
        <div className="text-center border-b-2 border-[#26211C] pb-2 mb-3">
          <div className="text-[11px] font-serif uppercase tracking-widest text-[#6E5D46] font-bold">
            ★ SPECIAL CRIME EDITION • SCOTLAND YARD DISPATCH ★
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-[#171411] my-1">
            THE DAILY CHRONICLE
          </h1>
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-serif italic text-[#55493A] border-t border-[#8C7A62] pt-1">
            <span>LONDON, {currentCase.date.toUpperCase()}</span>
            <span>NO. 18,942 • PRICE ONE PENNY</span>
            <span>VERIFIED SOLVED</span>
          </div>
        </div>

        {/* Screaming Headline */}
        <div className="text-center my-3 border-b-2 border-[#26211C] pb-3">
          <h2
            className={`text-2xl sm:text-3xl font-black font-serif tracking-tight leading-tight ${
              isScandal ? 'text-red-800' : 'text-[#1A1714]'
            }`}
          >
            {isScandal
              ? 'SCOTLAND YARD SCANDAL: INNOCENT JAILED!'
              : `MURDER AT ${location.name.toUpperCase()} SOLVED!`}
          </h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#635340] mt-1 font-semibold">
            {isScandal
              ? 'True Culprit Escapes Down the River Thames as Mistrial is Declared'
              : `Master Sleuth Apprehends ${culprit.name} with Irrefutable Deduction`}
          </p>
        </div>

        {/* Layout: Culprit Behind Bars & Newsprint Article */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start my-4">
          {/* Mugshot Behind Bars */}
          <div className="sm:col-span-5 flex flex-col items-center">
            <div className="relative w-44 h-52 bg-[#E2D5BE] p-1 border-2 border-[#26211C] shadow-md overflow-hidden">
              {culprit.portraitUrl ? (
                <img
                  src={culprit.portraitUrl}
                  alt={culprit.name}
                  className="w-full h-full object-cover object-top filter contrast-110 sepia-[0.25]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">
                  {culprit.avatarEmoji}
                </div>
              )}

              {/* Iron Prison Bars Overlay */}
              <div className="absolute inset-0 pointer-events-none flex justify-around">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-full bg-gradient-to-r from-stone-900 via-stone-700 to-stone-900 shadow-md"
                  />
                ))}
              </div>

              {/* Red Convicted Stamp */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-4 border-red-700 text-red-700 font-stamp text-lg font-black uppercase px-2 py-0.5 rounded transform -rotate-12 bg-white/40 shadow-lg">
                  {isScandal ? 'WRONGLY JAILED' : 'CONVICTED'}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-serif text-center text-[#55493A] mt-1 font-bold">
              {culprit.name} in Newgate Gaol
            </span>
          </div>

          {/* Newsprint Story Body */}
          <div className="sm:col-span-7 text-xs font-serif leading-relaxed text-[#2D2620] space-y-2">
            <p>
              <span className="text-3xl font-serif font-black float-left mr-1 leading-none">
                L
              </span>
              ONDON — In an extraordinary feat of Victorian deduction, Scotland Yard has
              officially cleared <strong>Incident File #{currentCase.caseNumber}</strong>. The
              deceased, <em>{currentCase.victim.name}</em>, was found dead at{' '}
              {location.name} by foul use of {weapon.name}.
            </p>
            <p>
              Suspicions fell upon several society figures, but the Chief Sleuth untangled the web
              of alibis, chemical reagents, and fingerprint whorls to expose{' '}
              <strong>{culprit.name}</strong> as the true perpetrator.
            </p>
            <div className="bg-[#EADDC2] p-2.5 rounded border border-[#8C7A62] text-[11px] font-mono mt-2 space-y-0.5">
              <div className="font-bold font-serif text-[#1F1B17] text-xs">
                ★ Case Clearance Record:
              </div>
              <div>• Time to Solve: {timeFormatted}</div>
              <div>• Sleuth Rank: {rank}</div>
              <div>• Verdict: Accepted by Royal Magistrate</div>
            </div>
          </div>
        </div>

        {/* Action Buttons: 1-Click PNG Download & Clipboard Copy */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-4 border-t-2 border-[#26211C]">
          <button
            onClick={handleDownloadNewspaper}
            disabled={isGeneratingImg}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#26211C] hover:bg-[#3D342B] text-[#F6EFE2] font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{isGeneratingImg ? 'Printing Newspaper...' : 'Download Newspaper Clipping (.PNG)'}</span>
          </button>

          <button
            onClick={handleCopyHeadline}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#D8C7A8] hover:bg-[#C8B594] text-[#1E1B18] font-mono font-bold text-xs flex items-center justify-center gap-2 border border-[#8C7A62] transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Headline Copied!' : 'Copy News Headline'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
