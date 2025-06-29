'use client';

interface ChordDiagramProps {
  positions: number[];
  fingering: number[];
  chordName: string;
}

export function ChordDiagram({ positions, fingering, chordName }: ChordDiagramProps) {
  const strings = ['E', 'A', 'D', 'G', 'B', 'E'];
  const frets = 5;
  
  // Find the minimum fret position (excluding 0 and -1)
  const minFret = Math.min(...positions.filter(p => p > 0));
  const startFret = minFret > 3 ? minFret - 1 : 0;
  
  const getFingerColor = (finger: number) => {
    const colors = {
      0: 'transparent',
      1: '#ef4444', // red
      2: '#f97316', // orange
      3: '#eab308', // yellow
      4: '#22c55e', // green
    };
    return colors[finger as keyof typeof colors] || 'transparent';
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative bg-slate-900 p-4 rounded-lg border border-slate-700">
        {/* Fret markers */}
        {startFret > 0 && (
          <div className="absolute -left-8 top-6 text-xs text-slate-400">
            {startFret + 1}fr
          </div>
        )}
        
        <svg width="120" height="140" className="overflow-visible">
          {/* Fret lines */}
          {Array.from({ length: frets + 1 }, (_, fret) => (
            <line
              key={fret}
              x1="10"
              y1={20 + fret * 20}
              x2="110"
              y2={20 + fret * 20}
              stroke="#475569"
              strokeWidth={fret === 0 ? "3" : "1"}
            />
          ))}
          
          {/* String lines */}
          {Array.from({ length: 6 }, (_, string) => (
            <line
              key={string}
              x1={10 + string * 20}
              y1="20"
              x2={10 + string * 20}
              y2={20 + frets * 20}
              stroke="#475569"
              strokeWidth="1"
            />
          ))}
          
          {/* Finger positions */}
          {positions.map((position, stringIndex) => {
            if (position === -1) {
              // Muted string (X)
              return (
                <g key={stringIndex}>
                  <line
                    x1={6 + stringIndex * 20}
                    y1="6"
                    x2={14 + stringIndex * 20}
                    y2="14"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  <line
                    x1={14 + stringIndex * 20}
                    y1="6"
                    x2={6 + stringIndex * 20}
                    y2="14"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                </g>
              );
            } else if (position === 0) {
              // Open string (O)
              return (
                <circle
                  key={stringIndex}
                  cx={10 + stringIndex * 20}
                  cy="10"
                  r="6"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                />
              );
            } else {
              // Fretted note
              const fretPosition = position - startFret;
              const finger = fingering[stringIndex];
              return (
                <g key={stringIndex}>
                  <circle
                    cx={10 + stringIndex * 20}
                    cy={20 + (fretPosition - 0.5) * 20}
                    r="8"
                    fill={getFingerColor(finger)}
                    stroke="#1e293b"
                    strokeWidth="2"
                  />
                  {finger > 0 && (
                    <text
                      x={10 + stringIndex * 20}
                      y={20 + (fretPosition - 0.5) * 20}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-xs font-bold fill-white"
                    >
                      {finger}
                    </text>
                  )}
                </g>
              );
            }
          })}
        </svg>
        
        {/* String labels */}
        <div className="flex justify-between text-xs text-slate-400 mt-2 px-2">
          {strings.map((string, index) => (
            <span key={index}>{string}</span>
          ))}
        </div>
      </div>
      
      {/* Fingering legend */}
      <div className="text-xs text-slate-400 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-green-500 rounded-full"></div>
          <span>Open</span>
          <div className="w-3 h-3">
            <svg width="12" height="12">
              <line x1="1" y1="1" x2="11" y2="11" stroke="#ef4444" strokeWidth="2"/>
              <line x1="11" y1="1" x2="1" y2="11" stroke="#ef4444" strokeWidth="2"/>
            </svg>
          </div>
          <span>Muted</span>
        </div>
      </div>
    </div>
  );
}