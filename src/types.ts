export type UserView = 
  | 'home'
  | 'map'
  | 'child-welcome'
  | 'story-challenge'
  | 'sidequest-break'
  | 'memory-game'
  | 'mission-complete'
  | 'caregiver'
  | 'physical'
  | 'sensory-settings'
  | 'market';

export interface MiloCosmetics {
  hat: string; // 'none' | 'party-cone' | 'crown' | 'explorer' | 'chef' | 'flower-crown' | 'detective'
  scarf: string; // 'none' | 'hero-red' | 'polka-dot' | 'rainbow' | 'warm-teal' | 'gold-bell'
  coatColor: string; // 'classic' | 'golden' | 'chocolate' | 'snow' | 'midnight'
  accessory: string; // 'none' | 'star-glasses' | 'badge' | 'superhero-cape'
  unlockedItemIds: string[];
}

export type CosmeticCategory = 'hat' | 'scarf' | 'coat' | 'accessory';

export interface MarketCosmeticItem {
  id: string;
  name: string;
  category: CosmeticCategory;
  price: number;
  emoji: string;
  description: string;
  value: string; // the cosmetic value identifier (e.g. 'crown', 'golden', etc.)
  previewColor?: string;
}

export type VisualMode = 'minimal' | 'normal';
export type SoundMode = 'off' | 'soft' | 'normal';
export type InstructionMode = 'text' | 'pictures' | 'both';

export interface SensorySettings {
  visualMode: VisualMode;
  soundMode: SoundMode;
  instructionMode: InstructionMode;
  activityDuration: number; // minutes
}

export interface LearningSession {
  id: string;
  start: string;
  end: string;
  label: string;
}

export interface CaregiverSettings {
  sessions: LearningSession[];
  maxSessionDuration: number; // minutes
  parentPin?: string;
}

export interface ChildProfile {
  name: string;
  age: number;
  preferences: string[];
  avatar: string;
  gems?: number;
  hearts?: number;
}

export type ChallengeId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ChallengeInfo {
  id: ChallengeId;
  title: string;
  category: string;
  description?: string;
  storyContext?: string;
  storyImage?: string;
  iconName?: string;
  hint?: string;
}

export interface ChallengeRecord {
  id: ChallengeId;
  title: string;
  category: 'Sequencing' | 'Mathematics' | 'Budgeting' | 'Emotional Understanding' | 'Communication' | 'Problem Solving' | 'Integrated Mission';
  attempts: number;
  isCorrect: boolean;
  completed: boolean;
  hintsUsed: number;
  adaptiveTriggered: boolean;
  adaptiveNote?: string;
}

export interface SkillLevels {
  math: number;
  sequencing: number;
  emotional: number;
  communication: number;
  problemSolving: number;
}

export interface PhysicalTile {
  id: string;
  label: string;
  sublabel: string;
  iconName: string;
  correctPosition: number;
}

export interface MarketItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  category: string;
  description: string;
}

export type LessonId = 1 | 2 | 3;

export interface LessonInfo {
  id: LessonId;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  icon: string;
  color: string;
  badge: string;
  totalChallenges: number;
  breakTitle: string;
  breakPrompt: string;
  breakAction: string;
  breakIcon: string;
  breakAudioText: string;
  memoryPairs: { id: string; name: string; icon: string; funFact: string }[];
}

export interface LessonProgress {
  lessonId: LessonId;
  challengesCompleted: number;
  isCompleted: boolean;
  breakCompleted: boolean;
  memoryGameCompleted: boolean;
  starsEarned: number;
}

// ==========================================
// TWO-DIMENSIONAL ADAPTIVE LEARNING TYPES
// ==========================================

export type SupportLevel = 1 | 2 | 3;
// 1 = Independent (Standard choices, self-paced, no forced hints)
// 2 = Gentle Support (Friendly retry message, temporary option elimination, optional hints & clues)
// 3 = Guided Support (Simpler explanation, reduced options, worked demonstration, simpler practice round)

export type SkillDifficulty = 'easy' | 'standard' | 'challenge';
// Changes the actual content of the task (e.g. quantity, steps, budget complexity), NOT sensory load or time limits

export type AdaptiveSkillKey = 
  | 'sequencing'
  | 'math'
  | 'budgeting'
  | 'emotional'
  | 'communication'
  | 'problemSolving'
  | 'integrated'
  | 'memory';

export interface SkillAttempt {
  id: string;
  timestamp: number;
  questionId: string;
  isCorrect: boolean;
  isAssisted: boolean; // true if hints used or multiple attempts
  hintsUsed: number;
  attemptsCount: number;
}

export interface SkillAdaptiveProfile {
  skillId: AdaptiveSkillKey;
  skillName: string;
  skillDifficulty: SkillDifficulty;
  supportLevel: SupportLevel;
  recentAttempts: SkillAttempt[];
  independentSuccesses: number;
  assistedSuccesses: number;
  hintsRequested: number;
  questionsCompleted: number;
}

export interface ParentAdaptiveSettings {
  temporaryAnswerElimination: boolean; // default true
  autoDifficultyRecommendations: boolean; // default true
  instantHintsAllowed: boolean; // default true
  showWorkedExamples: boolean; // default true
  defaultSupportLevel: SupportLevel; // default 2
  defaultDifficulty: SkillDifficulty; // default 'standard'
}

export interface QuestionAdaptiveState {
  currentQuestionId: string;
  eliminatedOptions: string[];
  currentAttemptCount: number;
  currentHintState: boolean;
  isShowingWorkedExample: boolean;
  isInMiniPractice: boolean;
}

export interface AdaptiveRecommendation {
  type: 'increase-difficulty' | 'decrease-difficulty' | 'increase-support' | 'take-break';
  skillId: AdaptiveSkillKey;
  targetDifficulty?: SkillDifficulty;
  targetSupport?: SupportLevel;
  title: string;
  message: string;
  reason: string;
}

export interface WorkedExampleStep {
  stepNumber: number;
  title: string;
  detail: string;
  visualEmoji?: string;
  highlight?: string;
}

export interface WorkedExample {
  title: string;
  conceptSummary: string;
  steps: WorkedExampleStep[];
  takeawayRule: string;
}

export interface MiniPracticeQuestion {
  id: string;
  title: string;
  prompt: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  hint: string;
  successMessage: string;
}

