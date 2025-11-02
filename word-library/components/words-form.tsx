import { FC, useState } from "react"

interface WordsFormProps {
  loading: boolean
  error: string
  onSubmit: (words: string) => void
}

export const WordsForm: FC<WordsFormProps> = ({
  loading,
  error,
  onSubmit,
}) => {
  const [inputWords, setInputWords] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(inputWords)
  }
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Enter words (comma-separated):
      </label>
      <textarea
        value={inputWords}
        onChange={(e) => setInputWords(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={3}
        placeholder="happy, innovative, serendipity"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Process Words'}
      </button>
      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
    </form>
  )
}