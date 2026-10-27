import React, { useState } from 'react';
import { 
  ChallengeRecord, 
  SkillLevels, 
  SensorySettings, 
  UserView,
  LessonId,
  LessonInfo,
  MiloCosmetics,
  AdaptiveSkillKey,
  SkillAdaptiveProfile,
  ParentAdaptiveSettings
} from '../types';
import { MARKET_CHALLENGES_INFO } from '../data/challengesData';
import { ALL_LESSONS, PARK_CHALLENGES_INFO, LIBRARY_CHALLENGES_INFO } from '../data/lessonsData';
import { Challenge1Sequencing } from './challenges/Challenge1Sequencing';
import { Challenge2Math } from './challenges/Challenge2Math';
import { Challenge3Budget } from './challenges/Challenge3Budget';
import { Challenge4Emotional } from './challenges/Challenge4Emotional';
import { Challenge5Communication } from './challenges/Challenge5Communication';
import { Challenge6ProblemSolving } from './challenges/Challenge6ProblemSolving';
import { Challenge7FinalMission } from './challenges/Challenge7FinalMission';
import { AdaptiveFeedbackBanner } from './AdaptiveFeedbackBanner';
import { MiloMomentDialog } from './MiloMomentDialog';
import { MiloStoryAfterChallenge } from './MiloStoryAfterChallenge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Diamond, 
  Heart, 
  Volume2,
  BookOpen
} from 'lucide-react';
import { playGentleSound, speakText } from '../utils/audio';
import { BeagleSpeechBubble } from './AnimalMascots';
import { InteractiveSun } from './interactive/InteractiveSun';
import { AnimalCompanion } from './interactive/InteractiveAnimalCast';
import { InteractiveButterfly, InteractiveFlower } from './interactive/InteractiveNature';

interface Props {
  challenges: ChallengeRecord[];
  setChallenges: React.Dispatch<React.SetStateAction<ChallengeRecord[]>>;
  skillLevels: SkillLevels;
  setSkillLevels: React.Dispatch<React.SetStateAction<SkillLevels>>;
  sensorySettings: SensorySettings;
  setCurrentView: (view: UserView) => void;
  activeChallengeIndex: number;
  setActiveChallengeIndex: (idx: number) => void;
  currentLessonId?: LessonId;
  setCurrentLessonId?: (id: LessonId) => void;
  gemsCount?: number;
  heartsCount?: number;
  setGemsCount?: React.Dispatch<React.SetStateAction<number>>;
  onCompleteLessonMission?: (lessonId: LessonId) => void;
  miloCosmetics?: MiloCosmetics;
  adaptiveProfiles: Record<AdaptiveSkillKey, SkillAdaptiveProfile>;
  setAdaptiveProfiles: React.Dispatch<React.SetStateAction<Record<AdaptiveSkillKey, SkillAdaptiveProfile>>>;
  parentAdaptiveSettings: ParentAdaptiveSettings;
}

