/* SnakeX entry point */

import { Game } from './game.js';

// Wait for window and styles to load before initializing the engine
window.addEventListener('load', () => {
    try {
        Game.init();
    } catch (error) {
        console.error('Failed to initialize SnakeX Game Engine:', error);
    }
});
