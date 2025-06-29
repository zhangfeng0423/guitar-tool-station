'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Play, Shuffle, Music, Volume2, Square } from 'lucide-react';
import { FullscreenToggle } from '@/components/fullscreen-toggle';
import { AudioPlayer, getChordFrequencies } from '@/lib/audio-player';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const modes = ['Major', 'Minor', 'Dorian', 'Mixolydian'];

const commonProgressions = {
  'Major': [
    { name: 'I-V-vi-IV', chords: ['I', 'V', 'vi', 'IV'], description: 'Pop progression' },
    { name: 'ii-V-I', chords: ['ii', 'V', 'I'], description: 'Jazz standard' },
    { name: 'I-vi-IV-V', chords: ['I', 'vi', 'IV', 'V'], description: '50s progression' },
    { name: 'vi-IV-I-V', chords: ['vi', 'IV', 'I', 'V'], description: 'Pop ballad' },
  ],
  'Minor': [
    { name: 'i-VII-VI-VII', chords: ['i', 'VII', 'VI', 'VII'], description: 'Rock progression' },
    { name: 'i-iv-V-i', chords: ['i', 'iv', 'V', 'i'], description: 'Classical minor' },
    { name: 'i-VI-III-VII', chords: ['i', 'VI', 'III', 'VII'], description: 'Andalusian' },
    { name: 'i-v-iv-i', chords: ['i', 'v', 'iv', 'i'], description: 'Natural minor' },
  ]
};

