import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export interface SpeechRecognitionConfig {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface UseSpeechRecognitionReturn {
  transcript: string;
  interimTranscript: string;
  finalTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  error: string | null;
}

// Define proper types for Web Speech API
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  grammars: unknown;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: Event) => void) | null;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: ISpeechRecognitionConstructor;
    webkitSpeechRecognition?: ISpeechRecognitionConstructor;
  }
}

const defaultConfig: SpeechRecognitionConfig = {
  lang: 'en-US',
  continuous: true,
  interimResults: true,
  maxAlternatives: 1,
};

export const useSpeechRecognition = (
  initialConfig: SpeechRecognitionConfig = {}
): UseSpeechRecognitionReturn => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const config = useMemo(
    () => ({ ...defaultConfig, ...initialConfig }),
    [initialConfig]
  );

  // Check if SpeechRecognition is supported
  const isSupported = Boolean(
    typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)
  );

  // Initialize SpeechRecognition
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.lang = config.lang!;
    recognition.continuous = config.continuous!;
    recognition.interimResults = config.interimResults!;
    recognition.maxAlternatives = config.maxAlternatives!;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      console.log('🎤 Speech recognition started');
    };

    recognition.onresult = (event: Event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const speechEvent = event as any;
      let interimTranscript = '';
      let finalTranscript = '';

      for (
        let i = speechEvent.resultIndex;
        i < speechEvent.results.length;
        i++
      ) {
        const transcript = speechEvent.results[i][0].transcript;
        if (speechEvent.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setInterimTranscript(interimTranscript);
      if (finalTranscript) {
        setFinalTranscript(prev => prev + finalTranscript);
        setTranscript(prev => prev + finalTranscript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      console.log('🔇 Speech recognition ended');
    };

    recognition.onerror = (event: Event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorEvent = event as any;
      setIsListening(false);
      setError(errorEvent.error);
      console.error('❌ Speech recognition error:', errorEvent.error);

      // Handle specific errors
      switch (errorEvent.error) {
        case 'no-speech':
          setError('No speech was detected. Please try again.');
          break;
        case 'audio-capture':
          setError('Audio capture failed. Please check your microphone.');
          break;
        case 'not-allowed':
          setError(
            'Microphone permission denied. Please allow microphone access.'
          );
          break;
        case 'network':
          setError('Network error occurred. Please check your connection.');
          break;
        default:
          setError(`Recognition error: ${errorEvent.error}`);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [config, isSupported]);

  const start = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    if (recognitionRef.current && !isListening) {
      setError(null);
      recognitionRef.current.start();
    }
  }, [isSupported, isListening]);

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setFinalTranscript('');
    setError(null);
  }, []);

  return {
    transcript,
    interimTranscript,
    finalTranscript,
    isListening,
    isSupported,
    start,
    stop,
    reset,
    error,
  };
};
