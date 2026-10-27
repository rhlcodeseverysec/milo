import React, { useState, useEffect } from 'react';
import { LessonId, LessonInfo, SensorySettings, SkillAdaptiveProfile } from '../types';
import { ALL_LESSONS } from '../data/lessonsData';
import { BeagleSpeechBubble, BeagleMascot } from './AnimalMascots';
import { playGentleSound, speakText } from '../utils/audio';
import { 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Trophy, 
  MapPin, 
  Volume2,
  BrainCircuit,
  Diamond,
  HelpCircle
} from 'lucide-react';

interface CardItem {
  uid: string;
  pairId: string;
  name: string;
  icon: string;
  funFact: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Props {
  lessonId: LessonId;
  sensorySettings: SensorySettings;
  onCompleteGame: () => void;
  onNextLesson?: () => void;
  onGoToMap: () => void;
  adaptiveProfile?: SkillAdaptiveProfile;
  onUpdateProfile?: (profile: SkillAdaptiveProfile) => void;
}

export const MemoryFlashcardsGame: React.FC<Props> = ({
  lessonId,
  sensorySettings,
  onCompleteGame,
  onNextLesson,
  onGoToMap,
  adaptiveProfile,
  onUpdateProfile
}) => {
  const lesson: LessonInfo = ALL_LESSONS.find(l => l.id === lessonId) || ALL_LESSONS[0];
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedFact, setSelectedFact] = useState<string | null>(null);

  const numPairs = adaptiveProfile?.skillDifficulty === 'easy' 
    ? 2 
    : adaptiveProfile?.skillDifficulty === 'challenge' 
    ? 4 
    : 3;
  const targetPairs = lesson.memoryPairs.slice(0, numPairs);

  // Initialize and shuffle cards
  const initializeCards = () => {
    const pairs = targetPairs;
    const cardDeck: CardItem[] = [];

    pairs.forEach(pair => {
      // 2 cards for each pair
      cardDeck.push({
        uid: `${pair.id}-1`,
        pairId: pair.id,
        name: pair.name,
        icon: pair.icon,
        funFact: pair.funFact,
        isFlipped: false,
        isMatched: false
      });
      cardDeck.push({
        uid: `${pair.id}-2`,
        pairId: pair.id,
        name: pair.name,
        icon: pair.icon,
        funFact: pair.funFact,
        isFlipped: false,
        isMatched: false
      });
    });

    // Fisher-Yates shuffle
    for (let i = cardDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardDeck[i], cardDeck[j]] = [cardDeck[j], cardDeck[i]];
    }

