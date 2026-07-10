// AssetGenerator.js
// Procedurally generates retro pixel art sprite sheets and tilesets on canvas textures.
// This ensures original, copyright-safe, high-quality visuals without loading external image files.
class AssetGenerator {
  static generateAssets(scene) {
    this.createTileset(scene);
    this.createPlayerSprites(scene);
    this.createEnemySprites(scene);
    this.createPowerUpSprites(scene);
    this.createFireballSprite(scene);
    this.createParticleSprites(scene);
    this.createCheckpointFlag(scene);
  }

  // Helper to draw a pixel grid onto a canvas context
  static drawPixelGrid(ctx, xOffset, yOffset, size, scale, pixelData, palette) {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const pixelIdx = r * size + c;
        const colorKey = pixelData[pixelIdx];
        if (colorKey !== '.' && palette[colorKey]) {
          ctx.fillStyle = palette[colorKey];
          ctx.fillRect(
            xOffset + c * scale,
            yOffset + r * scale,
            scale,
            scale
          );
        }
      }
    }
  }

  static createTileset(scene) {
    // 16x16 tiles. We will fit 12 tiles in a single horizontal sheet: 192 x 16 pixels.
    const canvas = scene.textures.createCanvas('tiles_canvas', 192, 16);
    const ctx = canvas.context;

    // Color palettes
    const colors = {
      groundDark: '#5c2c0c',
      groundMid: '#9c5424',
      groundLight: '#d8844f',
      brickDark: '#701a08',
      brickMid: '#b84418',
      brickLight: '#e07840',
      qBlockDark: '#c08000',
      qBlockMid: '#fcb800',
      qBlockLight: '#fce478',
      emptyDark: '#383838',
      emptyMid: '#686868',
      emptyLight: '#a0a0a0',
      pipeDark: '#005800',
      pipeMid: '#00a800',
      pipeLight: '#78f87c',
      cloudDark: '#b8b8b8',
      cloudLight: '#fcffff',
      spikeDark: '#404040',
      spikeMid: '#808080',
      spikeLight: '#c0c0c0',
      castleDark: '#202040',
      castleMid: '#404080',
      castleLight: '#8080ff'
    };

    // Helper to draw border outlines
    const border = (x, y, w, h, lightColor, darkColor) => {
      ctx.fillStyle = lightColor;
      ctx.fillRect(x, y, w, 1);
      ctx.fillRect(x, y, 1, h);
      ctx.fillStyle = darkColor;
      ctx.fillRect(x, y + h - 1, w, 1);
      ctx.fillRect(x + w - 1, y, 1, h);
    };

    // 0: Ground Tile (Overworld)
    ctx.fillStyle = colors.groundMid;
    ctx.fillRect(0, 0, 16, 16);
    border(0, 0, 16, 16, colors.groundLight, colors.groundDark);
    ctx.fillStyle = colors.groundDark;
    // Add cracked lines
    ctx.fillRect(4, 4, 8, 2);
    ctx.fillRect(2, 10, 10, 2);

    // 1: Brick Platform Tile
    ctx.fillStyle = colors.brickMid;
    ctx.fillRect(16, 0, 16, 16);
    border(16, 0, 16, 16, colors.brickLight, colors.brickDark);
    // Draw brick mortar joints
    ctx.fillStyle = colors.brickDark;
    ctx.fillRect(16, 8, 16, 1);
    ctx.fillRect(24, 0, 1, 8);
    ctx.fillRect(20, 8, 1, 8);
    ctx.fillRect(28, 8, 1, 8);

    // 2: Question Block (Active)
    ctx.fillStyle = colors.qBlockMid;
    ctx.fillRect(32, 0, 16, 16);
    border(32, 0, 16, 16, colors.qBlockLight, colors.qBlockDark);
    // Question mark pixel art
    const qData = [
      '..###..',
      '.#...#.',
      '....#..',
      '...#...',
      '...#...',
      '.......',
      '...#...'
    ];
    ctx.fillStyle = '#000000';
    qData.forEach((row, r) => {
      for (let c = 0; c < row.length; c++) {
        if (row[c] === '#') {
          ctx.fillRect(32 + 5 + c, 4 + r, 1, 1);
        }
      }
    });

    // 3: Empty/Hit Block
    ctx.fillStyle = colors.emptyMid;
    ctx.fillRect(48, 0, 16, 16);
    border(48, 0, 16, 16, colors.emptyLight, colors.emptyDark);
    // Rivets in 4 corners
    ctx.fillStyle = colors.emptyDark;
    ctx.fillRect(50, 2, 2, 2);
    ctx.fillRect(60, 2, 2, 2);
    ctx.fillRect(50, 12, 2, 2);
    ctx.fillRect(60, 12, 2, 2);

    // Green Pipe Top-Left (4)
    ctx.fillStyle = colors.pipeMid;
    ctx.fillRect(64, 0, 16, 16);
    border(64, 0, 16, 16, colors.pipeLight, colors.pipeDark);
    ctx.fillStyle = colors.pipeLight;
    ctx.fillRect(66, 1, 3, 14);

    // Green Pipe Top-Right (5)
    ctx.fillStyle = colors.pipeMid;
    ctx.fillRect(80, 0, 16, 16);
    border(80, 0, 16, 16, colors.pipeLight, colors.pipeDark);
    ctx.fillStyle = colors.pipeDark;
    ctx.fillRect(92, 1, 2, 14);

    // Green Pipe Body-Left (6)
    ctx.fillStyle = colors.pipeMid;
    ctx.fillRect(96, 0, 16, 16);
    ctx.fillStyle = colors.pipeLight;
    ctx.fillRect(98, 0, 3, 16);
    ctx.fillStyle = colors.pipeDark;
    ctx.fillRect(96, 0, 1, 16); // Left edge border

    // Green Pipe Body-Right (7)
    ctx.fillStyle = colors.pipeMid;
    ctx.fillRect(112, 0, 16, 16);
    ctx.fillStyle = colors.pipeDark;
    ctx.fillRect(125, 0, 3, 16);
    ctx.fillStyle = colors.pipeDark;
    ctx.fillRect(127, 0, 1, 16); // Right edge border

    // 8: Cloud
    ctx.fillStyle = 'rgba(0,0,0,0)'; // transparent bg
    ctx.fillRect(128, 0, 16, 16);
    ctx.fillStyle = colors.cloudLight;
    ctx.beginPath();
    ctx.arc(136, 10, 6, 0, Math.PI * 2);
    ctx.arc(132, 11, 4, 0, Math.PI * 2);
    ctx.arc(140, 11, 4, 0, Math.PI * 2);
    ctx.fill();

    // 9: Spike (Trap)
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(144, 0, 16, 16);
    ctx.fillStyle = colors.spikeMid;
    ctx.strokeStyle = colors.spikeDark;
    ctx.beginPath();
    // 3 spikes per tile
    for (let s = 0; s < 3; s++) {
      const sx = 144 + s * 5 + 1;
      ctx.moveTo(sx, 16);
      ctx.lineTo(sx + 2.5, 3);
      ctx.lineTo(sx + 5, 16);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 10: Castle Brick
    ctx.fillStyle = colors.castleMid;
    ctx.fillRect(160, 0, 16, 16);
    border(160, 0, 16, 16, colors.castleLight, colors.castleDark);
    ctx.fillStyle = colors.castleDark;
    ctx.fillRect(160, 8, 16, 1);
    ctx.fillRect(168, 0, 1, 8);
    ctx.fillRect(172, 8, 1, 8);

    // 11: Moving Platform Block
    ctx.fillStyle = '#b88400';
    ctx.fillRect(176, 0, 16, 16);
    border(176, 0, 16, 16, '#fcb854', '#5c3c00');
    // Draw some horizontal stripes
    ctx.fillStyle = '#5c3c00';
    ctx.fillRect(178, 4, 12, 2);
    ctx.fillRect(178, 10, 12, 2);

    canvas.refresh();
    scene.textures.addSpriteSheet('tiles', canvas.canvas, { frameWidth: 16, frameHeight: 16 });
  }

  static createPlayerSprites(scene) {
    // Player: 16x24 size, 4 frames (Idle, Walk1, Walk2, Jump)
    // Horizontal sheet size: 64 x 24
    const canvas = scene.textures.createCanvas('player_canvas', 64, 24);
    const ctx = canvas.context;

    // Palette: R=Red, B=Blue, S=Skin/Beige, D=Brown, W=White, .=Transparent
    const palette = {
      R: '#e02800',
      B: '#0024f0',
      S: '#fcc078',
      D: '#703c00',
      W: '#fcffff',
      O: '#000000'
    };

    const frames = [
      // Frame 0: Idle
      [
        '....RRRRR.......',
        '....RRRRRRRRR...',
        '....DDDSS.O.....',
        '...D.S.S.S.O....',
        '...D.S.SS.S.O...',
        '...DD.S.SSSSS...',
        '....D.SSSSSS....',
        '.....SSSSSS.....',
        '....RRBBRRBR....',
        '...RRRBBBRRBR...',
        '..RRRRBBBBBBRR..',
        '..SS.BBBBBBB.SS.',
        '..SS.BBBBBBB.SS.',
        '..SS.BBBBBBB.SS.',
        '....BBBBBBBBB...',
        '....BBBB.BBBB...',
        '....BBB...BBB...',
        '....DD.....DD...',
        '...DDD.....DDD..'
      ],
      // Frame 1: Walk 1
      [
        '....RRRRR.......',
        '....RRRRRRRRR...',
        '....DDDSS.O.....',
        '...D.S.S.S.O....',
        '...D.S.SS.S.O...',
        '...DD.S.SSSSS...',
        '....D.SSSSSS....',
        '.....SSSSSS.....',
        '....RRBBRRBR....',
        '...RRRBBBRRBR...',
        '..RRRRBBBBBBRR..',
        '..SS.BBBBBBB.SS.',
        '.....BBBBBBB.SS.',
        '....BBBBBBBB....',
        '...BBB.BBBB.....',
        '..BBB..BBBB.....',
        '..DD....BBB.....',
        '........DDD.....',
        '........DDD.....'
      ],
      // Frame 2: Walk 2
      [
        '....RRRRR.......',
        '....RRRRRRRRR...',
        '....DDDSS.O.....',
        '...D.S.S.S.O....',
        '...D.S.SS.S.O...',
        '...DD.S.SSSSS...',
        '....D.SSSSSS....',
        '.....SSSSSS.....',
        '....RRBBRRBR....',
        '...RRRBBBRRBR...',
        '..RRRRBBBBBBRR..',
        '..SS.BBBBBBB.SS.',
        '..SS.BBBBBBB....',
        '....BBBBBBBB....',
        '....BBBB.BBB....',
        '....BBBB..BBB...',
        '....BBB....DD...',
        '....DDD.........',
        '....DDD.........'
      ],
      // Frame 3: Jump
      [
        '....RRRRR.......',
        '....RRRRRRRRR...',
        '....DDDSS.O.....',
        '...D.S.S.S.O....',
        '...D.S.SS.S.O...',
        '...DD.S.SSSSS...',
        '....D.SSSSSS....',
        '.....SSSSSS.....',
        '....RRBBRRBR....',
        '..SSRRRBBBRRBR..',
        '..SSRRRBBBBBBRR.',
        '...RRRBBBBBBB.R.',
        '....BBBBBBBBB...',
        '....BBBBBBBBB...',
        '...BBB.....BBB..',
        '..BBB.......BBB.',
        '..DDD.......DDD.',
        '..DDD.......DDD.',
        '................'
      ]
    ];

    frames.forEach((frameData, idx) => {
      const xOffset = idx * 16;
      frameData.forEach((row, r) => {
        for (let c = 0; c < row.length; c++) {
          const colorKey = row[c];
          if (colorKey !== '.' && palette[colorKey]) {
            ctx.fillStyle = palette[colorKey];
            ctx.fillRect(xOffset + c, r + 2, 1, 1); // Shifting down slightly to center vertically
          }
        }
      });
    });

    canvas.refresh();
    scene.textures.addSpriteSheet('player', canvas.canvas, { frameWidth: 16, frameHeight: 24 });
  }

  static createEnemySprites(scene) {
    // Enemies: 16x16 frames except Boss which is 32x32.
    // Let's create two separate sheets to avoid complexity:
    // 1. Walking Enemy (Goomba) & Flying Enemy (Paratroopa): "enemies" (64x16)
    //    Frame 0-1: Goomba Walk, Frame 2-3: Paratroopa
    // 2. Boss (Bowser): "boss" (128x32) - 4 frames

    const enemyCanvas = scene.textures.createCanvas('enemies_canvas', 64, 16);
    const eCtx = enemyCanvas.context;

    const gPalette = {
      B: '#602000', // Brown
      S: '#d8a060', // Skin/Face
      O: '#000000', // Black eyes
      W: '#fcffff', // White
      R: '#e02800'  // Red (for shell)
    };

    const gFrames = [
      // Goomba Walk 1
      [
        '.....BBBBB......',
        '....BBBBBBBB....',
        '...BBBBBBBBBB...',
        '..BBBOBBOBBOBB..',
        '..BBBOBBOBBOBB..',
        '..BBBBBBBBBBBB..',
        '...BSSSSSSSSB...',
        '....SSSSSSSS....',
        '....SSSSSSSS....',
        '.....SBBBBB.....',
        '....SSBBBBBSS...',
        '...SSS.BBB.SSS..',
        '...SS..BBB..SS..',
        '.......BBB......',
        '......BBBBB.....',
        '......BB.BB.....'
      ],
      // Goomba Walk 2
      [
        '.....BBBBB......',
        '....BBBBBBBB....',
        '...BBBBBBBBBB...',
        '..BBBOBBOBBOBB..',
        '..BBBOBBOBBOBB..',
        '..BBBBBBBBBBBB..',
        '...BSSSSSSSSB...',
        '....SSSSSSSS....',
        '....SSSSSSSS....',
        '.....SBBBBB.....',
        '....SSBBBBBSS...',
        '...SSS.BBB.SSS..',
        '..SSS..BBB..SSS.',
        '..SS...BBB...SS.',
        '.......BBB......',
        '......BB.BB.....'
      ],
      // Paratroopa Walk 1
      [
        '......RRRR......',
        '.....RRRRRR.....',
        '....RROORROO....',
        '....RROORROO....',
        '....RRRRRRRR....',
        '.....SSSSSS.....',
        '....SSOSSSOS....',
        '....SSSSSSSS....',
        '.....SSSSSS.WW..',
        '....RRRRRRRWWWW.',
        '...RRRRRRRRRWW..',
        '..RRRRRRRRRRR...',
        '..SS.RRRRR.SS...',
        '..SS..RRR..SS...',
        '..DD.......DD...',
        '..DD.......DD...'
      ],
      // Paratroopa Walk 2 (Wings flap/move)
      [
        '......RRRR......',
        '.....RRRRRR.....',
        '....RROORROO....',
        '....RROORROO....',
        '....RRRRRRRR....',
        '.....SSSSSS.....',
        '....SSOSSSOS....',
        '....SSSSSSSS.WW.',
        '.....SSSSSSWWWW.',
        '....RRRRRRR.WW..',
        '...RRRRRRRRR....',
        '..RRRRRRRRRRR...',
        '...SSRRRRR.SS...',
        '....SS.RR..SS...',
        '....DD.....DD...',
        '....DD.....DD...'
      ]
    ];

    gFrames.forEach((frameData, idx) => {
      const xOffset = idx * 16;
      frameData.forEach((row, r) => {
        for (let c = 0; c < row.length; c++) {
          const colorKey = row[c];
          if (colorKey !== '.' && gPalette[colorKey]) {
            eCtx.fillStyle = gPalette[colorKey];
            eCtx.fillRect(xOffset + c, r, 1, 1);
          }
        }
      });
    });

    enemyCanvas.refresh();
    scene.textures.addSpriteSheet('enemies', enemyCanvas.canvas, { frameWidth: 16, frameHeight: 16 });

    // --- BOSS CANVAS (32x32, 4 frames) ---
    // Frame 0-1: Move left/right, Frame 2: Open mouth fire, Frame 3: Hurt
    const bossCanvas = scene.textures.createCanvas('boss_canvas', 128, 32);
    const bCtx = bossCanvas.context;

    const bPalette = {
      G: '#007800', // Green body
      Y: '#f8d878', // Yellow face/belly
      R: '#d80000', // Red spikes/eyes/hair
      W: '#f8f8f8', // White spikes
      B: '#000000', // Black outline/eyes
      P: '#f878a8'  // Pink shell inner
    };

    // Draw procedural shapes for Boss frames (so we don't code massive 32x32 grids in strings)
    for (let f = 0; f < 4; f++) {
      const fx = f * 32;

      // Draw general green circular body
      bCtx.fillStyle = bPalette.G;
      bCtx.beginPath();
      bCtx.arc(fx + 16, 18, 10, 0, Math.PI * 2);
      bCtx.fill();

      // Yellow belly plate
      bCtx.fillStyle = bPalette.Y;
      bCtx.beginPath();
      bCtx.arc(fx + 14, 20, 6, 0, Math.PI * 2);
      bCtx.fill();

      // Red hair/spikes on back
      bCtx.fillStyle = bPalette.R;
      bCtx.fillRect(fx + 8, 4, 12, 4);
      bCtx.fillRect(fx + 22, 10, 4, 12);

      // White Horns and Spikes
      bCtx.fillStyle = bPalette.W;
      bCtx.fillRect(fx + 4, 12, 3, 3); // Spikes on back shell
      bCtx.fillRect(fx + 6, 18, 3, 3);
      bCtx.fillRect(fx + 18, 6, 3, 4); // Horn on head

      // Black eyes
      bCtx.fillStyle = bPalette.B;
      bCtx.fillRect(fx + 12, 11, 2, 3);
      bCtx.fillRect(fx + 16, 11, 2, 3);

      // Frame specific: Mouth / Fire breathing
      if (f === 2) {
        // Red fire mouth glow
        bCtx.fillStyle = bPalette.R;
        bCtx.fillRect(fx + 6, 15, 6, 3);
      } else {
        bCtx.fillStyle = bPalette.Y;
        bCtx.fillRect(fx + 8, 15, 5, 2);
      }

      // Hops/Movement indicator: Feet drawing
      bCtx.fillStyle = bPalette.Y;
      if (f % 2 === 0) {
        bCtx.fillRect(fx + 8, 28, 4, 4);
        bCtx.fillRect(fx + 20, 28, 4, 4);
      } else {
        bCtx.fillRect(fx + 6, 28, 4, 4);
        bCtx.fillRect(fx + 18, 28, 4, 4);
      }
    }

    bossCanvas.refresh();
    scene.textures.addSpriteSheet('boss', bossCanvas.canvas, { frameWidth: 32, frameHeight: 32 });
  }

  static createPowerUpSprites(scene) {
    // Powerups: 16x16 size, 4 items:
    // Frame 0: Coin (animated spinning 4 frames -> we'll pack coin separately in sheet "coin")
    // Frame 1: Mushroom (Super)
    // Frame 2: Star (Invincibility)
    // Frame 3: 1UP Mushroom

    // First: "coin" anim sheet (64 x 16). 4 frames of spin.
    const coinCanvas = scene.textures.createCanvas('coin_canvas', 64, 16);
    const cCtx = coinCanvas.context;
    for (let f = 0; f < 4; f++) {
      const cx = f * 16;
      let coinWidth = 12;
      if (f === 1) coinWidth = 8;
      if (f === 2) coinWidth = 3;
      if (f === 3) coinWidth = 8;

      cCtx.fillStyle = '#fcb800'; // Gold
      cCtx.beginPath();
      cCtx.ellipse(cx + 8, 8, coinWidth / 2, 6, 0, 0, Math.PI * 2);
      cCtx.fill();

      cCtx.strokeStyle = '#fce478'; // Inner highlight
      cCtx.lineWidth = 1;
      cCtx.beginPath();
      cCtx.ellipse(cx + 8, 8, (coinWidth / 2) - 1, 4, 0, 0, Math.PI * 2);
      cCtx.stroke();
    }
    coinCanvas.refresh();
    scene.textures.addSpriteSheet('coin', coinCanvas.canvas, { frameWidth: 16, frameHeight: 16 });

    // Second: "powerups" sheet (48 x 16) for Mushroom (0), Star (1), 1UP (2)
    const puCanvas = scene.textures.createCanvas('powerups_canvas', 48, 16);
    const puCtx = puCanvas.context;

    // 0: Mushroom (Red/Beige)
    puCtx.fillStyle = '#f87858'; // Red Cap
    puCtx.beginPath();
    puCtx.arc(8, 8, 6, Math.PI, 0);
    puCtx.fill();
    // Mushroom spots (White)
    puCtx.fillStyle = '#fcffff';
    puCtx.fillRect(4, 5, 2, 2);
    puCtx.fillRect(8, 3, 2, 2);
    puCtx.fillRect(10, 5, 2, 2);
    // Stem (Beige)
    puCtx.fillStyle = '#fcd8a8';
    puCtx.fillRect(6, 8, 4, 7);
    puCtx.fillStyle = '#000';
    puCtx.fillRect(6, 10, 1, 2); // eyes
    puCtx.fillRect(9, 10, 1, 2);

    // 1: Star (Yellow with black eyes)
    puCtx.fillStyle = '#fcb800'; // Yellow star
    const drawStar = (cx, cy, spikes, outerRadius, innerRadius) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      puCtx.beginPath();
      puCtx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        puCtx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        puCtx.lineTo(x, y);
        rot += step;
      }
      puCtx.lineTo(cx, cy - outerRadius);
      puCtx.closePath();
      puCtx.fill();
    };
    drawStar(24, 8, 5, 7, 3);
    puCtx.fillStyle = '#000'; // Star eyes
    puCtx.fillRect(22, 6, 1, 3);
    puCtx.fillRect(25, 6, 1, 3);

    // 2: 1UP Mushroom (Green/Beige)
    puCtx.fillStyle = '#00a800'; // Green Cap
    puCtx.beginPath();
    puCtx.arc(40, 8, 6, Math.PI, 0);
    puCtx.fill();
    // Spots (White)
    puCtx.fillStyle = '#fcffff';
    puCtx.fillRect(36, 5, 2, 2);
    puCtx.fillRect(40, 3, 2, 2);
    puCtx.fillRect(42, 5, 2, 2);
    // Stem
    puCtx.fillStyle = '#fcd8a8';
    puCtx.fillRect(38, 8, 4, 7);
    puCtx.fillStyle = '#000';
    puCtx.fillRect(38, 10, 1, 2);
    puCtx.fillRect(41, 10, 1, 2);

    puCanvas.refresh();
    scene.textures.addSpriteSheet('powerups', puCanvas.canvas, { frameWidth: 16, frameHeight: 16 });
  }

  static createFireballSprite(scene) {
    const canvas = scene.textures.createCanvas('fireball', 8, 8);
    const ctx = canvas.context;
    // Red core with orange glow
    ctx.fillStyle = '#e02800';
    ctx.beginPath();
    ctx.arc(4, 4, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fcb800';
    ctx.beginPath();
    ctx.arc(4, 4, 1.5, 0, Math.PI * 2);
    ctx.fill();

    canvas.refresh();
  }

  static createParticleSprites(scene) {
    const canvas = scene.textures.createCanvas('particles', 8, 8);
    const ctx = canvas.context;
    // Red-brown brick debris particle
    ctx.fillStyle = '#b84418';
    ctx.fillRect(1, 1, 6, 6);
    ctx.fillStyle = '#e07840';
    ctx.fillRect(1, 1, 4, 1);
    ctx.fillRect(1, 1, 1, 4);

    canvas.refresh();
  }

  static createCheckpointFlag(scene) {
    // Checkpoint poles: 16x32 canvas.
    // Unchecked: Red Flag, Checked: Green Flag
    const canvas = scene.textures.createCanvas('checkpoint_canvas', 32, 32);
    const ctx = canvas.context;

    // Draw silver flagpole (both flags share it)
    // Pole 1 (left half of sheet, x = 4)
    ctx.fillStyle = '#808080';
    ctx.fillRect(6, 2, 2, 30);
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(6, 2, 1, 30);
    ctx.fillStyle = '#d80000'; // Red flag
    ctx.fillRect(8, 2, 10, 6);

    // Pole 2 (right half of sheet, x = 20)
    ctx.fillStyle = '#808080';
    ctx.fillRect(22, 2, 2, 30);
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(22, 2, 1, 30);
    ctx.fillStyle = '#00a800'; // Green flag
    ctx.fillRect(24, 2, 10, 6);

    canvas.refresh();
    scene.textures.addSpriteSheet('checkpoint', canvas.canvas, { frameWidth: 16, frameHeight: 32 });
  }
}

export default AssetGenerator;
