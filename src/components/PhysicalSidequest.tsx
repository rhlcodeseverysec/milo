import React, { useState } from 'react';
import { PhysicalTile, SensorySettings, UserView } from '../types';
import { INITIAL_PHYSICAL_TILES } from '../utils/storage';
import { 
  Layers, 
  Camera, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw,
  Shirt,
  Utensils,
  Backpack,
  GraduationCap,
  Info,
  Volume2
} from 'lucide-react';
import { playGentleSound, speakText } from '../utils/audio';
import { DisclaimerBanner } from './DisclaimerBanner';
import { BeagleMascot } from './AnimalMascots';

interface Props {
  sensorySettings: SensorySettings;
  setCurrentView: (view: UserView) => void;
}

export const PhysicalSidequest: React.FC<Props> = ({
  sensorySettings,
  setCurrentView
}) => {
  // Scramble initial tiles for demo
  const [tiles, setTiles] = useState<PhysicalTile[]>([
    INITIAL_PHYSICAL_TILES[2], // BREAKFAST
    INITIAL_PHYSICAL_TILES[0], // BRUSH
    INITIAL_PHYSICAL_TILES[4], // SCHOOL
    INITIAL_PHYSICAL_TILES[1], // DRESS
    INITIAL_PHYSICAL_TILES[3], // PACK BAG
  ]);

  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ status: 'idle' | 'correct' | 'incorrect'; message: string }>({
    status: 'idle',
    message: ''
  });

  const moveTile = (index: number, direction: 'left' | 'right') => {
    playGentleSound('step', sensorySettings.soundMode);
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tiles.length) return;

    const newTiles = [...tiles];
    const [moved] = newTiles.splice(index, 1);
    newTiles.splice(targetIndex, 0, moved);
    setTiles(newTiles);

    if (feedback.status !== 'idle') {
      setFeedback({ status: 'idle', message: '' });
    }
  };

  const handleVerifyPhysicalOrder = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const isCorrect = tiles.every((tile, idx) => tile.correctPosition === idx + 1);

    if (isCorrect) {
      playGentleSound('correct', sensorySettings.soundMode);
      setFeedback({
        status: 'correct',
        message: 'Physical routine matched! Morning tiles are in perfect chronological order.'
      });
      speakText('Physical routine matched! Morning tiles are in perfect order!', sensorySettings.soundMode);
    } else {
      playGentleSound('click', sensorySettings.soundMode);
      setFeedback({
        status: 'incorrect',
        message: 'Take another look: usually we brush teeth first, then get dressed, eat breakfast, pack our bag, and head to school.'
      });
    }
  };

  const handleResetTiles = () => {
    playGentleSound('click', sensorySettings.soundMode);
    setTiles([
      INITIAL_PHYSICAL_TILES[2],
      INITIAL_PHYSICAL_TILES[0],
      INITIAL_PHYSICAL_TILES[4],
      INITIAL_PHYSICAL_TILES[1],
      INITIAL_PHYSICAL_TILES[3],
    ]);
    setFeedback({ status: 'idle', message: '' });
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Shirt': return <Shirt className="w-8 h-8" />;
      case 'Utensils': return <Utensils className="w-8 h-8" />;
      case 'Backpack': return <Backpack className="w-8 h-8" />;
      case 'GraduationCap': return <GraduationCap className="w-8 h-8" />;
      default: return <Layers className="w-8 h-8" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-6 animate-fadeIn">
      {/* Header & Concept Explanation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs uppercase font-black tracking-wider text-[#FFC800] bg-[#3B3416] px-3.5 py-1 rounded-full border border-[#665314]">
            Physical-First Philosophy
          </span>
          <span className="text-xs font-black text-[#1CB0F6] bg-[#143343] px-3 py-1 rounded-full border border-[#14496B]">
            Screen-Optional Mode
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Tactile Morning Routine Quest
            </h1>
            <p className="text-[#A5B8C0] text-base mt-1 font-medium">
              Move physical wooden blocks on a desktop mat or arrange the cards below!
            </p>
          </div>
          <div className="hidden sm:block">
            <BeagleMascot size="sm" mood="happy" soundMode={sensorySettings.soundMode} />
          </div>
        </div>

        {/* Core explanation quote in dark card */}
        <div className="bg-[#18262C] border-2 border-[#28373E] rounded-3xl p-5 sm:p-6 space-y-2">
          <p className="text-base sm:text-lg font-black text-[#FFC800] leading-relaxed">
            &ldquo;Some activities can be completed using physical cards or tiles instead of the screen.&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-[#A5B8C0] leading-relaxed font-medium">
            In physical play sessions, children arrange physical wooden blocks on a desktop mat. Below is a simulated interaction for today&apos;s prototype.
          </p>
        </div>
      </div>

      {/* Planned Feature Callout Banner */}
      <div 
        id="webcam-planned-feature-banner"
        className="bg-[#131F24] border-2 border-[#28373E] text-white p-4 sm:p-5 rounded-3xl flex items-start sm:items-center justify-between gap-4 shadow-xl"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#143343] border border-[#1CB0F6] text-[#1CB0F6] flex items-center justify-center flex-shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase font-black tracking-wider text-[#1CB0F6] bg-[#0F2836] px-2.5 py-0.5 rounded-lg border border-[#14496B]">
                Webcam recognition — planned prototype feature
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A5B8C0] mt-1 font-medium">
              Future releases will automatically detect tangible physical RFID / ArUco marker cards placed on the desk via the camera.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Simulated Tiles Board */}
      <div className="bg-[#18262C] rounded-3xl p-6 sm:p-8 border-2 border-[#28373E] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#202F36]">
          <div>
            <h2 className="font-black text-xl text-white">
              Arrange the cards in the correct order:
            </h2>
            <p className="text-xs text-[#A5B8C0] font-medium">
              Move physical routine cards horizontally into slots 1 to 5
            </p>
          </div>
          <button
            onClick={handleResetTiles}
            className="text-xs font-black text-[#1CB0F6] hover:text-white flex items-center gap-1.5 self-start sm:self-auto px-3 py-2 rounded-xl bg-[#202F36] hover:bg-[#283942] border border-[#37464F] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Scramble</span>
          </button>
        </div>

        {/* The 5 Tactile Virtual Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
          {tiles.map((tile, index) => {
            return (
              <div
                key={tile.id}
                id={`physical-tile-${tile.id}`}
                className="bg-[#131F24] rounded-2xl p-4 border-2 border-[#28373E] shadow-md flex flex-col justify-between items-center text-center space-y-3 relative group hover:border-[#58CC02] transition-all"
              >
                {/* Physical Slot Indicator */}
                <span className="w-7 h-7 rounded-xl bg-[#202F36] border border-[#37464F] text-[#58CC02] font-black text-xs flex items-center justify-center">
                  #{index + 1}
                </span>

                {/* Tactile Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#1F3D24] text-[#58CC02] border border-[#2E6B38] flex items-center justify-center shadow-xs">
                  {renderIcon(tile.iconName)}
                </div>

                <div>
                  <h3 className="font-extrabold text-white text-sm tracking-wide">
                    {tile.label}
                  </h3>
                  <p className="text-[11px] text-[#A5B8C0] leading-tight mt-0.5 font-medium">
                    {tile.sublabel}
                  </p>
                </div>

                {/* Shift Left / Shift Right */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#202F36] w-full justify-center">
                  <button
                    onClick={() => moveTile(index, 'left')}
                    disabled={index === 0 || feedback.status === 'correct'}
                    className="p-2 rounded-xl bg-[#202F36] hover:bg-[#283942] disabled:opacity-20 text-white border border-[#37464F] transition-colors cursor-pointer disabled:cursor-not-allowed"
                    title="Move Left"
                    aria-label={`Move ${tile.label} left`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <span className="text-[10px] font-black text-[#A5B8C0]">
                    Slot {index + 1}
                  </span>

                  <button
                    onClick={() => moveTile(index, 'right')}
                    disabled={index === tiles.length - 1 || feedback.status === 'correct'}
                    className="p-2 rounded-xl bg-[#202F36] hover:bg-[#283942] disabled:opacity-20 text-white border border-[#37464F] transition-colors cursor-pointer disabled:cursor-not-allowed"
                    title="Move Right"
                    aria-label={`Move ${tile.label} right`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback Message */}
        {feedback.status !== 'idle' && (
          <div 
            className={`p-4 rounded-2xl border-2 flex items-start gap-3 transition-all ${
              feedback.status === 'correct'
                ? 'bg-[#1C2D27] border-[#2E6B38] text-white'
                : 'bg-[#3B3416] border-[#665314] text-white'
            }`}
          >
            {feedback.status === 'correct' ? (
              <CheckCircle2 className="w-5 h-5 text-[#58CC02] flex-shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-[#FFC800] flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-extrabold text-sm">{feedback.message}</p>
              {feedback.status === 'incorrect' && (
                <p className="text-xs text-[#A5B8C0] mt-0.5 font-medium">Attempt {attempts} recorded.</p>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          {feedback.status !== 'correct' ? (
            <button
              id="verify-physical-tiles-button"
              onClick={handleVerifyPhysicalOrder}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl btn-duo-green text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg uppercase tracking-wider"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Verify Physical Cards Alignment</span>
            </button>
          ) : (
            <button
              onClick={() => {
                playGentleSound('click', sensorySettings.soundMode);
                setCurrentView('child-welcome');
              }}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl btn-duo-blue text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg uppercase tracking-wider"
            >
              <span>Continue to Story Adventures</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Side-by-side comparison info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#18262C] p-5 rounded-3xl border-2 border-[#28373E] space-y-2">
          <h3 className="font-black text-white text-sm flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFC800]" />
            Why Physical Tiles Matter
          </h3>
          <p className="text-xs text-[#A5B8C0] leading-relaxed font-medium">
            Tactile exploration activates kinesthetic memory, allows screen breaks, and encourages fine-motor sequencing for children overwhelmed by prolonged digital screens.
          </p>
        </div>

        <div className="bg-[#18262C] p-5 rounded-3xl border-2 border-[#28373E] space-y-2">
          <h3 className="font-black text-white text-sm flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#58CC02]" />
            Adaptive Seamless Sync
          </h3>
          <p className="text-xs text-[#A5B8C0] leading-relaxed font-medium">
            Physical card arrangements feed directly into the child&apos;s adaptive difficulty model, seamlessly bridging tactile play with digital guardian analytics.
          </p>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
};
