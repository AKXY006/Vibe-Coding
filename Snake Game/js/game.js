/* Core Game Orchestrator & Loop for SnakeX */

import { Controls } from './controls.js';
import { Level } from './level.js';
import { Score } from './score.js';
import { Food } from './food.js';
import { Snake } from './snake.js';
import { CollisionEngine } from './collision.js';
import { UI } from './ui.js';
import { StorageManager } from './storage.js';
import { Sound } from './sound.js';
import { Particle } from './utils.js';

const STATES = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAMEOVER: 'GAMEOVER'
};

class GameEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.state = STATES.MENU;
        this.gridSize = 25; // 25x25 cells grid
        
        // Game modules
        this.snake = new Snake();
        this.food = new Food();
        
        // Timing trackers
        this.lastTickTime = 0;
        this.animationId = null;
        
        // Visual effects
        this.particles = [];
    }

    /**
     * Set up canvas context and bind engine triggers to UI
     */
    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Setup high-DPI scaling for sharp drawing
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Initialize input handlers
        Controls.init({
            onPause: () => this.togglePause(),
            onRestart: () => this.startGame(),
            onQuit: () => this.quitToMenu()
        });

        // Initialize DOM UI callbacks
        UI.init({
            onStartGame: () => this.startGame(),
            onResumeGame: () => this.togglePause(),
            onQuitGame: () => this.quitToMenu()
        });

        // Setup initial menu state
        this.state = STATES.MENU;
        UI.showStartMenu();

        // Start render-only loop for menu particle/grid background
        this.lastTickTime = performance.now();
        this.loop(this.lastTickTime);
    }

    /**
     * Resolves subpixel blurring on Retina/high-DPI screens
     */
    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        
        // Fixed dimensions for layout rendering
        const size = Math.floor(rect.width);
        this.canvas.width = size;
        this.canvas.height = size;
    }

    /**
     * Start/Restart play state
     */
    startGame() {
        const settings = StorageManager.getSettings();
        
        // Reset state managers
        Score.reset(Level.difficulty);
        Level.reset();
        Controls.reset();
        
        // Initialize snake with skin selection
        this.snake.reset(12, 12, settings.skin);
        
        // Set initial difficulty speed & obstacles
        Level.setLevel(1, this.snake.body, this.food, this.gridSize);
        
        // Spawn first food item
        this.food.spawn(this.snake.body, Level.obstacles, this.gridSize);

        // Reset visual particles
        this.particles = [];

        // Set game states
        this.state = STATES.PLAYING;
        UI.hideOverlays();
        
        // Update HUD display indicators
        UI.updateScoreDisplay(Score.score);
        UI.updateHighScoreDisplay(Score.highScore);
        UI.updateLevelDisplay(Score.level);

        // Lazily activate Web Audio
        Sound.init();
        if (Sound.musicEnabled) {
            Sound.startMusic();
        }

        this.lastTickTime = performance.now();
    }

    /**
     * Toggles game pause/resume
     */
    togglePause() {
        if (this.state === STATES.PLAYING) {
            this.state = STATES.PAUSED;
            UI.showPauseScreen();
            if (Sound.musicEnabled) Sound.stopMusic();
        } else if (this.state === STATES.PAUSED) {
            this.state = STATES.PLAYING;
            UI.hideOverlays();
            this.lastTickTime = performance.now();
            if (Sound.musicEnabled) Sound.startMusic();
        }
    }

    /**
     * Return back to main menu
     */
    quitToMenu() {
        this.state = STATES.MENU;
        this.particles = [];
        if (Sound.musicEnabled) Sound.stopMusic();
        UI.showStartMenu();
    }

    /**
     * Game over logic
     */
    triggerGameOver(reason) {
        this.state = STATES.GAMEOVER;
        Sound.playCollision();
        if (Sound.musicEnabled) Sound.stopMusic();

        const isNewRecord = Score.checkAndSaveHighScore(Level.difficulty);
        UI.showGameOverScreen(
            reason, 
            Score.score, 
            Score.highScore, 
            isNewRecord, 
            Level.difficulty
        );
    }

    /**
     * Standard game tick logic update
     */
    tick() {
        const nextDir = Controls.getNextDirection();
        
        // Move snake
        this.snake.move(nextDir, Level.shouldWrapWalls(), this.gridSize);
        Controls.setDirection(nextDir);

        // Check if head eats the food
        const head = this.snake.body[0];
        if (head.x === this.food.x && head.y === this.food.y) {
            const isGolden = this.food.type === 'golden';
            
            // Increment length and score
            this.snake.grow(1);
            const levelChanged = Score.addFoodPoints(this.food.type, Level.difficulty);
            
            // Audio response
            Sound.playEat(isGolden);

            // Trigger neon particle boom at food coords
            const cellSize = this.canvas.width / this.gridSize;
            const px = this.food.x * cellSize + cellSize / 2;
            const py = this.food.y * cellSize + cellSize / 2;
            const pColor = isGolden ? '#ffd700' : '#ff007f';
            
            this.createExplosion(px, py, pColor, 15);

            // Check if level has advanced
            if (levelChanged) {
                Sound.playLevelUp();
                Level.setLevel(Score.level, this.snake.body, this.food, this.gridSize);
                
                // Show floating text overlay effect (part of UI polish)
                UI.updateLevelDisplay(Score.level);
            }

            // Spawn next food
            this.food.spawn(this.snake.body, Level.obstacles, this.gridSize);
            UI.updateScoreDisplay(Score.score);
        } else {
            // Check golden apple timer expiry
            const expired = this.food.checkExpiry(this.snake.body, Level.obstacles, this.gridSize);
            if (expired) {
                // Play simple fade sound or let it just vanish
            }
        }

        // Verify collision
        const collision = CollisionEngine.check(
            this.snake, 
            Level.obstacles, 
            this.gridSize, 
            Level.shouldWrapWalls()
        );
        
        if (collision.isGameOver) {
            this.triggerGameOver(collision.reason);
        }
    }

    /**
     * Spawns a cluster of neon sparks
     */
    createExplosion(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    /**
     * Master animation & render sequence loop
     */
    loop(currentTime) {
        this.animationId = requestAnimationFrame((time) => this.loop(time));
        
        // Handle tick timing if playing
        if (this.state === STATES.PLAYING) {
            const delta = currentTime - this.lastTickTime;
            const delay = Level.getTickDelay();
            
            if (delta >= delay) {
                this.tick();
                // Avoid accumulation errors on heavy lag spikes
                this.lastTickTime = currentTime - (delta % delay);
            }
        }

        // Always draw the board and particles
        this.draw();
    }

    /**
     * Paints canvas grid, snake, food, particles, and obstacles
     */
    draw() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const cellSize = width / this.gridSize;

        // Clear screen
        ctx.clearRect(0, 0, width, width);

        // Fetch CSS values dynamically for perfect theme binding
        const bodyStyle = getComputedStyle(document.body);
        const gridColor = bodyStyle.getPropertyValue('--grid-color').trim() || 'rgba(0, 242, 254, 0.05)';
        
        // 1. Draw subtle grid backdrop
        ctx.save();
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.gridSize; i++) {
            const pos = i * cellSize;
            
            // Vertical line
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, width);
            ctx.stroke();

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(width, pos);
            ctx.stroke();
        }
        ctx.restore();

        // 2. Draw level obstacles (Hard mode)
        if (this.state === STATES.PLAYING || this.state === STATES.PAUSED || this.state === STATES.GAMEOVER) {
            Level.drawObstacles(ctx, cellSize);
        }

        // 3. Draw food apple
        if (this.state === STATES.PLAYING || this.state === STATES.PAUSED) {
            this.food.draw(ctx, cellSize);
        }

        // 4. Draw snake
        if (this.state === STATES.PLAYING || this.state === STATES.PAUSED || this.state === STATES.GAMEOVER) {
            this.snake.draw(ctx, cellSize);
        }

        // 5. Draw and prune glow particles
        this.particles.forEach((p, idx) => {
            p.update();
            if (p.alpha <= 0) {
                this.particles.splice(idx, 1);
            } else {
                p.draw(ctx);
            }
        });
    }
}

export const Game = new GameEngine();
