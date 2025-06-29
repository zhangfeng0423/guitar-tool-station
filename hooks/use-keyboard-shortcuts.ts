'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const matchingShortcut = shortcuts.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.shiftKey === event.shiftKey &&
        !!shortcut.altKey === event.altKey &&
        !!shortcut.metaKey === event.metaKey
      );
    });

    if (matchingShortcut) {
      if (matchingShortcut.preventDefault !== false) {
        event.preventDefault();
      }
      matchingShortcut.action();
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);

  return shortcuts;
}

// Common keyboard shortcuts for the app
export const useGlobalKeyboardShortcuts = (callbacks: {
  toggleFullscreen?: () => void;
  toggleTheme?: () => void;
  goHome?: () => void;
  openHelp?: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'F11',
      action: callbacks.toggleFullscreen || (() => {}),
      description: 'Toggle fullscreen mode'
    },
    {
      key: 't',
      ctrlKey: true,
      action: callbacks.toggleTheme || (() => {}),
      description: 'Toggle theme'
    },
    {
      key: 'h',
      ctrlKey: true,
      action: callbacks.goHome || (() => {}),
      description: 'Go to home page'
    },
    {
      key: '?',
      shiftKey: true,
      action: callbacks.openHelp || (() => {}),
      description: 'Show keyboard shortcuts'
    },
    {
      key: 'Escape',
      action: () => {
        // Close any open modals or exit fullscreen
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      },
      description: 'Close modals or exit fullscreen'
    }
  ];

  return useKeyboardShortcuts(shortcuts);
};

// Page-specific shortcuts
export const useTunerShortcuts = (callbacks: {
  toggleListening?: () => void;
  playReference?: () => void;
  nextTuning?: () => void;
  previousTuning?: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: ' ',
      action: callbacks.toggleListening || (() => {}),
      description: 'Start/stop tuner'
    },
    {
      key: 'r',
      action: callbacks.playReference || (() => {}),
      description: 'Play reference note'
    },
    {
      key: 'ArrowRight',
      action: callbacks.nextTuning || (() => {}),
      description: 'Next tuning preset'
    },
    {
      key: 'ArrowLeft',
      action: callbacks.previousTuning || (() => {}),
      description: 'Previous tuning preset'
    }
  ];

  return useKeyboardShortcuts(shortcuts);
};

export const useMetronomeShortcuts = (callbacks: {
  togglePlay?: () => void;
  increaseTempo?: () => void;
  decreaseTempo?: () => void;
  reset?: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: ' ',
      action: callbacks.togglePlay || (() => {}),
      description: 'Start/stop metronome'
    },
    {
      key: 'ArrowUp',
      action: callbacks.increaseTempo || (() => {}),
      description: 'Increase tempo'
    },
    {
      key: 'ArrowDown',
      action: callbacks.decreaseTempo || (() => {}),
      description: 'Decrease tempo'
    },
    {
      key: 'r',
      action: callbacks.reset || (() => {}),
      description: 'Reset metronome'
    }
  ];

  return useKeyboardShortcuts(shortcuts);
};