/* Difficulty and Speed/Level configuration for SnakeX */

import { getRandomInt } from './utils.js';

class LevelManager {
    constructor() {
        this.difficulty = 'medium';
        this.level = 1;
        this.baseSpeed = 130; // Milliseconds per tick
        this.currentSpeed = 130;
        this.obstacles = []; // Array of {x, y} coordinates
        
        // Difficulty parameters
        this.configs = {
            easy: {
                initialSpeed: 160,
                speedDecrement: 0, // Constant speed
                minSpeed: 160,
                wrapWalls: true,
                obstacleCount: 0
            },
            medium: {
                initialSpeed: 130,
                speedDecrement: 6,
                minSpeed: 70,
                wrapWalls: false,
                obstacleCount: 0
            },
            hard: {
                initialSpeed: 100,
                speedDecrement: 8,
                minSpeed: 45,
                wrapWalls: false,
                obstacleCount: 4 // Spawns initial obstacles
            }
        };
    }

    /**
     * Sets game difficulty
     * @param {string} difficulty - 'easy', 'medium', or 'hard'
     */
    setDifficulty(difficulty) {
        if (this.configs[difficulty]) {
            this.difficulty = difficulty;
            this.reset();
        }
    }

    /**
     * Resets level manager state
     */
    reset() {
        this.level = 1;
        const config = this.configs[this.difficulty];
        this.currentSpeed = config.initialSpeed;
        this.obstacles = [];
    }

    /**
     * Returns whether walls should wrap around or kill the snake
     * @returns {boolean}
     */
    shouldWrapWalls() {
        return this.configs[this.difficulty].wrapWalls;
    }

    /**
     * Get current game tick delay (speed)
     * @returns {number}
     */
    getTickDelay() {
        return this.currentSpeed;
    }

    /**
     * Advance level and calculate speed scaling
     * @param {number} newLevel 
     * @param {Array} snakeBody - to avoid spawning obstacles on snake
     * @param {Object} food - to avoid spawning obstacles on food
     * @param {number} gridSize - grid boundaries
     */
    setLevel(newLevel, snakeBody = [], food = null, gridSize = 25) {
        this.level = newLevel;
        const config = this.configs[this.difficulty];
        
        // Calculate new speed
        this.currentSpeed = Math.max(
            config.minSpeed,
            config.initialSpeed - (newLevel - 1) * config.speedDecrement
        );

        // Generate obstacles on Hard difficulty
        if (this.difficulty === 'hard') {
            const desiredCount = config.obstacleCount + (newLevel - 1); // 1 extra obstacle per level
            this.generateObstacles(desiredCount, snakeBody, food, gridSize);
        } else {
            this.obstacles = [];
        }
    }

    /**
     * Generate random obstacles in empty cells
     */
    generateObstacles(count, snakeBody, food, gridSize) {
        this.obstacles = [];
        let attempts = 0;
        
        // Avoid spawning obstacles near the snake's head (middle starting area)
        const isNearCenter = (x, y) => {
            const centerX = Math.floor(gridSize / 2);
            const centerY = Math.floor(gridSize / 2);
            return Math.abs(x - centerX) < 4 && Math.abs(y - centerY) < 4;
        };

        while (this.obstacles.length < count && attempts < 200) {
            attempts++;
            const ox = getRandomInt(1, gridSize - 2);
            const oy = getRandomInt(1, gridSize - 2);

            // Verify position is vacant
            const matchesSnake = snakeBody.some(segment => segment.x === ox && segment.y === oy);
            const matchesFood = food && food.x === ox && food.y === oy;
            const matchesExisting = this.obstacles.some(obs => obs.x === ox && obs.y === oy);
            
            if (!matchesSnake && !matchesFood && !matchesExisting && !isNearCenter(ox, oy)) {
                this.obstacles.push({ x: ox, y: oy });
            }
        }
    }

    /**
     * Renders obstacles onto the canvas
     */
    drawObstacles(ctx, cellSize) {
        if (this.obstacles.length === 0) return;
        
        ctx.save();
        ctx.fillStyle = '#64748b'; // Slate grey for rocky/steel obstacles
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#475569';
        
        this.obstacles.forEach(obs => {
            // Draw a cross or rock styled block
            const x = obs.x * cellSize;
            const y = obs.y * cellSize;
            const size = cellSize;
            
            ctx.beginPath();
            ctx.rect(x + 2, y + 2, size - 4, size - 4);
            ctx.fill();

            // Inner dark details
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + 5, y + 5);
            ctx.lineTo(x + size - 5, y + size - 5);
            ctx.moveTo(x + size - 5, y + 5);
            ctx.lineTo(x + 5, y + size - 5);
            ctx.stroke();
        });
        
        ctx.restore();
    }
}

export const Level = new LevelManager();
