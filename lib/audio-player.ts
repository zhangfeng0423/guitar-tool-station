export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private currentOscillators: OscillatorNode[] = [];

  async initialize(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async playChord(frequencies: number[], duration: number = 2): Promise<void> {
    await this.initialize();
    if (!this.audioContext || !this.gainNode) return;

    this.stopAll();

    frequencies.forEach((frequency, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const noteGain = this.audioContext!.createGain();
      
      oscillator.connect(noteGain);
      noteGain.connect(this.gainNode!);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext!.currentTime);
      oscillator.type = 'sine';
      
      // Stagger the start slightly for a more natural sound
      const startTime = this.audioContext!.currentTime + (index * 0.05);
      
      noteGain.gain.setValueAtTime(0, startTime);
      noteGain.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
      
      this.currentOscillators.push(oscillator);
    });
  }

  async playProgression(chordFrequencies: number[][], chordDuration: number = 1.5): Promise<void> {
    for (let i = 0; i < chordFrequencies.length; i++) {
      await this.playChord(chordFrequencies[i], chordDuration);
      if (i < chordFrequencies.length - 1) {
        await new Promise(resolve => setTimeout(resolve, chordDuration * 1000));
      }
    }
  }

  async playScale(frequencies: number[], noteDuration: number = 0.5): Promise<void> {
    await this.initialize();
    if (!this.audioContext || !this.gainNode) return;

    for (let i = 0; i < frequencies.length; i++) {
      const oscillator = this.audioContext.createOscillator();
      const noteGain = this.audioContext.createGain();
      
      oscillator.connect(noteGain);
      noteGain.connect(this.gainNode);
      
      oscillator.frequency.setValueAtTime(frequencies[i], this.audioContext.currentTime);
      oscillator.type = 'sine';
      
      const startTime = this.audioContext.currentTime + (i * noteDuration);
      
      noteGain.gain.setValueAtTime(0, startTime);
      noteGain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration - 0.05);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + noteDuration);
    }
  }

  stopAll(): void {
    this.currentOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    this.currentOscillators = [];
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(volume, this.audioContext?.currentTime || 0);
    }
  }

  cleanup(): void {
    this.stopAll();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
      this.gainNode = null;
    }
  }
}

// Helper function to convert note names to frequencies
export const noteToFrequency = (note: string, octave: number = 4): number => {
  const noteFreqs = {
    'C': -9, 'C#': -8, 'Db': -8, 'D': -7, 'D#': -6, 'Eb': -6, 'E': -5, 
    'F': -4, 'F#': -3, 'Gb': -3, 'G': -2, 'G#': -1, 'Ab': -1, 'A': 0, 
    'A#': 1, 'Bb': 1, 'B': 2
  };
  return 440 * Math.pow(2, (noteFreqs[note as keyof typeof noteFreqs] + (octave - 4) * 12) / 12);
};

// Helper function to get chord frequencies
export const getChordFrequencies = (root: string, chordType: string, octave: number = 4): number[] => {
  const chordIntervals: Record<string, number[]> = {
    'major': [0, 4, 7],
    'minor': [0, 3, 7],
    'diminished': [0, 3, 6],
    'augmented': [0, 4, 8],
    'major7': [0, 4, 7, 11],
    'minor7': [0, 3, 7, 10],
    'dominant7': [0, 4, 7, 10],
    'sus2': [0, 2, 7],
    'sus4': [0, 5, 7]
  };

  const intervals = chordIntervals[chordType.toLowerCase()] || chordIntervals['major'];
  const rootFreq = noteToFrequency(root, octave);
  
  return intervals.map(interval => rootFreq * Math.pow(2, interval / 12));
};