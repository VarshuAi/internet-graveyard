// Web Audio API Procedural Synthesizer for Defunct Web Relics
// 100% Client-Side, Zero External MP3 Dependencies

export interface AudioRelic {
  id: string;
  name: string;
  entitySlug?: string;
  platform: string;
  year: string;
  description: string;
  culturalImpact: string;
  durationSec: number;
}

export const SOUND_RELICS: AudioRelic[] = [
  {
    id: 'icq-uhoh',
    name: "ICQ 'Uh-Oh!'",
    entitySlug: 'icq',
    platform: 'ICQ Instant Messenger',
    year: '1996',
    description: 'The two-tone chirp that notified 100M+ users of a new incoming message in the late 90s.',
    culturalImpact: 'Voiced by an Mirabilis engineer’s daughter or friend, heard billions of times globally.',
    durationSec: 0.6
  },
  {
    id: 'aol-dialup',
    name: 'AOL 56k Dial-Up Handshake',
    entitySlug: 'aol',
    platform: 'America Online / V.90 Modem',
    year: '1991 — 2001',
    description: 'The iconic DTMF dialing tones followed by the chaotic white-noise frequency handshake of a 56k connection.',
    culturalImpact: 'The gateway ceremony of entering cyberspace for an entire generation.',
    durationSec: 4.8
  },
  {
    id: 'msn-nudge',
    name: 'MSN Messenger Nudge',
    entitySlug: 'msn-messenger',
    platform: 'MSN Messenger / Windows Live',
    year: '2005',
    description: 'The aggressive double-thud buzz that literally rattled the chat window to demand attention.',
    culturalImpact: 'Triggered frantic screen tremors and endless sibling/friend trolling.',
    durationSec: 0.8
  },
  {
    id: 'skype-ring',
    name: 'Classic Skype Incoming Call',
    entitySlug: 'skype',
    platform: 'Skype 1.0 — 3.0',
    year: '2003',
    description: 'The buoyant marimba ringtone that accompanied early international peer-to-peer VoIP calls.',
    culturalImpact: 'Brought long-distance voice calls to zero cost across the globe.',
    durationSec: 2.2
  },
  {
    id: 'aim-door',
    name: 'AIM Buddy In / Buddy Out',
    entitySlug: 'aim',
    platform: 'AOL Instant Messenger',
    year: '1997',
    description: 'The creaking wooden door opening when a crush logged on, and slamming shut when they logged off.',
    culturalImpact: 'The soundtrack to after-school social life for over a decade.',
    durationSec: 1.1
  },
  {
    id: 'win95-startup',
    name: 'Windows 95/98 Ethereal Chime',
    platform: 'Microsoft Windows 95',
    year: '1995',
    description: 'The lush, otherworldly 6-second ambient chord composed by Brian Eno.',
    culturalImpact: 'Brian Eno composed it on a Mac using an exact brief of 3.25 seconds of pure optimism.',
    durationSec: 3.5
  },
  {
    id: 'club-penguin-theme',
    name: 'Club Penguin Dance Tune',
    entitySlug: 'club-penguin',
    platform: 'Club Penguin',
    year: '2005',
    description: 'The energetic 8-bit synthesizer melody of the Night Club and Dance Lounge.',
    culturalImpact: 'Hundreds of millions of penguins did the /dance command to this loop.',
    durationSec: 2.5
  }
];

class RelicAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentStopFn: (() => void) | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public stop(): void {
    if (this.currentStopFn) {
      this.currentStopFn();
      this.currentStopFn = null;
    }
    this.isPlaying = false;
  }

  public playRelic(relicId: string, onEnd?: () => void): boolean {
    if (typeof window === 'undefined') return false;
    this.stop();

    const ctx = this.getContext();
    this.isPlaying = true;

    const finish = () => {
      this.isPlaying = false;
      this.currentStopFn = null;
      onEnd?.();
    };

    try {
      switch (relicId) {
        case 'icq-uhoh':
          this.playICQUhOh(ctx, finish);
          break;
        case 'aol-dialup':
          this.playAOLDialup(ctx, finish);
          break;
        case 'msn-nudge':
          this.playMSNNudge(ctx, finish);
          break;
        case 'skype-ring':
          this.playSkypeRing(ctx, finish);
          break;
        case 'aim-door':
          this.playAIMDoor(ctx, finish);
          break;
        case 'win95-startup':
          this.playWin95(ctx, finish);
          break;
        case 'club-penguin-theme':
          this.playClubPenguin(ctx, finish);
          break;
        default:
          finish();
          return false;
      }
      return true;
    } catch (e) {
      console.error('Audio synthesizer error:', e);
      finish();
      return false;
    }
  }

  // 1. ICQ "Uh-Oh!"
  private playICQUhOh(ctx: AudioContext, onEnd: () => void) {
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    // First syllable "Uh"
    osc1.frequency.setValueAtTime(580, now);
    osc2.frequency.setValueAtTime(585, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.04);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.18);

    // Second syllable "Oh!" (higher pitch)
    osc1.frequency.setValueAtTime(860, now + 0.22);
    osc1.frequency.exponentialRampToValueAtTime(940, now + 0.45);
    osc2.frequency.setValueAtTime(865, now + 0.22);
    osc2.frequency.exponentialRampToValueAtTime(945, now + 0.45);

    gain.gain.setValueAtTime(0.01, now + 0.22);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.26);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);

    const timer = setTimeout(onEnd, 600);
    this.currentStopFn = () => {
      try { osc1.stop(); osc2.stop(); } catch {}
      clearTimeout(timer);
    };
  }

  // 2. AOL Dial-up Handshake
  private playAOLDialup(ctx: AudioContext, onEnd: () => void) {
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.25, now);
    masterGain.connect(ctx.destination);

    // Part A: DTMF Touch-tone dialing sequence
    const dtmfFreqs = [
      [697, 1209], [770, 1336], [852, 1477], 
      [941, 1336], [697, 1477], [770, 1209], [852, 1336]
    ];

    dtmfFreqs.forEach((freqs, i) => {
      const toneStart = now + (i * 0.12);
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      const g = ctx.createGain();

      o1.type = 'sine';
      o2.type = 'sine';
      o1.frequency.value = freqs[0];
      o2.frequency.value = freqs[1];

      g.gain.setValueAtTime(0.2, toneStart);
      g.gain.setValueAtTime(0, toneStart + 0.08);

      o1.connect(g);
      o2.connect(g);
      g.connect(masterGain);

      o1.start(toneStart);
      o2.start(toneStart);
      o1.stop(toneStart + 0.08);
      o2.stop(toneStart + 0.08);
    });

    // Part B: Ringback tone at 1.1s
    const ringStart = now + 1.1;
    const r1 = ctx.createOscillator();
    const r2 = ctx.createOscillator();
    const rg = ctx.createGain();
    r1.frequency.value = 440;
    r2.frequency.value = 480;
    rg.gain.setValueAtTime(0.15, ringStart);
    rg.gain.setValueAtTime(0, ringStart + 0.6);
    r1.connect(rg);
    r2.connect(rg);
    rg.connect(masterGain);
    r1.start(ringStart);
    r2.start(ringStart);
    r1.stop(ringStart + 0.6);
    r2.stop(ringStart + 0.6);

    // Part C: The famous Modem Handshake Noise Burst (1.9s to 4.5s)
    const modemStart = now + 1.9;
    const bufferSize = ctx.sampleRate * 2.6;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, modemStart);
    filter.frequency.linearRampToValueAtTime(2400, modemStart + 1.2);
    filter.frequency.linearRampToValueAtTime(1200, modemStart + 2.4);
    filter.Q.value = 4.0;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, modemStart);
    noiseGain.gain.linearRampToValueAtTime(0.2, modemStart + 0.2);
    noiseGain.gain.setValueAtTime(0.18, modemStart + 2.0);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, modemStart + 2.6);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);

    whiteNoise.start(modemStart);
    whiteNoise.stop(modemStart + 2.6);

    // Dual carrier whine
    const carrier = ctx.createOscillator();
    const carrierGain = ctx.createGain();
    carrier.type = 'sawtooth';
    carrier.frequency.setValueAtTime(1200, modemStart);
    carrier.frequency.exponentialRampToValueAtTime(2100, modemStart + 1.0);
    carrierGain.gain.setValueAtTime(0.08, modemStart);
    carrierGain.gain.exponentialRampToValueAtTime(0.001, modemStart + 2.2);

    carrier.connect(carrierGain);
    carrierGain.connect(masterGain);
    carrier.start(modemStart);
    carrier.stop(modemStart + 2.3);

    const timer = setTimeout(onEnd, 4800);
    this.currentStopFn = () => {
      try {
        whiteNoise.stop();
        carrier.stop();
      } catch {}
      clearTimeout(timer);
    };
  }

  // 3. MSN Messenger Nudge
  private playMSNNudge(ctx: AudioContext, onEnd: () => void) {
    const now = ctx.currentTime;
    
    // Pulse 1
    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(140, now);
    osc1.frequency.exponentialRampToValueAtTime(60, now + 0.15);
    g1.gain.setValueAtTime(0.3, now);
    g1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc1.connect(g1);
    g1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Pulse 2 (heavier rattle)
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(160, now + 0.18);
    osc2.frequency.exponentialRampToValueAtTime(50, now + 0.45);
    g2.gain.setValueAtTime(0.35, now + 0.18);
    g2.gain.exponentialRampToValueAtTime(0.005, now + 0.45);
    osc2.connect(g2);
    g2.connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.45);

    const timer = setTimeout(onEnd, 600);
    this.currentStopFn = () => {
      try { osc1.stop(); osc2.stop(); } catch {}
      clearTimeout(timer);
    };
  }

  // 4. Skype Classic Call Ring
  private playSkypeRing(ctx: AudioContext, onEnd: () => void) {
    const now = ctx.currentTime;
    // Marimba note sequence: G#4 (415), B4 (493), E5 (659), G#5 (830)
    const notes = [415, 493, 659, 830, 659, 830];
    
    notes.forEach((freq, idx) => {
      const startTime = now + (idx * 0.16);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.28, startTime);
      gain.gain.exponentialRampToValueAtTime(0.005, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });

    const timer = setTimeout(onEnd, 2200);
    this.currentStopFn = () => {
      clearTimeout(timer);
    };
  }

  // 5. AIM Door Open / Close
  private playAIMDoor(ctx: AudioContext, onEnd: () => void) {
    const now = ctx.currentTime;
    
    // Wooden door creak + latch click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(240, now + 0.35);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.35);
    gain.gain.setValueAtTime(0, now + 0.38);

    // Snap latch
    const snap = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snap.type = 'square';
    snap.frequency.setValueAtTime(800, now + 0.39);
    snap.frequency.exponentialRampToValueAtTime(100, now + 0.45);
    snapGain.gain.setValueAtTime(0.25, now + 0.39);
    snapGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);
    snap.connect(snapGain);
    snapGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.38);
    snap.start(now + 0.39);
    snap.stop(now + 0.46);

    const timer = setTimeout(onEnd, 800);
    this.currentStopFn = () => {
      try { osc.stop(); snap.stop(); } catch {}
      clearTimeout(timer);
    };
  }

  // 6. Windows 95/98 Startup Chime
  private playWin95(ctx: AudioContext, onEnd: () => void) {
    const now = ctx.currentTime;
    // Ambient pad chord: Eb, Bb, Eb, G, Bb, C
    const freqs = [155.56, 233.08, 311.13, 392.00, 466.16, 523.25];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + (idx * 0.08));

      gain.gain.setValueAtTime(0.01, now + (idx * 0.08));
      gain.gain.linearRampToValueAtTime(0.08, now + 0.6 + (idx * 0.08));
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + (idx * 0.08));
      osc.stop(now + 3.3);
    });

    const timer = setTimeout(onEnd, 3500);
    this.currentStopFn = () => {
      clearTimeout(timer);
    };
  }

  // 7. Club Penguin Dance Tune
  private playClubPenguin(ctx: AudioContext, onEnd: () => void) {
    const now = ctx.currentTime;
    // Fast 8-bit upbeat chiptune sequence: C5, E5, G5, A5, G5, E5, C5, D5
    const melody = [523, 659, 784, 880, 784, 659, 523, 587];

    melody.forEach((freq, idx) => {
      const noteTime = now + (idx * 0.15);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.12, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.005, noteTime + 0.13);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.14);
    });

    const timer = setTimeout(onEnd, 2000);
    this.currentStopFn = () => {
      clearTimeout(timer);
    };
  }
}

export const relicAudio = new RelicAudioSynthesizer();
