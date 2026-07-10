import Phaser from 'phaser';

// The EventBus allows communication between React components and the Phaser game instance.
// For example, when the player collects a coin in Phaser, we emit an event to update the HUD in React.
// When the user clicks Pause or Restart in React, we emit an event to control the Phaser scenes.
export const EventBus = new Phaser.Events.EventEmitter();
