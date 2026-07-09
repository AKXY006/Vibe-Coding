/* Food generator and renderer for SnakeX */

import { getRandomInt } from './utils.js';

export class Food {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.type = 'normal'; // 'normal' or 'golden'
        this.spawnTime = 0;
        this.lifetimeLimit = 6000; // Golden apple disappears after 6 seconds
        this.pulseTimer = 0;
    }

    /**
     * Spawns a food item in a vacant grid cell
     * @param {Array} snakeBody - Array of {x, y} segments
     * @param {Array} obstacles - Array of {x, y} obstacle cells
     * @param {number} gridSize - Board size
     */
    spawn(snakeBody, obstacles = [], gridSize = 25) {
        let attempts = 0;
        let valid = false;

        while (!valid && attempts < 250) {
            attempts++;
            const tx = getRandomInt(0, gridSize - 1);
            const ty = getRandomInt(0, gridSize - 1);

            // Check if coordinates overlap with snake body or obstacles
            const hitsSnake = snakeBody.some(segment => segment.x === tx && segment.y === ty);
            const hitsObstacles = obstacles.some(obs => obs.x === tx && obs.y === ty);

            if (!hitsSnake && !hitsObstacles) {
                this.x = tx;
                this.y = ty;
                valid = true;
            }
        }

        // Decide food type: 15% chance of Golden Apple
        this.type = Math.random() < 0.15 ? 'golden' : 'normal';
        this.spawnTime = Date.now();
    }

    /**
     * Checks if golden apple has expired. If so, spawns normal apple.
     * @returns {boolean} - Returns true if expired
     */
    checkExpiry(snakeBody, obstacles, gridSize) {
        if (this.type === 'golden') {
            const elapsed = Date.now() - this.spawnTime;
            if (elapsed >= this.lifetimeLimit) {
                this.spawn(snakeBody, obstacles, gridSize);
                return true;
            }
        }
        return false;
    }

    /**
     * Renders the food cell with pulsing glows, leaves, and custom styling
     */
    draw(ctx, cellSize) {
        ctx.save();

        const xCenter = this.x * cellSize + cellSize / 2;
        const yCenter = this.y * cellSize + cellSize / 2;
        const baseRadius = (cellSize / 2) * 0.8;

        // Calculate pulsing scale factor
        const pulse = Math.sin(Date.now() / 150) * 0.12 + 0.88;
        const radius = baseRadius * pulse;

        if (this.type === 'golden') {
            // Neon Amber/Gold Glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffd700';
            ctx.fillStyle = '#ffd700';
            
            // Draw golden apple body
            ctx.beginPath();
            ctx.arc(xCenter, yCenter, radius, 0, Math.PI * 2);
            ctx.fill();

            // Inner gloss effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(xCenter - radius * 0.3, yCenter - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
            ctx.fill();

            // Tiny leaf/stem
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(xCenter, yCenter - radius);
            ctx.quadraticCurveTo(xCenter + 3, yCenter - radius - 5, xCenter + 5, yCenter - radius - 4);
            ctx.stroke();

            // Golden sparks/rings
            const ringScale = Math.sin(Date.now() / 250) * 0.3 + 1.2;
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(xCenter, yCenter, baseRadius * ringScale, 0, Math.PI * 2);
            ctx.stroke();

            // Draw timer bar beneath the golden apple grid block
            const elapsed = Date.now() - this.spawnTime;
            const percentage = Math.max(0, 1 - elapsed / this.lifetimeLimit);
            
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
            ctx.fillRect(this.x * cellSize + 2, (this.y + 1) * cellSize - 3, (cellSize - 4) * percentage, 2);

        } else {
            // Neon Pink/Red Glow
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#ff007f';
            ctx.fillStyle = '#ff007f';

            // Draw normal apple body
            ctx.beginPath();
            ctx.arc(xCenter, yCenter, radius, 0, Math.PI * 2);
            ctx.fill();

            // Inner gloss effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(xCenter - radius * 0.3, yCenter - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
            ctx.fill();

            // Green leaf
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(xCenter, yCenter - radius);
            ctx.quadraticCurveTo(xCenter + 2, yCenter - radius - 4, xCenter + 4, yCenter - radius - 3);
            ctx.stroke();
        }

        ctx.restore();
    }
}
