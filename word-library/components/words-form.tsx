import { FC, useState } from 'react';

interface WordsFormProps {
  loading: boolean;
  error: string;
  onSubmit: (words: string) => void;
}

export const WordsForm: FC<WordsFormProps> = ({ loading, error, onSubmit }) => {
  const [inputWords, setInputWords] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputWords);
  };
  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Enter words (comma-separated):
      </label>
      <textarea
        value={inputWords}
        onChange={e => setInputWords(e.target.value)}
        className="w-full rounded-md border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
        rows={3}
        placeholder="happy, innovative, serendipity"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-4 cursor-pointer rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Process Words'}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
};
