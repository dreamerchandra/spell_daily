import React, { useCallback } from 'react';
import { WordData } from '../types';
import { JsonInput } from './json-input';
import { JsonTextArea } from './json-textarea';

interface JsonEditorProps {
  data: WordData;
  onUpdate: (newData: WordData) => void;
  onRegenerate: (field: keyof WordData) => void;
  loadingField: string | null;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({
  data,
  onUpdate,
  onRegenerate,
  loadingField,
}) => {
  const handleChange = (field: keyof WordData, value: unknown) => {
    onUpdate({ ...data, [field]: value });
  };

  const renderRow = useCallback((
    key: keyof WordData,
    content: React.ReactNode,
  ) => (
    <div className="group flex items-start hover:bg-white/5 -ml-2 pl-2 rounded">
      <div className="flex-1 flex items-start">
        <span className="mr-2 text-purple-400 select-none">"{key}"</span>
        <span className="mr-2 text-white">:</span>
        <div className="flex-1">{content}</div>
      </div>
      <button
        onClick={() => onRegenerate(key)}
        disabled={!!loadingField}
        className={`
          ml-4 px-2 py-0.5 text-s rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer
          ${loadingField === key
            ? 'bg-yellow-500/20 text-yellow-300 opacity-100'
            : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'}
        `}
      >
        {loadingField === key ? 'Regenerating...' : 'Regenerate'}
      </button>
    </div>
  ), [onRegenerate, loadingField]);

  return (
    <div className="font-mono text-sm bg-[#282a36] p-6 rounded-lg shadow-xl overflow-hidden text-gray-300">
      <div className="text-white mb-1">{'{'}</div>
      <div className="pl-6 space-y-1">
        {renderRow(
          'word',
          <JsonInput
            value={data.word}
            onChange={(val) => handleChange('word', val)}
            isString
          />
        )}

        {renderRow(
          'ipa',
          <JsonTextArea
            value={data.ipa}
            onChange={(val) => handleChange('ipa', val)}
          />
        )}

        {renderRow(
          'syllable',
          <JsonTextArea
            value={data.syllable}
            onChange={(val) => handleChange('syllable', val)}
          />
        )}

        {renderRow(
          'actualSyllable',
          <JsonTextArea
            value={data.actualSyllable}
            onChange={(val) => handleChange('actualSyllable', val)}
          />
        )}

        {renderRow(
          'definition',
          <JsonInput
            value={data.definition}
            onChange={(val) => handleChange('definition', val)}
            isString
          />
        )}

        {renderRow(
          'syllableOptions',
          <JsonTextArea
            value={data.syllableOptions}
            onChange={(val) => handleChange('syllableOptions', val)}
          />
        )}

        {renderRow(
          'option',
          <JsonTextArea
            value={data.option}
            onChange={(val) => handleChange('option', val)}
          />
        )}

        {renderRow(
          'usage',
          <JsonTextArea
            value={data.usage}
            onChange={(val) => handleChange('usage', val)}
          />
        )}

        {renderRow(
          'synonyms',
          <JsonTextArea
            value={data.synonyms}
            onChange={(val) => handleChange('synonyms', val)}
          />
        )}

        {renderRow(
          'antonyms',
          <JsonTextArea
            value={data.antonyms}
            onChange={(val) => handleChange('antonyms', val)}
          />
        )}

        {renderRow(
          'topic_tag',
          <JsonInput
            value={data.topic_tag}
            onChange={(val) => handleChange('topic_tag', val)}
            isString
          />
        )}

        {renderRow(
          'word_family',
          <JsonTextArea
            value={data.word_family}
            onChange={(val) => handleChange('word_family', val)}
          />
        )}
      </div>
      <div className="text-white mt-1">{'}'}</div>
    </div>
  );
};
