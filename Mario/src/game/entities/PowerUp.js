// PowerUp.js
// Handles items that pop out of question blocks: Coins, Super Mushrooms, Invincibility Stars, and 1UP extra lives.
import Phaser from 'phaser';
import SoundSynth from '../utils/SoundSynth';
import { EventBus } from '../EventBus';

export default class PowerUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type, isStatic = false) {
    // Select texture sheets and frames based on type
    let texture = 'powerups';
    let frame = 0; // Mushroom frame

    if (type === 'coin') {
      texture = 'coin';
      frame = 0;
    } else if (type === 'star') {
      frame = 1;
    } else if (type === 'life') {
      frame = 2; // Green 1UP Mushroom
    }

    super(scene, x, y, texture, frame);
    this.powerUpType = type; // 'coin' | 'mushroom' | 'star' | 'life'
    this.isStatic = isStatic;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (this.powerUpType === 'coin') {
      this.body.setSize(20, 24).setOffset(6, 4);
      
      if (this.isStatic) {
        // Normal coin floating in the sky
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        // Spin animation loop
        this.play('coin-spin');
      } else {
        // Block-bump coin: immediately trigger bounce animation and self-destruct
        this.body.setEnable(false); // disable collisions
        this.triggerCoinBounce();
      }
    } else {
      // Mushroom, Star, 1UP behaviors
      this.body.setSize(24, 24).setOffset(4, 8);
      
      if (!this.isStatic) {
        // Emerging animation (slides up slowly from inside question block)
        this.body.setEnable(false); // disable physics initially
        this.y += 16; // start slightly lower inside block
        
        scene.tweens.add({
          targets: this,
          y: this.y - 40, // Slide up out of block
          duration: 400,
          onComplete: () => {
            if (this.active) {
               this.body.setEnable(true); // turn on physics
               this.body.setGravityY(scene.levelConfig.gravityY);
               this.setVelocityX(120); // start walking right
            }
          }
        });
      } else {
        this.body.setGravityY(scene.levelConfig.gravityY);
      }
    }
  }

  update(_time) {
    if (!this.active || this.isStatic || this.powerUpType === 'coin') return;

    // --- MUSHROOM & 1UP AI (WALKING & FALLING) ---
    if (this.powerUpType === 'mushroom' || this.powerUpType === 'life') {
      // Bounce off walls
      if (this.body.blocked.left) {
        this.setVelocityX(120);
      } else if (this.body.blocked.right) {
        this.setVelocityX(-120);
      }
    }

    // --- STAR POWERUP AI (BOUNCING EXTRA HIGH) ---
    else if (this.powerUpType === 'star') {
      // Star bouncing effect when hit ground
      if (this.body.blocked.down || this.body.touching.down) {
        this.setVelocityY(-320);
      }
      
      // Bounce off walls
      if (this.body.blocked.left) {
        this.setVelocityX(130);
      } else if (this.body.blocked.right) {
        this.setVelocityX(-130);
      }
    }
  }

  // Visual bounce when coin is ejected from question blocks
  triggerCoinBounce() {
    SoundSynth.playCoin();
    
    // Add score and count coins
    EventBus.emit('add-coins', 1);
    EventBus.emit('add-score', 200);

    // Eject animation
    this.scene.tweens.add({
      targets: this,
      y: this.y - 48,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 180,
      yoyo: true, // drop back down
      hold: 50,
      onComplete: () => {
        // Spawn small flash particle, then destroy
        this.scene.createCoinSparkle(this.x, this.y);
        this.destroy();
      }
    });
  }

  // Handle player overlapping with the active item
  collect(player) {
    if (!this.active) return;

    if (this.powerUpType === 'coin') {
      SoundSynth.playCoin();
      EventBus.emit('add-coins', 1);
      EventBus.emit('add-score', 100);
      this.scene.createCoinSparkle(this.x, this.y);
    } else if (this.powerUpType === 'mushroom') {
      player.grow();
      EventBus.emit('add-score', 1000);
    } else if (this.powerUpType === 'star') {
      player.becomeInvincible(10000); // 10s star power
      EventBus.emit('add-score', 1000);
    } else if (this.powerUpType === 'life') {
      SoundSynth.playPowerUp();
      EventBus.emit('add-lives', 1);
      EventBus.emit('add-score', 1000);
      
      // Show "+1 Life" floating text
      this.scene.createFloatingText(this.x, this.y - 10, "+1 LIFE", "#00ff00");
    }

    this.destroy();
  }
}
