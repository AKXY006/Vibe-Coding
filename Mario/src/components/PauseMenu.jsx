// PauseMenu.jsx
// Rendered overlay during gameplay pauses, managing resume, retry, and main menu redirects.
import React from 'react';
import SoundSynth from '../game/utils/SoundSynth';

const PauseMenu = ({
  onResume,
  onRestart,
  onBackToMenu
}) => {

  const handleAction = (callback) => {
    SoundSynth.playTone(523.25, 'square', 0.1, 0, 0.1);
    callback();
  };

  return (
    <div className="overlay-wrapper">
      <div className="retro-box pause-box animate-modal-slide">
        <h2 className="overlay-header text-yellow animate-flash-text">
          GAME PAUSED
        </h2>

        <div className="overlay-options">
          <button 
            className="btn-retro play-btn"
            onClick={() => handleAction(onResume)}
          >
            RESUME ADVENTURE
          </button>

          <button 
            className="btn-retro select-btn"
            onClick={() => handleAction(onRestart)}
          >
            RESTART STAGE
          </button>

          <button 
            className="btn-retro back-btn"
            onClick={() => handleAction(onBackToMenu)}
          >
            QUIT TO MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
