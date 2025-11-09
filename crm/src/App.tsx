import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TailwindTest from './components/TailwindTest'

// Example components for routing
function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-center space-x-4 mb-8">
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="h-16 w-16 hover:animate-spin" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="h-16 w-16 hover:animate-spin" alt="React logo" />
          </a>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Vite + React + Tailwind</h1>
        <div className="text-center">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            count is {count}
          </button>
          <p className="mt-4 text-gray-600">
            Edit <code className="bg-gray-100 px-2 py-1 rounded">src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </div>
    </div>
  )
}

function About() {
  // Example React Query usage
  const { data, isLoading, error } = useQuery({
    queryKey: ['example'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { message: 'React Query is working!', timestamp: new Date().toISOString() }
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-teal-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">About Page</h1>
        <div className="text-center">
          {isLoading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          )}
          {error && (
            <p className="text-red-500">Error loading data</p>
          )}
          {data && (
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-gray-800 mb-2">{data.message}</p>
              <p className="text-sm text-gray-500">{data.timestamp}</p>
            </div>
          )}
          <Link 
            to="/" 
            className="inline-block mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition duration-200">
              CRM App
            </Link>
            <div className="space-x-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium">
                About
              </Link>
              <Link to="/test" className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium">
                Test
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/test" element={<TailwindTest />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
