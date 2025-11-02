'use client';

import { useState, useRef, useEffect } from 'react';
import { WordData } from '../types';
import ReactMarkdown from 'react-markdown';
import { WordsForm } from '@/components/words-form';

export default function WordProcessorPage() {
  const [loading, setLoading] = useState(false);
  const [wordDataList, setWordDataList] = useState<WordData[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [editedJson, setEditedJson] = useState('');
  const codeRef = useRef<HTMLDivElement>(null);
  const isEditingRef = useRef(false);

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
    const originalData = wordDataList[activeWordIndex];
    const updated = [...wordDataList];
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 text-gray-900">
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Words Extractor</h1>

        {!showConfirmation ? (
          <WordsForm onSubmit={handleSubmit} loading={loading} error={error} />
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex justify-between border border-gray-300 p-2 rounded-lg">
              <button
                onClick={handlePrevious}
                disabled={activeWordIndex === 0}
                className="px-3 py-1 cursor-pointer bg-gray-100 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>
              <span>
                {wordDataList[activeWordIndex]?.word || ''} ({activeWordIndex + 1}/{wordDataList.length})
              </span>
              <button
                onClick={handleNext}
                disabled={activeWordIndex === wordDataList.length - 1}
                className="px-3 py-1 cursor-pointer bg-gray-100 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </h2>

            <div className="space-y-6">
              <div className="flex justify-end mb-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
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
                        className="focus:ring-2 focus:ring-blue-500 bg-[#282a36] rounded-md p-4 text-white font-mono whitespace-pre"
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

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : 'Save to Database'}
              </button>
            </div>
            {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}