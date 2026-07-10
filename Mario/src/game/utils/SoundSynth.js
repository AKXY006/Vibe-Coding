// Web Audio API Retro Sound Synthesizer
// Generates authentic 8-bit sound effects and loops background music dynamically without external audio assets.
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.masterVolume = null;
    this.volumeVal = 0.5;
    this.muted = false;

    // Music scheduling variables
    this.bgmInterval = null;
    this.currentBgmType = null;
    this.isPlayingBgm = false;
    this.tempo = 120; // BPM
    this.stepDuration = 0.15; // Time in seconds for one 16th note at ~100 BPM
    this.stepIndex = 0;

    // Define retro patterns for background tracks
    // Note names mapped to frequencies (Hz)
    this.NOTES = {
      C3: 130.81, 'C#3': 138.59, D3: 146.83, 'D#3': 155.56, E3: 164.81, F3: 174.61, 'F#3': 185.00, G3: 196.00, 'G#3': 207.65, A3: 220.00, 'A#3': 233.08, B3: 246.94,
      C4: 261.63, 'C#4': 277.18, D4: 293.66, 'D#4': 311.13, E4: 329.63, F4: 349.23, 'F#4': 369.99, G4: 392.00, 'G#4': 415.30, A4: 440.00, 'A#4': 466.16, B4: 493.88,
      C5: 523.25, 'C#5': 554.37, D5: 587.33, 'D#5': 622.25, E5: 659.25, F5: 698.46, 'F#5': 739.99, G5: 783.99, 'G#5': 830.61, A5: 880.00, 'A#5': 932.33, B5: 987.77,
      C6: 1046.50, E6: 1318.51, G6: 1567.98, C7: 2093.00,
      REST: 0
    };

    // 16-step patterns: [melodyNote, bassNote]
    // Overworld: Cheerful, upbeat major theme
    this.patterns = {
      overworld: [
        ['E5', 'C3'], ['E5', 'REST'], ['REST', 'G3'], ['E5', 'C3'],
        ['REST', 'REST'], ['C5', 'E3'], ['E5', 'G3'], ['REST', 'REST'],
        ['G5', 'G3'], ['REST', 'REST'], ['REST', 'REST'], ['REST', 'REST'],
        ['G4', 'G2'], ['REST', 'REST'], ['REST', 'REST'], ['REST', 'REST']
      ],
      underground: [
        ['C4', 'C2'], ['REST', 'REST'], ['A3', 'A1'], ['REST', 'REST'],
        ['A#3', 'A#1'], ['REST', 'REST'], ['REST', 'REST'], ['REST', 'REST'],
        ['F#3', 'F#1'], ['REST', 'REST'], ['D3', 'D1'], ['REST', 'REST'],
        ['D#3', 'D#1'], ['REST', 'REST'], ['REST', 'REST'], ['REST', 'REST']
      ],
      castle: [
        ['C4', 'C2'], ['D#4', 'D#2'], ['F#4', 'F#2'], ['REST', 'REST'],
        ['F#4', 'F#2'], ['REST', 'REST'], ['F#4', 'F#2'], ['REST', 'REST'],
        ['G4', 'G2'], ['REST', 'REST'], ['D#4', 'C2'], ['REST', 'REST'],
        ['C4', 'G1'], ['REST', 'REST'], ['B3', 'B1'], ['REST', 'REST']
      ],
      boss: [
        ['C4', 'C2'], ['C#4', 'C#2'], ['D4', 'D2'], ['D#4', 'D#2'],
        ['D4', 'D2'], ['C#4', 'C#2'], ['C4', 'C2'], ['REST', 'REST'],
        ['G4', 'G2'], ['REST', 'REST'], ['G#4', 'G#2'], ['REST', 'REST'],
        ['A4', 'A2'], ['A#4', 'A#2'], ['B4', 'B2'], ['REST', 'REST']
      ]
    };
  }

  // Lazily initializes the audio context (must be user-triggered)
  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterVolume = this.ctx.createGain();
      this.masterVolume.gain.setValueAtTime(this.muted ? 0 : this.volumeVal, this.ctx.currentTime);
      this.masterVolume.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  setVolume(vol) {
    this.volumeVal = Phaser.Math.Clamp(vol, 0, 1);
    if (this.masterVolume && this.ctx) {
      this.masterVolume.gain.setValueAtTime(this.muted ? 0 : this.volumeVal, this.ctx.currentTime);
    }
  }

  setMute(isMuted) {
    this.muted = isMuted;
    if (this.masterVolume && this.ctx) {
      this.masterVolume.gain.setValueAtTime(this.muted ? 0 : this.volumeVal, this.ctx.currentTime);
    }
  }

  // Play a simple retro beep sound
  playTone(freq, type, duration, delay = 0, targetVolume = 0.3) {
    this.init();
    if (!this.ctx || this.muted) return;

    // Resume context if suspended (common browser policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type; // 'square', 'sawtooth', 'triangle', 'sine'
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

    gainNode.gain.setValueAtTime(targetVolume, this.ctx.currentTime + delay);
    // Exponential decay
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + duration);

    osc.connect(gainNode);
    gainNode.connect(this.masterVolume);

    osc.start(this.ctx.currentTime + delay);
    osc.stop(this.ctx.currentTime + delay + duration);
  }

  // --- SOUND EFFECTS ---

  playJump() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle'; // Smooth base sound
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.18); // Fast sweep up

    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gainNode);
    gainNode.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playCoin() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Classic dual-tone coin sound
    this.playTone(this.NOTES.B5, 'square', 0.08, 0, 0.2);
    this.playTone(this.NOTES.E6, 'square', 0.25, 0.08, 0.2);
  }

  playPowerUp() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Rapid arpeggio upwards
    const scale = [this.NOTES.G4, this.NOTES.C5, this.NOTES.E5, this.NOTES.G5, this.NOTES.C6, this.NOTES.E6];
    scale.forEach((freq, idx) => {
      this.playTone(freq, 'square', 0.15, idx * 0.06, 0.15);
    });
  }

  playEnemyDefeat() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.15); // Fast sweep down

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gainNode);
    gainNode.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playDamage() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(100, now + 0.05);
    osc.frequency.setValueAtTime(60, now + 0.1);

    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gainNode);
    gainNode.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playGameOver() {
    this.init();
    if (!this.ctx) return;
    this.stopBGM();
    const now = this.ctx.currentTime;
    const melody = [this.NOTES.C5, this.NOTES.G4, this.NOTES.E4, this.NOTES.A4, this.NOTES.B4, this.NOTES.A4, this.NOTES.Ab4, this.NOTES.G4];
    melody.forEach((freq, idx) => {
      this.playTone(freq, 'square', 0.25, idx * 0.2, 0.2);
    });
  }

  playVictory() {
    this.init();
    if (!this.ctx) return;
    this.stopBGM();
    const now = this.ctx.currentTime;
    const fanfare = [
      this.NOTES.C5, this.NOTES.C5, this.NOTES.C5, this.NOTES.C5,
      this.NOTES.Ab4, this.NOTES.Bb4, this.NOTES.C5, this.NOTES.REST,
      this.NOTES.Bb4, this.NOTES.C5
    ];
    fanfare.forEach((freq, idx) => {
      if (freq !== this.NOTES.REST) {
        this.playTone(freq, 'square', idx === fanfare.length - 1 ? 0.6 : 0.15, idx * 0.12, 0.2);
      }
    });
  }

  // --- BACKGROUND MUSIC SEQUENCER ---

  startBGM(type = 'overworld') {
    this.init();
    if (!this.ctx) return;

    if (this.currentBgmType === type && this.isPlayingBgm) return;
    this.stopBGM();

    this.isPlayingBgm = true;
    this.currentBgmType = type;
    this.stepIndex = 0;

    const runSequencer = () => {
      if (!this.isPlayingBgm) return;
      
      const pattern = this.patterns[type] || this.patterns.overworld;
      const step = pattern[this.stepIndex];

      const melodyNote = step[0];
      const bassNote = step[1];

      // Play melody note
      if (melodyNote && melodyNote !== 'REST') {
        const freq = this.NOTES[melodyNote];
        // Triangle for underground/castle, square for overworld/boss
        const oscType = (type === 'underground' || type === 'castle') ? 'triangle' : 'square';
        this.playTone(freq, oscType, this.stepDuration * 0.8, 0, 0.08);
      }

      // Play bass note
      if (bassNote && bassNote !== 'REST') {
        const freq = this.NOTES[bassNote];
        this.playTone(freq, 'triangle', this.stepDuration * 1.2, 0, 0.12);
      }

      this.stepIndex = (this.stepIndex + 1) % pattern.length;
    };

    // Trigger step immediately
    runSequencer();

    // Schedule subsequent steps
    this.bgmInterval = setInterval(runSequencer, this.stepDuration * 1000);
  }

  stopBGM() {
    this.isPlayingBgm = false;
    this.currentBgmType = null;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export default new SoundSynth();
