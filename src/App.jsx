import { useState, useEffect, useCallback, useRef } from 'react';
import { playFart, unlockAudio } from './farts.js';
import styles from './App.module.css';

// ── Helpers ──────────────────────────────────────────────────────────────────
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion(selected) {
  let a, b;
  if (selected === 'all') {
    a = randInt(1, 12);
    b = randInt(1, 12);
  } else {
    const n = Number(selected);
    if (Math.random() > 0.5) { a = n; b = randInt(1, 12); }
    else { a = randInt(1, 12); b = n; }
  }
  return { a, b, answer: a * b };
}

// ── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div className={styles.logoWrap}>
      <svg viewBox="0 0 340 80" className={styles.logoSvg} aria-label="Math Tooter — multiplication practice the tooty way" role="img">
        <defs>
          <linearGradient id="lgBg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3C3489" />
            <stop offset="100%" stopColor="#7F77DD" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="340" height="80" rx="16" fill="url(#lgBg)" />
        <text x="18" y="50" fontFamily="-apple-system, BlinkMacSystemFont, system-ui, sans-serif" fontSize="40" fontWeight="500" fill="#EEEDFE" letterSpacing="-1">Math</text>
        <text x="140" y="50" fontFamily="-apple-system, BlinkMacSystemFont, system-ui, sans-serif" fontSize="40" fontWeight="500" fill="#FAC775" letterSpacing="-1">Tooter</text>
        <text x="284" y="48" fontSize="28">💨</text>
        <text x="18" y="68" fontFamily="-apple-system, BlinkMacSystemFont, system-ui, sans-serif" fontSize="11" fill="#AFA9EC" letterSpacing="0.8">multiplication practice — the tooty way</text>
      </svg>
    </div>
  );
}

// ── Number Selector ───────────────────────────────────────────────────────────
function NumberSelector({ selected, onSelect }) {
  return (
    <div className={styles.numSelector}>
      <p className={styles.selectorLabel}>Pick a number to practice</p>
      <div className={styles.numGrid}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            className={`${styles.numBtn} ${selected === String(n) ? styles.numBtnActive : ''}`}
            onClick={() => onSelect(String(n))}
            aria-pressed={selected === String(n)}
          >
            {n}
          </button>
        ))}
        <button
          className={`${styles.numBtn} ${styles.numBtnAll} ${selected === 'all' ? styles.numBtnActive : ''}`}
          onClick={() => onSelect('all')}
          aria-pressed={selected === 'all'}
        >
          All
        </button>
      </div>
      {selected && (
        <p className={styles.selectorHint}>
          {selected === 'all' ? 'Random mix — go for it! 🎲' : `Practicing ${selected}s`}
        </p>
      )}
    </div>
  );
}

// ── Question Card ─────────────────────────────────────────────────────────────
function QuestionCard({ question, inputVal, status }) {
  return (
    <div className={styles.questionCard}>
      <div className={styles.questionText}>
        {question.a} × {question.b} =
      </div>
      <div className={`${styles.answerDisplay} ${status ? styles[`answer_${status}`] : ''}`}>
        {inputVal || '?'}
      </div>
    </div>
  );
}

// ── Feedback ──────────────────────────────────────────────────────────────────
function Feedback({ status, message }) {
  if (!message) return <div className={styles.feedbackPlaceholder} />;
  return (
    <div className={`${styles.feedback} ${styles[`feedback_${status}`]}`} role="alert" aria-live="polite">
      {message}
    </div>
  );
}

// ── Keypad ────────────────────────────────────────────────────────────────────
const KEYS = ['1','2','3','4','5','6','7','8','9','⌫','0','✓'];

