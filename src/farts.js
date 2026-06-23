// Math Tooter — Fart Sound Player
// Loads real audio files from src/farts/
// Supports .mp3, .wav, and .flac

// ── List your actual filenames here ─────────────────────────────────────────
// Vite imports assets from src/ at build time, so we import each file directly.
// Rename your files to match, or update these imports to match your filenames.

import fart1 from './farts/fart1.wav';
import fart2 from './farts/fart2.flac';
import fart3 from './farts/fart3.wav';
import fart4 from './farts/fart4.wav';
import fart5 from './farts/fart5.wav';
import fart6 from './farts/fart6.wav';
import fart7 from './farts/fart7.mp3';
import fart8 from './farts/fart8.wav';
import fart9 from './farts/fart9.mp3';
import fart10 from './farts/fart10.wav';
import fart11 from './farts/fart11.mp3';

const FART_SOURCES = [
  fart1, fart2, fart3, fart4, fart5, fart6,
  fart7, fart8, fart9, fart10, fart11,
];

// Pre-load all audio objects once so there's no delay on first play
const FART_AUDIO = FART_SOURCES.map(src => {
  const audio = new Audio(src);
  audio.preload = 'auto';
  return audio;
});

let lastIndex = -1;

export function playFart() {
  try {
    // Pick a random sound that isn't the same as last time
    let idx;
    do {
      idx = Math.floor(Math.random() * FART_AUDIO.length);
    } while (idx === lastIndex && FART_AUDIO.length > 1);
    lastIndex = idx;

    const audio = FART_AUDIO[idx];
    audio.currentTime = 0; // rewind in case it was played recently
    audio.play().catch(e => console.warn('Fart blocked:', e));
  } catch (e) {
    console.warn('Fart error:', e);
  }
}

// No-op kept for API compatibility with App.jsx
export function unlockAudio() {}