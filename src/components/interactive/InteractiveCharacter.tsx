import React, { useState, useEffect, useRef } from 'react';
import { Volume2, X } from 'lucide-react';
import { playGentleSound, speakText } from '../../utils/audio';
import { SoundMode } from '../../types';

export type CharacterState = 'idle' | 'tapped' | 'talking' | 'happy' | 'dragging';

export interface InteractiveCharacterProps {
  id: string;
  name: string;
  avatarIcon?: string;
  soundMode?: SoundMode;
  reducedMotion?: boolean;
  className?: string;
  quotes?: string[];
  hint?: string;
  isCelebrating?: boolean;
  draggable?: boolean;
  bubblePosition?: 'top' | 'bottom' | 'left' | 'right';
  onStateChange?: (state: CharacterState) => void;
  children: (state: {
    characterState: CharacterState;
    isBlinking: boolean;
    isPetted: boolean;
    dragOffset: { x: number; y: number };
  }) => React.ReactNode;
}

export const InteractiveCharacter: React.FC<InteractiveCharacterProps> = ({
  id,
  name,
  avatarIcon,
  soundMode = 'soft',
  reducedMotion = false,
  className = '',
  quotes = ['Hello friend!', 'You are doing amazing!'],
  hint,
  isCelebrating = false,
  draggable = false,
  bubblePosition = 'top',
  onStateChange,
  children
}) => {
  const [characterState, setCharacterState] = useState<CharacterState>('idle');
  const [isBlinking, setIsBlinking] = useState(false);
  const [isPetted, setIsPetted] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [currentQuote, setCurrentQuote] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Dragging mechanics
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Natural blink loop (every 3 to 6 seconds)
  useEffect(() => {
    if (reducedMotion) return;
    const scheduleNextBlink = () => {
      const delay = 3000 + Math.random() * 3500;
      return setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          timer = scheduleNextBlink();
        }, 180);
      }, delay);
    };

    let timer = scheduleNextBlink();
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  const currentSoundMode: 'off' | 'soft' | 'normal' = (soundMode as 'off' | 'soft' | 'normal') || 'soft';

  // Celebrate on app event trigger
  useEffect(() => {
    if (isCelebrating) {
      setCharacterState('happy');
      setCurrentQuote("Hooray! We did it together! 🎉");
      playGentleSound('sparkle', currentSoundMode);
      onStateChange?.('happy');

      const timer = setTimeout(() => {
        setCharacterState('idle');
        onStateChange?.('idle');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isCelebrating, currentSoundMode, onStateChange]);

  // Show quote for 4.5 seconds then dismiss smoothly
  const triggerSpeechBubble = (text: string) => {
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    setCurrentQuote(text);
    setCharacterState('talking');
    onStateChange?.('talking');

    bubbleTimerRef.current = setTimeout(() => {
      setCurrentQuote(null);
      setCharacterState('idle');
      onStateChange?.('idle');
    }, 4500);
  };

  const handleCharacterTap = (e?: React.MouseEvent | React.TouchEvent) => {
    if (isDraggingRef.current) return;
    e?.stopPropagation();

    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    setIsPetted(true);
    setCharacterState('tapped');
    onStateChange?.('tapped');
    playGentleSound('click', currentSoundMode);

    setTimeout(() => {
      setIsPetted(false);
    }, 700);

    // Pick quotation or hint
    if (hint && nextCount % 3 === 2) {
      triggerSpeechBubble(`💡 Tip: ${hint}`);
    } else {
      const quoteIndex = (nextCount - 1) % quotes.length;
      triggerSpeechBubble(quotes[quoteIndex]);
    }
  };

  const handleReadAloud = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentQuote) return;
    setIsPlayingAudio(true);
    speakText(`${name} says: ${currentQuote}`, currentSoundMode);
    setTimeout(() => setIsPlayingAudio(false), 2000);
  };

  const handleDismissBubble = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    setCurrentQuote(null);
    setCharacterState('idle');
    onStateChange?.('idle');
  };

  // Drag Handlers (Pointer events with smooth spring-back release)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
    setCharacterState('dragging');
    onStateChange?.('dragging');
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !draggable) return;
    const maxDrag = 70; // Restrict to small playful radius
    const rawX = e.clientX - dragStartRef.current.x;
    const rawY = e.clientY - dragStartRef.current.y;
    const clampedX = Math.max(-maxDrag, Math.min(maxDrag, rawX));
    const clampedY = Math.max(-maxDrag, Math.min(maxDrag, rawY));
    setDragOffset({ x: clampedX, y: clampedY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggable) return;
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      // Spring back gracefully to origin
      setDragOffset({ x: 0, y: 0 });
      setCharacterState('idle');
      onStateChange?.('idle');
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCharacterTap();
    }
  };

  const bubblePositionClass = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3'
  }[bubblePosition];

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-label={`${name}. Tap for a friendly greeting.`}
      onClick={handleCharacterTap}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`,
        transition: isDraggingRef.current ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
      className={`relative inline-block outline-none focus-visible:ring-2 focus-visible:ring-[#58CC02] focus-visible:ring-offset-2 focus-visible:ring-offset-[#131F24] rounded-2xl select-none ${
        draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
      } ${className}`}
    >
      {/* Speech Bubble Dialog */}
      {currentQuote && (
        <div
          role="status"
          aria-live="polite"
          className={`absolute ${bubblePositionClass} z-30 min-w-[160px] max-w-[240px] sm:max-w-[280px] bg-[#18262C] border-2 border-[#37464F] text-white rounded-2xl p-3 shadow-2xl animate-fade-in pointer-events-auto`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header with speaker button and dismiss cross */}
          <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-[#28373E] mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#58CC02] flex items-center gap-1">
              <span>{avatarIcon || '✨'}</span>
              <span>{name}</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReadAloud}
                className={`p-1 rounded-lg text-xs font-bold transition-colors ${
                  isPlayingAudio
                    ? 'bg-[#1CB0F6] text-white animate-pulse'
                    : 'bg-[#202F36] text-[#A5B8C0] hover:text-[#1CB0F6] hover:bg-[#283942]'
                }`}
                title="Listen aloud"
                aria-label={`Read aloud message from ${name}`}
              >
                <Volume2 className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={handleDismissBubble}
                className="p-1 rounded-lg bg-[#202F36] text-[#A5B8C0] hover:text-white hover:bg-[#283942] transition-colors"
                title="Dismiss message"
                aria-label="Close message"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-bold text-[#E2E8F0] leading-snug">
            {currentQuote}
          </p>

          {/* Gentle indicator arrow */}
          <div
            className={`absolute w-2.5 h-2.5 bg-[#18262C] border-[#37464F] rotate-45 ${
              bubblePosition === 'top'
                ? '-bottom-1.5 left-1/2 -translate-x-1/2 border-r-2 border-b-2'
                : bubblePosition === 'bottom'
                ? '-top-1.5 left-1/2 -translate-x-1/2 border-l-2 border-t-2'
                : bubblePosition === 'left'
                ? '-right-1.5 top-1/2 -translate-y-1/2 border-r-2 border-t-2'
                : '-left-1.5 top-1/2 -translate-y-1/2 border-l-2 border-b-2'
            }`}
          />
        </div>
      )}

      {/* Render Character SVG/Graphics */}
      {children({
        characterState,
        isBlinking,
        isPetted,
        dragOffset
      })}
    </div>
  );
};
