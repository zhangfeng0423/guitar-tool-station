export interface Scale {
  name: string;
  intervals: number[];
  modes?: string[];
  description: string;
}

export interface Chord {
  name: string;
  intervals: number[];
  quality: 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant' | 'suspended';
  extensions?: number[];
}

export const SCALES: Record<string, Scale> = {
  major: {
    name: 'Major',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    modes: ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'],
    description: 'The foundation of Western music theory'
  },
  naturalMinor: {
    name: 'Natural Minor',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    description: 'The relative minor scale'
  },
  harmonicMinor: {
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    description: 'Minor scale with raised 7th degree'
  },
  melodicMinor: {
    name: 'Melodic Minor',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    description: 'Ascending melodic minor scale'
  },
  pentatonicMajor: {
    name: 'Pentatonic Major',
    intervals: [0, 2, 4, 7, 9],
    description: 'Five-note major scale'
  },
  pentatonicMinor: {
    name: 'Pentatonic Minor',
    intervals: [0, 3, 5, 7, 10],
    description: 'Five-note minor scale'
  },
  blues: {
    name: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10],
    description: 'Six-note blues scale'
  }
};

export const CHORD_TYPES: Record<string, Chord> = {
  major: {
    name: 'Major',
    intervals: [0, 4, 7],
    quality: 'major'
  },
  minor: {
    name: 'Minor',
    intervals: [0, 3, 7],
    quality: 'minor'
  },
  diminished: {
    name: 'Diminished',
    intervals: [0, 3, 6],
    quality: 'diminished'
  },
  augmented: {
    name: 'Augmented',
    intervals: [0, 4, 8],
    quality: 'augmented'
  },
  major7: {
    name: 'Major 7th',
    intervals: [0, 4, 7, 11],
    quality: 'major',
    extensions: [7]
  },
  minor7: {
    name: 'Minor 7th',
    intervals: [0, 3, 7, 10],
    quality: 'minor',
    extensions: [7]
  },
  dominant7: {
    name: 'Dominant 7th',
    intervals: [0, 4, 7, 10],
    quality: 'dominant',
    extensions: [7]
  }
};

export const CIRCLE_OF_FIFTHS = [
  { key: 'C', sharps: 0, flats: 0, relative: 'Am' },
  { key: 'G', sharps: 1, flats: 0, relative: 'Em' },
  { key: 'D', sharps: 2, flats: 0, relative: 'Bm' },
  { key: 'A', sharps: 3, flats: 0, relative: 'F#m' },
  { key: 'E', sharps: 4, flats: 0, relative: 'C#m' },
  { key: 'B', sharps: 5, flats: 0, relative: 'G#m' },
  { key: 'F#', sharps: 6, flats: 0, relative: 'D#m' },
  { key: 'Db', sharps: 0, flats: 5, relative: 'Bbm' },
  { key: 'Ab', sharps: 0, flats: 4, relative: 'Fm' },
  { key: 'Eb', sharps: 0, flats: 3, relative: 'Cm' },
  { key: 'Bb', sharps: 0, flats: 2, relative: 'Gm' },
  { key: 'F', sharps: 0, flats: 1, relative: 'Dm' }
];

export const getScaleNotes = (root: string, scaleType: string): string[] => {
  const scale = SCALES[scaleType];
  if (!scale) return [];
  
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootIndex = notes.indexOf(root);
  
  return scale.intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return notes[noteIndex];
  });
};

export const getChordNotes = (root: string, chordType: string): string[] => {
  const chord = CHORD_TYPES[chordType];
  if (!chord) return [];
  
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootIndex = notes.indexOf(root);
  
  return chord.intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return notes[noteIndex];
  });
};

export const getIntervalName = (semitones: number): string => {
  const intervals = [
    'Perfect Unison', 'Minor 2nd', 'Major 2nd', 'Minor 3rd',
    'Major 3rd', 'Perfect 4th', 'Tritone', 'Perfect 5th',
    'Minor 6th', 'Major 6th', 'Minor 7th', 'Major 7th', 'Octave'
  ];
  return intervals[semitones] || 'Unknown';
};

export const transposeNote = (note: string, semitones: number): string => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteIndex = notes.indexOf(note);
  const newIndex = (noteIndex + semitones + 12) % 12;
  return notes[newIndex];
};