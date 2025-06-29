'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Music, Search, Play, Volume2 } from 'lucide-react';
import { ChordDiagram } from '@/components/chord-diagram';
import { FullscreenToggle } from '@/components/fullscreen-toggle';
import { AudioPlayer, getChordFrequencies } from '@/lib/audio-player';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

interface Chord {
  name: string;
  positions: number[];
  fingering: number[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

const chords: Chord[] = [
  { name: 'C', positions: [0, 1, 0, 2, 1, 0], fingering: [0, 1, 0, 3, 2, 0], difficulty: 'Beginner', category: 'Major' },
  { name: 'G', positions: [3, 2, 0, 0, 3, 3], fingering: [3, 1, 0, 0, 4, 4], difficulty: 'Beginner', category: 'Major' },
  { name: 'D', positions: [-1, -1, 0, 2, 3, 2], fingering: [0, 0, 0, 1, 3, 2], difficulty: 'Beginner', category: 'Major' },
  { name: 'Em', positions: [0, 2, 2, 0, 0, 0], fingering: [0, 2, 3, 0, 0, 0], difficulty: 'Beginner', category: 'Minor' },
  { name: 'Am', positions: [-1, 0, 2, 2, 1, 0], fingering: [0, 0, 2, 3, 1, 0], difficulty: 'Beginner', category: 'Minor' },
  { name: 'F', positions: [1, 1, 3, 3, 2, 1], fingering: [1, 1, 3, 4, 2, 1], difficulty: 'Intermediate', category: 'Major' },
  { name: 'Bm', positions: [-1, 2, 4, 4, 3, 2], fingering: [0, 1, 3, 4, 2, 1], difficulty: 'Intermediate', category: 'Minor' },
  { name: 'A7', positions: [-1, 0, 2, 0, 2, 0], fingering: [0, 0, 2, 0, 3, 0], difficulty: 'Beginner', category: 'Dominant 7th' },
  { name: 'D7', positions: [-1, -1, 0, 2, 1, 2], fingering: [0, 0, 0, 2, 1, 3], difficulty: 'Beginner', category: 'Dominant 7th' },
  { name: 'Cmaj7', positions: [-1, 3, 2, 0, 0, 0], fingering: [0, 3, 2, 0, 0, 0], difficulty: 'Intermediate', category: 'Major 7th' },
];

const categories = ['All', 'Major', 'Minor', 'Dominant 7th', 'Major 7th', 'Minor 7th'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ChordsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const audioPlayerRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    audioPlayerRef.current = new AudioPlayer();
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.cleanup();
      }
    };
  }, []);

  const filteredChords = chords.filter(chord => {
    const matchesSearch = chord.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || chord.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || chord.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const playChord = async (chord: Chord) => {
    if (!audioPlayerRef.current) return;
    
    setIsPlaying(true);
    
    try {
      // Extract root note from chord name
      const rootNote = chord.name.replace(/[^A-G#b]/g, '');
      const chordType = chord.category.toLowerCase().includes('major') ? 'major' : 
                       chord.category.toLowerCase().includes('minor') ? 'minor' :
                       chord.category.toLowerCase().includes('7th') ? 'dominant7' : 'major';
      
      const frequencies = getChordFrequencies(rootNote, chordType, 4);
      await audioPlayerRef.current.playChord(frequencies, 2);
    } catch (error) {
      console.error('Error playing chord:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const navigateChords = (direction: 'next' | 'prev') => {
    if (filteredChords.length === 0) return;
    
    if (direction === 'next') {
      setCurrentChordIndex((prev) => (prev + 1) % filteredChords.length);
    } else {
      setCurrentChordIndex((prev) => (prev - 1 + filteredChords.length) % filteredChords.length);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'p',
      action: () => {
        if (filteredChords[currentChordIndex]) {
          playChord(filteredChords[currentChordIndex]);
        }
      },
      description: 'Play current chord'
    },
    {
      key: 'ArrowRight',
      action: () => navigateChords('next'),
      description: 'Next chord'
    },
    {
      key: 'ArrowLeft',
      action: () => navigateChords('prev'),
      description: 'Previous chord'
    },
    {
      key: '/',
      action: () => searchInputRef.current?.focus(),
      description: 'Focus search'
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div ref={containerRef} className="fullscreen-container">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Music className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-slate-100">Chord Library</h1>
            <FullscreenToggle targetElement={containerRef} />
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Comprehensive collection of guitar chords with fingering diagrams and audio playback
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search chords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-slate-100"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex gap-1">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? 
                        "bg-blue-600 hover:bg-blue-700" : 
                        "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                
                <div className="flex gap-1">
                  {difficulties.map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={selectedDifficulty === difficulty ? 
                        "bg-green-600 hover:bg-green-700" : 
                        "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }
                    >
                      {difficulty}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chord Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChords.map((chord, index) => (
            <Card 
              key={`${chord.name}-${index}`} 
              className={`border-slate-700 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all cursor-pointer ${
                index === currentChordIndex ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setCurrentChordIndex(index)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-slate-100">{chord.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(chord.difficulty)}>
                      {chord.difficulty}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-400">{chord.category}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ChordDiagram 
                  positions={chord.positions}
                  fingering={chord.fingering}
                  chordName={chord.name}
                />
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    playChord(chord);
                  }}
                  disabled={isPlaying}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  {isPlaying ? 'Playing...' : 'Play Chord'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredChords.length === 0 && (
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Music className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No chords found matching your search criteria.</p>
            </CardContent>
          </Card>
        )}

        {/* Keyboard Shortcuts Help */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm mt-6">
          <CardContent className="p-4">
            <div className="text-sm text-slate-400 text-center">
              <span className="font-medium">Shortcuts:</span> P (Play) • ← → (Navigate) • / (Search) • F11 (Fullscreen)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}