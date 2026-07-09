/* Score and leveling management for SnakeX */

import { StorageManager } from './storage.js';

class ScoreManager {
    constructor() {
        this.score = 0;
        this.highScore = 0;
        this.level = 1;
        this.applesEaten = 0;
        this.applesThisLevel = 0;
        this.levelUpThreshold = 5; // Level up every 5 apples
        
        // Point values per difficulty
        this.pointValues = {
            easy: { normal: 10, golden: 30 },
            medium: { normal: 15, golden: 45 },
            hard: { normal: 25, golden: 75 }
        };
    }

    /**
     * Resets score states
     * @param {string} difficulty 
     */
    reset(difficulty) {
        this.score = 0;
        this.level = 1;
        this.applesEaten = 0;
        this.applesThisLevel = 0;
        this.highScore = StorageManager.getHighScore(difficulty);
    }

    /**
     * Increments score based on eaten food type
     * @param {string} foodType - 'normal' or 'golden'
     * @param {string} difficulty - 'easy', 'medium', or 'hard'
     * @returns {boolean} - Returns true if leveling up occurred
     */
    addFoodPoints(foodType, difficulty) {
        const points = this.pointValues[difficulty]?.[foodType] || 10;
        this.score += points;
        this.applesEaten++;
        this.applesThisLevel++;

        let isLevelUp = false;
        if (this.applesThisLevel >= this.levelUpThreshold) {
            this.level++;
            this.applesThisLevel = 0;
            isLevelUp = true;
        }

        return isLevelUp;
    }

    /**
     * Commits score to high score check
     * @param {string} difficulty 
     * @returns {boolean} - True if it was a new record
     */
    checkAndSaveHighScore(difficulty) {
        const isNewRecord = StorageManager.saveHighScore(this.score, difficulty);
        if (isNewRecord) {
            this.highScore = this.score;
        }
        return isNewRecord;
    }
}

export const Score = new ScoreManager();
