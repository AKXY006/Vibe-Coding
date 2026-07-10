// Player.js
// Handles player physics, controls, animations, power-ups, state transformations, and sounds.
import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import SoundSynth from '../utils/SoundSynth';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player', 0);
    
    // Add to scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics body configuration
    this.body.setGravityY(scene.levelConfig.gravityY);
    this.body.setCollideWorldBounds(true);
    this.body.setSize(24, 44).setOffset(4, 4);

    // Initial state properties
    this.isDead = false;
    this.isInvincible = false;
    this.invincibleTimer = null;
    
    // Health and powerup scaling
    this.isBig = false;
    this.doubleJumpEnabled = true;
    this.jumpCount = 0;

    // Keys setup
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Speed configuration
    this.moveSpeed = 220;
    this.jumpForce = -500;

    // Track active sound
    this.flashToggle = false;
    this.flashEvent = null;
  }

  update() {
    if (this.isDead) return;

    const onGround = this.body.blocked.down || this.body.touching.down;

    // Reset jump counts when on the ground
    if (onGround) {
      this.jumpCount = 0;
    }

    // --- HORIZONTAL MOVEMENT ---
    let movingLeft = this.cursors.left.isDown || this.keyA.isDown;
    let movingRight = this.cursors.right.isDown || this.keyD.isDown;

    if (movingLeft) {
      this.setVelocityX(-this.moveSpeed);
      this.setFlipX(true); // Flip sprite when moving left
      if (onGround) {
        this.playWalkAnimation();
      }
    } else if (movingRight) {
      this.setVelocityX(this.moveSpeed);
      this.setFlipX(false);
      if (onGround) {
        this.playWalkAnimation();
      }
    } else {
      this.setVelocityX(0);
      if (onGround) {
        this.setFrame(0); // Idle frame
      }
    }

    // --- VERTICAL MOVEMENT (JUMPING) ---
    // Check space bar or cursor up keys
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) || 
                         Phaser.Input.Keyboard.JustDown(this.keyW) || 
                         Phaser.Input.Keyboard.JustDown(this.keySpace);

    if (jumpPressed) {
      if (onGround) {
        this.jump();
      } else if (this.doubleJumpEnabled && this.jumpCount < 2) {
        this.jump();
      }
    }

    // Trigger jumping/falling sprite frames if in the air
    if (!onGround) {
      this.setFrame(3); // Jump frame
    }

    // Check if player has fallen out of the world (abyss)
    if (this.y > 480) {
      this.dieByVoid();
    }

    // Invincibility visual effects (glowing rainbow cycling)
    if (this.isInvincible) {
      const colors = [0xff0000, 0xffa500, 0xffff00, 0x008000, 0x0000ff, 0x4b0082, 0xee82ee];
      const randomColor = Phaser.Utils.Array.GetRandom(colors);
      this.setTint(randomColor);
    }
  }

  jump() {
    this.setVelocityY(this.jumpForce);
    this.jumpCount++;
    SoundSynth.playJump();
    
    // Tiny puff effect when jumping
    this.scene.createJumpSmoke(this.x, this.y + (this.isBig ? 32 : 24));
  }

  playWalkAnimation() {
    // Basic animated walk frame alternating
    const walkTimer = Math.floor(this.scene.time.now / 120) % 2;
    this.setFrame(1 + walkTimer);
  }

  // --- POWER-UPS ---

  grow() {
    if (this.isBig) return;
    this.isBig = true;
    SoundSynth.playPowerUp();

    // Scale up the character sprite
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.4,
      scaleY: 1.4,
      duration: 300,
      yoyo: false,
      onComplete: () => {
        // Redefine bounds matching scale
        this.body.setSize(24, 44).setOffset(4, 4);
      }
    });

    // Notify HUD (health boost)
    EventBus.emit('add-health', 1);
  }

  becomeInvincible(duration = 10000) {
    this.isInvincible = true;
    SoundSynth.playPowerUp();
    
    if (this.invincibleTimer) {
      this.invincibleTimer.destroy();
    }

    this.invincibleTimer = this.scene.time.delayedCall(duration, () => {
      this.isInvincible = false;
      this.clearTint();
    });
  }

  // --- DAMAGE & DEATH ---

  takeDamage() {
    if (this.isDead || this.isInvincible) return;

    if (this.isBig) {
      // Shrink back to normal
      this.isBig = false;
      SoundSynth.playDamage();
      
      this.scene.tweens.add({
        targets: this,
        scaleX: 1.0,
        scaleY: 1.0,
        duration: 300,
        onComplete: () => {
          this.body.setSize(24, 44).setOffset(4, 4);
        }
      });

      // Grant brief damage invincibility (1.5 seconds)
      this.becomeTempInvincible(1500);
      EventBus.emit('add-health', -1);
    } else {
      // Small Mario dies
      this.die();
    }
  }

  becomeTempInvincible(duration) {
    this.isInvincible = true;
    
    // Flash overlay
    this.flashEvent = this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        this.flashToggle = !this.flashToggle;
        if (this.flashToggle) {
          this.setAlpha(0.3);
        } else {
          this.setAlpha(1);
        }
      },
      loop: true
    });

    this.scene.time.delayedCall(duration, () => {
      this.isInvincible = false;
      this.clearTint();
      this.setAlpha(1);
      if (this.flashEvent) {
        this.flashEvent.destroy();
        this.flashEvent = null;
      }
    });
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.setVelocity(0, 0);
    this.body.setEnable(false); // disable collisions
    
    SoundSynth.playDamage();
    SoundSynth.stopBGM();

    // Small bounce-up and drop animation
    this.setFrame(3); // set jump/hurt frame
    this.setTint(0xff0000);

    this.scene.tweens.add({
      targets: this,
      y: this.y - 80,
      duration: 300,
      ease: 'Power1',
      yoyo: false,
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          y: 520, // fall off-screen
          duration: 600,
          ease: 'Power1',
          onComplete: () => {
            EventBus.emit('player-died');
          }
        });
      }
    });
  }

  dieByVoid() {
    if (this.isDead) return;
    this.isDead = true;
    this.setVelocity(0, 0);
    this.body.setEnable(false);
    
    SoundSynth.playDamage();
    SoundSynth.stopBGM();

    EventBus.emit('player-died');
  }
}
