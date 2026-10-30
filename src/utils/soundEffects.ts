// Web Audio, Custom Voice Recording & Studio Standard Malaysian Malay Audio helper for Pemulihan Khas Year 1
import { customAudioStorage } from './customAudioStorage';

export type VoiceMode = 'standard_bm' | 'custom_teacher';
export type SpeechSpeed = 'slow' | 'normal';

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentCustomAudio: HTMLAudioElement | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private selectedVoiceUri: string | null = null;
  private voiceMode: VoiceMode = 'standard_bm';
  private speechSpeed: SpeechSpeed = 'slow';
  private serverAudioCache: Map<string, string> = new Map();

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        this.availableVoices = window.speechSynthesis.getVoices();
        if (!this.selectedVoiceUri) {
          const best = this.findBestMalaysianMalayVoice();
          if (best) this.selectedVoiceUri = best.voiceURI;
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  // Filter ONLY Malaysian Malay (ms-MY), strictly exclude Indonesian (id-ID)
  public getAvailableMalayVoices(): SpeechSynthesisVoice[] {
    return this.availableVoices.filter(
      (v) =>
        (v.lang.toLowerCase().startsWith('ms') ||
          v.name.toLowerCase().includes('malay (malaysia)') ||
          v.name.toLowerCase().includes('bahasa melayu') ||
          v.name.toLowerCase().includes('yasmin') ||
          v.name.toLowerCase().includes('osman') ||
          v.name.toLowerCase().includes('amira')) &&
        !v.lang.toLowerCase().startsWith('id') &&
        !v.name.toLowerCase().includes('indonesia')
    );
  }

  public setVoice(voiceUri: string) {
    this.selectedVoiceUri = voiceUri;
  }

  public getSelectedVoiceUri(): string | null {
    return this.selectedVoiceUri;
  }

  public setVoiceMode(mode: VoiceMode) {
    this.voiceMode = mode;
  }

  public getVoiceMode(): VoiceMode {
    return this.voiceMode;
  }

  public setSpeechSpeed(speed: SpeechSpeed) {
    this.speechSpeed = speed;
  }

  public getSpeechSpeed(): SpeechSpeed {
    return this.speechSpeed;
  }

  // Strictly Malaysian Malay voice lookup (NO Indonesian)
  public findBestMalaysianMalayVoice(): SpeechSynthesisVoice | null {
    if (!this.availableVoices.length && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.availableVoices = window.speechSynthesis.getVoices();
    }

    // 1. Exact ms-MY (Malay Malaysia)
    const exactMalay = this.availableVoices.find(
      (v) =>
        (v.lang.toLowerCase() === 'ms-my' ||
          v.lang.toLowerCase() === 'ms_my' ||
          v.name.toLowerCase().includes('malay (malaysia)') ||
          v.name.toLowerCase().includes('bahasa melayu') ||
          v.name.toLowerCase().includes('yasmin') ||
          v.name.toLowerCase().includes('osman') ||
          v.name.toLowerCase().includes('amira')) &&
        !v.lang.toLowerCase().startsWith('id')
    );
    if (exactMalay) return exactMalay;

    // 2. Generic ms (Malay) without Indonesian
    const genericMalay = this.availableVoices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('ms') &&
        !v.lang.toLowerCase().startsWith('id') &&
        !v.name.toLowerCase().includes('indonesia')
    );
    if (genericMalay) return genericMalay;

    return null;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAllAudio();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public stopAllAudio() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.currentCustomAudio) {
      this.currentCustomAudio.pause();
      this.currentCustomAudio = null;
    }
  }

  /**
   * Primary audio player:
   * 1. Teacher's recorded voice (if mode is 'custom_teacher' and recording exists)
   * 2. Studio Standard Malaysian Malay TTS via Gemini /api/tts (Warm, genuine Malaysian school teacher)
   * 3. Native browser ms-MY voice (Strictly Malaysian Malay, NO Indonesian)
   */
  public async playAudioOrSpeak(
    key: string,
    fallbackText: string,
    options: {
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
    } = {}
  ): Promise<void> {
    if (this.isMuted) return;

    this.stopAllAudio();

    // 1. If teacher custom voice is selected, play it
    if (this.voiceMode === 'custom_teacher') {
      const customDataUrl = await customAudioStorage.getAudio(key);
      if (customDataUrl) {
        try {
          const audio = new Audio(customDataUrl);
          this.currentCustomAudio = audio;

          if (options.onStart) options.onStart();

          audio.onended = () => {
            this.currentCustomAudio = null;
            if (options.onEnd) options.onEnd();
          };

          audio.onerror = () => {
            this.speakStandardMalay(fallbackText, options, key);
          };

          await audio.play();
          return;
        } catch {
          this.speakStandardMalay(fallbackText, options, key);
          return;
        }
      }
    }

    // 2. Default: Standard Malaysian Malay voice
    await this.speakStandardMalay(fallbackText, options, key);
  }

  /**
   * Plays Studio Standard Malaysian Malay Audio via /api/tts,
   * with strict fallback to local ms-MY voice if needed.
   */
  public async speakStandardMalay(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
    } = {},
    voiceKey?: string
  ): Promise<void> {
    if (this.isMuted) return;

    this.stopAllAudio();

    // Check server audio cache
    const cacheKey = voiceKey || text.slice(0, 32);
    if (this.serverAudioCache.has(cacheKey)) {
      const base64Audio = this.serverAudioCache.get(cacheKey)!;
      this.playBase64Audio(base64Audio, options);
      return;
    }

    // Try fetching authentic studio Malaysian Malay audio from /api/tts
    try {
      if (options.onStart) options.onStart();

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceKey: cacheKey,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          this.serverAudioCache.set(cacheKey, data.audioBase64);
          this.playBase64Audio(data.audioBase64, options);
          return;
        }
      }
    } catch {
      // Server not reachable or error, fallback to browser ms-MY
    }

    // Fallback: Use browser speech synthesis with STRICT ms-MY filter (NO Indonesian)
    this.fallbackBrowserSpeech(text, options);
  }

  private playBase64Audio(
    base64Data: string,
    options: { onStart?: () => void; onEnd?: () => void }
  ) {
    try {
      const audioUrl = `data:audio/wav;base64,${base64Data}`;
      const audio = new Audio(audioUrl);
      this.currentCustomAudio = audio;

      if (options.onStart) options.onStart();

      audio.onended = () => {
        this.currentCustomAudio = null;
        if (options.onEnd) options.onEnd();
      };

      audio.onerror = () => {
        if (options.onEnd) options.onEnd();
      };

      audio.play().catch(() => {});
    } catch {
      if (options.onEnd) options.onEnd();
    }
  }

  private fallbackBrowserSpeech(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
    }
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      utterance.rate = options.rate ?? (this.speechSpeed === 'slow' ? 0.76 : 0.9);
      utterance.pitch = options.pitch ?? 1.05;

      // Select Malaysian Malay voice only
      let targetVoice: SpeechSynthesisVoice | null = null;
      if (this.selectedVoiceUri) {
        targetVoice =
          this.availableVoices.find((v) => v.voiceURI === this.selectedVoiceUri) || null;
      }
      if (!targetVoice) {
        targetVoice = this.findBestMalaysianMalayVoice();
      }

      if (targetVoice) {
        utterance.voice = targetVoice;
        utterance.lang = targetVoice.lang;
      } else {
        utterance.lang = 'ms-MY';
      }

      if (options.onStart) utterance.onstart = options.onStart;
      if (options.onEnd) utterance.onend = options.onEnd;

      window.speechSynthesis.speak(utterance);
    } catch {
      // Graceful fallback
    }
  }

  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
    } = {}
  ) {
    this.speakStandardMalay(text, options);
  }

  public stopSpeaking() {
    this.stopAllAudio();
  }

  // --- Web Audio Synthesizer Sounds ---

  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  public playCorrect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0, now + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.36);
    });
  }

  public playTryAgain() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [392, 329.63];

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      gain.gain.setValueAtTime(0, now + idx * 0.15);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.15 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.31);
    });
  }

  public playStarEarned() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const sparkleNotes = [1046.5, 1318.5, 1567.98, 2093.0];

    sparkleNotes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.12, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.26);
    });
  }

  public playFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const fanfare = [
      { f: 523.25, d: 0.15, gap: 0 },
      { f: 659.25, d: 0.15, gap: 0.14 },
      { f: 783.99, d: 0.18, gap: 0.28 },
      { f: 783.99, d: 0.12, gap: 0.46 },
      { f: 880.0, d: 0.18, gap: 0.6 },
      { f: 1046.5, d: 0.55, gap: 0.8 },
    ];

    fanfare.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.gap);

      gain.gain.setValueAtTime(0, now + note.gap);
      gain.gain.linearRampToValueAtTime(0.2, now + note.gap + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.gap + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + note.gap);
      osc.stop(now + note.gap + note.d + 0.02);
    });
  }

  public playAnimalEffect(animal: string) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (animal.toLowerCase()) {
      case 'kuda': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.45);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.46);

        [0.48, 0.62, 0.78, 0.92].forEach((timeOffset, i) => {
          if (!this.ctx) return;
          const trotOsc = this.ctx.createOscillator();
          const trotGain = this.ctx.createGain();
          trotOsc.type = 'triangle';
          trotOsc.frequency.setValueAtTime(i % 2 === 0 ? 240 : 200, now + timeOffset);
          trotGain.gain.setValueAtTime(0.14, now + timeOffset);
          trotGain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.08);

          trotOsc.connect(trotGain);
          trotGain.connect(this.ctx.destination);
          trotOsc.start(now + timeOffset);
          trotOsc.stop(now + timeOffset + 0.09);
        });
        break;
      }

      case 'rusa': {
        [587.33, 880, 1174.66].forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.15, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.62);
        });
        break;
      }

      case 'kera': {
        [420, 640, 480, 720].forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.14);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + idx * 0.14 + 0.08);

          gain.gain.setValueAtTime(0.16, now + idx * 0.14);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.14 + 0.1);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.14);
          osc.stop(now + idx * 0.14 + 0.11);
        });
        break;
      }

      case 'babi': {
        [0, 0.22].forEach((offset) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(190, now + offset);
          osc.frequency.exponentialRampToValueAtTime(140, now + offset + 0.14);

          gain.gain.setValueAtTime(0.18, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.15);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.16);
        });
        break;
      }

      case 'nuri': {
        [900, 1200, 1600, 1400, 1800].forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          osc.frequency.exponentialRampToValueAtTime(freq + 200, now + idx * 0.07 + 0.05);

          gain.gain.setValueAtTime(0.15, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.07 + 0.06);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.07);
        });
        break;
      }
      default:
        this.playClick();
    }
  }
}

export const soundManager = new SoundController();
