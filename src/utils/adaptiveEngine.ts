import { 
  AdaptiveSkillKey, 
  SkillAdaptiveProfile, 
  ParentAdaptiveSettings, 
  SupportLevel, 
  SkillDifficulty, 
  SkillAttempt, 
  AdaptiveRecommendation,
  WorkedExample,
  MiniPracticeQuestion
} from '../types';

export const DEFAULT_PARENT_ADAPTIVE_SETTINGS: ParentAdaptiveSettings = {
  temporaryAnswerElimination: true,
  autoDifficultyRecommendations: true,
  instantHintsAllowed: true,
  showWorkedExamples: true,
  defaultSupportLevel: 2,
  defaultDifficulty: 'standard'
};

export const DEFAULT_SKILL_PROFILES: Record<AdaptiveSkillKey, SkillAdaptiveProfile> = {
  sequencing: {
    skillId: 'sequencing',
    skillName: 'Visual Sequencing & Routine',
    skillDifficulty: 'standard',
    supportLevel: 2,
    recentAttempts: [],
    independentSuccesses: 1,
    assistedSuccesses: 0,
    hintsRequested: 0,
    questionsCompleted: 1
  },
  math: {
    skillId: 'math',
    skillName: 'Counting & Supermarket Math',
    skillDifficulty: 'standard',
    supportLevel: 2,
    recentAttempts: [],
    independentSuccesses: 1,
    assistedSuccesses: 0,
    hintsRequested: 0,
    questionsCompleted: 1
  },
  budgeting: {
    skillId: 'budgeting',
    skillName: 'Purse Budgeting & Decisions',
    skillDifficulty: 'standard',
    supportLevel: 2,
    recentAttempts: [],
    independentSuccesses: 0,
    assistedSuccesses: 1,
    hintsRequested: 1,
    questionsCompleted: 1
  },
  emotional: {
    skillId: 'emotional',
    skillName: 'Emotional Calming & Sensory Care',
    skillDifficulty: 'standard',
    supportLevel: 2,
    recentAttempts: [],
    independentSuccesses: 1,
    assistedSuccesses: 0,
    hintsRequested: 0,
    questionsCompleted: 1
  },
  communication: {
    skillId: 'communication',
    skillName: 'Social Communication & Polite Speech',
    skillDifficulty: 'standard',
    supportLevel: 2,
    recentAttempts: [],
    independentSuccesses: 1,
    assistedSuccesses: 0,
    hintsRequested: 0,
    questionsCompleted: 1
  },
  problemSolving: {
    skillId: 'problemSolving',
    skillName: 'Safe Problem Solving & Navigation',
    skillDifficulty: 'standard',
    supportLevel: 2,
    recentAttempts: [],
    independentSuccesses: 1,
    assistedSuccesses: 0,
    hintsRequested: 0,
    questionsCompleted: 1
  },
  integrated: {
    skillId: 'integrated',
    skillName: 'Integrated Market Mission',
    skillDifficulty: 'standard',
    supportLevel: 2,
    recentAttempts: [],
    independentSuccesses: 1,
    assistedSuccesses: 0,
    hintsRequested: 0,
    questionsCompleted: 1
  },
  memory: {
    skillId: 'memory',
    skillName: 'Memory Card Matching',
    skillDifficulty: 'standard',
    supportLevel: 2,
    recentAttempts: [],
    independentSuccesses: 1,
    assistedSuccesses: 0,
    hintsRequested: 0,
    questionsCompleted: 1
  }
};

const PROFILES_STORAGE_KEY = 'learnquest_v1_adaptive_profiles';
const SETTINGS_STORAGE_KEY = 'learnquest_v1_adaptive_settings';

export function loadAdaptiveProfiles(): Record<AdaptiveSkillKey, SkillAdaptiveProfile> {
  if (typeof window === 'undefined') return DEFAULT_SKILL_PROFILES;
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) return DEFAULT_SKILL_PROFILES;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SKILL_PROFILES, ...parsed };
  } catch {
    return DEFAULT_SKILL_PROFILES;
  }
}

export function saveAdaptiveProfiles(profiles: Record<AdaptiveSkillKey, SkillAdaptiveProfile>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch {
    // quota or fail-safe
  }
}

