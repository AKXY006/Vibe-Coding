// BootScene.js
// Initial Phaser scene that generates the procedural asset textures and registers game animations.
import Phaser from 'phaser';
import AssetGenerator from '../utils/AssetGenerator';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Show a retro styled "LOADING..." text while procedural sheets compile
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const loadingText = this.add.text(width / 2, height / 2 - 20, 'INITIALIZING GAME...', {
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const progressBg = this.add.graphics();
    progressBg.fillStyle(0x222222, 0.8);
    progressBg.fillRect(width / 2 - 60, height / 2 + 5, 120, 10);

    const progressBar = this.add.graphics();
    
    // Simulate a brief loading progress bar for retro arcade aesthetic
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xfcb800, 1);
      progressBar.fillRect(width / 2 - 60, height / 2 + 5, 120 * value, 10);
    });

    this.load.on('complete', () => {
      progressBg.destroy();
      progressBar.destroy();
      loadingText.destroy();
    });
  }

  create() {
    // 1. Generate all original pixel-art canvas textures dynamically
    AssetGenerator.generateAssets(this);

    // 2. Create Phaser Global Animation definitions
    this.createAnimations();

    // 3. Launch the primary Game Scene (default start at Level 1)
    // We pass initial configuration properties in the scene state data
    const startLevel = this.registry.get('startLevel') || 1;
    this.scene.start('GameScene', { level: startLevel });
  }

  createAnimations() {
    // Player Animations
    this.anims.create({
      key: 'player-idle',
      frames: [{ key: 'player', frame: 0 }]
    });

    this.anims.create({
      key: 'player-walk',
      frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'player-jump',
      frames: [{ key: 'player', frame: 3 }]
    });

    // Enemy Animations
    this.anims.create({
      key: 'goomba-walk',
      frames: this.anims.generateFrameNumbers('enemies', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'paratroopa-fly',
      frames: this.anims.generateFrameNumbers('enemies', { start: 2, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    // Boss Bowser Walk Cycle (using frames 0 and 1)
    this.anims.create({
      key: 'boss-walk',
      frames: this.anims.generateFrameNumbers('boss', { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1
    });

    // Boss Bowser fire breathing pose (holding frame 2)
    this.anims.create({
      key: 'boss-spit',
      frames: [{ key: 'boss', frame: 2 }]
    });

    // Spinning coin animation
    this.anims.create({
      key: 'coin-spin',
      frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
  }
}
