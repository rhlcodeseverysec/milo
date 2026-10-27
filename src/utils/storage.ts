import { 
  SensorySettings, 
  CaregiverSettings, 
  ChildProfile, 
  ChallengeRecord, 
  SkillLevels,
  PhysicalTile,
  MiloCosmetics,
  MarketCosmeticItem
} from '../types';

export const DEFAULT_MILO_COSMETICS: MiloCosmetics = {
  hat: 'none',
  scarf: 'none',
  coatColor: 'classic',
  accessory: 'none',
  unlockedItemIds: ['coat-classic', 'hat-none', 'scarf-none', 'acc-none']
};

export const MARKET_COSMETIC_CATALOG: MarketCosmeticItem[] = [
  // --- HATS ---
  {
    id: 'hat-party-cone',
    name: 'Party Cone Hat',
    category: 'hat',
    price: 35,
    emoji: '🎉',
    description: 'A colorful striped celebratory party hat with a fluffy yellow pom-pom!',
    value: 'party-cone'
  },
  {
    id: 'hat-crown',
    name: 'Royal Golden Crown',
    category: 'hat',
    price: 75,
    emoji: '👑',
    description: 'A glittering royal golden crown with ruby and sapphire gems.',
    value: 'crown'
  },
  {
    id: 'hat-explorer',
    name: 'Safari Explorer Hat',
    category: 'hat',
    price: 45,
    emoji: '🧭',
    description: 'A sturdy wide-brim khaki adventurer hat for intrepid quests.',
    value: 'explorer'
  },
  {
    id: 'hat-chef',
    name: 'Baker Chef Toque',
    category: 'hat',
    price: 40,
    emoji: '👨‍🍳',
    description: 'A tall puffy white chef toque for supermarket grocery masters.',
    value: 'chef'
  },
  {
    id: 'hat-flower-crown',
    name: 'Daisy Flower Crown',
    category: 'hat',
    price: 50,
    emoji: '🌸',
    description: 'Hand-picked blooming spring daisies and tender green leaves.',
    value: 'flower-crown'
  },
  {
    id: 'hat-detective',
    name: 'Detective Cap',
    category: 'hat',
    price: 60,
    emoji: '🕵️',
    description: 'A classic houndstooth detective cap for solving puzzles!',
    value: 'detective'
  },

  // --- SCARVES & BANDANAS ---
  {
    id: 'scarf-hero-red',
    name: 'Hero Red Bandana',
    category: 'scarf',
    price: 30,
    emoji: '🧣',
    description: 'A bold, brave crimson neck bandana for courageous explorers.',
    value: 'hero-red'
  },
  {
    id: 'scarf-polka-dot',
    name: 'Sunny Polka Scarf',
    category: 'scarf',
    price: 40,
    emoji: '🟡',
    description: 'Bright cheerful yellow bandana decorated with sky-blue dots.',
    value: 'polka-dot'
  },
  {
    id: 'scarf-rainbow',
    name: 'Rainbow Joy Scarf',
    category: 'scarf',
    price: 65,
    emoji: '🌈',
    description: 'A cozy knitted scarf woven with every color of the rainbow!',
    value: 'rainbow'
  },
  {
    id: 'scarf-warm-teal',
    name: 'Cozy Teal Muffler',
    category: 'scarf',
    price: 35,
    emoji: '❄️',
    description: 'Calm ocean-teal winter scarf with soft fringes.',
    value: 'warm-teal'
  },
  {
    id: 'scarf-gold-bell',
    name: 'Jingle Gold Bell Collar',
    category: 'scarf',
    price: 55,
    emoji: '🔔',
    description: 'A glossy emerald ribbon with a gentle chiming golden bell.',
    value: 'gold-bell'
  },

  // --- COAT COLORS ---
  {
    id: 'coat-golden',
    name: 'Golden Honey Fur',
    category: 'coat',
    price: 60,
    emoji: '🍯',
    description: 'A warm, gleaming golden retriever coat that glows in sunlight.',
    value: 'golden',
    previewColor: '#E69A28'
  },
  {
    id: 'coat-chocolate',
    name: 'Chocolate Cocoa Fur',
    category: 'coat',
    price: 50,
    emoji: '🍫',
    description: 'A rich, cozy warm chocolate brown coat with chestnut accents.',
    value: 'chocolate',
    previewColor: '#6B4226'
  },
  {
    id: 'coat-snow',
    name: 'Snow White Fur',
    category: 'coat',
    price: 70,
    emoji: '❄️',
    description: 'A frosty, pure snow-white coat with gentle cloud-grey markings.',
    value: 'snow',
    previewColor: '#F3F4F6'
  },
  {
    id: 'coat-midnight',
    name: 'Midnight Charcoal Fur',
    category: 'coat',
    price: 80,
    emoji: '🌙',
    description: 'A sleek starry midnight charcoal coat with starry luster.',
    value: 'midnight',
    previewColor: '#334155'
  },

  // --- ACCESSORIES ---
  {
    id: 'acc-star-glasses',
    name: 'Superstar Shades',
    category: 'accessory',
    price: 55,
    emoji: '⭐',
    description: 'Dazzling star-shaped golden sunglasses for a cool learning buddy!',
    value: 'star-glasses'
  },
  {
    id: 'acc-badge',
    name: 'Junior Ranger Star',
    category: 'accessory',
    price: 45,
    emoji: '🎖️',
    description: 'An official shiny gold star badge pinned proudly on Milo.',
    value: 'badge'
  },
  {
    id: 'acc-superhero-cape',
    name: 'Fluttering Blue Cape',
    category: 'accessory',
    price: 85,
    emoji: '🦸',
    description: 'A heroic cape that swishes behind Milo as he investigates!',
    value: 'superhero-cape'
  }
];

