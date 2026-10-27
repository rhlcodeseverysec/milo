import React from 'react';
import { InteractiveCharacter } from './InteractiveCharacter';
import { SoundMode } from '../../types';

export type CompanionType = 'bear' | 'bunny' | 'cat';

interface AnimalCompanionProps {
  type?: CompanionType;
  soundMode?: SoundMode;
  reducedMotion?: boolean;
  hint?: string;
  isCelebrating?: boolean;
  bubblePosition?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const AnimalCompanion: React.FC<AnimalCompanionProps> = ({
  type = 'bear',
  soundMode = 'soft',
  reducedMotion = false,
  hint,
  isCelebrating = false,
  bubblePosition = 'top',
  className = ''
}) => {
  const companionConfig = {
    bear: {
      name: 'Barnaby Bear',
      avatarIcon: '🐻',
      quotes: [
        "Let's try this together, one step at a time! 🐾",
        "Take a slow breath. You are doing so well!",
        "I brought some warm honey for our quest!",
        "Mistakes are just how our brain grows stronger.",
        "Milo and I believe in you, friend!"
      ]
    },
    bunny: {
      name: 'Pip Bunny',
      avatarIcon: '🐰',
      quotes: [
        "Hop hop! You are doing super great! 🥕",
        "Need a little hint? I'm right here with you!",
        "Every small step counts towards the goal!",
        "Wiggle your toes and shake out your shoulders!",
        "You're a super puzzle solver!"
      ]
    },
    cat: {
      name: 'Cleo Cat',
      avatarIcon: '🐱',
      quotes: [
        "Purrrr... We can take a cozy little break if you want. 🧶",
        "It is always okay to take things at your own quiet pace.",
        "You are so thoughtful and patient!",
        "Soft paws and gentle thinking.",
        "Look how much you have learned today!"
      ]
    }
  }[type];

  return (
    <InteractiveCharacter
      id={`companion-${type}`}
      name={companionConfig.name}
      avatarIcon={companionConfig.avatarIcon}
      soundMode={soundMode}
      reducedMotion={reducedMotion}
      quotes={companionConfig.quotes}
      hint={hint}
      isCelebrating={isCelebrating}
      bubblePosition={bubblePosition}
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
                ? 'scale-110 -rotate-3'
                : 'hover:scale-105'
            }`}
          >
            {type === 'bear' && (
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible select-none">
                {/* Bear Ears */}
                <circle cx="28" cy="28" r="14" fill="#854D0E" stroke="#713F12" strokeWidth="2" />
                <circle cx="28" cy="28" r="7" fill="#FDE047" opacity="0.7" />
                <circle cx="72" cy="28" r="14" fill="#854D0E" stroke="#713F12" strokeWidth="2" />
                <circle cx="72" cy="28" r="7" fill="#FDE047" opacity="0.7" />

                {/* Bear Head */}
                <ellipse cx="50" cy="56" rx="36" ry="32" fill="#854D0E" stroke="#713F12" strokeWidth="2" />

                {/* Bear Muzzle */}
                <ellipse cx="50" cy="66" rx="19" ry="15" fill="#FEF08A" />

                {/* Cheerful Cheeks */}
                <ellipse cx="28" cy="62" rx="5" ry="3" fill="#F87171" opacity="0.5" />
                <ellipse cx="72" cy="62" rx="5" ry="3" fill="#F87171" opacity="0.5" />

                {/* Eyes */}
                {isBlinking ? (
                  <>
                    <line x1="33" y1="50" x2="41" y2="50" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="59" y1="50" x2="67" y2="50" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                ) : isHappy || isTapped ? (
                  <>
                    <path d="M 33 52 Q 37 46 41 52" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M 59 52 Q 63 46 67 52" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  <>
                    <circle cx="37" cy="50" r="4" fill="#1F2937" />
                    <circle cx="38.5" cy="48.5" r="1.3" fill="#FFFFFF" />
                    <circle cx="63" cy="50" r="4" fill="#1F2937" />
                    <circle cx="64.5" cy="48.5" r="1.3" fill="#FFFFFF" />
                  </>
                )}

                {/* Bear Nose & Smile */}
                <polygon points="45,61 55,61 50,67" fill="#1F2937" />
                <path d="M 46 70 Q 50 74 54 70" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" fill="none" />

                {/* Friendly Paw Wave */}
                {isHappy || isTapped ? (
                  <ellipse cx="84" cy="42" rx="8" ry="10" fill="#854D0E" stroke="#713F12" strokeWidth="1.5" transform="rotate(25 84 42)" />
                ) : null}
              </svg>
            )}

            {type === 'bunny' && (
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible select-none">
                {/* Bunny Long Ears */}
                <ellipse cx="36" cy="22" rx="9" ry="22" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" transform="rotate(-10 36 22)" />
                <ellipse cx="36" cy="22" rx="4.5" ry="15" fill="#F472B6" opacity="0.45" transform="rotate(-10 36 22)" />

                <ellipse cx="64" cy="22" rx="9" ry="22" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" transform="rotate(10 64 22)" />
                <ellipse cx="64" cy="22" rx="4.5" ry="15" fill="#F472B6" opacity="0.45" transform="rotate(10 64 22)" />

                {/* Bunny Head */}
                <ellipse cx="50" cy="62" rx="32" ry="28" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />

                {/* Pink Cheeks */}
                <ellipse cx="28" cy="68" rx="6" ry="3.5" fill="#FDA4AF" opacity="0.7" />
                <ellipse cx="72" cy="68" rx="6" ry="3.5" fill="#FDA4AF" opacity="0.7" />

                {/* Eyes */}
                {isBlinking ? (
                  <>
                    <line x1="34" y1="58" x2="42" y2="58" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="58" y1="58" x2="66" y2="58" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                ) : isHappy || isTapped ? (
                  <>
                    <path d="M 34 60 Q 38 54 42 60" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M 58 60 Q 62 54 66 60" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  <>
                    <circle cx="38" cy="58" r="4.2" fill="#1E293B" />
                    <circle cx="39.5" cy="56.5" r="1.5" fill="#FFFFFF" />
                    <circle cx="62" cy="58" r="4.2" fill="#1E293B" />
                    <circle cx="63.5" cy="56.5" r="1.5" fill="#FFFFFF" />
                  </>
                )}

                {/* Bunny Nose & Whiskers */}
                <polygon points="46,67 54,67 50,71" fill="#F472B6" />
                <path d="M 46 73 Q 50 76 54 73" stroke="#1E293B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                {/* Whiskers */}
                <line x1="22" y1="67" x2="32" y2="69" stroke="#94A3B8" strokeWidth="1.2" />
                <line x1="22" y1="73" x2="32" y2="72" stroke="#94A3B8" strokeWidth="1.2" />
                <line x1="68" y1="69" x2="78" y2="67" stroke="#94A3B8" strokeWidth="1.2" />
                <line x1="68" y1="72" x2="78" y2="73" stroke="#94A3B8" strokeWidth="1.2" />
              </svg>
            )}

            {type === 'cat' && (
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible select-none">
                {/* Cat Ears */}
                <polygon points="20,44 32,18 46,38" fill="#FDBA74" stroke="#EA580C" strokeWidth="1.8" />
                <polygon points="26,38 33,24 40,36" fill="#FDA4AF" opacity="0.6" />

                <polygon points="80,44 68,18 54,38" fill="#FDBA74" stroke="#EA580C" strokeWidth="1.8" />
                <polygon points="74,38 67,24 60,36" fill="#FDA4AF" opacity="0.6" />

                {/* Cat Head */}
                <ellipse cx="50" cy="58" rx="34" ry="28" fill="#FFF7ED" stroke="#EA580C" strokeWidth="1.8" />

                {/* Calico Patch */}
                <path d="M 52 34 Q 78 36 80 56 Q 64 56 52 44 Z" fill="#FDBA74" />

                {/* Cheeks */}
                <ellipse cx="28" cy="65" rx="5" ry="3" fill="#FDA4AF" opacity="0.6" />
                <ellipse cx="72" cy="65" rx="5" ry="3" fill="#FDA4AF" opacity="0.6" />

                {/* Eyes */}
                {isBlinking ? (
                  <>
                    <line x1="33" y1="56" x2="41" y2="56" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="59" y1="56" x2="67" y2="56" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                ) : isHappy || isTapped ? (
                  <>
                    <path d="M 33 58 Q 37 52 41 58" stroke="#059669" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M 59 58 Q 63 52 67 58" stroke="#059669" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  <>
                    <ellipse cx="37" cy="56" rx="4" ry="5" fill="#10B981" />
                    <circle cx="37" cy="56" r="2.2" fill="#064E3B" />
                    <circle cx="38.5" cy="54" r="1.3" fill="#FFFFFF" />

                    <ellipse cx="63" cy="56" rx="4" ry="5" fill="#10B981" />
                    <circle cx="63" cy="56" r="2.2" fill="#064E3B" />
                    <circle cx="64.5" cy="54" r="1.3" fill="#FFFFFF" />
                  </>
                )}

                {/* Nose & Mouth */}
                <polygon points="47,64 53,64 50,68" fill="#F43F5E" />
                <path d="M 45 70 Q 50 73 55 70" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" fill="none" />

                {/* Collar with Purple Bell */}
                <path d="M 34 82 Q 50 87 66 82" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" fill="none" />
                <circle cx="50" cy="86" r="3.5" fill="#FACC15" />
              </svg>
            )}
          </div>
        );
      }}
    </InteractiveCharacter>
  );
};
