import React from 'react';
import { 
  UserView, 
  SensorySettings,
  MiloCosmetics 
} from '../types';
import { 
  User, 
  Layers, 
  Volume2, 
  VolumeX, 
  Volume1, 
  SlidersHorizontal, 
  RotateCcw, 
  ChevronLeft,
  BookOpen,
  Home,
  Flame,
  Diamond,
  Heart,
  ShoppingBag,
  Map as MapIcon
} from 'lucide-react';
import { playGentleSound } from '../utils/audio';
import { BeagleMascot } from './AnimalMascots';

interface Props {
  currentView: UserView;
  setCurrentView: (view: UserView) => void;
  sensorySettings: SensorySettings;
  setSensorySettings: React.Dispatch<React.SetStateAction<SensorySettings>>;
  onOpenSensoryModal: () => void;
  onResetData: () => void;
  activeChallengeIndex?: number;
  onBack?: () => void;
  gemsCount?: number;
  heartsCount?: number;
  miloCosmetics?: MiloCosmetics;
}

export const Navbar: React.FC<Props> = ({
  currentView,
  setCurrentView,
  sensorySettings,
  setSensorySettings,
  onOpenSensoryModal,
  onResetData,
  activeChallengeIndex,
  onBack,
  gemsCount = 145,
  heartsCount = 5,
  miloCosmetics
}) => {
  const toggleSound = () => {
    let nextSound: 'off' | 'soft' | 'normal';
    if (sensorySettings.soundMode === 'soft') nextSound = 'normal';
    else if (sensorySettings.soundMode === 'normal') nextSound = 'off';
    else nextSound = 'soft';

    setSensorySettings(prev => ({ ...prev, soundMode: nextSound }));
    playGentleSound('click', nextSound);
  };

  const getSoundIcon = () => {
    switch (sensorySettings.soundMode) {
      case 'off':
        return <VolumeX className="w-4 h-4 text-stone-500" />;
      case 'soft':
        return <Volume1 className="w-4 h-4 text-[#1CB0F6]" />;
      case 'normal':
        return <Volume2 className="w-4 h-4 text-[#58CC02]" />;
    }
  };

  const isChildJourney = currentView === 'child-welcome' || currentView === 'story-challenge' || currentView === 'mission-complete';

  return (
    <header 
      id="main-header"
      className="sticky top-0 z-40 bg-[#131F24]/95 backdrop-blur-md border-b-2 border-[#202F36] px-3 sm:px-6 py-2.5 transition-colors"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Back Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onBack && currentView !== 'home' && (
            <button
              id="nav-back-button"
              onClick={onBack}
              className="p-2 rounded-2xl bg-[#202F36] hover:bg-[#283942] border-2 border-[#37464F] text-[#E2E8F0] transition-all flex items-center gap-1 text-sm font-bold active:scale-95"
              title="Go Back"
              aria-label="Go back"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <button
            id="brand-logo-button"
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              setCurrentView('home');
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            {/* Beagle Mascot Avatar Icon */}
            <div className="relative">
              <BeagleMascot mood="happy" size="xs" interactive={true} cosmetics={miloCosmetics} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#58CC02] border-2 border-[#131F24]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display font-black text-xl text-white tracking-tight leading-none group-hover:text-[#58CC02] transition-colors">
                  Milo
                </span>
                <span className="hidden md:inline-block text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-[#58CC02]/20 text-[#58CC02] border border-[#58CC02]/40">
                  Adaptive Quest
                </span>
              </div>
              <span className="text-[11px] text-[#A5B8C0] hidden sm:block leading-none mt-0.5 font-bold">
                Adaptive Supermarket Adventure (4+)
              </span>
            </div>
          </button>
        </div>

        {/* Center Gamification Status Bar (Gems, Hearts) */}
        <div className="hidden md:flex items-center gap-3 bg-[#18262C] border-2 border-[#28373E] px-3.5 py-1.5 rounded-2xl shadow-inner">
          <button 
            onClick={() => {
              playGentleSound('gem', sensorySettings.soundMode);
              setCurrentView('market');
            }}
            className="flex items-center gap-1.5 text-xs font-black text-[#1CB0F6] cursor-pointer hover:scale-105 transition-transform" 
            title={`${gemsCount} Quest Gems! Click to open Milo Market`}
          >
            <Diamond className="w-4 h-4 fill-[#1CB0F6]" />
            <span>{gemsCount} Gems</span>
            <span className="text-[10px] bg-[#1CB0F6]/20 px-1.5 py-0.2 rounded-full text-[#1CB0F6] font-bold">Shop</span>
          </button>

          <div className="h-4 w-px bg-[#28373E]" />

          <div 
            className="flex items-center gap-1.5 text-xs font-black text-[#FF4B4B]" 
            title={`${heartsCount}/5 Energy Hearts`}
          >
            <Heart className="w-4 h-4 fill-[#FF4B4B]" />
            <span>{heartsCount}/5 Energy</span>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5">
          <button
            id="nav-home-button"
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              setCurrentView('home');
            }}
            className={`px-3 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
              currentView === 'home'
                ? 'bg-[#58CC02] text-white shadow-md border-b-4 border-[#46A302]'
                : 'text-[#A5B8C0] hover:text-white hover:bg-[#202F36]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            id="nav-map-button"
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              setCurrentView('map');
            }}
            className={`px-3 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
              currentView === 'map'
                ? 'bg-[#58CC02] text-white shadow-md border-b-4 border-[#46A302]'
                : 'text-[#A5B8C0] hover:text-[#58CC02] hover:bg-[#1D3B1E]'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Map</span>
          </button>

          <button
            id="nav-market-button"
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              setCurrentView('market');
            }}
            className={`px-3 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
              currentView === 'market'
                ? 'bg-[#FFC800] text-[#131F24] shadow-md border-b-4 border-[#CA8A04]'
                : 'text-[#FFC800] hover:bg-[#FFC800]/15'
            }`}
            title="Milo Market - Dress Up Milo!"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Market</span>
          </button>

          <button
            id="nav-child-mode-button"
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              setCurrentView('child-welcome');
            }}
            className={`px-3 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
              isChildJourney
                ? 'bg-[#58CC02] text-white shadow-md border-b-4 border-[#46A302]'
                : 'text-[#A5B8C0] hover:text-[#58CC02] hover:bg-[#1D3B1E]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Quest</span>
            {activeChallengeIndex !== undefined && isChildJourney && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#3B8002] text-white font-black">
                {activeChallengeIndex + 1}/7
              </span>
            )}
          </button>

          <button
            id="nav-physical-sidequest-button"
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              setCurrentView('physical');
            }}
            className={`px-3 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
              currentView === 'physical'
                ? 'bg-[#FFC800] text-[#131F24] shadow-md border-b-4 border-[#E5A500]'
                : 'text-[#A5B8C0] hover:text-[#FFC800] hover:bg-[#3D3315]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden md:inline">Physical Tiles</span>
            <span className="md:hidden">Tiles</span>
          </button>

          <button
            id="nav-guardian-dashboard-button"
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              setCurrentView('caregiver');
            }}
            className={`px-3 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
              currentView === 'caregiver'
                ? 'bg-[#1CB0F6] text-white shadow-md border-b-4 border-[#1899D6]'
                : 'text-[#A5B8C0] hover:text-[#1CB0F6] hover:bg-[#153443]'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Guardian</span>
            <span className="sm:hidden">Guardian</span>
          </button>
        </nav>

        {/* Sensory & Quick Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-sound-toggle-button"
            onClick={toggleSound}
            className="p-2 rounded-2xl bg-[#202F36] hover:bg-[#283942] border-2 border-[#37464F] text-[#E2E8F0] transition-all relative cursor-pointer"
            title={`Sound: ${sensorySettings.soundMode}`}
            aria-label={`Toggle sound mode (currently ${sensorySettings.soundMode})`}
          >
            {getSoundIcon()}
            <span className="sr-only">Toggle sound</span>
          </button>

          <button
            id="nav-sensory-settings-button"
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              onOpenSensoryModal();
            }}
            className="p-2 rounded-2xl bg-[#202F36] hover:bg-[#283942] border-2 border-[#37464F] text-[#E2E8F0] transition-all flex items-center gap-1 text-xs cursor-pointer"
            title="Sensory Settings"
            aria-label="Open sensory settings"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#1CB0F6]" />
            <span className="hidden xl:inline font-bold">Sensory</span>
          </button>

          <button
            id="nav-reset-data-button"
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              onResetData();
            }}
            className="p-2 rounded-2xl bg-[#202F36] hover:bg-[#283942] border-2 border-[#37464F] text-stone-400 hover:text-white transition-all cursor-pointer"
            title="Reset Demo Data"
            aria-label="Reset demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
