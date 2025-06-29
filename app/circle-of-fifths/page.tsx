'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Compass, Music, Info } from 'lucide-react';

interface Key {
  name: string;
  major: string;
  minor: string;
  sharps: number;
  flats: number;
  position: { x: number; y: number };
  angle: number;
}

const keys: Key[] = [
  { name: 'C', major: 'C', minor: 'Am', sharps: 0, flats: 0, position: { x: 200, y: 50 }, angle: 0 },
  { name: 'G', major: 'G', minor: 'Em', sharps: 1, flats: 0, position: { x: 300, y: 80 }, angle: 30 },
  { name: 'D', major: 'D', minor: 'Bm', sharps: 2, flats: 0, position: { x: 350, y: 150 }, angle: 60 },
  { name: 'A', major: 'A', minor: 'F#m', sharps: 3, flats: 0, position: { x: 350, y: 230 }, angle: 90 },
  { name: 'E', major: 'E', minor: 'C#m', sharps: 4, flats: 0, position: { x: 300, y: 300 }, angle: 120 },
  { name: 'B', major: 'B', minor: 'G#m', sharps: 5, flats: 0, position: { x: 200, y: 330 }, angle: 150 },
  { name: 'F#/Gb', major: 'F#/Gb', minor: 'D#m/Ebm', sharps: 6, flats: 6, position: { x: 100, y: 300 }, angle: 180 },
  { name: 'Db', major: 'Db', minor: 'Bbm', sharps: 0, flats: 5, position: { x: 50, y: 230 }, angle: 210 },
  { name: 'Ab', major: 'Ab', minor: 'Fm', sharps: 0, flats: 4, position: { x: 50, y: 150 }, angle: 240 },
  { name: 'Eb', major: 'Eb', minor: 'Cm', sharps: 0, flats: 3, position: { x: 100, y: 80 }, angle: 270 },
  { name: 'Bb', major: 'Bb', minor: 'Gm', sharps: 0, flats: 2, position: { x: 150, y: 50 }, angle: 300 },
  { name: 'F', major: 'F', minor: 'Dm', sharps: 0, flats: 1, position: { x: 150, y: 50 }, angle: 330 },
];

