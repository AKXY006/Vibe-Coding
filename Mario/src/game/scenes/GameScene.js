// GameScene.js
// Governs the main game loop, Arcade Physics collisions, entity interactions, particles, and timers.
import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemy from '../entities/Enemy';
import MovingPlatform from '../entities/MovingPlatform';
import PowerUp from '../entities/PowerUp';
import SoundSynth from '../utils/SoundSynth';
import LevelGenerator from '../utils/LevelGenerator';
import { levelConfigs } from '../levels/levelConfigs';
import { EventBus } from '../EventBus';

// Global checkpoint cache (persists between scene restarts)
let globalCheckpoint = {
  level: null,
  x: null,
  y: null
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.currentLevel = data.level || 1;
    this.levelConfig = levelConfigs[this.currentLevel - 1];

    // HUD initial stats
    this.timeLeft = 300;
    this.timerEvent = null;
    this.isPaused = false;
  }

  create() {
    SoundSynth.stopBGM();

    // 1. Build layout, ground layers, and static physics groups
    const { map, groundLayer } = LevelGenerator.createLevel(this, this.levelConfig);
    this.map = map;
    this.groundLayer = groundLayer;

    // Set background color
    this.cameras.main.setBackgroundColor(this.levelConfig.bg);

    // Set camera limits
    this.physics.world.setBounds(0, 0, this.levelConfig.width * 32, this.levelConfig.height * 32);
    this.cameras.main.setBounds(0, 0, this.levelConfig.width * 32, this.levelConfig.height * 32);

    // 2. Instantiate Player (Spawn at checkpoint if cached, else start of level)
    let spawnX = 80;
    let spawnY = 300;
    if (globalCheckpoint.level === this.currentLevel && globalCheckpoint.x !== null) {
      spawnX = globalCheckpoint.x;
      spawnY = globalCheckpoint.y;
    }
    this.player = new Player(this, spawnX, spawnY);

    // Camera follow player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1, -80, 80);

    // 3. Setup Groups for Entities
    this.enemiesGroup = this.physics.add.group({ runChildUpdate: true });
    this.fireballsGroup = this.physics.add.group({ runChildUpdate: true });
    this.movingPlatformsGroup = this.physics.add.group({ runChildUpdate: true });
    this.itemsGroup = this.physics.add.group({ runChildUpdate: true });

    // Spawn level enemies
    this.levelConfig.enemies.forEach(enemyConfig => {
      const enemy = new Enemy(this, enemyConfig.x * 32 + 16, enemyConfig.y * 32 + 16, enemyConfig.type);
      this.enemiesGroup.add(enemy);
    });

    // Spawn moving platforms
    this.levelConfig.movingPlatforms.forEach(platConfig => {
      const platform = new MovingPlatform(this, platConfig.x * 32 + 48, platConfig.y * 32 + 16, platConfig);
      this.movingPlatformsGroup.add(platform);
    });

    // Setup active level-wide static coins (spawning on empty areas or platforms)
    for (let x = 12; x < this.levelConfig.width - 20; x += 10) {
      // If there is solid ground and it's not a hole, add a floating coin
      const isHole = this.levelConfig.holes.some(h => x >= h.xStart && x < h.xStart + h.width);
      if (!isHole && x % 3 === 0) {
        const coin = new PowerUp(this, x * 32 + 16, 8 * 32, 'coin', true);
        this.coinsGroup.add(coin);
      }
    }

    // 4. Set Physics Colliders and Overlaps
    // Player and Environment
    this.physics.add.collider(this.player, this.groundLayer);
    this.physics.add.collider(this.player, this.bricksGroup, this.handlePlayerBrickCollision, null, this);
    this.physics.add.collider(this.player, this.qBlocksGroup, this.handlePlayerBrickCollision, null, this);
    this.physics.add.collider(this.player, this.movingPlatformsGroup); // player rides platforms

    // Enemies and Environment
    this.physics.add.collider(this.enemiesGroup, this.groundLayer);
    this.physics.add.collider(this.enemiesGroup, this.bricksGroup);
    this.physics.add.collider(this.enemiesGroup, this.qBlocksGroup);
    this.physics.add.collider(this.enemiesGroup, this.movingPlatformsGroup);
    
    // Enemy patrolling bounces off each other
    this.physics.add.collider(this.enemiesGroup, this.enemiesGroup, (enemy1, enemy2) => {
      if (enemy1.enemyType !== 'boss' && enemy2.enemyType !== 'boss') {
        enemy1.setVelocityX(-enemy1.body.velocity.x);
        enemy2.setVelocityX(-enemy2.body.velocity.x);
      }
    });

    // Power-ups and Environment
    this.physics.add.collider(this.itemsGroup, this.groundLayer);
    this.physics.add.collider(this.itemsGroup, this.bricksGroup);
    this.physics.add.collider(this.itemsGroup, this.qBlocksGroup);

    // Player Overlaps
    this.physics.add.overlap(this.player, this.coinsGroup, this.collectStaticCoin, null, this);
    this.physics.add.overlap(this.player, this.itemsGroup, this.collectPowerUp, null, this);
    this.physics.add.overlap(this.player, this.enemiesGroup, this.handlePlayerEnemyCollision, null, this);
    this.physics.add.overlap(this.player, this.spikesGroup, this.handlePlayerSpikeCollision, null, this);
    this.physics.add.overlap(this.player, this.fireballsGroup, this.handlePlayerFireballCollision, null, this);
    this.physics.add.overlap(this.player, this.checkpointsGroup, this.handleCheckpointOverlap, null, this);
    
    // Victory flag overlap
    this.physics.add.overlap(this.player, this.victoryTarget, this.handleVictoryOverlap, null, this);

    // 5. Timer HUD Events
    this.timeLeft = 300;
    EventBus.emit('update-timer', this.timeLeft);
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.tickTimer,
      callbackScope: this,
      loop: true
    });

    // 6. Audio start
    SoundSynth.startBGM(this.levelConfig.music);

    // 7. Event Bus Listeners for UI commands
    EventBus.on('pause-game', this.pauseGame, this);
    EventBus.on('resume-game', this.resumeGame, this);
    EventBus.on('restart-level', this.restartLevel, this);

    // Clean up listeners on scene shutdown
    this.events.once('shutdown', () => {
      EventBus.off('pause-game', this.pauseGame, this);
      EventBus.off('resume-game', this.resumeGame, this);
      EventBus.off('restart-level', this.restartLevel, this);
      if (this.timerEvent) this.timerEvent.destroy();
    });
  }

  update(time, delta) {
    if (this.isPaused) return;

    this.player.update();
    
    // Update active entities in groups
    this.enemiesGroup.getChildren().forEach(enemy => enemy.update(time, delta));
    this.itemsGroup.getChildren().forEach(item => item.update(time, delta));

    // Destroy fireballs that go off-screen
    this.fireballsGroup.getChildren().forEach(fire => {
      if (fire.x < this.cameras.main.scrollX - 32 || fire.x > this.cameras.main.scrollX + 352) {
        fire.destroy();
      }
    });
  }

  // --- COLLISION HANDLERS ---

  handlePlayerBrickCollision(player, block) {
    // Check if player hit the block from below
    const hitFromBelow = player.body.blocked.up || player.body.touching.up;
    const blockHitAlready = block.getData('hit');

    if (hitFromBelow && !blockHitAlready) {
      block.setData('hit', true);

      // Play block bounce tween
      const originalY = block.y;
      this.tweens.add({
        targets: block,
        y: originalY - 12,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          if (this.qBlocksGroup.contains(block)) {
            // Question block turns into empty block index 3
            block.setFrame(3);
          }
        }
      });

      // Spawn items stored inside
      const itemType = block.getData('item');
      if (itemType !== 'none') {
        const itemX = block.x;
        const itemY = block.y - 16;

        if (itemType === 'coin') {
          // Coins bounce and self destruct instantly
          new PowerUp(this, itemX, itemY, 'coin', false);
        } else {
          // Mushrooms, Stars, and Lives emerge as sliding physics entities
          const powerUp = new PowerUp(this, itemX, itemY, itemType, false);
          this.itemsGroup.add(powerUp);
        }
      } else {
        // Normal empty brick can break into debris particles if player is big!
        if (player.isBig && this.bricksGroup.contains(block)) {
          SoundSynth.playEnemyDefeat();
          this.createBrickDebris(block.x, block.y);
          block.destroy();
          return;
        } else {
          SoundSynth.playTone(150, 'square', 0.1, 0, 0.15); // tiny bump sound
        }
      }
    }
  }

  handlePlayerEnemyCollision(player, enemy) {
    if (enemy.isDead || player.isDead) return;

    // Check if player jumped on enemy head (falling downwards onto enemy)
    const fallingOnEnemy = player.body.velocity.y > 0 && (player.body.bottom <= enemy.body.top + 12);

    if (fallingOnEnemy) {
      // Bounce player back up
      player.setVelocityY(-350);
      
      if (enemy.enemyType === 'boss') {
        enemy.hitBoss();
      } else {
        enemy.squish();
      }
    } else {
      // Collision from side - player takes damage or kills enemy if invincible
      if (player.isInvincible) {
        if (enemy.enemyType === 'boss') {
          enemy.hitBoss();
        } else {
          enemy.squish();
        }
      } else {
        player.takeDamage();
      }
    }
  }

  handlePlayerSpikeCollision(player, spike) {
    player.takeDamage();
  }

  handlePlayerFireballCollision(player, fireball) {
    fireball.destroy();
    player.takeDamage();
  }

  collectStaticCoin(player, coin) {
    coin.collect(player);
  }

  collectPowerUp(player, powerUp) {
    powerUp.collect(player);
  }

  handleCheckpointOverlap(player, flag) {
    const isActivated = flag.getData('activated');
    if (!isActivated) {
      flag.setData('activated', true);
      flag.setFrame(1); // Set to Green Flag checked

      // Cache checkpoint coordinates
      globalCheckpoint.level = this.currentLevel;
      globalCheckpoint.x = flag.x;
      globalCheckpoint.y = flag.y;

      SoundSynth.playPowerUp();
      this.createFloatingText(flag.x, flag.y - 12, "CHECKPOINT!", "#ffff00");
    }
  }

  handleVictoryOverlap(player, target) {
    if (player.isDead) return;

    // Wait! If level 30 boss is alive, victory is locked!
    if (this.currentLevel === 30) {
      const boss = this.enemiesGroup.getChildren().find(e => e.enemyType === 'boss');
      if (boss && !boss.isDead) return; // Wait until boss is squished!
    }

    // Trigger victory flow
    player.setVelocity(0, 0);
    player.body.setEnable(false);
    this.physics.pause(); // Freeze all physics entities (enemies, platforms) on victory
    
    SoundSynth.playVictory();
    if (this.timerEvent) this.timerEvent.destroy();

    // Clear checkpoints
    globalCheckpoint = { level: null, x: null, y: null };

    // Trigger victory fanfare animation and notify react UI
    this.tweens.add({
      targets: player,
      alpha: 0,
      duration: 600,
      onComplete: () => {
        EventBus.emit('level-completed', {
          level: this.currentLevel,
          timeLeft: this.timeLeft,
          scoreEarned: this.timeLeft * 10
        });
      }
    });
  }

  // --- ENGINE CONTROLS ---

  tickTimer() {
    if (this.isPaused) return;

    this.timeLeft--;
    EventBus.emit('update-timer', this.timeLeft);

    if (this.timeLeft <= 0) {
      if (this.timerEvent) this.timerEvent.destroy();
      this.player.die();
    }
  }

  pauseGame() {
    this.isPaused = true;
    this.physics.pause();
    this.anims.pauseAll();
    SoundSynth.stopBGM();
  }

  resumeGame() {
    this.isPaused = false;
    this.physics.resume();
    this.anims.resumeAll();
    SoundSynth.startBGM(this.levelConfig.music);
  }

  restartLevel() {
    if (this.timerEvent) this.timerEvent.destroy();
    this.scene.restart({ level: this.currentLevel });
  }

  // --- PARTICLE SCENERY GENERATION ---

  createJumpSmoke(x, y) {
    const smoke = this.add.graphics();
    smoke.fillStyle(0xffffff, 0.6);
    smoke.fillCircle(x, y, 4);
    this.tweens.add({
      targets: smoke,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 200,
      onComplete: () => smoke.destroy()
    });
  }

  createCoinSparkle(x, y) {
    const sparkles = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const sp = this.add.graphics();
      sp.fillStyle(0xfce478, 1);
      sp.fillRect(x + Math.cos(angle) * 3, y + Math.sin(angle) * 3, 2, 2);
      
      this.tweens.add({
        targets: sp,
        x: Math.cos(angle) * 8,
        y: Math.sin(angle) * 8,
        alpha: 0,
        duration: 250,
        onComplete: () => sp.destroy()
      });
    }
  }

  createBrickDebris(x, y) {
    // Spawns 4 moving brick shards expanding outward
    for (let i = 0; i < 4; i++) {
      const shard = this.add.sprite(x, y, 'particles');
      this.physics.add.existing(shard);
      shard.body.setVelocity(
        (i % 2 === 0 ? -240 : 240) * (Math.random() * 0.5 + 0.5),
        (i < 2 ? -500 : -240)
      );
      shard.body.setGravityY(this.levelConfig.gravityY);
      
      // Auto rotate and self-destruct
      this.tweens.add({
        targets: shard,
        angle: 360,
        duration: 800,
        onComplete: () => shard.destroy()
      });
    }
  }

  createFloatingText(x, y, message, color = '#ffffff') {
    const txt = this.add.text(x, y, message, {
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '8px',
      color: color,
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.tweens.add({
      targets: txt,
      y: y - 32,
      alpha: 0,
      duration: 800,
      onComplete: () => txt.destroy()
    });
  }
}
