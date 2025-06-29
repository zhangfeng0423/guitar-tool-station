'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Zap, Music, Target } from 'lucide-react';

interface Scale {
  name: string;
  intervals: number[];
  notes: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  description: string;
}

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const scalePatterns = {
  'Major': [0, 2, 4, 5, 7, 9, 11],
  'Natural Minor': [0, 2, 3, 5, 7, 8, 10],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
  'Melodic Minor': [0, 2, 3, 5, 7, 9, 11],
  'Dorian': [0, 2, 3, 5, 7, 9, 10],
  'Phrygian': [0, 1, 3, 5, 7, 8, 10],
  'Lydian': [0, 2, 4, 6, 7, 9, 11],
  'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
  'Locrian': [0, 1, 3, 5, 6, 8, 10],
  'Pentatonic Major': [0, 2, 4, 7, 9],
  'Pentatonic Minor': [0, 3, 5, 7, 10],
  'Blues': [0, 3, 5, 6, 7, 10],
  'Chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

const scaleInfo = {
  'Major': { difficulty: 'Beginner' as const, category: 'Diatonic', description: 'The foundation of Western music theory' },
  'Natural Minor': { difficulty: 'Beginner' as const, category: 'Diatonic', description: 'The relative minor scale' },
  'Harmonic Minor': { difficulty: 'Intermediate' as const, category: 'Minor Variations', description: 'Minor scale with raised 7th degree' },
  'Melodic Minor': { difficulty: 'Intermediate' as const, category: 'Minor Variations', description: 'Ascending and descending variations' },
  'Dorian': { difficulty: 'Intermediate' as const, category: 'Modes', description: 'Natural minor with raised 6th' },
  'Phrygian': { difficulty: 'Intermediate' as const, category: 'Modes', description: 'Natural minor with lowered 2nd' },
  'Lydian': { difficulty: 'Intermediate' as const, category: 'Modes', description: 'Major scale with raised 4th' },
  'Mixolydian': { difficulty: 'Intermediate' as const, category: 'Modes', description: 'Major scale with lowered 7th' },
  'Locrian': { difficulty: 'Advanced' as const, category: 'Modes', description: 'Diminished scale pattern' },
  'Pentatonic Major': { difficulty: 'Beginner' as const, category: 'Pentatonic', description: 'Five-note major scale' },
  'Pentatonic Minor': { difficulty: 'Beginner' as const, category: 'Pentatonic', description: 'Five-note minor scale' },
  'Blues': { difficulty: 'Intermediate' as const, category: 'Blues', description: 'Six-note blues scale' },
  'Chromatic': { difficulty: 'Advanced' as const, category: 'Chromatic', description: 'All twelve semitones' },
};

const categories = ['All', 'Diatonic', 'Modes', 'Pentatonic', 'Blues', 'Minor Variations', 'Chromatic'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ScalesPage() {
  const [selectedRoot, setSelectedRoot] = useState('C');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const generateScale = (root: string, pattern: number[]): string[] => {
    const rootIndex = notes.indexOf(root);
    return pattern.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return notes[noteIndex];
    });
  };

  const getScales = (): Scale[] => {
    return Object.entries(scalePatterns).map(([name, pattern]) => {
      const info = scaleInfo[name as keyof typeof scaleInfo];
      return {
        name,
        intervals: pattern,
        notes: generateScale(selectedRoot, pattern),
        difficulty: info.difficulty,
        category: info.category,
        description: info.description,
      };
    });
  };

  const filteredScales = getScales().filter(scale => {
    const matchesCategory = selectedCategory === 'All' || scale.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || scale.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const FretboardDiagram = ({ scale }: { scale: Scale }) => {
    const strings = [
      { note: 'E', fret: 0 }, // High E
      { note: 'B', fret: 0 },
      { note: 'G', fret: 0 },
      { note: 'D', fret: 0 },
      { note: 'A', fret: 0 },
      { note: 'E', fret: 0 }, // Low E
    ];

    const isNoteInScale = (note: string): boolean => {
      return scale.notes.includes(note);
    };

    const getNoteAtFret = (stringNote: string, fret: number): string => {
      const stringIndex = notes.indexOf(stringNote);
      const noteIndex = (stringIndex + fret) % 12;
      return notes[noteIndex];
    };

    return (
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
        <svg width="300" height="120" className="overflow-visible">
          {/* Fret lines */}
          {Array.from({ length: 13 }, (_, fret) => (
            <line
              key={fret}
              x1={20 + fret * 20}
              y1="10"
              x2={20 + fret * 20}
              y2="110"
              stroke="#475569"
              strokeWidth={fret === 0 ? "3" : "1"}
            />
          ))}
          
          {/* String lines */}
          {strings.map((string, stringIndex) => (
            <line
              key={stringIndex}
              x1="20"
              y1={20 + stringIndex * 15}
              x2="260"
              y2={20 + stringIndex * 15}
              stroke="#475569"
              strokeWidth="1"
            />
          ))}
          
          {/* Scale notes */}
          {strings.map((string, stringIndex) => 
            Array.from({ length: 12 }, (_, fret) => {
              const note = getNoteAtFret(string.note, fret);
              const inScale = isNoteInScale(note);
              const isRoot = note === selectedRoot;
              
              if (!inScale) return null;
              
              return (
                <circle
                  key={`${stringIndex}-${fret}`}
                  cx={30 + fret * 20}
                  cy={20 + stringIndex * 15}
                  r="6"
                  fill={isRoot ? "#f59e0b" : "#3b82f6"}
                  stroke="#1e293b"
                  strokeWidth="1"
                />
              );
            })
          )}
        </svg>
        
        {/* Fret markers */}
        <div className="flex justify-between text-xs text-slate-400 mt-2 px-5">
          {Array.from({ length: 13 }, (_, i) => (
            <span key={i} className="w-4 text-center">{i}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <Zap className="w-8 h-8 text-green-500" />
          <h1 className="text-3xl font-bold text-slate-100">Scale Finder</h1>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Explore guitar scales with interactive fretboard patterns and music theory insights
        </p>
      </div>

      {/* Controls */}
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Root Note</label>
              <Select value={selectedRoot} onValueChange={setSelectedRoot}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {notes.map((note) => (
                    <SelectItem key={note} value={note} className="text-slate-100">
                      {note}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      {/* Scales Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredScales.map((scale, index) => (
          <Card key={`${scale.name}-${index}`} className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-slate-100">
                  {selectedRoot} {scale.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(scale.difficulty)}>
                    {scale.difficulty}
                  </Badge>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    {scale.category}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-slate-400">{scale.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Scale Notes */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-300">Notes</h4>
                <div className="flex flex-wrap gap-2">
                  {scale.notes.map((note, noteIndex) => (
                    <Badge
                      key={noteIndex}
                      className={`${
                        note === selectedRoot 
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {note}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Fretboard Pattern */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-300">Fretboard Pattern</h4>
                <FretboardDiagram scale={scale} />
              </div>

              {/* Intervals */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-300">Intervals</h4>
                <div className="text-sm text-slate-400">
                  {scale.intervals.map((interval, i) => (
                    <span key={i}>
                      {interval}{i < scale.intervals.length - 1 ? ' - ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredScales.length === 0 && (
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Music className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No scales found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}