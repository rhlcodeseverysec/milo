import React, { useState } from 'react';
import { 
  ChallengeRecord, 
  SkillLevels, 
  SensorySettings, 
  CaregiverSettings,
  VisualMode,
  SoundMode,
  InstructionMode,
  UserView
} from '../types';
import { 
  Clock, 
  Sliders, 
  Eye, 
  Volume2, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  Calendar,
  Plus,
  Trash2,
  ShieldCheck,
  Award,
  Sparkles,
  Heart,
  Diamond,
  Lock,
  KeyRound
} from 'lucide-react';
import { playGentleSound } from '../utils/audio';
import { DisclaimerBanner } from './DisclaimerBanner';
import { BeagleMascot } from './AnimalMascots';

interface Props {
  challenges: ChallengeRecord[];
  skillLevels: SkillLevels;
  sensorySettings: SensorySettings;
  setSensorySettings: React.Dispatch<React.SetStateAction<SensorySettings>>;
  caregiverSettings: CaregiverSettings;
  setCaregiverSettings: React.Dispatch<React.SetStateAction<CaregiverSettings>>;
  setCurrentView: (view: UserView) => void;
  onLockDashboard?: () => void;
}

export const CaregiverDashboard: React.FC<Props> = ({
  challenges,
  skillLevels,
  sensorySettings,
  setSensorySettings,
  caregiverSettings,
  setCaregiverSettings,
  setCurrentView,
  onLockDashboard
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'screen-time' | 'sensory' | 'parent-gate'>('overview');
  const [pinChangeInput, setPinChangeInput] = useState(caregiverSettings.parentPin || '1234');
  const [pinSavedMsg, setPinSavedMsg] = useState('');
  const [newSessionStart, setNewSessionStart] = useState('15:00');
  const [newSessionEnd, setNewSessionEnd] = useState('15:20');
  const [newSessionLabel, setNewSessionLabel] = useState('Midday Micro-session');

  const completedCount = challenges.filter(c => c.completed).length;
  const totalAttempts = challenges.reduce((sum, c) => sum + c.attempts, 0);
  const accuracyPct = Math.round((completedCount / Math.max(1, totalAttempts)) * 100);

  // Skill Card Items with Duolingo colors
  const skillList = [
    { name: 'Mathematics', level: skillLevels.math, max: 5, color: 'bg-[#58CC02]', text: 'text-[#58CC02]', note: 'Addition and supermarket budgeting' },
    { name: 'Sequencing', level: skillLevels.sequencing, max: 5, color: 'bg-[#1CB0F6]', text: 'text-[#1CB0F6]', note: 'Routine logic & step ordering' },
    { name: 'Emotional Understanding', level: skillLevels.emotional, max: 5, color: 'bg-[#FF4B4B]', text: 'text-[#FF4B4B]', note: 'Empathetic social cues' },
    { name: 'Communication', level: skillLevels.communication, max: 5, color: 'bg-[#CE82FF]', text: 'text-[#CE82FF]', note: 'Polite phrase selection' },
    { name: 'Problem Solving', level: skillLevels.problemSolving, max: 5, color: 'bg-[#FFC800]', text: 'text-[#FFC800]', note: 'Flexible substitute thinking' },
  ];

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionStart || !newSessionEnd) return;
    playGentleSound('click', sensorySettings.soundMode);
    const newSession = {
      id: Date.now().toString(),
      start: newSessionStart,
      end: newSessionEnd,
      label: newSessionLabel || 'Custom Session'
    };
    setCaregiverSettings(prev => ({
      ...prev,
      sessions: [...prev.sessions, newSession]
    }));
  };

  const handleRemoveSession = (id: string) => {
    playGentleSound('click', sensorySettings.soundMode);
    setCaregiverSettings(prev => ({
      ...prev,
      sessions: prev.sessions.filter(s => s.id !== id)
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10 space-y-8 animate-fadeIn">
      {/* Demo Mode & Privacy Notice */}
      <div className="p-3.5 rounded-2xl bg-[#143343] border border-[#14496B] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-[#1CB0F6] font-bold">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>Protected Guardian Session • Client-Side Storage Demo Mode (No Cloud Database Configured)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-[#131F24] text-[#A5B8C0] font-black text-[11px] border border-[#202F36]">
            Learner: Sam (Age 9)
          </span>
          <button
            id="lock-portal-quick-btn"
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              if (onLockDashboard) {
                onLockDashboard();
              } else {
                setCurrentView('map');
              }
            }}
            className="px-3 py-1 rounded-xl bg-[#202F36] hover:bg-[#283942] border border-[#FF4B4B]/50 text-white text-xs font-black flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-[#FF4B4B]" />
            <span>Lock Portal</span>
          </button>
        </div>
      </div>

      {/* Guardian Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#202F36]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-black tracking-wider text-[#1CB0F6] bg-[#143343] px-3 py-1 rounded-full border border-[#14496B]">
              Guardian & Educator Portal
            </span>
            <span className="text-xs text-[#A5B8C0] font-bold">
              Protected Parent View
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5 font-display">
            Sam&apos;s Quest Analytics & Insights
          </h1>
          <p className="text-sm text-[#A5B8C0] font-medium">
            Real-time tracking of cognitive pacing, skill mastery levels, and sensory preferences.
          </p>
        </div>

        {/* Tab Navigation & Lock Portal */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#18262C] p-1.5 rounded-2xl border-2 border-[#28373E] text-xs font-black">
            <button
              id="tab-overview-button"
              onClick={() => {
                playGentleSound('click', sensorySettings.soundMode);
                setActiveTab('overview');
              }}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#58CC02] text-white shadow-md'
                  : 'text-[#A5B8C0] hover:text-white'
              }`}
            >
              Overview & Skills
            </button>

            <button
              id="tab-screen-time-button"
              onClick={() => {
                playGentleSound('click', sensorySettings.soundMode);
                setActiveTab('screen-time');
              }}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'screen-time'
                  ? 'bg-[#1CB0F6] text-white shadow-md'
                  : 'text-[#A5B8C0] hover:text-white'
              }`}
            >
              Screen Time
            </button>

            <button
              id="tab-sensory-button"
              onClick={() => {
                playGentleSound('click', sensorySettings.soundMode);
                setActiveTab('sensory');
              }}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'sensory'
                  ? 'bg-[#CE82FF] text-white shadow-md'
                  : 'text-[#A5B8C0] hover:text-white'
              }`}
            >
              Sensory
            </button>

            <button
              id="tab-parent-gate-button"
              onClick={() => {
                playGentleSound('click', sensorySettings.soundMode);
                setActiveTab('parent-gate');
              }}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'parent-gate'
                  ? 'bg-[#FFC800] text-[#131F24] shadow-md'
                  : 'text-[#A5B8C0] hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Parent PIN</span>
            </button>
          </div>

          <button
            id="lock-portal-main-btn"
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              if (onLockDashboard) {
                onLockDashboard();
              } else {
                setCurrentView('map');
              }
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-[#202F36] hover:bg-[#283942] border border-[#37464F] hover:border-[#FF4B4B] text-xs font-black text-[#A5B8C0] hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
            title="Lock Portal and return to Quest Map"
          >
            <Lock className="w-3.5 h-3.5 text-[#FF4B4B]" />
            <span className="hidden sm:inline">Lock Portal</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & SKILL CARDS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Key Stat Cards in Duolingo Dark Style */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#18262C] p-5 rounded-3xl border-2 border-[#28373E] shadow-lg space-y-1">
              <span className="text-xs text-[#A5B8C0] font-black uppercase tracking-wider">Levels Completed</span>
              <p className="text-2xl sm:text-3xl font-black text-white">{completedCount} / 7</p>
              <div className="flex items-center gap-1 text-xs text-[#58CC02] font-black">
                <CheckCircle2 className="w-3.5 h-3.5" /> Story Quest Active
              </div>
            </div>

            <div className="bg-[#18262C] p-5 rounded-3xl border-2 border-[#28373E] shadow-lg space-y-1">
              <span className="text-xs text-[#A5B8C0] font-black uppercase tracking-wider">Quest Accuracy</span>
              <p className="text-2xl sm:text-3xl font-black text-[#58CC02]">{accuracyPct}%</p>
              <div className="flex items-center gap-1 text-xs text-[#58CC02] font-black">
                <TrendingUp className="w-3.5 h-3.5" /> High First-Attempt Rate
              </div>
            </div>

            <div className="bg-[#18262C] p-5 rounded-3xl border-2 border-[#28373E] shadow-lg space-y-1">
              <span className="text-xs text-[#A5B8C0] font-black uppercase tracking-wider">Total Attempts</span>
              <p className="text-2xl sm:text-3xl font-black text-white">{totalAttempts}</p>
              <span className="text-xs text-[#A5B8C0] block font-medium">Avg 1.2 attempts/level</span>
            </div>

            <div className="bg-[#18262C] p-5 rounded-3xl border-2 border-[#28373E] shadow-lg space-y-1">
              <span className="text-xs text-[#A5B8C0] font-black uppercase tracking-wider">Sensory Mode</span>
              <p className="text-lg sm:text-xl font-black text-[#1CB0F6] mt-1">Calm & Step Cues</p>
              <span className="text-xs text-[#1CB0F6] font-bold">Low-stimulation enabled</span>
            </div>
          </div>

          {/* Skill Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white font-display">
                  Domain Competency & Adaptive Skill Levels
                </h2>
                <p className="text-xs text-[#A5B8C0] font-medium">
                  Calculated dynamically from challenge attempts and hint requests.
                </p>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#131F24] text-[#A5B8C0] border border-[#28373E]">
                Range: Level 1 – 5
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillList.map(skill => (
                <div 
                  key={skill.name}
                  id={`skill-card-${skill.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-[#18262C] rounded-3xl p-5 border-2 border-[#28373E] shadow-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-white text-base">{skill.name}</h3>
                      <span className="text-xs text-[#A5B8C0] font-medium">{skill.note}</span>
                    </div>
                    <div className="px-3 py-1 rounded-xl bg-[#131F24] border border-[#28373E] text-white font-black text-sm">
                      Level {skill.level}
                    </div>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-3 bg-[#131F24] rounded-full overflow-hidden border border-[#28373E]">
                      <div 
                        className={`h-full ${skill.color} rounded-full transition-all duration-500`}
                        style={{ width: `${(skill.level / skill.max) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#A5B8C0] font-bold">
                      <span>Beginner (L1)</span>
                      <span>Target (L3)</span>
                      <span>Mastery (L5)</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Recommended Next Activity Card */}
              <div className="bg-[#18262C] rounded-3xl p-5 border-2 border-[#58CC02] shadow-lg space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#58CC02] bg-[#1F3D24] px-2.5 py-0.5 rounded-md border border-[#2E6B38]">
                    Adaptive Recommendation
                  </span>
                  <h3 className="font-black text-white text-base mt-2 font-display">
                    Recommended Next Activity
                  </h3>
                  <p className="text-xs text-[#A5B8C0] mt-1 leading-relaxed font-medium">
                    <strong className="text-white">&ldquo;The Community Garden Quest&rdquo;</strong> — introduces advanced change calculation and multi-step sorting.
                  </p>
                </div>

                <button
                  onClick={() => {
                    playGentleSound('click', sensorySettings.soundMode);
                    setCurrentView('child-welcome');
                  }}
                  className="w-full py-3 px-4 rounded-xl btn-duo-green text-white text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Launch Recommended Quest</span>
                </button>
              </div>
            </div>
          </div>

          {/* Simple Progress Visualization Chart & Areas Needing Support */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Skill Level Chart */}
            <div className="lg:col-span-2 bg-[#18262C] rounded-3xl p-6 border-2 border-[#28373E] shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-white text-base font-display">Progress Chart & Level Comparison</h3>
                  <p className="text-xs text-[#A5B8C0] font-medium">Skill mastery benchmarks vs current profile level</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-[#58CC02] font-black">
                    <span className="w-3 h-3 rounded-sm bg-[#58CC02] inline-block" /> Sam&apos;s Level
                  </span>
                </div>
              </div>

              {/* Custom SVG / Bar visualizer */}
              <div className="pt-2 space-y-3.5">
                {skillList.map(item => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#A5B8C0]">
                      <span className="text-white font-extrabold">{item.name}</span>
                      <span className="font-black text-white">Level {item.level} of 5</span>
                    </div>
                    <div className="w-full h-4 bg-[#131F24] rounded-xl overflow-hidden flex border border-[#28373E]">
                      <div 
                        className="bg-[#58CC02] h-full rounded-l-xl transition-all duration-500"
                        style={{ width: `${(item.level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas Where Support Was Needed */}
            <div className="bg-[#18262C] rounded-3xl p-6 border-2 border-[#28373E] shadow-lg space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-black text-white text-base font-display">Support & Attention Insights</h3>
                
                <div className="space-y-2.5 text-xs text-white">
                  <div className="p-3 rounded-2xl bg-[#131F24] border border-[#28373E] space-y-1">
                    <span className="font-black text-[#FFC800] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFC800]" /> Multi-digit Additions
                    </span>
                    <p className="text-[#A5B8C0] font-medium leading-relaxed">
                      Benefited from visual item breakdowns when summing multiple prices above ₹50.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#131F24] border border-[#28373E] space-y-1">
                    <span className="font-black text-[#58CC02] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#58CC02]" /> Sequencing Tasks
                    </span>
                    <p className="text-[#A5B8C0] font-medium leading-relaxed">
                      Solved 4-step market routines on attempt 1 without needing audio hints.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#131F24] border border-[#28373E] space-y-1">
                    <span className="font-black text-[#1CB0F6] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#1CB0F6]" /> Empathy & Social Scenarios
                    </span>
                    <p className="text-[#A5B8C0] font-medium leading-relaxed">
                      Understood consequences quickly when presented with supportive social scripts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-[#A5B8C0] border-t border-[#202F36] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#58CC02] flex-shrink-0" />
                <span>Demonstration data for hackathon prototype testing</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCREEN-TIME FEATURE DEMONSTRATION */}
      {activeTab === 'screen-time' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[#18262C] rounded-3xl p-6 sm:p-8 border-2 border-[#28373E] shadow-lg space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#143343] text-[#1CB0F6] text-xs font-black mb-2 border border-[#14496B]">
                <Clock className="w-3.5 h-3.5" />
                <span>Screen-Time Demonstration Feature</span>
              </div>
              <h2 className="text-2xl font-black text-white font-display">
                Scheduled Learning Micro-Sessions
              </h2>
              <p className="text-sm text-[#A5B8C0] mt-1 font-medium">
                Establish predictable daily learning windows to prevent over-stimulation and support smooth transitions.
              </p>
            </div>

            {/* Maximum Session Duration Card */}
            <div className="bg-[#131F24] rounded-2xl p-5 border-2 border-[#28373E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#A5B8C0]">Paced Screen Limit</span>
                <h3 className="text-lg font-black text-white mt-0.5">Maximum session duration</h3>
                <p className="text-xs text-[#A5B8C0] mt-0.5 font-medium">
                  App encourages a natural break after this duration to promote screen-optional physical activities.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[10, 15, 20, 30].map(mins => (
                  <button
                    key={mins}
                    onClick={() => {
                      playGentleSound('click', sensorySettings.soundMode);
                      setCaregiverSettings(prev => ({ ...prev, maxSessionDuration: mins }));
                    }}
                    className={`px-4 py-2.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
                      caregiverSettings.maxSessionDuration === mins
                        ? 'btn-duo-blue text-white'
                        : 'bg-[#202F36] hover:bg-[#283942] text-white border border-[#37464F]'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>

            {/* Scheduled Sessions List */}
            <div className="space-y-3">
              <h3 className="font-black text-white text-base flex items-center justify-between">
                <span>Active Daily Schedules:</span>
                <span className="text-xs font-normal text-[#A5B8C0]">
                  {caregiverSettings.sessions.length} scheduled windows
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {caregiverSettings.sessions.map(sess => (
                  <div 
                    key={sess.id}
                    className="bg-[#131F24] p-4 rounded-2xl border-2 border-[#28373E] flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#143343] text-[#1CB0F6] flex items-center justify-center font-black">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-sm">{sess.label}</h4>
                        <p className="text-xs text-[#A5B8C0] font-mono">
                          {sess.start} – {sess.end} (20 mins)
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveSession(sess.id)}
                      className="p-2 text-[#A5B8C0] hover:text-[#FF4B4B] hover:bg-[#351C20] rounded-xl transition-colors cursor-pointer"
                      title="Remove session"
                      aria-label={`Remove ${sess.label}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Session Form */}
            <form onSubmit={handleAddSession} className="bg-[#131F24] p-5 rounded-2xl border-2 border-[#28373E] space-y-3">
              <h4 className="font-black text-white text-sm">Add New Learning Window</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-[#A5B8C0] font-bold mb-1">Session Label</label>
                  <input
                    type="text"
                    value={newSessionLabel}
                    onChange={(e) => setNewSessionLabel(e.target.value)}
                    placeholder="e.g. Afternoon Quest"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#18262C] border border-[#28373E] text-sm font-bold text-white focus:outline-[#58CC02]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#A5B8C0] font-bold mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newSessionStart}
                    onChange={(e) => setNewSessionStart(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#18262C] border border-[#28373E] text-sm font-bold text-white focus:outline-[#58CC02]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#A5B8C0] font-bold mb-1">End Time</label>
                  <input
                    type="time"
                    value={newSessionEnd}
                    onChange={(e) => setNewSessionEnd(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#18262C] border border-[#28373E] text-sm font-bold text-white focus:outline-[#58CC02]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="py-3 px-5 rounded-xl btn-duo-blue text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                <span>Save Schedule Window</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: SENSORY SETTINGS */}
      {activeTab === 'sensory' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[#18262C] rounded-3xl p-6 sm:p-8 border-2 border-[#28373E] shadow-lg space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F3D24] text-[#58CC02] text-xs font-black mb-2 border border-[#2E6B38]">
                <Sliders className="w-3.5 h-3.5" />
                <span>Sensory Adaptation Configurator</span>
              </div>
              <h2 className="text-2xl font-black text-white font-display">
                Sensory & Accessibility Preferences
              </h2>
              <p className="text-sm text-[#A5B8C0] mt-1 font-medium">
                Customize sensory stimulus levels. Changes apply immediately across the child mode.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visual Stimulation */}
              <div className="bg-[#131F24] rounded-2xl p-5 border-2 border-[#28373E] space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#1F3D24] text-[#58CC02] flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">Visual Stimulation</h3>
                    <p className="text-xs text-[#A5B8C0]">Mutes vibrant colors & reduces animations</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(['minimal', 'normal'] as VisualMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => {
                        playGentleSound('click', sensorySettings.soundMode);
                        setSensorySettings(prev => ({ ...prev, visualMode: mode }));
                      }}
                      className={`p-3 rounded-xl font-black text-xs capitalize transition-all cursor-pointer ${
                        sensorySettings.visualMode === mode
                          ? 'btn-duo-green text-white'
                          : 'bg-[#202F36] hover:bg-[#283942] text-white border border-[#37464F]'
                      }`}
                    >
                      {mode === 'minimal' ? 'Minimal (Calm)' : 'Standard Dark'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Feedback */}
              <div className="bg-[#131F24] rounded-2xl p-5 border-2 border-[#28373E] space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#143343] text-[#1CB0F6] flex items-center justify-center">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">Audio Feedback</h3>
                    <p className="text-xs text-[#A5B8C0]">Gentle synthesized wooden & chime tones</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['off', 'soft', 'normal'] as SoundMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => {
                        setSensorySettings(prev => ({ ...prev, soundMode: mode }));
                        playGentleSound('click', mode);
                      }}
                      className={`p-3 rounded-xl font-black text-xs capitalize transition-all cursor-pointer ${
                        sensorySettings.soundMode === mode
                          ? 'btn-duo-blue text-white'
                          : 'bg-[#202F36] hover:bg-[#283942] text-white border border-[#37464F]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions Format */}
              <div className="bg-[#131F24] rounded-2xl p-5 border-2 border-[#28373E] space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#3B3416] text-[#FFC800] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">Instruction Format</h3>
                    <p className="text-xs text-[#A5B8C0]">Display style for step-by-step tasks</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['text', 'pictures', 'both'] as InstructionMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => {
                        playGentleSound('click', sensorySettings.soundMode);
                        setSensorySettings(prev => ({ ...prev, instructionMode: mode }));
                      }}
                      className={`p-3 rounded-xl font-black text-xs capitalize transition-all cursor-pointer ${
                        sensorySettings.instructionMode === mode
                          ? 'btn-duo-yellow text-stone-950'
                          : 'bg-[#202F36] hover:bg-[#283942] text-white border border-[#37464F]'
                      }`}
                    >
                      {mode === 'both' ? 'Both (All Cues)' : mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Duration Target */}
              <div className="bg-[#131F24] rounded-2xl p-5 border-2 border-[#28373E] space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#351C20] text-[#FF4B4B] flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">Target Activity Duration</h3>
                    <p className="text-xs text-[#A5B8C0]">Recommended span for single stories</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[2, 5, 10].map(mins => (
                    <button
                      key={mins}
                      onClick={() => {
                        playGentleSound('click', sensorySettings.soundMode);
                        setSensorySettings(prev => ({ ...prev, activityDuration: mins }));
                      }}
                      className={`p-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
                        sensorySettings.activityDuration === mins
                          ? 'btn-duo-red text-white'
                          : 'bg-[#202F36] hover:bg-[#283942] text-white border border-[#37464F]'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PARENT PIN & PROTECTED GATE SETTINGS */}
      {activeTab === 'parent-gate' && (
        <div className="bg-[#18262C] rounded-3xl p-6 sm:p-8 border-2 border-[#28373E] shadow-xl space-y-6 max-w-2xl mx-auto animate-fadeIn">
          <div className="flex items-center gap-3 pb-3 border-b border-[#28373E]">
            <div className="w-12 h-12 rounded-2xl bg-[#3B3416] text-[#FFC800] flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-display">Parental Gate PIN Configuration</h2>
              <p className="text-xs text-[#A5B8C0]">
                Protects the Guardian Hub so young explorers cannot accidentally alter timer limits or sensory settings.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#131F24] border border-[#28373E] space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-[#A5B8C0]">
                4-Digit Security PIN
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  maxLength={4}
                  value={pinChangeInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPinChangeInput(val);
                    setPinSavedMsg('');
                  }}
                  className="w-36 text-center tracking-widest text-2xl font-black py-2.5 px-4 rounded-2xl bg-[#202F36] border-2 border-[#37464F] text-white focus:border-[#FFC800] focus:outline-none"
                  placeholder="1234"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (pinChangeInput.length === 4) {
                      playGentleSound('sparkle', sensorySettings.soundMode);
                      setCaregiverSettings(prev => ({ ...prev, parentPin: pinChangeInput }));
                      setPinSavedMsg('Security PIN updated successfully!');
                    }
                  }}
                  disabled={pinChangeInput.length !== 4}
                  className={`px-5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    pinChangeInput.length === 4
                      ? 'btn-duo-green text-white shadow-md'
                      : 'bg-[#202F36] text-[#60727B] border border-[#28373E] cursor-not-allowed'
                  }`}
                >
                  Save New PIN
                </button>
              </div>
              <p className="text-[11px] text-[#A5B8C0]">
                Default demo PIN is <strong className="text-white">1234</strong>. If changed, it saves to this device&apos;s localStorage.
              </p>
              {pinSavedMsg && (
                <p className="text-xs text-[#58CC02] font-black flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{pinSavedMsg}</span>
                </p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#131F24] border border-[#28373E] space-y-2 text-xs text-[#A5B8C0]">
              <span className="font-black text-white block">Security & Data Privacy Details</span>
              <p>
                • <strong>Demo Mode Architecture:</strong> No personal student information (PII) is transmitted to external servers. All session analytics and PINs are kept locally in the browser.
              </p>
              <p>
                • <strong>Alternative Adult Challenge:</strong> If you forget your PIN, the Parental Gate provides an adult multiplication challenge (7 × 8 = 56) for instant access.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
};
