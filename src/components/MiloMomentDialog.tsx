import React, { useState } from 'react';
import { SensorySettings } from '../types';
import { playGentleSound, speakText } from '../utils/audio';
import { 
  PhoneCall, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  X,
  Sparkles
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sensorySettings: SensorySettings;
  onGoToBreak?: () => void;
  onGoToCaregiver?: () => void;
}

export const MiloMomentDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  sensorySettings,
  onGoToBreak,
  onGoToCaregiver
}) => {
  const [guardianSubmenu, setGuardianSubmenu] = useState(false);
  const [guardianNotified, setGuardianNotified] = useState(false);

  if (!isOpen) return null;

  return (
    <div 
      id="milo-moment-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playGentleSound('click', sensorySettings.soundMode);
          onClose();
        }
      }}
    >
      <div 
        id="milo-moment-dialog"
        className="bg-[#18262C] border-2 border-[#37464F] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center animate-scaleUp relative"
      >
        {/* Close button */}
        <button
          id="close-milo-moment-x"
          onClick={() => {
            playGentleSound('click', sensorySettings.soundMode);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#A5B8C0] hover:text-white hover:bg-[#202F36] transition-colors cursor-pointer"
          aria-label="Close Milo Moment"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Mascot Badge & Title */}
        <div className="space-y-2 pt-1">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#1F3D24] border-2 border-[#2E6B38] flex items-center justify-center text-3xl shadow-lg">
            🐶
          </div>
          <h3 className="text-2xl font-black text-white">Milo Moment</h3>
          <p className="text-base font-bold text-[#A5B8C0]">
            What would you like to do?
          </p>
        </div>

        {/* Action Choices */}
        <div className="space-y-3 pt-1">
          {/* Choice 1: 📞 Talk to my Guardian */}
          <button
            id="milo-moment-talk-guardian-btn"
            onClick={() => {
              playGentleSound('click', sensorySettings.soundMode);
              setGuardianSubmenu(true);
              speakText("It is always great to check in with your parent or guardian.", sensorySettings.soundMode);
            }}
            className={`w-full py-4 px-5 rounded-2xl border-2 text-left font-black text-sm sm:text-base flex items-center justify-between group transition-all cursor-pointer ${
              guardianSubmenu
                ? 'bg-[#1D3B4E] border-[#1CB0F6] text-white shadow-md'
                : 'bg-[#202F36] hover:bg-[#283942] border-[#37464F] hover:border-[#1CB0F6] text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-white group-hover:text-[#1CB0F6] transition-colors">Talk to my Guardian</p>
                <p className="text-xs text-[#A5B8C0] font-bold">Ask for guidance or take a quick check-in</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#A5B8C0] group-hover:text-[#1CB0F6] transition-transform group-hover:translate-x-1" />
          </button>

          {/* Choice 2: 🧘 Take a Calm Break */}
          <button
            id="milo-moment-calm-break-btn"
            onClick={() => {
              playGentleSound('water', sensorySettings.soundMode);
              onClose();
              if (onGoToBreak) onGoToBreak();
            }}
            className="w-full py-4 px-5 rounded-2xl bg-[#202F36] hover:bg-[#283942] border-2 border-[#37464F] hover:border-[#58CC02] text-white text-left font-black text-sm sm:text-base flex items-center justify-between group transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧘</span>
              <div>
                <p className="text-white group-hover:text-[#58CC02] transition-colors">Take a Calm Break</p>
                <p className="text-xs text-[#A5B8C0] font-bold">Drink water, stretch, or do gentle breathing</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#A5B8C0] group-hover:text-[#58CC02] transition-transform group-hover:translate-x-1" />
          </button>

          {/* Choice 3: ← Back to Lesson */}
          <button
            id="milo-moment-back-lesson-btn"
            onClick={() => {
              playGentleSound('sparkle', sensorySettings.soundMode);
              onClose();
            }}
            className="w-full py-3.5 px-5 rounded-2xl btn-duo-green text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Lesson</span>
          </button>
        </div>

        {/* Sub-menu if Talk to Guardian selected */}
        {guardianSubmenu && (
          <div className="bg-[#131F24] p-4 rounded-2xl border-2 border-[#1CB0F6]/40 text-left space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-black text-[#1CB0F6]">
              <PhoneCall className="w-4 h-4" />
              <span>Guardian Support Options</span>
            </div>
            
            <p className="text-xs text-[#A5B8C0] font-medium leading-relaxed">
              Milo will pause your lesson timer and save your exact progress so you can ask an adult for help.
            </p>

            {guardianNotified ? (
              <div className="p-3 bg-[#1F3D24] border border-[#2E6B38] rounded-xl flex items-center gap-2 text-xs text-[#58CC02] font-black">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Guardian notified! Milo will wait patiently right here.</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  id="notify-guardian-instant-button"
                  onClick={() => {
                    playGentleSound('bark', sensorySettings.soundMode);
                    setGuardianNotified(true);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#202F36] hover:bg-[#283942] border border-[#37464F] text-white text-xs font-black text-center cursor-pointer transition-colors"
                >
                  🔔 Signal Guardian
                </button>
                
                <button
                  id="open-guardian-hub-modal-button"
                  onClick={() => {
                    playGentleSound('click', sensorySettings.soundMode);
                    onClose();
                    if (onGoToCaregiver) onGoToCaregiver();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#1CB0F6] hover:bg-[#1899D6] text-white text-xs font-black text-center cursor-pointer transition-colors shadow-md"
                >
                  Open Guardian Hub
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
