'use-client';
import { useState, useEffect, useCallback, useMemo } from 'react';

export interface SpeechConfig {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  voice?: string;
}

export interface UseSpeechReturn {
  speak: (text: string, config?: SpeechConfig) => void;
  isPlaying: boolean;
  isSupported: boolean;
  voicesLoaded: boolean;
  stop: () => void;
  voices: SpeechSynthesisVoice[];
}

const defaultConfig: SpeechConfig = {
  rate: 0.8,
  pitch: 1.1,
  volume: 1,
  lang: 'en',
};

const arrayShuffle = <T>(array: T[]): T[] => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export const useSpeech = (
  initialConfig: SpeechConfig = {}
): UseSpeechReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const config = useMemo(
    () => ({ ...defaultConfig, ...initialConfig }),
    [initialConfig]
  );
  const isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Initialize voices
  useEffect(() => {
    if (!isSupported || typeof window === 'undefined') return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    // Load voices immediately if available
    loadVoices();

    // Listen for voiceschanged event (needed for Chrome)
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [isSupported]);

  const bestVoice = useMemo(
    (targetLang: string = 'en'): SpeechSynthesisVoice | null => {
      if (!voices.length) return null;

      const preferredVoiceNames = initialConfig.voice
        ? arrayShuffle([
            initialConfig.voice,
            ...['Google', 'Microsoft', 'Alex', 'Samantha', 'Daniel'],
          ])
        : arrayShuffle(['Google', 'Microsoft', 'Alex', 'Samantha', 'Daniel']);

      // Find voices that match the language
      const matchingVoices = voices.filter(voice =>
        voice.lang.toLowerCase().startsWith(targetLang.toLowerCase())
      );

      // Try to find a preferred voice
      for (const preferredName of preferredVoiceNames) {
        const preferredVoice = matchingVoices.find(voice =>
          voice.name.includes(preferredName)
        );
        if (preferredVoice) return preferredVoice;
      }

      // Fallback to first matching voice or default
      return matchingVoices[0] || voices[0] || null;
    },
    [initialConfig.voice, voices]
  );

  const stop = useCallback(() => {
    if (
      isSupported &&
      typeof window !== 'undefined' &&
      window.speechSynthesis.speaking
    ) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [isSupported]);

  const speak = useCallback(
    (text: string, overrideConfig: SpeechConfig = {}) => {
      if (!isSupported || typeof window === 'undefined') {
        console.warn('Speech synthesis not supported');
        return;
      }
      if (!voicesLoaded || voices.length === 0) {
        console.warn('Voices not loaded yet, skipping speech');
        return;
      }

      // Stop any existing speech
      stop();

      const finalConfig = { ...config, ...overrideConfig };
      const utterance = new SpeechSynthesisUtterance(text.toLocaleLowerCase());

      // Apply configuration
      utterance.rate = finalConfig.rate!;
      utterance.pitch = finalConfig.pitch!;
      utterance.volume = finalConfig.volume!;

      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      // Event listeners
      utterance.onstart = () => {
        setIsPlaying(true);
        console.log('🔊 Speaking:', text);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        console.log('✅ Finished speaking');
      };

      utterance.onerror = event => {
        setIsPlaying(false);
        console.error('❌ Speech error:', event.error);
      };

      // Start speaking
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 150);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, bestVoice, isSupported, stop]
  );

  return {
    speak,
    isPlaying,
    isSupported,
    voicesLoaded,
    stop,
    voices,
  };
};

export const useSimpleSpeech = () => {
  return useSpeech({
    rate: 0.8,
    pitch: 1.1,
    volume: 1,
  });
};

export const useSpellingSpeech = () => {
  return useSpeech({
    rate: 0.7,
    pitch: 1.2,
    volume: 1,
  });
};

export const useSyllabiSpeech = () => {
  return useSpeech({
    rate: 1,
    pitch: 1.2,
    volume: 1,
    voice: 'Google US English',
  });
};
