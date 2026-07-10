// Enemy.js
// Implements Goomba (walking), Paratroopa (flying/hopping), and the final Bowser Boss (fireball shooting, HP phases).
import Phaser from 'phaser';
import SoundSynth from '../utils/SoundSynth';
import { EventBus } from '../EventBus';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    // Select initial frame based on type
    let initialFrame = 0;
    if (type === 'paratroopa') initialFrame = 2;
    if (type === 'boss') initialFrame = 0;

    super(scene, x, y, type === 'boss' ? 'boss' : 'enemies', initialFrame);
    
    this.enemyType = type; // 'goomba' | 'paratroopa' | 'boss'
    this.isDead = false;

    // Add to scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Speed modifiers based on level difficulty
    const speedMultiplier = scene.levelConfig.difficulty || 1.0;

    if (type === 'boss') {
      this.body.setSize(52, 56).setOffset(6, 8);
      this.body.setGravityY(scene.levelConfig.gravityY);
      this.hp = 5;
      this.maxHp = 5;
      this.bossSpeed = 80;
      this.setVelocityX(-this.bossSpeed);
      this.bossJumpTimer = 0;
      this.bossFireTimer = 0;
      this.isHurt = false;
      this.hurtTimer = 0;

      // Broadcast boss appearance to React HUD
      EventBus.emit('boss-spawned', { hp: this.hp, maxHp: this.maxHp });
    } else if (type === 'paratroopa') {
      this.body.setSize(24, 28).setOffset(4, 4);
      this.body.setGravityY(scene.levelConfig.gravityY - 400); // lower gravity for floatiness
      this.patrolSpeed = 120 * speedMultiplier;
      this.setVelocityX(-this.patrolSpeed);
      this.hopTimer = 0;
    } else {
      // Goomba
      this.body.setSize(24, 24).setOffset(4, 8);
      this.body.setGravityY(scene.levelConfig.gravityY);
      this.patrolSpeed = 100 * speedMultiplier;
      this.setVelocityX(-this.patrolSpeed);
    }
  }

  update(time, delta) {
    if (this.isDead) return;

    // Flip sprite face direction based on horizontal movement
    if (this.body.velocity.x > 0) {
      this.setFlipX(true);
    } else if (this.body.velocity.x < 0) {
      this.setFlipX(false);
    }

    // --- GOOMBA BEHAVIOR ---
    if (this.enemyType === 'goomba') {
      // Simple walking animation
      const walkTimer = Math.floor(time / 150) % 2;
      this.setFrame(walkTimer);

      // Patrol turning logic
      if (this.body.blocked.left) {
        this.setVelocityX(this.patrolSpeed);
      } else if (this.body.blocked.right) {
        this.setVelocityX(-this.patrolSpeed);
      }
    }

    // --- PARATROOPA BEHAVIOR ---
    else if (this.enemyType === 'paratroopa') {
      // Wing flapping animation frames (2 and 3)
      const flapTimer = Math.floor(time / 120) % 2;
      this.setFrame(2 + flapTimer);

      // Hops repeatedly when on the ground
      if (this.body.blocked.down || this.body.touching.down) {
        this.setVelocityY(-320); // Jump/Hop up
      }

      // Patrol turn on walls
      if (this.body.blocked.left) {
        this.setVelocityX(this.patrolSpeed);
      } else if (this.body.blocked.right) {
        this.setVelocityX(-this.patrolSpeed);
      }
    }

    // --- FINAL BOSS (BOWSER) BEHAVIOR ---
    else if (this.enemyType === 'boss') {
      // Walking frame cycles (0 and 1)
      const bossWalk = Math.floor(time / 200) % 2;
      if (!this.isHurt) {
        this.setFrame(this.bossFireTimer > 1000 ? 2 : bossWalk); // Frame 2: opening mouth to fire
      }

      // Face player
      const player = this.scene.player;
      if (player && !player.isDead) {
        if (player.x < this.x) {
          this.setVelocityX(-this.bossSpeed);
          this.setFlipX(false);
        } else {
          this.setVelocityX(this.bossSpeed);
          this.setFlipX(true);
        }
      }

      // Boss hops periodically (every 2.5 seconds)
      this.bossJumpTimer += delta;
      if (this.bossJumpTimer > 2500) {
        this.bossJumpTimer = 0;
        if (this.body.blocked.down || this.body.touching.down) {
          this.setVelocityY(-400);
        }
      }

      // Boss shoots fireballs at the player
      this.bossFireTimer += delta;
      if (this.bossFireTimer > 2000) {
        this.bossFireTimer = 0;
        this.shootFireball();
      }

      // Recovery flashing if hit
      if (this.isHurt) {
        this.hurtTimer -= delta;
        if (this.hurtTimer <= 0) {
          this.isHurt = false;
          this.clearTint();
        } else {
          // Flash effect
          if (Math.floor(time / 50) % 2 === 0) {
            this.setTint(0xff0000);
          } else {
            this.clearTint();
          }
        }
      }

      // Fall to death check (abyss)
      if (this.y > 480) {
        this.bossDefeated();
      }
    }
  }

  // --- ACTIONS ---

  shootFireball() {
    if (this.isDead || !this.scene || !this.scene.fireballsGroup) return;

    SoundSynth.playTone(300, 'sawtooth', 0.15, 0, 0.1);
    
    // Spawn fire sprite slightly forward from boss head
    const fireX = this.x + (this.flipX ? 32 : -32);
    const fireY = this.y - 8;

    const fireball = this.scene.fireballsGroup.create(fireX, fireY, 'fireball');
    if (fireball) {
      fireball.body.setAllowGravity(false);
      fireball.setSize(16, 16);
      
      // Aim at player
      const player = this.scene.player;
      if (player) {
        const angle = Phaser.Math.Angle.Between(fireX, fireY, player.x, player.y);
        const speed = 220;
        fireball.setVelocity(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        );
      } else {
        fireball.setVelocity(this.flipX ? 220 : -220, 0);
      }
    }
  }

  // Defeat walking/flying enemies by jumping on their heads
  squish() {
    if (this.isDead) return;
    this.isDead = true;
    this.setVelocity(0, 0);
    this.body.setEnable(false);

    SoundSynth.playEnemyDefeat();

    if (this.enemyType === 'paratroopa') {
      // Flying enemy loses its wings! Replace with a standard Goomba walk enemy
      const walkG = new Enemy(this.scene, this.x, this.y, 'goomba');
      this.scene.enemiesGroup.add(walkG);
      this.destroy();
    } else {
      // Normal squish collapse animation
      this.scene.tweens.add({
        targets: this,
        scaleY: 0.1,
        y: this.y + 14,
        duration: 200,
        onComplete: () => {
          this.scene.time.delayedCall(400, () => {
            this.destroy();
          });
        }
      });
    }

    // Award score to player
    EventBus.emit('add-score', 100);
  }

  // Handles boss taking damage when jumped on
  hitBoss() {
    if (this.isDead || this.isHurt) return;
    
    this.hp--;
    this.isHurt = true;
    this.hurtTimer = 1000; // 1 second invincibility
    
    SoundSynth.playDamage();
    EventBus.emit('boss-hit', { hp: this.hp, maxHp: this.maxHp });

    if (this.hp <= 0) {
      this.bossDefeated();
    } else {
      // Knockback / Jump reaction
      this.setVelocityY(-250);
      this.setVelocityX(this.flipX ? -150 : 150);
    }
  }

  bossDefeated() {
    this.isDead = true;
    this.setVelocity(0, 0);
    this.body.setEnable(false);

    SoundSynth.playVictory();
    EventBus.emit('add-score', 5000);
    EventBus.emit('boss-defeated');

    // Bounce and fall off screen into lava
    this.setTint(0xff0000);
    this.setFrame(3); // Hurt frame
    
    this.scene.tweens.add({
      targets: this,
      y: this.y - 60,
      duration: 350,
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          y: 520, // Drop down off screen
          duration: 850,
          onComplete: () => {
            this.destroy();
          }
        });
      }
    });
  }
}
