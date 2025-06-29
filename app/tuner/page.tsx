'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Mic, MicOff, Volume2, Settings } from 'lucide-react';
import { AudioProcessor } from '@/lib/audio-utils';
import { FullscreenToggle } from '@/components/fullscreen-toggle';
import { useTunerShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useToast } from '@/hooks/use-toast';

const alternateTunings = {
  'Standard': [
    { note: 'E', frequency: 82.41, string: 6 },
    { note: 'A', frequency: 110.00, string: 5 },
    { note: 'D', frequency: 146.83, string: 4 },
    { note: 'G', frequency: 196.00, string: 3 },
    { note: 'B', frequency: 246.94, string: 2 },
    { note: 'E', frequency: 329.63, string: 1 },
  ],
  'Drop D': [
    { note: 'D', frequency: 73.42, string: 6 },
    { note: 'A', frequency: 110.00, string: 5 },
    { note: 'D', frequency: 146.83, string: 4 },
    { note: 'G', frequency: 196.00, string: 3 },
    { note: 'B', frequency: 246.94, string: 2 },
    { note: 'E', frequency: 329.63, string: 1 },
  ],
  'Open G': [
    { note: 'D', frequency: 73.42, string: 6 },
    { note: 'G', frequency: 98.00, string: 5 },
    { note: 'D', frequency: 146.83, string: 4 },
    { note: 'G', frequency: 196.00, string: 3 },
    { note: 'B', frequency: 246.94, string: 2 },
    { note: 'D', frequency: 293.66, string: 1 },
  ],
  'DADGAD': [
    { note: 'D', frequency: 73.42, string: 6 },
    { note: 'A', frequency: 110.00, string: 5 },
    { note: 'D', frequency: 146.83, string: 4 },
    { note: 'G', frequency: 196.00, string: 3 },
    { note: 'A', frequency: 220.00, string: 2 },
    { note: 'D', frequency: 293.66, string: 1 },
  ],
};

