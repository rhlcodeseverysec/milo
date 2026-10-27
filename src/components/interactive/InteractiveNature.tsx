import React, { useState } from 'react';
import { playGentleSound } from '../../utils/audio';
import { SoundMode } from '../../types';

interface ButterflyProps {
  soundMode?: SoundMode;
  reducedMotion?: boolean;
  color?: string;
  className?: string;
}

export const InteractiveButterfly: React.FC<ButterflyProps> = ({
  soundMode = 'soft',
  reducedMotion = false,
  color = '#EC4899',
  className = ''
}) => {
  const [isFlutteringFast, setIsFlutteringFast] = useState(false);
  const [quote, setQuote] = useState<string | null>(null);
  const currentSoundMode: 'off' | 'soft' | 'normal' = (soundMode as 'off' | 'soft' | 'normal') || 'soft';

  const handleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlutteringFast(true);
    playGentleSound('sparkle', currentSoundMode);
    setQuote("Flutter flutter! ✨");

    setTimeout(() => {
      setIsFlutteringFast(false);
    }, 1200);

    setTimeout(() => {
      setQuote(null);
    }, 2500);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Interactive Butterfly. Tap to flutter."
      onClick={handleTap}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTap(e as unknown as React.MouseEvent);
        }
      }}
      className={`relative inline-block cursor-pointer select-none transition-transform active:scale-90 ${className}`}
    >
      {quote && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#18262C] border border-[#37464F] text-[#F472B6] text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg pointer-events-none animate-bounce">
          {quote}
        </div>
      )}

      <svg
        viewBox="0 0 40 40"
        className={`w-8 h-8 sm:w-10 sm:h-10 drop-shadow transition-transform ${
          reducedMotion ? '' : isFlutteringFast ? 'rotate-12 scale-125' : 'hover:scale-110'
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Wings */}
        <ellipse
          cx="14"
          cy="15"
          rx="10"
          ry="7"
          fill={color}
          opacity="0.9"
          transform="rotate(-20 14 15)"
          className={reducedMotion ? '' : isFlutteringFast ? 'animate-pulse' : ''}
        />
        <ellipse
          cx="15"
          cy="26"
          rx="7"
          ry="5"
          fill="#F472B6"
          opacity="0.85"
          transform="rotate(10 15 26)"
        />

        {/* Right Wings */}
        <ellipse
          cx="26"
          cy="15"
          rx="10"
          ry="7"
          fill={color}
          opacity="0.9"
          transform="rotate(20 26 15)"
          className={reducedMotion ? '' : isFlutteringFast ? 'animate-pulse' : ''}
        />
        <ellipse
          cx="25"
          cy="26"
          rx="7"
          ry="5"
          fill="#F472B6"
          opacity="0.85"
          transform="rotate(-10 25 26)"
        />

        {/* Wing Sparkle Dots */}
        <circle cx="13" cy="14" r="2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="27" cy="14" r="2" fill="#FFFFFF" opacity="0.8" />

        {/* Body & Antennae */}
        <ellipse cx="20" cy="20" rx="2" ry="9" fill="#1E293B" />
        <path d="M 19 12 Q 16 6 13 8" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 21 12 Q 24 6 27 8" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
};

interface FlowerProps {
  soundMode?: SoundMode;
  reducedMotion?: boolean;
  petalColor?: string;
  className?: string;
}

export const InteractiveFlower: React.FC<FlowerProps> = ({
  soundMode = 'soft',
  reducedMotion = false,
  petalColor = '#F59E0B',
  className = ''
}) => {
  const [isBlooming, setIsBlooming] = useState(false);
  const [quote, setQuote] = useState<string | null>(null);
  const currentSoundMode: 'off' | 'soft' | 'normal' = (soundMode as 'off' | 'soft' | 'normal') || 'soft';

  const handleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBlooming(true);
    playGentleSound('sparkle', currentSoundMode);
    setQuote("Bloom! 🌸");

    setTimeout(() => setIsBlooming(false), 1000);
    setTimeout(() => setQuote(null), 2200);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Interactive Spring Flower. Tap to bloom."
      onClick={handleTap}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTap(e as unknown as React.MouseEvent);
        }
      }}
      className={`relative inline-block cursor-pointer select-none transition-transform active:scale-95 ${className}`}
    >
      {quote && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#18262C] border border-[#37464F] text-[#34D399] text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg pointer-events-none animate-bounce">
          {quote}
        </div>
      )}

      <svg
        viewBox="0 0 50 60"
        className={`w-9 h-11 sm:w-11 sm:h-14 drop-shadow transition-transform ${
          reducedMotion ? '' : isBlooming ? 'scale-125 rotate-6' : 'hover:rotate-3'
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stem & Leaves */}
        <path d="M 25 25 Q 23 42 25 58" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" fill="none" />
        <ellipse cx="19" cy="42" rx="6" ry="3" fill="#22C55E" transform="rotate(-30 19 42)" />
        <ellipse cx="31" cy="48" rx="6" ry="3" fill="#22C55E" transform="rotate(30 31 48)" />

        {/* 5 Petals around center */}
        {[0, 72, 144, 216, 288].map((deg) => (
          <circle
            key={deg}
            cx={25 + Math.cos((deg * Math.PI) / 180) * (isBlooming ? 11 : 9)}
            cy={22 + Math.sin((deg * Math.PI) / 180) * (isBlooming ? 11 : 9)}
            r={isBlooming ? 6.5 : 5.5}
            fill={petalColor}
            stroke="#D97706"
            strokeWidth="1"
          />
        ))}

        {/* Center Disc with Smile */}
        <circle cx="25" cy="22" r="6" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.2" />
        <circle cx="23" cy="21" r="0.8" fill="#78350F" />
        <circle cx="27" cy="21" r="0.8" fill="#78350F" />
        <path d="M 23 23 Q 25 25 27 23" stroke="#78350F" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
};

