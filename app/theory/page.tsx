'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Music, Target, Lightbulb, ChevronRight, ChevronDown } from 'lucide-react';

interface TheoryTopic {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  description: string;
  content: string[];
  examples?: string[];
}

const theoryTopics: TheoryTopic[] = [
  {
    id: 'notes-fretboard',
    title: 'Notes on the Fretboard',
    difficulty: 'Beginner',
    category: 'Fundamentals',
    description: 'Learn the names of notes across the guitar neck',
    content: [
      'The guitar has 6 strings, each tuned to a specific note in standard tuning: E-A-D-G-B-E (low to high)',
      'Each fret represents a semitone (half-step) increase in pitch',
      'The 12th fret is an octave higher than the open string',
      'Natural notes: C, D, E, F, G, A, B',
      'Sharp/flat notes occur between natural notes (except E-F and B-C)'
    ],
    examples: ['Open E string: E, F, F#, G, G#, A, A#, B, C, C#, D, D#, E (12th fret)']
  },
  {
    id: 'intervals',
    title: 'Intervals',
    difficulty: 'Beginner',
    category: 'Fundamentals',
    description: 'Understanding the distance between notes',
    content: [
      'An interval is the distance between two notes',
      'Measured in semitones (half-steps) or whole tones (whole steps)',
      'Perfect intervals: Unison (0), 4th (5), 5th (7), Octave (12)',
      'Major intervals: 2nd (2), 3rd (4), 6th (9), 7th (11)',
      'Minor intervals are one semitone smaller than major intervals'
    ],
    examples: ['C to E = Major 3rd (4 semitones)', 'C to F = Perfect 4th (5 semitones)']
  },
  {
    id: 'scales',
    title: 'Major and Minor Scales',
    difficulty: 'Beginner',
    category: 'Scales',
    description: 'The foundation of Western music theory',
    content: [
      'Major scale pattern: W-W-H-W-W-W-H (W=whole step, H=half step)',
      'Minor scale pattern: W-H-W-W-H-W-W',
      'Every major scale has a relative minor (starts on the 6th degree)',
      'Scale degrees: 1-2-3-4-5-6-7-8',
      'Major scale creates a happy, bright sound; minor scale sounds sad or dark'
    ],
    examples: ['C Major: C-D-E-F-G-A-B-C', 'A Minor: A-B-C-D-E-F-G-A']
  },
  {
    id: 'chord-construction',
    title: 'Chord Construction',
    difficulty: 'Intermediate',
    category: 'Chords',
    description: 'How chords are built from scales',
    content: [
      'Triads are built using the 1st, 3rd, and 5th degrees of a scale',
      'Major triad: Major 3rd + Minor 3rd (Root, Major 3rd, Perfect 5th)',
      'Minor triad: Minor 3rd + Major 3rd (Root, Minor 3rd, Perfect 5th)',
      '7th chords add the 7th degree to triads',
      'Extensions include 9th, 11th, and 13th intervals'
    ],
    examples: ['C Major: C-E-G', 'C Minor: C-Eb-G', 'C7: C-E-G-Bb']
  },
  {
    id: 'modes',
    title: 'Modes of the Major Scale',
    difficulty: 'Intermediate',
    category: 'Scales',
    description: 'Seven different scales from one major scale',
    content: [
      'Each mode starts on a different degree of the major scale',
      'Ionian (1st): The major scale itself',
      'Dorian (2nd): Minor scale with raised 6th',
      'Phrygian (3rd): Minor scale with lowered 2nd',
      'Lydian (4th): Major scale with raised 4th',
      'Mixolydian (5th): Major scale with lowered 7th',
      'Aeolian (6th): The natural minor scale',
      'Locrian (7th): Diminished scale, rarely used'
    ],
    examples: ['C Ionian: C-D-E-F-G-A-B', 'D Dorian: D-E-F-G-A-B-C']
  },
  {
    id: 'circle-of-fifths',
    title: 'Circle of Fifths',
    difficulty: 'Intermediate',
    category: 'Theory',
    description: 'Key relationships and signatures',
    content: [
      'Visual representation of key relationships',
      'Moving clockwise adds sharps, counter-clockwise adds flats',
      'Each step is a perfect fifth interval',
      'Shows relative major and minor keys',
      'Helps with chord progressions and modulation'
    ],
    examples: ['C Major (0 sharps/flats) → G Major (1 sharp) → D Major (2 sharps)']
  },
  {
    id: 'chord-progressions',
    title: 'Common Chord Progressions',
    difficulty: 'Intermediate',
    category: 'Harmony',
    description: 'Popular chord sequences in music',
    content: [
      'Roman numerals represent chord functions (I, ii, iii, IV, V, vi, vii°)',
      'I-V-vi-IV: Most popular progression in modern music',
      'ii-V-I: Essential jazz progression',
      'I-vi-IV-V: Classic 50s progression',
      'vi-IV-I-V: Emotional ballad progression'
    ],
    examples: ['C Major: I-V-vi-IV = C-G-Am-F', 'Key of G: I-V-vi-IV = G-D-Em-C']
  },
  {
    id: 'pentatonic-scales',
    title: 'Pentatonic Scales',
    difficulty: 'Beginner',
    category: 'Scales',
    description: 'Five-note scales perfect for improvisation',
    content: [
      'Pentatonic = five notes (penta = five, tonic = tones)',
      'Major pentatonic: 1-2-3-5-6 of major scale',
      'Minor pentatonic: 1-b3-4-5-b7 of major scale',
      'Most common scale for guitar solos',
      'Easy to play and sounds good over many chord progressions'
    ],
    examples: ['C Major Pentatonic: C-D-E-G-A', 'A Minor Pentatonic: A-C-D-E-G']
  }
];