export default function TunerPage() {
  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [frequency, setFrequency] = useState(0);
  const [cents, setCents] = useState(0);
  const [selectedTuning, setSelectedTuning] = useState('Standard');
  const [targetString, setTargetString] = useState<number | null>(null);
  const [sensitivity, setSensitivity] = useState(-50);
  const [autoMode, setAutoMode] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const audioProcessorRef = useRef<AudioProcessor | null>(null);
  const animationRef = useRef<number>();
  const { toast } = useToast();

  const currentTuning = alternateTunings[selectedTuning as keyof typeof alternateTunings];
  const tuningKeys = Object.keys(alternateTunings);
  const currentTuningIndex = tuningKeys.indexOf(selectedTuning);

  const findClosestString = (detectedNote: string, detectedFreq: number) => {
    if (!autoMode) return targetString;
    
    let closestString = null;
    let smallestDifference = Infinity;
    
    currentTuning.forEach((string) => {
      const difference = Math.abs(detectedFreq - string.frequency);
      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestString = string.string;
      }
    });
    
    return closestString;
  };

  const startListening = async () => {
    try {
      if (!audioProcessorRef.current) {
        audioProcessorRef.current = new AudioProcessor();
      }

      await audioProcessorRef.current.startMicrophone();
      setIsListening(true);
      processAudio();
      
      toast({
        title: "Tuner Started",
        description: "Listening for guitar notes...",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (audioProcessorRef.current) {
      audioProcessorRef.current.stopMicrophone();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsListening(false);
    setCurrentNote('');
    setFrequency(0);
    setCents(0);
    
    toast({
      title: "Tuner Stopped",
      description: "No longer listening for notes.",
    });
  };

  const processAudio = () => {
    if (!isListening || !audioProcessorRef.current) return;
    
    const analyze = () => {
      if (!isListening || !audioProcessorRef.current) return;
      
      const result = audioProcessorRef.current.detectPitch(sensitivity);
      
      if (result) {
        setCurrentNote(result.note);
        setFrequency(result.frequency);
        setCents(result.cents);
        
        // Auto-detect which string is being tuned
        const closestString = findClosestString(result.note, result.frequency);
        if (autoMode && closestString) {
          setTargetString(closestString);
        }
      } else {
        setCurrentNote('');
        setFrequency(0);
        setCents(0);
      }
      
      animationRef.current = requestAnimationFrame(analyze);
    };
    
    analyze();
  };

  const playReferenceNote = (stringData?: any) => {
    const noteToPlay = stringData || (targetString ? currentTuning.find(s => s.string === targetString) : null);
    
    if (!noteToPlay) return;

    if (!audioProcessorRef.current) {
      audioProcessorRef.current = new AudioProcessor();
      audioProcessorRef.current.initialize();
    }

    audioProcessorRef.current.playTone(noteToPlay.frequency, 1.5);
    
    toast({
      title: "Reference Note",
      description: `Playing ${noteToPlay.note} (${noteToPlay.frequency.toFixed(1)} Hz)`,
    });
  };

  const changeTuning = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' 
      ? (currentTuningIndex + 1) % tuningKeys.length
      : (currentTuningIndex - 1 + tuningKeys.length) % tuningKeys.length;
    setSelectedTuning(tuningKeys[newIndex]);
  };

  // Keyboard shortcuts
  useTunerShortcuts({
    toggleListening: isListening ? stopListening : startListening,
    playReference: () => playReferenceNote(),
    nextTuning: () => changeTuning('next'),
    previousTuning: () => changeTuning('prev')
  });

  useEffect(() => {
    return () => {
      if (audioProcessorRef.current) {
        audioProcessorRef.current.cleanup();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getTuningAccuracy = (): { color: string; status: string; needle: number } => {
    const absCents = Math.abs(cents);
    const needle = Math.max(-50, Math.min(50, cents));
    
    if (absCents <= 3) return { color: 'text-green-400', status: 'Perfect', needle };
    if (absCents <= 8) return { color: 'text-lime-400', status: 'Very Good', needle };
    if (absCents <= 15) return { color: 'text-yellow-400', status: 'Good', needle };
    if (absCents <= 25) return { color: 'text-orange-400', status: 'Close', needle };
    return { color: 'text-red-400', status: 'Off', needle };
  };

  const tuningAccuracy = getTuningAccuracy();

  return (
    <div ref={containerRef} className="fullscreen-container">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-amber-500" />
              <h1 className="text-3xl font-bold text-slate-100">Guitar Tuner</h1>
              <FullscreenToggle targetElement={containerRef} />
            </div>
            <p className="text-slate-400">
              Professional chromatic tuner with multiple tuning presets
            </p>
          </div>

          {/* Settings */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Tuner Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Tuning</label>
                  <Select value={selectedTuning} onValueChange={setSelectedTuning}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {Object.keys(alternateTunings).map((tuning) => (
                        <SelectItem key={tuning} value={tuning} className="text-slate-100">
                          {tuning}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Mode</label>
                  <Button
                    onClick={() => setAutoMode(!autoMode)}
                    variant={autoMode ? "default" : "outline"}
                    className={autoMode ? 
                      "bg-blue-600 hover:bg-blue-700 w-full" : 
                      "border-slate-600 text-slate-300 hover:bg-slate-700 w-full"
                    }
                  >
                    {autoMode ? 'Auto Detect' : 'Manual'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Sensitivity</label>
                  <Select value={sensitivity.toString()} onValueChange={(value) => setSensitivity(Number(value))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="-40" className="text-slate-100">High</SelectItem>
                      <SelectItem value="-50" className="text-slate-100">Medium</SelectItem>
                      <SelectItem value="-60" className="text-slate-100">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Tuner Display */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  className={`${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white px-8 py-3`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5 mr-2" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Start Tuning
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Note Display */}
              <div className="text-center">
                <div className="text-6xl font-bold text-amber-400 mb-2">
                  {currentNote || '--'}
                </div>
                <div className="text-sm text-slate-400">
                  {frequency > 0 ? `${frequency.toFixed(1)} Hz` : 'No signal detected'}
                </div>
                {targetString && (
                  <div className="text-lg text-slate-300 mt-2">
                    String {targetString}
                  </div>
                )}
              </div>

              {/* Visual Tuner */}
              {frequency > 0 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${tuningAccuracy.color}`}>
                      {cents > 0 ? '+' : ''}{cents} cents
                    </div>
                    <div className={`text-sm ${tuningAccuracy.color}`}>
                      {tuningAccuracy.status}
                    </div>
                  </div>

                  {/* Needle Tuner */}
                  <div className="relative h-20 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Scale markings */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {[-50, -25, 0, 25, 50].map((mark) => (
                          <div
                            key={mark}
                            className="absolute h-4 w-0.5 bg-slate-600"
                            style={{ left: `${50 + mark}%` }}
                          />
                        ))}
                      </div>
                      
                      {/* Center line */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white transform -translate-x-0.5" />
                      
                      {/* Needle */}
                      <div
                        className={`absolute w-1 h-12 rounded-full transition-all duration-200 ${
                          Math.abs(cents) <= 5 ? 'bg-green-400' : 
                          Math.abs(cents) <= 15 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ 
                          left: `${50 + tuningAccuracy.needle}%`,
                          transform: 'translateX(-50%)'
                        }}
                      />
                    </div>
                    
                    {/* Labels */}
                    <div className="absolute bottom-1 left-2 text-xs text-slate-400">Flat</div>
                    <div className="absolute bottom-1 right-2 text-xs text-slate-400">Sharp</div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-white">Perfect</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tuning Reference */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                {selectedTuning} Tuning Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {currentTuning.map((string) => (
                  <div 
                    key={string.string}
                    className={`text-center p-4 rounded-lg border transition-all cursor-pointer hover:bg-slate-700/50 ${
                      targetString === string.string 
                        ? 'border-amber-500 bg-amber-500/10 scale-105' 
                        : 'border-slate-600 bg-slate-700/30'
                    }`}
                    onClick={() => !autoMode && setTargetString(string.string)}
                  >
                    <div className="text-2xl font-bold text-amber-400 mb-1">
                      {string.note}
                    </div>
                    <div className="text-xs text-slate-400 mb-2">
                      String {string.string}
                    </div>
                    <div className="text-xs text-slate-500 mb-2">
                      {string.frequency.toFixed(1)} Hz
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        playReferenceNote(string);
                      }}
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-600 text-xs px-2 py-1"
                    >
                      Play
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts Help */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-slate-400 text-center">
                <span className="font-medium">Shortcuts:</span> Space (Start/Stop) • R (Play Reference) • ← → (Change Tuning) • F11 (Fullscreen)
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}