interface StarProps {
  soundMode?: SoundMode;
  reducedMotion?: boolean;
  className?: string;
}

export const InteractiveStar: React.FC<StarProps> = ({
  soundMode = 'soft',
  reducedMotion = false,
  className = ''
}) => {
  const [isTwinkling, setIsTwinkling] = useState(false);
  const [quote, setQuote] = useState<string | null>(null);
  const currentSoundMode: 'off' | 'soft' | 'normal' = (soundMode as 'off' | 'soft' | 'normal') || 'soft';

  const handleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTwinkling(true);
    playGentleSound('gem', currentSoundMode);
    setQuote("Twinkle! ⭐");

    setTimeout(() => setIsTwinkling(false), 900);
    setTimeout(() => setQuote(null), 2200);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Twinkling Star. Tap to twinkle."
      onClick={handleTap}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTap(e as unknown as React.MouseEvent);
        }
      }}
      className={`relative inline-block cursor-pointer select-none transition-transform active:scale-90 ${className}`}
    >
      {quote && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#18262C] border border-[#37464F] text-[#FBBF24] text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg pointer-events-none animate-bounce">
          {quote}
        </div>
      )}

      <svg
        viewBox="0 0 40 40"
        className={`w-7 h-7 sm:w-8 sm:h-8 drop-shadow transition-transform ${
          reducedMotion ? '' : isTwinkling ? 'rotate-45 scale-125' : 'hover:scale-110'
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="20,4 24,14 35,16 27,23 29,34 20,28 11,34 13,23 5,16 16,14"
          fill="#FACC15"
          stroke="#EAB308"
          strokeWidth="1.5"
        />
        {/* Star Eyes & Smile */}
        <circle cx="17" cy="19" r="1.2" fill="#78350F" />
        <circle cx="23" cy="19" r="1.2" fill="#78350F" />
        <path d="M 17 22 Q 20 24 23 22" stroke="#78350F" strokeWidth="1" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
};
