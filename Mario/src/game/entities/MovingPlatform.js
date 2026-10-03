// MovingPlatform.js
// Configurable platforms that move horizontally or vertically.
// Integrates with Phaser Arcade Physics so that the player automatically rides the platform.
import Phaser from 'phaser';

export default class MovingPlatform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    // Frame 11 from the tileset is our moving platform texture
    super(scene, x, y, 'tiles', 11);

    scene.add.existing(this);
    scene.physics.add.existing(this, false); // false = not static

    // Configure platform physics
    this.body.setImmovable(true);
    this.body.setAllowGravity(false);
    this.body.setFriction(1, 1); // Crucial for player to stand on and ride along!

    // Setup bounds
    this.startX = x;
    this.startY = y;
    this.range = (config.range || 4) * 32; // Range in pixels (32px tiles)
    this.speed = config.speed || 1.2;
    this.axis = config.axis || 'x'; // 'x' for horizontal, 'y' for vertical

    // Set initial velocities (doubled for 640x480 resolution)
    if (this.axis === 'x') {
      this.setVelocityX(this.speed * 80);
    } else {
      this.setVelocityY(this.speed * 80);
    }

    // Set custom display size (3 tiles wide platform: 96px width, 32px height)
    this.setDisplaySize(96, 32);
    this.body.setSize(96, 32);
  }

  update() {
    // Horizontally moving platforms
    if (this.axis === 'x') {
      const distance = Math.abs(this.x - this.startX);
      if (distance >= this.range) {
        // Reverse direction
        if (this.x > this.startX) {
          this.setVelocityX(-this.speed * 80);
        } else {
          this.setVelocityX(this.speed * 80);
        }
      }
    } 
    // Vertically moving platforms (elevators)
    else if (this.axis === 'y') {
      const distance = Math.abs(this.y - this.startY);
      if (distance >= this.range) {
        // Reverse direction
        if (this.y > this.startY) {
          this.setVelocityY(-this.speed * 80);
        } else {
          this.setVelocityY(this.speed * 80);
        }
      }
    }
  }
}
