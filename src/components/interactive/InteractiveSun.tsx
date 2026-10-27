import React from 'react';
import { InteractiveCharacter } from './InteractiveCharacter';
import { SoundMode } from '../../types';

interface InteractiveSunProps {
  soundMode?: SoundMode;
  reducedMotion?: boolean;
  isCelebrating?: boolean;
  className?: string;
}

export const InteractiveSun: React.FC<InteractiveSunProps> = ({
  soundMode = 'soft',
  reducedMotion = false,
  isCelebrating = false,
  className = ''
}) => {
  const sunQuotes = [
    "Good day, friend! You shine so bright! ☀️",
    "Keep going, you're doing wonderful!",
    "Take your time, learning is an adventure!",
    "Hehehe, that tickles! Sending warm sunny rays!",
    "You have such a kind heart, explorer!",
    "Milo and I are cheering for you!"
  ];

  return (
    <InteractiveCharacter
      id="sun-mascot"
      name="Sunny"
      avatarIcon="☀️"
      soundMode={soundMode}
      reducedMotion={reducedMotion}
      quotes={sunQuotes}
      isCelebrating={isCelebrating}
      bubblePosition="bottom"
      className={className}
    >
      {({ characterState, isBlinking, isPetted }) => {
        const isHappy = characterState === 'happy' || isCelebrating;
        const isTapped = characterState === 'tapped' || isPetted;

        return (
          <div
            className={`relative w-16 h-16 sm:w-20 sm:h-20 transition-transform ${
              reducedMotion
                ? ''
                : isHappy
                ? 'animate-bounce'
                : isTapped
                ? 'scale-110 rotate-6'
                : 'hover:scale-105'
            }`}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-md select-none overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Golden Glow */}
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="#FEF08A"
                opacity={isHappy ? 0.6 : 0.35}
                className={reducedMotion ? '' : 'animate-pulse'}
              />

              {/* Sun Rays (Waving rays on tap or happy) */}
              <g
                className={`origin-center transition-transform duration-700 ${
                  reducedMotion ? '' : isHappy ? 'animate-spin' : isTapped ? 'rotate-45' : ''
                }`}
                style={{ animationDuration: isHappy ? '8s' : undefined }}
              >
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
                  const isLongRay = i % 2 === 0;
                  return (
                    <line
                      key={deg}
                      x1="50"
                      y1="50"
                      x2={50 + Math.cos((deg * Math.PI) / 180) * (isLongRay ? 46 : 41)}
                      y2={50 + Math.sin((deg * Math.PI) / 180) * (isLongRay ? 46 : 41)}
                      stroke="#FBBF24"
                      strokeWidth={isLongRay ? 4.5 : 3.5}
                      strokeLinecap="round"
                    />
                  );
                })}
              </g>

              {/* Sun Core Disc */}
              <circle cx="50" cy="50" r="30" fill="#FACC15" stroke="#F59E0B" strokeWidth="2.5" />

              {/* Rosy Cheerful Cheeks */}
              <ellipse cx="33" cy="54" rx="4.5" ry="3" fill="#F87171" opacity="0.6" />
              <ellipse cx="67" cy="54" rx="4.5" ry="3" fill="#F87171" opacity="0.6" />

              {/* Eyes with natural blinking & happy squint */}
              {isBlinking ? (
                // Natural Blink
                <>
                  <line x1="33" y1="45" x2="41" y2="45" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="59" y1="45" x2="67" y2="45" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : isHappy || isTapped ? (
                // Joyful Curved Squint Eyes
                <>
                  <path d="M 33 46 Q 37 40 41 46" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 59 46 Q 63 40 67 46" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
                </>
              ) : (
                // Sparkly Warm Eyes
                <>
                  <circle cx="37" cy="45" r="4" fill="#78350F" />
                  <circle cx="38.5" cy="43.5" r="1.5" fill="#FFFFFF" />
                  <circle cx="63" cy="45" r="4" fill="#78350F" />
                  <circle cx="64.5" cy="43.5" r="1.5" fill="#FFFFFF" />
                </>
              )}

              {/* Cheerful Smile */}
              {isHappy || isTapped ? (
                // Open Happy Smile
                <path d="M 40 54 Q 50 66 60 54 Z" fill="#EF4444" stroke="#78350F" strokeWidth="2" />
              ) : (
                // Gentle Smiling Curve
                <path d="M 41 53 Q 50 60 59 53" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              )}
            </svg>
          </div>
        );
      }}
    </InteractiveCharacter>
  );
};
