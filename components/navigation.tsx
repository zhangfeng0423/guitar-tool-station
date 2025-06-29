'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Guitar, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { KeyboardShortcutsDialog } from '@/components/keyboard-shortcuts-dialog';
import { FullscreenToggle } from '@/components/fullscreen-toggle';
import { useGlobalKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useTheme } from '@/hooks/use-theme';
import { useFullscreen } from '@/hooks/use-fullscreen';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/tuner', label: 'Tuner' },
  { href: '/chords', label: 'Chords' },
  { href: '/scales', label: 'Scales' },
  { href: '/metronome', label: 'Metronome' },
  { href: '/circle-of-fifths', label: 'Circle of Fifths' },
  { href: '/fretboard', label: 'Fretboard' },
  { href: '/progressions', label: 'Progressions' },
  { href: '/theory', label: 'Theory' },
  { href: '/ear-training', label: 'Ear Training' },
  { href: '/practice-sessions', label: 'Practice' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const { toggleFullscreen } = useFullscreen();

  // Global keyboard shortcuts
  useGlobalKeyboardShortcuts({
    toggleFullscreen,
    toggleTheme,
    goHome: () => router.push('/'),
    openHelp: () => {
      // This will be handled by the KeyboardShortcutsDialog component
    }
  });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors">
            <Guitar className="w-6 h-6" />
            <span className="font-bold text-lg">Guitar Tool Station</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-amber-500/20 text-amber-400"
                    : "text-slate-300 hover:text-amber-400 hover:bg-slate-800"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center gap-2">
            <KeyboardShortcutsDialog />
            <ThemeToggle />
            <FullscreenToggle />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-slate-300 hover:text-amber-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-700 py-4">
            <div className="flex flex-col space-y-2 mb-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-amber-500/20 text-amber-400"
                      : "text-slate-300 hover:text-amber-400 hover:bg-slate-800"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Mobile Controls */}
            <div className="flex items-center gap-2 px-3 pt-2 border-t border-slate-700">
              <KeyboardShortcutsDialog />
              <ThemeToggle />
              <FullscreenToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}