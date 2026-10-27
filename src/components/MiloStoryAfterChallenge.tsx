import React, { useState } from 'react';
import { SensorySettings, MiloCosmetics } from '../types';
import { playGentleSound, speakText } from '../utils/audio';
import { BeagleMascot } from './AnimalMascots';
import { InteractiveSun } from './interactive/InteractiveSun';
import { 
  Volume2, 
  ChevronRight, 
  Sparkles, 
  Heart, 
  Diamond, 
  ArrowRight,
  RotateCcw,
  Home
} from 'lucide-react';

interface StoryScene {
  stepBadge: string;
  title: string;
  text: string;
  mascotMood: 'happy' | 'thinking' | 'talking' | 'celebrating' | 'waving';
  emojiScene: string;
  actionPrompt?: string;
  interactiveChoices?: {
    label: string;
    reactionText: string;
    icon: string;
  }[];
}

interface StoryEpisode {
  levelNumber: number;
  title: string;
  theme: string;
  scenes: StoryScene[];
}

const STORY_EPISODES: Record<number, StoryEpisode> = {
  0: {
    levelNumber: 1,
    title: "Milo's Two Golden Bones & The Needy Friend",
    theme: "Generosity & Kindness",
    scenes: [
      {
        stepBadge: "Scene 1 of 5 • The Sunny Walk",
        title: "Milo walks down the sunlit road",
        text: "Milo is walking happily along the sidewalk on a beautiful sunny morning. His floppy ears bounce and his tail swishes with joy as he smells the fresh morning air!",
        mascotMood: 'happy',
        emojiScene: "☀️ 🌳 🐾 🐶",
        actionPrompt: "Trot down the road with Milo 🐾"
      },
      {
        stepBadge: "Scene 2 of 5 • A Delicious Discovery",
        title: "Milo spots TWO tasty bones!",
        text: "Sniff sniff! Under a green garden bench, Milo spots not one, but TWO delicious, golden crunchy bones! Milo happily picks up both bones to carry them proudly along the road.",
        mascotMood: 'talking',
        emojiScene: "🦴 🦴 ✨ 🐶",
        actionPrompt: "Carry both crunchy bones! 🦴"
      },
      {
        stepBadge: "Scene 3 of 5 • A Friend in Need",
        title: "Milo sees a needy, hungry friend",
        text: "Further along the sidewalk under an old banyan tree, Milo spots a hungry stray puppy with sad eyes and a rumbling tummy. What should Milo do?",
        mascotMood: 'thinking',
        emojiScene: "🌳 🐕 🥺 🦴",
        interactiveChoices: [
          {
            label: "Give one tasty bone to the needy dog",
            reactionText: "Milo gently nudges a golden bone toward the hungry puppy. Sharing is caring!",
            icon: "🦴"
          },
          {
            label: "Sit right beside the friend and share the feast together",
            reactionText: "Milo sits down close, wags warmly, and places the bone right between their paws!",
            icon: "💖"
          }
        ]
      },
      {
        stepBadge: "Scene 4 of 5 • Warm Heart & Big Smiles",
        title: "The puppy wags with pure gratitude!",
        text: "The needy dog's eyes light up with pure happiness! With a joyful bark and rapid helicopter tail-wags, they crunch happily together. Milo's heart feels warm, glowing, and wonderful.",
        mascotMood: 'celebrating',
        emojiScene: "🐶 💖 🐕 ✨ 🎉",
        actionPrompt: "Celebrate the new friendship! ✨"
      },
      {
        stepBadge: "Scene 5 of 5 • Journey Home",
        title: "Milo trots safely home",
        text: "Having shared his treasure and brought a big smile to a friend in need, Milo trots all the way home to Sam and family, feeling like a true kindness champion!",
        mascotMood: 'waving',
        emojiScene: "🏡 🌺 🐶 🏆",
        actionPrompt: "Arrive safely at home! 🏡"
      }
    ]
  },
  1: {
    levelNumber: 2,
    title: "Milo & The Lost Kitten at the Market",
    theme: "Compassion & Guidance",
    scenes: [
      {
        stepBadge: "Scene 1 of 4 • Market Trot",
        title: "Milo strolls past the fruit crates",
        text: "After solving the apple pricing puzzle, Milo walks past the colorful market stalls and hears a tiny, trembling 'Mew mew!'",
        mascotMood: 'thinking',
        emojiScene: "🍎 🍊 🐾 🐶",
        actionPrompt: "Follow the gentle sound 🐾"
      },
      {
        stepBadge: "Scene 2 of 4 • Spotting the Kitten",
        title: "A tiny striped kitten is lost",
        text: "A sweet little orange kitten is hiding behind an apple crate, scared of the bustling crowd. Milo lays down gently on his paws to look friendly.",
        mascotMood: 'happy',
        emojiScene: "🐱 📦 🐶 🌸",
        interactiveChoices: [
          {
            label: "Gently guide the kitten toward the sunny flowerpot",
            reactionText: "Milo takes soft, tiny steps so the kitten feels completely safe following him.",
            icon: "🐾"
          },
          {
            label: "Give a soft, comforting beagle nuzzle",
            reactionText: "Milo gently nudges the kitten with his warm nose, purrs and barks softly.",
            icon: "💖"
          }
        ]
      },
      {
        stepBadge: "Scene 3 of 4 • Safe Reunion",
        title: "Reunited with mama cat!",
        text: "The mama cat arrives and rubs her head against Milo's paws in thankful purrs. Mr. Rao tosses Milo an extra crunchy biscuit as a reward!",
        mascotMood: 'celebrating',
        emojiScene: "🐱 🐈 🐶 ✨ 🍪",
        actionPrompt: "Wag in celebration! ✨"
      },
      {
        stepBadge: "Scene 4 of 4 • Heading Home",
        title: "Milo trots home with a happy heart",
        text: "Milo heads home with his tail high in the air, happy that everyone in the market is safe and smiling.",
        mascotMood: 'waving',
        emojiScene: "🏡 🌳 🐶 🌟",
        actionPrompt: "Head to next adventure! 🏡"
      }
    ]
  },
  2: {
    levelNumber: 3,
    title: "Milo's Smart Budget Coin Pouch",
    theme: "Wise Choices & Thoughtfulness",
    scenes: [
      {
        stepBadge: "Scene 1 of 4 • Walking to the Bakery",
        title: "Milo carries his little coin pouch",
        text: "With a tiny pouch strapped to his harness, Milo walks to Mrs. Baker's pet treat window. He has just enough coins for healthy treats!",
        mascotMood: 'happy',
        emojiScene: "🥐 👛 🐾 🐶",
        actionPrompt: "Check the shop window 🥐"
      },
      {
        stepBadge: "Scene 2 of 4 • The Bakery Choice",
        title: "Choosing treats thoughtfully",
        text: "Milo sees a huge giant bone that takes all his coins, or a twin-pack of crunchy biscuits so he can share one with his sister dog later.",
        mascotMood: 'thinking',
        emojiScene: "🦴 🍪 👛 🐶",
        interactiveChoices: [
          {
            label: "Choose the twin-pack to share at home",
            reactionText: "Smart decision! Milo saves some budget and gets to share kindness with his family.",
            icon: "🍪"
          },
          {
            label: "Put remaining coins in the charity tip jar",
            reactionText: "Milo drops a shiny coin into the rescue animal bowl with a polite tail wag!",
            icon: "🪙"
          }
        ]
      },
      {
        stepBadge: "Scene 3 of 4 • Happy Baker",
        title: "Mrs. Baker gives a gold star sticker",
        text: "Mrs. Baker beams: 'What a smart shopper, Milo!' She sticks a shiny star sticker on his collar badge.",
        mascotMood: 'celebrating',
        emojiScene: "⭐ 🐶 🍪 ✨ 👏",
        actionPrompt: "Show off the star sticker! ⭐"
      },
      {
        stepBadge: "Scene 4 of 4 • Heading Home",
        title: "Trotting home with treats in tow",
        text: "Milo walks down the street feeling proud of budgeting wisely and keeping promises. Next mission awaits!",
        mascotMood: 'waving',
        emojiScene: "🏡 🐾 🐶 💖",
        actionPrompt: "Continue to next level! 🏡"
      }
    ]
  },
  3: {
    levelNumber: 4,
    title: "Milo's Calming Deep Belly Breath",
    theme: "Sensory Calm & Emotional Regulation",
    scenes: [
      {
        stepBadge: "Scene 1 of 4 • A Noisy Intersection",
        title: "Loud honks at the zebra crossing",
        text: "A big yellow delivery truck honks loudly as it turns the corner: HONK HONK! Milo's sensitive ears twitch and he feels a little flutter inside.",
        mascotMood: 'thinking',
        emojiScene: "🚚 📢 🐾 🐶 💨",
        actionPrompt: "Help Milo pause and find calm ⏸️"
      },
      {
        stepBadge: "Scene 2 of 4 • The Calming Paws Trick",
        title: "Taking three gentle belly breaths",
        text: "Milo remembers what Sam taught him: Plant all four paws steady on the ground, smell the flower gently, and blow the dandelion away.",
        mascotMood: 'happy',
        emojiScene: "🌸 🌬️ 🐶 🧘",
        interactiveChoices: [
          {
            label: "Take a deep breath with Milo (Inhale... Exhale...)",
            reactionText: "Ahhh... Milo takes a gentle deep breath. His heart feels calm, relaxed, and safe.",
            icon: "🌬️"
          },
          {
            label: "Put on Milo's cozy ear-muff band",
            reactionText: "Milo wears his soft low-stim sensory mufflers. The world sounds soft and peaceful.",
            icon: "🎧"
          }
        ]
      },
      {
        stepBadge: "Scene 3 of 4 • Steady and Confident",
        title: "Calmness restored!",
        text: "Milo's tail begins to wag smoothly again. He looks up at the blue sky and feels peaceful, brave, and centered.",
        mascotMood: 'celebrating',
        emojiScene: "🌈 🐶 💖 ✨ 🐾",
        actionPrompt: "Celebrate feeling peaceful! 🌈"
      },
      {
        stepBadge: "Scene 4 of 4 • Strolling Safely Home",
        title: "Walking with steady calm paws",
        text: "Milo strolls smoothly along the quiet sidewalk, knowing that whenever sounds get loud, deep breaths always help him feel at home.",
        mascotMood: 'waving',
        emojiScene: "🏡 🌳 🐶 🍃",
        actionPrompt: "Move to next challenge! 🏡"
      }
    ]
  },
  4: {
    levelNumber: 5,
    title: "Milo's Polite Woof with Mr. Rao",
    theme: "Social Communication & Respect",
    scenes: [
      {
        stepBadge: "Scene 1 of 4 • At the Library Door",
        title: "Miss Priya carries a tall stack of books",
        text: "Milo arrives outside the community hall. Miss Priya is carrying a tall tower of storybooks and trying to reach the door handle!",
        mascotMood: 'thinking',
        emojiScene: "📚 🚪 🐾 🐶",
        actionPrompt: "Help Miss Priya 🐾"
      },
      {
        stepBadge: "Scene 2 of 4 • A Polite Helping Paw",
        title: "How should Milo help politely?",
        text: "Milo wants to help without knocking anything over. What is the most polite, helpful choice?",
        mascotMood: 'happy',
        emojiScene: "📚 🐶 ✨ 🚪",
        interactiveChoices: [
          {
            label: "Gently hold the push-door open with his front paw",
            reactionText: "Milo leans his sturdy paw on the door so it swings open smoothly for Miss Priya!",
            icon: "🚪"
          },
          {
            label: "Give a polite, gentle greeting: 'Woof woof! May I help?'",
            reactionText: "Miss Priya hears Milo's cheerful, polite chime and smiles gratefully!",
            icon: "💬"
          }
        ]
      },
      {
        stepBadge: "Scene 3 of 4 • A Warm Thank You",
        title: "Miss Priya gives a sweet thank you",
        text: "'Thank you so much, Milo! You are the most polite assistant in the entire town!' She pats Milo's soft ears gently.",
        mascotMood: 'celebrating',
        emojiScene: "📚 🐶 💖 👏 🌟",
        actionPrompt: "Accept the gentle thank you! 💖"
      },
      {
        stepBadge: "Scene 4 of 4 • Heading Home",
        title: "Milo wags with courtesy and pride",
        text: "Good manners make everyone feel happy and respected! Milo trots toward home ready for the next fun step.",
        mascotMood: 'waving',
        emojiScene: "🏡 🌺 🐶 ✨",
        actionPrompt: "Continue the journey! 🏡"
      }
    ]
  },
  5: {
    levelNumber: 6,
    title: "Milo's Safe Puddle Stepping-Stone Bridge",
    theme: "Creative Problem Solving & Care",
    scenes: [
      {
        stepBadge: "Scene 1 of 4 • A Big Rain Puddle",
        title: "A wide puddle blocks the garden path",
        text: "Rain fell this morning and created a giant puddle across the brick path. Right in the middle on a tiny stone, a little garden snail is stuck!",
        mascotMood: 'thinking',
        emojiScene: "🌧️ 💧 🐌 🐾 🐶",
        actionPrompt: "Inspect the pathway 🔍"
      },
      {
        stepBadge: "Scene 2 of 4 • Building a Safe Solution",
        title: "Milo finds dry materials nearby",
        text: "Milo spots a wide, dry bark from a nearby tree and a row of flat stepping stones. What is the smart, safe move?",
        mascotMood: 'happy',
        emojiScene: "🪵 🪨 🐌 🐶",
        interactiveChoices: [
          {
            label: "Place the flat bark across as a sturdy little bridge",
            reactionText: "Milo carefully nudges the dry bark across the water. A perfect bridge for the snail!",
            icon: "🪵"
          },
          {
            label: "Guide Sam to step on the sturdy dry stones on the edge",
            reactionText: "Milo taps the safe dry stones with his paw, showing the way around the puddle!",
            icon: "🪨"
          }
        ]
      },
      {
        stepBadge: "Scene 3 of 4 • The Snail Reaches Safety",
        title: "Safe and dry on the green grass",
        text: "The snail glides safely onto the soft green grass! Milo gives a happy bark and shakes his tail without splashing a single drop.",
        mascotMood: 'celebrating',
        emojiScene: "🐌 🌿 🐶 ✨ 🏆",
        actionPrompt: "Cheer for the smart solution! ✨"
      },
      {
        stepBadge: "Scene 4 of 4 • Heading Home",
        title: "Milo trots home safely",
        text: "Problem solving makes us feel like real superheroes. Milo heads home to prepare for the final grand milestone!",
        mascotMood: 'waving',
        emojiScene: "🏡 🌈 🐶 🐾",
        actionPrompt: "Launch the Final Quest! 🏡"
      }
    ]
  },
  6: {
    levelNumber: 7,
    title: "Milo's Grand Return & Hero's Welcome",
    theme: "Grand Mission Accomplished!",
    scenes: [
      {
        stepBadge: "Scene 1 of 4 • Reaching the Front Porch",
        title: "Milo and Sam arrive home with the full shopping bag",
        text: "With all tasks completed, Milo trots up the front garden steps carrying the market receipt and golden stickers proudly!",
        mascotMood: 'happy',
        emojiScene: "🏡 🛍️ 🐾 🐶 ☀️",
        actionPrompt: "Ring the front doorbell! 🔔"
      },
      {
        stepBadge: "Scene 2 of 4 • Welcomed by Family",
        title: "The front door swings open!",
        text: "Mom and Dad open the door and cheer with joy: 'Welcome home, super explorers! You completed every single task!' How should Milo celebrate?",
        mascotMood: 'celebrating',
        emojiScene: "👨‍👩‍👧 🐶 💖 🎉",
        interactiveChoices: [
          {
            label: "Do the happy beagle helicopter tail spin dance!",
            reactionText: "Milo spins in a joyful circle, ears flying, bringing laughter to everyone in the room!",
            icon: "🌀"
          },
          {
            label: "Present the shopping basket proudly to Mom and Dad",
            reactionText: "Milo gently sets the basket down and receives a warm, cozy bear hug!",
            icon: "🧺"
          }
        ]
      },
      {
        stepBadge: "Scene 3 of 4 • The Golden Explorer Medal",
        title: "A shiny medal for Milo and Sam!",
        text: "Sam clips a gleaming golden star medal onto Milo's collar. Milo sniffs it with pride, his eyes shining bright.",
        mascotMood: 'celebrating',
        emojiScene: "🥇 🐶 ✨ 💖 🏆",
        actionPrompt: "Wear the medal with pride! 🥇"
      },
      {
        stepBadge: "Scene 4 of 4 • Cozy Rest at Home",
        title: "Curled up on the soft blue rug",
        text: "Milo curls up with a cool bowl of water and his soft favorite blanket. You did it! Every challenge mastered with kindness, courage, and smart choices.",
        mascotMood: 'happy',
        emojiScene: "🛋️ 🐶 🥣 💤 💖",
        actionPrompt: "Complete Quest & Rest! 🌟"
      }
    ]
  }
};

