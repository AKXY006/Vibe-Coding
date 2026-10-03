// GameContainer.jsx
// Mounts the Phaser canvas, handles resizing/styling, and sets up window-level event listeners for Escape/Pause,
// and listens to Phaser's EventBus to update React state.
import React, { useEffect, useRef } from 'react';
import { StartGame } from '../game/PhaserGame';
import { EventBus } from '../game/EventBus';
import SoundSynth from '../game/utils/SoundSynth';

const GameContainer = ({
  level = 1,
  onPauseToggle,
  onPlayerDied,
  onLevelCompleted,
  onAddScore,
  onAddCoins,
  onAddLives,
  onAddHealth,
  onUpdateTimer,
  onBossSpawned,
  onBossHit,
  onBossDefeated
}) => {
  const gameRef = useRef(null);
  const handlersRef = useRef({});

  // Keep references to current callbacks updated on every render
  handlersRef.current = {
    onPauseToggle,
    onPlayerDied,
    onLevelCompleted,
    onAddScore,
    onAddCoins,
    onAddLives,
    onAddHealth,
    onUpdateTimer,
    onBossSpawned,
    onBossHit,
    onBossDefeated
  };

  useEffect(() => {
    // 1. Initialize Phaser Game instance
    const game = StartGame('game-canvas-parent');
    gameRef.current = game;
    window.game = game;

    // Wait for the Phaser canvas to load and then start the level
    game.events.once('ready', () => {
      // Trigger level start
      SoundSynth.init(); // Initialize audio context on player action
    });

    // 2. Setup EventBus listeners using wrapper handlers referencing the mutable ref
    const addScoreHandler = (val) => handlersRef.current.onAddScore?.(val);
    const addCoinsHandler = (val) => handlersRef.current.onAddCoins?.(val);
    const addLivesHandler = (val) => handlersRef.current.onAddLives?.(val);
    const addHealthHandler = (val) => handlersRef.current.onAddHealth?.(val);
    const updateTimerHandler = (val) => handlersRef.current.onUpdateTimer?.(val);
    const playerDiedHandler = () => handlersRef.current.onPlayerDied?.();
    const levelCompletedHandler = (data) => handlersRef.current.onLevelCompleted?.(data);
    const bossSpawnedHandler = (data) => handlersRef.current.onBossSpawned?.(data);
    const bossHitHandler = (data) => handlersRef.current.onBossHit?.(data);
    const bossDefeatedHandler = () => handlersRef.current.onBossDefeated?.();

    EventBus.on('add-score', addScoreHandler);
    EventBus.on('add-coins', addCoinsHandler);
    EventBus.on('add-lives', addLivesHandler);
    EventBus.on('add-health', addHealthHandler);
    EventBus.on('update-timer', updateTimerHandler);
    EventBus.on('player-died', playerDiedHandler);
    EventBus.on('level-completed', levelCompletedHandler);
    EventBus.on('boss-spawned', bossSpawnedHandler);
    EventBus.on('boss-hit', bossHitHandler);
    EventBus.on('boss-defeated', bossDefeatedHandler);

    // 3. Listen to keyboard Escape key to toggle pause
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handlersRef.current.onPauseToggle?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 4. Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      EventBus.off('add-score', addScoreHandler);
      EventBus.off('add-coins', addCoinsHandler);
      EventBus.off('add-lives', addLivesHandler);
      EventBus.off('add-health', addHealthHandler);
      EventBus.off('update-timer', updateTimerHandler);
      EventBus.off('player-died', playerDiedHandler);
      EventBus.off('level-completed', levelCompletedHandler);
      EventBus.off('boss-spawned', bossSpawnedHandler);
      EventBus.off('boss-hit', bossHitHandler);
      EventBus.off('boss-defeated', bossDefeatedHandler);

      window.game = null;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []); // Run only once on mount

  // Handle level updates by restarting the active Phaser scene instead of recreating the game instance
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.registry.set('startLevel', level);
      const gameScene = gameRef.current.scene.getScene('GameScene');
      if (gameScene && gameRef.current.scene.isActive('GameScene')) {
        gameScene.scene.restart({ level });
      }
    }
  }, [level]);

  return (
    <div className="game-layout">
      {/* Phaser Canvas will inject here */}
      <div id="game-canvas-parent" className="game-canvas-wrapper" />
    </div>
  );
};

export default GameContainer;
