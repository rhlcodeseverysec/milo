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
  ArrowRight, 
  ShoppingBag, 
  CreditCard, 
  MessageSquare, 
  Sparkles, 
  Check, 
  Volume2 
} from 'lucide-react';
import { playGentleSound, speakText } from '../../utils/audio';
import { evaluateAttempt } from '../../utils/adaptiveEngine';
import { AdaptiveSupportBar } from '../AdaptiveSupportBar';

interface Props {
  sensorySettings: SensorySettings;
  adaptiveProfile: SkillAdaptiveProfile;
  onUpdateProfile: (profile: SkillAdaptiveProfile) => void;
  parentSettings: ParentAdaptiveSettings;
  onTakeBreak: () => void;
  onComplete: (attempts: number, hintsUsed: number) => void;
}

export const Challenge7FinalMission: React.FC<Props> = ({
  sensorySettings,
  adaptiveProfile,
  onUpdateProfile,
  parentSettings,
  onTakeBreak,
  onComplete
}) => {
  const [missionStep, setMissionStep] = useState<1 | 2 | 3>(1);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    apples: false,
    bread: false,
    juice: false
  });

  const [selectedChange, setSelectedChange] = useState<number | null>(null);
  const [eliminatedChange, setEliminatedChange] = useState<number[]>([]);
  const [changeError, setChangeError] = useState(false);

  const [selectedPhrase, setSelectedPhrase] = useState<number | null>(null);
  const [eliminatedPhrase, setEliminatedPhrase] = useState<number[]>([]);
  const [phraseError, setPhraseError] = useState(false);

  const [totalAttempts, setTotalAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [recommendation, setRecommendation] = useState<AdaptiveRecommendation | null>(null);

  // Difficulty configurations for register step
  const registerConfig: Record<SkillDifficulty, { bill: number; paid: number; change: number; options: number[]; hint: string }> = {
    easy: {
      bill: 40,
      paid: 50,
      change: 10,
      options: [5, 10, 15],
      hint: '₹50 minus ₹40 leaves exactly ₹10 in change!'
    },
    standard: {
      bill: 70,
      paid: 100,
      change: 30,
      options: [20, 30, 40],
      hint: 'Count up from ₹70 to ₹100: 70 + 30 = 100! So change is ₹30.'
    },
    challenge: {
      bill: 65,
      paid: 100,
      change: 35,
      options: [25, 30, 35, 40],
      hint: '₹100 minus ₹60 is ₹40, minus ₹5 more leaves ₹35 in change!'
    }
  };

  const reg = registerConfig[adaptiveProfile.skillDifficulty] || registerConfig.standard;

  useEffect(() => {
    setSelectedChange(null);
    setEliminatedChange([]);
    setSelectedPhrase(null);
    setEliminatedPhrase([]);
    setShowHint(false);
    setChangeError(false);
    setPhraseError(false);
  }, [adaptiveProfile.skillDifficulty]);

  // Step 1: Check items
  const allItemsChecked = checkedItems.apples && checkedItems.bread && checkedItems.juice;

  const toggleCheck = (key: 'apples' | 'bread' | 'juice') => {
    playGentleSound('click', sensorySettings.soundMode);
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Step 2: Change calculation
  const handleSelectChange = (val: number) => {
    if (eliminatedChange.includes(val)) return;
    setSelectedChange(val);
    const newTotalAttempts = totalAttempts + 1;
    setTotalAttempts(newTotalAttempts);

    if (val === reg.change) {
      playGentleSound('correct', sensorySettings.soundMode);
      setChangeError(false);
      speakText(`Correct! ${reg.paid} rupees minus ${reg.bill} rupees leaves ${reg.change} rupees in change.`, sensorySettings.soundMode);
      setTimeout(() => {
        setMissionStep(3);
      }, 600);
    } else {
      playGentleSound('click', sensorySettings.soundMode);
      setChangeError(true);
      if (parentSettings.temporaryAnswerElimination && adaptiveProfile.supportLevel >= 2) {
        if (!eliminatedChange.includes(val)) {
          setEliminatedChange(prev => [...prev, val]);
        }
      }
    }
  };

  // Step 3: Checkout communication
  const handleSelectPhrase = (phraseId: number) => {
    if (eliminatedPhrase.includes(phraseId)) return;
    setSelectedPhrase(phraseId);
    const newTotalAttempts = totalAttempts + 1;
    setTotalAttempts(newTotalAttempts);

    if (phraseId === 1) {
      playGentleSound('cheer', sensorySettings.soundMode);
      setPhraseError(false);

      const evalResult = evaluateAttempt(
        adaptiveProfile,
        `int_${adaptiveProfile.skillDifficulty}`,
        true,
        newTotalAttempts,
        hintsUsed,
        parentSettings
      );
      onUpdateProfile(evalResult.updatedProfile);
      if (evalResult.recommendation) {
        setRecommendation(evalResult.recommendation);
      }

      speakText('Wonderful! Thank you for your help Mr. Rao, have a great day! Quest completed!', sensorySettings.soundMode);
      setTimeout(() => {
        onComplete(Math.max(1, newTotalAttempts), hintsUsed);
      }, 700);
    } else {
      playGentleSound('click', sensorySettings.soundMode);
      setPhraseError(true);
      if (parentSettings.temporaryAnswerElimination && adaptiveProfile.supportLevel >= 2) {
        if (!eliminatedPhrase.includes(phraseId)) {
          setEliminatedPhrase(prev => [...prev, phraseId]);
        }
      }
    }
  };

  const handleRequestImmediateHint = () => {
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
    onUpdateProfile({
      ...adaptiveProfile,
      hintsRequested: adaptiveProfile.hintsRequested + 1
    });
    const hintMsg = missionStep === 1 
      ? 'Tap every item in your basket to make sure it is checked!'
      : missionStep === 2
      ? reg.hint
      : 'Choose the polite greeting that thanks Mr. Rao!';
    speakText(hintMsg, sensorySettings.soundMode);
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
        skillKey="integrated"
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

      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D24] text-[#58CC02] text-xs font-black border border-[#2E6B38]">
          <span>Level 7</span>
          <span>•</span>
          <span>Grand Finale Mission ({adaptiveProfile.skillDifficulty.toUpperCase()})</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            The Supermarket Grand Checkout
          </h2>
          <button
            onClick={() => speakText('Let us put everything together to complete the market quest at the checkout register!', sensorySettings.soundMode)}
            className="p-2 rounded-xl bg-[#202F36] hover:bg-[#283942] text-[#1CB0F6] border border-[#37464F] cursor-pointer"
            title="Read instructions"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[#A5B8C0] text-sm sm:text-base font-medium">
          Put all your shopping skills together to complete Sam and Milo&apos;s supermarket quest!
        </p>
      </div>

      {/* Hint if requested */}
      {showHint && (
        <div className="bg-[#2A2415] border-2 border-[#FFC800]/50 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-[#FFD84D] animate-fadeIn">
          <Sparkles className="w-5 h-5 text-[#FFC800] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-black text-[#FFC800]">Milo&apos;s Grand Checkout Clue:</p>
            <p className="mt-0.5 text-white/90 font-medium">
              {missionStep === 1 
                ? 'Tap every item in your basket to make sure it is checked!'
                : missionStep === 2
                ? reg.hint
                : 'Choose the polite greeting that thanks Mr. Rao!'}
            </p>
          </div>
        </div>
      )}

      {/* Progress Substeps */}
      <div className="grid grid-cols-3 gap-2 bg-[#131F24] p-2 rounded-2xl border-2 border-[#37464F] text-xs font-black">
        <div className={`p-2.5 rounded-xl text-center transition-all ${
          missionStep >= 1 ? 'bg-[#58CC02] text-white shadow-md' : 'text-[#A5B8C0] bg-[#202F36]'
        }`}>
          1. Basket Check
        </div>
        <div className={`p-2.5 rounded-xl text-center transition-all ${
          missionStep >= 2 ? 'bg-[#58CC02] text-white shadow-md' : 'text-[#A5B8C0] bg-[#202F36]'
        }`}>
          2. Pay & Change
        </div>
        <div className={`p-2.5 rounded-xl text-center transition-all ${
          missionStep >= 3 ? 'bg-[#58CC02] text-white shadow-md' : 'text-[#A5B8C0] bg-[#202F36]'
        }`}>
          3. Polite Checkout
        </div>
      </div>

      {/* Substep 1: Basket Checklist */}
      {missionStep === 1 && (
        <div className="bg-[#131F24] rounded-3xl p-5 sm:p-6 border-2 border-[#37464F] space-y-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1F3D24] text-[#58CC02] border border-[#2E6B38] flex items-center justify-center font-bold">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">Step 1: Check Items in Basket</h3>
              <p className="text-xs text-[#A5B8C0] font-medium">Tap each item to verify before heading to the cashier.</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => toggleCheck('apples')}
              className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                checkedItems.apples ? 'bg-[#183424] border-[#58CC02]' : 'bg-[#202F36] border-[#37464F] hover:border-[#58CC02]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🍎</span>
                <div>
                  <p className="font-extrabold text-white text-sm sm:text-base">Bag of Fresh Apples</p>
                  <p className="text-xs text-[#A5B8C0]">Produce aisle • ₹20</p>
                </div>
              </div>
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                checkedItems.apples ? 'bg-[#58CC02] text-white' : 'border-2 border-[#37464F]'
              }`}>
                {checkedItems.apples && <Check className="w-4 h-4" />}
              </div>
            </button>

            <button
              onClick={() => toggleCheck('bread')}
              className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                checkedItems.bread ? 'bg-[#183424] border-[#58CC02]' : 'bg-[#202F36] border-[#37464F] hover:border-[#58CC02]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🍞</span>
                <div>
                  <p className="font-extrabold text-white text-sm sm:text-base">Whole Wheat Bread</p>
                  <p className="text-xs text-[#A5B8C0]">Bakery shelf • ₹25</p>
                </div>
              </div>
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                checkedItems.bread ? 'bg-[#58CC02] text-white' : 'border-2 border-[#37464F]'
              }`}>
                {checkedItems.bread && <Check className="w-4 h-4" />}
              </div>
            </button>

            <button
              onClick={() => toggleCheck('juice')}
              className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                checkedItems.juice ? 'bg-[#183424] border-[#58CC02]' : 'bg-[#202F36] border-[#37464F] hover:border-[#58CC02]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🍊</span>
                <div>
                  <p className="font-extrabold text-white text-sm sm:text-base">Fresh Orange Juice</p>
                  <p className="text-xs text-[#A5B8C0]">Cold beverage • ₹25</p>
                </div>
              </div>
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                checkedItems.juice ? 'bg-[#58CC02] text-white' : 'border-2 border-[#37464F]'
              }`}>
                {checkedItems.juice && <Check className="w-4 h-4" />}
              </div>
            </button>
          </div>

          <button
            onClick={() => {
              playGentleSound('step', sensorySettings.soundMode);
              setMissionStep(2);
            }}
            disabled={!allItemsChecked}
            className="w-full py-4 px-6 rounded-2xl btn-duo-green disabled:opacity-30 text-white font-black text-base shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed uppercase tracking-wide"
          >
            <span>PROCEED TO CASH REGISTER</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Substep 2: Money & Change Calculation */}
      {missionStep === 2 && (
        <div className="bg-[#131F24] rounded-3xl p-5 sm:p-6 border-2 border-[#37464F] space-y-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#143343] text-[#1CB0F6] border border-[#1B5775] flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">Step 2: Pay Mr. Rao</h3>
              <p className="text-xs text-[#A5B8C0] font-medium">The grocery bill is ₹{reg.bill}. Sam pays with a ₹{reg.paid} note.</p>
            </div>
          </div>

          <div className="bg-[#202F36] rounded-2xl p-4 border border-[#37464F] flex items-center justify-around text-center">
            <div>
              <span className="text-xs text-[#A5B8C0] font-bold">Total Bill</span>
              <p className="text-2xl font-black text-white">₹{reg.bill}</p>
            </div>
            <div className="text-[#A5B8C0] font-black text-2xl">−</div>
            <div>
              <span className="text-xs text-[#A5B8C0] font-bold">Paid Note</span>
              <p className="text-2xl font-black text-[#58CC02]">₹{reg.paid}</p>
            </div>
            <div className="text-[#A5B8C0] font-black text-2xl">=</div>
            <div>
              <span className="text-xs text-[#A5B8C0] font-bold">Change Due</span>
              <p className="text-2xl font-black text-[#FFC800]">₹??</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
              How much change does Mr. Rao hand back to Sam?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {reg.options.map(val => {
                const isEliminated = eliminatedChange.includes(val);
                return (
                  <button
                    key={val}
                    onClick={() => handleSelectChange(val)}
                    disabled={isEliminated}
                    className={`py-4 rounded-2xl font-black text-2xl border-2 transition-all relative ${
                      isEliminated
                        ? 'bg-[#182024]/50 border-[#28373E] text-[#556973] opacity-40 cursor-not-allowed line-through'
                        : selectedChange === val
                        ? val === reg.change
                          ? 'bg-[#1F3D24] text-[#58CC02] border-[#58CC02] ring-2 ring-[#58CC02]/40 cursor-pointer'
                          : 'bg-[#352516] text-[#FF9600] border-[#FF9600] cursor-pointer'
                        : 'bg-[#202F36] text-white border-[#37464F] hover:border-[#58CC02] cursor-pointer'
                    }`}
                  >
                    {isEliminated && (
                      <span className="absolute top-1 right-1 text-[9px] font-black text-[#FF4B4B]">
                        Tried
                      </span>
                    )}
                    ₹{val}
                  </button>
                );
              })}
            </div>
          </div>

          {changeError && (
            <p className="text-xs font-bold text-[#FF9600] bg-[#352516] p-3 rounded-2xl border border-[#FF9600]/40">
              {reg.hint}
            </p>
          )}
        </div>
      )}

      {/* Substep 3: Polite Checkout */}
      {missionStep === 3 && (
        <div className="bg-[#131F24] rounded-3xl p-5 sm:p-6 border-2 border-[#37464F] space-y-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#352044] text-[#CE82FF] border border-[#5C3278] flex items-center justify-center font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">Step 3: Friendly Checkout Greeting</h3>
              <p className="text-xs text-[#A5B8C0] font-medium">Mr. Rao hands Sam the packed bag with ₹{reg.change} change.</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-black text-white uppercase tracking-wider">
              What does Sam say before leaving?
            </label>

            <button
              onClick={() => handleSelectPhrase(1)}
              className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                selectedPhrase === 1
                  ? 'bg-[#183424] border-[#58CC02] text-white ring-2 ring-[#58CC02]/40'
                  : 'bg-[#202F36] border-[#37464F] hover:border-[#58CC02] text-white'
              }`}
            >
              <span className="font-black text-sm sm:text-base">
                “Thank you for your help Mr. Rao, have a great day!”
              </span>
              <CheckCircle2 className="w-6 h-6 text-[#58CC02] flex-shrink-0" />
            </button>

            <button
              onClick={() => handleSelectPhrase(2)}
              disabled={eliminatedPhrase.includes(2)}
              className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-medium transition-all ${
                eliminatedPhrase.includes(2)
                  ? 'bg-[#182024]/50 border-[#28373E] text-[#556973] opacity-40 cursor-not-allowed line-through'
                  : 'border-[#37464F] hover:border-white/20 text-[#A5B8C0] bg-[#131F24] cursor-pointer'
              }`}
            >
              Grab the bag and run out silently without saying anything
            </button>
          </div>

          {phraseError && (
            <p className="text-xs font-bold text-[#FF9600] bg-[#352516] p-3 rounded-2xl border border-[#FF9600]/40">
              Saying a polite thank you helps everyone feel appreciated!
            </p>
          )}
        </div>
      )}
    </div>
  );
};
