import React, { useState } from 'react';
import { 
  SupportLevel, 
  SkillDifficulty, 
  AdaptiveSkillKey, 
  SkillAdaptiveProfile, 
  ParentAdaptiveSettings, 
  AdaptiveRecommendation,
  SensorySettings
} from '../types';
import { 
  WORKED_EXAMPLES, 
  MINI_PRACTICE_QUESTIONS 
} from '../utils/adaptiveEngine';
import { 
  Sparkles, 
  HelpCircle, 
  Coffee, 
  BookOpen, 
  Target, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  ArrowRight,
  TrendingUp,
  Shield,
  Compass,
  HeartHandshake,
  Zap,
  Volume2
} from 'lucide-react';
import { playGentleSound, speakText } from '../utils/audio';

interface Props {
  skillKey: AdaptiveSkillKey;
  profile: SkillAdaptiveProfile;
  settings: ParentAdaptiveSettings;
  sensorySettings: SensorySettings;
  recommendation: AdaptiveRecommendation | null;
  onApplyRecommendation: (rec: AdaptiveRecommendation) => void;
  onDismissRecommendation: () => void;
  onRequestHint: () => void;
  onTakeBreak: () => void;
  onChangeDifficulty?: (diff: SkillDifficulty) => void;
  onChangeSupportLevel?: (level: SupportLevel) => void;
}

