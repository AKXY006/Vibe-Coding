// Settings.jsx
// Controls master volume and mute states using custom retro buttons and sliders.
import React, { useState } from 'react';
import SoundSynth from '../game/utils/SoundSynth';

const Settings = ({ onBackToMenu }) => {
  const [volume, setVolume] = useState(SoundSynth.volumeVal);
  const [muted, setMuted] = useState(SoundSynth.muted);

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    SoundSynth.setVolume(vol);
    // Play a brief test chime on slider adjustment
    SoundSynth.playTone(440, 'sine', 0.05, 0, vol * 0.2);
  };

  const handleToggleMute = () => {
    const nextMute = !muted;
    setMuted(nextMute);
    SoundSynth.setMute(nextMute);
    if (!nextMute) {
      SoundSynth.playTone(523.25, 'sine', 0.08, 0, volume * 0.2);
    }
  };

  const handleBackClick = () => {
    SoundSynth.playTone(392, 'square', 0.1, 0, 0.1);
    onBackToMenu();
  };

  return (
    <div className="menu-container settings-bg">
      <div className="retro-box">
        <h2 className="menu-header text-yellow animate-flash-text">
          AUDIO SETTINGS
        </h2>

        <div className="settings-controls">
          {/* Mute toggle */}
          <div className="control-row">
            <span className="control-label">MASTER MUTE:</span>
            <button 
              className={`btn-retro mute-btn ${muted ? 'btn-danger' : 'btn-success'}`}
              onClick={handleToggleMute}
            >
              {muted ? 'MUTED 🔇' : 'SOUND ON 🔊'}
            </button>
          </div>

          {/* Volume slider */}
          <div className="control-row volume-row">
            <span className="control-label">VOLUME: {Math.round(volume * 100)}%</span>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="retro-slider"
              disabled={muted}
            />
          </div>
        </div>

        {/* Back button */}
        <button 
          className="btn-retro back-btn"
          onClick={handleBackClick}
        >
          RETURN TO MAIN MENU
        </button>
      </div>
    </div>
  );
};

export default Settings;