interface Props {
  challengeIndex: number; // 0 to 6
  lessonTitle: string;
  sensorySettings: SensorySettings;
  onContinue: () => void;
  onAwardBonusGems?: (amount: number) => void;
  miloCosmetics?: MiloCosmetics;
}

export const MiloStoryAfterChallenge: React.FC<Props> = ({
  challengeIndex,
  lessonTitle,
  sensorySettings,
  onContinue,
  onAwardBonusGems,
  miloCosmetics
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const [choiceReaction, setChoiceReaction] = useState<string | null>(null);
  const [gemsAwarded, setGemsAwarded] = useState(false);

  const episode = STORY_EPISODES[challengeIndex] || STORY_EPISODES[0];
  const scene = episode.scenes[currentSceneIndex] || episode.scenes[0];
  const isLastScene = currentSceneIndex === episode.scenes.length - 1;

  const handleNextScene = () => {
    playGentleSound('click', sensorySettings.soundMode);
    setSelectedChoiceIndex(null);
    setChoiceReaction(null);

    if (!isLastScene) {
      setCurrentSceneIndex(prev => prev + 1);
    } else {
      // Award completion bonus gems once
      if (!gemsAwarded && onAwardBonusGems) {
        onAwardBonusGems(25);
        setGemsAwarded(true);
        playGentleSound('gem', sensorySettings.soundMode);
      }
      onContinue();
    }
  };

  const handleChoice = (index: number) => {
    playGentleSound('sparkle', sensorySettings.soundMode);
    setSelectedChoiceIndex(index);
    const chosen = scene.interactiveChoices?.[index];
    if (chosen) {
      setChoiceReaction(chosen.reactionText);
      speakText(chosen.reactionText, sensorySettings.soundMode);
    }
  };

  const handleReadAloud = () => {
    const fullTextToRead = `${scene.title}. ${scene.text} ${choiceReaction || ''}`;
    speakText(fullTextToRead, sensorySettings.soundMode);
  };

  return (
    <div 
      id="milo-interactive-story-container"
      className="max-w-2xl mx-auto my-4 bg-[#18262C] border-2 border-[#28373E] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 animate-fadeIn"
    >
      {/* Story Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-[#28373E]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1F3D24] border-2 border-[#2E6B38] flex items-center justify-center text-2xl shadow-inner">
            🐶
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-wider bg-[#58CC02]/20 text-[#58CC02] px-2.5 py-0.5 rounded-full border border-[#58CC02]/40">
                Interactive Milo Story
              </span>
              <span className="text-xs font-bold text-[#A5B8C0]">
                Level {challengeIndex + 1} Reward
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white font-display mt-0.5">
              {episode.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Interactive Sun in Story Sky */}
          <InteractiveSun
            soundMode={sensorySettings.soundMode}
            reducedMotion={sensorySettings.visualMode === 'minimal'}
            className="w-10 h-10 sm:w-12 sm:h-12"
          />

          {/* Read Aloud Accessible Audio Button */}
          <button
            id="milo-story-read-aloud-btn"
            onClick={handleReadAloud}
            className="p-2.5 rounded-2xl bg-[#202F36] hover:bg-[#283942] border border-[#37464F] text-[#1CB0F6] hover:text-white flex items-center gap-1.5 text-xs font-black transition-all cursor-pointer shadow-sm"
            title="Listen to story narrated aloud"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Read Aloud</span>
          </button>
        </div>
      </div>

      {/* Story Progress Indicator */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs text-[#A5B8C0] font-black">
          <span>{scene.stepBadge}</span>
          <span className="text-[#FFC800] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 fill-[#FFC800]" />
            +{25} Kindness Gems
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#131F24] rounded-full overflow-hidden border border-[#28373E]">
          <div 
            className="h-full bg-gradient-to-r from-[#58CC02] to-[#1CB0F6] rounded-full transition-all duration-300"
            style={{ width: `${((currentSceneIndex + 1) / episode.scenes.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Narrative Scene Visual Card */}
      <div className="bg-[#131F24] rounded-3xl p-6 border-2 border-[#28373E] text-center space-y-4 shadow-inner relative overflow-hidden">
        {/* Animated scene emoji visual */}
        <div className="text-4xl sm:text-5xl py-2 tracking-wider select-none animate-pulse">
          {scene.emojiScene}
        </div>

        {/* Milo Beagle Mascot wearing Market Gear */}
        <div className="flex justify-center py-1">
          <BeagleMascot
            mood={scene.mascotMood === 'celebrating' ? 'excited' : scene.mascotMood}
            size="md"
            interactive={true}
            soundMode={sensorySettings.soundMode}
            cosmetics={miloCosmetics}
          />
        </div>

        {/* Scene Heading */}
        <h3 className="text-xl sm:text-2xl font-black text-white font-display">
          {scene.title}
        </h3>

        {/* Story Text */}
        <p className="text-sm sm:text-base text-[#D0DFE5] leading-relaxed max-w-lg mx-auto font-medium">
          {scene.text}
        </p>

        {/* Interactive Choices (if present on this scene) */}
        {scene.interactiveChoices && scene.interactiveChoices.length > 0 && (
          <div className="pt-2 space-y-3">
            <p className="text-xs font-black uppercase tracking-wider text-[#FFC800]">
              What should Milo do? Tap a choice below:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {scene.interactiveChoices.map((choice, idx) => (
                <button
                  key={idx}
                  id={`milo-story-choice-${idx}`}
                  onClick={() => handleChoice(idx)}
                  className={`p-4 rounded-2xl border-2 font-black text-sm flex items-start gap-3 transition-all cursor-pointer ${
                    selectedChoiceIndex === idx
                      ? 'bg-[#1F3D24] border-[#58CC02] text-white shadow-lg scale-[1.02]'
                      : 'bg-[#202F36] hover:bg-[#283942] border-[#37464F] hover:border-[#1CB0F6] text-[#E5E5E5]'
                  }`}
                >
                  <span className="text-2xl">{choice.icon}</span>
                  <div>
                    <span className="block leading-snug">{choice.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Reaction Feedback */}
            {choiceReaction && (
              <div className="p-3.5 rounded-2xl bg-[#1F3D24] border-2 border-[#2E6B38] text-xs sm:text-sm text-[#58CC02] font-black flex items-center justify-center gap-2 animate-fadeIn">
                <Heart className="w-4 h-4 fill-[#58CC02] flex-shrink-0" />
                <span>{choiceReaction}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={() => {
            playGentleSound('click', sensorySettings.soundMode);
            if (currentSceneIndex > 0) {
              setCurrentSceneIndex(prev => prev - 1);
              setSelectedChoiceIndex(null);
              setChoiceReaction(null);
            }
          }}
          disabled={currentSceneIndex === 0}
          className={`px-4 py-2.5 rounded-2xl border text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            currentSceneIndex === 0
              ? 'opacity-40 border-[#28373E] text-[#60727B] cursor-not-allowed'
              : 'bg-[#202F36] hover:bg-[#283942] border-[#37464F] text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Previous Scene</span>
        </button>

        <button
          id="milo-story-continue-btn"
          onClick={handleNextScene}
          className="px-6 py-3.5 rounded-2xl btn-duo-green text-white font-black text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-xl hover:scale-105 active:scale-95 transition-all ml-auto"
        >
          <span>
            {isLastScene
              ? (challengeIndex === 6 ? 'Complete Grand Mission 🏆' : 'Continue to Next Level →')
              : (scene.actionPrompt || 'Next Scene →')}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