export const AdaptiveSupportBar: React.FC<Props> = ({
  skillKey,
  profile,
  settings,
  sensorySettings,
  recommendation,
  onApplyRecommendation,
  onDismissRecommendation,
  onRequestHint,
  onTakeBreak,
  onChangeDifficulty,
  onChangeSupportLevel
}) => {
  const [showWorkedExampleModal, setShowWorkedExampleModal] = useState(false);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [practiceSelectedOpt, setPracticeSelectedOpt] = useState<string | null>(null);
  const [practiceFeedback, setPracticeFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const workedExample = WORKED_EXAMPLES[skillKey];
  const miniPractice = MINI_PRACTICE_QUESTIONS[skillKey];

  const difficultyColors: Record<SkillDifficulty, { bg: string; text: string; border: string; label: string; icon: string }> = {
    easy: { bg: 'bg-[#1F3D24]', text: 'text-[#58CC02]', border: 'border-[#2E6B38]', label: 'Easy Pacing', icon: '🌱' },
    standard: { bg: 'bg-[#143343]', text: 'text-[#1CB0F6]', border: 'border-[#1B5775]', label: 'Standard Task', icon: '⚡' },
    challenge: { bg: 'bg-[#3E1D24]', text: 'text-[#FF4B4B]', border: 'border-[#662832]', label: 'Challenge Mode', icon: '🔥' }
  };

  const supportColors: Record<SupportLevel, { bg: string; text: string; border: string; label: string; icon: string }> = {
    1: { bg: 'bg-[#202F36]', text: 'text-[#A5B8C0]', border: 'border-[#37464F]', label: 'L1: Independent', icon: '🛡️' },
    2: { bg: 'bg-[#2A2B15]', text: 'text-[#FFC800]', border: 'border-[#58531E]', label: 'L2: Gentle Support', icon: '🤝' },
    3: { bg: 'bg-[#2C1F3D]', text: 'text-[#CE82FF]', border: 'border-[#532E7C]', label: 'L3: Guided Support', icon: '🧭' }
  };

  const currentDiff = difficultyColors[profile.skillDifficulty] || difficultyColors.standard;
  const currentSupp = supportColors[profile.supportLevel] || supportColors[2];

  const handlePracticeAnswer = (optId: string) => {
    setPracticeSelectedOpt(optId);
    const chosen = miniPractice?.options.find(o => o.id === optId);
    if (!chosen) return;

    if (chosen.isCorrect) {
      playGentleSound('correct', sensorySettings.soundMode);
      setPracticeFeedback({ isCorrect: true, text: chosen.explanation });
      speakText(chosen.explanation, sensorySettings.soundMode);
    } else {
      playGentleSound('click', sensorySettings.soundMode);
      setPracticeFeedback({ isCorrect: false, text: chosen.explanation });
    }
  };

  return (
    <div className="space-y-3">
      {/* Top Status & Quick Action Bar */}
      <div className="bg-[#18262C] rounded-2xl p-3 border-2 border-[#28373E] flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Two Independent Dimensions (Skill Difficulty vs Support Level) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Badge */}
          <div 
            className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 border ${currentDiff.bg} ${currentDiff.text} ${currentDiff.border}`}
            title="Skill Difficulty: Controls task content and question complexity"
          >
            <span>{currentDiff.icon}</span>
            <span>Difficulty:</span>
            <span className="capitalize underline decoration-dotted">{profile.skillDifficulty}</span>
          </div>

          {/* Support Level Badge */}
          <div 
            className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 border ${currentSupp.bg} ${currentSupp.text} ${currentSupp.border}`}
            title="Support Level: Controls amount of hints, explanations, and wrong-answer elimination"
          >
            <span>{currentSupp.icon}</span>
            <span>Support:</span>
            <span>{currentSupp.label}</span>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Immediate Hint Request Button (Always available, no mistakes required!) */}
          {settings.instantHintsAllowed && (
            <button
              onClick={() => {
                playGentleSound('hint', sensorySettings.soundMode);
                onRequestHint();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#202F36] hover:bg-[#283942] border border-[#FFC800]/50 hover:border-[#FFC800] text-[#FFC800] text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
              title="Ask Milo for a hint right now without any penalty"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ask Milo for a Hint</span>
            </button>
          )}

          {/* Worked Demonstration (Available in Level 2 & 3 or when enabled) */}
          {settings.showWorkedExamples && workedExample && (
            <button
              onClick={() => {
                playGentleSound('click', sensorySettings.soundMode);
                setShowWorkedExampleModal(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#202F36] hover:bg-[#283942] border border-[#CE82FF]/40 hover:border-[#CE82FF] text-[#CE82FF] text-xs font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              title="See a step-by-step visual demonstration"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Worked Example</span>
              <span className="sm:hidden">Demo</span>
            </button>
          )}

          {/* Guided Mini Practice (Available in Level 3) */}
          {profile.supportLevel === 3 && miniPractice && (
            <button
              onClick={() => {
                playGentleSound('click', sensorySettings.soundMode);
                setShowPracticeModal(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#202F36] hover:bg-[#283942] border border-[#1CB0F6]/40 hover:border-[#1CB0F6] text-[#1CB0F6] text-xs font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              title="Try a simpler mini practice round testing the same skill"
            >
              <Target className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mini Practice</span>
              <span className="sm:hidden">Practice</span>
            </button>
          )}

          {/* Break Room Button (Preserves progress, zero penalty) */}
          <button
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              onTakeBreak();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-[#202F36] hover:bg-[#283942] border border-[#37464F] text-[#A5B8C0] hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
            title="Take a calm sensory break"
          >
            <Coffee className="w-3.5 h-3.5 text-[#FF9600]" />
            <span className="hidden sm:inline">Take a Break</span>
          </button>
        </div>
      </div>

      {/* Adaptive Recommendation Card (Rule C or Rule E deterministic trigger) */}
      {recommendation && (
        <div className="bg-[#1C2A33] border-2 border-[#1CB0F6] rounded-2xl p-4 shadow-xl animate-fadeIn space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-[#1CB0F6] font-black text-sm">
              <Sparkles className="w-5 h-5 flex-shrink-0 animate-bounce" />
              <span>{recommendation.title}</span>
            </div>
            <button
              onClick={onDismissRecommendation}
              className="text-[#A5B8C0] hover:text-white p-1 rounded-lg hover:bg-[#202F36]"
              title="Dismiss suggestion"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-white text-sm font-medium leading-relaxed">
            {recommendation.message}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onApplyRecommendation(recommendation)}
              className="px-4 py-2 rounded-xl bg-[#58CC02] hover:bg-[#61E002] text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Yes, Let&apos;s Try It!</span>
            </button>

            <button
              onClick={onDismissRecommendation}
              className="px-3 py-2 rounded-xl bg-[#202F36] hover:bg-[#283942] text-[#A5B8C0] hover:text-white text-xs font-bold border border-[#37464F] transition-all cursor-pointer"
            >
              Keep Current Level
            </button>
          </div>
        </div>
      )}

      {/* Worked Example Modal */}
      {showWorkedExampleModal && workedExample && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#18262C] border-2 border-[#CE82FF] rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-3 border-b border-[#28373E] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#2C1F3D] border border-[#532E7C] flex items-center justify-center text-xl">
                  📘
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-display">
                    {workedExample.title}
                  </h3>
                  <p className="text-xs text-[#CE82FF] font-bold">
                    Step-by-Step Visual Demonstration
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWorkedExampleModal(false)}
                className="p-1.5 rounded-xl bg-[#202F36] hover:bg-[#283942] text-[#A5B8C0] hover:text-white border border-[#37464F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-[#A5B8C0] font-medium leading-relaxed bg-[#131F24] p-3.5 rounded-2xl border border-[#202F36]">
              {workedExample.conceptSummary}
            </p>

            {/* Steps List */}
            <div className="space-y-3">
              {workedExample.steps.map((st) => (
                <div 
                  key={st.stepNumber} 
                  className="bg-[#202F36] p-3.5 rounded-2xl border border-[#37464F] flex items-start gap-3.5"
                >
                  <div className="w-7 h-7 rounded-full bg-[#131F24] text-[#1CB0F6] border border-[#1B5775] flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">
                    {st.stepNumber}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <span>{st.visualEmoji}</span>
                        <span>{st.title}</span>
                      </h4>
                      {st.highlight && (
                        <span className="text-[11px] font-black text-[#58CC02] bg-[#1F3D24] px-2 py-0.5 rounded-md border border-[#2E6B38]">
                          {st.highlight}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#A5B8C0] font-medium leading-relaxed">
                      {st.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Takeaway Rule */}
            <div className="bg-[#1F3D24] border border-[#2E6B38] p-3 rounded-2xl flex items-center gap-2.5 text-xs text-[#58CC02] font-black">
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>Milo&apos;s Golden Rule: {workedExample.takeawayRule}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowWorkedExampleModal(false)}
                className="px-5 py-2.5 rounded-2xl bg-[#58CC02] hover:bg-[#61E002] text-white text-xs font-black shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Got It! Back to Challenge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mini Practice Modal */}
      {showPracticeModal && miniPractice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#18262C] border-2 border-[#1CB0F6] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-[#28373E] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#143343] border border-[#1B5775] flex items-center justify-center text-xl">
                  🎯
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-display">
                    {miniPractice.title}
                  </h3>
                  <p className="text-xs text-[#1CB0F6] font-bold">
                    Guided Simpler Practice Round
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPracticeModal(false);
                  setPracticeFeedback(null);
                  setPracticeSelectedOpt(null);
                }}
                className="p-1.5 rounded-xl bg-[#202F36] hover:bg-[#283942] text-[#A5B8C0] hover:text-white border border-[#37464F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm sm:text-base text-white font-bold bg-[#131F24] p-4 rounded-2xl border border-[#202F36]">
              {miniPractice.prompt}
            </p>

            <div className="space-y-2.5">
              {miniPractice.options.map(opt => {
                const isSelected = practiceSelectedOpt === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handlePracticeAnswer(opt.id)}
                    className={`w-full p-3.5 rounded-2xl text-left border-2 font-bold text-sm transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-[#1F3D24] border-[#58CC02] text-[#58CC02]'
                          : 'bg-[#2B1B1D] border-[#FF4B4B] text-[#FF4B4B]'
                        : 'bg-[#202F36] hover:bg-[#283942] border-[#37464F] text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <span>{opt.isCorrect ? '✅' : '❌'}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {practiceFeedback && (
              <div className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-start gap-2.5 ${
                practiceFeedback.isCorrect
                  ? 'bg-[#1F3D24] border-[#2E6B38] text-[#58CC02]'
                  : 'bg-[#2B1B1D] border-[#662832] text-[#FF4B4B]'
              }`}>
                <span>{practiceFeedback.isCorrect ? '🌟' : '💡'}</span>
                <div>
                  <p>{practiceFeedback.text}</p>
                  {practiceFeedback.isCorrect && (
                    <p className="mt-1 font-black text-white">{miniPractice.successMessage}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#A5B8C0]">
                💡 Hint: {miniPractice.hint}
              </span>

              <button
                onClick={() => {
                  setShowPracticeModal(false);
                  setPracticeFeedback(null);
                  setPracticeSelectedOpt(null);
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#1CB0F6] hover:bg-[#25B8FC] text-white text-xs font-black shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Return to Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
