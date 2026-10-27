import React, { useState } from 'react';
import { UserView, SensorySettings, MiloCosmetics } from '../types';
import { 
  BookOpen, 
  User, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  HeartHandshake, 
  EyeOff, 
  Clock,
  ArrowRight,
  Flame,
  Diamond,
  Heart,
  Star,
  Volume2,
  ShoppingBag
} from 'lucide-react';
import { playGentleSound, speakText } from '../utils/audio';
import { DisclaimerBanner } from './DisclaimerBanner';
import { BeagleMascot, BeagleSpeechBubble } from './AnimalMascots';
import { InteractiveSun } from './interactive/InteractiveSun';
import { InteractiveCloud } from './interactive/InteractiveCloud';
import { InteractiveButterfly, InteractiveFlower, InteractiveStar } from './interactive/InteractiveNature';
import { AnimalCompanion } from './interactive/InteractiveAnimalCast';

interface Props {
  setCurrentView: (view: UserView) => void;
  sensorySettings: SensorySettings;
  gemsCount?: number;
  heartsCount?: number;
  miloCosmetics?: MiloCosmetics;
}

export const LandingHero: React.FC<Props> = ({ 
  setCurrentView, 
  sensorySettings,
  gemsCount = 145,
  heartsCount = 5,
  miloCosmetics
}) => {
  const [beagleMood, setBeagleMood] = useState<'happy' | 'cheering' | 'talking' | 'excited'>('happy');
  const [petCount, setPetCount] = useState(0);

  const handlePetBeagle = () => {
    setPetCount(prev => prev + 1);
    setBeagleMood('excited');
    playGentleSound('bark', sensorySettings.soundMode);
    setTimeout(() => setBeagleMood('happy'), 1200);
  };

  const handleSpeakWelcome = () => {
    playGentleSound('bark', sensorySettings.soundMode);
    speakText(
      "Woof! Welcome to Milo! I am Milo your friendly buddy. Let us go on a calm learning adventure together!",
      sensorySettings.soundMode
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8 sm:space-y-10">
      {/* Top Gamification Bar for Mobile/Tablet */}
      <div className="flex sm:hidden items-center justify-around bg-[#18262C] border-2 border-[#28373E] px-4 py-2 rounded-2xl">
        <div className="flex items-center gap-1.5 text-xs font-black text-[#1CB0F6]">
          <Diamond className="w-4 h-4 fill-[#1CB0F6]" />
          <span>{gemsCount} GEMS</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-black text-[#FF4B4B]">
          <Heart className="w-4 h-4 fill-[#FF4B4B]" />
          <span>{heartsCount}/5 ENERGY</span>
        </div>
      </div>

      {/* Interactive Sky & Nature Welcome Atmosphere */}
      <div className="relative bg-gradient-to-b from-[#18262C] to-[#131F24] border-2 border-[#28373E] rounded-3xl p-5 sm:p-7 shadow-xl overflow-hidden">
        {/* Sky Elements: Interactive Sun & Draggable Floating Cloud */}
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <InteractiveCloud
              id="hero-cloud"
              soundMode={sensorySettings.soundMode}
              reducedMotion={sensorySettings.visualMode === 'minimal'}
            />
            <div className="hidden sm:block">
              <InteractiveButterfly
                soundMode={sensorySettings.soundMode}
                reducedMotion={sensorySettings.visualMode === 'minimal'}
                color="#38BDF8"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <InteractiveFlower
                soundMode={sensorySettings.soundMode}
                reducedMotion={sensorySettings.visualMode === 'minimal'}
                petalColor="#F472B6"
              />
            </div>
            <InteractiveSun
              soundMode={sensorySettings.soundMode}
              reducedMotion={sensorySettings.visualMode === 'minimal'}
            />
          </div>
        </div>

        {/* Main Stage Text */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F3A24] border border-[#2D6A35] text-[#58CC02] text-xs font-black tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Milo&apos;s Quest & Companions</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Calm Learning Quests for Young Explorers (4+)
          </h1>

          <p className="text-base sm:text-lg text-[#A5B8C0] leading-relaxed max-w-2xl mx-auto font-bold">
            A cheerful, screen-optional adventure with your loyal companion Milo featuring 3 story lessons, interactive animal buddies, and calm sensory pacing tailored for autism, ADHD, and early learners.
          </p>

          {/* Interactive Mascot Speech Bubble with Read-Aloud & Custom Cosmetics */}
          <div className="pt-2 max-w-xl mx-auto text-left">
            <BeagleSpeechBubble
              mood={beagleMood}
              message="Woof! I'm Milo! Ready to explore the Green Valley Supermarket with me?"
              subMessage="Tap my nose to hear a happy sound, or visit the Market to try on fun hats and scarves!"
              soundMode={sensorySettings.soundMode}
              size="lg"
              cosmetics={miloCosmetics}
              actionButton={{
                label: 'Listen to Milo',
                onClick: handleSpeakWelcome
              }}
            />
          </div>

          {/* Interactive Companions & Market Bar */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left">
            {/* Barnaby Bear Companion Card */}
            <div className="bg-[#18262C] border-2 border-[#28373E] rounded-3xl p-3.5 flex items-center gap-3 shadow-md">
              <AnimalCompanion
                type="bear"
                soundMode={sensorySettings.soundMode}
                reducedMotion={sensorySettings.visualMode === 'minimal'}
                bubblePosition="top"
                className="flex-shrink-0"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-black text-[#FBBF24] block">Barnaby Bear</span>
                <p className="text-[11px] text-[#A5B8C0] font-bold leading-tight">
                  Tap me for gentle words of encouragement! 🐾
                </p>
              </div>
            </div>

            {/* Milo Market Quick Shortcut Card */}
            <div 
              onClick={() => {
                playGentleSound('sparkle', sensorySettings.soundMode);
                setCurrentView('market');
              }}
              className="bg-[#202F36] hover:bg-[#283942] border-2 border-[#FFC800]/40 hover:border-[#FFC800] rounded-3xl p-3.5 flex items-center justify-between gap-3 shadow-md cursor-pointer transition-all active:scale-95 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFC800]/20 border border-[#FFC800]/40 flex items-center justify-center text-[#FFC800]">
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <span className="text-xs font-black text-white flex items-center gap-1">
                    <span>Milo Market</span>
                    <span className="text-[10px] text-[#58CC02] font-black">NEW</span>
                  </span>
                  <span className="text-[11px] text-[#A5B8C0] font-bold block">
                    {gemsCount} gems available
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#FFC800] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Core Inclusivity Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-black text-[#E2E8F0]">
            <span className="px-3 py-1.5 rounded-2xl bg-[#202F36] border-2 border-[#37464F] text-[#58CC02] flex items-center gap-1">
              🌱 Age 4+ Friendly
            </span>
            <span className="px-3 py-1.5 rounded-2xl bg-[#202F36] border-2 border-[#37464F] text-[#1CB0F6] flex items-center gap-1">
              🔊 Spoken Voice Support
            </span>
            <span className="px-3 py-1.5 rounded-2xl bg-[#202F36] border-2 border-[#37464F] text-[#FFC800] flex items-center gap-1">
              🧘 Zero Flashes or Pressure
            </span>
            <span className="px-3 py-1.5 rounded-2xl bg-[#202F36] border-2 border-[#37464F] text-[#CE82FF] flex items-center gap-1">
              🧩 7 Story Milestones
            </span>
          </div>
        </div>
      </div>

      {/* Main Mode Selection Cards - Duolingo 3D Button Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Child Mode Card (Duolingo Lime Green Theme) */}
        <div 
          id="hero-child-mode-card"
          className="bg-[#18262C] rounded-3xl p-6 sm:p-8 border-2 border-[#2E4A35] hover:border-[#58CC02] shadow-2xl transition-all flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-[#1F3D24] border-2 border-[#2E6B38] flex items-center justify-center">
                <BeagleMascot mood="happy" size="sm" />
              </div>
              <span className="text-xs uppercase font-black tracking-wider text-[#58CC02] bg-[#1A3824] px-3 py-1 rounded-full border border-[#2E6B38]">
                Milo&apos;s Quest
              </span>
            </div>

            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white mt-2 flex items-center gap-2">
                <span>Child Quest Mode</span>
                <Star className="w-5 h-5 text-[#FFC800] fill-[#FFC800]" />
              </h2>
              <p className="text-[#A5B8C0] text-sm mt-2 leading-relaxed font-medium">
                Join Sam & Milo in <strong>&ldquo;A Day at the Supermarket&rdquo;</strong>. Explore 7 interactive story challenges combining visual sequencing, coin counting, friendly greetings, and puzzle solving!
              </p>
            </div>

            <div className="bg-[#131F24] rounded-2xl p-4 border border-[#263842] space-y-2.5 text-xs text-[#CBD5E1] font-bold">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#58CC02] flex-shrink-0" />
                <span>Large high-contrast touch buttons for fine motor ease</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#58CC02] flex-shrink-0" />
                <span>Audio read-aloud buttons for non-readers & age 4+</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#58CC02] flex-shrink-0" />
                <span>Gentle adaptive hints with Milo</span>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <button
              id="hero-start-child-mode-button"
              onClick={() => {
                playGentleSound('click', sensorySettings.soundMode);
                setCurrentView('child-welcome');
              }}
              className="w-full py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-xl tracking-wide uppercase"
            >
              <BookOpen className="w-5 h-5" />
              <span>START CHILD QUEST</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              id="hero-open-world-map-button"
              onClick={() => {
                playGentleSound('click', sensorySettings.soundMode);
                setCurrentView('map');
              }}
              className="w-full py-3 px-4 rounded-2xl bg-[#202F36] hover:bg-[#283942] text-white border-2 border-[#37464F] text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>🗺️ VIEW LESSONS WORLD MAP (3 LESSONS)</span>
            </button>
          </div>
        </div>

        {/* Guardian Dashboard Card (Duolingo Sky Blue Theme) */}
        <div 
          id="hero-guardian-mode-card"
          className="bg-[#18262C] rounded-3xl p-6 sm:p-8 border-2 border-[#1E3B4D] hover:border-[#1CB0F6] shadow-2xl transition-all flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-[#143343] border-2 border-[#1B5775] flex items-center justify-center">
                <User className="w-8 h-8 text-[#1CB0F6]" />
              </div>
              <span className="text-xs uppercase font-black tracking-wider text-[#1CB0F6] bg-[#123140] px-3 py-1 rounded-full border border-[#1B5775]">
                Parents & Guardians
              </span>
            </div>

            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white mt-2 flex items-center gap-2">
                <span>Guardian Dashboard</span>
              </h2>
              <p className="text-[#A5B8C0] text-sm mt-2 leading-relaxed font-medium">
                Review skill growth trajectories, track challenge completion, customize sensory settings, and set healthy screen-time limits.
              </p>
            </div>

            <div className="bg-[#131F24] rounded-2xl p-4 border border-[#263842] space-y-2.5 text-xs text-[#CBD5E1] font-bold">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1CB0F6] flex-shrink-0" />
                <span>Skill breakdown: Sequencing, Math, Communication</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1CB0F6] flex-shrink-0" />
                <span>Screen-time auto session timers & pause prompts</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1CB0F6] flex-shrink-0" />
                <span>Custom sensory profiles (Visual, Audio, Instructions)</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              id="hero-open-guardian-button"
              onClick={() => {
                playGentleSound('click', sensorySettings.soundMode);
                setCurrentView('caregiver');
              }}
              className="w-full py-4 px-6 rounded-2xl btn-duo-blue text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-xl tracking-wide uppercase"
            >
              <User className="w-5 h-5" />
              <span>OPEN GUARDIAN DASHBOARD</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Physical Sidequest Banner (Duolingo Gold Theme) */}
      <div 
        id="hero-physical-sidequest-card"
        className="bg-[#1F2C24] rounded-3xl p-6 border-2 border-[#473B1B] hover:border-[#FFC800] flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors shadow-lg"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#3B3416] border-2 border-[#6A5720] flex items-center justify-center flex-shrink-0">
            <Layers className="w-7 h-7 text-[#FFC800]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-black text-lg text-white">
                Physical Play Demonstration: Morning Routine Tiles
              </h3>
              <span className="text-[11px] font-black bg-[#FFC800] text-[#131F24] px-2.5 py-0.5 rounded-full">
                Tactile Screen-Optional
              </span>
            </div>
            <p className="text-sm text-[#CBD5E1] mt-1 font-medium">
              Explore how physical wooden sequence tiles integrate with digital tracking for restorative tactile sensory breaks.
            </p>
          </div>
        </div>

        <button
          id="hero-try-physical-button"
          onClick={() => {
            playGentleSound('click', sensorySettings.soundMode);
            setCurrentView('physical');
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-duo-yellow text-sm font-black whitespace-nowrap shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>TRY PHYSICAL TILES</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Core Principles Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-[#18262C] rounded-2xl p-5 border-2 border-[#28373E] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#1A3828] border border-[#2D6A3E] text-[#58CC02] flex items-center justify-center font-bold">
            <EyeOff className="w-5 h-5" />
          </div>
          <h4 className="font-black text-white text-base">Low-Stimulation Focus</h4>
          <p className="text-xs text-[#A5B8C0] leading-relaxed font-medium">
            Eye-friendly dark palette, generous touch targets, clear fonts, and calm tactile chimes.
          </p>
        </div>

        <div className="bg-[#18262C] rounded-2xl p-5 border-2 border-[#28373E] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#143343] border border-[#1B5775] text-[#1CB0F6] flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h4 className="font-black text-white text-base">Empathetic Coaching</h4>
          <p className="text-xs text-[#A5B8C0] leading-relaxed font-medium">
            Zero negative punishment. Explains cause and effect with supportive Beagle barks & cheers.
          </p>
        </div>

        <div className="bg-[#18262C] rounded-2xl p-5 border-2 border-[#28373E] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#352044] border border-[#5C3278] text-[#CE82FF] flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-black text-white text-base">Paced Screen Boundaries</h4>
          <p className="text-xs text-[#A5B8C0] leading-relaxed font-medium">
            Short micro-quests (2 to 10 min) prevent sensory overload and encourage physical breaks.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
};
