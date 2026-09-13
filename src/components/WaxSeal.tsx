import React from 'react';

interface WaxSealProps {
  isSolved?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WaxSeal: React.FC<WaxSealProps> = ({
  isSolved = false,
  size = 'md',
  className = '',
}) => {
  const dimensionMap = {
    sm: { px: 52 },
    md: { px: 76 },
    lg: { px: 104 },
  };

  const { px } = dimensionMap[size];
  const isEmerald = isSolved;

  return (
    <div
      className={`relative select-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] ${className}`}
      style={{ width: px, height: px }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full transform -rotate-6 transition-transform duration-300 hover:rotate-0 hover:scale-105"
      >
        <defs>
          {/* Radial light gradient for 3D curved wax puddle */}
          <radialGradient id={`waxGrad-${isEmerald ? 'green' : 'red'}`} cx="35%" cy="35%" r="65%">
            {isEmerald ? (
              <>
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="35%" stopColor="#059669" />
                <stop offset="70%" stopColor="#064E3B" />
                <stop offset="100%" stopColor="#022C22" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#F87171" />
                <stop offset="30%" stopColor="#DC2626" />
                <stop offset="70%" stopColor="#991B1B" />
                <stop offset="100%" stopColor="#450A0A" />
              </>
            )}
          </radialGradient>

          {/* Inner ring gradient for embossed impression */}
          <radialGradient id={`innerGrad-${isEmerald ? 'green' : 'red'}`} cx="40%" cy="40%" r="60%">
            {isEmerald ? (
              <>
                <stop offset="0%" stopColor="#065F46" />
                <stop offset="85%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064E3B" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#7F1D1D" />
                <stop offset="85%" stopColor="#B91C1C" />
                <stop offset="100%" stopColor="#450A0A" />
              </>
            )}
          </radialGradient>

          {/* Filter for realistic wax embossing */}
          <filter id="waxEmboss" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="1.5" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* Irregular organic melted wax rim with natural droplet bulges */}
        <path
          d="M 50,4 
             C 65,3 74,10 82,18 
             C 90,26 97,36 96,48 
             C 95,62 89,75 80,84 
             C 70,93 57,97 45,96 
             C 31,95 19,90 12,79 
             C 4,68 3,53 5,40 
             C 7,27 15,16 26,9 
             C 35,4 42,5 50,4 Z"
          fill={`url(#waxGrad-${isEmerald ? 'green' : 'red'})`}
        />

        {/* Inner melted depression ring */}
        <circle
          cx="50"
          cy="50"
          r="37"
          fill={`url(#innerGrad-${isEmerald ? 'green' : 'red'})`}
          stroke={isEmerald ? '#6EE7B7' : '#FCA5A5'}
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Dotted seal border ring */}
        <circle
          cx="50"
          cy="50"
          r="33"
          fill="none"
          stroke={isEmerald ? '#A7F3D0' : '#FECACA'}
          strokeWidth="0.8"
          strokeDasharray="2.5 1.5"
          strokeOpacity="0.6"
        />

        {/* Circular text path for seal inscription */}
        <path
          id="sealTextPath"
          d="M 50,50 m -26,0 a 26,26 0 1,1 52,0 a 26,26 0 1,1 -52,0"
          fill="none"
        />

        <text
          fontSize="5.2"
          fontFamily="serif"
          fontWeight="bold"
          letterSpacing="0.18em"
          fill={isEmerald ? '#D1FAE5' : '#FEE2E2'}
          opacity="0.85"
          filter="url(#waxEmboss)"
        >
          <textPath href="#sealTextPath" startOffset="50%" textAnchor="middle">
            {isEmerald ? '★ VERIFIED SOLVED • SCOTLAND YARD ★' : '★ SCOTLAND YARD • CONFIDENTIAL ★'}
          </textPath>
        </text>

        {/* Center Victorian Emblem */}
        {isEmerald ? (
          <g transform="translate(37, 37) scale(0.26)" filter="url(#waxEmboss)">
            <path
              d="M 50 10 L 61 34 L 88 38 L 68 57 L 73 84 L 50 71 L 27 84 L 32 57 L 12 38 L 39 34 Z"
              fill="#FDE68A"
              stroke="#D97706"
              strokeWidth="2"
            />
          </g>
        ) : (
          <g transform="translate(35, 34) scale(0.3)" filter="url(#waxEmboss)">
            <path
              d="M10,65 L20,30 L38,50 L50,15 L62,50 L80,30 L90,65 Z"
              fill="#FEE2E2"
              opacity="0.9"
            />
            <circle cx="50" cy="12" r="4" fill="#FEE2E2" />
            <circle cx="20" cy="27" r="3" fill="#FEE2E2" />
            <circle cx="80" cy="27" r="3" fill="#FEE2E2" />
            <rect x="12" y="67" width="76" height="8" rx="2" fill="#FEE2E2" opacity="0.9" />
          </g>
        )}
      </svg>
    </div>
  );
};
