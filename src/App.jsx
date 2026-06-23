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
      <svg width="100%" viewBox="0 0 380 160" role="img" xmlns="http://www.w3.org/2000/svg" aria-label="Math Tooter logo">
        <rect x="0" y="0" width="380" height="160" rx="20" fill="#3C3489"/>

        {/* Text - left side */}
        <text x="30" y="75" fontFamily="'Fredoka One', cursive" fontSize="52" fontWeight="400" fill="#EEEDFE" letterSpacing="0">Math</text>
        <text x="30" y="132" fontFamily="'Fredoka One', cursive" fontSize="52" fontWeight="400" fill="#FAC775" letterSpacing="0">Tooter</text>

        {/* Poop - right side, raised 20px */}
        <ellipse cx="310" cy="128" rx="46" ry="10" fill="#3d1f00" opacity="0.4"/>
        <ellipse cx="310" cy="122" rx="44" ry="16" fill="#5C3317"/>
        <ellipse cx="310" cy="112" rx="36" ry="18" fill="#6B3A1F"/>
        <ellipse cx="310" cy="96" rx="26" ry="18" fill="#7A4428"/>
        <ellipse cx="310" cy="80" rx="18" ry="16" fill="#8B5230"/>
        <path d="M300 70 Q300 54 310 50 Q322 46 324 58 Q326 68 316 70" fill="#9B5E38"/>
        <ellipse cx="312" cy="50" rx="9" ry="9" fill="#9B5E38"/>
        <ellipse cx="308" cy="47" rx="3.5" ry="2.5" fill="#B8724A" opacity="0.6"/>

        {/* Eyes */}
        <ellipse cx="300" cy="106" rx="10" ry="11" fill="white"/>
        <ellipse cx="320" cy="106" rx="10" ry="11" fill="white"/>
        <ellipse cx="301" cy="107" rx="5.5" ry="6.5" fill="#1a0a00"/>
        <ellipse cx="321" cy="107" rx="5.5" ry="6.5" fill="#1a0a00"/>
        <circle cx="303" cy="104" r="1.8" fill="white"/>
        <circle cx="323" cy="104" r="1.8" fill="white"/>

        {/* Smile */}
        <path d="M296 121 Q310 131 324 121" stroke="#3d1f00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M301 123 Q310 129 319 123 Q319 128 310 129 Q301 128 301 123Z" fill="white"/>

        {/* Glasses */}
        <rect x="288" y="99" width="20" height="14" rx="7" fill="none" stroke="#1a0a00" strokeWidth="2.5"/>
        <rect x="311" y="99" width="20" height="14" rx="7" fill="none" stroke="#1a0a00" strokeWidth="2.5"/>
        <line x1="308" y1="106" x2="311" y2="106" stroke="#1a0a00" strokeWidth="2"/>
        <line x1="288" y1="106" x2="281" y2="106" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round"/>
        <line x1="331" y1="106" x2="338" y2="106" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round"/>

        {/* Mortarboard */}
        <rect x="290" y="70" width="40" height="8" rx="4" fill="#1a0a00"/>
        <rect x="282" y="59" width="56" height="13" rx="3" fill="#1a0a00"/>
        <line x1="338" y1="63" x2="344" y2="77" stroke="#FAC775" strokeWidth="2"/>
        <line x1="344" y1="77" x2="340" y2="86" stroke="#FAC775" strokeWidth="2"/>
        <line x1="344" y1="77" x2="344" y2="88" stroke="#FAC775" strokeWidth="2"/>
        <line x1="344" y1="77" x2="348" y2="86" stroke="#FAC775" strokeWidth="2"/>
      </svg>
    </div>
  );
}

// ── Number Selector ───────────────────────────────────────────────────────────
function NumberSelector({ selected, onSelect, isOpen, onToggle }) {
  const label = selected === 'all' ? 'All numbers' : selected ? `${selected}s` : null;

  return (
    <div className={styles.numSelector}>
      {/* Collapsed summary row — only shown after a number is picked */}
      {selected && !isOpen && (
        <div className={styles.selectorCollapsed}>
          <span className={styles.selectorCollapsedLabel}>
            Practicing: <strong>{label}</strong>
          </span>
          <button className={styles.changeBtn} onClick={onToggle}>
            Change
          </button>
        </div>
      )}

      {/* Full grid — shown when open or nothing selected yet */}
      {isOpen && (
        <>
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
        </>
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
const CORRECT_EMOJIS = ['💨','🤣','💨','🌬️','😄','🎉','💨','👏','💩'];
const WRONG_EMOJIS   = ['💀','❌','😬','🙈',,'😅','🤔'];

export default function App() {
  const [selected, setSelected]       = useState(null);
  const [selectorOpen, setSelectorOpen] = useState(true);
  const [question, setQuestion]       = useState(null);
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
    setSelectorOpen(false);
    setScore({ correct: 0, total: 0, streak: 0 });
    streakRef.current = 0;
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
        <NumberSelector selected={selected} onSelect={handleSelectNum} isOpen={selectorOpen} onToggle={() => setSelectorOpen(o => !o)} />

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
