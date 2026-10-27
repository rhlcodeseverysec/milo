import React, { useState, useEffect } from 'react';
import { 
  SensorySettings, 
  SkillAdaptiveProfile, 
  ParentAdaptiveSettings, 
  AdaptiveRecommendation, 
  SkillDifficulty 
} from '../../types';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Volume2 
} from 'lucide-react';
import { playGentleSound, speakText } from '../../utils/audio';
import { evaluateAttempt } from '../../utils/adaptiveEngine';
import { AdaptiveSupportBar } from '../AdaptiveSupportBar';

interface StrategyOption {
  id: string;
  label: string;
  icon: string;
  description: string;
  isHelpful: boolean;
  feedbackText: string;
}

const EMOTIONAL_VARIANTS: Record<SkillDifficulty, { title: string; scenario: string; options: StrategyOption[]; hintText: string }> = {
  easy: {
    title: 'Supermarket Calming Care (Gentle Choices)',
    scenario: 'The supermarket beepers and lights are loud. What is the safest, gentlest choice for Sam?',
    hintText: 'Putting on soft headphones protects your ears and calms your body!',
    options: [
      {
        id: 'headphones',
        label: 'Put on Soft Noise Headphones & Breathe Slow with Milo',
        icon: '🎧',
        description: 'Soften the loud volume and breathe slowly to feel calm.',
        isHelpful: true,
        feedbackText: 'Wonderful choice! Soft headphones and gentle breathing keep you calm and safe.'
      },
      {
        id: 'run-away',
        label: 'Run outside into the busy parking lot',
        icon: '🏃',
        description: 'Running into parking areas without grown-ups is dangerous.',
        isHelpful: false,
        feedbackText: 'Running into parking areas is unsafe. Putting on headphones with your helper is much safer!'
      }
    ]
  },
  standard: {
    title: 'Supermarket Sensory Calming',
    scenario: 'The checkout scanners and announcements are loud. Sam feels sensory overload. What should Sam do?',
    hintText: 'Headphones and telling your helper are both wonderful calming strategies!',
    options: [
      {
        id: 'headphones',
        label: 'Put on Noise Headphones & Take 3 Deep Breaths',
        icon: '🎧',
        description: 'Calm the sound and take slow, deep breaths with Milo.',
        isHelpful: true,
        feedbackText: 'Wonderful choice! Headphones & slow breathing help soothe sensory overwhelm.'
      },
      {
        id: 'ask-pause',
        label: 'Tell Parent or Guardian: "I need a quiet 2-minute break"',
        icon: '🤝',
        description: 'Expressing your feelings with words helps your helper support you.',
        isHelpful: true,
        feedbackText: 'Super communication! Expressing your need for a brief quiet break is very smart.'
      },
      {
        id: 'run-away',
        label: 'Run out of the supermarket into the parking lot',
        icon: '🏃',
        description: 'Running away without telling your grown-up is unsafe.',
        isHelpful: false,
        feedbackText: 'Running into parking areas is unsafe. It is much better to tell your guardian or put on headphones!'
      }
    ]
  },
  challenge: {
    title: 'Advanced Emotional Self-Regulation',
    scenario: 'A long line at the checkout creates sudden commotion and crowd noise. How can Sam proactively self-regulate?',
    hintText: 'Proactive calming: put on headphones and step to the side aisle with your guardian.',
    options: [
      {
        id: 'headphones-calm',
        label: 'Wear headphones, hold Milo, and take 3 deep belly breaths',
        icon: '🎧',
        description: 'Active sensory reduction with slow autonomic calming.',
        isHelpful: true,
        feedbackText: 'Exceptional self-regulation! Using headphones and deep breathing restores calm.'
      },
      {
        id: 'guardian-aside',
        label: 'Gently tell guardian: "Let us stand in the quiet aisle while you hold our spot"',
        icon: '🤝',
        description: 'Self-advocacy that respects comfort without disrupting the quest.',
        isHelpful: true,
        feedbackText: 'Brilliant self-advocacy! Stepping to a quieter aisle maintains safety and composure.'
      },
      {
        id: 'shout-stop',
        label: 'Shout loudly at the cashier to turn off the overhead speakers',
        icon: '📢',
        description: 'Shouting causes distress and does not help the cashier.',
        isHelpful: false,
        feedbackText: 'Shouting increases noise and distress. Gentle communication or headphones are far more effective!'
      },
      {
        id: 'sprint-out',
        label: 'Abandon the grocery basket and sprint out into traffic',
        icon: '🚨',
        description: 'Running out into parking traffic is extremely hazardous.',
        isHelpful: false,
        feedbackText: 'Traffic is dangerous. Always stay close to your trusted helper.'
      }
    ]
  }
};

