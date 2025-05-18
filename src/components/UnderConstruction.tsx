// UnderConstruction.tsx - With Glitch Easter Egg
import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import constructionAnim from '../assets/construction.json';
import './UnderConstruction.css';

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

const facts = [
  "We’re laying the foundation… literally.",
  "Warning: Bricks ahead!",
  "Why did the crane break up? It felt lifted.",
  "Building greatness takes time.",
  "Hard hats, big dreams!"
];

export default function UnderConstruction() {
  const [keys, setKeys] = useState<string[]>([]);
  const [eggUnlocked, setEggUnlocked] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [showMorse, setShowMorse] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFactIndex(i => (i + 1) % facts.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const next = [...keys, e.key].slice(-KONAMI.length);
      setKeys(next);
      if (next.join(',') === KONAMI.join(',')) {
        setEggUnlocked(true);
        setShowOverlay(true);
        setTimeout(() => setShowOverlay(false), 8000);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [keys]);

  return (
    <div className="uc-container">
      <div className="lottie-wrapper" onClick={() => {
        setClicks(c => {
          if (c + 1 >= 10) setShowMorse(true);
          return c + 1;
        });
      }}>
        <Lottie animationData={constructionAnim} loop={true} />
      </div>

      <h1 className="animate-text">🚧 Site Under Construction 🚧</h1>
      <p className="breathe">{facts[factIndex]}</p>

      {showMorse && (
        <div className="morse-code">
          ..- .--. ..- .--. -.. --- .-- -.  .-.. . ..-. -  .-. .. --. .... -
        </div>
      )}

      {showOverlay && (
        <div className="glitch-overlay">
          <div className="glitch-text">SYSTEM REBOOT</div>
          <div className="matrix-bg" />
        </div>
      )}
    </div>
  );
}
