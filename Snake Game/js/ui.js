/* DOM UI Manager for SnakeX */

import { StorageManager } from './storage.js';
import { Sound } from './sound.js';
import { Score } from './score.js';
import { Level } from './level.js';

class UIManager {
    constructor() {
        this.themeCycle = ['neon-dark', 'light', 'retro-arcade'];
        this.currentThemeIdx = 0;
        
        // Element caching
        this.dom = {};
    }

    /**
     * Cache selectors and register main settings listeners
     */
    init(callbacks = {}) {
        this.cacheElements();
        
        // Load initial settings
        const settings = StorageManager.getSettings();
        
        // Set initial theme
        this.applyTheme(settings.theme);
        
        // Set initial sound states
        this.setSoundFX(settings.sfx);
        this.setMusic(settings.music);
        
        // Set initial skin
        this.applySkinSelector(settings.skin);
        
        // Set initial difficulty
        this.applyDifficultySelector(Level.difficulty);

        // Bind global UI settings listeners
        this.bindSettingsListeners();
        
        // Save references to game action triggers
        this.onStartGame = callbacks.onStartGame || null;
        this.onResumeGame = callbacks.onResumeGame || null;
        this.onQuitGame = callbacks.onQuitGame || null;

        this.bindGameScreenListeners();
    }