export const DEFAULT_CHILD_PROFILE: ChildProfile = {
  name: 'Sam',
  age: 9,
  preferences: [
    'Visual instructions',
    'Short activities',
    'Low sound'
  ],
  avatar: '🧒'
};

export const DEFAULT_SENSORY_SETTINGS: SensorySettings = {
  visualMode: 'normal',
  soundMode: 'soft',
  instructionMode: 'both',
  activityDuration: 5
};

export const DEFAULT_CAREGIVER_SETTINGS: CaregiverSettings = {
  sessions: [
    { id: '1', start: '16:00', end: '16:20', label: 'Afternoon Focus' },
    { id: '2', start: '18:00', end: '18:20', label: 'Evening Journey' }
  ],
  maxSessionDuration: 20,
  parentPin: '1234'
};

export const DEFAULT_SKILL_LEVELS: SkillLevels = {
  math: 2,
  sequencing: 3,
  emotional: 2,
  communication: 2,
  problemSolving: 2
};

export const DEFAULT_CHALLENGES: ChallengeRecord[] = [
  {
    id: 1,
    title: 'Getting Ready to Shop',
    category: 'Sequencing',
    attempts: 1,
    isCorrect: true,
    completed: true,
    hintsUsed: 0,
    adaptiveTriggered: false
  },
  {
    id: 2,
    title: 'Item Pricing & Total',
    category: 'Mathematics',
    attempts: 1,
    isCorrect: true,
    completed: true,
    hintsUsed: 0,
    adaptiveTriggered: true,
    adaptiveNote: 'Milo noticed that Sam solved the grocery addition quickly, offering advanced item calculations.'
  },
  {
    id: 3,
    title: 'Market Budgeting (₹100)',
    category: 'Budgeting',
    attempts: 2,
    isCorrect: true,
    completed: true,
    hintsUsed: 1,
    adaptiveTriggered: false
  },
  {
    id: 4,
    title: 'Emotional Understanding',
    category: 'Emotional Understanding',
    attempts: 1,
    isCorrect: true,
    completed: true,
    hintsUsed: 0,
    adaptiveTriggered: false
  },
  {
    id: 5,
    title: 'Asking for Help',
    category: 'Communication',
    attempts: 1,
    isCorrect: true,
    completed: true,
    hintsUsed: 0,
    adaptiveTriggered: false
  },
  {
    id: 6,
    title: 'OutOfStock Solution',
    category: 'Problem Solving',
    attempts: 1,
    isCorrect: true,
    completed: true,
    hintsUsed: 0,
    adaptiveTriggered: false
  },
  {
    id: 7,
    title: 'Final Market Mission',
    category: 'Integrated Mission',
    attempts: 1,
    isCorrect: true,
    completed: true,
    hintsUsed: 0,
    adaptiveTriggered: true,
    adaptiveNote: 'Milo noticed that Sam is doing well with money and sequencing challenges, so the next adventure will introduce multi-store quests.'
  }
];

export const INITIAL_PHYSICAL_TILES: PhysicalTile[] = [
  { id: 't-1', label: 'BRUSH', sublabel: 'Brush teeth & face', iconName: 'Sparkles', correctPosition: 1 },
  { id: 't-2', label: 'DRESS', sublabel: 'Put on clothes', iconName: 'Shirt', correctPosition: 2 },
  { id: 't-3', label: 'BREAKFAST', sublabel: 'Eat healthy food', iconName: 'Utensils', correctPosition: 3 },
  { id: 't-4', label: 'PACK BAG', sublabel: 'Books & water bottle', iconName: 'Backpack', correctPosition: 4 },
  { id: 't-5', label: 'SCHOOL', sublabel: 'Head to school', iconName: 'GraduationCap', correctPosition: 5 },
];

const STORAGE_KEY_PREFIX = 'learnquest_v1_';

export function loadStoredData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStoredData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch {
    // LocalStorage quota or privacy mode fail-safe
  }
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(STORAGE_KEY_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