    setCards(cardDeck);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairsCount(0);
    setIsGameOver(false);
    setSelectedFact(null);
  };

  useEffect(() => {
    initializeCards();
  }, [lessonId, adaptiveProfile?.skillDifficulty]);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2) {
      return;
    }

    playGentleSound('tile', sensorySettings.soundMode);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH FOUND!
        setTimeout(() => {
          playGentleSound('match', sensorySettings.soundMode);
          const matchedDeck = [...cards];
          matchedDeck[firstIdx].isMatched = true;
          matchedDeck[secondIdx].isMatched = true;
          setCards(matchedDeck);
          setFlippedIndices([]);
          setMatchedPairsCount(prev => {
            const nextCount = prev + 1;
            setSelectedFact(`Found match: ${firstCard.name}! ${firstCard.funFact}`);
            if (nextCount === targetPairs.length) {
              // Game Won!
              setTimeout(() => {
                playGentleSound('complete', sensorySettings.soundMode);
                setIsGameOver(true);
                onCompleteGame();
              }, 400);
            }
            return nextCount;
          });
        }, 500);
      } else {
        // NO MATCH - FLIP BACK
        setTimeout(() => {
          playGentleSound('step', sensorySettings.soundMode);
          const resetDeck = [...cards];
          resetDeck[firstIdx].isFlipped = false;
          resetDeck[secondIdx].isFlipped = false;
          setCards(resetDeck);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const handleReadCard = (name: string, fact: string) => {
    playGentleSound('click', sensorySettings.soundMode);
    speakText(`${name}. ${fact}`, sensorySettings.soundMode);
  };

  const totalPairs = lesson.memoryPairs.length;
  const starsCount = moves <= totalPairs + 2 ? 3 : moves <= totalPairs + 5 ? 2 : 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Header Info */}
      <div className="bg-[#18262C] rounded-3xl p-4 sm:p-5 border-2 border-[#28373E] shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span 
            className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: lesson.color }}
          >
            {lesson.badge} Flashcards
          </span>
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
            <BrainCircuit className="w-5 h-5 text-[#FFC800]" />
            <span>Memory Card Match</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-black text-[#58CC02] bg-[#1A3824] px-2.5 py-1 rounded-xl border border-[#2E6B38]">
            <CheckCircle2 className="w-4 h-4" />
            <span>{matchedPairsCount} / {totalPairs} Pairs</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-black text-[#1CB0F6] bg-[#123140] px-2.5 py-1 rounded-xl border border-[#1B5775]">
            <span>Moves: {moves}</span>
          </div>

          <button
            onClick={initializeCards}
            className="p-2 rounded-xl bg-[#202F36] hover:bg-[#283942] text-[#A5B8C0] hover:text-white border border-[#37464F] cursor-pointer"
            title="Restart Memory Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mascot Speech Banner */}
      <BeagleSpeechBubble
        mood={isGameOver ? 'cheering' : matchedPairsCount > 0 ? 'happy' : 'talking'}
        message={
          isGameOver
            ? `Spectacular Memory Master! You matched all the ${lesson.title} flashcards!`
            : selectedFact || `Tap cards to find matching pairs from ${lesson.location}!`
        }
        subMessage="Flip two cards at a time. Match all pairs to win bonus gems and stars!"
        soundMode={sensorySettings.soundMode}
        size="md"
      />

      {/* Flashcard Memory Grid (4x2 / 2x4) */}
      <div 
        id="memory-flashcard-grid"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto"
      >
        {cards.map((card, idx) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.uid}
              onClick={() => handleCardClick(idx)}
              disabled={card.isMatched || card.isFlipped}
              className={`h-36 sm:h-40 rounded-3xl p-3 flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 transform select-none ${
                card.isMatched
                  ? 'bg-[#1F3D24] border-3 border-[#58CC02] scale-95 shadow-md ring-2 ring-[#58CC02]/40 opacity-90'
                  : card.isFlipped
                  ? 'bg-[#203744] border-3 border-[#1CB0F6] shadow-xl scale-100'
                  : 'bg-[#18262C] hover:bg-[#202F36] border-2 border-[#28373E] hover:border-[#1CB0F6] shadow-lg hover:-translate-y-1'
              }`}
              aria-label={isRevealed ? `${card.name} card` : `Hidden card ${idx + 1}`}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center justify-center space-y-2 animate-scaleUp">
                  <span className="text-4xl sm:text-5xl">{card.icon}</span>
                  <span className="text-xs font-black text-white text-center leading-tight">
                    {card.name}
                  </span>
                  {card.isMatched && (
                    <span className="text-[10px] uppercase font-black tracking-wider text-[#58CC02] bg-[#132A19] px-2 py-0.5 rounded-full">
                      Matched ✨
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 text-[#465E6B]">
                  <div className="w-12 h-12 rounded-2xl bg-[#131F24] flex items-center justify-center border border-[#28373E]">
                    <Sparkles className="w-6 h-6 text-[#1CB0F6]/60 animate-pulse" />
                  </div>
                  <span className="text-[11px] font-black text-[#A5B8C0]">Milo?</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Game Over Celebration Modal */}
      {isGameOver && (
        <div className="bg-[#18262C] rounded-3xl p-6 sm:p-8 border-2 border-[#58CC02] shadow-2xl text-center space-y-5 animate-scaleUp">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#1F3D24] border-2 border-[#58CC02] flex items-center justify-center text-3xl shadow-lg animate-bounce">
            🏆
          </div>

          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              Memory Challenge Conquered!
            </h2>
            <p className="text-[#A5B8C0] text-sm mt-1 font-medium">
              You matched all pairs in <strong>{moves} moves</strong>!
            </p>
          </div>

          {/* Star Rating Display */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map(starNum => (
              <Star
                key={starNum}
                className={`w-8 h-8 ${
                  starNum <= starsCount
                    ? 'text-[#FFC800] fill-[#FFC800] animate-bounce'
                    : 'text-[#37464F]'
                }`}
              />
            ))}
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#131F24] border border-[#28373E] text-xs font-black text-[#1CB0F6]">
            <Diamond className="w-4 h-4 fill-[#1CB0F6]" />
            <span>+40 Bonus Memory Gems Awarded!</span>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {lessonId < 3 && onNextLesson ? (
              <button
                id="memory-next-lesson-button"
                onClick={() => {
                  playGentleSound('click', sensorySettings.soundMode);
                  onNextLesson();
                }}
                className="flex-1 py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-xl tracking-wide uppercase"
              >
                <span>Continue to Lesson {lessonId + 1}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : null}

            <button
              onClick={() => {
                playGentleSound('click', sensorySettings.soundMode);
                onGoToMap();
              }}
              className="flex-1 py-4 px-6 rounded-2xl btn-duo-blue text-white font-black text-base flex items-center justify-center gap-2 cursor-pointer shadow-md tracking-wide uppercase"
            >
              <MapPin className="w-5 h-5" />
              <span>Explore World Map</span>
            </button>

            <button
              onClick={initializeCards}
              className="py-4 px-5 rounded-2xl bg-[#202F36] hover:bg-[#283942] text-white border border-[#37464F] font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
