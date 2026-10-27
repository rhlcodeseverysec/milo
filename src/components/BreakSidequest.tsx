import React, { useState } from 'react';
import { LessonId, LessonInfo, SensorySettings } from '../types';
import { ALL_LESSONS } from '../data/lessonsData';
import { BeagleMascot, BeagleSpeechBubble } from './AnimalMascots';
import { playGentleSound, speakText } from '../utils/audio';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Heart, 
  Volume2, 
  MapPin, 
  PartyPopper,
  CupSoda,
  RotateCcw
} from 'lucide-react';

interface Props {
  lessonId: LessonId;
  sensorySettings: SensorySettings;
  onCompleteBreak: () => void;
  onGoToMemoryGame: () => void;
  onGoToMap: () => void;
}

export const BreakSidequest: React.FC<Props> = ({
  lessonId,
  sensorySettings,
  onCompleteBreak,
  onGoToMemoryGame,
  onGoToMap
}) => {
  const [isDone, setIsDone] = useState(false);
  const [waterFill, setWaterFill] = useState(0); // 0 to 100%
  const lesson: LessonInfo = ALL_LESSONS.find(l => l.id === lessonId) || ALL_LESSONS[0];

  const handleDrinkWaterStep = () => {
    playGentleSound('water', sensorySettings.soundMode);
    setWaterFill(prev => Math.min(100, prev + 34));
    if (waterFill >= 66) {
      handleConfirmVictory();
    }
  };

  const handleConfirmVictory = () => {
    playGentleSound('success', sensorySettings.soundMode);
    setIsDone(true);
    onCompleteBreak();
  };

  const handleSpeakPrompt = () => {
    playGentleSound('bark', sensorySettings.soundMode);
    speakText(lesson.breakAudioText, sensorySettings.soundMode);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6 animate-fadeIn">
      {/* Top Badge & Context */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span 
            className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-sm"
            style={{ backgroundColor: lesson.color }}
          >
            {lesson.badge} Break Milestone
          </span>
          <span className="text-xs text-[#A5B8C0] font-bold">
            Real-World Energy Reset
          </span>
        </div>

        <button
          onClick={onGoToMap}
          className="text-xs font-bold text-[#1CB0F6] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>World Map</span>
        </button>
      </div>

      {/* Mascot Speech Card */}
      <BeagleSpeechBubble
        mood={isDone ? 'cheering' : 'happy'}
        message={isDone ? "Woohoo! Pawsome break! You're re-energized and ready for the Flashcard Memory Challenge!" : lesson.breakPrompt}
        subMessage="Taking real-world breaks helps your brain recharge, focus, and feel joyful!"
        soundMode={sensorySettings.soundMode}
        size="lg"
        actionButton={{
          label: 'Listen to Milo',
          onClick: handleSpeakPrompt
        }}
      />

      {/* Interactive Break Action Card */}
      <div className="bg-[#18262C] rounded-3xl p-6 sm:p-8 border-2 border-[#28373E] shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Decorative Background Glow */}
        <div 
          className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: lesson.color }}
        />

        <div className="space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#202F36] border-2 border-[#37464F] flex items-center justify-center text-3xl shadow-inner animate-bounce">
            {lesson.breakIcon}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            {lesson.breakTitle}
          </h2>
          <p className="text-[#A5B8C0] text-sm max-w-md mx-auto font-medium leading-relaxed">
            Step away from the screen for a moment. Complete this fun physical quest, then tap below!
          </p>
        </div>

        {/* Dynamic Interactive Activity depending on Lesson */}
        {lessonId === 1 && (
          <div className="bg-[#131F24] p-5 rounded-2xl border border-[#28373E] max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#A5B8C0]">
              <span className="flex items-center gap-1.5 text-white">
                <CupSoda className="w-4 h-4 text-[#1CB0F6]" />
                Hydration Cup
              </span>
              <span>{Math.min(100, Math.round(waterFill))}% Full</span>
            </div>

            {/* Cup Animation */}
            <div className="w-24 h-32 mx-auto bg-[#202F36] border-4 border-[#37464F] rounded-b-3xl relative overflow-hidden flex flex-col justify-end p-1 shadow-inner">
              <div 
                className="w-full bg-[#1CB0F6] rounded-b-2xl transition-all duration-500 ease-out flex items-center justify-center"
                style={{ height: `${Math.max(10, waterFill)}%` }}
              >
                {waterFill >= 60 && <span className="text-xs font-black text-white animate-pulse">💧 Gulp!</span>}
              </div>
            </div>

            <button
              onClick={handleDrinkWaterStep}
              className="w-full py-3 px-4 rounded-xl btn-duo-blue text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md tracking-wide uppercase"
            >
              <span>🥤 Drink Big Sips of Water!</span>
            </button>
          </div>
        )}

        {lessonId === 2 && (
          <div className="bg-[#131F24] p-5 rounded-2xl border border-[#28373E] max-w-md mx-auto space-y-4">
            <div className="text-4xl animate-pulse">✋ 🌟 ✋</div>
            <p className="text-xs sm:text-sm text-white font-bold">
              Run over to your parent, guardian, or teacher, give them a giant high-five, and say:
            </p>
            <div className="p-3 bg-[#202F36] rounded-xl border border-[#37464F] text-[#58CC02] text-xs font-extrabold">
              &ldquo;I conquered the Sunny Park Adventure with Milo!&rdquo;
            </div>
            <button
              onClick={handleConfirmVictory}
              className="w-full py-3 px-4 rounded-xl btn-duo-green text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md tracking-wide uppercase"
            >
              <span>✋ High-Five Shared!</span>
            </button>
          </div>
        )}

        {lessonId === 3 && (
          <div className="bg-[#131F24] p-5 rounded-2xl border border-[#28373E] max-w-md mx-auto space-y-4">
            <div className="text-4xl animate-bounce">🌿 🧘 ☀️</div>
            <p className="text-xs sm:text-sm text-white font-bold">
              Look out the window for 20 seconds, count 3 green leaves or trees, and take 3 slow balloon breaths!
            </p>
            <button
              onClick={handleConfirmVictory}
              className="w-full py-3 px-4 rounded-xl btn-duo-yellow text-[#131F24] text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md tracking-wide uppercase"
            >
              <span>🌿 Eyes Rested & Stretched!</span>
            </button>
          </div>
        )}

        {/* Completion State Banner */}
        {isDone ? (
          <div className="bg-[#1B3E25] border-2 border-[#58CC02] p-5 rounded-2xl text-center space-y-4 animate-scaleUp">
            <div className="flex items-center justify-center gap-2 text-[#58CC02] font-black text-lg">
              <PartyPopper className="w-6 h-6" />
              <span>Break Quest Mastered! +30 Gems 💎</span>
            </div>
            <p className="text-xs sm:text-sm text-white font-bold">
              You refreshed your body and brain! Now let&apos;s test your memory with the flashcard matching challenge!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="break-go-to-memory-button"
                onClick={() => {
                  playGentleSound('click', sensorySettings.soundMode);
                  onGoToMemoryGame();
                }}
                className="flex-1 py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-xl tracking-wide uppercase"
              >
                <span>Play Flashcard Memory Game</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  playGentleSound('click', sensorySettings.soundMode);
                  onGoToMap();
                }}
                className="py-4 px-6 rounded-2xl bg-[#202F36] hover:bg-[#283942] text-white border border-[#37464F] font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>World Map</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <button
              id="break-skip-or-complete-button"
              onClick={handleConfirmVictory}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#202F36] hover:bg-[#283942] text-[#A5B8C0] hover:text-white border border-[#37464F] text-xs font-bold cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-[#58CC02]" />
              <span>I completed my break activity</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
