/* LocalStorage manager for SnakeX scores and preferences */

const STORAGE_KEYS = {
    HIGH_SCORE: 'snakex_highscore_',
    SETTINGS: 'snakex_settings'
};

const DEFAULT_SETTINGS = {
    theme: 'neon-dark',
    sfx: true,
    music: false,
    skin: 'green'
};

export const StorageManager = {
    /**
     * Gets the high score for a specific difficulty
     * @param {string} difficulty - 'easy', 'medium', or 'hard'
     * @returns {number}
     */
    getHighScore(difficulty) {
        try {
            const key = STORAGE_KEYS.HIGH_SCORE + difficulty;
            const score = localStorage.getItem(key);
            return score ? parseInt(score, 10) : 0;
        } catch (e) {
            console.warn('LocalStorage is blocked or full. Score not retrieved.', e);
            return 0;
        }
    },

    /**
     * Saves high score if it is greater than the current high score
     * @param {number} score 
     * @param {string} difficulty 
     * @returns {boolean} - True if a new high score record was set
     */
    saveHighScore(score, difficulty) {
        try {
            const currentHigh = this.getHighScore(difficulty);
            if (score > currentHigh) {
                const key = STORAGE_KEYS.HIGH_SCORE + difficulty;
                localStorage.setItem(key, score.toString());
                return true;
            }
            return false;
        } catch (e) {
            console.warn('LocalStorage save high score failed.', e);
            return false;
        }
    },

    /**
     * Fetches saved settings, falling back to defaults
     * @returns {Object}
     */
    getSettings() {
        try {
            const settingsJson = localStorage.getItem(STORAGE_KEYS.SETTINGS);
            if (settingsJson) {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(settingsJson) };
            }
        } catch (e) {
            console.warn('LocalStorage settings read failed.', e);
        }
        return { ...DEFAULT_SETTINGS };
    },

    /**
     * Persists settings dictionary
     * @param {Object} settings 
     */
    saveSettings(settings) {
        try {
            const currentSettings = this.getSettings();
            const newSettings = { ...currentSettings, ...settings };
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
        } catch (e) {
            console.warn('LocalStorage settings write failed.', e);
        }
    }
};