export function loadParentAdaptiveSettings(): ParentAdaptiveSettings {
  if (typeof window === 'undefined') return DEFAULT_PARENT_ADAPTIVE_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_PARENT_ADAPTIVE_SETTINGS;
    return { ...DEFAULT_PARENT_ADAPTIVE_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PARENT_ADAPTIVE_SETTINGS;
  }
}

export function saveParentAdaptiveSettings(settings: ParentAdaptiveSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

// ==========================================
// DETERMINISTIC ADAPTATION RULES ENGINE
// ==========================================

export interface AttemptEvaluationResult {
  updatedProfile: SkillAdaptiveProfile;
  recommendation: AdaptiveRecommendation | null;
  gentleFeedback: {
    status: 'correct' | 'incorrect';
    message: string;
    showHintPrompt?: boolean;
    showWorkedExamplePrompt?: boolean;
    showMiniPracticePrompt?: boolean;
  };
}

/**
 * Deterministic attempt evaluation following Rules A through E:
 * - Rule A: First incorrect attempt gives gentle feedback, temporary option elimination, offers hint, keeps difficulty unchanged.
 * - Rule B: Repeated difficulty on same question offers visual example/hint, increases support level, keeps skill difficulty unchanged.
 * - Rule C: Continued difficulty across questions offers guided practice and recommends easier difficulty optionally (never forced).
 * - Rule D: Success after support reinforces concept, stays at same difficulty.
 * - Rule E: Consistent independent success offers optional difficulty increase.
 */
export function evaluateAttempt(
  profile: SkillAdaptiveProfile,
  questionId: string,
  isCorrect: boolean,
  currentQuestionAttempts: number, // 1 for first attempt, 2 for second, etc.
  hintsUsedOnQuestion: number,
  settings: ParentAdaptiveSettings
): AttemptEvaluationResult {
  const isAssisted = hintsUsedOnQuestion > 0 || currentQuestionAttempts > 1;
  const newAttempt: SkillAttempt = {
    id: `${questionId}_${Date.now()}`,
    timestamp: Date.now(),
    questionId,
    isCorrect,
    isAssisted,
    hintsUsed: hintsUsedOnQuestion,
    attemptsCount: currentQuestionAttempts
  };

  const recentAttempts = [...profile.recentAttempts.slice(-9), newAttempt];
  let supportLevel = profile.supportLevel;
  let independentSuccesses = profile.independentSuccesses;
  let assistedSuccesses = profile.assistedSuccesses;
  let questionsCompleted = profile.questionsCompleted;
  let recommendation: AdaptiveRecommendation | null = null;

  if (isCorrect) {
    questionsCompleted += 1;
    if (!isAssisted) {
      independentSuccesses += 1;
      // Rule E: Consistent independent success
      // Check last 2 attempts for clean independent success
      const recentIndependentWins = recentAttempts
        .filter(a => a.isCorrect && !a.isAssisted)
        .length;

      if (
        settings.autoDifficultyRecommendations &&
        profile.skillDifficulty !== 'challenge' &&
        recentIndependentWins >= 2
      ) {
        const nextDifficulty: SkillDifficulty = profile.skillDifficulty === 'easy' ? 'standard' : 'challenge';
        recommendation = {
          type: 'increase-difficulty',
          skillId: profile.skillId,
          targetDifficulty: nextDifficulty,
          title: '🌟 Level Up Opportunity!',
          message: `Milo noticed you mastered this skill independently! Ready to try ${nextDifficulty.toUpperCase()} mode?`,
          reason: `${recentIndependentWins} independent correct answers in a row.`
        };
      }
    } else {
      // Rule D: Success after receiving support
      assistedSuccesses += 1;
      // Stays at same difficulty; reinforce concept
    }

    return {
      updatedProfile: {
        ...profile,
        supportLevel,
        recentAttempts,
        independentSuccesses,
        assistedSuccesses,
        questionsCompleted
      },
      recommendation,
      gentleFeedback: {
        status: 'correct',
        message: !isAssisted
          ? "Spot on! You did that completely on your own! 🎉"
          : "Fantastic perseverance! You figured it out with Milo's helpful clues! ⭐"
      }
    };
  } else {
    // Incorrect Attempt
    // Rule A: First incorrect attempt
    if (currentQuestionAttempts === 1) {
      // Gentle feedback, eliminate option if enabled, offer hint
      // Support level remains or can bump to 2 if currently at 1
      if (supportLevel === 1) {
        supportLevel = 2; // Step to gentle support
      }

      return {
        updatedProfile: {
          ...profile,
          supportLevel,
          recentAttempts
        },
        recommendation: null,
        gentleFeedback: {
          status: 'incorrect',
          message: "Let's try another way! That option didn't quite fit, but you can pick again.",
          showHintPrompt: true
        }
      };
    } else {
      // Rule B: Repeated difficulty on same question (2+ attempts)
      if (supportLevel < 3) {
        supportLevel = 3; // Step up to guided support
      }

      // Check Rule C: Continued difficulty across recent questions
      const recentErrors = recentAttempts.filter(a => !a.isCorrect).length;
      if (
        settings.autoDifficultyRecommendations &&
        profile.skillDifficulty !== 'easy' &&
        recentErrors >= 3
      ) {
        const lowerDifficulty: SkillDifficulty = profile.skillDifficulty === 'challenge' ? 'standard' : 'easy';
        recommendation = {
          type: 'decrease-difficulty',
          skillId: profile.skillId,
          targetDifficulty: lowerDifficulty,
          title: '🌱 Gentle Practice Recommendation',
          message: `This challenge is quite tricky! Would you like to switch to ${lowerDifficulty.toUpperCase()} mode for gentler practice?`,
          reason: 'Multiple tricky attempts on this skill.'
        };
      }

      return {
        updatedProfile: {
          ...profile,
          supportLevel,
          recentAttempts
        },
        recommendation,
        gentleFeedback: {
          status: 'incorrect',
          message: "You're trying so hard! Let's take a look at a step-by-step example or a mini practice round together.",
          showHintPrompt: true,
          showWorkedExamplePrompt: true,
          showMiniPracticePrompt: true
        }
      };
    }
  }
}

// ==========================================
// WORKED EXAMPLES CATALOG
// ==========================================

export const WORKED_EXAMPLES: Record<AdaptiveSkillKey, WorkedExample> = {
  math: {
    title: 'How to Count Supermarket Prices',
    conceptSummary: 'When buying multiple items, add the cost of each item one at a time, or add the tens and ones separately.',
    steps: [
      {
        stepNumber: 1,
        title: 'Identify the Price of 1 Item',
        detail: 'Look at the price tag. For example, 1 Apple costs ₹15.',
        visualEmoji: '🍎',
        highlight: '₹15'
      },
      {
        stepNumber: 2,
        title: 'Add the Tens First',
        detail: 'For two apples: ₹10 + ₹10 = ₹20.',
        visualEmoji: '🪙',
        highlight: '₹10 + ₹10 = ₹20'
      },
      {
        stepNumber: 3,
        title: 'Add the Fives Next',
        detail: 'Now add the remaining coins: ₹5 + ₹5 = ₹10.',
        visualEmoji: '🪙',
        highlight: '₹5 + ₹5 = ₹10'
      },
      {
        stepNumber: 4,
        title: 'Combine Together',
        detail: '₹20 + ₹10 = ₹30 in total coins!',
        visualEmoji: '🎉',
        highlight: 'Total = ₹30'
      }
    ],
    takeawayRule: 'Adding tens first makes counting coins simple and fast!'
  },
  sequencing: {
    title: 'How to Order Shopping Steps',
    conceptSummary: 'Think about what you must have in your hands first before doing the next action in a store.',
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Get the Basket',
        detail: 'Always pick up a basket or shopping cart first so you have a place to put your items.',
        visualEmoji: '🧺',
        highlight: 'Basket first'
      },
      {
        stepNumber: 2,
        title: 'Step 2: Choose Groceries',
        detail: 'Walk through aisles and place the needed food into your basket.',
        visualEmoji: '🥦',
        highlight: 'Select food'
      },
      {
        stepNumber: 3,
        title: 'Step 3: Bring to Checkout Counter',
        detail: 'Carry your full basket to the cashier counter so items can be scanned.',
        visualEmoji: '🏪',
        highlight: 'Go to counter'
      },
      {
        stepNumber: 4,
        title: 'Step 4: Pay with Coins & Take Receipt',
        detail: 'Pay the exact coins or card at the register before leaving the store.',
        visualEmoji: '💳',
        highlight: 'Pay at register'
      }
    ],
    takeawayRule: 'Basket -> Choose -> Counter -> Pay!'
  },
  budgeting: {
    title: 'Managing Your ₹100 Shopping Purse',
    conceptSummary: 'Keep track of the running total so your grocery items never exceed your purse amount.',
    steps: [
      {
        stepNumber: 1,
        title: 'Know Your Budget Limit',
        detail: 'Our purse has exactly ₹100 inside. We cannot spend ₹101!',
        visualEmoji: '👛',
        highlight: 'Limit: ₹100'
      },
      {
        stepNumber: 2,
        title: 'Start with Essentials',
        detail: 'Pick healthy essentials like Fresh Milk (₹30) and Bread (₹25). Current total: ₹55.',
        visualEmoji: '🥛',
        highlight: '₹30 + ₹25 = ₹55'
      },
      {
        stepNumber: 3,
        title: 'Add a Moderate Item',
        detail: 'Bananas are ₹20. ₹55 + ₹20 = ₹75. Still well under ₹100!',
        visualEmoji: '🍌',
        highlight: '₹75 <= ₹100'
      },
      {
        stepNumber: 4,
        title: 'Check Before Checkout',
        detail: 'We have 3 healthy items and ₹25 leftover change in our purse.',
        visualEmoji: '✨',
        highlight: 'Safe budget!'
      }
    ],
    takeawayRule: 'Add each price as you go. If you go over ₹100, swap one item for a lower priced one.'
  },
  emotional: {
    title: 'Calming When Overwhelmed',
    conceptSummary: 'Stores have bright lights, beeps, and crowds. Having a calming plan keeps you safe and relaxed.',
    steps: [
      {
        stepNumber: 1,
        title: 'Notice How Your Body Feels',
        detail: 'If sounds feel too loud or your chest feels tight, notice that you need a calm moment.',
        visualEmoji: '💭',
        highlight: 'Notice signs'
      },
      {
        stepNumber: 2,
        title: 'Put on Sensory Headphones',
        detail: 'Noise-reducing headphones soften sudden announcements and scanner beeps.',
        visualEmoji: '🎧',
        highlight: 'Soften sounds'
      },
      {
        stepNumber: 3,
        title: 'Take 3 Slow Milo Breaths',
        detail: 'Breathe in like smelling a flower (4 seconds), breathe out like blowing a dandelion (4 seconds).',
        visualEmoji: '🌬️',
        highlight: 'Slow breaths'
      },
      {
        stepNumber: 4,
        title: 'Tell Your Helper',
        detail: 'Say: "I need a 2-minute quiet break please." Your grown-up will gladly help.',
        visualEmoji: '🤝',
        highlight: 'Use words or cards'
      }
    ],
    takeawayRule: 'Never run into parking areas. Stop, put on headphones, breathe, and communicate.'
  },
  communication: {
    title: 'Asking For Help Politely',
    conceptSummary: 'Store staff love to help customers! Speaking politely helps them understand your question quickly.',
    steps: [
      {
        stepNumber: 1,
        title: 'Get Attention with "Excuse Me"',
        detail: 'Wait until the clerk is looking in your direction and say "Excuse me".',
        visualEmoji: '👋',
        highlight: '"Excuse me"'
      },
      {
        stepNumber: 2,
        title: 'Use the Magic Word "Please"',
        detail: 'Say: "Could you please show me where the honey jar is?"',
        visualEmoji: '🍯',
        highlight: '"Please"'
      },
      {
        stepNumber: 3,
        title: 'Listen Carefully',
        detail: 'They will point or tell you aisle 2. You can nod and say "Thank you!"',
        visualEmoji: '👂',
        highlight: '"Thank you!"'
      }
    ],
    takeawayRule: 'Start with "Excuse me", include "please", and finish with "thank you"!'
  },
  problemSolving: {
    title: 'Safe Problem Solving on Wet Floors',
    conceptSummary: 'When you spot a caution cone or a water spill in an aisle, prioritize safety over speed.',
    steps: [
      {
        stepNumber: 1,
        title: 'Spot the Yellow Safety Cone',
        detail: 'A bright yellow cone means the floor is slippery and dangerous.',
        visualEmoji: '⚠️',
        highlight: 'Caution sign'
      },
      {
        stepNumber: 2,
        title: 'Never Jump or Run',
        detail: 'Running or jumping across a puddle can make your shoes slip instantly.',
        visualEmoji: '🛑',
        highlight: 'No jumping'
      },
      {
        stepNumber: 3,
        title: 'Walk Slowly Around the Dry Side',
        detail: 'Walk with careful, flat steps on the dry edge of the aisle.',
        visualEmoji: '🚶',
        highlight: 'Dry perimeter'
      }
    ],
    takeawayRule: 'Respect safety cones and always walk around wet areas.'
  },
  integrated: {
    title: 'Mastering the Checkout Stand',
    conceptSummary: 'At the register, verify your groceries, pay with coins, and verify your change.',
    steps: [
      {
        stepNumber: 1,
        title: 'Check Items on Your List',
        detail: 'Make sure every needed item from your list is in the basket.',
        visualEmoji: '📋',
        highlight: 'Verify items'
      },
      {
        stepNumber: 2,
        title: 'Calculate the Bill & Change',
        detail: 'If the bill is ₹70 and you give ₹100: ₹100 - ₹70 = ₹30 change.',
        visualEmoji: '💵',
        highlight: '₹100 - ₹70 = ₹30'
      },
      {
        stepNumber: 3,
        title: 'Polite Farewell',
        detail: 'Smile, say "Thank you, have a good day!", and carry your bags safely.',
        visualEmoji: '🐶',
        highlight: 'Friendly finish'
      }
    ],
    takeawayRule: 'Check list, count change, and say thank you!'
  },
  memory: {
    title: 'Memory Card Matching Strategies',
    conceptSummary: 'Remembering card positions becomes easy when you say the item name and grid position quietly to yourself.',
    steps: [
      {
        stepNumber: 1,
        title: 'Turn One Card at a Time',
        detail: 'Flip the first card and say its name aloud: "Apple at top-left!"',
        visualEmoji: '🍎',
        highlight: 'Name & location'
      },
      {
        stepNumber: 2,
        title: 'Check Previous Memories',
        detail: 'Did you see an Apple before? If yes, tap that exact spot!',
        visualEmoji: '🧠',
        highlight: 'Recall spot'
      },
      {
        stepNumber: 3,
        title: 'Learn from Every Flip',
        detail: 'Even non-matches give you secret clues for upcoming turns.',
        visualEmoji: '⭐',
        highlight: 'Every turn teaches'
      }
    ],
    takeawayRule: 'Take your time and picture the cards in a 2x2 or 3x2 grid.'
  }
};

