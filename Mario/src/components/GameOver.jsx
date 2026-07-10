// GameOver.jsx
// Displays game over screens, final score statistics, and options to restart or return.
import React, { useEffect } from 'react';
import SoundSynth from '../game/utils/SoundSynth';

const GameOver = ({
  score = 0,
  levelNum = 1,
  onTryAgain,
  onBackToMenu
}) => {

  useEffect(() => {
    // Play the sad descending 8-bit game over theme on mount
    SoundSynth.playGameOver();
  }, []);

  const handleAction = (callback) => {
    SoundSynth.playTone(523.25, 'square', 0.1, 0, 0.1);
    callback();
  };

  return (
    <div className="overlay-wrapper game-over-overlay">
      <div className="retro-box game-over-box animate-modal-slide">
        <h2 className="overlay-header text-red animate-shake">
          GAME OVER
        </h2>

        {/* Level and Score report */}
        <div className="stats-report">
          <div className="report-row">
            <span>DIED IN STAGE:</span>
            <span className="value-reported text-yellow">World {Math.ceil(levelNum / 10)}-{(levelNum - 1) % 10 + 1}</span>
          </div>
          <div className="report-row">
            <span>FINAL SCORE:</span>
            <span className="value-reported text-gold">{String(score).padStart(6, '0')}</span>
          </div>
        </div>

        <div className="overlay-options">
          <button 
            className="btn-retro play-btn btn-danger"
            onClick={() => handleAction(onTryAgain)}
          >
            CONTINUE / RETRY
          </button>

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

export default GameOver;
