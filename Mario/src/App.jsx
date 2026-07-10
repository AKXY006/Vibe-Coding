// App.jsx
// Core orchestrator managing the screens (Start, LevelSelect, Settings, Game), high scores,
// level locking progression, and game state (health, lives, scores).
import React, { useState, useEffect } from 'react';
import StartMenu from './components/StartMenu';
import LevelSelect from './components/LevelSelect';
import Settings from './components/Settings';
import HUD from './components/HUD';
import GameContainer from './components/GameContainer';
import PauseMenu from './components/PauseMenu';
import GameOver from './components/GameOver';
import Victory from './components/Victory';
import { EventBus } from './game/EventBus';
import { levelConfigs } from './game/levels/levelConfigs';
import SoundSynth from './game/utils/SoundSynth';

const App = () => {
  // Screen Router: 'menu' | 'levelSelect' | 'settings' | 'game'
  const [screen, setScreen] = useState('menu');

  // persistent game states
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [health, setHealth] = useState(3);
  const [timeLeft, setTimeLeft] = useState(300);

  // levels tracking
  const [currentLevel, setCurrentLevel] = useState(1);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);

  // game overlays states
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [victoryStats, setVictoryStats] = useState({ timeLeft: 300, scoreEarned: 0 });

  // boss state tracker
  const [bossActive, setBossActive] = useState(false);
  const [bossHp, setBossHp] = useState(5);
  const [bossMaxHp, setBossMaxHp] = useState(5);

  // Load highscore and unlocked progress from LocalStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('retro_mario_highscore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));

    const savedProgress = localStorage.getItem('retro_mario_progress');
    if (savedProgress) setMaxUnlockedLevel(parseInt(savedProgress, 10));
  }, []);

  // --- ACTIONS ---

  const handleStartGame = () => {
    // Reset stats for a fresh gameplay run
    setScore(0);
    setCoins(0);
    setLives(3);
    setHealth(3);
    setTimeLeft(300);
    setIsGameOver(false);
    setIsVictory(false);
    setIsPaused(false);
    setBossActive(false);

    setCurrentLevel(1);
    setScreen('game');
  };

  const handleSelectLevel = (levelId) => {
    setScore(0);
    setCoins(0);
    setLives(3);
    setHealth(3);
    setTimeLeft(300);
    setIsGameOver(false);
    setIsVictory(false);
    setIsPaused(false);
    setBossActive(false);

    setCurrentLevel(levelId);
    setScreen('game');
  };

  const handleNextLevel = () => {
    setIsVictory(false);
    setIsPaused(false);
    setBossActive(false);

    // Carry over stats (except timer) to next level!
    setHealth(Math.min(health + 1, 5)); // Reward +1 HP for clear
    setTimeLeft(300);

    const nextLvl = currentLevel + 1;
    if (nextLvl <= 30) {
      setCurrentLevel(nextLvl);
      setScreen('game');
    } else {
      setScreen('menu'); // All cleared
    }
  };

  const handlePauseToggle = () => {
    if (isGameOver || isVictory) return;
    
    const nextPauseState = !isPaused;
    setIsPaused(nextPauseState);

    if (nextPauseState) {
      EventBus.emit('pause-game');
    } else {
      EventBus.emit('resume-game');
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    EventBus.emit('resume-game');
  };

  const handleRestart = () => {
    setIsPaused(false);
    setIsGameOver(false);
    setIsVictory(false);
    setBossActive(false);

    // Reset health & timer
    setHealth(3);
    setTimeLeft(300);

    EventBus.emit('restart-level');
  };

  const handleTryAgain = () => {
    // Reset stats for restart
    setScore(0);
    setCoins(0);
    setLives(3);
    setHealth(3);
    setTimeLeft(300);
    setIsGameOver(false);
    setIsVictory(false);
    setIsPaused(false);
    setBossActive(false);
    
    setScreen('game');
  };

  const handleBackToMenu = () => {
    SoundSynth.stopBGM();
    setIsPaused(false);
    setIsGameOver(false);
    setIsVictory(false);
    setBossActive(false);
    setScreen('menu');
  };

  // --- PHASER EVENT BUS HANDLERS ---

  const handlePlayerDied = () => {
    // Deduct life
    const nextLives = lives - 1;
    setLives(nextLives);
    setHealth(3); // Reset health points

    if (nextLives <= 0) {
      // Game Over state triggered
      setIsGameOver(true);
    } else {
      // Respawn: Restart the active level
      SoundSynth.playTone(180, 'sawtooth', 0.5, 0, 0.3); // Spawn alert tone
      EventBus.emit('restart-level');
    }
  };

  const handleLevelCompleted = (data) => {
    const totalCurrentScore = score + data.scoreEarned;

    // Check High Score
    if (totalCurrentScore > highScore) {
      setHighScore(totalCurrentScore);
      localStorage.setItem('retro_mario_highscore', String(totalCurrentScore));
    }

    // Check Level Progression
    const nextMax = Math.max(maxUnlockedLevel, data.level + 1);
    // Limit progress capped at level 30
    const finalMax = Math.min(nextMax, 30);
    setMaxUnlockedLevel(finalMax);
    localStorage.setItem('retro_mario_progress', String(finalMax));

    setVictoryStats({
      timeLeft: data.timeLeft,
      scoreEarned: data.scoreEarned
    });
    setIsVictory(true);
  };

  const addHealth = (val) => {
    setHealth(prev => {
      const nextHp = prev + val;
      return Math.max(0, Math.min(nextHp, 5));
    });
  };

  const activeLevelConfig = levelConfigs[currentLevel - 1] || levelConfigs[0];

  return (
    <div className="app-viewport">
      {/* 1. START MENU */}
      {screen === 'menu' && (
        <StartMenu 
          onStartGame={handleStartGame}
          onOpenLevelSelect={() => setScreen('levelSelect')}
          onOpenSettings={() => setScreen('settings')}
          highScore={highScore}
        />
      )}

      {/* 2. LEVEL SELECT */}
      {screen === 'levelSelect' && (
        <LevelSelect 
          onSelectLevel={handleSelectLevel}
          onBackToMenu={() => setScreen('menu')}
          maxUnlockedLevel={maxUnlockedLevel}
        />
      )}

      {/* 3. SETTINGS */}
      {screen === 'settings' && (
        <Settings 
          onBackToMenu={() => setScreen('menu')}
        />
      )}

      {/* 4. GAME CANVAS SCENE */}
      {screen === 'game' && (
        <div className="game-screen-wrapper">
          {/* React Overlaid HUD */}
          <HUD 
            score={score}
            coins={coins}
            lives={lives}
            health={health}
            maxHealth={5}
            timeLeft={timeLeft}
            levelName={activeLevelConfig.name}
            bossActive={bossActive}
            bossHp={bossHp}
            bossMaxHp={bossMaxHp}
          />

          {/* Phaser Container */}
          <GameContainer 
            level={currentLevel}
            onPauseToggle={handlePauseToggle}
            onPlayerDied={handlePlayerDied}
            onLevelCompleted={handleLevelCompleted}
            onAddScore={(val) => setScore(s => s + val)}
            onAddCoins={(val) => setCoins(c => c + val)}
            onAddLives={(val) => setLives(l => l + val)}
            onAddHealth={addHealth}
            onUpdateTimer={setTimeLeft}
            onBossSpawned={({ hp, maxHp }) => {
              setBossHp(hp);
              setBossMaxHp(maxHp);
              setBossActive(true);
            }}
            onBossHit={({ hp }) => setBossHp(hp)}
            onBossDefeated={() => setBossActive(false)}
          />

          {/* Active Overlays */}
          {isPaused && (
            <PauseMenu 
              onResume={handleResume}
              onRestart={handleRestart}
              onBackToMenu={handleBackToMenu}
            />
          )}

          {isGameOver && (
            <GameOver 
              score={score}
              levelNum={currentLevel}
              onTryAgain={handleTryAgain}
              onBackToMenu={handleBackToMenu}
            />
          )}

          {isVictory && (
            <Victory 
              score={score}
              levelNum={currentLevel}
              timeLeft={victoryStats.timeLeft}
              scoreEarned={victoryStats.scoreEarned}
              onNextLevel={handleNextLevel}
              onBackToMenu={handleBackToMenu}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
