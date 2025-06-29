'use client';

import { useState, useRef, useCallback } from 'react';

interface UseMicrophoneOptions {
  onError?: (error: Error) => void;
  constraints?: MediaStreamConstraints['audio'];
}

export function useMicrophone(options: UseMicrophoneOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const startListening = useCallback(async (audioContext: AudioContext) => {
    try {
      setError(null);
      
      const defaultConstraints = {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
        sampleRate: 44100
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { ...defaultConstraints, ...options.constraints }
      });

      streamRef.current = stream;
      sourceRef.current = audioContext.createMediaStreamSource(stream);
      setIsListening(true);

      return sourceRef.current;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to access microphone');
      setError(error);
      options.onError?.(error);
      throw error;
    }
  }, [options]);

  const stopListening = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    setIsListening(false);
    setError(null);
  }, []);

  return {
    isListening,
    error,
    startListening,
    stopListening,
    source: sourceRef.current
  };
}