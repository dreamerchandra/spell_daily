'use client';

import { useState } from 'react';
import { WordData } from '../types';
import { WordsForm } from '@/components/words-form';
import { useSpeech } from '@/components/use-speech';
import { JsonEditor } from '@/components/json-editor';

export default function WordProcessorPage() {
  const [loading, setLoading] = useState(false);
  const [wordDataList, setWordDataList] = useState<WordData[]>([]);
  const [originalWordDataList, setOriginalWordDataList] = useState<WordData[]>(
    []
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [loadingField, setLoadingField] = useState<string | null>(null);
  const { speak } = useSpeech();

  const handleSubmit = async (words: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/process-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words }),
      });

      if (!response.ok) throw new Error('Failed to process words');

      const data = await response.json();

      if (data?.data && Array.isArray(data.data)) {
        setWordDataList(data.data || []);
        setOriginalWordDataList(data.data || []);
        setActiveWordIndex(0);
        setShowConfirmation(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (activeWordIndex > 0) {
      setActiveWordIndex(activeWordIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeWordIndex < wordDataList.length - 1) {
      setActiveWordIndex(activeWordIndex + 1);
    }
  };

  const handleReset = () => {
    const originalData = originalWordDataList[activeWordIndex];
    const updated = [...wordDataList];
    updated[activeWordIndex] = JSON.parse(JSON.stringify(originalData));
    setWordDataList(updated);
  };

  const handleUpdateWord = (newData: WordData) => {
    const updated = [...wordDataList];
    updated[activeWordIndex] = newData;
    setWordDataList(updated);
  };

  const handleRegenerate = async (field: keyof WordData) => {
    const currentWord = wordDataList[activeWordIndex];
    if (!currentWord) return;

    setLoadingField(field);
    try {
      const response = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: currentWord.word,
          field,
        }),
      });

      if (!response.ok) throw new Error('Failed to regenerate field');

      const data = await response.json();

      const updated = [...wordDataList];
      updated[activeWordIndex] = {
        ...updated[activeWordIndex],
        [field]: data.data
      };
      setWordDataList(updated);

    } catch (err) {
      console.error(err);
      alert('Failed to regenerate field');
    } finally {
      setLoadingField(null);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/save-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: wordDataList }),
      });

      if (!response.ok) throw new Error('Failed to save words');

      alert('Words saved successfully!');
      setWordDataList([]);
      setShowConfirmation(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const onSpeak = (text: 'syllable' | 'word') => {
    const currentWord = wordDataList[activeWordIndex];
    if (text === 'word') {
      speak(currentWord?.word || '');
      return;
    }

    if (text === 'syllable') {
      (currentWord?.syllable || []).map((syllable: string) => {
        speak(syllable);
      });
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900">
      <div className="mx-auto max-w-full">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Words Extractor
        </h1>

        {!showConfirmation ? (
          <WordsForm onSubmit={handleSubmit} loading={loading} error={error} />
        ) : (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 flex justify-between rounded-lg border border-gray-300 p-2 text-xl font-semibold">
              <button
                onClick={handlePrevious}
                disabled={activeWordIndex === 0}
                className="cursor-pointer rounded-md bg-gray-100 px-3 py-1 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                &lt;
              </button>
              <span>
                {wordDataList[activeWordIndex]?.word || ''} (
                {activeWordIndex + 1}/{wordDataList.length})
              </span>
              <button
                onClick={handleNext}
                disabled={activeWordIndex === wordDataList.length - 1}
                className="cursor-pointer rounded-md bg-gray-100 px-3 py-1 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                &gt;
              </button>
            </h2>

            <div className="space-y-6">
              <div className="mb-2 flex justify-end">
                <button
                  onClick={() => onSpeak('syllable')}
                  className="mr-4 cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Speak Syllable
                </button>
                <button
                  onClick={() => onSpeak('word')}
                  className="mr-4 cursor-pointer rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                >
                  Speak word
                </button>
                <button
                  onClick={handleReset}
                  className="cursor-pointer rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                >
                  Reset to Original
                </button>
              </div>

              {wordDataList[activeWordIndex] && (
                <JsonEditor
                  data={wordDataList[activeWordIndex]}
                  onUpdate={handleUpdateWord}
                  onRegenerate={handleRegenerate}
                  loadingField={loadingField}
                />
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : 'Save to Database'}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
