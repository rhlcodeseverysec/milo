import React from 'react';
import { InteractiveCharacter } from './InteractiveCharacter';
import { SoundMode } from '../../types';

interface InteractiveCloudProps {
  id?: string;
  name?: string;
  soundMode?: SoundMode;
  reducedMotion?: boolean;
  className?: string;
  bubblePosition?: 'top' | 'bottom' | 'left' | 'right';
  draggable?: boolean;
}

export const InteractiveCloud: React.FC<InteractiveCloudProps> = ({
  id = 'cloud-mascot',
  name = 'Fluffy Cloud',
  soundMode = 'soft',
  reducedMotion = false,
  className = '',
  bubblePosition = 'top',
  draggable = true
}) => {
  const cloudQuotes = [
    "Drifting peacefully across the blue sky~ ☁️",
    "Soft as cotton candy! Wheee!",
    "You can drag me a little bit and watch me float back!",
    "Looking down at our brave little explorers!",
    "Take a gentle, slow breath with me... like a cloud.",
    "Breeze tickles! Hehehe~"
  ];

  return (
    <InteractiveCharacter
      id={id}
      name={name}
      avatarIcon="☁️"
      soundMode={soundMode}
      reducedMotion={reducedMotion}
      quotes={cloudQuotes}
      draggable={draggable}
      bubblePosition={bubblePosition}
      className={className}
    >
      {({ characterState, isBlinking, isPetted, dragOffset }) => {
        const isDragging = characterState === 'dragging';
        const isTapped = characterState === 'tapped' || isPetted;

        return (
          <div
            className={`relative w-20 h-12 sm:w-24 sm:h-14 transition-transform ${
              reducedMotion
                ? ''
                : isDragging
                ? 'scale-105 rotate-3 opacity-90'
                : isTapped
                ? 'scale-110 -rotate-3'
                : 'hover:scale-105'
            }`}
          >
            <svg
              viewBox="0 0 100 60"
              className="w-full h-full drop-shadow-md select-none overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Cloud Puffs */}
              <g fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2">
                <circle cx="28" cy="38" r="16" />
                <circle cx="48" cy="24" r="18" />
                <circle cx="70" cy="34" r="16" />
                <circle cx="42" cy="42" r="14" />
                <circle cx="60" cy="42" r="14" />
                {/* Cloud body core fill without strokes to remove internal lines */}
                <path
                  d="M 28 38 L 70 34 L 60 46 L 28 46 Z"
                  fill="#F8FAFC"
                  stroke="none"
                />
              </g>

              {/* Gentle Rosy Cheeks */}
              <ellipse cx="38" cy="36" rx="3.5" ry="2" fill="#FDA4AF" opacity="0.6" />
              <ellipse cx="62" cy="36" rx="3.5" ry="2" fill="#FDA4AF" opacity="0.6" />

              {/* Eyes */}
              {isBlinking ? (
                <>
                  <line x1="38" y1="30" x2="44" y2="30" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                  <line x1="56" y1="30" x2="62" y2="30" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                </>
              ) : isTapped || isDragging ? (
                // Happy Winking / Playful Squint Face
                <>
                  <path d="M 38 31 Q 41 27 44 31" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                  <circle cx="59" cy="29" r="2.5" fill="#475569" />
                  <circle cx="60" cy="28" r="0.8" fill="#FFFFFF" />
                </>
              ) : (
                // Peaceful big friendly eyes
                <>
                  <circle cx="41" cy="30" r="2.8" fill="#475569" />
                  <circle cx="42" cy="29" r="1" fill="#FFFFFF" />
                  <circle cx="59" cy="30" r="2.8" fill="#475569" />
                  <circle cx="60" cy="29" r="1" fill="#FFFFFF" />
                </>
              )}

              {/* Sweet Mouth */}
              {isTapped || isDragging ? (
                <path d="M 47 36 Q 50 42 53 36 Z" fill="#F43F5E" stroke="#475569" strokeWidth="1.5" />
              ) : (
                <path d="M 47 35 Q 50 39 53 35" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              )}
            </svg>
          </div>
        );
      }}
    </InteractiveCharacter>
  );
};
