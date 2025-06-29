'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Play, Pause, Plus, Trash2, Edit, Target } from 'lucide-react';

interface PracticeItem {
  id: string;
  name: string;
  duration: number; // in minutes
  category: 'technique' | 'scales' | 'chords' | 'songs' | 'theory';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
}

interface PracticeSession {
  id: string;
  name: string;
  items: PracticeItem[];
  totalDuration: number;
  createdAt: Date;
}

const defaultPracticeItems: PracticeItem[] = [
  {
    id: '1',
    name: 'Chromatic Warm-up',
    duration: 5,
    category: 'technique',
    difficulty: 'beginner',
    description: 'Finger independence and dexterity'
  },
  {
    id: '2',
    name: 'Major Scale Practice',
    duration: 10,
    category: 'scales',
    difficulty: 'beginner',
    description: 'All positions, focus on clean fretting'
  },
  {
    id: '3',
    name: 'Chord Changes',
    duration: 15,
    category: 'chords',
    difficulty: 'intermediate',
    description: 'Common progressions, smooth transitions'
  },
  {
    id: '4',
    name: 'Song Practice',
    duration: 20,
    category: 'songs',
    difficulty: 'intermediate',
    description: 'Current repertoire'
  },
  {
    id: '5',
    name: 'Improvisation',
    duration: 10,
    category: 'scales',
    difficulty: 'advanced',
    description: 'Pentatonic patterns over backing tracks'
  }
];

export default function PracticeSessionsPage() {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [newSessionName, setNewSessionName] = useState('');
  const [selectedItems, setSelectedItems] = useState<PracticeItem[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('practiceSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    } else {
      // Create a default session
      const defaultSession: PracticeSession = {
        id: 'default',
        name: 'Daily Practice',
        items: defaultPracticeItems,
        totalDuration: defaultPracticeItems.reduce((sum, item) => sum + item.duration, 0),
        createdAt: new Date()
      };
      setSessions([defaultSession]);
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('practiceSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Move to next item or finish session
            if (currentSession && currentItemIndex < currentSession.items.length - 1) {
              const nextIndex = currentItemIndex + 1;
              setCurrentItemIndex(nextIndex);
              return currentSession.items[nextIndex].duration * 60;
            } else {
              setIsRunning(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentSession, currentItemIndex]);

  const startSession = (session: PracticeSession) => {
    setCurrentSession(session);
    setCurrentItemIndex(0);
    setTimeRemaining(session.items[0].duration * 60);
    setIsRunning(true);
  };

  const pauseSession = () => {
    setIsRunning(!isRunning);
  };

  const stopSession = () => {
    setIsRunning(false);
    setCurrentSession(null);
    setCurrentItemIndex(0);
    setTimeRemaining(0);
  };

  const skipToNext = () => {
    if (currentSession && currentItemIndex < currentSession.items.length - 1) {
      const nextIndex = currentItemIndex + 1;
      setCurrentItemIndex(nextIndex);
      setTimeRemaining(currentSession.items[nextIndex].duration * 60);
    }
  };

  const createSession = () => {
    if (newSessionName && selectedItems.length > 0) {
      const newSession: PracticeSession = {
        id: Date.now().toString(),
        name: newSessionName,
        items: selectedItems,
        totalDuration: selectedItems.reduce((sum, item) => sum + item.duration, 0),
        createdAt: new Date()
      };
      
      setSessions(prev => [...prev, newSession]);
      setNewSessionName('');
      setSelectedItems([]);
      setShowCreateForm(false);
    }
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technique: 'bg-red-500/20 text-red-400 border-red-500/30',
      scales: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      chords: 'bg-green-500/20 text-green-400 border-green-500/30',
      songs: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      theory: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[category as keyof typeof colors] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
      intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-slate-100">Practice Sessions</h1>
          </div>
          <p className="text-slate-400">
            Structured practice routines to improve your guitar skills systematically
          </p>
        </div>

        {/* Active Session */}
        {currentSession && (
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center justify-between">
                <span>Current Session: {currentSession.name}</span>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  {currentItemIndex + 1} of {currentSession.items.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Item */}
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-slate-100">
                  {currentSession.items[currentItemIndex].name}
                </h3>
                <p className="text-slate-400">
                  {currentSession.items[currentItemIndex].description}
                </p>
                
                {/* Timer */}
                <div className="text-6xl font-bold text-orange-400">
                  {formatTime(timeRemaining)}
                </div>
                
                {/* Progress */}
                <div className="space-y-2">
                  <Progress 
                    value={((currentSession.items[currentItemIndex].duration * 60 - timeRemaining) / (currentSession.items[currentItemIndex].duration * 60)) * 100} 
                    className="h-3"
                  />
                  <div className="text-sm text-slate-400">
                    Item {currentItemIndex + 1} of {currentSession.items.length}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={pauseSession}
                  className={`${isRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={skipToNext}
                  variant="outline"
                  disabled={currentItemIndex >= currentSession.items.length - 1}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Skip to Next
                </Button>
                
                <Button
                  onClick={stopSession}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600/20"
                >
                  Stop Session
                </Button>
              </div>

              {/* Session Items */}
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-slate-200">Session Items</h4>
                <div className="grid gap-2">
                  {currentSession.items.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        index === currentItemIndex
                          ? 'border-orange-500 bg-orange-500/10'
                          : index < currentItemIndex
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-slate-600 bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-slate-200">{item.name}</span>
                          <span className="text-slate-400 ml-2">({item.duration} min)</span>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                          <Badge className={getDifficultyColor(item.difficulty)}>
                            {item.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Session List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-100">Practice Sessions</h2>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </div>

            {sessions.map((session) => (
              <Card key={session.id} className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-100">{session.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {session.totalDuration} min
                      </Badge>
                      <Button
                        onClick={() => deleteSession(session.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-400 hover:bg-red-600/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {session.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{item.name}</span>
                        <div className="flex gap-2">
                          <Badge size="sm" className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                          <span className="text-slate-400">{item.duration}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => startSession(session)}
                    disabled={!!currentSession}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Session Form */}
          {showCreateForm && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-100">Create New Session</h2>
              
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Session Name</label>
                    <Input
                      value={newSessionName}
                      onChange={(e) => setNewSessionName(e.target.value)}
                      placeholder="Enter session name..."
                      className="bg-slate-700 border-slate-600 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Practice Items</label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {defaultPracticeItems.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedItems.some(si => si.id === item.id)
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700'
                          }`}
                          onClick={() => {
                            setSelectedItems(prev => 
                              prev.some(si => si.id === item.id)
                                ? prev.filter(si => si.id !== item.id)
                                : [...prev, item]
                            );
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-slate-200">{item.name}</span>
                              <span className="text-slate-400 ml-2">({item.duration} min)</span>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getCategoryColor(item.category)}>
                                {item.category}
                              </Badge>
                              <Badge className={getDifficultyColor(item.difficulty)}>
                                {item.difficulty}
                              </Badge>
                            </div>
                          </div>
                          {item.description && (
                            <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedItems.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Selected Items</label>
                      <div className="text-sm text-slate-400">
                        Total Duration: {selectedItems.reduce((sum, item) => sum + item.duration, 0)} minutes
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={createSession}
                      disabled={!newSessionName || selectedItems.length === 0}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Create Session
                    </Button>
                    <Button
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewSessionName('');
                        setSelectedItems([]);
                      }}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}