export default function ProgressionsPage() {
  const [selectedKey, setSelectedKey] = useState('C');
  const [selectedMode, setSelectedMode] = useState('Major');
  const [customProgression, setCustomProgression] = useState(['I', 'V', 'vi', 'IV']);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const audioPlayerRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    audioPlayerRef.current = new AudioPlayer();
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.cleanup();
      }
    };
  }, []);

  const getChordName = (romanNumeral: string, key: string, mode: string): string => {
    const majorScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const minorScale = ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'];
    
    const keyIndex = keys.indexOf(key);
    const scale = mode === 'Major' ? majorScale : minorScale;
    
    // Simple mapping for demonstration
    const romanToIndex = {
      'I': 0, 'i': 0, 'II': 1, 'ii': 1, 'III': 2, 'iii': 2,
      'IV': 3, 'iv': 3, 'V': 4, 'v': 4, 'VI': 5, 'vi': 5, 'VII': 6, 'vii': 6
    };
    
    const scaleIndex = romanToIndex[romanNumeral as keyof typeof romanToIndex] || 0;
    const noteIndex = (keyIndex + scaleIndex) % 12;
    
    return keys[noteIndex];
  };

  const getChordType = (romanNumeral: string, mode: string): string => {
    const isUpperCase = romanNumeral === romanNumeral.toUpperCase();
    
    if (mode === 'Major') {
      if (['I', 'IV', 'V'].includes(romanNumeral)) return 'major';
      if (['ii', 'iii', 'vi'].includes(romanNumeral)) return 'minor';
      if (romanNumeral === 'vii°') return 'diminished';
    } else {
      if (['i', 'iv', 'v'].includes(romanNumeral)) return 'minor';
      if (['III', 'VI', 'VII'].includes(romanNumeral)) return 'major';
      if (romanNumeral === 'ii°') return 'diminished';
    }
    
    return isUpperCase ? 'major' : 'minor';
  };

  const playProgression = async () => {
    if (!audioPlayerRef.current) return;
    
    if (isPlaying) {
      audioPlayerRef.current.stopAll();
      setIsPlaying(false);
      setCurrentChordIndex(-1);
      return;
    }

    setIsPlaying(true);
    
    try {
      for (let i = 0; i < customProgression.length; i++) {
        if (!isPlaying) break;
        
        setCurrentChordIndex(i);
        const romanNumeral = customProgression[i];
        const chordRoot = getChordName(romanNumeral, selectedKey, selectedMode);
        const chordType = getChordType(romanNumeral, selectedMode);
        const frequencies = getChordFrequencies(chordRoot, chordType, 4);
        
        await audioPlayerRef.current.playChord(frequencies, 1.5);
        
        if (i < customProgression.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1600));
        }
      }
    } catch (error) {
      console.error('Error playing progression:', error);
    } finally {
      setIsPlaying(false);
      setCurrentChordIndex(-1);
    }
  };

  const randomizeProgression = () => {
    const progressions = commonProgressions[selectedMode as keyof typeof commonProgressions];
    const randomProg = progressions[Math.floor(Math.random() * progressions.length)];
    setCustomProgression(randomProg.chords);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: ' ',
      action: playProgression,
      description: 'Play/stop progression'
    },
    {
      key: 'r',
      action: randomizeProgression,
      description: 'Random progression'
    },
    {
      key: 'ArrowRight',
      action: () => {
        const currentIndex = keys.indexOf(selectedKey);
        const nextIndex = (currentIndex + 1) % keys.length;
        setSelectedKey(keys[nextIndex]);
      },
      description: 'Next key'
    },
    {
      key: 'ArrowLeft',
      action: () => {
        const currentIndex = keys.indexOf(selectedKey);
        const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
        setSelectedKey(keys[prevIndex]);
      },
      description: 'Previous key'
    }
  ]);

  return (
    <div ref={containerRef} className="fullscreen-container">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold text-slate-100">Chord Progressions</h1>
            <FullscreenToggle targetElement={containerRef} />
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Generate and analyze chord progressions with Roman numeral notation
          </p>
        </div>

        {/* Controls */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-slate-100">Progression Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Key</label>
                <Select value={selectedKey} onValueChange={setSelectedKey}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {keys.map((key) => (
                      <SelectItem key={key} value={key} className="text-slate-100">
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Mode</label>
                <Select value={selectedMode} onValueChange={setSelectedMode}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {modes.map((mode) => (
                      <SelectItem key={mode} value={mode} className="text-slate-100">
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Actions</label>
                <div className="flex gap-2">
                  <Button
                    onClick={playProgression}
                    className={`${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {isPlaying ? (
                      <>
                        <Square className="w-4 h-4 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Play
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={randomizeProgression}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Random
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Progression */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Current Progression
              {isPlaying && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                  Playing
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 justify-center">
              {customProgression.map((chord, index) => (
                <div key={index} className="text-center">
                  <div className={`px-6 py-4 rounded-lg mb-2 transition-all duration-300 ${
                    currentChordIndex === index 
                      ? 'bg-purple-600 text-white scale-110 shadow-lg shadow-purple-500/50' 
                      : 'bg-purple-600/80 text-white'
                  }`}>
                    <div className="text-2xl font-bold">{chord}</div>
                    <div className="text-sm opacity-80">
                      {getChordName(chord, selectedKey, selectedMode)}
                    </div>
                  </div>
                  {index < customProgression.length - 1 && (
                    <div className="text-slate-400 text-sm">→</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common Progressions */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-100">Common Progressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commonProgressions[selectedMode as keyof typeof commonProgressions].map((progression, index) => (
                <Card key={index} className="border-slate-600 bg-slate-700/50 hover:bg-slate-700/70 transition-colors cursor-pointer"
                      onClick={() => setCustomProgression(progression.chords)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-slate-100">{progression.name}</CardTitle>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        {selectedMode}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-sm mb-3">{progression.description}</p>
                    <div className="flex gap-2">
                      {progression.chords.map((chord, chordIndex) => (
                        <span key={chordIndex} className="bg-slate-600 text-slate-200 px-2 py-1 rounded text-sm">
                          {chord}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts Help */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm mt-6">
          <CardContent className="p-4">
            <div className="text-sm text-slate-400 text-center">
              <span className="font-medium">Shortcuts:</span> Space (Play/Stop) • R (Random) • ← → (Change Key) • F11 (Fullscreen)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}