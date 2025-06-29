'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Keyboard, HelpCircle } from 'lucide-react';

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{
    keys: string[];
    description: string;
  }>;
}

const globalShortcuts: ShortcutGroup[] = [
  {
    title: 'Global',
    shortcuts: [
      { keys: ['F11'], description: 'Toggle fullscreen' },
      { keys: ['Ctrl', 'T'], description: 'Toggle theme' },
      { keys: ['Ctrl', 'H'], description: 'Go to home' },
      { keys: ['Shift', '?'], description: 'Show this help' },
      { keys: ['Esc'], description: 'Close modals/exit fullscreen' }
    ]
  },
  {
    title: 'Tuner',
    shortcuts: [
      { keys: ['Space'], description: 'Start/stop tuner' },
      { keys: ['R'], description: 'Play reference note' },
      { keys: ['→'], description: 'Next tuning preset' },
      { keys: ['←'], description: 'Previous tuning preset' }
    ]
  },
  {
    title: 'Metronome',
    shortcuts: [
      { keys: ['Space'], description: 'Start/stop metronome' },
      { keys: ['↑'], description: 'Increase tempo' },
      { keys: ['↓'], description: 'Decrease tempo' },
      { keys: ['R'], description: 'Reset metronome' }
    ]
  },
  {
    title: 'Chord Library',
    shortcuts: [
      { keys: ['P'], description: 'Play chord' },
      { keys: ['→'], description: 'Next chord' },
      { keys: ['←'], description: 'Previous chord' },
      { keys: ['/'], description: 'Focus search' }
    ]
  },
  {
    title: 'Scales',
    shortcuts: [
      { keys: ['P'], description: 'Play scale' },
      { keys: ['→'], description: 'Next scale' },
      { keys: ['←'], description: 'Previous scale' },
      { keys: ['F'], description: 'Toggle fretboard view' }
    ]
  }
];

interface KeyboardShortcutsDialogProps {
  trigger?: React.ReactNode;
}

export function KeyboardShortcutsDialog({ trigger }: KeyboardShortcutsDialogProps) {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
      <Keyboard className="w-4 h-4 mr-2" />
      Shortcuts
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-100 flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {globalShortcuts.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-200">{group.title}</h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-700/50">
                    <span className="text-slate-300">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <Badge
                          key={keyIndex}
                          variant="outline"
                          className="border-slate-500 text-slate-200 bg-slate-600/50 font-mono text-xs"
                        >
                          {key}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-slate-200 mb-1">Tips:</p>
              <ul className="space-y-1 text-slate-400">
                <li>• Shortcuts work when the page is focused</li>
                <li>• Some shortcuts are context-specific to the current tool</li>
                <li>• Press Esc to close dialogs or exit fullscreen mode</li>
                <li>• Use F11 for distraction-free practice sessions</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}