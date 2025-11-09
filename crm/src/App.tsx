import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import TelegramUserInfo from './components/TelegramUserInfo'
import CodeGenerator from './pages/CodeGenerator'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

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
              <Link to="/telegram" className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium">
                Telegram
              </Link>
              <Link to="/generate" className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium">
                Generate
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="pt-20">
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/generate/:parentId" 
            element={
              <AdminRoute>
                <CodeGenerator />
              </AdminRoute>
            } 
          />
          <Route path="/telegram" element={<TelegramUserInfo />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