export const StoryJourneyContainer: React.FC<Props> = ({
  challenges,
  setChallenges,
  setSkillLevels,
  sensorySettings,
  setCurrentView,
  activeChallengeIndex,
  setActiveChallengeIndex,
  currentLessonId = 1,
  gemsCount = 145,
  heartsCount = 5,
  setGemsCount,
  onCompleteLessonMission,
  miloCosmetics,
  adaptiveProfiles,
  setAdaptiveProfiles,
  parentAdaptiveSettings
}) => {
  const [isMiloMomentOpen, setIsMiloMomentOpen] = useState<boolean>(false);
  const [showInteractiveStory, setShowInteractiveStory] = useState<boolean>(false);
  const [storyChallengeIndex, setStoryChallengeIndex] = useState<number>(0);
  const [isCelebrating, setIsCelebrating] = useState<boolean>(false);

  const [adaptiveBanner, setAdaptiveBanner] = useState<{
    show: boolean;
    message: string;
    category?: string;
    levelChange?: string;
  } | null>(null);

  const lessonInfo: LessonInfo = ALL_LESSONS.find(l => l.id === currentLessonId) || ALL_LESSONS[0];
  const challengesList = currentLessonId === 2 
    ? PARK_CHALLENGES_INFO 
    : currentLessonId === 3 
    ? LIBRARY_CHALLENGES_INFO 
    : MARKET_CHALLENGES_INFO;

  const currentInfo = challengesList[activeChallengeIndex] || challengesList[0];

  const handleContinueAfterStory = () => {
    setShowInteractiveStory(false);
    if (storyChallengeIndex === 6) {
      if (onCompleteLessonMission) {
        onCompleteLessonMission(currentLessonId);
      }
      setTimeout(() => {
        setCurrentView('sidequest-break');
      }, 500);
    } else {
      setActiveChallengeIndex(storyChallengeIndex + 1);
    }
  };

  const handleChallengeComplete = (attempts: number, hintsUsed: number) => {
    // 1. Update challenge record & award quest gems
    const updatedChallenges = [...challenges];
    const isFirstAttemptSuccess = attempts === 1;

    updatedChallenges[activeChallengeIndex] = {
      ...updatedChallenges[activeChallengeIndex],
      attempts: Math.max(1, attempts),
      isCorrect: true,
      completed: true,
      hintsUsed: hintsUsed,
    };
    setChallenges(updatedChallenges);

    if (setGemsCount) {
      setGemsCount(prev => prev + (isFirstAttemptSuccess ? 25 : 15));
    }
    playGentleSound('gem', sensorySettings.soundMode);
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 2500);

    // 2. Rule-Based Adaptive System Evaluation (No ML, explicit rules)
    if (activeChallengeIndex === 1) { // Mathematics Challenge
      if (isFirstAttemptSuccess) {
        setSkillLevels(prev => ({ ...prev, math: Math.min(5, Number((prev.math + 0.5).toFixed(1))) }));
        setAdaptiveBanner({
          show: true,
          category: 'Mathematics',
          levelChange: '+0.5 Level',
          message: `Milo noticed that Sam solved the ${lessonInfo.title} pricing challenge on the first try!`
        });
      }
    } else if (activeChallengeIndex === 2) { // Budgeting Challenge
      if (isFirstAttemptSuccess) {
        setAdaptiveBanner({
          show: true,
          category: 'Budgeting & Math',
          levelChange: 'Mastery',
          message: 'Milo noticed that Sam managed the budget with ease.'
        });
      }
    } else if (activeChallengeIndex === 6) { // Final Mission
      setAdaptiveBanner({
        show: true,
        category: 'Integrated Quest',
        levelChange: 'Lesson Complete',
        message: `Milo is proud! You completed ${lessonInfo.title}! Time for a fun break!`
      });
    }

    // 3. Launch interactive story episode with Milo as the hero!
    setStoryChallengeIndex(activeChallengeIndex);
    setShowInteractiveStory(true);
  };

  const getMascotPromptForLevel = () => {
    switch (activeChallengeIndex) {
      case 0:
        return {
          mood: 'happy' as const,
          message: "Let's get ready! Tap the sequence items in order from morning to market.",
          subMessage: "What do we do first before heading out to shop?"
        };
      case 1:
        return {
          mood: 'thinking' as const,
          message: "Count with me! How much do 2 juicy apples cost?",
          subMessage: "Each apple is ₹15. Tap the matching total coins!"
        };
      case 2:
        return {
          mood: 'talking' as const,
          message: "We have ₹100 in our budget purse! Pick healthy groceries.",
          subMessage: "Keep an eye on the purse meter so we don't go over ₹100!"
        };
      case 3:
        return {
          mood: 'happy' as const,
          message: "Uh oh, the supermarket is a little noisy. How should Sam feel?",
          subMessage: "Choose the calming strategy that helps Sam feel calm and safe."
        };
      case 4:
        return {
          mood: 'waving' as const,
          message: "Time to talk to Mr. Rao at the counter! What is a polite greeting?",
          subMessage: "Select the cheerful, polite phrase to ask for help."
        };
      case 5:
        return {
          mood: 'thinking' as const,
          message: "Oops! We see a puddle in aisle 3. What is the smartest safe choice?",
          subMessage: "Help Milo and Sam walk safely around the wet floor."
        };
      case 6:
        return {
          mood: 'cheering' as const,
          message: "Final Grand Mission! Put all your superpower shopping skills together!",
          subMessage: "We're almost at the checkout stand! You're doing amazing!"
        };
      default:
        return {
          mood: 'happy' as const,
          message: "Let's explore the market together!",
          subMessage: "Take your time and have fun!"
        };
    }
  };

  const mascotPrompt = getMascotPromptForLevel();

  const handleUpdateSkillProfile = (profile: SkillAdaptiveProfile) => {
    setAdaptiveProfiles(prev => ({
      ...prev,
      [profile.skillId]: profile
    }));
  };

  const handleTakeBreak = () => {
    playGentleSound('click', sensorySettings.soundMode);
    setCurrentView('sidequest-break');
  };

  const renderActiveChallenge = () => {
    switch (activeChallengeIndex) {
      case 0:
        return (
          <Challenge1Sequencing 
            sensorySettings={sensorySettings}
            adaptiveProfile={adaptiveProfiles.sequencing}
            onUpdateProfile={handleUpdateSkillProfile}
            parentSettings={parentAdaptiveSettings}
            onTakeBreak={handleTakeBreak}
            onComplete={handleChallengeComplete}
          />
        );
      case 1:
        return (
          <Challenge2Math 
            sensorySettings={sensorySettings}
            adaptiveProfile={adaptiveProfiles.math}
            onUpdateProfile={handleUpdateSkillProfile}
            parentSettings={parentAdaptiveSettings}
            onTakeBreak={handleTakeBreak}
            onComplete={handleChallengeComplete}
          />
        );
      case 2:
        return (
          <Challenge3Budget 
            sensorySettings={sensorySettings}
            adaptiveProfile={adaptiveProfiles.budgeting}
            onUpdateProfile={handleUpdateSkillProfile}
            parentSettings={parentAdaptiveSettings}
            onTakeBreak={handleTakeBreak}
            onComplete={handleChallengeComplete}
          />
        );
      case 3:
        return (
          <Challenge4Emotional 
            sensorySettings={sensorySettings}
            adaptiveProfile={adaptiveProfiles.emotional}
            onUpdateProfile={handleUpdateSkillProfile}
            parentSettings={parentAdaptiveSettings}
            onTakeBreak={handleTakeBreak}
            onComplete={handleChallengeComplete}
          />
        );
      case 4:
        return (
          <Challenge5Communication 
            sensorySettings={sensorySettings}
            adaptiveProfile={adaptiveProfiles.communication}
            onUpdateProfile={handleUpdateSkillProfile}
            parentSettings={parentAdaptiveSettings}
            onTakeBreak={handleTakeBreak}
            onComplete={handleChallengeComplete}
          />
        );
      case 5:
        return (
          <Challenge6ProblemSolving 
            sensorySettings={sensorySettings}
            adaptiveProfile={adaptiveProfiles.problemSolving}
            onUpdateProfile={handleUpdateSkillProfile}
            parentSettings={parentAdaptiveSettings}
            onTakeBreak={handleTakeBreak}
            onComplete={handleChallengeComplete}
          />
        );
      case 6:
        return (
          <Challenge7FinalMission 
            sensorySettings={sensorySettings}
            adaptiveProfile={adaptiveProfiles.integrated}
            onUpdateProfile={handleUpdateSkillProfile}
            parentSettings={parentAdaptiveSettings}
            onTakeBreak={handleTakeBreak}
            onComplete={handleChallengeComplete}
          />
        );
      default:
        return null;
    }
  };

  const progressPercent = Math.round(((activeChallengeIndex + 1) / 7) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-5">
      {/* Duolingo Dark Progress Header */}
      <div className="bg-[#18262C] rounded-3xl p-4 sm:p-5 border-2 border-[#28373E] shadow-xl space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#58CC02] bg-[#1F3D24] px-2.5 py-1 rounded-full border border-[#2E6B38]">
              Level {activeChallengeIndex + 1} of 7
            </span>
            <span className="text-xs font-extrabold text-[#A5B8C0]">
              {currentInfo.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Milo Moment Button */}
            <button
              id="milo-moment-button"
              onClick={() => {
                playGentleSound('bark', sensorySettings.soundMode);
                setIsMiloMomentOpen(true);
              }}
              className="px-3 py-1.5 rounded-full bg-[#202F36] hover:bg-[#283942] border-2 border-[#58CC02]/50 hover:border-[#58CC02] text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
              title="Tap for Milo Moment (Guardian Help, Calm Break, or Pause)"
            >
              <span className="text-sm">🐶</span>
              <span className="text-[#58CC02] font-black">Milo Moment</span>
            </button>

            <div className="flex items-center gap-1 text-xs font-black text-[#1CB0F6] bg-[#202F36] px-2.5 py-1 rounded-xl border border-[#37464F]">
              <Diamond className="w-3.5 h-3.5 fill-[#1CB0F6]" />
              <span>{gemsCount}</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-[#FF4B4B] bg-[#202F36] px-2.5 py-1 rounded-xl border border-[#37464F]">
              <Heart className="w-3.5 h-3.5 fill-[#FF4B4B]" />
              <span>{heartsCount}</span>
            </div>
          </div>
        </div>

        {/* Duolingo Style Chunky Progress Bar */}
        <div className="relative w-full h-4 bg-[#202F36] rounded-full overflow-hidden border border-[#37464F]">
          <div 
            className="h-full bg-[#58CC02] rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-1"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
          </div>
        </div>

        {/* Step Indicator Bubbles */}
        <div className="flex items-center justify-between gap-1 pt-1">
          {challengesList.map((step, idx) => {
            const isCurrent = idx === activeChallengeIndex;
            const isPast = idx < activeChallengeIndex || (challenges[idx] && challenges[idx].completed);

            return (
              <button
                key={step.id}
                onClick={() => {
                  playGentleSound('click', sensorySettings.soundMode);
                  setActiveChallengeIndex(idx);
                }}
                className={`flex-1 h-3 rounded-full transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#58CC02] ring-2 ring-[#58CC02]/50 scale-105'
                    : isPast
                    ? 'bg-[#1CB0F6]'
                    : 'bg-[#202F36] border border-[#37464F]'
                }`}
                title={`Level ${idx + 1}: ${step.title}`}
                aria-label={`Jump to Level ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Interactive Mascot Speech Bubble with Milo Cosmetics */}
      <BeagleSpeechBubble
        mood={isCelebrating ? 'excited' : mascotPrompt.mood}
        message={isCelebrating ? "Woof hooray! You solved it! Let's read what happened next!" : mascotPrompt.message}
        subMessage={mascotPrompt.subMessage}
        soundMode={sensorySettings.soundMode}
        size="md"
        canSpeak={true}
        cosmetics={miloCosmetics}
      />

      {/* Friendly Companions Dock: Sunny + Pip Bunny with Activity Hint */}
      <div className="bg-[#18262C] border-2 border-[#28373E] rounded-3xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <AnimalCompanion
            type={activeChallengeIndex % 2 === 0 ? 'bunny' : 'cat'}
            soundMode={sensorySettings.soundMode}
            reducedMotion={sensorySettings.visualMode === 'minimal'}
            hint={currentInfo.hint}
            isCelebrating={isCelebrating}
            bubblePosition="top"
            className="flex-shrink-0"
          />
          <div>
            <span className="text-xs font-black text-[#58CC02] flex items-center gap-1">
              <span>{activeChallengeIndex % 2 === 0 ? '🐰 Pip Bunny' : '🐱 Cleo Cat'}</span>
              <span className="text-[10px] text-[#A5B8C0] font-normal">• Learning Companion</span>
            </span>
            <p className="text-xs text-[#E2E8F0] font-bold leading-tight mt-0.5">
              Tap for a warm hint or encouragement whenever you want!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:block">
            <InteractiveButterfly
              soundMode={sensorySettings.soundMode}
              reducedMotion={sensorySettings.visualMode === 'minimal'}
              color="#A855F7"
            />
          </div>
          <InteractiveSun
            soundMode={sensorySettings.soundMode}
            reducedMotion={sensorySettings.visualMode === 'minimal'}
            isCelebrating={isCelebrating}
            className="w-12 h-12 sm:w-14 sm:h-14"
          />
        </div>
      </div>

      {/* Adaptive Rule-Based Notification Banner (if triggered) */}
      {adaptiveBanner && adaptiveBanner.show && (
        <AdaptiveFeedbackBanner
          message={adaptiveBanner.message}
          category={adaptiveBanner.category}
          levelChange={adaptiveBanner.levelChange}
          onDismiss={() => setAdaptiveBanner(null)}
        />
      )}

      {/* Main Challenge Card Container (Duolingo Dark Theme) */}
      <div 
        id="active-challenge-wrapper"
        className="bg-[#18262C] rounded-3xl p-5 sm:p-7 border-2 border-[#28373E] shadow-2xl space-y-4"
      >
        {/* Dedicated Level Header with prominent Milo Moment button on each level */}
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#28373E] gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1F3D24] text-[#58CC02] font-black flex items-center justify-center text-sm border border-[#2E6B38] shadow-inner">
              {activeChallengeIndex + 1}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#58CC02]">
                Level {activeChallengeIndex + 1} of 7 Quest
              </span>
              <h2 className="text-sm sm:text-base font-black text-white leading-tight">
                {currentInfo.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`level-${activeChallengeIndex + 1}-story-btn`}
              onClick={() => {
                playGentleSound('sparkle', sensorySettings.soundMode);
                setStoryChallengeIndex(activeChallengeIndex);
                setShowInteractiveStory(prev => !prev);
              }}
              className={`px-3 py-1.5 rounded-2xl border text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
                showInteractiveStory
                  ? 'bg-[#1D3B4E] border-[#1CB0F6] text-white'
                  : 'bg-[#202F36] hover:bg-[#283942] border-[#37464F] text-[#1CB0F6]'
              }`}
              title="Play or Read Milo's interactive story for this level"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showInteractiveStory ? 'Back to Challenge' : 'Milo’s Story'}</span>
            </button>

            <button
              id={`level-${activeChallengeIndex + 1}-milo-moment-btn`}
              onClick={() => {
                playGentleSound('bark', sensorySettings.soundMode);
                setIsMiloMomentOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-2xl bg-[#202F36] hover:bg-[#283942] border-2 border-[#58CC02]/70 hover:border-[#58CC02] text-white text-xs font-black flex items-center gap-1.5 shadow-md hover:scale-105 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              title="Tap for Milo Moment (Guardian Help, Calm Break, or Pause)"
            >
              <span className="text-base">🐶</span>
              <span className="text-[#58CC02] font-black">Milo Moment</span>
            </button>
          </div>
        </div>

        {showInteractiveStory ? (
          <MiloStoryAfterChallenge
            challengeIndex={storyChallengeIndex}
            lessonTitle={lessonInfo.title}
            sensorySettings={sensorySettings}
            onContinue={handleContinueAfterStory}
            onAwardBonusGems={(amount) => {
              if (setGemsCount) setGemsCount(prev => prev + amount);
            }}
            miloCosmetics={miloCosmetics}
          />
        ) : (
          renderActiveChallenge()
        )}
      </div>

      {/* Quick Step Navigation Footer with Milo Moment button */}
      <div className="flex items-center justify-between text-xs font-bold text-[#A5B8C0] pt-1 gap-2">
        <button
          onClick={() => {
            if (activeChallengeIndex > 0) {
              playGentleSound('step', sensorySettings.soundMode);
              setActiveChallengeIndex(activeChallengeIndex - 1);
            } else {
              setCurrentView('child-welcome');
            }
          }}
          className="flex items-center gap-1 hover:text-white transition-colors px-3 py-2 rounded-xl bg-[#202F36] border border-[#37464F] hover:bg-[#283942] cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{activeChallengeIndex === 0 ? 'Back to Profile' : 'Prev Level'}</span>
        </button>

        {/* Center Milo Moment Action */}
        <button
          id="footer-milo-moment-btn"
          onClick={() => {
            playGentleSound('bark', sensorySettings.soundMode);
            setIsMiloMomentOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#202F36] hover:bg-[#283942] border border-[#58CC02]/50 text-white font-black text-xs hover:border-[#58CC02] transition-colors cursor-pointer"
        >
          <span>🐶</span>
          <span className="text-[#58CC02]">Milo Moment</span>
        </button>

        {activeChallengeIndex < 6 ? (
          <button
            onClick={() => {
              playGentleSound('step', sensorySettings.soundMode);
              setActiveChallengeIndex(activeChallengeIndex + 1);
            }}
            className="flex items-center gap-1 hover:text-white transition-colors px-3 py-2 rounded-xl bg-[#202F36] border border-[#37464F] hover:bg-[#283942] cursor-pointer"
          >
            <span>Next Level</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              setCurrentView('mission-complete');
            }}
            className="btn-duo-green flex items-center gap-1 font-black px-4 py-2 rounded-xl shadow-md cursor-pointer"
          >
            <span>Finish Quest</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 🐶 Reusable Milo Moment Modal Dialog */}
      <MiloMomentDialog
        isOpen={isMiloMomentOpen}
        onClose={() => setIsMiloMomentOpen(false)}
        sensorySettings={sensorySettings}
        onGoToBreak={() => setCurrentView('sidequest-break')}
        onGoToCaregiver={() => setCurrentView('caregiver')}
      />
    </div>
  );
};
