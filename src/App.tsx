import React, { useState, useEffect } from 'react';
import { 
  UserView, 
  SensorySettings, 
  CaregiverSettings, 
  ChildProfile, 
  ChallengeRecord, 
  SkillLevels,
  LessonId,
  LessonProgress,
  MiloCosmetics 
} from './types';
import { 
  DEFAULT_CHILD_PROFILE, 
  DEFAULT_SENSORY_SETTINGS, 
  DEFAULT_CAREGIVER_SETTINGS, 
  DEFAULT_SKILL_LEVELS, 
  DEFAULT_CHALLENGES,
  DEFAULT_MILO_COSMETICS,
  loadStoredData,
  saveStoredData,
  clearAllData
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { ChildProfileCard } from './components/ChildProfileCard';
import { StoryJourneyContainer } from './components/StoryJourneyContainer';
import { LessonsWorldMap } from './components/LessonsWorldMap';
import { BreakSidequest } from './components/BreakSidequest';
import { MemoryFlashcardsGame } from './components/MemoryFlashcardsGame';
import { MissionCompleteScreen } from './components/MissionCompleteScreen';
import { CaregiverDashboard } from './components/CaregiverDashboard';
import { PhysicalSidequest } from './components/PhysicalSidequest';
import { SensorySettingsModal } from './components/SensorySettingsModal';
import { ParentalGateModal } from './components/ParentalGateModal';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { MiloMarket } from './components/MiloMarket';

const DEFAULT_LESSONS_PROGRESS: Record<LessonId, LessonProgress> = {
  1: {
    lessonId: 1,
    challengesCompleted: 7,
    isCompleted: true,
    breakCompleted: true,
    memoryGameCompleted: true,
    starsEarned: 3
  },
  2: {
    lessonId: 2,
    challengesCompleted: 0,
    isCompleted: false,
    breakCompleted: false,
    memoryGameCompleted: false,
    starsEarned: 0
  },
  3: {
    lessonId: 3,
    challengesCompleted: 0,
    isCompleted: false,
    breakCompleted: false,
    memoryGameCompleted: false,
    starsEarned: 0
  }
};

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<UserView>('home');
  const [currentLessonId, setCurrentLessonId] = useState<LessonId>(1);
  const [activeChallengeIndex, setActiveChallengeIndex] = useState<number>(0);
  const [isSensoryModalOpen, setIsSensoryModalOpen] = useState<boolean>(false);
  const [gemsCount, setGemsCount] = useState<number>(145);
  const [isParentalGateOpen, setIsParentalGateOpen] = useState<boolean>(false);
  const [isParentUnlocked, setIsParentUnlocked] = useState<boolean>(false);

  const handleNavigateView = (view: UserView) => {
    if (view === 'caregiver' && !isParentUnlocked) {
      setIsParentalGateOpen(true);
      return;
    }
    setCurrentView(view);
  };

  // Persistent App State
  const [childProfile] = useState<ChildProfile>(() => 
    loadStoredData<ChildProfile>('child_profile', DEFAULT_CHILD_PROFILE)
  );

  const [sensorySettings, setSensorySettings] = useState<SensorySettings>(() =>
    loadStoredData<SensorySettings>('sensory_settings', DEFAULT_SENSORY_SETTINGS)
  );

  const [caregiverSettings, setCaregiverSettings] = useState<CaregiverSettings>(() =>
    loadStoredData<CaregiverSettings>('caregiver_settings', DEFAULT_CAREGIVER_SETTINGS)
  );

  const [skillLevels, setSkillLevels] = useState<SkillLevels>(() =>
    loadStoredData<SkillLevels>('skill_levels', DEFAULT_SKILL_LEVELS)
  );

  const [challenges, setChallenges] = useState<ChallengeRecord[]>(() =>
    loadStoredData<ChallengeRecord[]>('challenges', DEFAULT_CHALLENGES)
  );

  const [lessonsProgress, setLessonsProgress] = useState<Record<LessonId, LessonProgress>>(() =>
    loadStoredData<Record<LessonId, LessonProgress>>('lessons_progress', DEFAULT_LESSONS_PROGRESS)
  );

  const [miloCosmetics, setMiloCosmetics] = useState<MiloCosmetics>(() =>
    loadStoredData<MiloCosmetics>('milo_cosmetics', DEFAULT_MILO_COSMETICS)
  );

  // Sync to localStorage
  useEffect(() => {
    saveStoredData('milo_cosmetics', miloCosmetics);
  }, [miloCosmetics]);

  useEffect(() => {
    saveStoredData('sensory_settings', sensorySettings);
  }, [sensorySettings]);

  useEffect(() => {
    saveStoredData('caregiver_settings', caregiverSettings);
  }, [caregiverSettings]);

  useEffect(() => {
    saveStoredData('skill_levels', skillLevels);
  }, [skillLevels]);

  useEffect(() => {
    saveStoredData('challenges', challenges);
  }, [challenges]);

  useEffect(() => {
    saveStoredData('lessons_progress', lessonsProgress);
  }, [lessonsProgress]);

  // Lesson milestone handlers
  const handleLessonMissionComplete = (lessonId: LessonId) => {
    setLessonsProgress(prev => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        challengesCompleted: 7,
        isCompleted: true,
        starsEarned: Math.max(prev[lessonId]?.starsEarned || 0, 3)
      }
    }));
    setGemsCount(prev => prev + 50);
  };

  const handleBreakComplete = (lessonId: LessonId) => {
    setLessonsProgress(prev => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        breakCompleted: true
      }
    }));
    setGemsCount(prev => prev + 30);
  };

  const handleMemoryGameComplete = (lessonId: LessonId) => {
    setLessonsProgress(prev => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        memoryGameCompleted: true
      }
    }));
    setGemsCount(prev => prev + 40);
  };

  // Reset Demo handler
  const handleResetData = () => {
    if (window.confirm('Reset all demo progress and restored settings to fresh state?')) {
      clearAllData();
      setSensorySettings(DEFAULT_SENSORY_SETTINGS);
      setCaregiverSettings(DEFAULT_CAREGIVER_SETTINGS);
      setSkillLevels(DEFAULT_SKILL_LEVELS);
      setChallenges(DEFAULT_CHALLENGES);
      setLessonsProgress(DEFAULT_LESSONS_PROGRESS);
      setMiloCosmetics(DEFAULT_MILO_COSMETICS);
      setCurrentLessonId(1);
      setActiveChallengeIndex(0);
      setGemsCount(145);
      setCurrentView('home');
    }
  };

  const handleStartStory = (lessonId: LessonId = 1) => {
    setCurrentLessonId(lessonId);
    setActiveChallengeIndex(0);
    setCurrentView('story-challenge');
  };

  const handleRestartStory = () => {
    setActiveChallengeIndex(0);
    setCurrentView('story-challenge');
  };

  const handleStartBreak = (lessonId: LessonId) => {
    setCurrentLessonId(lessonId);
    setCurrentView('sidequest-break');
  };

  const handleStartMemoryGame = (lessonId: LessonId) => {
    setCurrentLessonId(lessonId);
    setCurrentView('memory-game');
  };

  const handleNextLesson = () => {
    if (currentLessonId < 3) {
      const nextId = (currentLessonId + 1) as LessonId;
      setCurrentLessonId(nextId);
      setActiveChallengeIndex(0);
      setCurrentView('story-challenge');
    } else {
      setCurrentView('map');
    }
  };

  const handleNavBack = () => {
    if (currentView === 'story-challenge') {
      setCurrentView('map');
    } else if (currentView === 'sidequest-break' || currentView === 'memory-game') {
      setCurrentView('map');
    } else if (currentView === 'mission-complete') {
      setCurrentView('map');
    } else if (currentView === 'market') {
      setCurrentView('map');
    } else {
      setCurrentView('home');
    }
  };

  const isMinimal = sensorySettings.visualMode === 'minimal';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isMinimal 
        ? 'low-stim-minimal bg-[#0E171B] text-[#E5E5E5]' 
        : 'bg-[#131F24] text-white'
    }`}>
      {/* Top Accessible Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={handleNavigateView}
        sensorySettings={sensorySettings}
        setSensorySettings={setSensorySettings}
        onOpenSensoryModal={() => setIsSensoryModalOpen(true)}
        onResetData={handleResetData}
        activeChallengeIndex={currentView === 'story-challenge' ? activeChallengeIndex : undefined}
        onBack={currentView !== 'home' ? handleNavBack : undefined}
        gemsCount={gemsCount}
        miloCosmetics={miloCosmetics}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentView === 'home' && (
          <LandingHero
            setCurrentView={handleNavigateView}
            sensorySettings={sensorySettings}
            gemsCount={gemsCount}
            miloCosmetics={miloCosmetics}
          />
        )}

        {currentView === 'map' && (
          <LessonsWorldMap
            currentLessonId={currentLessonId}
            setCurrentLessonId={setCurrentLessonId}
            lessonsProgress={lessonsProgress}
            sensorySettings={sensorySettings}
            onStartLesson={(id) => handleStartStory(id)}
            onStartBreak={(id) => handleStartBreak(id)}
            onStartMemoryGame={(id) => handleStartMemoryGame(id)}
            onOpenCaregiver={() => handleNavigateView('caregiver')}
            gemsCount={gemsCount}
            miloCosmetics={miloCosmetics}
          />
        )}

        {currentView === 'child-welcome' && (
          <ChildProfileCard
            profile={childProfile}
            sensorySettings={sensorySettings}
            onStartStory={() => handleStartStory(currentLessonId)}
            onOpenSensorySettings={() => setIsSensoryModalOpen(true)}
            gemsCount={gemsCount}
            miloCosmetics={miloCosmetics}
          />
        )}

        {currentView === 'story-challenge' && (
          <StoryJourneyContainer
            challenges={challenges}
            setChallenges={setChallenges}
            skillLevels={skillLevels}
            setSkillLevels={setSkillLevels}
            sensorySettings={sensorySettings}
            setCurrentView={handleNavigateView}
            activeChallengeIndex={activeChallengeIndex}
            setActiveChallengeIndex={setActiveChallengeIndex}
            currentLessonId={currentLessonId}
            setCurrentLessonId={setCurrentLessonId}
            gemsCount={gemsCount}
            setGemsCount={setGemsCount}
            onCompleteLessonMission={handleLessonMissionComplete}
            miloCosmetics={miloCosmetics}
          />
        )}

        {currentView === 'sidequest-break' && (
          <BreakSidequest
            lessonId={currentLessonId}
            sensorySettings={sensorySettings}
            onCompleteBreak={() => handleBreakComplete(currentLessonId)}
            onGoToMemoryGame={() => setCurrentView('memory-game')}
            onGoToMap={() => setCurrentView('map')}
          />
        )}

        {currentView === 'memory-game' && (
          <MemoryFlashcardsGame
            lessonId={currentLessonId}
            sensorySettings={sensorySettings}
            onCompleteGame={() => handleMemoryGameComplete(currentLessonId)}
            onNextLesson={currentLessonId < 3 ? handleNextLesson : undefined}
            onGoToMap={() => setCurrentView('map')}
          />
        )}

        {currentView === 'mission-complete' && (
          <MissionCompleteScreen
            challenges={challenges}
            skillLevels={skillLevels}
            sensorySettings={sensorySettings}
            setCurrentView={handleNavigateView}
            onRestartStory={handleRestartStory}
          />
        )}

        {currentView === 'caregiver' && (
          <CaregiverDashboard
            challenges={challenges}
            skillLevels={skillLevels}
            sensorySettings={sensorySettings}
            setSensorySettings={setSensorySettings}
            caregiverSettings={caregiverSettings}
            setCaregiverSettings={setCaregiverSettings}
            setCurrentView={handleNavigateView}
            onLockDashboard={() => {
              setIsParentUnlocked(false);
              setCurrentView('map');
            }}
          />
        )}

        {currentView === 'physical' && (
          <PhysicalSidequest
            sensorySettings={sensorySettings}
            setCurrentView={handleNavigateView}
          />
        )}

        {currentView === 'market' && (
          <MiloMarket
            gemsCount={gemsCount}
            setGemsCount={setGemsCount}
            miloCosmetics={miloCosmetics}
            setMiloCosmetics={setMiloCosmetics}
            sensorySettings={sensorySettings}
            setCurrentView={handleNavigateView}
          />
        )}
      </main>

      {/* Parental Gate Modal for Protected Parent Experience */}
      <ParentalGateModal
        isOpen={isParentalGateOpen}
        onClose={() => setIsParentalGateOpen(false)}
        onSuccess={() => {
          setIsParentUnlocked(true);
          setCurrentView('caregiver');
        }}
        sensorySettings={sensorySettings}
        storedPin={caregiverSettings.parentPin || '1234'}
      />

      {/* Sensory Settings Modal */}
      <SensorySettingsModal
        isOpen={isSensoryModalOpen}
        onClose={() => setIsSensoryModalOpen(false)}
        sensorySettings={sensorySettings}
        setSensorySettings={setSensorySettings}
      />

      {/* Sticky Compact Disclaimer Footer */}
      <footer className="mt-auto">
        <DisclaimerBanner compact={true} />
      </footer>
    </div>
  );
}
