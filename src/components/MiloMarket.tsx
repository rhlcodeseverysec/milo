import React, { useState } from 'react';
import { 
  MiloCosmetics, 
  MarketCosmeticItem, 
  CosmeticCategory, 
  SensorySettings, 
  UserView 
} from '../types';
import { MARKET_COSMETIC_CATALOG } from '../utils/storage';
import { BeagleMascot } from './AnimalMascots';
import { AnimalCompanion } from './interactive/InteractiveAnimalCast';
import { InteractiveSun } from './interactive/InteractiveSun';
import { InteractiveCloud } from './interactive/InteractiveCloud';
import { 
  Diamond, 
  Sparkles, 
  Check, 
  ShoppingBag, 
  ArrowLeft, 
  RotateCcw,
  Palette,
  ShieldCheck,
  Award
} from 'lucide-react';
import { playGentleSound, speakText } from '../utils/audio';

interface MiloMarketProps {
  gemsCount: number;
  setGemsCount: React.Dispatch<React.SetStateAction<number>>;
  miloCosmetics: MiloCosmetics;
  setMiloCosmetics: React.Dispatch<React.SetStateAction<MiloCosmetics>>;
  sensorySettings: SensorySettings;
  setCurrentView: (view: UserView) => void;
}

export const MiloMarket: React.FC<MiloMarketProps> = ({
  gemsCount,
  setGemsCount,
  miloCosmetics,
  setMiloCosmetics,
  sensorySettings,
  setCurrentView
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CosmeticCategory | 'all'>('all');
  const [miloMood, setMiloMood] = useState<'happy' | 'excited' | 'cheering' | 'proud'>('happy');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const reducedMotion = sensorySettings.visualMode === 'minimal';

  const categories: { id: CosmeticCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Items', icon: '✨' },
    { id: 'hat', label: 'Hats', icon: '🎩' },
    { id: 'scarf', label: 'Scarves', icon: '🧣' },
    { id: 'coat', label: 'Fur Coats', icon: '🐕' },
    { id: 'accessory', label: 'Accessories', icon: '⭐' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? MARKET_COSMETIC_CATALOG 
    : MARKET_COSMETIC_CATALOG.filter(item => item.category === selectedCategory);

  const isItemUnlocked = (item: MarketCosmeticItem) => {
    return miloCosmetics.unlockedItemIds.includes(item.id);
  };

  const isItemEquipped = (item: MarketCosmeticItem) => {
    switch (item.category) {
      case 'hat':
        return miloCosmetics.hat === item.value;
      case 'scarf':
        return miloCosmetics.scarf === item.value;
      case 'coat':
        return miloCosmetics.coatColor === item.value;
      case 'accessory':
        return miloCosmetics.accessory === item.value;
      default:
        return false;
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleBuyItem = (item: MarketCosmeticItem) => {
    if (gemsCount < item.price) {
      playGentleSound('click', sensorySettings.soundMode);
      showFeedback(`You need ${item.price - gemsCount} more gems! Keep questing to earn them! 💎`);
      return;
    }

    // Deduct gems
    setGemsCount(prev => prev - item.price);
    playGentleSound('sparkle', sensorySettings.soundMode);
    setMiloMood('excited');

    // Equip item immediately upon purchase
    setMiloCosmetics(prev => {
      const nextUnlocked = [...prev.unlockedItemIds, item.id];
      const updated: MiloCosmetics = { ...prev, unlockedItemIds: nextUnlocked };
      if (item.category === 'hat') updated.hat = item.value;
      if (item.category === 'scarf') updated.scarf = item.value;
      if (item.category === 'coat') updated.coatColor = item.value;
      if (item.category === 'accessory') updated.accessory = item.value;
      return updated;
    });

    showFeedback(`Woohoo! You unlocked the ${item.name}! Milo looks wonderful! 🎉`);
    setTimeout(() => setMiloMood('happy'), 2000);
  };

  const handleToggleEquip = (item: MarketCosmeticItem) => {
    playGentleSound('click', sensorySettings.soundMode);
    setMiloMood('cheering');

    setMiloCosmetics(prev => {
      const updated: MiloCosmetics = { ...prev };
      const currentlyEquipped = isItemEquipped(item);

      if (item.category === 'hat') {
        updated.hat = currentlyEquipped ? 'none' : item.value;
      } else if (item.category === 'scarf') {
        updated.scarf = currentlyEquipped ? 'none' : item.value;
      } else if (item.category === 'coat') {
        updated.coatColor = currentlyEquipped ? 'classic' : item.value;
      } else if (item.category === 'accessory') {
        updated.accessory = currentlyEquipped ? 'none' : item.value;
      }

      return updated;
    });

    setTimeout(() => setMiloMood('happy'), 1500);
  };

  const handleResetOutfit = () => {
    playGentleSound('click', sensorySettings.soundMode);
    setMiloCosmetics(prev => ({
      ...prev,
      hat: 'none',
      scarf: 'none',
      coatColor: 'classic',
      accessory: 'none'
    }));
    showFeedback("Milo is back in his classic explorer look! 🐶");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Header with Interactive Sky Elements */}
      <div className="relative bg-gradient-to-b from-[#18262C] to-[#131F24] border-2 border-[#28373E] rounded-3xl p-5 sm:p-7 shadow-xl overflow-hidden">
        {/* Sky Companions: Interactive Sun & Drifting Cloud */}
        <div className="absolute top-3 right-4 sm:right-8 flex items-center gap-3 sm:gap-6 z-10 pointer-events-auto">
          <InteractiveCloud
            soundMode={sensorySettings.soundMode}
            reducedMotion={reducedMotion}
            name="Market Cloud"
          />
          <InteractiveSun
            soundMode={sensorySettings.soundMode}
            reducedMotion={reducedMotion}
            className="sm:w-20 sm:h-20"
          />
        </div>

        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC800]/20 border border-[#FFC800]/40 text-[#FFC800] text-xs font-black uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Milo&apos;s Market & Dressing Room</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            Dress Up Your Loyal Companion Milo
          </h1>

          <p className="text-sm sm:text-base text-[#A5B8C0] font-bold leading-relaxed">
            Spend your hard-earned gems on hats, bandanas, warm coats, and fun accessories. Everything you choose stays on Milo everywhere you learn!
          </p>
        </div>

        {/* Currency & Action Toolbar */}
        <div className="relative z-10 mt-5 pt-4 border-t border-[#28373E] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 bg-[#131F24] border-2 border-[#1CB0F6]/40 px-4 py-2 rounded-2xl shadow-inner">
            <Diamond className="w-5 h-5 fill-[#1CB0F6] text-[#1CB0F6] animate-pulse" />
            <div>
              <span className="text-[11px] text-[#A5B8C0] font-bold uppercase block leading-none">Your Gems</span>
              <span className="text-xl font-black text-white leading-none">{gemsCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetOutfit}
              className="px-3.5 py-2 rounded-2xl bg-[#202F36] hover:bg-[#283942] border border-[#37464F] text-[#A5B8C0] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Reset Milo to classic look"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Outfit</span>
            </button>

            <button
              onClick={() => setCurrentView('map')}
              className="px-4 py-2 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] border-b-4 border-[#3B8002] text-white text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Feedback Banner */}
      {feedbackMessage && (
        <div className="bg-[#1F3A24] border-2 border-[#2D6A35] text-[#58CC02] px-4 py-3 rounded-2xl font-black text-sm flex items-center gap-2 animate-fade-in shadow-lg">
          <Sparkles className="w-4 h-4 flex-shrink-0 animate-spin" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Main Grid: Dressing Mirror & Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Dressing Mirror Stage (4 cols) */}
        <div className="lg:col-span-5 bg-[#18262C] border-2 border-[#28373E] rounded-3xl p-6 text-center space-y-4 shadow-xl sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-[#28373E]">
            <span className="text-xs font-black text-[#58CC02] uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4" />
              <span>Dressing Mirror</span>
            </span>
            <span className="text-xs text-[#A5B8C0] font-bold">
              Tap Milo to hear a bark!
            </span>
          </div>

          {/* Large Mirror Display */}
          <div className="relative py-4 px-2 bg-gradient-to-b from-[#202F36] to-[#131F24] rounded-2xl border-2 border-[#37464F] flex flex-col items-center justify-center min-h-[260px] overflow-visible">
            {/* Soft Ambient Mirror Glow */}
            <div className="absolute inset-0 bg-[#58CC02]/5 rounded-2xl pointer-events-none" />

            {/* Beagle Mascot wearing current cosmetics */}
            <div className="transform transition-transform hover:scale-105">
              <BeagleMascot
                mood={miloMood}
                size="xl"
                interactive={true}
                soundMode={sensorySettings.soundMode}
                cosmetics={miloCosmetics}
                className="scale-110 sm:scale-125"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-[#37464F]/60 w-full flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-black text-[#A5B8C0]">
              <span className="bg-[#18262C] px-2.5 py-1 rounded-xl border border-[#37464F]">
                🎩 {miloCosmetics.hat === 'none' ? 'No Hat' : miloCosmetics.hat}
              </span>
              <span className="bg-[#18262C] px-2.5 py-1 rounded-xl border border-[#37464F]">
                🧣 {miloCosmetics.scarf === 'none' ? 'Default Collar' : miloCosmetics.scarf}
              </span>
              <span className="bg-[#18262C] px-2.5 py-1 rounded-xl border border-[#37464F]">
                🐕 {miloCosmetics.coatColor} fur
              </span>
              {miloCosmetics.accessory !== 'none' && (
                <span className="bg-[#18262C] px-2.5 py-1 rounded-xl border border-[#37464F] text-[#FFC800]">
                  ⭐ {miloCosmetics.accessory}
                </span>
              )}
            </div>
          </div>

          {/* Friendly Shop Companion: Pip Bunny */}
          <div className="bg-[#202F36] border border-[#37464F] rounded-2xl p-3 flex items-center gap-3 text-left">
            <AnimalCompanion
              type="bunny"
              soundMode={sensorySettings.soundMode}
              reducedMotion={reducedMotion}
              bubblePosition="top"
              className="flex-shrink-0"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-black text-[#F472B6] flex items-center gap-1">
                <span>Pip Bunny</span>
                <span className="text-[10px] text-[#A5B8C0] font-normal">• Market Clerk</span>
              </span>
              <p className="text-xs text-[#E2E8F0] font-bold leading-tight">
                &ldquo;Tap me anytime for a hint or a high-five! You earned those gems by being brave!&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Cosmetic Items Catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-1 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  playGentleSound('click', sensorySettings.soundMode);
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#1CB0F6] text-white shadow-md border-b-4 border-[#1899D6]'
                    : 'bg-[#18262C] hover:bg-[#202F36] text-[#A5B8C0] hover:text-white border-2 border-[#28373E]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredItems.map(item => {
              const unlocked = isItemUnlocked(item);
              const equipped = isItemEquipped(item);
              const canAfford = gemsCount >= item.price;

              return (
                <div
                  key={item.id}
                  className={`relative bg-[#18262C] rounded-3xl p-4 border-2 transition-all flex flex-col justify-between ${
                    equipped
                      ? 'border-[#58CC02] bg-[#1B3020]/40 shadow-lg'
                      : unlocked
                      ? 'border-[#37464F] hover:border-[#1CB0F6]'
                      : canAfford
                      ? 'border-[#28373E] hover:border-[#FFC800]'
                      : 'border-[#202F36] opacity-80'
                  }`}
                >
                  {/* Top Badge: Equipped / Owned */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-3xl p-2 rounded-2xl bg-[#202F36] border border-[#37464F] flex items-center justify-center">
                      {item.emoji}
                    </span>

                    {equipped ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#58CC02] text-white shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                        <span>Equipped</span>
                      </span>
                    ) : unlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#202F36] text-[#A5B8C0] border border-[#37464F]">
                        <ShieldCheck className="w-3 h-3 text-[#1CB0F6]" />
                        <span>Owned</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 text-xs font-black text-[#1CB0F6] bg-[#131F24] px-2.5 py-1 rounded-full border border-[#28373E]">
                        <Diamond className="w-3.5 h-3.5 fill-[#1CB0F6]" />
                        <span>{item.price}</span>
                      </div>
                    )}
                  </div>

                  {/* Item Description */}
                  <div className="space-y-1 mb-3">
                    <h2 className="text-sm sm:text-base font-black text-white leading-snug">
                      {item.name}
                    </h2>
                    <p className="text-xs text-[#A5B8C0] font-medium leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions: Equip / Unequip / Buy */}
                  <div className="pt-2 border-t border-[#28373E]">
                    {unlocked ? (
                      <button
                        onClick={() => handleToggleEquip(item)}
                        className={`w-full py-2 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                          equipped
                            ? 'bg-[#202F36] hover:bg-[#2A3C44] text-[#E2E8F0] border-2 border-[#37464F]'
                            : 'btn-duo-green shadow-md'
                        }`}
                      >
                        {equipped ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Unequip</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Equip</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyItem(item)}
                        disabled={!canAfford}
                        className={`w-full py-2 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                          canAfford
                            ? 'bg-[#FFC800] hover:bg-[#E5A500] text-[#131F24] border-b-4 border-[#CA8A04] shadow-md active:scale-95'
                            : 'bg-[#202F36] text-[#64748B] border border-[#28373E] cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Get for {item.price} Gems</span>
                          </>
                        ) : (
                          <span>Need {item.price - gemsCount} more 💎</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