export default function CircleOfFifthsPage() {
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [showMinor, setShowMinor] = useState(false);

  const getKeySignature = (key: Key): string => {
    if (key.sharps > 0) {
      return `${key.sharps} sharp${key.sharps > 1 ? 's' : ''}`;
    } else if (key.flats > 0) {
      return `${key.flats} flat${key.flats > 1 ? 's' : ''}`;
    }
    return 'No sharps or flats';
  };

  const getRelatedChords = (key: Key): string[] => {
    const majorKey = key.major;
    const minorKey = key.minor;
    
    // Basic triads in the key
    const chords = showMinor ? 
      [`${minorKey}`, `${majorKey}`, `${key.name}dim`] :
      [`${majorKey}`, `${minorKey}`, `${key.name}7`];
    
    return chords;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Compass className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold text-slate-100">Circle of Fifths</h1>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Interactive visualization of key relationships, signatures, and harmonic progressions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Circle Visualization */}
          <div className="lg:col-span-2">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Button
                    onClick={() => setShowMinor(false)}
                    variant={!showMinor ? "default" : "outline"}
                    className={!showMinor ? 
                      "bg-blue-600 hover:bg-blue-700" : 
                      "border-slate-600 text-slate-300 hover:bg-slate-700"
                    }
                  >
                    Major Keys
                  </Button>
                  <Button
                    onClick={() => setShowMinor(true)}
                    variant={showMinor ? "default" : "outline"}
                    className={showMinor ? 
                      "bg-purple-600 hover:bg-purple-700" : 
                      "border-slate-600 text-slate-300 hover:bg-slate-700"
                    }
                  >
                    Minor Keys
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="relative w-96 h-96">
                  <svg width="400" height="400" className="overflow-visible">
                    {/* Outer circle */}
                    <circle
                      cx="200"
                      cy="200"
                      r="180"
                      fill="none"
                      stroke="#475569"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    
                    {/* Inner circle */}
                    <circle
                      cx="200"
                      cy="200"
                      r="120"
                      fill="none"
                      stroke="#475569"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                    />

                    {/* Key positions */}
                    {keys.map((key, index) => {
                      const angle = (index * 30 - 90) * (Math.PI / 180);
                      const x = 200 + 150 * Math.cos(angle);
                      const y = 200 + 150 * Math.sin(angle);
                      const isSelected = selectedKey?.name === key.name;
                      
                      return (
                        <g key={key.name}>
                          {/* Key circle */}
                          <circle
                            cx={x}
                            cy={y}
                            r="25"
                            fill={isSelected ? "#7c3aed" : "#1e293b"}
                            stroke={isSelected ? "#a855f7" : "#475569"}
                            strokeWidth="2"
                            className="cursor-pointer hover:fill-slate-700 transition-colors"
                            onClick={() => setSelectedKey(key)}
                          />
                          
                          {/* Key text */}
                          <text
                            x={x}
                            y={y - 5}
                            textAnchor="middle"
                            className="text-sm font-bold fill-slate-100 cursor-pointer"
                            onClick={() => setSelectedKey(key)}
                          >
                            {showMinor ? key.minor : key.major}
                          </text>
                          
                          {/* Accidentals indicator */}
                          <text
                            x={x}
                            y={y + 10}
                            textAnchor="middle"
                            className="text-xs fill-slate-400 cursor-pointer"
                            onClick={() => setSelectedKey(key)}
                          >
                            {key.sharps > 0 ? `${key.sharps}#` : key.flats > 0 ? `${key.flats}♭` : ''}
                          </text>
                        </g>
                      );
                    })}

                    {/* Center label */}
                    <text
                      x="200"
                      y="200"
                      textAnchor="middle"
                      className="text-lg font-bold fill-purple-400"
                    >
                      Circle of
                    </text>
                    <text
                      x="200"
                      y="220"
                      textAnchor="middle"
                      className="text-lg font-bold fill-purple-400"
                    >
                      Fifths
                    </text>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Information Panel */}
          <div className="space-y-4">
            {selectedKey ? (
              <>
                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <Music className="w-5 h-5 text-purple-500" />
                      Key Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-400">
                        {showMinor ? selectedKey.minor : selectedKey.major}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {showMinor ? 'Minor Key' : 'Major Key'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-slate-300 mb-2">Key Signature:</p>
                      <Badge className="bg-slate-700 text-slate-200">
                        {getKeySignature(selectedKey)}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm text-slate-300 mb-2">Relative Key:</p>
                      <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                        {showMinor ? selectedKey.major : selectedKey.minor}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm text-slate-300 mb-2">Common Chords:</p>
                      <div className="flex flex-wrap gap-2">
                        {getRelatedChords(selectedKey).map((chord, index) => (
                          <Badge key={index} className="bg-green-600/20 text-green-400 border-green-500/30">
                            {chord}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <Info className="w-5 h-5 text-amber-500" />
                      Quick Facts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-300">
                    <p>
                      <span className="text-amber-400">Position:</span> {selectedKey.name} is located at the {Math.round(selectedKey.angle / 30)} o'clock position
                    </p>
                    <p>
                      <span className="text-amber-400">Fifth Relationship:</span> Moving clockwise increases by a perfect fifth
                    </p>
                    <p>
                      <span className="text-amber-400">Enharmonic:</span> {selectedKey.name.includes('/') ? \'This key has enharmonic equivalents' : \'No enharmonic equivalent'}
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Compass className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Click on any key in the circle to see detailed information</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Theory Information */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-100">Understanding the Circle of Fifths</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-3">How It Works</h3>
              <ul className="space-y-2 text-sm">
                <li>• Moving clockwise adds one sharp to the key signature</li>
                <li>• Moving counter-clockwise adds one flat to the key signature</li>
                <li>• Each step represents a perfect fifth interval</li>
                <li>• Major and minor keys share the same key signature</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Practical Uses</h3>
              <ul className="space-y-2 text-sm">
                <li>• Determine key signatures quickly</li>
                <li>• Find relative major/minor keys</li>
                <li>• Understand chord progressions</li>
                <li>• Transpose music between keys</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}