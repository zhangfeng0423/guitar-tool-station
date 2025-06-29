'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Guitar, Music, Target, Clock, Zap, BookOpen, Settings, Compass, Ear, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const tools = [
    {
      icon: Target,
      title: 'Guitar Tuner',
      description: 'Accurate chromatic tuner with visual feedback',
      href: '/tuner',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: Music,
      title: 'Chord Library',
      description: 'Comprehensive chord charts and fingerings',
      href: '/chords',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Zap,
      title: 'Scale Finder',
      description: 'Interactive scale patterns and modes',
      href: '/scales',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Clock,
      title: 'Metronome',
      description: 'Practice with adjustable tempo and beats',
      href: '/metronome',
      color: 'from-red-500 to-rose-600'
    },
    {
      icon: Compass,
      title: 'Circle of Fifths',
      description: 'Interactive key relationships visualizer',
      href: '/circle-of-fifths',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Guitar,
      title: 'Fretboard',
      description: 'Note mapping and interval visualization',
      href: '/fretboard',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      icon: Settings,
      title: 'Chord Progressions',
      description: 'Generate and analyze progressions',
      href: '/progressions',
      color: 'from-yellow-500 to-amber-600'
    },
    {
      icon: BookOpen,
      title: 'Theory Guide',
      description: 'Music theory reference and lessons',
      href: '/theory',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Ear,
      title: 'Ear Training',
      description: 'Develop interval and chord recognition',
      href: '/ear-training',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Practice Sessions',
      description: 'Structured practice routines and timers',
      href: '/practice-sessions',
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="relative">
            <Guitar className="w-12 h-12 text-amber-500" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Guitar Tool Station
          </h1>
        </div>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Master your guitar journey with professional-grade tools for tuning, theory, practice, and musical exploration.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href}>
              <Card className="group cursor-pointer border-slate-700 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-slate-100 group-hover:text-amber-400 transition-colors">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 group-hover:text-slate-300 transition-colors">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-slate-700 bg-slate-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-amber-400 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Precision Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">
              Professional-grade tuner and metronome with high accuracy for serious practice sessions.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Learn Theory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">
              Interactive music theory tools help you understand scales, chords, and progressions visually.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Practice Smart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">
              Comprehensive practice tools designed to accelerate your learning and improve technique.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}