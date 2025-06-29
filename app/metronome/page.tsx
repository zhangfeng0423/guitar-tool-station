'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { FullscreenToggle } from '@/components/fullscreen-toggle';
import { useMetronomeShortcuts } from '@/hooks/use-keyboard-shortcuts';

export default function MetronomePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [timeSignature, setTimeSignature] = useState('4/4');
  const [currentBeat, setCurrentBeat] = useState(0);
  const [accentFirst, setAccentFirst] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const timeSignatures = [
    { value: '4/4', label: '4/4', beats: 4 },
    { value: '3/4', label: '3/4', beats: 3 },
    { value: '2/4', label: '2/4', beats: 2 },
    { value: '6/8', label: '6/8', beats: 6 },
    { value: '5/4', label: '5/4', beats: 5 },
  ];

  const currentTimeSignature = timeSignatures.find(ts => ts.value === timeSignature) || timeSignatures[0];

  const playClick = (isAccent: boolean = false) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(isAccent ? 800 : 600, ctx.currentTime);
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  };

  const startMetronome = () => {
    const interval = 60000 / bpm; // milliseconds per beat
    
    intervalRef.current = setInterval(() => {
      setCurrentBeat(prev => {
        const nextBeat = (prev + 1) % currentTimeSignature.beats;
        const isAccent = accentFirst && nextBeat === 0;
        playClick(isAccent);
        return nextBeat;
      });
    }, interval);
    
    setIsPlaying(true);
    // Play first beat immediately
    playClick(accentFirst);
    setCurrentBeat(0);
  };

  const stopMetronome = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleMetronome = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };

  const resetMetronome = () => {
    stopMetronome();
    setCurrentBeat(0);
  };

  const adjustTempo = (direction: 'up' | 'down') => {
    setBpm(prev => {
      const newBpm = direction === 'up' ? prev + 1 : prev - 1;
      return Math.max(40, Math.min(208, newBpm));
    });
  };

  // Keyboard shortcuts
  useMetronomeShortcuts({
    togglePlay: toggleMetronome,
    increaseTempo: () => adjustTempo('up'),
    decreaseTempo: () => adjustTempo('down'),
    reset: resetMetronome
  });

  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
  }, [bpm, timeSignature, accentFirst]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const getTempoDescription = (bpm: number): string => {
    if (bpm < 60) return 'Largo';
    if (bpm < 72) return 'Adagio';
    if (bpm < 108) return 'Andante';
    if (bpm < 120) return 'Moderato';
    if (bpm < 168) return 'Allegro';
    if (bpm < 200) return 'Presto';
    return 'Prestissimo';
  };

  return (
    <div ref={containerRef} className="fullscreen-container">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-red-500" />
              <h1 className="text-3xl font-bold text-slate-100">Metronome</h1>
              <FullscreenToggle targetElement={containerRef} />
            </div>
            <p className="text-slate-400">
              Keep perfect time with adjustable tempo and time signatures
            </p>
          </div>

          {/* Main Controls */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-slate-100">
                <div className="text-5xl font-bold text-red-400 mb-2">{bpm}</div>
                <div className="text-lg text-slate-300">{getTempoDescription(bpm)}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* BPM Slider */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>40 BPM</span>
                  <span>208 BPM</span>
                </div>
                <Slider
                  value={[bpm]}
                  onValueChange={(value) => setBpm(value[0])}
                  min={40}
                  max={208}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Beat Display */}
              <div className="flex justify-center items-center space-x-2">
                {Array.from({ length: currentTimeSignature.beats }, (_, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-150 ${
                      currentBeat === index
                        ? 'border-red-500 bg-red-500/20 text-red-400 scale-110'
                        : 'border-slate-600 text-slate-400'
                    } ${index === 0 && accentFirst ? 'border-amber-500' : ''}`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={toggleMetronome}
                  className={`${
                    isPlaying 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white px-8 py-3`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={resetMetronome}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-100">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Time Signature</label>
                  <Select value={timeSignature} onValueChange={setTimeSignature}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {timeSignatures.map((ts) => (
                        <SelectItem key={ts.value} value={ts.value} className="text-slate-100">
                          {ts.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Accent First Beat</label>
                  <Button
                    onClick={() => setAccentFirst(!accentFirst)}
                    variant={accentFirst ? "default" : "outline"}
                    className={accentFirst ? 
                      "bg-amber-600 hover:bg-amber-700 text-white w-full" : 
                      "border-slate-600 text-slate-300 hover:bg-slate-700 w-full"
                    }
                  >
                    {accentFirst ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Presets */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-100">Quick Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[60, 80, 100, 120, 140, 160, 180, 200].map((preset) => (
                  <Button
                    key={preset}
                    onClick={() => setBpm(preset)}
                    variant={bpm === preset ? "default" : "outline"}
                    size="sm"
                    className={bpm === preset ? 
                      "bg-blue-600 hover:bg-blue-700" : 
                      "border-slate-600 text-slate-300 hover:bg-slate-700"
                    }
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts Help */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-slate-400 text-center">
                <span className="font-medium">Shortcuts:</span> Space (Start/Stop) • ↑↓ (Tempo) • R (Reset) • F11 (Fullscreen)
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}