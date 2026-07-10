// LevelSelect.jsx
// Displays a grid of 30 levels. Unlocked stages can be clicked to play. Locked stages show padlock icons.
import React from 'react';
import SoundSynth from '../game/utils/SoundSynth';
import { levelConfigs } from '../game/levels/levelConfigs';

const LevelSelect = ({
  onSelectLevel,
  onBackToMenu,
  maxUnlockedLevel = 1
}) => {

  const handleLevelClick = (levelId) => {
    if (levelId <= maxUnlockedLevel) {
      SoundSynth.playTone(523.25, 'square', 0.12, 0, 0.15); // play confirm tone
      onSelectLevel(levelId);
    } else {
      SoundSynth.playTone(150, 'sawtooth', 0.25, 0, 0.2); // play error/buzz tone
    }
  };

  const handleBackClick = () => {
    SoundSynth.playTone(392, 'square', 0.1, 0, 0.1);
    onBackToMenu();
  };

  return (
    <div className="menu-container level-select-bg">
      <div className="level-select-content">
        <h2 className="menu-header text-yellow select-title">SELECT STAGE</h2>
        
        {/* Progress Tracker */}
        <div className="progress-tracker">
          PROGRESS: <span className="text-yellow">{maxUnlockedLevel} / 30</span> STAGES COMPLETED
        </div>

        {/* 30 levels grid layout */}
        <div className="levels-grid">
          {levelConfigs.map(lvl => {
            const isUnlocked = lvl.id <= maxUnlockedLevel;
            // Determine theme prefix styling
            let themeClass = 'theme-overworld';
            if (lvl.theme === 'underground') themeClass = 'theme-underground';
            if (lvl.theme === 'castle') themeClass = 'theme-castle';

            return (
              <button
                key={lvl.id}
                className={`level-card ${themeClass} ${isUnlocked ? 'unlocked animate-card-hover' : 'locked'}`}
                onClick={() => handleLevelClick(lvl.id)}
                title={isUnlocked ? lvl.name : 'Stage Locked'}
              >
                <div className="level-num">{lvl.id}</div>
                <div className="level-status-icon">
                  {isUnlocked ? '▶' : '🔒'}
                </div>
                {isUnlocked && <div className="level-card-name">{lvl.name.split(': ')[1]}</div>}
              </button>
            );
          })}
        </div>

        <button 
          className="btn-retro back-btn select-back"
          onClick={handleBackClick}
        >
          RETURN TO MAIN MENU
        </button>
      </div>
    </div>
  );
};

export default LevelSelect;
