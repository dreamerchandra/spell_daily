import { useState, useEffect, useCallback, useMemo } from 'react';
import { arrayShuffle } from '../util/array-shuffle';

export interface SpeechConfig {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
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
  const isSupported = 'speechSynthesis' in window;

  // Initialize voices
  useEffect(() => {
    if (!isSupported) return;

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

  const findBestVoice = useCallback(
    (targetLang: string = 'en'): SpeechSynthesisVoice | null => {
      if (!voices.length) return null;

      const preferredVoiceNames = arrayShuffle([
        'Google',
        'Microsoft',
        'Alex',
        'Samantha',
        'Daniel',
      ]);

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
    [voices]
  );

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [isSupported]);

  const speak = useCallback(
    (text: string, overrideConfig: SpeechConfig = {}) => {
      if (!isSupported) {
        console.warn('Speech synthesis not supported');
        return;
      }

      // Stop any existing speech
      stop();

      const finalConfig = { ...config, ...overrideConfig };
      const utterance = new SpeechSynthesisUtterance(text);

      // Apply configuration
      utterance.rate = finalConfig.rate!;
      utterance.pitch = finalConfig.pitch!;
      utterance.volume = finalConfig.volume!;

      // Set the best available voice
      const bestVoice = findBestVoice(finalConfig.lang);
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
      window.speechSynthesis.speak(utterance);
    },
    [config, findBestVoice, isSupported, stop]
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
