import React, { useState } from 'react';
import { SensorySettings } from '../types';
import { playGentleSound } from '../utils/audio';
import { ShieldCheck, Lock, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sensorySettings: SensorySettings;
  storedPin?: string;
}

export const ParentalGateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  sensorySettings,
  storedPin = '1234'
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [useMathGate, setUseMathGate] = useState(false);
  const [mathAnswer, setMathAnswer] = useState('');
  
  // Predictable math question for accessibility
  const num1 = 7;
  const num2 = 8;
  const expectedMathProduct = 56;

  if (!isOpen) return null;

  const handlePinDigit = (digit: string) => {
    playGentleSound('click', sensorySettings.soundMode);
    setErrorMsg('');
    if (pinInput.length < 4) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === storedPin) {
          playGentleSound('sparkle', sensorySettings.soundMode);
          onClose();
          onSuccess();
          setPinInput('');
        } else {
          playGentleSound('click', sensorySettings.soundMode);
          setErrorMsg('Incorrect PIN. (Default demo PIN is 1234)');
          setPinInput('');
        }
      }
    }
  };

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(mathAnswer.trim(), 10) === expectedMathProduct) {
      playGentleSound('sparkle', sensorySettings.soundMode);
      onClose();
      onSuccess();
      setMathAnswer('');
    } else {
      playGentleSound('click', sensorySettings.soundMode);
      setErrorMsg(`Incorrect answer. Hint: ${num1} × ${num2} = ${expectedMathProduct}`);
      setMathAnswer('');
    }
  };

  return (
    <div 
      id="parental-gate-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playGentleSound('click', sensorySettings.soundMode);
          onClose();
        }
      }}
    >
      <div 
        id="parental-gate-dialog"
        className="bg-[#18262C] border-2 border-[#37464F] rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-5 text-center animate-scaleUp relative"
      >
        {/* Close Button */}
        <button
          id="close-parental-gate-btn"
          onClick={() => {
            playGentleSound('click', sensorySettings.soundMode);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#A5B8C0] hover:text-white hover:bg-[#202F36] transition-colors cursor-pointer"
          aria-label="Close Parental Gate"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pt-1">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#143343] border border-[#14496B] flex items-center justify-center text-[#1CB0F6]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white font-display">Grown-Ups Only</h3>
          <p className="text-xs text-[#A5B8C0] font-medium leading-relaxed">
            Please verify you are a parent or educator to access settings and learner analytics.
          </p>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="p-2.5 rounded-xl bg-[#202F36] border border-[#37464F] text-[11px] text-[#A5B8C0] flex items-center justify-between">
          <span className="font-bold text-white">Default Demo PIN:</span>
          <span className="px-2 py-0.5 rounded-md bg-[#58CC02]/20 text-[#58CC02] font-black tracking-widest text-xs">
            {storedPin}
          </span>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-[#FF4B4B]/15 border border-[#FF4B4B]/40 text-xs text-[#FF4B4B] font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!useMathGate ? (
          /* PIN keypad interface */
          <div className="space-y-4">
            {/* PIN Dots Display */}
            <div className="flex justify-center items-center gap-3 py-2">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    pinInput.length > index
                      ? 'bg-[#1CB0F6] border-[#1CB0F6] scale-110 shadow-sm shadow-[#1CB0F6]'
                      : 'border-[#37464F] bg-[#131F24]'
                  }`}
                />
              ))}
            </div>

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  id={`pin-key-${digit}`}
                  onClick={() => handlePinDigit(digit)}
                  className="py-3 rounded-2xl bg-[#202F36] hover:bg-[#283942] active:scale-95 text-white font-black text-lg border border-[#37464F] hover:border-[#1CB0F6] transition-all cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  playGentleSound('click', sensorySettings.soundMode);
                  setPinInput('');
                  setErrorMsg('');
                }}
                className="py-3 rounded-2xl bg-[#202F36] hover:bg-[#283942] active:scale-95 text-xs text-[#A5B8C0] font-bold border border-[#37464F] transition-all cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                id="pin-key-0"
                onClick={() => handlePinDigit('0')}
                className="py-3 rounded-2xl bg-[#202F36] hover:bg-[#283942] active:scale-95 text-white font-black text-lg border border-[#37464F] hover:border-[#1CB0F6] transition-all cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => {
                  playGentleSound('click', sensorySettings.soundMode);
                  setPinInput(prev => prev.slice(0, -1));
                }}
                className="py-3 rounded-2xl bg-[#202F36] hover:bg-[#283942] active:scale-95 text-xs text-[#A5B8C0] font-bold border border-[#37464F] transition-all cursor-pointer"
              >
                ⌫ Back
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                playGentleSound('click', sensorySettings.soundMode);
                setUseMathGate(true);
                setErrorMsg('');
              }}
              className="text-xs text-[#1CB0F6] hover:underline font-bold"
            >
              Or solve a math puzzle instead
            </button>
          </div>
        ) : (
          /* Math verification interface */
          <form onSubmit={handleMathSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#131F24] border border-[#37464F] text-center space-y-2">
              <span className="text-xs text-[#A5B8C0] font-bold">Adult Verification Challenge:</span>
              <p className="text-xl font-black text-white">
                {num1} × {num2} = ?
              </p>
            </div>

            <input
              type="number"
              value={mathAnswer}
              onChange={(e) => setMathAnswer(e.target.value)}
              placeholder="Enter answer"
              className="w-full text-center py-3 px-4 rounded-2xl bg-[#131F24] border-2 border-[#37464F] text-white font-black text-lg focus:border-[#1CB0F6] focus:outline-none"
              autoFocus
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  playGentleSound('click', sensorySettings.soundMode);
                  setUseMathGate(false);
                  setErrorMsg('');
                }}
                className="py-3 px-4 rounded-2xl bg-[#202F36] hover:bg-[#283942] text-xs text-[#A5B8C0] font-bold border border-[#37464F] cursor-pointer"
              >
                Use PIN
              </button>
              <button
                type="submit"
                className="py-3 px-4 rounded-2xl btn-duo-green text-xs font-black text-white cursor-pointer shadow-md"
              >
                Verify & Enter
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
