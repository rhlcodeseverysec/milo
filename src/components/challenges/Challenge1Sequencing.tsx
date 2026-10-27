import React, { useState, useEffect } from 'react';
import { 
  SensorySettings, 
  SkillAdaptiveProfile, 
  ParentAdaptiveSettings,
  AdaptiveRecommendation,
  SkillDifficulty
} from '../../types';
import { 
  ShoppingBag, 
  Search, 
  Store, 
  CreditCard, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  Volume2,
  FileText,
  Receipt
} from 'lucide-react';
import { playGentleSound, speakText } from '../../utils/audio';
import { evaluateAttempt } from '../../utils/adaptiveEngine';
import { AdaptiveSupportBar } from '../AdaptiveSupportBar';

interface StepItem {
  id: string;
  originalIndex: number;
  text: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
}

const SEQUENCING_VARIANTS: Record<SkillDifficulty, { title: string; prompt: string; steps: StepItem[]; hintText: string }> = {
  easy: {
    title: 'Getting Ready to Shop (3 Simple Steps)',
    prompt: 'Milo and Sam are shopping! Put these 3 simple steps in order from first to last.',
    hintText: 'First pick up the shopping basket, then choose groceries, and pay at the end!',
    steps: [
      { id: 'step-choose', originalIndex: 2, text: 'Choose the groceries', iconName: 'Search', iconBg: 'bg-[#FF9600]/20', iconColor: 'text-[#FF9600]' },
      { id: 'step-basket', originalIndex: 1, text: 'Pick up the shopping basket', iconName: 'ShoppingBag', iconBg: 'bg-[#58CC02]/20', iconColor: 'text-[#58CC02]' },
      { id: 'step-pay', originalIndex: 3, text: 'Pay with coins at register', iconName: 'CreditCard', iconBg: 'bg-[#1CB0F6]/20', iconColor: 'text-[#1CB0F6]' },
    ]
  },
  standard: {
    title: 'Getting Ready to Shop (4 Standard Steps)',
    prompt: 'Help Milo and Sam prepare for shopping. Move the steps up or down so they happen in the right order.',
    hintText: 'Think about what Milo and Sam need first: Pick up the basket, choose food, bring to counter, then pay!',
    steps: [
      { id: 'step-choose', originalIndex: 2, text: 'Choose the groceries', iconName: 'Search', iconBg: 'bg-[#FF9600]/20', iconColor: 'text-[#FF9600]' },
      { id: 'step-basket', originalIndex: 1, text: 'Pick up the shopping basket', iconName: 'ShoppingBag', iconBg: 'bg-[#58CC02]/20', iconColor: 'text-[#58CC02]' },
      { id: 'step-pay', originalIndex: 4, text: 'Pay with coins at register', iconName: 'CreditCard', iconBg: 'bg-[#1CB0F6]/20', iconColor: 'text-[#1CB0F6]' },
      { id: 'step-counter', originalIndex: 3, text: 'Bring basket to the counter', iconName: 'Store', iconBg: 'bg-[#CE82FF]/20', iconColor: 'text-[#CE82FF]' },
    ]
  },
  challenge: {
    title: 'Supermarket Routine Mastery (5 Steps)',
    prompt: 'Put all 5 supermarket steps in exact logical sequence, from checking your list to getting the receipt.',
    hintText: 'Start with checking your list, then grab the basket, pick items, head to checkout, and get receipt!',
    steps: [
      { id: 'step-choose', originalIndex: 3, text: 'Choose the groceries from aisles', iconName: 'Search', iconBg: 'bg-[#FF9600]/20', iconColor: 'text-[#FF9600]' },
      { id: 'step-list', originalIndex: 1, text: 'Check the grocery shopping list', iconName: 'FileText', iconBg: 'bg-[#FFC800]/20', iconColor: 'text-[#FFC800]' },
      { id: 'step-basket', originalIndex: 2, text: 'Pick up the shopping basket', iconName: 'ShoppingBag', iconBg: 'bg-[#58CC02]/20', iconColor: 'text-[#58CC02]' },
      { id: 'step-receipt', originalIndex: 5, text: 'Take bags & supermarket receipt', iconName: 'Receipt', iconBg: 'bg-[#58CC02]/20', iconColor: 'text-[#58CC02]' },
      { id: 'step-counter', originalIndex: 4, text: 'Bring basket to the cashier counter', iconName: 'Store', iconBg: 'bg-[#CE82FF]/20', iconColor: 'text-[#CE82FF]' },
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

export const Challenge1Sequencing: React.FC<Props> = ({
  sensorySettings,
  adaptiveProfile,
  onUpdateProfile,
  parentSettings,
  onTakeBreak,
  onComplete
}) => {
  const currentVariant = SEQUENCING_VARIANTS[adaptiveProfile.skillDifficulty] || SEQUENCING_VARIANTS.standard;

  const [items, setItems] = useState<StepItem[]>(currentVariant.steps);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [recommendation, setRecommendation] = useState<AdaptiveRecommendation | null>(null);
  const [correctPositions, setCorrectPositions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ status: 'idle' | 'correct' | 'incorrect'; message: string }>({
    status: 'idle',
    message: ''
  });

  const showPictures = sensorySettings.instructionMode !== 'text';
  const showText = sensorySettings.instructionMode !== 'pictures';

  useEffect(() => {
    setItems(currentVariant.steps);
    setAttempts(0);
    setHintsUsed(0);
    setShowHint(false);
    setCorrectPositions([]);
    setFeedback({ status: 'idle', message: '' });
  }, [adaptiveProfile.skillDifficulty]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    playGentleSound('step', sensorySettings.soundMode);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    setItems(newItems);
    if (feedback.status !== 'idle') {
      setFeedback({ status: 'idle', message: '' });
    }
  };

  const handleCheckOrder = () => {
    const newAttemptCount = attempts + 1;
    setAttempts(newAttemptCount);

    const isCorrect = items.every((item, idx) => item.originalIndex === idx + 1);

    // Track which items are in correct positions for gentle Level 2 feedback
    const correctIdxs: number[] = [];
    items.forEach((item, idx) => {
      if (item.originalIndex === idx + 1) {
        correctIdxs.push(idx);
      }
    });
    setCorrectPositions(correctIdxs);

    const evalResult = evaluateAttempt(
      adaptiveProfile,
      `seq_${adaptiveProfile.skillDifficulty}`,
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
        message: evalResult.gentleFeedback.message
      });
      speakText('Great job! You arranged the steps in perfect order!', sensorySettings.soundMode);
    } else {
      playGentleSound('click', sensorySettings.soundMode);
      if (evalResult.gentleFeedback.showHintPrompt || newAttemptCount >= 2) {
        setShowHint(true);
      }
      setFeedback({
        status: 'incorrect',
        message: evalResult.gentleFeedback.message
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

  const renderIcon = (name: string) => {
    switch (name) {
      case 'ShoppingBag': return <ShoppingBag className="w-6 h-6" />;
      case 'Search': return <Search className="w-6 h-6" />;
      case 'Store': return <Store className="w-6 h-6" />;
      case 'CreditCard': return <CreditCard className="w-6 h-6" />;
      case 'FileText': return <FileText className="w-6 h-6" />;
      case 'Receipt': return <Receipt className="w-6 h-6" />;
      default: return <ShoppingBag className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Two-Dimensional Adaptive Support Bar */}
      <AdaptiveSupportBar 
        skillKey="sequencing"
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

      {/* Challenge Title & Story Question */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D24] text-[#58CC02] text-xs font-black border border-[#2E6B38]">
          <span>Level 1</span>
          <span>•</span>
          <span>Visual Sequencing ({adaptiveProfile.skillDifficulty.toUpperCase()})</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            {currentVariant.title}
          </h2>
          <button
            onClick={() => speakText(currentVariant.prompt, sensorySettings.soundMode)}
            className="p-2 rounded-xl bg-[#202F36] hover:bg-[#283942] text-[#58CC02] border border-[#37464F] cursor-pointer"
            title="Read instructions aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[#A5B8C0] text-sm sm:text-base font-medium">
          {currentVariant.prompt}
        </p>
      </div>

      {/* Hint if struggle */}
      {showHint && (
        <div className="bg-[#2A2415] border-2 border-[#FFC800]/50 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-[#FFD84D] animate-fadeIn">
          <Sparkles className="w-5 h-5 text-[#FFC800] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-black text-[#FFC800]">Milo&apos;s Step-Order Hint:</p>
            <p className="mt-0.5 text-white/90 font-medium">
              {currentVariant.hintText}
            </p>
          </div>
        </div>
      )}

      {/* Step Sequence Cards with Level 2 Gentle Position Feedback */}
      <div className="space-y-3">
        {items.map((step, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === items.length - 1;
          const isPositionCorrect = correctPositions.includes(idx);

          return (
            <div 
              key={step.id}
              className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                isPositionCorrect && feedback.status === 'incorrect'
                  ? 'bg-[#183424] border-[#58CC02]/80 ring-2 ring-[#58CC02]/30'
                  : 'bg-[#18262C] border-[#28373E] hover:border-[#37464F]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#131F24] border border-[#202F36] flex items-center justify-center font-black text-xs text-[#58CC02]">
                  {idx + 1}
                </div>

                {showPictures && (
                  <div className={`p-2.5 rounded-xl ${step.iconBg} ${step.iconColor}`}>
                    {renderIcon(step.iconName)}
                  </div>
                )}

                {showText && (
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-sm sm:text-base text-white">
                      {step.text}
                    </span>
                    {isPositionCorrect && feedback.status === 'incorrect' && (
                      <div className="text-[11px] font-black text-[#58CC02] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Step {idx + 1} is in the right position!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Move Step Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => moveItem(idx, 'up')}
                  disabled={isFirst}
                  className="p-2 rounded-xl bg-[#202F36] hover:bg-[#283942] text-white disabled:opacity-30 disabled:cursor-not-allowed border border-[#37464F] cursor-pointer"
                  title="Move step up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveItem(idx, 'down')}
                  disabled={isLast}
                  className="p-2 rounded-xl bg-[#202F36] hover:bg-[#283942] text-white disabled:opacity-30 disabled:cursor-not-allowed border border-[#37464F] cursor-pointer"
                  title="Move step down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gentle Feedback Banner */}
      {feedback.status !== 'idle' && (
        <div 
          id="challenge1-feedback"
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
            {feedback.status === 'incorrect' && (
              <p className="text-xs text-[#FFD84D] mt-1 font-medium">
                Green highlighted steps are already in the right spot! Adjust the remaining steps.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        {feedback.status !== 'correct' ? (
          <button
            id="challenge1-submit-button"
            onClick={handleCheckOrder}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg tracking-wide uppercase"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>CHECK MY ORDER</span>
          </button>
        ) : (
          <button
            id="challenge1-next-button"
            onClick={() => {
              playGentleSound('step', sensorySettings.soundMode);
              onComplete(attempts, hintsUsed);
            }}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg group tracking-wide uppercase"
          >
            <span>CONTINUE TO LEVEL 2</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {!showHint && feedback.status !== 'correct' && (
          <button
            id="challenge1-hint-button"
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
