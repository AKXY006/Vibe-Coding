/* Collision Detection Engine for SnakeX */

export const CollisionEngine = {
    /**
     * Checks if the snake has run out of grid bounds
     * @param {Object} head - {x, y} coordinate
     * @param {number} gridSize - grid dimensions
     * @returns {boolean}
     */
    checkWall(head, gridSize = 25) {
        return head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize;
    },

    /**
     * Checks if head overlaps with any trailing tail segment
     * @param {Object} head - {x, y}
     * @param {Array} body - array of {x, y}
     * @returns {boolean}
     */
    checkSelf(head, body) {
        // Skip checking against itself (index 0 is the head)
        for (let i = 1; i < body.length; i++) {
            if (head.x === body[i].x && head.y === body[i].y) {
                return true;
            }
        }
        return false;
    },

    /**
     * Checks if head coordinates hit an obstacle tile
     * @param {Object} head - {x, y}
     * @param {Array} obstacles - array of {x, y}
     * @returns {boolean}
     */
    checkObstacles(head, obstacles = []) {
        return obstacles.some(obs => obs.x === head.x && obs.y === head.y);
    },

    /**
     * Consolidates all collision checks into a single report
     * @param {Object} snakeInstance - The snake object
     * @param {Array} obstacles - Current obstacle positions
     * @param {number} gridSize - Board size
     * @param {boolean} wrapWalls - Wrap walls state
     * @returns {Object} - { isGameOver: boolean, reason: string }
     */
    check(snakeInstance, obstacles = [], gridSize = 25, wrapWalls = false) {
        const body = snakeInstance.body;
        if (body.length === 0) return { isGameOver: false, reason: '' };

        const head = body[0];

        // 1. Wall hit check (only if wrapping walls is off)
        if (!wrapWalls && this.checkWall(head, gridSize)) {
            return { isGameOver: true, reason: 'WALL' };
        }

        // 2. Self collision check (only possible if snake size > 3)
        if (this.checkSelf(head, body)) {
            return { isGameOver: true, reason: 'SELF' };
        }

        // 3. Obstacle collision check (Hard level feature)
        if (this.checkObstacles(head, obstacles)) {
            return { isGameOver: true, reason: 'OBSTACLE' };
        }

        return { isGameOver: false, reason: '' };
    }
};