const categories = ['All', 'Fundamentals', 'Scales', 'Chords', 'Harmony', 'Theory'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function TheoryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const filteredTopics = theoryTopics.filter(topic => {
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || topic.difficulty === selectedDifficulty;
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

  const toggleTopic = (topicId: string) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-pink-500" />
          <h1 className="text-3xl font-bold text-slate-100">Music Theory Guide</h1>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Essential music theory concepts for guitarists, from basic fundamentals to advanced harmony
        </p>
      </div>

      {/* Filters */}
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-slate-300 self-center mr-2">Category:</span>
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
            
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-slate-300 self-center mr-2">Level:</span>
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
        </CardContent>
      </Card>

      {/* Theory Topics */}
      <div className="space-y-4">
        {filteredTopics.map((topic) => (
          <Card key={topic.id} className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader 
              className="cursor-pointer hover:bg-slate-800/70 transition-colors"
              onClick={() => toggleTopic(topic.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {expandedTopic === topic.id ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                    <CardTitle className="text-slate-100">{topic.title}</CardTitle>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(topic.difficulty)}>
                    {topic.difficulty}
                  </Badge>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    {topic.category}
                  </Badge>
                </div>
              </div>
              <p className="text-slate-400 text-left">{topic.description}</p>
            </CardHeader>
            
            {expandedTopic === topic.id && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      Key Concepts
                    </h4>
                    <ul className="space-y-2">
                      {topic.content.map((point, index) => (
                        <li key={index} className="text-slate-300 flex items-start gap-2">
                          <span className="text-pink-400 mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {topic.examples && topic.examples.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-400" />
                        Examples
                      </h4>
                      <div className="space-y-2">
                        {topic.examples.map((example, index) => (
                          <div key={index} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                            <code className="text-green-400 text-sm">{example}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredTopics.length === 0 && (
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Music className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No theory topics found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Reference */}
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm mt-8">
        <CardHeader>
          <CardTitle className="text-slate-100">Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-pink-400 mb-3">Note Names</h3>
              <p className="text-slate-300 text-sm">Natural: C D E F G A B</p>
              <p className="text-slate-300 text-sm">Sharps: C# D# F# G# A#</p>
              <p className="text-slate-300 text-sm">Flats: Db Eb Gb Ab Bb</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-pink-400 mb-3">Intervals</h3>
              <p className="text-slate-300 text-sm">Perfect: 1, 4, 5, 8</p>
              <p className="text-slate-300 text-sm">Major: 2, 3, 6, 7</p>
              <p className="text-slate-300 text-sm">Minor: b2, b3, b6, b7</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-pink-400 mb-3">Scale Patterns</h3>
              <p className="text-slate-300 text-sm">Major: W-W-H-W-W-W-H</p>
              <p className="text-slate-300 text-sm">Minor: W-H-W-W-H-W-W</p>
              <p className="text-slate-300 text-sm">Pentatonic: Remove 4th & 7th</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}