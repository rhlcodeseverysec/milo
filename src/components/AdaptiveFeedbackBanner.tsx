import React from 'react';
import { Sparkles, Sliders, ArrowUpRight } from 'lucide-react';

interface Props {
  message: string;
  category?: string;
  levelChange?: string;
  onDismiss?: () => void;
}

export const AdaptiveFeedbackBanner: React.FC<Props> = ({
  message,
  category,
  levelChange,
  onDismiss
}) => {
  return (
    <div 
      id="adaptive-feedback-banner"
      className="bg-[#1C2D27] border-2 border-[#2E6B38] rounded-3xl p-4 mb-5 shadow-lg flex items-start gap-3.5 transition-all animate-fadeIn"
    >
      <div className="w-10 h-10 rounded-2xl bg-[#1F3D24] border border-[#58CC02] flex items-center justify-center text-[#58CC02] flex-shrink-0 mt-0.5">
        <Sparkles className="w-5 h-5 fill-[#58CC02]" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-black uppercase tracking-wider text-[#58CC02] bg-[#143319] border border-[#2E6B38] px-2.5 py-0.5 rounded-lg flex items-center gap-1">
            <Sliders className="w-3 h-3" /> Adaptive Engine
          </span>
          {category && (
            <span className="text-xs font-bold text-[#A5B8C0]">
              Target: <strong className="text-white">{category}</strong>
            </span>
          )}
          {levelChange && (
            <span className="text-xs font-black text-white bg-[#58CC02] px-2 py-0.5 rounded-lg flex items-center gap-0.5 shadow-xs">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" /> {levelChange}
            </span>
          )}
        </div>
        <p className="text-sm text-white font-bold mt-1.5 leading-snug">
          {message}
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-[#A5B8C0] hover:text-white text-xs font-bold px-2.5 py-1.5 rounded-xl bg-[#18262C] hover:bg-[#202F36] border border-[#28373E] transition-colors cursor-pointer"
          aria-label="Dismiss note"
        >
          Got it!
        </button>
      )}
    </div>
  );
};

