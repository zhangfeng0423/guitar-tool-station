'use client';

import { useRef, useCallback, useEffect } from 'react';

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
        
        // Resume context if it's suspended (required by some browsers)
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
      } catch (error) {
        console.error('Failed to create AudioContext:', error);
        throw new Error('Audio not supported in this browser');
      }
    }
    
    return audioContextRef.current;
  }, []);

  const closeAudioContext = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      closeAudioContext();
    };
  }, [closeAudioContext]);

  return {
    getAudioContext,
    closeAudioContext,
    audioContext: audioContextRef.current
  };
}