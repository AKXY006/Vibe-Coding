// Victory.jsx
// Displays level completion metrics, score increases, and launches confetti bursts.
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import SoundSynth from '../game/utils/SoundSynth';

const Victory = ({
  score = 0,
  levelNum = 1,
  timeLeft = 300,
  scoreEarned = 0,
  onNextLevel,
  onBackToMenu
}) => {

  useEffect(() => {
    // Launch premium, cascading screen-wide confetti bursts on mount
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#fcb800', '#f87858', '#fcffff', '#00a800']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#fcb800', '#f87858', '#fcffff', '#00a800']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleAction = (callback) => {
    SoundSynth.playTone(523.25, 'square', 0.1, 0, 0.1);
    callback();
  };

  const isFinalLevel = levelNum === 30;

  return (
    <div className="overlay-wrapper victory-overlay">
      <div className="retro-box victory-box animate-modal-slide">
        <h2 className="overlay-header text-yellow animate-flash-text">
          {isFinalLevel ? '★ CHAMPION VICTORIOUS ★' : 'STAGE CLEAR!'}
        </h2>

        {/* Victory metrics */}
        <div className="stats-report">
          <div className="report-row">
            <span>COMPLETED STAGE:</span>
            <span className="value-reported text-yellow">World {Math.ceil(levelNum / 10)}-{(levelNum - 1) % 10 + 1}</span>
          </div>
          <div className="report-row">
            <span>TIME REMAINING:</span>
            <span className="value-reported text-red">{timeLeft} SECONDS</span>
          </div>
          <div className="report-row">
            <span>TIME BONUS SCORE:</span>
            <span className="value-reported text-gold">+{scoreEarned} XP</span>
          </div>
          <div className="report-row total-score-row">
            <span>TOTAL SCORE:</span>
            <span className="value-reported text-gold neon-glow">{String(score + scoreEarned).padStart(6, '0')}</span>
          </div>
        </div>

        <div className="overlay-options">
          {!isFinalLevel ? (
            <button 
              className="btn-retro play-btn btn-success"
              onClick={() => handleAction(onNextLevel)}
            >
              NEXT WORLD STAGE
            </button>
          ) : (
            <div className="champion-congrats">
              🎉 CONGRATULATIONS! YOU SAVED THE RETRO KINGDOM! 🎉
            </div>
          )}

          <button 
            className="btn-retro back-btn"
            onClick={() => handleAction(onBackToMenu)}
          >
            RETURN TO MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};

export default Victory;
