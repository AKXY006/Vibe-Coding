/* Web Audio API Sound Synthesizer for SnakeX */

class SoundManager {
    constructor() {
        this.ctx = null;
        this.sfxEnabled = true;
        this.musicEnabled = false;
        
        // Music sequencer parameters
        this.musicIntervalId = null;
        this.tempo = 120; // BPM
        this.beatIndex = 0;
        
        // Procedural synth bassline and melody scales (Pentatonic A-Minor)
        // A2, C3, D3, E3, G3, A3
        this.bassNotes = [110.00, 130.81, 146.83, 164.81, 196.00, 220.00];
        // A4, C5, D5, E5, G5, A5
        this.melodyNotes = [440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
        
        // Sequence patterns
        this.bassPattern = [0, 2, 3, 2, 4, 3, 5, 4];
        this.melodyPattern = [-1, 0, -1, 3, 2, -1, 5, 4];
    }

    /**
     * Initializes the AudioContext upon user interaction
     */
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    /**
     * Toggle sound effects state
     * @param {boolean} enabled 
     */
    setSFXEnabled(enabled) {
        this.sfxEnabled = enabled;
    }

    /**
     * Toggle background music state
     * @param {boolean} enabled 
     */
    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        if (enabled) {
            this.startMusic();
        } else {
            this.stopMusic();
        }
    }

    /**
     * Plays a quick UI click sound
     */
    playClick() {
        if (!this.sfxEnabled) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);
        
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    /**
     * Plays an eating sound
     * @param {boolean} isGolden 
     */
    playEat(isGolden = false) {
        if (!this.sfxEnabled) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        if (isGolden) {
            // Shiny double-tone arpeggio for golden apple
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.06); // E5
            osc.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.12); // G5
            osc.frequency.setValueAtTime(1046.50, this.ctx.currentTime + 0.18); // C6
            
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 0.3);
        } else {
            // Quick happy chirp
            osc.type = 'sine';
            osc.frequency.setValueAtTime(350, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(950, this.ctx.currentTime + 0.12);
            
            gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 0.12);
        }
    }

    /**
     * Plays the collision/game over sound
     */
    playCollision() {
        if (!this.sfxEnabled) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.45);
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.45);
    }

    /**
     * Plays a sound when level advances
     */
    playLevelUp() {
        if (!this.sfxEnabled) return;
        this.init();

        const now = this.ctx.currentTime;
        const notes = [329.63, 392.00, 493.88, 587.33, 659.25]; // E4, G4, B4, D5, E5 arpeggio
        
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            
            gain.gain.setValueAtTime(0.0, now + idx * 0.08);
            gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
            
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.25);
        });
    }

    /**
     * Starts the procedural ambient background music
     */
    startMusic() {
        if (this.musicIntervalId) return; // Already running
        
        const secondsPerBeat = 60 / this.tempo;
        
        this.musicIntervalId = setInterval(() => {
            if (!this.musicEnabled) return;
            this.init();
            
            const now = this.ctx.currentTime;
            
            // Bass beat (runs every beat)
            const bassIdx = this.bassPattern[this.beatIndex % this.bassPattern.length];
            const bassFreq = this.bassNotes[bassIdx];
            this.playSynthNote(bassFreq, 'triangle', 0.04, 0.2, now);
            
            // Melody beat (runs on specific slots in pattern)
            const melVal = this.melodyPattern[this.beatIndex % this.melodyPattern.length];
            if (melVal !== -1) {
                const melFreq = this.melodyNotes[melVal];
                this.playSynthNote(melFreq, 'sine', 0.02, 0.15, now + 0.1);
            }
            
            this.beatIndex++;
        }, secondsPerBeat * 1000);
    }

    /**
     * Stops the background music
     */
    stopMusic() {
        if (this.musicIntervalId) {
            clearInterval(this.musicIntervalId);
            this.musicIntervalId = null;
        }
    }

    /**
     * Helper to play a quick synthesized ambient note
     */
    playSynthNote(freq, type, volume, duration, time) {
        if (this.ctx.state === 'suspended') return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0.0, time);
        gain.gain.linearRampToValueAtTime(volume, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        
        osc.start(time);
        osc.stop(time + duration);
    }
}

// Export single shared instance
export const Sound = new SoundManager();