    cacheElements() {
        this.dom = {
            body: document.body,
            hudScore: document.getElementById('hud-score'),
            hudHighScore: document.getElementById('hud-highscore'),
            hudLevel: document.getElementById('hud-level'),
            
            btnSoundToggle: document.getElementById('btn-sound-toggle'),
            svgSoundOn: document.getElementById('svg-sound-on'),
            svgSoundOff: document.getElementById('svg-sound-off'),
            btnThemeCycle: document.getElementById('btn-theme-cycle'),
            btnPause: document.getElementById('btn-pause'),
            
            // Screen Overlays
            startMenu: document.getElementById('start-menu'),
            pauseScreen: document.getElementById('pause-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            
            // Start Menu Settings
            difficultyTabs: document.querySelectorAll('.difficulty-tabs .tab-button'),
            skinOptions: document.querySelectorAll('.skin-selector .skin-option'),
            toggleSfx: document.getElementById('toggle-sfx'),
            toggleMusic: document.getElementById('toggle-music'),
            btnStart: document.getElementById('btn-start'),
            
            // Pause actions
            btnResume: document.getElementById('btn-resume'),
            btnQuit: document.getElementById('btn-quit'),
            
            // Game Over actions
            gameOverReason: document.getElementById('game-over-reason'),
            finalScore: document.getElementById('final-score'),
            finalHighScore: document.getElementById('final-highscore'),
            finalDifficulty: document.getElementById('final-difficulty'),
            badgeNewRecord: document.getElementById('badge-new-record'),
            btnRestart: document.getElementById('btn-restart'),
            btnMenu: document.getElementById('btn-menu')
        };
    }

    bindSettingsListeners() {
        // Theme button click
        if (this.dom.btnThemeCycle) {
            this.dom.btnThemeCycle.addEventListener('click', () => {
                Sound.playClick();
                this.currentThemeIdx = (this.currentThemeIdx + 1) % this.themeCycle.length;
                const nextTheme = this.themeCycle[this.currentThemeIdx];
                this.applyTheme(nextTheme);
                StorageManager.saveSettings({ theme: nextTheme });
            });
        }

        // Header sound toggle click
        if (this.dom.btnSoundToggle) {
            this.dom.btnSoundToggle.addEventListener('click', () => {
                const sfxState = !Sound.sfxEnabled;
                this.setSoundFX(sfxState);
                if (this.dom.toggleSfx) this.dom.toggleSfx.checked = sfxState;
                StorageManager.saveSettings({ sfx: sfxState });
                Sound.playClick();
            });
        }

        // Start menu SFX Switch
        if (this.dom.toggleSfx) {
            this.dom.toggleSfx.addEventListener('change', (e) => {
                const sfxState = e.target.checked;
                this.setSoundFX(sfxState);
                StorageManager.saveSettings({ sfx: sfxState });
                Sound.playClick();
            });
        }

        // Start menu Music Switch
        if (this.dom.toggleMusic) {
            this.dom.toggleMusic.addEventListener('change', (e) => {
                const musicState = e.target.checked;
                this.setMusic(musicState);
                StorageManager.saveSettings({ music: musicState });
                Sound.playClick();
            });
        }

        // Difficulty tab selector
        this.dom.difficultyTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                Sound.playClick();
                const difficulty = tab.getAttribute('data-difficulty');
                this.applyDifficultySelector(difficulty);
                Level.setDifficulty(difficulty);
                
                // Update high score display instantly based on selected difficulty
                const high = StorageManager.getHighScore(difficulty);
                this.updateHighScoreDisplay(high);
            });
        });

        // Skin choice selector
        this.dom.skinOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                Sound.playClick();
                const skin = opt.getAttribute('data-skin');
                this.applySkinSelector(skin);
                StorageManager.saveSettings({ skin });
            });
        });
    }

    bindGameScreenListeners() {
        // Start Game Button
        if (this.dom.btnStart) {
            this.dom.btnStart.addEventListener('click', () => {
                Sound.playClick();
                if (this.onStartGame) this.onStartGame();
            });
        }

        // Pause/Resume Actions
        if (this.dom.btnPause) {
            this.dom.btnPause.addEventListener('click', () => {
                if (this.onResumeGame) this.onResumeGame();
            });
        }
        if (this.dom.btnResume) {
            this.dom.btnResume.addEventListener('click', () => {
                Sound.playClick();
                if (this.onResumeGame) this.onResumeGame();
            });
        }
        if (this.dom.btnQuit) {
            this.dom.btnQuit.addEventListener('click', () => {
                Sound.playClick();
                if (this.onQuitGame) this.onQuitGame();
            });
        }

        // Game Over Actions
        if (this.dom.btnRestart) {
            this.dom.btnRestart.addEventListener('click', () => {
                Sound.playClick();
                if (this.onStartGame) this.onStartGame();
            });
        }
        if (this.dom.btnMenu) {
            this.dom.btnMenu.addEventListener('click', () => {
                Sound.playClick();
                if (this.onQuitGame) this.onQuitGame();
            });
        }
    }

    /* --- Theme & State Applicators --- */

    applyTheme(theme) {
        this.themeCycle.forEach(t => {
            this.dom.body.classList.remove(`theme-${t}`);
        });
        this.dom.body.classList.add(`theme-${theme}`);
        this.currentThemeIdx = this.themeCycle.indexOf(theme);
    }

    setSoundFX(enabled) {
        Sound.setSFXEnabled(enabled);
        if (enabled) {
            this.dom.svgSoundOn.classList.remove('hidden');
            this.dom.svgSoundOff.classList.add('hidden');
        } else {
            this.dom.svgSoundOn.classList.add('hidden');
            this.dom.svgSoundOff.classList.remove('hidden');
        }
    }

    setMusic(enabled) {
        Sound.setMusicEnabled(enabled);
        if (this.dom.toggleMusic) this.dom.toggleMusic.checked = enabled;
    }

    applySkinSelector(skin) {
        this.dom.skinOptions.forEach(opt => {
            if (opt.getAttribute('data-skin') === skin) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }

    applyDifficultySelector(difficulty) {
        this.dom.difficultyTabs.forEach(tab => {
            if (tab.getAttribute('data-difficulty') === difficulty) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    /* --- HUD & Overlay Updates --- */

    updateScoreDisplay(score) {
        // Formats score as three-digit string, e.g. "005"
        const formatted = score.toString().padStart(3, '0');
        this.dom.hudScore.textContent = formatted;
    }

    updateHighScoreDisplay(score) {
        const formatted = score.toString().padStart(3, '0');
        this.dom.hudHighScore.textContent = formatted;
    }

    updateLevelDisplay(level) {
        this.dom.hudLevel.textContent = level;
    }

    showStartMenu() {
        this.dom.startMenu.classList.add('active');
        this.dom.pauseScreen.classList.add('hidden');
        this.dom.gameOverScreen.classList.add('hidden');
        this.dom.btnPause.classList.add('hidden');
        
        // Show current High Score for selected difficulty
        const high = StorageManager.getHighScore(Level.difficulty);
        this.updateHighScoreDisplay(high);
    }

    showPauseScreen() {
        this.dom.pauseScreen.classList.remove('hidden');
        this.dom.pauseScreen.classList.add('active');
    }

    hidePauseScreen() {
        this.dom.pauseScreen.classList.remove('active');
        this.dom.pauseScreen.classList.add('hidden');
    }

    showGameOverScreen(reason, score, highScore, isNewRecord, difficulty) {
        this.dom.btnPause.classList.add('hidden');
        
        // Set collision description
        let desc = 'You crashed!';
        if (reason === 'WALL') desc = 'You hit the glowing outer boundary!';
        if (reason === 'SELF') desc = 'You bit your own tail segment!';
        if (reason === 'OBSTACLE') desc = 'You smashed into an obstacle block!';
        this.dom.gameOverReason.textContent = desc;

        this.dom.finalScore.textContent = score;
        this.dom.finalHighScore.textContent = highScore;
        this.dom.finalDifficulty.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

        if (isNewRecord) {
            this.dom.badgeNewRecord.classList.remove('hidden');
        } else {
            this.dom.badgeNewRecord.classList.add('hidden');
        }

        this.dom.gameOverScreen.classList.remove('hidden');
        this.dom.gameOverScreen.classList.add('active');
    }

    hideOverlays() {
        this.dom.startMenu.classList.remove('active');
        this.dom.pauseScreen.classList.add('hidden');
        this.dom.pauseScreen.classList.remove('active');
        this.dom.gameOverScreen.classList.add('hidden');
        this.dom.gameOverScreen.classList.remove('active');
        this.dom.btnPause.classList.remove('hidden');
    }
}

export const UI = new UIManager();
