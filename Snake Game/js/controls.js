/* Controls Manager - Keyboard & Swipe Inputs for SnakeX */

class ControlsManager {
    constructor() {
        this.currentDirection = 'RIGHT';
        this.nextDirection = 'RIGHT';
        this.directionQueue = [];
        this.onPause = null;
        this.onRestart = null;
        this.onQuit = null;

        // Touch gesture variables
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.swipeThreshold = 30; // Min swipe distance in pixels
    }

    /**
     * Binds keyboard, touch, and event listeners
     * @param {Object} callbacks - callbacks for pause, restart, quit
     */
    init(callbacks = {}) {
        this.onPause = callbacks.onPause || null;
        this.onRestart = callbacks.onRestart || null;
        this.onQuit = callbacks.onQuit || null;

        // Keyboard listeners
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Touch listeners to detect swipe
        window.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        window.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        // Bind Mobile D-Pad Buttons
        this.bindMobileDpad();
    }

    /**
     * Resets direction states
     */
    reset() {
        this.currentDirection = 'RIGHT';
        this.nextDirection = 'RIGHT';
        this.directionQueue = [];
    }

    /**
     * Sets current locked direction once snake moves
     */
    setDirection(dir) {
        this.currentDirection = dir;
    }

    /**
     * Retrieves the next valid direction from the queue
     * @returns {string}
     */
    getNextDirection() {
        if (this.directionQueue.length > 0) {
            this.nextDirection = this.directionQueue.shift();
        }
        return this.nextDirection;
    }

    /**
     * Enqueues a direction change with anti-backtracking protection
     * @param {string} dir 
     */
    enqueueDirection(dir) {
        const lastDir = this.directionQueue.length > 0 
            ? this.directionQueue[this.directionQueue.length - 1] 
            : this.currentDirection;

        // Prevent moving in opposite direction immediately
        if (dir === 'UP' && lastDir !== 'DOWN' && lastDir !== 'UP') this.directionQueue.push(dir);
        if (dir === 'DOWN' && lastDir !== 'UP' && lastDir !== 'DOWN') this.directionQueue.push(dir);
        if (dir === 'LEFT' && lastDir !== 'RIGHT' && lastDir !== 'LEFT') this.directionQueue.push(dir);
        if (dir === 'RIGHT' && lastDir !== 'LEFT' && lastDir !== 'RIGHT') this.directionQueue.push(dir);
    }

    /**
     * Handles keyboard events
     */
    handleKeyDown(e) {
        // Prevent default behavior for arrow keys & space to avoid page scrolling
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
        }

        switch (e.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.enqueueDirection('UP');
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.enqueueDirection('DOWN');
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.enqueueDirection('LEFT');
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.enqueueDirection('RIGHT');
                break;
            case 'Space':
                if (this.onPause) this.onPause();
                break;
            case 'Enter':
                if (this.onRestart) this.onRestart();
                break;
            case 'Escape':
                if (this.onQuit) this.onQuit();
                break;
        }
    }

    /**
     * Track touch start coordinates
     */
    handleTouchStart(e) {
        // Mark as touch device to reveal CSS D-pad if screen is small
        document.body.classList.add('is-touch-device');
        
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }

    /**
     * Calculate touch end and trigger swipes
     */
    handleTouchEnd(e) {
        if (!this.touchStartX || !this.touchStartY) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const dx = touchEndX - this.touchStartX;
        const dy = touchEndY - this.touchStartY;

        // Determine major swipe axis
        if (Math.max(Math.abs(dx), Math.abs(dy)) > this.swipeThreshold) {
            if (Math.abs(dx) > Math.abs(dy)) {
                // Horizontal Swipe
                if (dx > 0) {
                    this.enqueueDirection('RIGHT');
                } else {
                    this.enqueueDirection('LEFT');
                }
            } else {
                // Vertical Swipe
                if (dy > 0) {
                    this.enqueueDirection('DOWN');
                } else {
                    this.enqueueDirection('UP');
                }
            }
        }
        
        this.touchStartX = 0;
        this.touchStartY = 0;
    }

    /**
     * Bind click events to HTML on-screen D-Pad buttons
     */
    bindMobileDpad() {
        const upBtn = document.getElementById('ctrl-up');
        const downBtn = document.getElementById('ctrl-down');
        const leftBtn = document.getElementById('ctrl-left');
        const rightBtn = document.getElementById('ctrl-right');

        if (upBtn) upBtn.addEventListener('click', () => this.enqueueDirection('UP'));
        if (downBtn) downBtn.addEventListener('click', () => this.enqueueDirection('DOWN'));
        if (leftBtn) leftBtn.addEventListener('click', () => this.enqueueDirection('LEFT'));
        if (rightBtn) rightBtn.addEventListener('click', () => this.enqueueDirection('RIGHT'));
    }
}

export const Controls = new ControlsManager();
