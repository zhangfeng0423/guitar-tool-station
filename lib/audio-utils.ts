export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private isInitialized = false;
  private cleanupCallbacks: (() => void)[] = [];

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Use a more compatible audio context creation
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass({ 
        sampleRate: 44100,
        latencyHint: 'interactive'
      });
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      throw new Error('Audio not supported in this browser');
    }
  }

  async startMicrophone(constraints?: MediaStreamConstraints['audio']): Promise<AnalyserNode> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const defaultConstraints = {
      echoCancellation: false,
      autoGainControl: false,
      noiseSuppression: false,
      sampleRate: 44100,
      channelCount: 1
    };

    try {
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access not supported');
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { ...defaultConstraints, ...constraints }
      });

      this.source = this.audioContext!.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext!.createAnalyser();
      
      // Optimized settings for guitar tuning
      this.analyser.fftSize = 8192;
      this.analyser.smoothingTimeConstant = 0.3;
      this.analyser.minDecibels = -90;
      this.analyser.maxDecibels = -10;
      
      this.source.connect(this.analyser);
      
      return this.analyser;
    } catch (error) {
      this.cleanup();
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Microphone permission denied. Please allow microphone access.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No microphone found. Please connect a microphone.');
        } else if (error.name === 'NotReadableError') {
          throw new Error('Microphone is being used by another application.');
        }
      }
      throw new Error('Failed to access microphone');
    }
  }

  stopMicrophone(): void {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
      this.stream = null;
    }

    this.analyser = null;
  }

  cleanup(): void {
    this.stopMicrophone();
    
    // Execute cleanup callbacks
    this.cleanupCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.warn('Cleanup callback error:', error);
      }
    });
    this.cleanupCallbacks = [];
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(console.warn);
      this.audioContext = null;
    }
    
    this.isInitialized = false;
  }

  addCleanupCallback(callback: () => void): void {
    this.cleanupCallbacks.push(callback);
  }

  playTone(frequency: number, duration: number = 0.5, delay: number = 0): void {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime + delay);
      oscillator.type = 'sine';

      const startTime = this.audioContext.currentTime + delay;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);

      // Auto-cleanup
      this.addCleanupCallback(() => {
        try {
          oscillator.stop();
        } catch (e) {
          // Already stopped
        }
      });
    } catch (error) {
      console.warn('Failed to play tone:', error);
    }
  }

  getFrequencyData(): Float32Array | null {
    if (!this.analyser) return null;
    
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    this.analyser.getFloatFrequencyData(dataArray);
    
    return dataArray;
  }

  detectPitch(sensitivity: number = -50): { frequency: number; note: string; cents: number } | null {
    const dataArray = this.getFrequencyData();
    if (!dataArray || !this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const bufferLength = dataArray.length;
    
    // Optimized frequency range for guitar (80Hz - 1000Hz)
    const minIndex = Math.floor(80 * bufferLength / (sampleRate / 2));
    const maxIndex = Math.floor(1000 * bufferLength / (sampleRate / 2));
    
    let maxValue = -Infinity;
    let maxFreqIndex = 0;
    
    // Find peak with better noise filtering
    for (let i = minIndex; i < maxIndex; i++) {
      if (dataArray[i] > maxValue && dataArray[i] > sensitivity) {
        maxValue = dataArray[i];
        maxFreqIndex = i;
      }
    }
    
    if (maxValue < sensitivity) return null;
    
    // Improved frequency calculation with interpolation
    const frequency = this.interpolateFrequency(dataArray, maxFreqIndex, sampleRate);
    const { note, cents } = this.frequencyToNote(frequency);
    
    return { frequency, note, cents };
  }

  private interpolateFrequency(dataArray: Float32Array, peakIndex: number, sampleRate: number): number {
    const binWidth = sampleRate / (2 * dataArray.length);
    
    // Parabolic interpolation for better frequency accuracy
    if (peakIndex > 0 && peakIndex < dataArray.length - 1) {
      const y1 = dataArray[peakIndex - 1];
      const y2 = dataArray[peakIndex];
      const y3 = dataArray[peakIndex + 1];
      
      const a = (y1 - 2 * y2 + y3) / 2;
      const b = (y3 - y1) / 2;
      
      if (a !== 0) {
        const xOffset = -b / (2 * a);
        return (peakIndex + xOffset) * binWidth;
      }
    }
    
    return peakIndex * binWidth;
  }

  private frequencyToNote(frequency: number): { note: string; cents: number } {
    const A4 = 440;
    const C0 = A4 * Math.pow(2, -4.75);
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    if (frequency <= 0) return { note: '', cents: 0 };
    
    const h = Math.round(12 * Math.log2(frequency / C0));
    const octave = Math.floor(h / 12);
    const n = h % 12;
    const note = noteNames[n] + octave;
    
    const targetFreq = C0 * Math.pow(2, h / 12);
    const cents = Math.round(1200 * Math.log2(frequency / targetFreq));
    
    return { note, cents };
  }
}

export const noteToFrequency = (note: string, octave: number): number => {
  const noteFreqs = {
    'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4,
    'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2
  };
  return 440 * Math.pow(2, (noteFreqs[note as keyof typeof noteFreqs] + (octave - 4) * 12) / 12);
};

export const generateScale = (root: string, intervals: number[]): string[] => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootIndex = notes.indexOf(root);
  
  return intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return notes[noteIndex];
  });
};