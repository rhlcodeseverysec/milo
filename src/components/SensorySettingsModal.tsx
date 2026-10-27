import React from 'react';
import { 
  SensorySettings, 
  VisualMode, 
  SoundMode, 
  InstructionMode 
} from '../types';
import { 
  X, 
  Eye, 
  Volume2, 
  FileText, 
  Clock, 
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { playGentleSound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sensorySettings: SensorySettings;
  setSensorySettings: React.Dispatch<React.SetStateAction<SensorySettings>>;
}

export const SensorySettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  sensorySettings,
  setSensorySettings
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="sensory-settings-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="sensory-settings-modal-content"
        className="bg-[#18262C] rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#28373E] shadow-2xl space-y-6 animate-scaleUp text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#28373E]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#1F3D24] text-[#58CC02] border border-[#2E6B38] flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-white">
                Sensory & Accessibility
              </h2>
              <p className="text-xs text-[#A5B8C0]">Live environmental adjustments for Sam</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#A5B8C0] hover:text-white hover:bg-[#202F36] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings options */}
        <div className="space-y-4 text-sm">
          {/* 1. Visual stimulation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#58CC02] font-black text-xs uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>Visual Stimulation</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['minimal', 'normal'] as VisualMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    playGentleSound('click', sensorySettings.soundMode);
                    setSensorySettings(prev => ({ ...prev, visualMode: mode }));
                  }}
                  className={`p-3.5 rounded-2xl border-2 font-black text-xs capitalize transition-all flex items-center justify-between cursor-pointer ${
                    sensorySettings.visualMode === mode
                      ? 'bg-[#1F3D24] border-[#58CC02] text-[#58CC02] ring-2 ring-[#58CC02]/40'
                      : 'bg-[#131F24] border-[#28373E] text-[#A5B8C0] hover:border-[#58CC02]'
                  }`}
                >
                  <span>{mode === 'minimal' ? 'Minimal (Calm)' : 'Normal (Subtle)'}</span>
                  {sensorySettings.visualMode === mode && <Check className="w-4 h-4 text-[#58CC02]" />}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Sound Feedback */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#1CB0F6] font-black text-xs uppercase tracking-wider">
              <Volume2 className="w-4 h-4" />
              <span>Audio Sound Level</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['off', 'soft', 'normal'] as SoundMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    setSensorySettings(prev => ({ ...prev, soundMode: mode }));
                    playGentleSound('click', mode);
                  }}
                  className={`p-3.5 rounded-2xl border-2 font-black text-xs capitalize transition-all flex items-center justify-between cursor-pointer ${
                    sensorySettings.soundMode === mode
                      ? 'bg-[#143343] border-[#1CB0F6] text-[#1CB0F6] ring-2 ring-[#1CB0F6]/40'
                      : 'bg-[#131F24] border-[#28373E] text-[#A5B8C0] hover:border-[#1CB0F6]'
                  }`}
                >
                  <span>{mode}</span>
                  {sensorySettings.soundMode === mode && <Check className="w-4 h-4 text-[#1CB0F6]" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Instructions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#FFC800] font-black text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Instruction Format</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['text', 'pictures', 'both'] as InstructionMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    playGentleSound('click', sensorySettings.soundMode);
                    setSensorySettings(prev => ({ ...prev, instructionMode: mode }));
                  }}
                  className={`p-3.5 rounded-2xl border-2 font-black text-xs capitalize transition-all flex items-center justify-between cursor-pointer ${
                    sensorySettings.instructionMode === mode
                      ? 'bg-[#3B3416] border-[#FFC800] text-[#FFC800] ring-2 ring-[#FFC800]/40'
                      : 'bg-[#131F24] border-[#28373E] text-[#A5B8C0] hover:border-[#FFC800]'
                  }`}
                >
                  <span>{mode === 'both' ? 'Both' : mode}</span>
                  {sensorySettings.instructionMode === mode && <Check className="w-4 h-4 text-[#FFC800]" />}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Activity duration */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#CE82FF] font-black text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Target Activity Length</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[2, 5, 10].map(mins => (
                <button
                  key={mins}
                  onClick={() => {
                    playGentleSound('click', sensorySettings.soundMode);
                    setSensorySettings(prev => ({ ...prev, activityDuration: mins }));
                  }}
                  className={`p-3.5 rounded-2xl border-2 font-black text-xs transition-all flex items-center justify-between cursor-pointer ${
                    sensorySettings.activityDuration === mins
                      ? 'bg-[#352044] border-[#CE82FF] text-[#CE82FF] ring-2 ring-[#CE82FF]/40'
                      : 'bg-[#131F24] border-[#28373E] text-[#A5B8C0] hover:border-[#CE82FF]'
                  }`}
                >
                  <span>{mins} mins</span>
                  {sensorySettings.activityDuration === mins && <Check className="w-4 h-4 text-[#CE82FF]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Done button */}
        <button
          onClick={() => {
            playGentleSound('click', sensorySettings.soundMode);
            onClose();
          }}
          className="w-full py-4 px-6 rounded-2xl btn-duo-green text-white font-black text-sm shadow-md transition-all cursor-pointer uppercase tracking-wider"
        >
          Save & Apply Settings
        </button>
      </div>
    </div>
  );
};
