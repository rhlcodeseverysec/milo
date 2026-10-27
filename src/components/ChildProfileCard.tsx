import React from 'react';
import { ChildProfile, SensorySettings } from '../types';
import { 
  Eye, 
  Clock, 
  Volume1, 
  Compass,
  ArrowRight,
  Flame,
  Diamond,
  Heart,
  SlidersHorizontal,
  Volume2
} from 'lucide-react';
import { playGentleSound, speakText } from '../utils/audio';
import { BeagleMascot, BeagleSpeechBubble } from './AnimalMascots';
import { AnimalCompanion } from './interactive/InteractiveAnimalCast';
import { MiloCosmetics } from '../types';

interface Props {
  profile: ChildProfile;
  sensorySettings: SensorySettings;
  onStartStory: () => void;
  onOpenSensorySettings: () => void;
  gemsCount?: number;
  heartsCount?: number;
  miloCosmetics?: MiloCosmetics;
}

export const ChildProfileCard: React.FC<Props> = ({
  profile,
  sensorySettings,
  onStartStory,
  onOpenSensorySettings,
  gemsCount = 145,
  heartsCount = 5,
  miloCosmetics
}) => {
  const handleReadAloud = () => {
    playGentleSound('bark', sensorySettings.soundMode);
    speakText(
      `Hello ${profile.name}! I am Milo! Ready to go shopping at Green Valley Market? Let us start our adventure!`,
      sensorySettings.soundMode
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 animate-fadeIn space-y-6">
      {/* Friendly Milo Mascot Speech Bubble with Cosmetics */}
      <BeagleSpeechBubble
        mood="waving"
        message={`Hey ${profile.name}! Are you ready for today's market adventure with Milo?`}
        subMessage="We will earn gems, explore new lessons, and master fun skills together!"
        soundMode={sensorySettings.soundMode}
        size="md"
        cosmetics={miloCosmetics}
        actionButton={{
          label: 'Listen to Milo',
          onClick: handleReadAloud
        }}
      />

      {/* Duolingo Dark Child Profile Quest Card */}
      <div 
        id="child-welcome-card"
        className="bg-[#18262C] rounded-3xl p-6 sm:p-8 border-2 border-[#28373E] shadow-2xl space-y-6"
      >
        {/* Profile Card Summary Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#28373E] flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#131F24] border-2 border-[#37464F] flex items-center justify-center text-3xl">
              {profile.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">{profile.name}</h2>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#1F3D24] text-[#58CC02] border border-[#2E6B38]">
                  Age {profile.age}+
                </span>
              </div>
              <p className="text-xs text-[#A5B8C0] font-medium">Milo&apos;s Supermarket Explorer</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-black bg-[#202F36] border border-[#37464F] px-2.5 py-1 rounded-xl text-[#1CB0F6]">
              <Diamond className="w-3.5 h-3.5 fill-[#1CB0F6]" />
              <span>{gemsCount} Gems</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-black bg-[#202F36] border border-[#37464F] px-2.5 py-1 rounded-xl text-[#FF4B4B]">
              <Heart className="w-3.5 h-3.5 fill-[#FF4B4B]" />
              <span>{heartsCount} Energy</span>
            </div>
          </div>
        </div>

        {/* Personalized Learning Badges */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#A5B8C0]">
            Personalized Sensory Settings for {profile.name}:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-[#131F24] rounded-2xl p-3 border border-[#28373E] flex items-center gap-2.5 text-xs font-bold text-white">
              <div className="w-8 h-8 rounded-xl bg-[#1F3D24] text-[#58CC02] flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <span>Visual cues & big buttons</span>
            </div>

            <div className="bg-[#131F24] rounded-2xl p-3 border border-[#28373E] flex items-center gap-2.5 text-xs font-bold text-white">
              <div className="w-8 h-8 rounded-xl bg-[#3B3416] text-[#FFC800] flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <span>Short micro-steps</span>
            </div>

            <div className="bg-[#131F24] rounded-2xl p-3 border border-[#28373E] flex items-center gap-2.5 text-xs font-bold text-white">
              <div className="w-8 h-8 rounded-xl bg-[#143343] text-[#1CB0F6] flex items-center justify-center flex-shrink-0">
                <Volume1 className="w-4 h-4" />
              </div>
              <span>Calm beagle sound cues</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#A5B8C0] pt-1">
            <span>Sensory Mode: <strong className="text-white capitalize">{sensorySettings.visualMode}</strong> • Sound: <strong className="text-white capitalize">{sensorySettings.soundMode}</strong></span>
            <button
              onClick={() => {
                playGentleSound('click', sensorySettings.soundMode);
                onOpenSensorySettings();
              }}
              className="text-[#1CB0F6] hover:text-[#58CC02] font-black flex items-center gap-1 underline underline-offset-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Customize</span>
            </button>
          </div>
        </div>

        {/* Story Intro Card */}
        <div className="bg-[#131F24] border-2 border-[#202F36] rounded-2xl p-4 flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#1F3D24] border border-[#2E6B38] text-[#58CC02] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-white text-sm">Today&apos;s Adventure: &ldquo;A Day at the Supermarket&rdquo;</h4>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#58CC02] text-white">7 Levels</span>
            </div>
            <p className="text-xs text-[#A5B8C0] mt-1 leading-relaxed font-medium">
              Help Sam and Milo select healthy items, calculate totals, stay within the ₹100 budget, communicate with the friendly shopkeeper, and solve unexpected problems!
            </p>
          </div>
        </div>

        {/* Companion Encouragement Card */}
        <div className="bg-[#131F24] border-2 border-[#202F36] rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AnimalCompanion
              type="cat"
              soundMode={sensorySettings.soundMode}
              reducedMotion={sensorySettings.visualMode === 'minimal'}
              bubblePosition="top"
              className="flex-shrink-0"
            />
            <div>
              <span className="text-xs font-black text-[#FDBA74]">Cleo Cat</span>
              <p className="text-[11px] text-[#CBD5E1] font-bold">
                Tap me to hear a gentle purr! Remember to have fun at your own pace.
              </p>
            </div>
          </div>
        </div>

        {/* Big Chunky 3D CTA Button */}
        <div>
          <button
            id="start-learning-journey-button"
            onClick={() => {
              playGentleSound('step', sensorySettings.soundMode);
              onStartStory();
            }}
            className="w-full py-4 px-8 rounded-2xl btn-duo-green text-lg font-black flex items-center justify-center gap-3 cursor-pointer shadow-xl group tracking-wide uppercase"
          >
            <span>START STORY ADVENTURE</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