// ==========================================
// SIMPLER MINI PRACTICE QUESTIONS
// ==========================================

export const MINI_PRACTICE_QUESTIONS: Record<AdaptiveSkillKey, MiniPracticeQuestion> = {
  math: {
    id: 'mini-math-1',
    title: 'Mini Math Practice: Gentle Coins',
    prompt: 'Milo has 1 apple for ₹10 and 1 orange for ₹10. How much do they cost in total?',
    options: [
      { id: 'opt-15', label: '₹15', isCorrect: false, explanation: '₹10 + ₹10 is more than 15.' },
      { id: 'opt-20', label: '₹20 (₹10 + ₹10)', isCorrect: true, explanation: 'Exactly! ₹10 + ₹10 = ₹20.' },
      { id: 'opt-25', label: '₹25', isCorrect: false, explanation: 'Count by tens: 10, 20!' }
    ],
    hint: 'Count two ₹10 coins: 10... 20!',
    successMessage: 'Great job! You mastered adding tens!'
  },
  sequencing: {
    id: 'mini-seq-1',
    title: 'Mini Practice: What Comes First?',
    prompt: 'Before putting food into a basket, what do you need to do first?',
    options: [
      { id: 'opt-pick-basket', label: 'Pick up an empty basket', isCorrect: true, explanation: 'Yes! You must hold a basket before putting food in it.' },
      { id: 'opt-pay-money', label: 'Pay money at the register', isCorrect: false, explanation: 'You pay after collecting food, not before!' }
    ],
    hint: 'You need something to carry the food in first!',
    successMessage: 'Spot on! Picking the basket is always first!'
  },
  budgeting: {
    id: 'mini-bud-1',
    title: 'Mini Practice: Safe Budget Check',
    prompt: 'You have ₹50. Can you buy a snack that costs ₹30?',
    options: [
      { id: 'opt-yes', label: 'Yes, ₹30 is less than ₹50', isCorrect: true, explanation: 'Correct! ₹30 is less than ₹50, so you have ₹20 left over.' },
      { id: 'opt-no', label: 'No, ₹30 is too expensive', isCorrect: false, explanation: '₹30 is smaller than ₹50, so it fits safely!' }
    ],
    hint: 'Compare 30 and 50: 30 is smaller than 50.',
    successMessage: 'Well done! You understand budget comparison!'
  },
  emotional: {
    id: 'mini-emo-1',
    title: 'Mini Practice: Sensory Comfort',
    prompt: 'When the supermarket music feels very loud, what helps Sam feel calm?',
    options: [
      { id: 'opt-hp', label: 'Put on soft headphones & take deep breaths', isCorrect: true, explanation: 'Wonderful! Headphones protect your ears and deep breaths soothe your body.' },
      { id: 'opt-scream', label: 'Scream very loudly', isCorrect: false, explanation: 'Screaming hurts your ears even more. Headphones are much gentler!' }
    ],
    hint: 'Think of the tool that covers your ears gently.',
    successMessage: 'Super calming choice!'
  },
  communication: {
    id: 'mini-com-1',
    title: 'Mini Practice: Polite Words',
    prompt: 'Which word is the kindest to use when asking for help?',
    options: [
      { id: 'opt-please', label: '"Please"', isCorrect: true, explanation: 'Yes! "Please" is the magic polite word that helpers love to hear.' },
      { id: 'opt-now', label: '"Right now!"', isCorrect: false, explanation: '"Right now" sounds bossy. "Please" is much friendlier!' }
    ],
    hint: 'It begins with P and rhymes with cheese!',
    successMessage: 'You are so courteous!'
  },
  problemSolving: {
    id: 'mini-ps-1',
    title: 'Mini Practice: Hazard Safety',
    prompt: 'If you see a spill of juice on the supermarket floor, what should you do?',
    options: [
      { id: 'opt-around', label: 'Walk safely around the wet spot', isCorrect: true, explanation: 'Right! Walking around keeps your shoes dry and prevents slips.' },
      { id: 'opt-slide', label: 'Slide through it like an ice rink', isCorrect: false, explanation: 'Sliding on wet tiles is very slippery and unsafe!' }
    ],
    hint: 'Choose the option that keeps you standing safely.',
    successMessage: 'Safe choice! You kept your feet dry and safe!'
  },
  integrated: {
    id: 'mini-int-1',
    title: 'Mini Practice: Register Total',
    prompt: 'You give ₹50 for a ₹40 purchase. How much change do you receive?',
    options: [
      { id: 'opt-10', label: '₹10 (₹50 - ₹40)', isCorrect: true, explanation: 'Correct! 50 minus 40 leaves 10.' },
      { id: 'opt-20', label: '₹20', isCorrect: false, explanation: '50 minus 40 is 10, not 20.' }
    ],
    hint: 'Count up from 40 to 50: just 10!',
    successMessage: 'Spot on arithmetic!'
  },
  memory: {
    id: 'mini-mem-1',
    title: 'Mini Practice: Card Focus',
    prompt: 'If card #1 is an Apple 🍎 and card #3 is also an Apple 🍎, which two cards should you pair?',
    options: [
      { id: 'opt-13', label: 'Cards #1 and #3', isCorrect: true, explanation: 'Yes! Both show the red apple!' },
      { id: 'opt-12', label: 'Cards #1 and #2', isCorrect: false, explanation: 'Card #2 is different.' }
    ],
    hint: 'Match the two apples together: #1 and #3!',
    successMessage: 'Match complete!'
  }
};
