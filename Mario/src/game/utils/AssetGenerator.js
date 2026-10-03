// AssetGenerator.js
// Procedurally generates retro HD pixel art/vector textures on canvas.
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

  static createTileset(scene) {
    // 32x32 tiles. 12 tiles -> 384x32
    const canvas = scene.textures.createCanvas('tiles_canvas', 384, 32);
    const ctx = canvas.context;

    // Helper to draw beveled borders for blocks
    const drawBevel = (x, y, w, h, light, dark) => {
      ctx.fillStyle = light;
      ctx.fillRect(x, y, w, 2);
      ctx.fillRect(x, y, 2, h);
      ctx.fillStyle = dark;
      ctx.fillRect(x, y + h - 2, w, 2);
      ctx.fillRect(x + w - 2, y, 2, h);
    };

    // --- TILE 0: Ground (Overworld Grass) ---
    // Dirt base
    let grad = ctx.createLinearGradient(0, 0, 0, 32);
    grad.addColorStop(0, '#9e5527');
    grad.addColorStop(1, '#663314');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    // Grass top
    ctx.fillStyle = '#00a800';
    ctx.fillRect(0, 0, 32, 8);
    ctx.fillStyle = '#78f87c'; // Grass light edge
    ctx.fillRect(0, 0, 32, 2);
    // Grass hanging fringes
    ctx.fillStyle = '#00a800';
    for (let i = 0; i < 32; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 8);
      ctx.lineTo(i + 2, 12);
      ctx.lineTo(i + 4, 8);
      ctx.fill();
    }
    // Dirt stones
    ctx.fillStyle = '#4a230c';
    ctx.fillRect(6, 16, 4, 4);
    ctx.fillRect(20, 22, 6, 4);
    ctx.fillRect(14, 26, 4, 4);

    // --- TILE 1: Brick Platform ---
    ctx.fillStyle = '#8a3116';
    ctx.fillRect(32, 0, 32, 32);
    // Draw 3 horizontal brick lines
    ctx.fillStyle = '#3a0c00';
    ctx.fillRect(32, 10, 32, 2);
    ctx.fillRect(32, 20, 32, 2);
    ctx.fillRect(32, 30, 32, 2);
    // Vertical mortar joints
    ctx.fillRect(32 + 10, 0, 2, 10);
    ctx.fillRect(32 + 26, 0, 2, 10);
    ctx.fillRect(32 + 18, 10, 2, 10);
    ctx.fillRect(32 + 6, 20, 2, 10);
    ctx.fillRect(32 + 22, 20, 2, 10);
    // Highlights on bricks
    ctx.fillStyle = '#e07840';
    ctx.fillRect(33, 1, 9, 2);
    ctx.fillRect(33, 1, 2, 8);
    ctx.fillRect(32 + 11, 1, 14, 2);
    ctx.fillRect(32 + 11, 1, 2, 8);

    // --- TILE 2: Question Block (Active) ---
    grad = ctx.createLinearGradient(64, 0, 64, 32);
    grad.addColorStop(0, '#fce478');
    grad.addColorStop(0.5, '#fcb800');
    grad.addColorStop(1, '#a67000');
    ctx.fillStyle = grad;
    ctx.fillRect(64, 0, 32, 32);
    drawBevel(64, 0, 32, 32, '#ffffff', '#4a3000');
    // Corner rivets
    ctx.fillStyle = '#4a3000';
    ctx.fillRect(64 + 4, 4, 2, 2);
    ctx.fillRect(64 + 26, 4, 2, 2);
    ctx.fillRect(64 + 4, 26, 2, 2);
    ctx.fillRect(64 + 26, 26, 2, 2);
    // Question mark
    ctx.font = 'bold 20px "Press Start 2P", monospace';
    ctx.fillStyle = '#4a3000';
    ctx.fillText('?', 64 + 9, 24);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('?', 64 + 8, 23);

    // --- TILE 3: Empty Hit Block ---
    grad = ctx.createLinearGradient(96, 0, 96, 32);
    grad.addColorStop(0, '#a0a0a0');
    grad.addColorStop(1, '#505050');
    ctx.fillStyle = grad;
    ctx.fillRect(96, 0, 32, 32);
    drawBevel(96, 0, 32, 32, '#e0e0e0', '#202020');
    // Corner rivets
    ctx.fillStyle = '#202020';
    ctx.fillRect(96 + 4, 4, 3, 3);
    ctx.fillRect(96 + 25, 4, 3, 3);
    ctx.fillRect(96 + 4, 25, 3, 3);
    ctx.fillRect(96 + 25, 25, 3, 3);

    // --- TILE 4: Green Pipe Top-Left ---
    grad = ctx.createLinearGradient(128, 0, 128 + 16, 0);
    grad.addColorStop(0, '#004400');
    grad.addColorStop(0.5, '#78f87c');
    grad.addColorStop(1, '#008800');
    ctx.fillStyle = grad;
    ctx.fillRect(128, 0, 16, 32);
    // Outer border
    ctx.fillStyle = '#000';
    ctx.fillRect(128, 0, 1, 32);

    // --- TILE 5: Green Pipe Top-Right ---
    grad = ctx.createLinearGradient(144, 0, 144 + 16, 0);
    grad.addColorStop(0, '#008800');
    grad.addColorStop(0.5, '#78f87c');
    grad.addColorStop(0.8, '#004400');
    grad.addColorStop(1, '#002200');
    ctx.fillStyle = grad;
    ctx.fillRect(144, 0, 16, 32);
    ctx.fillStyle = '#000';
    ctx.fillRect(144 + 15, 0, 1, 32);

    // --- TILE 6: Green Pipe Body-Left ---
    grad = ctx.createLinearGradient(160, 0, 160 + 16, 0);
    grad.addColorStop(0, '#005800');
    grad.addColorStop(0.6, '#78f87c');
    grad.addColorStop(1, '#008800');
    ctx.fillStyle = grad;
    ctx.fillRect(160, 0, 16, 32);
    ctx.fillStyle = '#000';
    ctx.fillRect(160, 0, 2, 32); // Thicker left border for body

    // --- TILE 7: Green Pipe Body-Right ---
    grad = ctx.createLinearGradient(176, 0, 176 + 16, 0);
    grad.addColorStop(0, '#008800');
    grad.addColorStop(0.6, '#78f87c');
    grad.addColorStop(0.8, '#005800');
    grad.addColorStop(1, '#003000');
    ctx.fillStyle = grad;
    ctx.fillRect(176, 0, 16, 32);
    ctx.fillStyle = '#000';
    ctx.fillRect(176 + 14, 0, 2, 32);

    // --- TILE 8: Cloud ---
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(192, 0, 32, 32);
    ctx.fillStyle = '#ffffff';
    // Draw rounded fluffy clouds
    ctx.beginPath();
    ctx.arc(192 + 16, 20, 10, 0, Math.PI * 2);
    ctx.arc(192 + 8, 22, 7, 0, Math.PI * 2);
    ctx.arc(192 + 24, 22, 7, 0, Math.PI * 2);
    ctx.fill();
    // Shadow / outline
    ctx.strokeStyle = '#d0e0f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(192 + 16, 20, 10, 0, Math.PI * 2);
    ctx.stroke();

    // --- TILE 9: Spike (Hazard) ---
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(224, 0, 32, 32);
    // Draw 3 steel spikes
    for (let s = 0; s < 3; s++) {
      const sx = 224 + s * 10 + 2;
      grad = ctx.createLinearGradient(sx, 0, sx + 8, 0);
      grad.addColorStop(0, '#505050');
      grad.addColorStop(0.5, '#f0f0f0');
      grad.addColorStop(1, '#303030');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(sx, 32);
      ctx.lineTo(sx + 4, 4);
      ctx.lineTo(sx + 8, 32);
      ctx.fill();
      // Draw dark border around spike
      ctx.strokeStyle = '#101010';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // --- TILE 10: Castle Brick ---
    ctx.fillStyle = '#383848';
    ctx.fillRect(256, 0, 32, 32);
    drawBevel(256, 0, 32, 32, '#585868', '#181828');
    // Mortar lines
    ctx.fillStyle = '#181828';
    ctx.fillRect(256, 16, 32, 2);
    ctx.fillRect(256 + 16, 0, 2, 16);
    ctx.fillRect(256 + 8, 16, 2, 16);
    ctx.fillRect(256 + 24, 16, 2, 16);

    // --- TILE 11: Moving Platform Block ---
    grad = ctx.createLinearGradient(288, 0, 288, 32);
    grad.addColorStop(0, '#f8b838');
    grad.addColorStop(1, '#a06000');
    ctx.fillStyle = grad;
    ctx.fillRect(288, 0, 32, 32);
    drawBevel(288, 0, 32, 32, '#ffdf80', '#503000');
    // Wooden lines
    ctx.fillStyle = '#503000';
    ctx.fillRect(288 + 4, 8, 24, 2);
    ctx.fillRect(288 + 4, 16, 24, 2);
    ctx.fillRect(288 + 4, 24, 24, 2);

    canvas.refresh();
    scene.textures.addSpriteSheet('tiles', canvas.canvas, { frameWidth: 32, frameHeight: 32 });
  }

  static createPlayerSprites(scene) {
    // Player is 32x48 size. 4 frames -> 128x48
    const canvas = scene.textures.createCanvas('player_canvas', 128, 48);
    const ctx = canvas.context;

    // We draw 4 frames of size 32x48
    for (let f = 0; f < 4; f++) {
      const fx = f * 32;

      // Draw Mario shapes
      // 1. Shoes
      ctx.fillStyle = '#5c2c0c'; // Brown
      if (f === 1) {
        // Walk 1
        ctx.fillRect(fx + 6, 42, 8, 6); // left
        ctx.fillRect(fx + 18, 40, 8, 6); // right
      } else if (f === 2) {
        // Walk 2
        ctx.fillRect(fx + 4, 40, 8, 6);
        ctx.fillRect(fx + 16, 42, 8, 6);
      } else if (f === 3) {
        // Jump
        ctx.fillRect(fx + 4, 38, 8, 6);
        ctx.fillRect(fx + 18, 42, 8, 6);
      } else {
        // Idle
        ctx.fillRect(fx + 6, 42, 8, 6);
        ctx.fillRect(fx + 18, 42, 8, 6);
      }

      // 2. Overalls / Pants
      ctx.fillStyle = '#0024f0'; // Blue denim
      ctx.fillRect(fx + 8, 30, 16, 12);
      ctx.fillRect(fx + 8, 40, 6, 4);
      ctx.fillRect(fx + 18, 40, 6, 4);

      // Overalls Straps
      ctx.fillRect(fx + 8, 22, 4, 8);
      ctx.fillRect(fx + 20, 22, 4, 8);

      // Buttons (Gold)
      ctx.fillStyle = '#fcb800';
      ctx.fillRect(fx + 9, 28, 2, 2);
      ctx.fillRect(fx + 21, 28, 2, 2);

      // 3. Shirt & Sleeves (Red)
      ctx.fillStyle = '#e02800';
      ctx.fillRect(fx + 8, 20, 16, 10); // torso shirt
      
      // Arms animation
      if (f === 1) {
        // Walk 1
        ctx.fillRect(fx + 4, 20, 4, 8); // left arm down
        ctx.fillRect(fx + 24, 18, 4, 8); // right arm swing
      } else if (f === 2) {
        // Walk 2
        ctx.fillRect(fx + 2, 18, 4, 8);
        ctx.fillRect(fx + 24, 20, 4, 8);
      } else if (f === 3) {
        // Jump: Right arm pointing UP!
        ctx.fillRect(fx + 4, 22, 4, 8); // left arm down
        ctx.fillRect(fx + 24, 10, 4, 10); // right arm high
        // White glove high
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(fx + 23, 6, 6, 5);
        ctx.fillStyle = '#e02800';
      } else {
        // Idle
        ctx.fillRect(fx + 4, 20, 4, 8);
        ctx.fillRect(fx + 24, 20, 4, 8);
      }

      // 4. White Gloves (if not already jumping arm)
      ctx.fillStyle = '#ffffff';
      if (f !== 3) {
        ctx.fillRect(fx + 3, 27, 5, 5);
        ctx.fillRect(fx + 24, 27, 5, 5);
      } else {
        ctx.fillRect(fx + 3, 29, 5, 5);
      }

      // 5. Head (Face peach)
      ctx.fillStyle = '#fcc078';
      ctx.fillRect(fx + 8, 8, 16, 12);
      // Nose
      ctx.fillRect(fx + 22, 11, 4, 4);
      // Mustache
      ctx.fillStyle = '#301800';
      ctx.fillRect(fx + 18, 14, 7, 3);
      // Sideburns / Hair
      ctx.fillRect(fx + 8, 8, 4, 8);
      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(fx + 18, 9, 2, 4);

      // 6. Cap (Red)
      ctx.fillStyle = '#e02800';
      ctx.fillRect(fx + 8, 3, 16, 6);
      ctx.fillRect(fx + 10, 6, 16, 3); // cap visor
      // Cap emblem (white dot + red M dot)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fx + 12, 4, 4, 4);
      ctx.fillStyle = '#e02800';
      ctx.fillRect(fx + 13, 5, 2, 2);
    }

    canvas.refresh();
    scene.textures.addSpriteSheet('player', canvas.canvas, { frameWidth: 32, frameHeight: 48 });
  }

  static createEnemySprites(scene) {
    // Enemies sheet: 128 x 32 (4 frames of 32x32)
    // Frame 0-1: Goomba, Frame 2-3: Paratroopa
    const enemyCanvas = scene.textures.createCanvas('enemies_canvas', 128, 32);
    const eCtx = enemyCanvas.context;

    for (let f = 0; f < 4; f++) {
      const fx = f * 32;

      if (f < 2) {
        // --- GOOMBA ---
        // Feet (Brown)
        eCtx.fillStyle = '#5c2c0c';
        if (f === 0) {
          eCtx.fillRect(fx + 6, 26, 8, 6);
          eCtx.fillRect(fx + 18, 24, 8, 6);
        } else {
          eCtx.fillRect(fx + 6, 24, 8, 6);
          eCtx.fillRect(fx + 18, 26, 8, 6);
        }
        // Stem / Face (Beige)
        eCtx.fillStyle = '#fcd8a8';
        eCtx.fillRect(fx + 10, 16, 12, 10);
        // Head / Cap (Dark Brown)
        eCtx.fillStyle = '#7a3b0e';
        eCtx.beginPath();
        eCtx.arc(fx + 16, 14, 11, Math.PI, 0);
        eCtx.fill();
        eCtx.fillRect(fx + 5, 14, 22, 6);
        // Face details
        eCtx.fillStyle = '#000000'; // Eyes
        eCtx.fillRect(fx + 11, 17, 2, 4);
        eCtx.fillRect(fx + 19, 17, 2, 4);
        // Angry eyebrows
        eCtx.beginPath();
        eCtx.moveTo(fx + 9, 15);
        eCtx.lineTo(fx + 14, 18);
        eCtx.moveTo(fx + 23, 15);
        eCtx.lineTo(fx + 18, 18);
        eCtx.strokeStyle = '#000000';
        eCtx.lineWidth = 1.5;
        eCtx.stroke();
      } else {
        // --- PARATROOPA ---
        // Red shell base
        eCtx.fillStyle = '#e02800';
        eCtx.beginPath();
        eCtx.arc(fx + 16, 18, 9, 0, Math.PI * 2);
        eCtx.fill();
        // Yellow head
        eCtx.fillStyle = '#fcd8a8';
        eCtx.beginPath();
        eCtx.arc(fx + 16, 10, 7, 0, Math.PI * 2);
        eCtx.fill();
        // Eyes
        eCtx.fillStyle = '#000';
        eCtx.fillRect(fx + 16, 8, 2, 4);
        // Wings (White)
        eCtx.fillStyle = '#ffffff';
        if (f === 2) {
          // wings flap down
          eCtx.fillRect(fx + 4, 14, 6, 10);
        } else {
          // wings flap up
          eCtx.fillRect(fx + 4, 6, 6, 10);
        }
        eCtx.strokeStyle = '#d0d0d0';
        eCtx.lineWidth = 1;
        eCtx.strokeRect(fx + 4, f === 2 ? 14 : 6, 6, 10);
        // Green shoes
        eCtx.fillStyle = '#00a800';
        eCtx.fillRect(fx + 10, 26, 5, 6);
        eCtx.fillRect(fx + 17, 26, 5, 6);
      }
    }

    enemyCanvas.refresh();
    scene.textures.addSpriteSheet('enemies', enemyCanvas.canvas, { frameWidth: 32, frameHeight: 32 });

    // --- BOSS CANVAS (64x64, 4 frames) ---
    // Frame 0-1: Move left/right, Frame 2: Open mouth fire, Frame 3: Hurt
    const bossCanvas = scene.textures.createCanvas('boss_canvas', 256, 64);
    const bCtx = bossCanvas.context;

    for (let f = 0; f < 4; f++) {
      const fx = f * 64;

      // Color Palette values
      const colorG = '#00a800'; // Green body
      const colorY = '#fcb800'; // Gold/Yellow front
      const colorR = '#e02800'; // Red spikes
      const colorW = '#ffffff'; // White spikes
      const colorB = '#000000'; // Black outlines

      // Draw general green circular body
      bCtx.fillStyle = colorG;
      bCtx.beginPath();
      bCtx.arc(fx + 32, 36, 20, 0, Math.PI * 2);
      bCtx.fill();

      // Yellow belly plate
      bCtx.fillStyle = colorY;
      bCtx.beginPath();
      bCtx.arc(fx + 28, 40, 13, 0, Math.PI * 2);
      bCtx.fill();

      // Red hair/mane on back
      bCtx.fillStyle = colorR;
      bCtx.fillRect(fx + 16, 8, 24, 8);
      bCtx.fillRect(fx + 44, 20, 8, 24);

      // White Horns and Spikes
      bCtx.fillStyle = colorW;
      bCtx.fillRect(fx + 8, 24, 6, 6); // Spikes on back shell
      bCtx.fillRect(fx + 12, 36, 6, 6);
      bCtx.fillRect(fx + 36, 12, 6, 8); // Horn on head

      // Black eyes
      bCtx.fillStyle = colorB;
      bCtx.fillRect(fx + 24, 22, 4, 6);
      bCtx.fillRect(fx + 32, 22, 4, 6);

      // Mouth
      if (f === 2) {
        // Red fire mouth glow
        bCtx.fillStyle = colorR;
        bCtx.fillRect(fx + 12, 30, 12, 6);
      } else {
        bCtx.fillStyle = colorY;
        bCtx.fillRect(fx + 16, 30, 10, 4);
      }

      // Hurt state tint
      if (f === 3) {
        bCtx.fillStyle = 'rgba(255, 0, 0, 0.4)';
        bCtx.beginPath();
        bCtx.arc(fx + 32, 36, 22, 0, Math.PI * 2);
        bCtx.fill();
      }

      // Feet
      bCtx.fillStyle = colorY;
      if (f % 2 === 0) {
        bCtx.fillRect(fx + 16, 56, 8, 8);
        bCtx.fillRect(fx + 40, 56, 8, 8);
      } else {
        bCtx.fillRect(fx + 12, 56, 8, 8);
        bCtx.fillRect(fx + 36, 56, 8, 8);
      }
    }

    bossCanvas.refresh();
    scene.textures.addSpriteSheet('boss', bossCanvas.canvas, { frameWidth: 64, frameHeight: 64 });
  }

  static createPowerUpSprites(scene) {
    // coin sheet: 128 x 32 (4 frames of 32x32)
    const coinCanvas = scene.textures.createCanvas('coin_canvas', 128, 32);
    const cCtx = coinCanvas.context;
    for (let f = 0; f < 4; f++) {
      const cx = f * 32;
      let coinWidth = 24;
      if (f === 1) coinWidth = 16;
      if (f === 2) coinWidth = 6;
      if (f === 3) coinWidth = 16;

      cCtx.fillStyle = '#fcb800'; // Gold
      cCtx.beginPath();
      cCtx.ellipse(cx + 16, 16, coinWidth / 2, 12, 0, 0, Math.PI * 2);
      cCtx.fill();

      cCtx.strokeStyle = '#fce478'; // Inner highlight
      cCtx.lineWidth = 2;
      cCtx.beginPath();
      cCtx.ellipse(cx + 16, 16, (coinWidth / 2) - 2, 8, 0, 0, Math.PI * 2);
      cCtx.stroke();
    }
    coinCanvas.refresh();
    scene.textures.addSpriteSheet('coin', coinCanvas.canvas, { frameWidth: 32, frameHeight: 32 });

    // Second: "powerups" sheet (96 x 32) for Mushroom (0), Star (1), 1UP (2)
    const puCanvas = scene.textures.createCanvas('powerups_canvas', 96, 32);
    const puCtx = puCanvas.context;

    // 0: Mushroom (Red/Beige)
    // Red Cap
    puCtx.fillStyle = '#f87858';
    puCtx.beginPath();
    puCtx.arc(16, 16, 12, Math.PI, 0);
    puCtx.fill();
    // Spots (White)
    puCtx.fillStyle = '#ffffff';
    puCtx.fillRect(8, 10, 4, 4);
    puCtx.fillRect(16, 6, 4, 4);
    puCtx.fillRect(20, 10, 4, 4);
    // Stem (Beige)
    puCtx.fillStyle = '#fcd8a8';
    puCtx.fillRect(12, 16, 8, 14);
    puCtx.fillStyle = '#00a800'; // wait, eyes are black
    puCtx.fillStyle = '#000';
    puCtx.fillRect(12, 20, 2, 4); // eyes
    puCtx.fillRect(18, 20, 2, 4);

    // 1: Star (Yellow with black eyes)
    puCtx.fillStyle = '#fcb800';
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
    drawStar(48, 16, 5, 14, 6);
    puCtx.fillStyle = '#000'; // Star eyes
    puCtx.fillRect(44, 12, 2, 6);
    puCtx.fillRect(50, 12, 2, 6);

    // 2: 1UP Mushroom (Green/Beige)
    puCtx.fillStyle = '#00a800'; // Green Cap
    puCtx.beginPath();
    puCtx.arc(80, 16, 12, Math.PI, 0);
    puCtx.fill();
    // Spots (White)
    puCtx.fillStyle = '#ffffff';
    puCtx.fillRect(72, 10, 4, 4);
    puCtx.fillRect(80, 6, 4, 4);
    puCtx.fillRect(84, 10, 4, 4);
    // Stem
    puCtx.fillStyle = '#fcd8a8';
    puCtx.fillRect(76, 16, 8, 14);
    puCtx.fillStyle = '#000';
    puCtx.fillRect(76, 20, 2, 4);
    puCtx.fillRect(82, 20, 2, 4);

    puCanvas.refresh();
    scene.textures.addSpriteSheet('powerups', puCanvas.canvas, { frameWidth: 32, frameHeight: 32 });
  }

  static createFireballSprite(scene) {
    const canvas = scene.textures.createCanvas('fireball', 16, 16);
    const ctx = canvas.context;
    // Red core with orange-yellow glow
    ctx.fillStyle = '#e02800';
    ctx.beginPath();
    ctx.arc(8, 8, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fcb800';
    ctx.beginPath();
    ctx.arc(8, 8, 3, 0, Math.PI * 2);
    ctx.fill();

    canvas.refresh();
  }

  static createParticleSprites(scene) {
    const canvas = scene.textures.createCanvas('particles', 16, 16);
    const ctx = canvas.context;
    // Red-brown brick debris particle
    ctx.fillStyle = '#b84418';
    ctx.fillRect(2, 2, 12, 12);
    ctx.fillStyle = '#e07840';
    ctx.fillRect(2, 2, 8, 2);
    ctx.fillRect(2, 2, 2, 8);

    canvas.refresh();
  }

  static createCheckpointFlag(scene) {
    // Flag pole: 64 x 64 (2 frames of 32x64)
    const canvas = scene.textures.createCanvas('checkpoint_canvas', 64, 64);
    const ctx = canvas.context;

    // Draw silver flagpole (both flags share it)
    // Pole 1 (left half of sheet, x = 12, y = 4 to 60)
    ctx.fillStyle = '#808080';
    ctx.fillRect(12, 4, 4, 56);
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(12, 4, 2, 56);
    ctx.fillStyle = '#d80000'; // Red flag
    ctx.fillRect(16, 4, 14, 12);

    // Pole 2 (right half of sheet, x = 44, y = 4 to 60)
    ctx.fillStyle = '#808080';
    ctx.fillRect(44, 4, 4, 56);
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(44, 4, 2, 56);
    ctx.fillStyle = '#00a800'; // Green flag
    ctx.fillRect(48, 4, 14, 12);

    canvas.refresh();
    scene.textures.addSpriteSheet('checkpoint', canvas.canvas, { frameWidth: 32, frameHeight: 64 });
  }
}

export default AssetGenerator;
