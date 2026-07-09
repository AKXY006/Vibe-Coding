/* Snake mechanics and skin rendering for SnakeX */

import { drawRoundedRect } from './utils.js';

export class Snake {
    constructor() {
        this.body = [];
        this.direction = 'RIGHT';
        this.growPending = 0;
        this.skin = 'green';
    }

    /**
     * Resets snake segments to starting state
     * @param {number} startX - Middle X grid position
     * @param {number} startY - Middle Y grid position
     * @param {string} skin - Chosen skin style
     */
    reset(startX = 12, startY = 12, skin = 'green') {
        this.direction = 'RIGHT';
        this.growPending = 0;
        this.skin = skin;
        
        // Start with 3 segments
        this.body = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];
    }

    /**
     * Grow the snake by N segments
     * @param {number} count 
     */
    grow(count = 1) {
        this.growPending += count;
    }

    /**
     * Advances the snake one grid unit
     * @param {string} nextDir - Calculated next direction
     * @param {boolean} wrapWalls - Easy mode boundary wrap-around
     * @param {number} gridSize - Grid cell count
     */
    move(nextDir, wrapWalls = false, gridSize = 25) {
        this.direction = nextDir;
        const head = this.body[0];
        
        // Compute new head coordinates
        let newX = head.x;
        let newY = head.y;

        switch (this.direction) {
            case 'UP':    newY--; break;
            case 'DOWN':  newY++; break;
            case 'LEFT':  newX--; break;
            case 'RIGHT': newX++; break;
        }

        // Apply wrap-around logic for Easy mode
        if (wrapWalls) {
            if (newX < 0) newX = gridSize - 1;
            if (newX >= gridSize) newX = 0;
            if (newY < 0) newY = gridSize - 1;
            if (newY >= gridSize) newY = 0;
        }

        // Add new head to start of body
        this.body.unshift({ x: newX, y: newY });

        // Handle growth or tail truncation
        if (this.growPending > 0) {
            this.growPending--;
        } else {
            this.body.pop(); // Remove last segment
        }
    }

    /**
     * Renders snake body and face details on Canvas
     */
    draw(ctx, cellSize) {
        if (this.body.length === 0) return;

        ctx.save();

        this.body.forEach((segment, idx) => {
            const isHead = idx === 0;
            const x = segment.x * cellSize;
            const y = segment.y * cellSize;
            const size = cellSize - 2; // Margins for grid line visibility

            // Calculate style colors and glows based on chosen skin
            let fillStyle = '';
            let strokeStyle = '';
            let shadowBlur = 0;
            let shadowColor = '';

            switch (this.skin) {
                case 'cyberpunk':
                    // Alternates cyan and magenta
                    if (isHead) {
                        fillStyle = '#00f2fe';
                        shadowBlur = 12;
                        shadowColor = '#00f2fe';
                    } else {
                        fillStyle = idx % 2 === 0 ? '#00f2fe' : '#ff007f';
                        shadowBlur = 6;
                        shadowColor = '#ff007f';
                    }
                    break;

                case 'rainbow':
                    // Shifts color spectrum per index
                    const hue = (idx * 20) % 360;
                    fillStyle = `hsl(${hue}, 100%, 55%)`;
                    shadowBlur = 8;
                    shadowColor = `hsl(${hue}, 100%, 55%)`;
                    break;

                case 'neon':
                    // High glow bright ice blue
                    fillStyle = '#00ffff';
                    strokeStyle = '#ffffff';
                    shadowBlur = 15;
                    shadowColor = '#00ffff';
                    break;

                case 'green':
                default:
                    // Classic bright green glow
                    if (isHead) {
                        fillStyle = '#39ff14';
                        shadowBlur = 12;
                        shadowColor = '#39ff14';
                    } else {
                        fillStyle = '#22c55e';
                        shadowBlur = 6;
                        shadowColor = '#22c55e';
                    }
                    break;
            }

            // Apply shadow for drawing
            ctx.fillStyle = fillStyle;
            if (shadowBlur > 0) {
                ctx.shadowBlur = shadowBlur;
                ctx.shadowColor = shadowColor;
            }
            if (strokeStyle) {
                ctx.strokeStyle = strokeStyle;
                ctx.lineWidth = 1;
            }

            // Draw rounded segments
            const radius = isHead ? cellSize * 0.4 : cellSize * 0.25;
            drawRoundedRect(ctx, x + 1, y + 1, size, size, radius);
            ctx.fill();
            if (strokeStyle) ctx.stroke();

            // Draw eyes on head segment for cute visual feedback
            if (isHead) {
                this.drawEyes(ctx, x, y, cellSize);
            }
        });

        ctx.restore();
    }

    /**
     * Draw cute eyes looking towards current movement direction
     */
    drawEyes(ctx, x, y, cellSize) {
        ctx.save();
        ctx.shadowBlur = 0; // Disable body shadow for eye elements
        
        ctx.fillStyle = '#ffffff';
        const eyeSize = cellSize * 0.18;
        const pupilSize = cellSize * 0.08;
        
        let leftEye = { x: 0, y: 0 };
        let rightEye = { x: 0, y: 0 };
        let pupilOffset = { dx: 0, dy: 0 };

        // Position coordinates based on direction
        switch (this.direction) {
            case 'UP':
                leftEye  = { x: x + cellSize * 0.28, y: y + cellSize * 0.28 };
                rightEye = { x: x + cellSize * 0.72, y: y + cellSize * 0.28 };
                pupilOffset = { dx: 0, dy: -1 };
                break;
            case 'DOWN':
                leftEye  = { x: x + cellSize * 0.28, y: y + cellSize * 0.72 };
                rightEye = { x: x + cellSize * 0.72, y: y + cellSize * 0.72 };
                pupilOffset = { dx: 0, dy: 1 };
                break;
            case 'LEFT':
                leftEye  = { x: x + cellSize * 0.28, y: y + cellSize * 0.28 };
                rightEye = { x: x + cellSize * 0.28, y: y + cellSize * 0.72 };
                pupilOffset = { dx: -1, dy: 0 };
                break;
            case 'RIGHT':
                leftEye  = { x: x + cellSize * 0.72, y: y + cellSize * 0.28 };
                rightEye = { x: x + cellSize * 0.72, y: y + cellSize * 0.72 };
                pupilOffset = { dx: 1, dy: 0 };
                break;
        }

        // Draw Left Eye
        ctx.beginPath();
        ctx.arc(leftEye.x, leftEye.y, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw Right Eye
        ctx.beginPath();
        ctx.arc(rightEye.x, rightEye.y, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw Pupils (Black dots inside eyes)
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(leftEye.x + pupilOffset.dx, leftEye.y + pupilOffset.dy, pupilSize, 0, Math.PI * 2);
        ctx.arc(rightEye.x + pupilOffset.dx, rightEye.y + pupilOffset.dy, pupilSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