interface Props {
  sensorySettings: SensorySettings;
  adaptiveProfile: SkillAdaptiveProfile;
  onUpdateProfile: (profile: SkillAdaptiveProfile) => void;
  parentSettings: ParentAdaptiveSettings;
  onTakeBreak: () => void;
  onComplete: (attempts: number, hintsUsed: number) => void;
}

export const Challenge4Emotional: React.FC<Props> = ({
  sensorySettings,
  adaptiveProfile,
  onUpdateProfile,
  parentSettings,
  onTakeBreak,
  onComplete
}) => {
  const currentVariant = EMOTIONAL_VARIANTS[adaptiveProfile.skillDifficulty] || EMOTIONAL_VARIANTS.standard;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [eliminatedIds, setEliminatedIds] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<AdaptiveRecommendation | null>(null);
  const [feedback, setFeedback] = useState<{ status: 'idle' | 'correct' | 'incorrect'; message: string }>({
    status: 'idle',
    message: ''
  });

  useEffect(() => {
    setSelectedId(null);
    setAttempts(0);
    setHintsUsed(0);
    setShowHint(false);
    setEliminatedIds([]);
    setFeedback({ status: 'idle', message: '' });
  }, [adaptiveProfile.skillDifficulty]);

  const handleSelect = (id: string) => {
    if (eliminatedIds.includes(id)) return;
    playGentleSound('click', sensorySettings.soundMode);
    setSelectedId(id);
    if (feedback.status !== 'idle') {
      setFeedback({ status: 'idle', message: '' });
    }
  };

  const handleCheckStrategy = () => {
    if (!selectedId) return;
    const newAttemptCount = attempts + 1;
    setAttempts(newAttemptCount);

    const chosen = currentVariant.options.find(s => s.id === selectedId);
    const isCorrect = chosen?.isHelpful ?? false;

    const evalResult = evaluateAttempt(
      adaptiveProfile,
      `emo_${adaptiveProfile.skillDifficulty}`,
      isCorrect,
      newAttemptCount,
      hintsUsed,
      parentSettings
    );

    onUpdateProfile(evalResult.updatedProfile);
    if (evalResult.recommendation) {
      setRecommendation(evalResult.recommendation);
    }

    if (isCorrect) {
      playGentleSound('correct', sensorySettings.soundMode);
      setFeedback({
        status: 'correct',
        message: chosen?.feedbackText || evalResult.gentleFeedback.message
      });
      speakText(chosen?.feedbackText || 'Great choice!', sensorySettings.soundMode);
    } else {
      playGentleSound('click', sensorySettings.soundMode);

      if (parentSettings.temporaryAnswerElimination && (adaptiveProfile.supportLevel >= 2 || evalResult.updatedProfile.supportLevel >= 2)) {
        if (!eliminatedIds.includes(selectedId)) {
          setEliminatedIds(prev => [...prev, selectedId]);
        }
      }

      if (evalResult.gentleFeedback.showHintPrompt || newAttemptCount >= 2) {
        setShowHint(true);
      }

      setFeedback({
        status: 'incorrect',
        message: chosen?.feedbackText || evalResult.gentleFeedback.message
      });
    }
  };

  const handleRequestImmediateHint = () => {
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
    onUpdateProfile({
      ...adaptiveProfile,
      hintsRequested: adaptiveProfile.hintsRequested + 1
    });
    speakText(currentVariant.hintText, sensorySettings.soundMode);
  };

  const handleApplyRecommendation = (rec: AdaptiveRecommendation) => {
    playGentleSound('sparkle', sensorySettings.soundMode);
    if (rec.targetDifficulty) {
      onUpdateProfile({
        ...adaptiveProfile,
        skillDifficulty: rec.targetDifficulty
      });
    }
    if (rec.targetSupport) {
      onUpdateProfile({
        ...adaptiveProfile,
        supportLevel: rec.targetSupport
      });
    }
    setRecommendation(null);
  };

  return (
    <div className="space-y-5">
      {/* Two-Dimensional Adaptive Support Bar */}
      <AdaptiveSupportBar 
        skillKey="emotional"
        profile={adaptiveProfile}
        settings={parentSettings}
        sensorySettings={sensorySettings}
        recommendation={recommendation}
        onApplyRecommendation={handleApplyRecommendation}
        onDismissRecommendation={() => setRecommendation(null)}
        onRequestHint={handleRequestImmediateHint}
        onTakeBreak={onTakeBreak}
        onChangeDifficulty={(diff) => onUpdateProfile({ ...adaptiveProfile, skillDifficulty: diff })}
        onChangeSupportLevel={(lvl) => onUpdateProfile({ ...adaptiveProfile, supportLevel: lvl })}
      />

      {/* Title & Info */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B1922] text-[#FF4B4B] text-xs font-black border border-[#6B2433]">
          <span>Level 4</span>
          <span>•</span>
          <span>Emotional Regulation ({adaptiveProfile.skillDifficulty.toUpperCase()})</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            {currentVariant.title}
          </h2>
          <button
            onClick={() => speakText(currentVariant.scenario, sensorySettings.soundMode)}
            className="p-2 rounded-xl bg-[#202F36] hover:bg-[#283942] text-[#FF4B4B] border border-[#37464F] cursor-pointer"
            title="Read scenario aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[#A5B8C0] text-sm sm:text-base font-medium">
          {currentVariant.scenario}
        </p>
      </div>

      {/* Hint if struggle */}
      {showHint && (
        <div className="bg-[#2A2415] border-2 border-[#FFC800]/50 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-[#FFD84D] animate-fadeIn">
          <Sparkles className="w-5 h-5 text-[#FFC800] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-black text-[#FFC800]">Milo&apos;s Calming Hint:</p>
            <p className="mt-0.5 text-white/90 font-medium">
              {currentVariant.hintText}
            </p>
          </div>
        </div>
      )}

      {/* Strategy Options */}
      <div className="space-y-3">
        {currentVariant.options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isEliminated = eliminatedIds.includes(opt.id);

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={isEliminated}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 relative ${
                isEliminated
                  ? 'bg-[#182024]/50 border-[#28373E] text-[#556973] opacity-40 cursor-not-allowed line-through'
                  : isSelected
                  ? 'bg-[#1CB0F6]/20 border-[#1CB0F6] text-white ring-2 ring-[#1CB0F6]/40 cursor-pointer'
                  : 'bg-[#18262C] border-[#28373E] hover:border-[#37464F] text-white cursor-pointer'
              }`}
            >
              {isEliminated && (
                <span className="absolute top-2 right-2 text-[10px] font-black uppercase text-[#FF4B4B] bg-[#2B1B1D] px-2 py-0.5 rounded-full border border-[#662832]">
                  Tried
                </span>
              )}
              <span className="text-3xl flex-shrink-0">{opt.icon}</span>
              <div className="space-y-1">
                <div className="font-extrabold text-sm sm:text-base text-white">
                  {opt.label}
                </div>
                <p className="text-xs text-[#A5B8C0]">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Gentle Feedback Banner */}
      {feedback.status !== 'idle' && (
        <div 
          id="challenge4-feedback"
          className={`p-4 sm:p-5 rounded-2xl border-2 flex items-start gap-3 transition-all ${
            feedback.status === 'correct' 
              ? 'bg-[#183424] border-[#58CC02] text-white' 
              : 'bg-[#352516] border-[#FF9600] text-white'
          }`}
        >
          {feedback.status === 'correct' ? (
            <CheckCircle2 className="w-6 h-6 text-[#58CC02] flex-shrink-0 mt-0.5" />
          ) : (
            <HelpCircle className="w-6 h-6 text-[#FF9600] flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-black text-base">{feedback.message}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        {feedback.status !== 'correct' ? (
          <button
            id="challenge4-submit-button"
            onClick={handleCheckStrategy}
            disabled={!selectedId || eliminatedIds.includes(selectedId)}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg tracking-wide uppercase disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>CHECK STRATEGY</span>
          </button>
        ) : (
          <button
            id="challenge4-next-button"
            onClick={() => {
              playGentleSound('step', sensorySettings.soundMode);
              onComplete(attempts, hintsUsed);
            }}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg group tracking-wide uppercase"
          >
            <span>CONTINUE TO LEVEL 5</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {!showHint && feedback.status !== 'correct' && (
          <button
            id="challenge4-hint-button"
            onClick={handleRequestImmediateHint}
            className="w-full sm:w-auto py-4 px-5 rounded-2xl btn-duo-dark text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#FFC800]" />
            <span>Ask Milo for Hint</span>
          </button>
        )}
      </div>
    </div>
  );
};
