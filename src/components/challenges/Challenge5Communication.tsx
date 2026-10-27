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
  MessageCircle, 
  Volume2 
} from 'lucide-react';
import { playGentleSound, speakText } from '../../utils/audio';
import { evaluateAttempt } from '../../utils/adaptiveEngine';
import { AdaptiveSupportBar } from '../AdaptiveSupportBar';

interface DialogueOption {
  id: string;
  text: string;
  isAppropriate: boolean;
  explanation: string;
}

const COMMUNICATION_VARIANTS: Record<SkillDifficulty, { title: string; scenario: string; options: DialogueOption[]; hintText: string }> = {
  easy: {
    title: 'Polite Words with Helpers (Gentle Choices)',
    scenario: 'Sam wants to find the honey jar. Which phrase is kind and polite?',
    hintText: 'Polite words use "Excuse me" and "please"!',
    options: [
      {
        id: 'opt-polite',
        text: '"Excuse me, please could you help me find the honey jar?"',
        isAppropriate: true,
        explanation: 'Perfect! Using "Excuse me" and "please" is friendly, clear, and polite.'
      },
      {
        id: 'opt-blunt',
        text: '"Give me the honey right now!"',
        isAppropriate: false,
        explanation: 'This sounds bossy. Using "please" and "excuse me" helps people gladly assist you!'
      }
    ]
  },
  standard: {
    title: 'Supermarket Social Communication',
    scenario: 'Sam is at the grocery counter and needs help locating the honey. What is the most polite phrasing?',
    hintText: 'A polite request starts with "Excuse me" and includes "please"!',
    options: [
      {
        id: 'opt-polite',
        text: '"Excuse me, could you please tell me where the honey jar is?"',
        isAppropriate: true,
        explanation: 'Perfect! Using "Excuse me" and "please" is friendly, clear, and polite.'
      },
      {
        id: 'opt-blunt',
        text: '"Give me the honey right now!"',
        isAppropriate: false,
        explanation: 'This sounds demanding. Asking politely with "please" helps people want to assist you!'
      },
      {
        id: 'opt-silent',
        text: 'Stare quietly and point with a finger without saying anything',
        isAppropriate: false,
        explanation: 'While pointing works if you cannot speak, using polite words or a communication card is much clearer!'
      }
    ]
  },
  challenge: {
    title: 'Advanced Social Advocacy & Context',
    scenario: 'Mr. Rao is actively restocking cereal boxes. How can Sam respectfully capture his attention to ask for the honey?',
    hintText: 'Wait for a natural pause in their task, smile, and ask if they have a brief moment.',
    options: [
      {
        id: 'opt-respectful',
        text: 'Wait for him to set down the box, smile, and say: "Excuse me Mr. Rao, when you have a moment, could you please point me to the honey?"',
        isAppropriate: true,
        explanation: 'Outstanding social awareness! Acknowledging their current task while politely asking shows great empathy.'
      },
      {
        id: 'opt-tap-shoulder',
        text: 'Tap him repeatedly on the shoulder while he is lifting a heavy crate',
        isAppropriate: false,
        explanation: 'Tapping someone while they lift heavy crates could cause them to drop items. Always wait for them to set it down!'
      },
      {
        id: 'opt-yell',
        text: 'Shout from three aisles away: "Hey you! Where is the honey?"',
        isAppropriate: false,
        explanation: 'Shouting across aisles disrupts the store. Walking up politely and using indoor voice is best.'
      },
      {
        id: 'opt-leave',
        text: 'Give up entirely and leave the store without honey',
        isAppropriate: false,
        explanation: 'Never give up! Store helpers are happy to help when asked politely.'
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

export const Challenge5Communication: React.FC<Props> = ({
  sensorySettings,
  adaptiveProfile,
  onUpdateProfile,
  parentSettings,
  onTakeBreak,
  onComplete
}) => {
  const currentVariant = COMMUNICATION_VARIANTS[adaptiveProfile.skillDifficulty] || COMMUNICATION_VARIANTS.standard;

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

  const handleCheckDialogue = () => {
    if (!selectedId) return;
    const newAttemptCount = attempts + 1;
    setAttempts(newAttemptCount);

    const chosen = currentVariant.options.find(d => d.id === selectedId);
    const isCorrect = chosen?.isAppropriate ?? false;

    const evalResult = evaluateAttempt(
      adaptiveProfile,
      `com_${adaptiveProfile.skillDifficulty}`,
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
      speakText(chosen?.explanation || 'Polite choice!', sensorySettings.soundMode);
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
        skillKey="communication"
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C1F3D] text-[#CE82FF] text-xs font-black border border-[#532E7C]">
          <span>Level 5</span>
          <span>•</span>
          <span>Social Communication ({adaptiveProfile.skillDifficulty.toUpperCase()})</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            {currentVariant.title}
          </h2>
          <button
            onClick={() => speakText(currentVariant.scenario, sensorySettings.soundMode)}
            className="p-2 rounded-xl bg-[#202F36] hover:bg-[#283942] text-[#CE82FF] border border-[#37464F] cursor-pointer"
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
            <p className="font-black text-[#FFC800]">Milo&apos;s Polite Script Clue:</p>
            <p className="mt-0.5 text-white/90 font-medium">
              {currentVariant.hintText}
            </p>
          </div>
        </div>
      )}

      {/* Dialogue Choices */}
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
              <div className="p-2 rounded-xl bg-[#202F36] text-[#CE82FF] flex-shrink-0 mt-0.5">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="font-extrabold text-sm sm:text-base text-white">
                  {opt.text}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Gentle Feedback Banner */}
      {feedback.status !== 'idle' && (
        <div 
          id="challenge5-feedback"
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
            id="challenge5-submit-button"
            onClick={handleCheckDialogue}
            disabled={!selectedId || eliminatedIds.includes(selectedId)}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg tracking-wide uppercase disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>CHECK MY WORDS</span>
          </button>
        ) : (
          <button
            id="challenge5-next-button"
            onClick={() => {
              playGentleSound('step', sensorySettings.soundMode);
              onComplete(attempts, hintsUsed);
            }}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg group tracking-wide uppercase"
          >
            <span>CONTINUE TO LEVEL 6</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {!showHint && feedback.status !== 'correct' && (
          <button
            id="challenge5-hint-button"
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
