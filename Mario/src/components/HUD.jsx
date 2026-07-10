// HUD.jsx
// Displays score, coins, lives, health hearts, timer, and a dynamic boss health bar.
// Uses clean, responsive styling for a premium 8-bit overlay look.
import React from 'react';

const HUD = ({
  score = 0,
  coins = 0,
  lives = 3,
  health = 3,
  maxHealth = 5,
  timeLeft = 300,
  levelName = "World 1-1",
  bossActive = false,
  bossHp = 5,
  bossMaxHp = 5
}) => {
  // Pad score with leading zeros (6 digits)
  const formatScore = (num) => String(num).padStart(6, '0');

  // Pad coins (2 digits) and timer (3 digits)
  const formatCoins = (num) => String(num).padStart(2, '0');
  const formatTime = (num) => String(num).padStart(3, '0');

  // Render heart icons for health
  const renderHearts = () => {
    const hearts = [];
    for (let i = 1; i <= maxHealth; i++) {
      if (i <= health) {
        hearts.push(
          <span key={i} className="hud-heart active animate-heart">
            ❤️
          </span>
        );
      } else {
        hearts.push(
          <span key={i} className="hud-heart empty">
            🖤
          </span>
        );
      }
    }
    return hearts;
  };

  return (
    <div className="hud-overlay">
      {/* Top row stats */}
      <div className="hud-stats-row">
        {/* Score Column */}
        <div className="hud-column">
          <div className="hud-label">MARIO</div>
          <div className="hud-value neon-glow">{formatScore(score)}</div>
        </div>

        {/* Coins Column */}
        <div className="hud-column coin-col">
          <div className="hud-label">COINS</div>
          <div className="hud-value coin-value">
            <span className="spinning-coin-icon">🪙</span> x{formatCoins(coins)}
          </div>
        </div>

        {/* Lives Column */}
        <div className="hud-column">
          <div className="hud-label">LIVES</div>
          <div className="hud-value">🚹 x{lives}</div>
        </div>

        {/* Health Column */}
        <div className="hud-column hp-col">
          <div className="hud-label">HEALTH</div>
          <div className="hud-value-hearts">{renderHearts()}</div>
        </div>

        {/* Timer Column */}
        <div className="hud-column">
          <div className="hud-label">TIME</div>
          <div className="hud-value timer-val text-red">{formatTime(timeLeft)}</div>
        </div>
      </div>

      {/* Middle row: Active Level Name */}
      <div className="hud-level-indicator">
        <span className="level-badge">{levelName}</span>
      </div>

      {/* Bottom row: Dynamic Boss Health Bar Overlay */}
      {bossActive && (
        <div className="hud-boss-bar-container animate-boss-entry">
          <div className="hud-boss-label">🔥 BOWSER THE KEEP BOSS 🔥</div>
          <div className="hud-boss-progress-outer">
            <div 
              className="hud-boss-progress-inner"
              style={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
            />
          </div>
          <div className="hud-boss-hp-text">{bossHp} / {bossMaxHp} HP</div>
        </div>
      )}
    </div>
  );
};

export default HUD;
