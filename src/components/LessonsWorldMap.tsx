import React, { useState } from 'react';
import { LessonId, LessonProgress, SensorySettings, MiloCosmetics } from '../types';
import { ALL_LESSONS } from '../data/lessonsData';
import { BeagleMascot, BeagleSpeechBubble } from './AnimalMascots';
import { MiloMomentDialog } from './MiloMomentDialog';
import { playGentleSound, speakText } from '../utils/audio';
import { InteractiveSun } from './interactive/InteractiveSun';
import { InteractiveCloud } from './interactive/InteractiveCloud';
import { InteractiveButterfly, InteractiveFlower, InteractiveStar } from './interactive/InteractiveNature';
import { 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Star, 
  Play, 
  Trophy, 
  Diamond, 
  Heart, 
  CupSoda, 
  BrainCircuit, 
  Crown,
  ChevronRight,
  Info
} from 'lucide-react';

interface Props {
  currentLessonId: LessonId;
  setCurrentLessonId: (id: LessonId) => void;
  lessonsProgress: Record<LessonId, LessonProgress>;
  sensorySettings: SensorySettings;
  onStartLesson: (lessonId: LessonId) => void;
  onStartBreak: (lessonId: LessonId) => void;
  onStartMemoryGame: (lessonId: LessonId) => void;
  onOpenCaregiver?: () => void;
  gemsCount?: number;
  heartsCount?: number;
  miloCosmetics?: MiloCosmetics;
}

