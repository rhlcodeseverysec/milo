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
  AlertTriangle, 
  Volume2 
} from 'lucide-react';
import { playGentleSound, speakText } from '../../utils/audio';
import { evaluateAttempt } from '../../utils/adaptiveEngine';
import { AdaptiveSupportBar } from '../AdaptiveSupportBar';

interface ActionOption {
  id: string;
  label: string;
  icon: string;
  description: string;
  isSafe: boolean;
  explanation: string;
}

const PROBLEM_SOLVING_VARIANTS: Record<SkillDifficulty, { title: string; scenario: string; options: ActionOption[]; hintText: string }> = {
  easy: {
    title: 'Safe Walking Around Water Spills (Gentle Choices)',
    scenario: 'There is a small water puddle in aisle 3. What is the safest choice for Sam and Milo?',
    hintText: 'Walking slowly around the puddle keeps your shoes dry and prevents slips!',
    options: [
      {
        id: 'walk-around',
        label: 'Walk slowly around the yellow cone sign on the dry floor',
        icon: '🚶',
        description: 'Keep your footing dry and alert a staff member safely.',
        isSafe: true,
        explanation: 'Awesome problem solving! Walking safely around water spills prevents slips and keeps everyone safe.'
      },
      {
        id: 'jump-over',
        label: 'Run and jump across the wet floor puddle',
        icon: '🦘',
        description: 'Jumping on wet tiles can cause severe slips.',
        isSafe: false,
        explanation: 'Jumping on slippery floors can lead to falling and dropping your basket. Always walk carefully around it!'
      }
    ]
  },
  standard: {
    title: 'Supermarket Floor Hazard Safety',
    scenario: 'Milo spots a wet floor caution cone in aisle 3. What is the safest way to navigate past the hazard?',
    hintText: 'Respect safety cones: never jump over puddles or push the cone away.',
    options: [
      {
        id: 'walk-around',
        label: 'Walk slowly around the yellow cone sign on the dry floor',
        icon: '🚶',
        description: 'Keep your footing dry and alert a staff member safely.',
        isSafe: true,
        explanation: 'Awesome problem solving! Walking safely around water spills prevents slips and keeps everyone safe.'
      },
      {
        id: 'jump-over',
        label: 'Run and jump across the wet floor puddle',
        icon: '🦘',
        description: 'Jumping on wet tiles can cause severe slips.',
        isSafe: false,
        explanation: 'Jumping on slippery floors can lead to falling and dropping your basket. Always walk carefully around it!'
      },
      {
        id: 'ignore-sign',
        label: 'Push the yellow cone away and walk through the water',
        icon: '⚠️',
        description: 'Yellow cones are there to warn and protect you.',
        isSafe: false,
        explanation: 'Caution signs protect us from slipping. Never move safety cones!'
      }
    ]
  },
  challenge: {
    title: 'Comprehensive Hazard Management & Store Safety',
    scenario: 'A broken olive oil bottle has spilled across aisle 3, making the floor slick and spreading. What is the best multi-step safety response?',
    hintText: 'Walk around the dry edge and notify a store worker so other shoppers remain safe!',
    options: [
      {
        id: 'walk-alert',
        label: 'Walk along the dry side and notify the nearest store clerk with a smile',
        icon: '🚶',
        description: 'Protects yourself and prevents other shoppers from slipping.',
        isSafe: true,
        explanation: 'Outstanding civic safety! You protected yourself and helped keep the entire supermarket safe.'
      },
      {
        id: 'skate-through',
        label: 'Try to slide across on your sneakers quickly',
        icon: '⛸️',
        description: 'Oil spills are extremely slick and will cause heavy falls.',
        isSafe: false,
        explanation: 'Oil spills are much slipperier than water! Sliding will cause injury.'
      },
      {
        id: 'kick-cone',
        label: 'Kick the yellow warning cone out of your walking path',
        icon: '🚫',
        description: 'Displacing warning markers endangers unaware customers.',
        isSafe: false,
        explanation: 'Removing safety markers can cause other shoppers to slip and hurt themselves.'
      },
      {
        id: 'touch-glass',
        label: 'Pick up broken glass pieces with bare hands to clean it up',
        icon: '✋',
        description: 'Broken glass can cut fingers. Staff have special brooms for this.',
        isSafe: false,
        explanation: 'Never touch broken glass! Staff members have specialized brooms and protective gear.'
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

export const Challenge6ProblemSolving: React.FC<Props> = ({
  sensorySettings,
  adaptiveProfile,
  onUpdateProfile,
  parentSettings,
  onTakeBreak,
  onComplete
}) => {
  const currentVariant = PROBLEM_SOLVING_VARIANTS[adaptiveProfile.skillDifficulty] || PROBLEM_SOLVING_VARIANTS.standard;

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

  const handleCheckAction = () => {
    if (!selectedId) return;
    const newAttemptCount = attempts + 1;
    setAttempts(newAttemptCount);

    const chosen = currentVariant.options.find(a => a.id === selectedId);
    const isCorrect = chosen?.isSafe ?? false;

    const evalResult = evaluateAttempt(
      adaptiveProfile,
      `ps_${adaptiveProfile.skillDifficulty}`,
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
        message: chosen?.explanation || evalResult.gentleFeedback.message
      });
      speakText(chosen?.explanation || 'Safe choice!', sensorySettings.soundMode);
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
        message: chosen?.explanation || evalResult.gentleFeedback.message
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
        skillKey="problemSolving"
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B2D16] text-[#FF9600] text-xs font-black border border-[#6A4D20]">
          <span>Level 6</span>
          <span>•</span>
          <span>Safe Problem Solving ({adaptiveProfile.skillDifficulty.toUpperCase()})</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            {currentVariant.title}
          </h2>
          <button
            onClick={() => speakText(currentVariant.scenario, sensorySettings.soundMode)}
            className="p-2 rounded-xl bg-[#202F36] hover:bg-[#283942] text-[#FF9600] border border-[#37464F] cursor-pointer"
            title="Read scenario aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[#A5B8C0] text-sm sm:text-base font-medium">
          {currentVariant.scenario}
        </p>
      </div>

      {/* Warning Sign Visual */}
      <div className="bg-[#131F24] rounded-3xl p-5 border-2 border-[#37464F] flex items-center justify-center gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#3B2D16] border border-[#6A4D20] flex items-center justify-center text-3xl">
          ⚠️
        </div>
        <div className="text-left">
          <div className="text-xs uppercase font-extrabold text-[#FFC800]">Hazard Sign Detected</div>
          <div className="text-lg font-black text-white">CAUTION: Wet Floor Ahead</div>
        </div>
      </div>

      {/* Hint if struggle */}
      {showHint && (
        <div className="bg-[#2A2415] border-2 border-[#FFC800]/50 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-[#FFD84D] animate-fadeIn">
          <Sparkles className="w-5 h-5 text-[#FFC800] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-black text-[#FFC800]">Milo&apos;s Safety Hint:</p>
            <p className="mt-0.5 text-white/90 font-medium">
              {currentVariant.hintText}
            </p>
          </div>
        </div>
      )}

      {/* Action Choices */}
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
          id="challenge6-feedback"
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
            id="challenge6-submit-button"
            onClick={handleCheckAction}
            disabled={!selectedId || eliminatedIds.includes(selectedId)}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg tracking-wide uppercase disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>CHECK ACTION</span>
          </button>
        ) : (
          <button
            id="challenge6-next-button"
            onClick={() => {
              playGentleSound('step', sensorySettings.soundMode);
              onComplete(attempts, hintsUsed);
            }}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg group tracking-wide uppercase"
          >
            <span>CONTINUE TO FINAL MISSION</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {!showHint && feedback.status !== 'correct' && (
          <button
            id="challenge6-hint-button"
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
