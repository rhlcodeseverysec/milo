// Gentle, low-stimulation audio synthesizer and speech helper
// Designed specifically for children with diverse learning needs and early learners (age 4+)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playGentleSound(
  type: 'click' | 'success' | 'hint' | 'step' | 'complete' | 'bark' | 'cheer' | 'gem' | 'correct' | 'tap' | 'water' | 'sparkle' | 'tile' | 'match',
  soundMode: 'off' | 'soft' | 'normal' = 'soft'
) {
  if (soundMode === 'off') return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const masterGain = soundMode === 'soft' ? 0.08 : 0.18;

  try {
    const now = ctx.currentTime;

    if (type === 'click' || type === 'tap' || type === 'step' || type === 'tile') {
      // Tactile wooden / soft bouncy pop click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(type === 'tile' ? 440 : 520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.07);

      gain.gain.setValueAtTime(masterGain * 0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'water') {
      // Refreshing calm water droplet trickle
      const droplets = [587.33, 783.99, 880.0, 1174.66];
      droplets.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + idx * 0.07 + 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(masterGain * 0.5, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.16);
      });
    } else if (type === 'gem' || type === 'sparkle' || type === 'match') {
      // High sparkling dual chime / match flourish
      const freqs = type === 'match' ? [659.25, 880.00, 1046.50, 1318.51] : [1046.5, 1318.5, 1567.98];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(masterGain * 0.6, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    } else if (type === 'bark') {
      // Cute playful cartoon puppy woof! (dual-tone gentle modulate)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(460, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.14);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(masterGain * 0.7, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      // Low pass filter for warm, friendly puppy tone
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'hint') {
      // Warm gentle dual chime
      const freqs = [523.25, 659.25]; // C5, E5
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(masterGain * 0.9, now + idx * 0.1 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.35);
      });
    } else if (type === 'success' || type === 'correct' || type === 'cheer') {
      // Signature Duolingo-like uplifting rising chord
      const notes = [440.00, 554.37, 659.25, 880.00]; // A major 4-note celebration
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(masterGain, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } else if (type === 'complete') {
      // Big harmonious celebration fanfare
      const chord = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(masterGain * 0.8, now + idx * 0.06 + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + 1.2);
      });
    }
  } catch {
    // Audio context safely ignored if blocked by browser policy until gesture
  }
}

// Spoken voice read-aloud feature for special needs children (age 4+)
export function speakText(text: string, soundMode: 'off' | 'soft' | 'normal' = 'soft') {
  if (soundMode === 'off') return;
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel(); // cancel any previous queue
    const cleanText = text.replace(/₹/g, 'rupees ').replace(/[^\w\s.,?!]/gi, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9; // clear, friendly, slightly slower for young children
    utterance.pitch = 1.15; // cheerful friendly tone
    utterance.volume = soundMode === 'soft' ? 0.6 : 1.0;
    
    // Pick child-friendly english voice if available
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Child')));
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Graceful fallback if speech synthesis not available
  }
}
