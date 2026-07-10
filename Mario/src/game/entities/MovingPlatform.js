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
    this.range = (config.range || 4) * 16; // Range in pixels
    this.speed = config.speed || 1.2;
    this.axis = config.axis || 'x'; // 'x' for horizontal, 'y' for vertical

    // Set initial velocities
    if (this.axis === 'x') {
      this.setVelocityX(this.speed * 40);
    } else {
      this.setVelocityY(this.speed * 40);
    }

    // Set custom display size (3 tiles wide platform: 48px width, 16px height)
    this.setDisplaySize(48, 16);
    this.body.setSize(48, 16);
  }

  update() {
    // Horizontally moving platforms
    if (this.axis === 'x') {
      const distance = Math.abs(this.x - this.startX);
      if (distance >= this.range) {
        // Reverse direction
        if (this.x > this.startX) {
          this.setVelocityX(-this.speed * 40);
        } else {
          this.setVelocityX(this.speed * 40);
        }
      }
    } 
    // Vertically moving platforms (elevators)
    else if (this.axis === 'y') {
      const distance = Math.abs(this.y - this.startY);
      if (distance >= this.range) {
        // Reverse direction
        if (this.y > this.startY) {
          this.setVelocityY(-this.speed * 40);
        } else {
          this.setVelocityY(this.speed * 40);
        }
      }
    }
  }
}
