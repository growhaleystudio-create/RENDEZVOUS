/**
 * RENDEZVOUS BARBERSHOP — Tactile Web Audio Synthesizer
 * Warm, subtle luxury micro-acoustic feedback on UI interaction
 */

class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.enabled = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggle() {
    this.init();
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.playSuccess();
    }
    return this.enabled;
  }

  playClick() {
    if (!this.enabled || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      // Dual harmonic click for warm tactile feel
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);
      
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {
      // Graceful fallback
    }
  }

  playHover() {
    if (!this.enabled || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(460, now + 0.02);
      
      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.02);
    } catch (e) {}
  }

  playSuccess() {
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      [440, 554.37, 659.25].forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + (i * 0.05));
        
        gain.gain.setValueAtTime(0.03, now + (i * 0.05));
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (i * 0.05) + 0.18);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + (i * 0.05));
        osc.stop(now + (i * 0.05) + 0.18);
      });
    } catch (e) {}
  }
}

window.soundManager = new SoundManager();

