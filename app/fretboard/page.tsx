'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Guitar, Music } from 'lucide-react';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const standardTuning = ['E', 'A', 'D', 'G', 'B', 'E'];

const scales = {
  'Major': [0, 2, 4, 5, 7, 9, 11],
  'Minor': [0, 2, 3, 5, 7, 8, 10],
  'Pentatonic Major': [0, 2, 4, 7, 9],
  'Pentatonic Minor': [0, 3, 5, 7, 10],
  'Blues': [0, 3, 5, 6, 7, 10],
  'Dorian': [0, 2, 3, 5, 7, 9, 10],
  'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
};

export default function FretboardPage() {
  const [selectedRoot, setSelectedRoot] = useState('C');
  const [selectedScale, setSelectedScale] = useState('Major');
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [highlightRoot, setHighlightRoot] = useState(true);

  const getNoteAtFret = (stringNote: string, fret: number): string => {
    const stringIndex = notes.indexOf(stringNote);
    const noteIndex = (stringIndex + fret) % 12;
    return notes[noteIndex];
  };

  const isNoteInScale = (note: string): boolean => {
    const rootIndex = notes.indexOf(selectedRoot);
    const noteIndex = notes.indexOf(note);
    const interval = (noteIndex - rootIndex + 12) % 12;
    return scales[selectedScale as keyof typeof scales].includes(interval);
  };

  const isRootNote = (note: string): boolean => {
    return note === selectedRoot;
  };

  const getNoteColor = (note: string): string => {
    if (isRootNote(note) && highlightRoot) {
      return 'bg-red-500 text-white border-red-600';
    } else if (isNoteInScale(note)) {
      return 'bg-blue-500 text-white border-blue-600';
    } else if (showAllNotes) {
      return 'bg-slate-600 text-slate-300 border-slate-500';
    }
    return 'transparent';
  };

  const shouldShowNote = (note: string): boolean => {
    return showAllNotes || isNoteInScale(note);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Guitar className="w-8 h-8 text-teal-500" />
            <h1 className="text-3xl font-bold text-slate-100">Interactive Fretboard</h1>
          </div>
          <p className="text-slate-400">
            Visualize scales, modes, and note patterns across the guitar neck
          </p>
        </div>

        {/* Controls */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Music className="w-5 h-5" />
              Scale Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Root Note</label>
                <Select value={selectedRoot} onValueChange={setSelectedRoot}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Scale/Mode</label>
                <Select value={selectedScale} onValueChange={setSelectedScale}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {Object.keys(scales).map((scale) => (
                      <SelectItem key={scale} value={scale} className="text-slate-100">
                        {scale}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Display Options</label>
                <Button
                  onClick={() => setShowAllNotes(!showAllNotes)}
                  variant={showAllNotes ? "default" : "outline"}
                  className={showAllNotes ? 
                    "bg-slate-600 hover:bg-slate-700" : 
                    "border-slate-600 text-slate-300 hover:bg-slate-700"
                  }
                >
                  {showAllNotes ? 'Hide Non-Scale Notes' : 'Show All Notes'}
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Root Highlight</label>
                <Button
                  onClick={() => setHighlightRoot(!highlightRoot)}
                  variant={highlightRoot ? "default" : "outline"}
                  className={highlightRoot ? 
                    "bg-red-600 hover:bg-red-700" : 
                    "border-slate-600 text-slate-300 hover:bg-slate-700"
                  }
                >
                  {highlightRoot ? 'Root Highlighted' : 'Root Normal'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fretboard */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-x-auto">
          <CardHeader>
            <CardTitle className="text-slate-100">
              {selectedRoot} {selectedScale} Scale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-w-[800px]">
              {/* Fret numbers */}
              <div className="flex mb-2">
                <div className="w-12 text-center text-xs text-slate-400">Open</div>
                {Array.from({ length: 12 }, (_, fret) => (
                  <div key={fret} className="w-16 text-center text-xs text-slate-400">
                    {fret + 1}
                  </div>
                ))}
              </div>

              {/* Strings */}
              <div className="space-y-1">
                {standardTuning.map((stringNote, stringIndex) => (
                  <div key={stringIndex} className="flex items-center">
                    {/* String label */}
                    <div className="w-12 text-center text-sm font-medium text-slate-300">
                      {stringNote}
                    </div>
                    
                    {/* Frets */}
                    <div className="flex">
                      {Array.from({ length: 13 }, (_, fret) => {
                        const note = getNoteAtFret(stringNote, fret);
                        const showNote = shouldShowNote(note);
                        
                        return (
                          <div
                            key={fret}
                            className="w-16 h-12 flex items-center justify-center relative border-r border-slate-600"
                          >
                            {/* Fret wire */}
                            {fret > 0 && (
                              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-500" />
                            )}
                            
                            {/* String line */}
                            <div className="absolute left-0 right-0 h-0.5 bg-slate-600" />
                            
                            {/* Note dot */}
                            {showNote && (
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 z-10 ${getNoteColor(note)}`}
                              >
                                {note}
                              </div>
                            )}
                            
                            {/* Fret markers */}
                            {stringIndex === 2 && [3, 5, 7, 9, 12].includes(fret) && (
                              <div className="absolute top-14 w-2 h-2 bg-slate-500 rounded-full" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Fret position markers */}
              <div className="flex mt-4">
                <div className="w-12"></div>
                {Array.from({ length: 12 }, (_, fret) => (
                  <div key={fret} className="w-16 text-center">
                    {[3, 5, 7, 9].includes(fret + 1) && (
                      <div className="w-2 h-2 bg-slate-500 rounded-full mx-auto" />
                    )}
                    {fret + 1 === 12 && (
                      <div className="flex justify-center gap-1">
                        <div className="w-2 h-2 bg-slate-500 rounded-full" />
                        <div className="w-2 h-2 bg-slate-500 rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-100">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-red-600"></div>
                <span className="text-slate-300">Root Note ({selectedRoot})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-blue-600"></div>
                <span className="text-slate-300">Scale Notes</span>
              </div>
              {showAllNotes && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-600 border-2 border-slate-500"></div>
                  <span className="text-slate-300">Other Notes</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scale Information */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-100">Scale Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Notes in Scale</h3>
                <div className="flex flex-wrap gap-2">
                  {scales[selectedScale as keyof typeof scales].map((interval) => {
                    const noteIndex = (notes.indexOf(selectedRoot) + interval) % 12;
                    const note = notes[noteIndex];
                    return (
                      <div
                        key={interval}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          interval === 0 ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                        }`}
                      >
                        {note}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Intervals</h3>
                <div className="flex flex-wrap gap-2">
                  {scales[selectedScale as keyof typeof scales].map((interval, index) => {
                    const intervalNames = ['R', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7'];
                    return (
                      <div
                        key={interval}
                        className="px-2 py-1 rounded bg-slate-700 text-slate-300 text-sm"
                      >
                        {intervalNames[interval]}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}