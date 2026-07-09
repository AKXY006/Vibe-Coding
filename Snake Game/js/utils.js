/* Utility functions and Particle system for SnakeX */

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Draws a rounded rectangle on a Canvas 2D context
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @param {number} radius 
 */
export function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

/**
 * Represents a single glowing particle from an explosion
 */
export class Particle {
    /**
     * @param {number} x - Start X coordinate
     * @param {number} y - Start Y coordinate
     * @param {string} color - Neon color code
     */
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        
        // Random angle and speed
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.size = Math.random() * 3 + 1.5;
        this.alpha = 1.0;
        this.decay = Math.random() * 0.03 + 0.015;
    }

    /**
     * Updates particle position and fades it out
     */
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Apply tiny friction
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        this.alpha -= this.decay;
    }

    /**
     * Renders particle with neon glow
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        
        // Add neon glow
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
