import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function CodeGenerator() {
  const [code, setCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  const generateCode = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Generate a React component',
          user_id: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Code generation failed');
      }

      const data = await response.json();
      setCode(data.code);
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Code Generator
          </h1>

          {user && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                Admin: {user.first_name} (ID: {user.telegram_id})
              </p>
            </div>
          )}

          <button
            onClick={generateCode}
            disabled={isGenerating}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            {isGenerating ? 'Generating...' : 'Generate Code'}
          </button>
        </div>

        {code && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Generated Code
            </h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
