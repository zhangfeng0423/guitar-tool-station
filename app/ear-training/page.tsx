'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Ear, Play, RotateCcw, Check, X, Volume2 } from 'lucide-react';

interface Exercise {
  id: string;
  type: 'interval' | 'chord' | 'scale';
  question: string;
  options: string[];
  correct: number;
  audioData?: {
    notes: string[];
    frequencies: number[];
  };
}

const intervals = [
  { name: 'Perfect Unison', semitones: 0 },
  { name: 'Minor 2nd', semitones: 1 },
  { name: 'Major 2nd', semitones: 2 },
  { name: 'Minor 3rd', semitones: 3 },
  { name: 'Major 3rd', semitones: 4 },
  { name: 'Perfect 4th', semitones: 5 },
  { name: 'Tritone', semitones: 6 },
  { name: 'Perfect 5th', semitones: 7 },
  { name: 'Minor 6th', semitones: 8 },
  { name: 'Major 6th', semitones: 9 },
  { name: 'Minor 7th', semitones: 10 },
  { name: 'Major 7th', semitones: 11 },
  { name: 'Octave', semitones: 12 },
];

const chordTypes = [
  { name: 'Major', intervals: [0, 4, 7] },
  { name: 'Minor', intervals: [0, 3, 7] },
  { name: 'Diminished', intervals: [0, 3, 6] },
  { name: 'Augmented', intervals: [0, 4, 8] },
  { name: 'Major 7th', intervals: [0, 4, 7, 11] },
  { name: 'Minor 7th', intervals: [0, 3, 7, 10] },
  { name: 'Dominant 7th', intervals: [0, 4, 7, 10] },
];

