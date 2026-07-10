// PhaserGame.js
// Handles the configuration and bootstrapping of the Phaser 3 game instance.
import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  parent: 'game-canvas-parent',
  pixelArt: true, // Enables crisp pixel art scale without blur
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false // Toggle to true to see hitboxes and vectors
    }
  },
  scene: [BootScene, GameScene]
};

// Instantiates and boots the game within the parent DOM container
export const StartGame = (parentContainerId) => {
  return new Phaser.Game({
    ...config,
    parent: parentContainerId
  });
};
