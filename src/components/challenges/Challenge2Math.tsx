import React, { useState, useEffect } from 'react';
import { 
  SensorySettings, 
  SkillAdaptiveProfile, 
  ParentAdaptiveSettings,
  AdaptiveRecommendation,
  SkillDifficulty,
  SupportLevel
} from '../../types';
import { 
  Plus, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  Volume2
} from 'lucide-react';
import { playGentleSound, speakText } from '../../utils/audio';
import { evaluateAttempt } from '../../utils/adaptiveEngine';
import { AdaptiveSupportBar } from '../AdaptiveSupportBar';

interface MathQuestionVariant {
  difficulty: SkillDifficulty;
  itemPrice: number;
  quantity: number;
  itemName: string;
  itemEmoji: string;
  correctAnswer: number;
  questionText: string;
  storyPrompt: string;
  options: { value: number; label: string; coins: string }[];
  hintText: string;
}

const MATH_VARIANTS: Record<SkillDifficulty, MathQuestionVariant> = {
  easy: {
    difficulty: 'easy',
    itemPrice: 5,
    quantity: 2,
    itemName: 'Crisp Apple',
    itemEmoji: '🍎',
    correctAnswer: 10,
    questionText: 'Sam puts 2 crisp apples in the basket. Each apple is ₹5. How much do they cost in total?',
    storyPrompt: 'Counting easy ₹5 coins: ₹5 + ₹5 = ?',
    options: [
      { value: 8, label: '₹8', coins: '₹5 + ₹3' },
      { value: 10, label: '₹10', coins: '₹5 + ₹5' },
      { value: 15, label: '₹15', coins: '₹10 + ₹5' }
    ],
    hintText: 'Count two five-rupee coins: 5... 10 rupees!'
  },
  standard: {
    difficulty: 'standard',
    itemPrice: 15,
    quantity: 2,
    itemName: 'Red Apple',
    itemEmoji: '🍎',
    correctAnswer: 30,
    questionText: 'Sam puts 2 red apples in the basket. Each apple is ₹15. How much do they cost in total?',
    storyPrompt: 'Adding standard prices: ₹15 + ₹15 = ?',
    options: [
      { value: 25, label: '₹25', coins: '₹10 + ₹10 + ₹5' },
      { value: 30, label: '₹30', coins: '₹15 + ₹15' },
      { value: 35, label: '₹35', coins: '₹20 + ₹10 + ₹5' },
      { value: 40, label: '₹40', coins: '₹20 + ₹20' }
    ],
    hintText: 'Add the tens first: 10 + 10 = 20. Then add the fives: 5 + 5 = 10. Finally 20 + 10 = ₹30!'
  },
  challenge: {
    difficulty: 'challenge',
    itemPrice: 15,
    quantity: 3,
    itemName: 'Honey Apple',
    itemEmoji: '🍎',
    correctAnswer: 45,
    questionText: 'Sam puts 3 honey apples in the basket for the whole family! Each apple is ₹15. What is the total cost?',
    storyPrompt: 'Challenge multi-item counting: 3 apples at ₹15 each',
    options: [
      { value: 35, label: '₹35', coins: '₹15 + ₹15 + ₹5' },
      { value: 40, label: '₹40', coins: '₹20 + ₹20' },
      { value: 45, label: '₹45', coins: '₹15 + ₹15 + ₹15' },
      { value: 50, label: '₹50', coins: '₹20 + ₹20 + ₹10' }
    ],
    hintText: 'Two apples are ₹30. Add 1 more apple: 30 + 15 = ₹45!'
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

export const Challenge2Math: React.FC<Props> = ({
  sensorySettings,
  adaptiveProfile,
  onUpdateProfile,
  parentSettings,
  onTakeBreak,
  onComplete
}) => {
  const currentVariant = MATH_VARIANTS[adaptiveProfile.skillDifficulty] || MATH_VARIANTS.standard;

  // Local Question-Specific Temporary State (resets when question changes or restarts)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [recommendation, setRecommendation] = useState<AdaptiveRecommendation | null>(null);
  const [feedback, setFeedback] = useState<{ status: 'idle' | 'correct' | 'incorrect'; message: string }>({
    status: 'idle',
    message: ''
  });

  // Reset temporary state if difficulty changes
  useEffect(() => {
    setSelectedAnswer(null);
    setAttempts(0);
    setHintsUsed(0);
    setShowHint(false);
    setEliminatedOptions([]);
    setFeedback({ status: 'idle', message: '' });
  }, [adaptiveProfile.skillDifficulty]);

  const handleSelectOption = (value: number) => {
    if (eliminatedOptions.includes(value)) return;
    playGentleSound('click', sensorySettings.soundMode);
    setSelectedAnswer(value);
    if (feedback.status !== 'idle') {
      setFeedback({ status: 'idle', message: '' });
    }
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    const newAttemptCount = attempts + 1;
    setAttempts(newAttemptCount);

    const isCorrect = selectedAnswer === currentVariant.correctAnswer;

    // Run deterministic adaptation evaluation
    const evalResult = evaluateAttempt(
      adaptiveProfile,
      `math_${adaptiveProfile.skillDifficulty}`,
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
      speakText(`Spot on! The total is ${currentVariant.correctAnswer} rupees!`, sensorySettings.soundMode);
    } else {
      playGentleSound('click', sensorySettings.soundMode);

      // Level 2 / Level 3 Feature: Temporarily eliminate the selected wrong option if enabled
      if (parentSettings.temporaryAnswerElimination && (adaptiveProfile.supportLevel >= 2 || evalResult.updatedProfile.supportLevel >= 2)) {
        if (!eliminatedOptions.includes(selectedAnswer)) {
          setEliminatedOptions(prev => [...prev, selectedAnswer]);
        }
      }

      if (evalResult.gentleFeedback.showHintPrompt || newAttemptCount >= 2) {
        setShowHint(true);
      }

      setFeedback({
        status: 'incorrect',
        message: evalResult.gentleFeedback.message
      });
    }
  };

  // Immediate Hint Request (Always available right away without requiring mistakes!)
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

  // Level 3 Guided Support option reduction (if Level 3 is active, reduce choices to 2)
  let visibleOptions = currentVariant.options;
  if (adaptiveProfile.supportLevel === 3 && visibleOptions.length > 2) {
    const wrongOptions = visibleOptions.filter(o => o.value !== currentVariant.correctAnswer);
    // keep correct answer + 1 wrong option
    visibleOptions = visibleOptions.filter(o => o.value === currentVariant.correctAnswer || o.value === wrongOptions[0]?.value);
  }

  return (
    <div className="space-y-5">
      {/* Two-Dimensional Adaptive Support Bar */}
      <AdaptiveSupportBar 
        skillKey="math"
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

      {/* Challenge Title & Info */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143343] text-[#1CB0F6] text-xs font-black border border-[#1B5775]">
          <span>Level 2</span>
          <span>•</span>
          <span>Mathematics & Supermarket Pricing</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            Counting the Apple Coins
          </h2>
          <button
            onClick={() => speakText(currentVariant.questionText, sensorySettings.soundMode)}
            className="p-2 rounded-xl bg-[#202F36] hover:bg-[#283942] text-[#1CB0F6] border border-[#37464F] cursor-pointer"
            title="Read question aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[#A5B8C0] text-sm sm:text-base font-medium">
          {currentVariant.questionText}
        </p>
      </div>

      {/* Visual Item Demonstration Card */}
      <div className="bg-[#131F24] rounded-3xl p-5 sm:p-6 border-2 border-[#37464F] flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-center">
        {Array.from({ length: currentVariant.quantity }).map((_, idx) => (
          <React.Fragment key={idx}>
            <div className="bg-[#202F36] p-4 rounded-2xl border-2 border-[#37464F] flex flex-col items-center gap-2 min-w-[110px]">
              <span className="text-4xl">{currentVariant.itemEmoji}</span>
              <span className="text-xs font-extrabold text-[#A5B8C0]">
                {currentVariant.itemName} {idx + 1}
              </span>
              <span className="text-lg font-black text-[#58CC02] bg-[#1F3D24] px-2.5 py-0.5 rounded-lg border border-[#2E6B38]">
                ₹{currentVariant.itemPrice}
              </span>
            </div>
            {idx < currentVariant.quantity - 1 && (
              <div className="w-8 h-8 rounded-full bg-[#202F36] text-[#1CB0F6] flex items-center justify-center font-black text-lg border border-[#37464F]">
                <Plus className="w-4 h-4" />
              </div>
            )}
          </React.Fragment>
        ))}

        <div className="text-xl font-black text-white">
          = <span className="text-[#FFC800]">?</span>
        </div>
      </div>

      {/* Level 3 Simpler Explanation Banner */}
      {adaptiveProfile.supportLevel === 3 && (
        <div className="bg-[#2C1F3D] border-2 border-[#CE82FF]/50 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-[#E2C0FF] animate-fadeIn">
          <span className="text-xl">🧭</span>
          <div>
            <p className="font-black text-[#CE82FF]">Guided Step-by-Step Helper:</p>
            <p className="mt-0.5 text-white/90 font-medium">
              We narrowed your choices down to 2 options! To find the total, count each ₹{currentVariant.itemPrice} apple one by one.
            </p>
          </div>
        </div>
      )}

      {/* Hint Banner */}
      {showHint && (
        <div className="bg-[#2A2415] border-2 border-[#FFC800]/50 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-[#FFD84D] animate-fadeIn">
          <Sparkles className="w-5 h-5 text-[#FFC800] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-black text-[#FFC800]">Milo&apos;s Math Hint:</p>
            <p className="mt-0.5 text-white/90 font-medium">
              {currentVariant.hintText}
            </p>
          </div>
        </div>
      )}

      {/* Multiple Choice Options with Level 2 Temporary Elimination */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {visibleOptions.map((opt) => {
          const isSelected = selectedAnswer === opt.value;
          const isEliminated = eliminatedOptions.includes(opt.value);

          return (
            <button
              key={opt.value}
              id={`math-opt-${opt.value}`}
              onClick={() => handleSelectOption(opt.value)}
              disabled={isEliminated}
              className={`p-4 sm:p-5 rounded-2xl text-center transition-all border-2 relative ${
                isEliminated
                  ? 'bg-[#182024]/50 border-[#28373E] text-[#556973] opacity-40 cursor-not-allowed line-through'
                  : isSelected
                  ? 'bg-[#1CB0F6]/20 border-[#1CB0F6] text-white ring-2 ring-[#1CB0F6]/40 scale-[1.02] cursor-pointer'
                  : 'bg-[#131F24] border-[#37464F] hover:border-[#58CC02] text-white hover:bg-[#202F36] cursor-pointer'
              }`}
            >
              {isEliminated && (
                <span className="absolute top-2 right-2 text-[10px] font-black uppercase text-[#FF4B4B] bg-[#2B1B1D] px-2 py-0.5 rounded-full border border-[#662832]">
                  Tried
                </span>
              )}
              <div className="text-2xl sm:text-3xl font-black text-white">{opt.label}</div>
              <div className="text-xs text-[#A5B8C0] mt-1 font-bold">{opt.coins}</div>
            </button>
          );
        })}
      </div>

      {/* Gentle Feedback Banner */}
      {feedback.status !== 'idle' && (
        <div 
          id="challenge2-feedback"
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
                Wrong option temporarily crossed out. Take your time and select another answer!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        {feedback.status !== 'correct' ? (
          <button
            id="challenge2-submit-button"
            onClick={handleCheckAnswer}
            disabled={selectedAnswer === null || eliminatedOptions.includes(selectedAnswer)}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg tracking-wide uppercase disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>CHECK MY ANSWER</span>
          </button>
        ) : (
          <button
            id="challenge2-next-button"
            onClick={() => {
              playGentleSound('step', sensorySettings.soundMode);
              onComplete(attempts, hintsUsed);
            }}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg group tracking-wide uppercase"
          >
            <span>CONTINUE TO LEVEL 3</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {!showHint && feedback.status !== 'correct' && (
          <button
            id="challenge2-hint-button"
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