function Keypad({ onKey, disabled }) {
  return (
    <div className={styles.keypad} role="group" aria-label="Number pad">
      {KEYS.map(k => (
        <button
          key={k}
          className={`${styles.key} ${k === '⌫' ? styles.keyDel : ''} ${k === '✓' ? styles.keyCheck : ''}`}
          onClick={() => onKey(k)}
          disabled={disabled}
          aria-label={k === '⌫' ? 'Backspace' : k === '✓' ? 'Check answer' : k}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

// ── Score Bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ correct, total, streak }) {
  return (
    <div className={styles.scoreBar} role="status" aria-label="Score summary">
      <div className={styles.scorePill}>
        <span className={styles.scoreLabel}>Correct</span>
        <span className={styles.scoreVal}>{correct}</span>
      </div>
      <div className={styles.scorePill}>
        <span className={styles.scoreLabel}>Total</span>
        <span className={styles.scoreVal}>{total}</span>
      </div>
      <div className={styles.scorePill}>
        <span className={styles.scoreLabel}>Streak</span>
        <span className={styles.scoreVal}>{streak} {streak >= 3 ? '🔥' : '💨'}</span>
      </div>
    </div>
  );
}

// ── Floating Emojis ───────────────────────────────────────────────────────────
function FloatingEmojis({ clouds }) {
  return (
    <div className={styles.cloudLayer} aria-hidden="true">
      {clouds.map(c => (
        <span
          key={c.id}
          className={styles.cloud}
          style={{ left: c.x, top: c.y }}
        >
          {c.emoji}
        </span>
      ))}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
const CORRECT_EMOJIS = ['💨','🤣','💨','🌬️','😄','🎉','💨','👏'];
const WRONG_EMOJIS   = ['💀','❌','😬','🙈','💩','😅','🤔'];

export default function App() {
  const [selected, setSelected]   = useState(null);
  const [question, setQuestion]   = useState(null);
  const [inputVal, setInputVal]   = useState('');
  const [status, setStatus]       = useState(null);
  const [feedback, setFeedback]   = useState('');
  const [answered, setAnswered]   = useState(false);
  const [score, setScore]         = useState({ correct: 0, total: 0, streak: 0 });
  const [clouds, setClouds]       = useState([]);
  const cloudId = useRef(0);
  const streakRef = useRef(0); // keep streak in sync for closure access

  // Unlock audio on first tap anywhere
  useEffect(() => {
    const unlock = () => { unlockAudio(); document.removeEventListener('touchstart', unlock); };
    document.addEventListener('touchstart', unlock, { passive: true });
    return () => document.removeEventListener('touchstart', unlock);
  }, []);

  const spawnCloud = useCallback((isCorrect) => {
    const pool = isCorrect ? CORRECT_EMOJIS : WRONG_EMOJIS;
    const emoji = pool[Math.floor(Math.random() * pool.length)];
    const id = ++cloudId.current;
    // Randomize position within the viewport
    const x = 20 + Math.random() * (window.innerWidth - 60);
    const y = 100 + Math.random() * (window.innerHeight * 0.4);
    setClouds(prev => [...prev, { id, emoji, x, y }]);
    setTimeout(() => setClouds(prev => prev.filter(c => c.id !== id)), 1400);
  }, []);

  const startQuestion = useCallback((sel) => {
    const active = sel ?? selected;
    if (!active) return;
    setQuestion(generateQuestion(active));
    setInputVal('');
    setStatus(null);
    setFeedback('');
    setAnswered(false);
  }, [selected]);

  const handleSelectNum = (n) => {
    setSelected(n);
    setScore({ correct: 0, total: 0, streak: 0 });
    streakRef.current = 0;
    // Generate question inline so we don't depend on state update timing
    setQuestion(generateQuestion(n));
    setInputVal('');
    setStatus(null);
    setFeedback('');
    setAnswered(false);
  };

  const handleCheck = useCallback(() => {
    if (answered || !inputVal || !question) return;
    setAnswered(true);
    const guess = parseInt(inputVal, 10);
    const isCorrect = guess === question.answer;

    if (isCorrect) {
      const newStreak = streakRef.current + 1;
      streakRef.current = newStreak;
      setStatus('correct');
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1, streak: newStreak }));
      setFeedback(newStreak >= 3 ? `${newStreak} in a row! 🔥` : newStreak > 1 ? `Nice! ${newStreak} in a row! 💨` : 'Correct! 💨');
      playFart();
      spawnCloud(true);
    } else {
      streakRef.current = 0;
      setStatus('wrong');
      setScore(prev => ({ ...prev, total: prev.total + 1, streak: 0 }));
      setFeedback(`Nope — ${question.a} × ${question.b} = ${question.answer}`);
      spawnCloud(false);
    }
  }, [answered, inputVal, question, spawnCloud]);

  const handleKey = useCallback((k) => {
    if (k === '⌫') {
      setInputVal(v => v.slice(0, -1));
      return;
    }
    if (k === '✓') {
      handleCheck();
      return;
    }
    if (!answered) {
      setInputVal(v => v.length >= 3 ? v : v + k);
    }
  }, [answered, handleCheck]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      if (e.key >= '0' && e.key <= '9') handleKey(e.key);
      else if (e.key === 'Backspace') handleKey('⌫');
      else if (e.key === 'Enter') {
        if (answered) startQuestion();
        else handleCheck();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleKey, handleCheck, answered, startQuestion]);

  return (
    <div className={styles.app}>
      <FloatingEmojis clouds={clouds} />

      <main className={styles.main}>
        <Logo />
        <NumberSelector selected={selected} onSelect={handleSelectNum} />

        {question && (
          <>
            <QuestionCard question={question} inputVal={inputVal} status={status} />
            <Feedback status={status} message={feedback} />
            <Keypad onKey={handleKey} disabled={answered} />

            {!answered ? (
              <button
                className={`${styles.actionBtn} ${styles.checkBtn} ${!inputVal ? styles.checkBtnDisabled : ''}`}
                onClick={handleCheck}
                disabled={!inputVal}
              >
                Check answer
              </button>
            ) : (
              <button
                className={`${styles.actionBtn} ${styles.nextBtn}`}
                onClick={() => startQuestion()}
              >
                Next question →
              </button>
            )}

            <ScoreBar {...score} />
          </>
        )}
      </main>
    </div>
  );
}
