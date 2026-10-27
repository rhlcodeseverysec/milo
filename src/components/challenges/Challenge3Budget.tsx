import React, { useState, useEffect } from 'react';
import { 
  SensorySettings, 
  MarketItem, 
  SkillAdaptiveProfile, 
  ParentAdaptiveSettings, 
  AdaptiveRecommendation, 
  SkillDifficulty 
} from '../../types';
import { 
  ShoppingBag, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Minus, 
  Volume2 
} from 'lucide-react';
import { playGentleSound, speakText } from '../../utils/audio';
import { evaluateAttempt } from '../../utils/adaptiveEngine';
import { AdaptiveSupportBar } from '../AdaptiveSupportBar';

interface BudgetVariant {
  difficulty: SkillDifficulty;
  maxBudget: number;
  minItems: number;
  maxItems?: number;
  targetSavingsMin?: number;
  prompt: string;
  items: MarketItem[];
  hintText: string;
}

const BUDGET_VARIANTS: Record<SkillDifficulty, BudgetVariant> = {
  easy: {
    difficulty: 'easy',
    maxBudget: 50,
    minItems: 2,
    prompt: 'You have ₹50 in your purse! Pick at least 2 healthy snacks without going over ₹50.',
    hintText: 'Milk (₹20) + Carrots (₹10) = ₹30, which is well under ₹50!',
    items: [
      { id: 'item-milk', name: 'Fresh Milk', price: 20, icon: '🥛', category: 'Dairy', description: 'Cold fresh bottle' },
      { id: 'item-banana', name: 'Sweet Bananas', price: 15, icon: '🍌', category: 'Fruit', description: 'Bunch of 4' },
      { id: 'item-carrots', name: 'Crunchy Carrots', price: 10, icon: '🥕', category: 'Veggies', description: 'Fresh bag' },
      { id: 'item-cookies', name: 'Choco Cookies', price: 25, icon: '🍪', category: 'Snacks', description: 'Sweet treat' },
    ]
  },
  standard: {
    difficulty: 'standard',
    maxBudget: 100,
    minItems: 3,
    prompt: 'You have ₹100 in your purse! Pick at least 3 groceries without exceeding ₹100.',
    hintText: 'Milk (₹30) + Bread (₹25) + Bananas (₹20) = ₹75. That is 3 items under ₹100!',
    items: [
      { id: 'item-milk', name: 'Fresh Milk', price: 30, icon: '🥛', category: 'Dairy', description: 'Cold fresh bottle' },
      { id: 'item-bread', name: 'Whole Bread', price: 25, icon: '🍞', category: 'Bakery', description: 'Soft wheat loaf' },
      { id: 'item-banana', name: 'Sweet Bananas', price: 20, icon: '🍌', category: 'Fruit', description: 'Bunch of 4' },
      { id: 'item-cookies', name: 'Choco Cookies', price: 40, icon: '🍪', category: 'Snacks', description: 'Crunchy treat' },
      { id: 'item-carrots', name: 'Crunchy Carrots', price: 15, icon: '🥕', category: 'Veggies', description: 'Fresh bag' },
    ]
  },
  challenge: {
    difficulty: 'challenge',
    maxBudget: 100,
    minItems: 4,
    targetSavingsMin: 10,
    prompt: 'Budget Challenge! Pick 4 items totaling between ₹70 and ₹90, leaving at least ₹10 in savings from your ₹100 purse.',
    hintText: 'Try: Carrots (₹15) + Bananas (₹20) + Bread (₹25) + Milk (₹30) = ₹90. You keep ₹10 saved!',
    items: [
      { id: 'item-milk', name: 'Fresh Milk', price: 30, icon: '🥛', category: 'Dairy', description: 'Cold fresh bottle' },
      { id: 'item-bread', name: 'Whole Bread', price: 25, icon: '🍞', category: 'Bakery', description: 'Soft wheat loaf' },
      { id: 'item-banana', name: 'Sweet Bananas', price: 20, icon: '🍌', category: 'Fruit', description: 'Bunch of 4' },
      { id: 'item-cookies', name: 'Choco Cookies', price: 40, icon: '🍪', category: 'Snacks', description: 'Crunchy treat' },
      { id: 'item-carrots', name: 'Crunchy Carrots', price: 15, icon: '🥕', category: 'Veggies', description: 'Fresh bag' },
      { id: 'item-apples', name: 'Red Apples', price: 20, icon: '🍎', category: 'Fruit', description: 'Bag of 2' }
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

export const Challenge3Budget: React.FC<Props> = ({
  sensorySettings,
  adaptiveProfile,
  onUpdateProfile,
  parentSettings,
  onTakeBreak,
  onComplete
}) => {
  const currentVariant = BUDGET_VARIANTS[adaptiveProfile.skillDifficulty] || BUDGET_VARIANTS.standard;

  const [selectedIds, setSelectedIds] = useState<string[]>([currentVariant.items[0].id]);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [recommendation, setRecommendation] = useState<AdaptiveRecommendation | null>(null);
  const [feedback, setFeedback] = useState<{ status: 'idle' | 'correct' | 'incorrect'; message: string }>({
    status: 'idle',
    message: ''
  });

  useEffect(() => {
    setSelectedIds([currentVariant.items[0].id]);
    setAttempts(0);
    setHintsUsed(0);
    setShowHint(false);
    setFeedback({ status: 'idle', message: '' });
  }, [adaptiveProfile.skillDifficulty]);

  const currentTotal = selectedIds.reduce((sum, id) => {
    const item = currentVariant.items.find(g => g.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const isOverBudget = currentTotal > currentVariant.maxBudget;

  const toggleItem = (id: string) => {
    playGentleSound('click', sensorySettings.soundMode);
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
    if (feedback.status !== 'idle') {
      setFeedback({ status: 'idle', message: '' });
    }
  };

  const handleCheckBudget = () => {
    const newAttemptCount = attempts + 1;
    setAttempts(newAttemptCount);

    let isSuccess = false;
    let customFeedback = '';

    if (currentVariant.difficulty === 'challenge') {
      const meetsItems = selectedIds.length >= currentVariant.minItems;
      const meetsSavings = currentTotal <= 90 && currentTotal >= 70;
      isSuccess = meetsItems && meetsSavings;

      if (isSuccess) {
        customFeedback = `Masterful budgeting! ${selectedIds.length} items totaling ₹${currentTotal}, safely saving ₹${100 - currentTotal}!`;
      } else if (currentTotal > 90) {
        customFeedback = `Total is ₹${currentTotal}. We need to save at least ₹10, so keep total at or under ₹90!`;
      } else if (selectedIds.length < currentVariant.minItems) {
        customFeedback = `You have ${selectedIds.length} items. Pick ${currentVariant.minItems} items for the challenge!`;
      } else {
        customFeedback = `Total is ₹${currentTotal}. Try adding one more item to reach at least ₹70!`;
      }
    } else {
      isSuccess = selectedIds.length >= currentVariant.minItems && currentTotal <= currentVariant.maxBudget;
      if (isSuccess) {
        customFeedback = `Perfect! You picked ${selectedIds.length} healthy items totaling ₹${currentTotal}, safe within your ₹${currentVariant.maxBudget} purse!`;
      } else if (isOverBudget) {
        customFeedback = `Total is ₹${currentTotal}, which is over your ₹${currentVariant.maxBudget} purse. Tap an item to remove it!`;
      } else {
        customFeedback = `You currently have ${selectedIds.length} item(s). Choose at least ${currentVariant.minItems} items without exceeding ₹${currentVariant.maxBudget}!`;
      }
    }

    const evalResult = evaluateAttempt(
      adaptiveProfile,
      `budget_${adaptiveProfile.skillDifficulty}`,
      isSuccess,
      newAttemptCount,
      hintsUsed,
      parentSettings
    );

    onUpdateProfile(evalResult.updatedProfile);
    if (evalResult.recommendation) {
      setRecommendation(evalResult.recommendation);
    }

    if (isSuccess) {
      playGentleSound('correct', sensorySettings.soundMode);
      setFeedback({
        status: 'correct',
        message: customFeedback
      });
      speakText(customFeedback, sensorySettings.soundMode);
    } else {
      playGentleSound('click', sensorySettings.soundMode);
      if (evalResult.gentleFeedback.showHintPrompt || newAttemptCount >= 2) {
        setShowHint(true);
      }
      setFeedback({
        status: 'incorrect',
        message: customFeedback
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
        skillKey="budgeting"
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B3416] text-[#FFC800] text-xs font-black border border-[#6A5720]">
          <span>Level 3</span>
          <span>•</span>
          <span>Budgeting & Resource Planning ({adaptiveProfile.skillDifficulty.toUpperCase()})</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            Supermarket Purse Management
          </h2>
          <button
            onClick={() => speakText(currentVariant.prompt, sensorySettings.soundMode)}
            className="p-2 rounded-xl bg-[#202F36] hover:bg-[#283942] text-[#FFC800] border border-[#37464F] cursor-pointer"
            title="Read instructions aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[#A5B8C0] text-sm sm:text-base font-medium">
          {currentVariant.prompt}
        </p>
      </div>

      {/* Purse Gauge */}
      <div className="bg-[#18262C] rounded-3xl p-5 border-2 border-[#28373E] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👛</span>
            <div>
              <div className="text-xs uppercase font-extrabold text-[#A5B8C0]">Purse Total</div>
              <div className={`text-2xl font-black ${isOverBudget ? 'text-[#FF4B4B]' : 'text-[#58CC02]'}`}>
                ₹{currentTotal} <span className="text-sm text-[#A5B8C0] font-bold">/ ₹{currentVariant.maxBudget}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs uppercase font-extrabold text-[#A5B8C0]">Items Picked</div>
            <div className="text-lg font-black text-white">
              {selectedIds.length} <span className="text-xs text-[#A5B8C0]">({currentVariant.minItems} min)</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-[#131F24] rounded-full overflow-hidden border border-[#202F36]">
          <div 
            className={`h-full transition-all duration-300 ${
              isOverBudget ? 'bg-[#FF4B4B]' : currentTotal >= currentVariant.maxBudget * 0.8 ? 'bg-[#FFC800]' : 'bg-[#58CC02]'
            }`}
            style={{ width: `${Math.min(100, (currentTotal / currentVariant.maxBudget) * 100)}%` }}
          />
        </div>
      </div>

      {/* Hint if struggle */}
      {showHint && (
        <div className="bg-[#2A2415] border-2 border-[#FFC800]/50 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-[#FFD84D] animate-fadeIn">
          <Sparkles className="w-5 h-5 text-[#FFC800] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-black text-[#FFC800]">Milo&apos;s Budget Clue:</p>
            <p className="mt-0.5 text-white/90 font-medium">
              {currentVariant.hintText}
            </p>
          </div>
        </div>
      )}

      {/* Grocery Items List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentVariant.items.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          const wouldExceed = !isSelected && currentTotal + item.price > currentVariant.maxBudget;

          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#183424] border-[#58CC02] text-white shadow-md'
                  : wouldExceed && adaptiveProfile.supportLevel >= 2
                  ? 'bg-[#131F24] border-[#37464F] opacity-70 hover:opacity-100'
                  : 'bg-[#18262C] border-[#28373E] hover:border-[#37464F] text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white">{item.name}</h4>
                  <p className="text-xs text-[#A5B8C0]">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-[#58CC02] bg-[#1F3D24] px-2.5 py-1 rounded-xl border border-[#2E6B38]">
                  ₹{item.price}
                </span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-[#58CC02] text-white' : 'bg-[#202F36] text-[#A5B8C0]'
                }`}>
                  {isSelected ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Gentle Feedback Banner */}
      {feedback.status !== 'idle' && (
        <div 
          id="challenge3-feedback"
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
            id="challenge3-submit-button"
            onClick={handleCheckBudget}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg tracking-wide uppercase"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>CHECK MY PURSE</span>
          </button>
        ) : (
          <button
            id="challenge3-next-button"
            onClick={() => {
              playGentleSound('step', sensorySettings.soundMode);
              onComplete(attempts, hintsUsed);
            }}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg group tracking-wide uppercase"
          >
            <span>CONTINUE TO LEVEL 4</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {!showHint && feedback.status !== 'correct' && (
          <button
            id="challenge3-hint-button"
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
