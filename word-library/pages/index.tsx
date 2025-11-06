'use client';

import { useState, useRef, useEffect } from 'react';
import { WordData } from '../types';
import ReactMarkdown from 'react-markdown';
import { WordsForm } from '@/components/words-form';
import { useSpeech } from '@/components/use-speech';

export default function WordProcessorPage() {
  const [loading, setLoading] = useState(false);
  const [wordDataList, setWordDataList] = useState<WordData[]>([]);
  const [originalWordDataList, setOriginalWordDataList] = useState<WordData[]>(
    []
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [editedJson, setEditedJson] = useState('');
  const codeRef = useRef<HTMLDivElement>(null);
  const isEditingRef = useRef(false);
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
        setEditedJson(JSON.stringify(data.data[0] || {}, null, 2));
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
      saveCurrentEdit();
      const newIndex = activeWordIndex - 1;
      setActiveWordIndex(newIndex);
      setEditedJson(JSON.stringify(wordDataList[newIndex], null, 2));
    }
  };

  const handleNext = () => {
    if (activeWordIndex < wordDataList.length - 1) {
      saveCurrentEdit();
      const newIndex = activeWordIndex + 1;
      setActiveWordIndex(newIndex);
      setEditedJson(JSON.stringify(wordDataList[newIndex], null, 2));
    }
  };

  const handleReset = () => {
    const originalData = originalWordDataList[activeWordIndex];
    const updated = [...originalWordDataList];
    updated[activeWordIndex] = JSON.parse(JSON.stringify(originalData));
    setWordDataList(updated);
    setEditedJson(JSON.stringify(originalData, null, 2));
  };

  const saveCurrentEdit = () => {
    try {
      const parsed = JSON.parse(editedJson);
      const updated = [...wordDataList];
      updated[activeWordIndex] = parsed;
      setWordDataList(updated);
      return updated;
    } catch (err) {
      // Keep original if JSON is invalid
    }
  };

  const handleSave = async () => {
    const updatedList = saveCurrentEdit();

    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/save-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: updatedList }),
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
    const updated = saveCurrentEdit() || [];
    const currentWord = updated[activeWordIndex];
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

  useEffect(() => {
    if (codeRef.current && !isEditingRef.current) {
      codeRef.current.innerText = editedJson;
    }
  }, [editedJson]);

  const handleInput = () => {
    isEditingRef.current = true;
  };

  const handleBlur = () => {
    isEditingRef.current = false;
    if (codeRef.current) {
      setEditedJson(codeRef.current.innerText);
    }
  };

  const getMarkdownContent = () => `\`\`\`json
${editedJson}
\`\`\``;

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
              <ReactMarkdown
                components={{
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <div
                        ref={codeRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleInput}
                        onBlur={handleBlur}
                        className="rounded-md bg-[#282a36] p-4 font-mono whitespace-pre text-white focus:ring-2 focus:ring-blue-500"
                      >
                        {children}
                      </div>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {getMarkdownContent()}
              </ReactMarkdown>
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
