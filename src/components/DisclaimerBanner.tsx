import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<Props> = ({ compact = false }) => {
  if (compact) {
    return (
      <div 
        id="disclaimer-banner-compact"
        className="w-full bg-[#0E171B] border-t border-[#202F36] px-4 py-2.5 text-center text-xs text-[#A5B8C0] flex items-center justify-center gap-2"
      >
        <ShieldCheck className="w-4 h-4 text-[#58CC02] flex-shrink-0" />
        <span>
          <strong className="text-white">Hackathon Demonstration:</strong> Low-stimulation prototype for supportive learning. Not intended for medical assessment or diagnosis.
        </span>
      </div>
    );
  }

  return (
    <div 
      id="disclaimer-banner"
      className="bg-[#18262C] border-2 border-[#28373E] rounded-2xl p-4 flex items-start gap-3.5 text-xs text-[#A5B8C0] leading-relaxed shadow-sm"
    >
      <Info className="w-5 h-5 text-[#58CC02] mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-extrabold text-white text-sm">Educational Concept Prototype</p>
        <p className="text-[#A5B8C0] mt-0.5 leading-relaxed">
          Milo demonstrates a <strong className="text-white">physical-first, low-stimulation, adaptive learning framework</strong>. 
          All adaptive rules and analytics are for demonstrative educational support and do not diagnose ADHD, autism, dyslexia, or any medical condition.
        </p>
      </div>
    </div>
  );
};

