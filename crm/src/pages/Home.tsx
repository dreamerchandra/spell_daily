import { useState } from 'react'
import { useTelegram } from '../hooks/useTelegram'

export default function Home() {
  const [count, setCount] = useState(0)
  const { user, hapticFeedback } = useTelegram()

  const handleIncrement = () => {
    setCount(prev => prev + 1)
    hapticFeedback('light')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            CRM App
          </h1>
          
          {user && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-semibold text-blue-800">
                {user.first_name} {user.last_name || ''}
              </p>
              <p className="text-xs text-gray-500">ID: {user.id}</p>
            </div>
          )}

          <button 
            onClick={handleIncrement}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            Count: {count}
          </button>
        </div>
      </div>
    </div>
  )
}