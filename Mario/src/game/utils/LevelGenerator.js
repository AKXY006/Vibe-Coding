// LevelGenerator.js
// Parses level configuration object and spawns Phaser Tilemaps, platforms, hazards, and groups.
import { EventBus } from '../EventBus';

class LevelGenerator {
  static createLevel(scene, config) {
    // 1. Create Phaser Tilemap structure
    const map = scene.make.tilemap({
      tileWidth: 32,
      tileHeight: 32,
      width: config.width,
      height: config.height
    });

    // 2. Add our procedurally generated tileset texture
    const tileset = map.addTilesetImage('tiles', 'tiles', 32, 32);

    // 3. Create a blank ground layer
    // This handles the primary solid terrain (ground, castle, pipe walls)
    const groundLayer = map.createBlankLayer('ground', tileset);

    const groundTileIndex = config.theme === 'castle' ? 10 : 0; // Castle Bricks (10) or Ground Bricks (0)

    // Build the main ground floor (bottom rows 13 and 14)
    for (let x = 0; x < config.width; x++) {
      // Check if this coordinate falls inside an abyss/hole
      const inHole = config.holes.some(h => x >= h.xStart && x < h.xStart + h.width);
      if (!inHole) {
        // Draw double layer ground
        groundLayer.putTileAt(groundTileIndex, x, 13);
        groundLayer.putTileAt(groundTileIndex, x, 14);
      }
    }

    // 4. Build Pipes
    config.pipes.forEach(pipe => {
      const topY = 13 - pipe.height;

      // Pipe corners / cap
      groundLayer.putTileAt(4, pipe.x, topY); // Left lip
      groundLayer.putTileAt(5, pipe.x + 1, topY); // Right lip

      // Pipe body segments down to ground level
      for (let y = topY + 1; y < 13; y++) {
        groundLayer.putTileAt(6, pipe.x, y); // Left body
        groundLayer.putTileAt(7, pipe.x + 1, y); // Right body
      }
    });

    // Set collision for all solid tiles in the ground layer
    groundLayer.setCollisionByExclusion([-1]);

    // 5. Create Physics Groups for Bricks, Blocks, and Items
    // Using sprites instead of tilemap cells for bricks/question blocks allows interactive bouncing, breaking, and power-up spawn animations.
    scene.bricksGroup = scene.physics.add.staticGroup();
    scene.qBlocksGroup = scene.physics.add.staticGroup();
    scene.spikesGroup = scene.physics.add.staticGroup();
    scene.coinsGroup = scene.physics.add.staticGroup();
    scene.checkpointsGroup = scene.physics.add.staticGroup();

    // Spawn Bricks & Question Blocks
    config.bricks.forEach(block => {
      const bx = block.x * 32 + 16; // Offset for center-anchored sprites
      const by = block.y * 32 + 16;

      if (block.type === 'brick') {
        const brick = scene.bricksGroup.create(bx, by, 'tiles', 1);
        brick.setData('item', block.item || 'none');
        brick.setData('hit', false);
        brick.setSize(32, 32);
      } else if (block.type === 'question') {
        const qBlock = scene.qBlocksGroup.create(bx, by, 'tiles', 2);
        qBlock.setData('item', block.item || 'coin');
        qBlock.setData('hit', false);
        qBlock.setSize(32, 32);
      }
    });

    // Spawn Spikes (Hazards)
    config.traps.forEach(trap => {
      const sx = trap.x * 32 + 16;
      const sy = trap.y * 32 + 16;
      if (trap.type === 'spike') {
        const spike = scene.spikesGroup.create(sx, sy, 'tiles', 9);
        spike.setSize(32, 24).setOffset(0, 8); // tighter collision for spikes
      }
    });

    // Spawn Checkpoint Flag
    // Draws flagpole. Frame 0: Red flag (unchecked), Frame 1: Green flag (checked)
    const checkX = config.checkpointX * 32 + 16;
    const checkY = 13 * 32 - 32; // Anchored just above the ground (height is 64)
    const flag = scene.checkpointsGroup.create(checkX, checkY, 'checkpoint', 0);
    flag.setData('activated', false);
    flag.setSize(32, 64);

    // Spawn End-of-level Victory Flagpole or Castle door
    // For Overworld/Underground: Flagpole. For Castle: Golden door.
    scene.victoryTarget = scene.physics.add.staticSprite(
      config.victoryX * 32 + 16,
      13 * 32 - 32,
      config.theme === 'castle' ? 'tiles' : 'checkpoint',
      config.theme === 'castle' ? 10 : 0 // Castle blocks or Flagpole
    );
    scene.physics.add.existing(scene.victoryTarget, true);

    // Populate decoration clouds (sky scenery)
    if (config.theme === 'overworld') {
      for (let cx = 10; cx < config.width - 10; cx += 25) {
        groundLayer.putTileAt(8, cx, 3); // Sky cloud decorations
        groundLayer.putTileAt(8, cx + 1, 3);
        groundLayer.putTileAt(8, cx + 5, 2);
      }
    }

    return {
      map,
      groundLayer
    };
  }
}

export default LevelGenerator;
