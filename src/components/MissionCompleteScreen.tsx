import React from 'react';
import { ChallengeRecord, SkillLevels, SensorySettings, UserView } from '../types';
import { 
  CheckCircle2, 
  User, 
  Layers, 
  RotateCcw, 
  Sliders,
  Flame,
  Diamond,
  Heart,
  Volume2,
  Coffee,
  Sparkles,
  MapPin
} from 'lucide-react';
import { playGentleSound, speakText } from '../utils/audio';
import { BeagleMascot } from './AnimalMascots';
import { DisclaimerBanner } from './DisclaimerBanner';

interface Props {
  challenges: ChallengeRecord[];
  skillLevels: SkillLevels;
  sensorySettings: SensorySettings;
  setCurrentView: (view: UserView) => void;
  onRestartStory: () => void;
  gemsCount?: number;
  heartsCount?: number;
}

export const MissionCompleteScreen: React.FC<Props> = ({
  challenges,
  sensorySettings,
  setCurrentView,
  onRestartStory,
  gemsCount = 245,
  heartsCount = 5
}) => {
  const completedCount = challenges.filter(c => c.completed).length;
  const totalAttempts = challenges.reduce((sum, c) => sum + c.attempts, 0);
  const accuracyPct = Math.round((completedCount / Math.max(1, totalAttempts)) * 100);

  const handleCelebrateVoice = () => {
    playGentleSound('bark', sensorySettings.soundMode);
    speakText(
      'Hooray! Milo is super proud of you! You completed the entire Supermarket Mission and earned 100 extra gems! Great job!',
      sensorySettings.soundMode
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-6 animate-fadeIn">
      {/* Header Celebration Card with Milo */}
      <div 
        id="mission-complete-card"
        className="bg-[#18262C] rounded-3xl p-6 sm:p-8 border-2 border-[#58CC02] shadow-2xl text-center space-y-5 relative overflow-hidden"
      >
        {/* Decorative Gem & Star Confetti */}
        <div className="flex justify-center -mt-2">
          <BeagleMascot mood="excited" size="lg" soundMode={sensorySettings.soundMode} />
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D24] text-[#58CC02] text-xs font-black border border-[#2E6B38] mb-2">
            <span>🎉 QUEST ACCOMPLISHED</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white">
            Market Mission Complete!
          </h1>
          <p className="text-[#A5B8C0] text-sm sm:text-base max-w-lg mx-auto mt-1 font-medium">
            Sam & Milo organized the shopping list, budgeted within ₹100, practiced polite market communication, and checked out!
          </p>

          <button
            onClick={handleCelebrateVoice}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#202F36] hover:bg-[#283942] text-[#1CB0F6] border border-[#37464F] text-xs font-black cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Milo&apos;s Cheer</span>
          </button>
        </div>

        {/* Gamification Reward Badges */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="bg-[#131F24] border-2 border-[#37464F] rounded-2xl px-5 py-2.5 flex items-center gap-3">
            <Diamond className="w-6 h-6 text-[#1CB0F6] fill-[#1CB0F6]" />
            <div className="text-left">
              <span className="text-[10px] text-[#A5B8C0] font-black uppercase">Quest Gems</span>
              <p className="text-sm font-black text-[#1CB0F6]">+{100} ({gemsCount})</p>
            </div>
          </div>

          <div className="bg-[#131F24] border-2 border-[#37464F] rounded-2xl px-5 py-2.5 flex items-center gap-3">
            <Heart className="w-6 h-6 text-[#FF4B4B] fill-[#FF4B4B]" />
            <div className="text-left">
              <span className="text-[10px] text-[#A5B8C0] font-black uppercase">Energy Hearts</span>
              <p className="text-sm font-black text-white">{heartsCount} / 5</p>
            </div>
          </div>
        </div>

        {/* Adaptive Rule-Based Observation Banner */}
        <div className="bg-[#131F24] border-2 border-[#28373E] rounded-2xl p-4 text-left flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#3B3416] text-[#FFC800] border border-[#6A5720] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FFC800] bg-[#3B3416] px-2 py-0.5 rounded border border-[#6A5720]">
                Rule-Based Adaptive Observation
              </span>
              <span className="text-[10px] font-black text-[#58CC02] bg-[#1F3D24] px-2 py-0.5 rounded border border-[#2E6B38]">
                Level Mastery Unlocked
              </span>
            </div>
            <p className="text-sm font-extrabold text-white mt-1.5 leading-snug">
              &ldquo;Milo noticed that Sam excelled with money and sequencing challenges, so subsequent quests will offer expanded budget choices.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Quest Progress Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#18262C] rounded-2xl p-4 border-2 border-[#28373E] text-center">
          <span className="text-xs text-[#A5B8C0] font-black">Completed</span>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">
            {completedCount} / 7
          </p>
          <span className="text-[11px] text-[#58CC02] font-extrabold">All Levels Clear</span>
        </div>

        <div className="bg-[#18262C] rounded-2xl p-4 border-2 border-[#28373E] text-center">
          <span className="text-xs text-[#A5B8C0] font-black">Accuracy</span>
          <p className="text-2xl sm:text-3xl font-black text-[#58CC02] mt-1">
            {accuracyPct}%
          </p>
          <span className="text-[11px] text-[#58CC02] font-extrabold">High Precision</span>
        </div>

        <div className="bg-[#18262C] rounded-2xl p-4 border-2 border-[#28373E] text-center">
          <span className="text-xs text-[#A5B8C0] font-black">Attempts</span>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">
            {totalAttempts}
          </p>
          <span className="text-[11px] text-[#A5B8C0] font-extrabold">Patient Pacing</span>
        </div>

        <div className="bg-[#18262C] rounded-2xl p-4 border-2 border-[#28373E] text-center">
          <span className="text-xs text-[#A5B8C0] font-black">Sensory State</span>
          <p className="text-2xl sm:text-3xl font-black text-[#1CB0F6] mt-1">
            Calm
          </p>
          <span className="text-[11px] text-[#1CB0F6] font-extrabold">Low Stimulation</span>
        </div>
      </div>

      {/* Challenge Breakdown List */}
      <div className="bg-[#18262C] rounded-3xl p-5 sm:p-6 border-2 border-[#28373E] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-white text-base sm:text-lg">Quest Adventure Levels</h3>
          <span className="text-xs text-[#A5B8C0] font-bold">Session Duration: ~5 mins</span>
        </div>

        <div className="divide-y divide-[#28373E] text-sm">
          {challenges.map((c, i) => (
            <div key={c.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#1F3D24] text-[#58CC02] border border-[#2E6B38] flex items-center justify-center text-xs font-black">
                  {i + 1}
                </div>
                <div>
                  <p className="font-black text-white">{c.title}</p>
                  <p className="text-xs text-[#A5B8C0] font-medium">{c.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-xl bg-[#202F36] text-[#A5B8C0] font-bold border border-[#37464F]">
                  {c.attempts} {c.attempts === 1 ? 'attempt' : 'attempts'}
                </span>
                <CheckCircle2 className="w-5 h-5 text-[#58CC02]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Flow Action Buttons */}
      <div className="space-y-3">
        <button
          id="go-to-break-sidequest-cta"
          onClick={() => {
            playGentleSound('sparkle', sensorySettings.soundMode);
            setCurrentView('sidequest-break');
          }}
          className="w-full py-4 px-6 rounded-2xl btn-duo-green text-white font-black text-base shadow-xl flex items-center justify-center gap-3 cursor-pointer uppercase tracking-wider"
        >
          <Coffee className="w-5 h-5" />
          <span>START POST-LESSON BREAK QUEST (WATER / STRETCH) 🥤</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            id="view-world-map-cta"
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              setCurrentView('map');
            }}
            className="py-4 px-4 rounded-2xl bg-[#202F36] hover:bg-[#283942] border-2 border-[#37464F] text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <MapPin className="w-4 h-4 text-[#58CC02]" />
            <span>Lessons Map</span>
          </button>

          <button
            id="view-guardian-dashboard-cta"
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              setCurrentView('caregiver');
            }}
            className="py-4 px-4 rounded-2xl btn-duo-blue text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <User className="w-4 h-4" />
            <span>Guardian Hub</span>
          </button>

          <button
            id="try-physical-sidequest-cta"
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              setCurrentView('physical');
            }}
            className="py-4 px-4 rounded-2xl btn-duo-yellow text-stone-900 font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <Layers className="w-4 h-4" />
            <span>Physical Tiles</span>
          </button>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
};