export default function EarTrainingPage() {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [exerciseType, setExerciseType] = useState<'interval' | 'chord' | 'scale'>('interval');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const getFrequency = (note: string, octave: number = 4): number => {
    const noteFreqs = {
      'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4,
      'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2
    };
    return 440 * Math.pow(2, (noteFreqs[note as keyof typeof noteFreqs] + (octave - 4) * 12) / 12);
  };

  const playTone = async (frequency: number, duration: number = 0.5, delay: number = 0) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + delay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration);
  };

  const playInterval = (semitones: number) => {
    const baseFreq = 261.63; // C4
    const higherFreq = baseFreq * Math.pow(2, semitones / 12);
    
    playTone(baseFreq, 1);
    playTone(higherFreq, 1, 1.2);
  };

  const playChord = (intervals: number[]) => {
    const baseFreq = 261.63; // C4
    intervals.forEach((interval, index) => {
      const freq = baseFreq * Math.pow(2, interval / 12);
      playTone(freq, 2, index * 0.1);
    });
  };

  const generateIntervalExercise = (): Exercise => {
    const availableIntervals = difficulty === 'easy' 
      ? intervals.slice(0, 8) 
      : difficulty === 'medium' 
      ? intervals.slice(0, 10) 
      : intervals;
    
    const correctInterval = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];
    const options = [correctInterval.name];
    
    while (options.length < 4) {
      const randomInterval = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];
      if (!options.includes(randomInterval.name)) {
        options.push(randomInterval.name);
      }
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return {
      id: `interval-${Date.now()}`,
      type: 'interval',
      question: 'What interval do you hear?',
      options,
      correct: options.indexOf(correctInterval.name),
      audioData: {
        notes: ['C', 'C'],
        frequencies: [261.63, 261.63 * Math.pow(2, correctInterval.semitones / 12)]
      }
    };
  };

  const generateChordExercise = (): Exercise => {
    const availableChords = difficulty === 'easy' 
      ? chordTypes.slice(0, 4) 
      : difficulty === 'medium' 
      ? chordTypes.slice(0, 6) 
      : chordTypes;
    
    const correctChord = availableChords[Math.floor(Math.random() * availableChords.length)];
    const options = [correctChord.name];
    
    while (options.length < 4) {
      const randomChord = availableChords[Math.floor(Math.random() * availableChords.length)];
      if (!options.includes(randomChord.name)) {
        options.push(randomChord.name);
      }
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return {
      id: `chord-${Date.now()}`,
      type: 'chord',
      question: 'What chord do you hear?',
      options,
      correct: options.indexOf(correctChord.name),
      audioData: {
        notes: correctChord.intervals.map(() => 'C'),
        frequencies: correctChord.intervals.map(interval => 261.63 * Math.pow(2, interval / 12))
      }
    };
  };

  const generateNewExercise = () => {
    let exercise: Exercise;
    
    switch (exerciseType) {
      case 'interval':
        exercise = generateIntervalExercise();
        break;
      case 'chord':
        exercise = generateChordExercise();
        break;
      default:
        exercise = generateIntervalExercise();
    }
    
    setCurrentExercise(exercise);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const playCurrentExercise = () => {
    if (!currentExercise?.audioData) return;
    
    if (currentExercise.type === 'interval') {
      const semitones = Math.log2(currentExercise.audioData.frequencies[1] / currentExercise.audioData.frequencies[0]) * 12;
      playInterval(semitones);
    } else if (currentExercise.type === 'chord') {
      const intervals = currentExercise.audioData.frequencies.map(freq => 
        Math.log2(freq / 261.63) * 12
      );
      playChord(intervals);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setTotalQuestions(prev => prev + 1);
    
    if (answerIndex === currentExercise?.correct) {
      setScore(prev => prev + 1);
    }
  };

  const resetStats = () => {
    setScore(0);
    setTotalQuestions(0);
    generateNewExercise();
  };

  useEffect(() => {
    generateNewExercise();
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [exerciseType, difficulty]);

  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Ear className="w-8 h-8 text-indigo-500" />
            <h1 className="text-3xl font-bold text-slate-100">Ear Training</h1>
          </div>
          <p className="text-slate-400">
            Develop your musical ear with interval and chord recognition exercises
          </p>
        </div>

        {/* Settings */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-100">Exercise Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Exercise Type</label>
                <div className="flex gap-2">
                  {(['interval', 'chord'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={exerciseType === type ? "default" : "outline"}
                      onClick={() => setExerciseType(type)}
                      className={exerciseType === type ? 
                        "bg-indigo-600 hover:bg-indigo-700" : 
                        "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Difficulty</label>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDifficulty(level)}
                      className={difficulty === level ? 
                        "bg-green-600 hover:bg-green-700" : 
                        "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{score}</div>
              <div className="text-sm text-slate-400">Correct</div>
            </CardContent>
          </Card>
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{totalQuestions}</div>
              <div className="text-sm text-slate-400">Total</div>
            </CardContent>
          </Card>
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{accuracy}%</div>
              <div className="text-sm text-slate-400">Accuracy</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        {totalQuestions > 0 && (
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Progress</span>
                  <span>{score}/{totalQuestions}</span>
                </div>
                <Progress value={accuracy} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exercise */}
        {currentExercise && (
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-slate-100">{currentExercise.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Play Button */}
              <div className="text-center">
                <Button
                  onClick={playCurrentExercise}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg"
                >
                  <Volume2 className="w-6 h-6 mr-2" />
                  Play Audio
                </Button>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentExercise.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`p-4 text-left border-slate-600 text-slate-300 hover:bg-slate-700 ${
                      showResult && index === currentExercise.correct
                        ? 'border-green-500 bg-green-500/20 text-green-400'
                        : showResult && index === selectedAnswer && index !== currentExercise.correct
                        ? 'border-red-500 bg-red-500/20 text-red-400'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && index === currentExercise.correct && (
                        <Check className="w-5 h-5 text-green-400" />
                      )}
                      {showResult && index === selectedAnswer && index !== currentExercise.correct && (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              {/* Result */}
              {showResult && (
                <div className="text-center space-y-4">
                  <Badge className={selectedAnswer === currentExercise.correct ? 
                    'bg-green-500/20 text-green-400 border-green-500/30' : 
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }>
                    {selectedAnswer === currentExercise.correct ? 'Correct!' : 'Incorrect'}
                  </Badge>
                  
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={generateNewExercise}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next Exercise
                    </Button>
                    <Button
                      onClick={playCurrentExercise}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex justify-center">
          <Button
            onClick={resetStats}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Stats
          </Button>
        </div>
      </div>
    </div>
  );
}