export const LessonsWorldMap: React.FC<Props> = ({
  currentLessonId,
  setCurrentLessonId,
  lessonsProgress,
  sensorySettings,
  onStartLesson,
  onStartBreak,
  onStartMemoryGame,
  onOpenCaregiver,
  gemsCount = 145,
  heartsCount = 5,
  miloCosmetics
}) => {
  const [isMiloMomentOpen, setIsMiloMomentOpen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<{
    lessonId: LessonId;
    type: 'lesson' | 'break' | 'memory';
  } | null>(null);

  const handleNodeClick = (lessonId: LessonId, type: 'lesson' | 'break' | 'memory') => {
    playGentleSound('tile', sensorySettings.soundMode);
    setSelectedNode({ lessonId, type });
  };

  const getLessonProgress = (id: LessonId): LessonProgress => {
    return lessonsProgress[id] || {
      lessonId: id,
      challengesCompleted: id === 1 ? 7 : 0,
      isCompleted: id === 1,
      breakCompleted: id === 1,
      memoryGameCompleted: id === 1,
      starsEarned: id === 1 ? 3 : 0
    };
  };

  const isLessonUnlocked = (id: LessonId): boolean => {
    if (id === 1) return true;
    const prevProgress = getLessonProgress((id - 1) as LessonId);
    return prevProgress.isCompleted || prevProgress.breakCompleted;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Duolingo Style Sticky Stats Header */}
      <div className="bg-[#18262C] rounded-3xl p-4 sm:p-5 border-2 border-[#28373E] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#58CC02]/20 border border-[#58CC02]/40 flex items-center justify-center text-xl">
            🗺️
          </div>
          <div>
            <h1 className="font-display text-lg sm:text-xl font-black text-white leading-tight">
              Milo&apos;s Quest Map
            </h1>
            <p className="text-xs text-[#A5B8C0] font-bold">
              3 Story Lessons • Real-World Breaks • Memory Flashcards
            </p>
          </div>
        </div>

        {/* Gamified Currency Pill Stats & Milo Moment */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="map-milo-moment-btn"
            onClick={() => {
              playGentleSound('bark', sensorySettings.soundMode);
              setIsMiloMomentOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-2xl bg-[#202F36] hover:bg-[#283942] border-2 border-[#58CC02]/70 hover:border-[#58CC02] text-white text-xs font-black flex items-center gap-1.5 shadow-md hover:scale-105 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            title="Tap for Milo Moment"
          >
            <span className="text-base">🐶</span>
            <span className="text-[#58CC02] font-black">Milo Moment</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#202F36] border border-[#37464F] text-xs font-black text-[#1CB0F6]">
            <Diamond className="w-4 h-4 fill-[#1CB0F6]" />
            <span>{gemsCount} Gems</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#202F36] border border-[#37464F] text-xs font-black text-[#FF4B4B]">
            <Heart className="w-4 h-4 fill-[#FF4B4B]" />
            <span>{heartsCount}/5 Energy</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Atmosphere (Sky & Companions) */}
      <div className="flex items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          <InteractiveCloud
            id="map-cloud"
            soundMode={sensorySettings.soundMode}
            reducedMotion={sensorySettings.visualMode === 'minimal'}
            name="Meadow Cloud"
          />
          <InteractiveButterfly
            soundMode={sensorySettings.soundMode}
            reducedMotion={sensorySettings.visualMode === 'minimal'}
            color="#EC4899"
          />
        </div>

        <div className="flex items-center gap-3">
          <InteractiveFlower
            soundMode={sensorySettings.soundMode}
            reducedMotion={sensorySettings.visualMode === 'minimal'}
            petalColor="#FBBF24"
          />
          <InteractiveSun
            soundMode={sensorySettings.soundMode}
            reducedMotion={sensorySettings.visualMode === 'minimal'}
            className="w-14 h-14 sm:w-16 sm:h-16"
          />
        </div>
      </div>

      {/* Milo Mascot Speech Bubble with Cosmetics */}
      <BeagleSpeechBubble
        mood="waving"
        message="Woof! Welcome to your learning adventure path! Complete story quests, take real-world hydration breaks, and master memory cards!"
        subMessage="Tap any unlocked stepping stone on the path below to jump into that activity!"
        soundMode={sensorySettings.soundMode}
        size="md"
        canSpeak={true}
        cosmetics={miloCosmetics}
      />

      {/* Interactive Winding Path Container */}
      <div className="relative py-6 sm:py-10 max-w-xl mx-auto flex flex-col items-center">
        {/* Floating Twinkling Stars beside the path */}
        <div className="absolute top-12 left-4 hidden sm:block">
          <InteractiveStar
            soundMode={sensorySettings.soundMode}
            reducedMotion={sensorySettings.visualMode === 'minimal'}
          />
        </div>
        <div className="absolute top-1/2 right-4 hidden sm:block">
          <InteractiveStar
            soundMode={sensorySettings.soundMode}
            reducedMotion={sensorySettings.visualMode === 'minimal'}
          />
        </div>

        {/* Decorative Winding Pathway Line */}
        <div className="absolute top-10 bottom-10 w-3 bg-[#202F36] rounded-full -z-0 border-x border-[#28373E]" />

        {ALL_LESSONS.map((lesson, index) => {
          const progress = getLessonProgress(lesson.id);
          const unlocked = isLessonUnlocked(lesson.id);
          const isCurrent = currentLessonId === lesson.id;

          return (
            <div key={lesson.id} className="w-full relative z-10 flex flex-col items-center my-6 space-y-6">
              {/* Section Header Card */}
              <div 
                className="w-full bg-[#18262C] border-2 rounded-3xl p-4 sm:p-5 shadow-lg flex items-center justify-between gap-3"
                style={{ borderColor: unlocked ? lesson.color : '#28373E' }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-md"
                    style={{ backgroundColor: unlocked ? lesson.color : '#202F36' }}
                  >
                    {lesson.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: lesson.color }}
                      >
                        {lesson.badge}
                      </span>
                      <span className="text-xs text-[#A5B8C0] font-bold">{lesson.location}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                      {lesson.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`map-lesson-${lesson.id}-milo-moment-btn`}
                    onClick={(e) => {
                      e.stopPropagation();
                      playGentleSound('bark', sensorySettings.soundMode);
                      setIsMiloMomentOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-[#202F36] hover:bg-[#283942] border border-[#58CC02]/50 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    title="Milo Moment (Guardian Help or Calm Break)"
                  >
                    <span>🐶</span>
                    <span className="text-[#58CC02] hidden sm:inline">Milo Moment</span>
                  </button>

                  <div className="flex items-center gap-1 text-xs font-black text-[#FFC800]">
                    <Star className="w-4 h-4 fill-[#FFC800]" />
                    <span>{progress.starsEarned || 0}/3</span>
                  </div>
                </div>
              </div>

              {/* Node 1: Main Story Lesson Stepping Stone */}
              <div className="relative group">
                {isCurrent && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-20">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFC800] text-[#131F24] shadow-md whitespace-nowrap mb-1">
                      Start Here!
                    </span>
                    <BeagleMascot mood="happy" size="sm" interactive={false} />
                  </div>
                )}

                <button
                  id={`map-lesson-node-${lesson.id}`}
                  onClick={() => unlocked && onStartLesson(lesson.id)}
                  disabled={!unlocked}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 transform select-none ${
                    !unlocked
                      ? 'bg-[#202F36] border-4 border-[#28373E] text-[#485963] cursor-not-allowed'
                      : progress.isCompleted
                      ? 'bg-[#58CC02] border-4 border-[#46A302] text-white shadow-xl hover:scale-105 active:scale-95'
                      : 'bg-[#FFC800] border-4 border-[#E5A500] text-[#131F24] shadow-2xl hover:scale-110 ring-4 ring-[#FFC800]/40 animate-pulse'
                  }`}
                  aria-label={`Lesson ${lesson.id}: ${lesson.title}`}
                >
                  <span className="text-3xl sm:text-4xl">{lesson.icon}</span>
                  {progress.isCompleted ? (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#131F24] border-2 border-[#58CC02] flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-[#58CC02]" />
                    </div>
                  ) : !unlocked ? (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#131F24] border-2 border-[#28373E] flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-[#485963]" />
                    </div>
                  ) : (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#131F24] border-2 border-[#FFC800] flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-[#FFC800] fill-[#FFC800]" />
                    </div>
                  )}
                </button>
                <p className="text-center text-xs font-black text-white mt-2">
                  Story Quest
                </p>
              </div>

              {/* Node 2: Real-world Break Sidequest Stepping Stone (Shifted slightly left) */}
              <div className="flex items-center justify-center gap-6 w-full px-4">
                <div className="flex flex-col items-center -translate-x-8 sm:-translate-x-12">
                  <button
                    id={`map-break-node-${lesson.id}`}
                    onClick={() => unlocked && onStartBreak(lesson.id)}
                    disabled={!unlocked}
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 transform select-none ${
                      !unlocked
                        ? 'bg-[#202F36] border-3 border-[#28373E] text-[#485963] cursor-not-allowed'
                        : progress.breakCompleted
                        ? 'bg-[#1CB0F6] border-3 border-[#1899D6] text-white shadow-lg hover:scale-105'
                        : 'bg-[#202F36] border-3 border-[#1CB0F6] text-[#1CB0F6] shadow-md hover:scale-105'
                    }`}
                    aria-label={`Lesson ${lesson.id} Break Quest`}
                  >
                    <span className="text-2xl">{lesson.breakIcon}</span>
                    {progress.breakCompleted && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#131F24] border-2 border-[#1CB0F6] flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1CB0F6]" />
                      </div>
                    )}
                  </button>
                  <p className="text-center text-[11px] font-bold text-[#A5B8C0] mt-1">
                    Break Sidequest
                  </p>
                </div>

                {/* Node 3: Flashcard Memory Game Stepping Stone (Shifted slightly right) */}
                <div className="flex flex-col items-center translate-x-8 sm:translate-x-12">
                  <button
                    id={`map-memory-node-${lesson.id}`}
                    onClick={() => unlocked && onStartMemoryGame(lesson.id)}
                    disabled={!unlocked}
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 transform select-none ${
                      !unlocked
                        ? 'bg-[#202F36] border-3 border-[#28373E] text-[#485963] cursor-not-allowed'
                        : progress.memoryGameCompleted
                        ? 'bg-[#FF9600] border-3 border-[#E58500] text-white shadow-lg hover:scale-105'
                        : 'bg-[#202F36] border-3 border-[#FF9600] text-[#FF9600] shadow-md hover:scale-105'
                    }`}
                    aria-label={`Lesson ${lesson.id} Memory Cards`}
                  >
                    <span className="text-2xl">🎴</span>
                    {progress.memoryGameCompleted && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#131F24] border-2 border-[#FF9600] flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF9600]" />
                      </div>
                    )}
                  </button>
                  <p className="text-center text-[11px] font-bold text-[#A5B8C0] mt-1">
                    Memory Match
                  </p>
                </div>
              </div>

              {/* Milestone Separator / Trophy */}
              <div className="my-2 flex items-center justify-center">
                <div className="px-3 py-1 rounded-full bg-[#202F36] border border-[#37464F] text-xs font-bold text-[#FFC800] flex items-center gap-1.5">
                  {lesson.id === 3 ? (
                    <>
                      <Crown className="w-4 h-4 fill-[#FFC800]" />
                      <span>Grand Master Explorer!</span>
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4 fill-[#FFC800]" />
                      <span>Milestone {lesson.id} Complete</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Card */}
      <div className="bg-[#18262C] rounded-3xl p-6 border-2 border-[#28373E] text-center space-y-4 max-w-xl mx-auto shadow-xl">
        <h3 className="font-display text-lg font-black text-white">
          Ready for Today&apos;s Quest?
        </h3>
        <p className="text-xs sm:text-sm text-[#A5B8C0] font-medium">
          Start from where you left off or replay your favorite real-world sidequests anytime!
        </p>

        <button
          onClick={() => onStartLesson(currentLessonId)}
          className="w-full py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-xl uppercase tracking-wider"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>Launch Lesson {currentLessonId} Quest</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 🐶 Milo Moment Modal Dialog */}
      <MiloMomentDialog
        isOpen={isMiloMomentOpen}
        onClose={() => setIsMiloMomentOpen(false)}
        sensorySettings={sensorySettings}
        onGoToBreak={() => onStartBreak(currentLessonId)}
        onGoToCaregiver={onOpenCaregiver}
      />
    </div>
  );
};
