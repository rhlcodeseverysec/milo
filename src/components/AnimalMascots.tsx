import React, { useState } from 'react';
import { Volume2, Sparkles, Heart } from 'lucide-react';
import { playGentleSound, speakText } from '../utils/audio';
import { SoundMode, MiloCosmetics } from '../types';

export type MascotMood = 'happy' | 'thinking' | 'cheering' | 'talking' | 'waving' | 'excited' | 'proud';

interface BeagleProps {
  mood?: MascotMood;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  soundMode?: SoundMode;
  cosmetics?: MiloCosmetics;
}

export const BeagleMascot: React.FC<BeagleProps> = ({
  mood = 'happy',
  size = 'md',
  className = '',
  onClick,
  interactive = false,
  cosmetics
}) => {
  const [isPetted, setIsPetted] = useState(false);

  const coatColors = (() => {
    switch (cosmetics?.coatColor) {
      case 'golden':
        return { main: '#E69A28', ear: '#A66308', inner: '#784400', saddle: '#C47D14' };
      case 'chocolate':
        return { main: '#6B4226', ear: '#4A2C18', inner: '#2E1809', saddle: '#3E2313' };
      case 'snow':
        return { main: '#F8FAFC', ear: '#CBD5E1', inner: '#94A3B8', saddle: '#E2E8F0' };
      case 'midnight':
        return { main: '#334155', ear: '#1E293B', inner: '#0F172A', saddle: '#1E293B' };
      case 'classic':
      default:
        return { main: '#D97706', ear: '#8D430A', inner: '#5D2B05', saddle: '#2E1B0E' };
    }
  })();

  const sizeMap = {
    xs: 'w-10 h-10',
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
    '2xl': 'w-56 h-56'
  };

  const handleBeagleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
    if (interactive) {
      e.stopPropagation();
      setIsPetted(true);
      playGentleSound('bark', 'normal');
      setTimeout(() => setIsPetted(false), 900);
    }
  };

  const activeMood = isPetted ? 'excited' : mood;

  return (
    <div
      onClick={handleBeagleClick}
      className={`relative inline-block select-none ${sizeMap[size]} ${
        interactive ? 'cursor-pointer transition-transform active:scale-90 hover:scale-105 group' : ''
      } ${className}`}
      title={interactive ? 'Tap Milo for a happy sound!' : 'Milo'}
    >
      {/* Floating Heart reaction on Pet */}
      {isPetted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 animate-bounce text-[#FF4B4B]">
          <Heart className="w-5 h-5 fill-current" />
          <span className="text-xs font-black bg-[#202F36] text-[#58CC02] px-1.5 py-0.5 rounded-full border border-[#37464F]">
            Woof! 🐾
          </span>
        </div>
      )}

      <svg
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl overflow-visible"
      >
        {/* Ground shadow */}
        <ellipse cx="70" cy="130" rx="42" ry="7" fill="#0A1014" opacity="0.55" />

        {/* Accessory: Fluttering Superhero Cape (Back Layer) */}
        {cosmetics?.accessory === 'superhero-cape' && (
          <>
            <path d="M 28 72 C 10 90 6 128 22 136 C 36 136 46 114 42 90 Z" fill="#2563EB" opacity="0.95" />
            <path d="M 112 72 C 130 90 134 128 118 136 C 104 136 94 114 98 90 Z" fill="#1D4ED8" opacity="0.95" />
          </>
        )}

        {/* Tail (Wagging in excited mood) */}
        {activeMood === 'excited' || activeMood === 'cheering' ? (
          <path
            d="M 104 95 C 122 80 130 65 125 58 C 120 53 112 62 100 82 Z"
            fill={coatColors.main}
            className="animate-pulse origin-bottom-left"
          />
        ) : (
          <path
            d="M 98 100 C 112 90 120 78 116 74 C 112 70 106 80 94 92 Z"
            fill={coatColors.main}
          />
        )}
        {/* Tail White Tip */}
        <path d="M 116 74 C 120 70 125 58 125 58 C 120 53 112 62 112 68 Z" fill="#FFFFFF" />

        {/* Hind Paws */}
        <ellipse cx="44" cy="122" rx="10" ry="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        <ellipse cx="96" cy="122" rx="10" ry="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />

        {/* Body - Warm Beagle Brown & White Chest */}
        <rect x="36" y="58" width="68" height="66" rx="32" fill={coatColors.main} />
        {/* Saddle Dark Patch on back */}
        <path d="M 38 68 Q 70 86 102 68 Q 106 100 90 114 Q 50 114 38 90 Z" fill={coatColors.saddle} opacity="0.85" />
        {/* White Chest & Belly */}
        <ellipse cx="70" cy="98" rx="20" ry="24" fill="#FFFFFF" />

        {/* Collar / Scarf Layer */}
        {cosmetics?.scarf === 'hero-red' ? (
          <g>
            <path d="M 44 85 Q 70 90 96 85 L 70 112 Z" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
            <polygon points="68,85 70,88 72,85" fill="#B91C1C" />
            <path d="M 62 84 Q 70 87 78 84" stroke="#FECACA" strokeWidth="1" fill="none" />
          </g>
        ) : cosmetics?.scarf === 'polka-dot' ? (
          <g>
            <path d="M 44 85 Q 70 90 96 85 L 70 112 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="62" cy="94" r="2.5" fill="#0284C7" />
            <circle cx="78" cy="94" r="2.5" fill="#0284C7" />
            <circle cx="70" cy="103" r="2.2" fill="#0284C7" />
          </g>
        ) : cosmetics?.scarf === 'rainbow' ? (
          <g>
            <path d="M 44 85 Q 70 91 96 85 L 94 92 Q 70 97 46 92 Z" fill="#EF4444" />
            <path d="M 45 87 Q 70 93 95 87 L 94 90 Q 70 96 46 90 Z" fill="#F59E0B" />
            <path d="M 46 89 Q 70 95 94 89 L 93 92 Q 70 97 47 92 Z" fill="#10B981" />
            <path d="M 47 91 Q 70 97 93 91 L 92 94 Q 70 99 48 94 Z" fill="#3B82F6" />
            <path d="M 48 93 Q 70 98 92 93 L 91 96 Q 70 100 49 96 Z" fill="#8B5CF6" />
            <path d="M 42 90 L 38 116 L 48 116 L 50 92 Z" fill="#3B82F6" />
            <line x1="38" y1="116" x2="48" y2="116" stroke="#F59E0B" strokeWidth="2.5" />
          </g>
        ) : cosmetics?.scarf === 'warm-teal' ? (
          <g>
            <path d="M 43 85 C 57 93 83 93 97 85 C 98 92 94 98 70 98 C 46 98 42 92 43 85 Z" fill="#0D9488" stroke="#115E59" strokeWidth="1.5" />
            <path d="M 46 93 L 42 115 L 52 115 L 54 94 Z" fill="#0F766E" />
            <line x1="43" y1="115" x2="43" y2="120" stroke="#CCFBF1" strokeWidth="1.5" />
            <line x1="47" y1="115" x2="47" y2="120" stroke="#CCFBF1" strokeWidth="1.5" />
            <line x1="51" y1="115" x2="51" y2="120" stroke="#CCFBF1" strokeWidth="1.5" />
          </g>
        ) : cosmetics?.scarf === 'gold-bell' ? (
          <g>
            <path d="M 44 86 C 58 92 82 92 96 86 C 97 91 94 95 70 95 C 46 95 43 91 44 86 Z" fill="#059669" />
            <circle cx="70" cy="98" r="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="70" cy="100" r="1.5" fill="#78350F" />
            <line x1="66" y1="99" x2="74" y2="99" stroke="#78350F" strokeWidth="1" />
          </g>
        ) : (
          <g>
            {/* Cute Collar with Gold Star Tag */}
            <path d="M 44 86 C 58 92 82 92 96 86 C 97 91 94 95 70 95 C 46 95 43 91 44 86 Z" fill="#1CB0F6" />
            <circle cx="70" cy="97" r="6" fill="#FFC800" stroke="#E5A500" strokeWidth="1.5" />
            <polygon points="70,93 71.5,96 75,96.5 72.5,98.5 73.2,102 70,100 66.8,102 67.5,98.5 65,96.5 68.5,96" fill="#FFFFFF" />
          </g>
        )}

        {/* Accessory: Junior Ranger Badge on chest */}
        {cosmetics?.accessory === 'badge' && (
          <polygon points="70,104 72.5,109 78,110 74,113.5 75.2,119 70,116 64.8,119 66,113.5 62,110 67.5,109" fill="#FFC800" stroke="#B45309" strokeWidth="1" />
        )}

        {/* Front Paws */}
        {activeMood === 'cheering' || activeMood === 'waving' ? (
          <>
            {/* Left paw waving up */}
            <ellipse cx="32" cy="54" rx="9" ry="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" transform="rotate(-25 32 54)" />
            {/* Right paw */}
            <ellipse cx="88" cy="116" rx="8" ry="7" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          </>
        ) : activeMood === 'thinking' ? (
          <>
            {/* Paws on chin thinking */}
            <ellipse cx="60" cy="80" rx="8" ry="9" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <ellipse cx="86" cy="116" rx="8" ry="7" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          </>
        ) : (
          <>
            <ellipse cx="54" cy="116" rx="8" ry="7" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <ellipse cx="86" cy="116" rx="8" ry="7" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          </>
        )}

        {/* Floppy Beagle Big Ears (Behind Head) */}
        {/* Left Ear */}
        <path
          d="M 40 32 C 16 32 10 65 18 84 C 24 94 36 94 38 82 C 40 70 42 46 40 32 Z"
          fill={coatColors.ear}
        />
        <path
          d="M 38 40 C 22 42 18 66 24 80 C 28 88 34 86 36 78 Z"
          fill={coatColors.inner}
          opacity="0.3"
        />

        {/* Right Ear */}
        <path
          d="M 100 32 C 124 32 130 65 122 84 C 116 94 104 94 102 82 C 100 70 98 46 100 32 Z"
          fill={coatColors.ear}
        />
        <path
          d="M 102 40 C 118 42 122 66 116 80 C 112 88 106 86 104 78 Z"
          fill={coatColors.inner}
          opacity="0.3"
        />

        {/* Beagle Head */}
        <ellipse cx="70" cy="46" rx="36" ry="32" fill={coatColors.main} />

        {/* Iconic Beagle White Blaze/Stripe down center of forehead */}
        <path d="M 66 14 Q 70 12 74 14 Q 76 34 78 44 Q 62 44 64 34 Z" fill="#FFFFFF" />

        {/* Big White Beagle Muzzle & Snout Mask */}
        <ellipse cx="70" cy="56" rx="22" ry="18" fill="#FFFFFF" />
        <ellipse cx="70" cy="62" rx="16" ry="12" fill="#FFFFFF" />

        {/* Puppy Eyes */}
        {activeMood === 'cheering' || activeMood === 'excited' ? (
          // Joyful curved happy squint eyes (Duolingo style)
          <>
            <path d="M 46 42 Q 54 34 62 42" stroke="#131F24" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 78 42 Q 86 34 94 42" stroke="#131F24" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        ) : activeMood === 'thinking' ? (
          // Curious big pupils looking upwards
          <>
            <circle cx="53" cy="38" r="9" fill="#131F24" />
            <circle cx="56" cy="35" r="3.2" fill="#FFFFFF" />
            <circle cx="52" cy="41" r="1.5" fill="#FFFFFF" />
            
            <circle cx="87" cy="38" r="9" fill="#131F24" />
            <circle cx="90" cy="35" r="3.2" fill="#FFFFFF" />
            <circle cx="86" cy="41" r="1.5" fill="#FFFFFF" />
          </>
        ) : (
          // Big Friendly Sparkly Cartoon Puppy Eyes
          <>
            <circle cx="53" cy="42" r="9.5" fill="#131F24" />
            <circle cx="56" cy="39" r="3.5" fill="#FFFFFF" />
            <circle cx="51" cy="45" r="1.8" fill="#FFFFFF" />

            <circle cx="87" cy="42" r="9.5" fill="#131F24" />
            <circle cx="90" cy="39" r="3.5" fill="#FFFFFF" />
            <circle cx="85" cy="45" r="1.8" fill="#FFFFFF" />
          </>
        )}

        {/* Accessory: Star Sunglasses */}
        {cosmetics?.accessory === 'star-glasses' && (
          <g>
            <path d="M 61 41 L 79 41" stroke="#F59E0B" strokeWidth="2.5" />
            <polygon points="53,32 55.5,38 62,39 57,43.5 58.5,50 53,46.5 47.5,50 49,43.5 44,39 50.5,38" fill="#FACC15" stroke="#B45309" strokeWidth="1.2" />
            <polygon points="87,32 89.5,38 96,39 91,43.5 92.5,50 87,46.5 81.5,50 83,43.5 78,39 84.5,38" fill="#FACC15" stroke="#B45309" strokeWidth="1.2" />
            <circle cx="53" cy="41" r="5" fill="#1E293B" opacity="0.6" />
            <circle cx="87" cy="41" r="5" fill="#1E293B" opacity="0.6" />
          </g>
        )}

        {/* Cute Soft Black Beagle Button Nose */}
        <polygon points="63,52 77,52 70,61" fill="#131F24" />
        <ellipse cx="68" cy="54" rx="3.5" ry="1.8" fill="#4B5563" />

        {/* Mouth & Tongue */}
        {activeMood === 'excited' || activeMood === 'cheering' ? (
          // Open joyful mouth with cute pink tongue
          <>
            <path d="M 62 60 Q 70 66 78 60" stroke="#131F24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 65 62 Q 70 74 75 62 Z" fill="#FF708F" stroke="#E11D48" strokeWidth="1" />
          </>
        ) : (
          // Sweet gentle puppy smile
          <path d="M 61 60 Q 70 65 79 60" stroke="#131F24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* Whiskers Dots */}
        <circle cx="58" cy="58" r="1" fill="#9CA3AF" />
        <circle cx="55" cy="61" r="1" fill="#9CA3AF" />
        <circle cx="82" cy="58" r="1" fill="#9CA3AF" />
        <circle cx="85" cy="61" r="1" fill="#9CA3AF" />

        {/* Rosy Cheerful Cheeks */}
        <ellipse cx="42" cy="50" rx="6" ry="3.5" fill="#FF8BA7" opacity="0.45" />
        <ellipse cx="98" cy="50" rx="6" ry="3.5" fill="#FF8BA7" opacity="0.45" />

        {/* Hat Layer */}
        {cosmetics?.hat === 'party-cone' ? (
          <g>
            <polygon points="70,1 48,27 92,27" fill="#EC4899" stroke="#BE185D" strokeWidth="1.5" />
            <path d="M 54 21 L 73 7" stroke="#FACC15" strokeWidth="3" />
            <path d="M 63 26 L 82 12" stroke="#38BDF8" strokeWidth="3" />
            <circle cx="70" cy="1" r="5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
          </g>
        ) : cosmetics?.hat === 'crown' ? (
          <g>
            <polygon points="48,24 48,10 58,18 70,5 82,18 92,10 92,24" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
            <rect x="47" y="22" width="46" height="4" rx="1.5" fill="#EAB308" />
            <circle cx="70" cy="13" r="2.5" fill="#EF4444" />
            <circle cx="58" cy="17" r="2" fill="#3B82F6" />
            <circle cx="82" cy="17" r="2" fill="#10B981" />
          </g>
        ) : cosmetics?.hat === 'explorer' ? (
          <g>
            <ellipse cx="70" cy="24" rx="36" ry="7" fill="#A16207" stroke="#78350F" strokeWidth="1.5" />
            <path d="M 48 23 C 48 8 92 8 92 23 Z" fill="#CA8A04" stroke="#78350F" strokeWidth="1.5" />
            <rect x="48" y="20" width="44" height="3" fill="#451A03" />
          </g>
        ) : cosmetics?.hat === 'chef' ? (
          <g>
            <ellipse cx="70" cy="18" rx="22" ry="15" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <ellipse cx="56" cy="13" rx="15" ry="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <ellipse cx="84" cy="13" rx="15" ry="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="52" y="18" width="36" height="8" rx="2" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
          </g>
        ) : cosmetics?.hat === 'flower-crown' ? (
          <g>
            <ellipse cx="70" cy="18" rx="28" ry="4" fill="none" stroke="#22C55E" strokeWidth="3" />
            <circle cx="54" cy="18" r="5" fill="#F43F5E" />
            <circle cx="54" cy="18" r="2" fill="#FACC15" />
            <circle cx="70" cy="16" r="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx="70" cy="16" r="2.5" fill="#FACC15" />
            <circle cx="86" cy="18" r="5" fill="#38BDF8" />
            <circle cx="86" cy="18" r="2" fill="#FACC15" />
          </g>
        ) : cosmetics?.hat === 'detective' ? (
          <g>
            <path d="M 45 24 C 45 9 95 9 95 24 Z" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
            <path d="M 38 24 C 38 22 54 20 70 20 C 86 20 102 22 102 24 C 102 26 86 27 70 27 C 54 27 38 26 38 24 Z" fill="#92400E" stroke="#451A03" strokeWidth="1.5" />
            <circle cx="70" cy="9" r="3" fill="#451A03" />
          </g>
        ) : null}

        {/* Mascot Sparkles when cheering */}
        {(activeMood === 'cheering' || activeMood === 'proud') && (
          <>
            <polygon points="26,16 29,22 35,25 29,28 26,34 23,28 17,25 23,22" fill="#FFC800" />
            <polygon points="114,14 116,19 121,21 116,23 114,28 112,23 107,21 112,19" fill="#58CC02" />
          </>
        )}
      </svg>
    </div>
  );
};

interface BeagleSpeechBubbleProps {
  mood?: MascotMood;
  message: string;
  subMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  soundMode?: SoundMode;
  canSpeak?: boolean;
  cosmetics?: MiloCosmetics;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export const BeagleSpeechBubble: React.FC<BeagleSpeechBubbleProps> = ({
  mood = 'talking',
  message,
  subMessage,
  size = 'md',
  className = '',
  soundMode = 'soft',
  canSpeak = true,
  cosmetics,
  actionButton
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSpeak = () => {
    setIsPlayingAudio(true);
    const mode: 'off' | 'soft' | 'normal' = (soundMode as 'off' | 'soft' | 'normal') || 'soft';
    playGentleSound('bark', mode);
    setTimeout(() => {
      speakText(`${message} ${subMessage || ''}`, mode);
      setIsPlayingAudio(false);
    }, 250);
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-3 sm:gap-4 ${className}`}>
      {/* Interactive Beagle Avatar */}
      <div className="flex-shrink-0 animate-bounce-gentle">
        <BeagleMascot mood={mood} size={size} interactive={true} soundMode={soundMode} cosmetics={cosmetics} />
      </div>

      {/* Duolingo Dark-Theme Speech Bubble */}
      <div className="relative flex-1 bg-[#202F36] border-2 border-[#37464F] rounded-3xl p-4 sm:p-5 shadow-xl w-full">
        {/* Left Arrow pointer for desktop */}
        <div className="hidden sm:block absolute -left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-[#37464F]">
          <div className="absolute -top-[7px] left-[2px] w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[9px] border-r-[#202F36]" />
        </div>

        {/* Mascot Name Badge & Read-Aloud Speaker Button */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#FFC800] bg-[#FFC800]/15 px-2 py-0.5 rounded-full border border-[#FFC800]/30 flex items-center gap-1">
              🐶 Milo
            </span>
            <span className="text-[10px] text-[#58CC02] font-extrabold">Learning Buddy</span>
          </div>

          {canSpeak && (
            <button
              onClick={handleSpeak}
              className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl transition-all ${
                isPlayingAudio
                  ? 'bg-[#1CB0F6] text-white animate-pulse'
                  : 'bg-[#2A3C44] hover:bg-[#374E59] text-[#1CB0F6] border border-[#37464F]'
              }`}
              title="Read aloud for me!"
              aria-label="Listen to Milo read this aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Listen</span>
            </button>
          )}
        </div>

        {/* Main dialogue message */}
        <p className="text-white font-extrabold text-base sm:text-lg leading-snug tracking-tight">
          &ldquo;{message}&rdquo;
        </p>

        {subMessage && (
          <p className="text-[#A5B8C0] text-xs sm:text-sm font-medium mt-1 leading-relaxed">
            {subMessage}
          </p>
        )}

        {actionButton && (
          <div className="mt-3 pt-2 border-t border-[#37464F]/80">
            <button
              onClick={actionButton.onClick}
              className="btn-duo-green px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{actionButton.label}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
