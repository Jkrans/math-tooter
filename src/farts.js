// Math Tooter — Fart Sound Library
// 6 distinct synthesized variations, randomized on each call.

let audioCtx = null;

function getCtx() {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function makeBuffer(ctx, duration) {
  return ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
}

function connectAndPlay(ctx, src, gain, duration) {
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  src.connect(gainNode);
  gainNode.connect(ctx.destination);
  src.start();
}

// 1. Classic wet toot — mid-length, bubbly
function fartClassic(ctx) {
  const dur = 0.45;
  const buf = makeBuffer(ctx, dur);
  const d = buf.getChannelData(0);
  const sr = ctx.sampleRate;
  for (let i = 0; i < d.length; i++) {
    const t = i / sr;
    const env = Math.exp(-t * 6) * Math.max(0, 1 - t * 1.8);
    const noise = Math.random() * 2 - 1;
    const buzz = Math.sin(2 * Math.PI * (80 + 100 * Math.exp(-t * 6)) * t);
    const wobble = Math.sin(2 * Math.PI * 8 * t) * 0.3;
    d[i] = env * (noise * 0.45 + buzz * (0.4 + wobble) + 0.15 * Math.sin(2 * Math.PI * 160 * t));
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  connectAndPlay(ctx, src, 0.85, dur);
}

// 2. Short squeaker — high-pitched quick poot
function fartSqueaker(ctx) {
  const dur = 0.18;
  const buf = makeBuffer(ctx, dur);
  const d = buf.getChannelData(0);
  const sr = ctx.sampleRate;
  for (let i = 0; i < d.length; i++) {
    const t = i / sr;
    const env = Math.exp(-t * 18) * Math.max(0, 1 - t * 5);
    const noise = Math.random() * 2 - 1;
    const pitch = 300 + 600 * Math.exp(-t * 15);
    const buzz = Math.sin(2 * Math.PI * pitch * t);
    d[i] = env * (noise * 0.3 + buzz * 0.7);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  connectAndPlay(ctx, src, 0.7, dur);
}

// 3. Long rumbler — slow, deep, rumbly
function fartRumbler(ctx) {
  const dur = 0.85;
  const buf = makeBuffer(ctx, dur);
  const d = buf.getChannelData(0);
  const sr = ctx.sampleRate;
  for (let i = 0; i < d.length; i++) {
    const t = i / sr;
    const env = Math.pow(Math.max(0, 1 - t / dur), 1.5) * (1 - Math.exp(-t * 20));
    const noise = Math.random() * 2 - 1;
    const pitch = 40 + 30 * Math.sin(2 * Math.PI * 2.5 * t);
    const buzz = Math.sin(2 * Math.PI * pitch * t);
    const sub = Math.sin(2 * Math.PI * 20 * t);
    d[i] = env * (noise * 0.5 + buzz * 0.3 + sub * 0.2);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  connectAndPlay(ctx, src, 0.9, dur);
}

// 4. Sputtering machine-gun — rapid-fire bursts
function fartSputter(ctx) {
  const dur = 0.55;
  const buf = makeBuffer(ctx, dur);
  const d = buf.getChannelData(0);
  const sr = ctx.sampleRate;
  for (let i = 0; i < d.length; i++) {
    const t = i / sr;
    const envelope = Math.exp(-t * 4);
    const gate = Math.abs(Math.sin(2 * Math.PI * 22 * t)) > 0.35 ? 1 : 0.05;
    const noise = Math.random() * 2 - 1;
    const buzz = Math.sin(2 * Math.PI * (90 + 60 * Math.exp(-t * 3)) * t);
    d[i] = envelope * gate * (noise * 0.4 + buzz * 0.6);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  connectAndPlay(ctx, src, 0.8, dur);
}

// 5. Airy whoopee — classic cushion style
function fartWhoopee(ctx) {
  const dur = 0.6;
  const buf = makeBuffer(ctx, dur);
  const d = buf.getChannelData(0);
  const sr = ctx.sampleRate;
  for (let i = 0; i < d.length; i++) {
    const t = i / sr;
    const env = Math.exp(-t * 5) * (1 - Math.exp(-t * 30));
    const pitch = 120 - 60 * (t / dur);
    const buzz = Math.sin(2 * Math.PI * pitch * t);
    const overtone = Math.sin(2 * Math.PI * pitch * 2.7 * t) * 0.3;
    const noise = (Math.random() * 2 - 1) * 0.2;
    d[i] = env * (buzz * 0.5 + overtone + noise);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  connectAndPlay(ctx, src, 0.75, dur);
}

// 6. Surprised squeal — rises then falls, like stepping on a rubber duck
function fartSqueal(ctx) {
  const dur = 0.38;
  const buf = makeBuffer(ctx, dur);
  const d = buf.getChannelData(0);
  const sr = ctx.sampleRate;
  for (let i = 0; i < d.length; i++) {
    const t = i / sr;
    const progress = t / dur;
    const env = Math.sin(Math.PI * progress) * Math.exp(-progress * 3);
    const pitch = 180 + 280 * Math.sin(Math.PI * progress * 0.8);
    const buzz = Math.sin(2 * Math.PI * pitch * t);
    const noise = (Math.random() * 2 - 1) * 0.15;
    d[i] = env * (buzz * 0.85 + noise);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  connectAndPlay(ctx, src, 0.7, dur);
}

const FART_LIBRARY = [
  fartClassic,
  fartSqueaker,
  fartRumbler,
  fartSputter,
  fartWhoopee,
  fartSqueal,
];

let lastFartIndex = -1;

export function playFart() {
  try {
    const ctx = getCtx();
    // Pick a random fart that isn't the same as last time
    let idx;
    do {
      idx = Math.floor(Math.random() * FART_LIBRARY.length);
    } while (idx === lastFartIndex && FART_LIBRARY.length > 1);
    lastFartIndex = idx;
    FART_LIBRARY[idx](ctx);
  } catch (e) {
    console.warn('Fart sound failed:', e);
  }
}

// Unlock audio context on first user interaction (required by browsers)
export function unlockAudio() {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
  } catch (_) {}
}
