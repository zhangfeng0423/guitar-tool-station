'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MobileOptimizedProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

export function MobileOptimized({ 
  children, 
  className, 
  mobileClassName, 
  desktopClassName 
}: MobileOptimizedProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={cn(
      className,
      isMobile ? mobileClassName : desktopClassName
    )}>
      {children}
    </div>
  );
}

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return { 
    isMobile, 
    isTablet, 
    isDesktop: !isMobile && !isTablet,
    orientation
  };
}

// Hook for handling virtual keyboard on mobile
export function useVirtualKeyboard() {
  const [isVirtualKeyboardOpen, setIsVirtualKeyboardOpen] = useState(false);
  const initialViewportHeight = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    initialViewportHeight.current = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialViewportHeight.current - currentHeight;
      
      // If height decreased by more than 150px, assume virtual keyboard is open
      setIsVirtualKeyboardOpen(heightDifference > 150);
    };

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isVirtualKeyboardOpen };
}

// Component for touch-optimized interactions
interface TouchOptimizedProps {
  children: React.ReactNode;
  onTap?: () => void;
  onLongPress?: () => void;
  className?: string;
  disabled?: boolean;
}

export function TouchOptimized({ 
  children, 
  onTap, 
  onLongPress, 
  className,
  disabled = false 
}: TouchOptimizedProps) {
  const [isPressed, setIsPressed] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const touchStartTime = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    
    setIsPressed(true);
    touchStartTime.current = Date.now();
    
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress();
        setIsPressed(false);
      }, 500);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (disabled) return;
    
    setIsPressed(false);
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    const touchDuration = Date.now() - touchStartTime.current;
    if (touchDuration < 500 && onTap) {
      onTap();
    }
  };

  const handleTouchCancel = () => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  return (
    <div
      className={cn(
        'touch-manipulation select-none transition-transform',
        isPressed && 'scale-95',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {children}
    </div>
  );
}

// Hook for preventing zoom on double tap
export function usePreventZoom() {
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventDoubleTabZoom = (e: TouchEvent) => {
      const t2 = e.timeStamp;
      const t1 = e.currentTarget.dataset.lastTouch || t2;
      const dt = t2 - parseInt(t1);
      const fingers = e.touches.length;
      
      e.currentTarget.dataset.lastTouch = t2.toString();
      
      if (!dt || dt > 500 || fingers > 1) return;
      
      e.preventDefault();
      e.target.click();
    };

    document.addEventListener('touchstart', preventDefault, { passive: false });
    document.addEventListener('touchend', preventDoubleTabZoom, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', preventDefault);
      document.removeEventListener('touchend', preventDoubleTabZoom);
    };
  }, []);
}