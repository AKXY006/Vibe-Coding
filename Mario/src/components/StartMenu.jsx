// StartMenu.jsx
// Renders the main landing page, retro graphics banner, option nodes, and controller map guides.
import React from 'react';
import SoundSynth from '../game/utils/SoundSynth';

const StartMenu = ({
  onStartGame,
  onOpenLevelSelect,
  onOpenSettings,
  highScore = 0
}) => {

  const handleMouseEnter = () => {
    // Play a quiet coin chime on hover for premium micro-animations
    SoundSynth.playTone(987.77, 'sine', 0.08, 0, 0.05);
  };

  const handleClick = (action) => {
    SoundSynth.playTone(1318.51, 'square', 0.15, 0, 0.1);
    action();
  };

  return (
    <div className="menu-container start-menu-bg">
      {/* Parallax Clouds Effect */}
      <div className="cloud-scenery">
        <div className="scenic-cloud cloud-1"></div>
        <div className="scenic-cloud cloud-2"></div>
        <div className="scenic-cloud cloud-3"></div>
      </div>

      <div className="start-menu-content">
        {/* Retro Game Title Header */}
        <h1 className="game-title animate-pulse-title">
          SUPER MARIO
          <span className="subtitle">RETRO PLATFORMER</span>
        </h1>

        {/* High Score Panel */}
        <div className="highscore-panel">
          🏆 TOP SCORE: <span className="score-gold">{String(highScore).padStart(6, '0')}</span>
        </div>

        {/* Main Options Menu */}
        <div className="menu-options">
          <button 
            className="btn-retro play-btn"
            onMouseEnter={handleMouseEnter}
            onClick={() => handleClick(onStartGame)}
          >
            START ADVENTURE
          </button>
          
          <button 
            className="btn-retro select-btn"
            onMouseEnter={handleMouseEnter}
            onClick={() => handleClick(onOpenLevelSelect)}
          >
            LEVEL SELECT (1 - 30)
          </button>

          <button 
            className="btn-retro settings-btn"
            onMouseEnter={handleMouseEnter}
            onClick={() => handleClick(onOpenSettings)}
          >
            AUDIO SETTINGS
          </button>
        </div>

        {/* Retro Controllers Instruction Guide */}
        <div className="controls-guide">
          <div className="guide-title">🎮 CONTROLLER GUIDE</div>
          <div className="guide-grid">
            <div className="guide-row">
              <span className="key-badge">A</span> / <span className="key-badge">D</span> or <span className="key-badge">◀</span> / <span className="key-badge">▶</span>
              <span className="action-text">Run Left & Right</span>
            </div>
            <div className="guide-row">
              <span className="key-badge">SPACE</span> or <span className="key-badge">W</span> / <span className="key-badge">▲</span>
              <span className="action-text">Jump / Double Jump</span>
            </div>
            <div className="guide-row">
              <span className="key-badge">ESC</span>
              <span className="action-text">Pause / Resume Game</span>
            </div>
          </div>
        </div>

        <div className="copyright-info">
          © 2026 ANTIGRAVITY ENGINE. BUILT WITH PHASER 3 & REACT.
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
