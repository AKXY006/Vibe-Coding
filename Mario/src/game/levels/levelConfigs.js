// levelConfigs.js
// Stores configuration and layouts for all 30 levels.
// Difficulty increases gradually, themes change, and level 30 hosts the final Boss.

const THEMES = {
  OVERWORLD: {
    key: 'overworld',
    bg: '#5c94fc', // Sky Blue
    music: 'overworld'
  },
  UNDERGROUND: {
    key: 'underground',
    bg: '#180828', // Dark Violet/Cave
    music: 'underground'
  },
  CASTLE: {
    key: 'castle',
    bg: '#101018', // Deep Charcoal
    music: 'castle'
  }
};

// Programmatic level builder config generator to avoid thousands of lines of boilerplate,
// while ensuring each level has a unique hand-crafted feel.
const generateLevels = () => {
  const levels = [];

  for (let i = 1; i <= 30; i++) {
    // Determine theme based on level progression
    let theme = THEMES.OVERWORLD;
    if (i > 10 && i <= 20) {
      theme = THEMES.UNDERGROUND;
    } else if (i > 20) {
      theme = THEMES.CASTLE;
    }

    // Gradual escalations
    const width = 180 + i * 25; // Scrolling length increases (longer levels)
    const gravityY = 1200 + Math.min(i * 20, 400); // Doubled gravity for 32x32 tiles physics
    const difficulty = 1 + (i * 0.1);

    // Default structure container
    const config = {
      id: i,
      name: `World ${Math.ceil(i / 10)}-${(i - 1) % 10 + 1}: ${getLevelName(i)}`,
      theme: theme.key,
      bg: theme.bg,
      music: theme.key === 'castle' && i === 30 ? 'boss' : theme.music,
      width: width,
      height: 15,
      gravityY: gravityY,
      checkpointX: Math.floor(width * 0.45),
      victoryX: width - 8,
      difficulty: difficulty,
      hasBoss: i === 30,
      holes: [],
      pipes: [],
      bricks: [],
      enemies: [],
      movingPlatforms: [],
      traps: [],
      secretAreas: []
    };

    // --- PROCEDURAL BLOCK GENERATION BY DIFFICULTY ---
    
    // Spawn Holes (Abysses) - more holes and wider as levels increase
    const holeSpacing = 25 - Math.min(Math.floor(i / 3), 10);
    const maxHoleWidth = i > 15 ? 4 : 2;
    for (let x = 20; x < width - 15; x += holeSpacing) {
      // Add random holes based on theme and level
      if ((x % 3 === 0 && i > 3) || (x % 2 === 0 && i > 12)) {
        const w = (x % 2 === 0) ? 2 : maxHoleWidth;
        config.holes.push({ xStart: x, width: w });
        x += w; // Skip forward
      }
    }

    // Spawn Pipes
    for (let x = 15; x < width - 20; x += 30) {
      // Ensure it doesn't overlap a hole
      if (!isOverlappingHole(x, config.holes)) {
        const height = 2 + (x % 3 === 0 ? 1 : 0);
        config.pipes.push({ x, height });
      }
    }

    // Spawn Bricks & Question Blocks
    // We add rows of platforms at heights y=6 (high) and y=10 (mid)
    for (let x = 10; x < width - 15; x += 6) {
      if (isOverlappingHole(x, config.holes)) {
        // Add a floating brick bridge over the hole so the player can cross!
        config.bricks.push({ x, y: 10, type: 'brick', item: 'none' });
        config.bricks.push({ x: x + 1, y: 10, type: 'question', item: 'coin' });
        config.bricks.push({ x: x + 2, y: 10, type: 'brick', item: 'none' });
        continue;
      }

      // Normal brick layouts
      if (x % 4 === 0) {
        config.bricks.push({ x: x, y: 10, type: 'brick', item: 'none' });
        config.bricks.push({ x: x + 1, y: 10, type: 'question', item: (x % 8 === 0) ? 'mushroom' : 'coin' });
        config.bricks.push({ x: x + 2, y: 10, type: 'brick', item: 'none' });

        // High platforms for secrets
        if (x % 12 === 0) {
          config.bricks.push({ x: x + 5, y: 6, type: 'brick', item: 'none' });
          config.bricks.push({ x: x + 6, y: 6, type: 'question', item: 'star' });
          config.bricks.push({ x: x + 7, y: 6, type: 'brick', item: 'none' });
        }
      }
    }

    // Spawn Enemies (Goomba and Paratroopas)
    // Goombas walk on ground, Paratroopas fly or patrol
    for (let x = 22; x < width - 20; x += 15 - Math.min(Math.floor(i / 5), 8)) {
      if (isOverlappingHole(x, config.holes)) continue;
      
      const type = (x % 3 === 0 && i > 5) ? 'paratroopa' : 'goomba';
      // Adjust enemy coordinates slightly so they don't fall off immediately
      config.enemies.push({ x: x + 2, y: 12, type: type });
    }

    // Spawn Moving Platforms
    // Vertical patrolling or horizontal bridging
    const platformSpacing = 40;
    for (let x = 25; x < width - 25; x += platformSpacing) {
      if (x % 2 === 0) {
        // Horizontal patrol
        config.movingPlatforms.push({
          x: x,
          y: 9,
          range: 4,
          speed: 1.5 + (i * 0.1),
          axis: 'x'
        });
      } else {
        // Vertical patrol
        config.movingPlatforms.push({
          x: x + 5,
          y: 11,
          range: 3,
          speed: 1.2 + (i * 0.1),
          axis: 'y'
        });
      }
    }

    // Spawn Traps (Spikes)
    if (theme.key === 'castle' || i > 15) {
      for (let x = 18; x < width - 30; x += 22) {
        if (!isOverlappingHole(x, config.holes) && x % 4 === 0) {
          config.traps.push({ x: x, y: 13, type: 'spike' });
          config.traps.push({ x: x + 1, y: 13, type: 'spike' });
        }
      }
    }

    // Add 1UP Hidden Blocks
    config.secretAreas.push({
      x: Math.floor(width * 0.2),
      y: 7,
      item: 'life'
    });

    // --- LEVEL SPECIFIC OVERRIDES ---
    if (i === 1) {
      // Intro level: no holes, easy Goombas, lots of power-ups
      config.holes = [];
      config.traps = [];
      config.difficulty = 1.0;
      config.enemies = [
        { x: 25, y: 12, type: 'goomba' },
        { x: 45, y: 12, type: 'goomba' },
        { x: 70, y: 12, type: 'goomba' }
      ];
    }

    if (i === 30) {
      // The Final Castle Boss Arena!
      config.width = 160;
      config.checkpointX = 50;
      config.victoryX = 150;
      config.holes = [
        { xStart: 25, width: 3 },
        { xStart: 70, width: 4 },
        { xStart: 110, width: 3 }
      ];
      // Place Bowser Boss at x = 135
      config.enemies = [
        { x: 135, y: 11, type: 'boss' }
      ];
      // Bricks around boss for jumping space
      config.bricks = [
        { x: 125, y: 10, type: 'brick', item: 'none' },
        { x: 126, y: 10, type: 'brick', item: 'none' },
        { x: 127, y: 10, type: 'brick', item: 'none' },
        { x: 128, y: 10, type: 'question', item: 'mushroom' },
        { x: 142, y: 10, type: 'brick', item: 'none' },
        { x: 143, y: 10, type: 'brick', item: 'none' }
      ];
    }

    levels.push(config);
  }

  return levels;
};

// Returns a flavor name for the level depending on index
const getLevelName = (index) => {
  const names = [
    "Overworld Beginnings", "Piped Valleys", "High Brick Bridges", "Goomba Meadows", "Platform Hills",
    "Skyward Ledges", "Valley Checkpoint", "Star Invaders", "Brick Fortress", "The Gateway Over",
    "Underground Caves", "Echo Tunnels", "Lava Pit Caves", "Subterranean Jumpers", "Flying Terror",
    "Hidden Treasure Room", "Double-Jump Cave", "Dark Spikes", "Pipe Maze", "Deep Lava Passage",
    "Castle Gatehouse", "Fire Bridge", "Spike Gauntlet", "Ascending Elevators", "The Crushing Path",
    "Maze of Hazards", "Double-Boss Guards", "Lava Chamber", "Door to the Keep", "The Final Battle"
  ];
  return names[index - 1] || `Mystery Valley ${index}`;
};

// Check if a coordinate falls in a pit/hole
const isOverlappingHole = (x, holes) => {
  return holes.some(h => x >= h.xStart && x < h.xStart + h.width);
};

export const levelConfigs = generateLevels();
