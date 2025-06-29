'use client';

import { Button } from '@/components/ui/button';
import { Maximize, Minimize } from 'lucide-react';
import { useFullscreen } from '@/hooks/use-fullscreen';

interface FullscreenToggleProps {
  targetElement?: React.RefObject<HTMLElement>;
  className?: string;
}

export function FullscreenToggle({ targetElement, className }: FullscreenToggleProps) {
  const { isFullscreen, toggleFullscreen, isSupported } = useFullscreen();

  if (!isSupported) {
    return null;
  }

  const handleToggle = () => {
    toggleFullscreen(targetElement?.current || undefined);
  };

  return (
    <Button
      onClick={handleToggle}
      variant="outline"
      size="sm"
      className={`border-slate-600 text-slate-300 hover:bg-slate-700 ${className}`}
    >
      {isFullscreen ? (
        <>
          <Minimize className="w-4 h-4 mr-2" />
          Exit Fullscreen
        </>
      ) : (
        <>
          <Maximize className="w-4 h-4 mr-2" />
          Fullscreen
        </>
      )}
    </Button>
  );
}