import { Routes, Route } from 'react-router-dom';
import TelegramUserInfo from './components/TelegramUserInfo';
import CodeGenerator from './pages/CodeGenerator';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/home/index';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CodeGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate/:parentId"
          element={
            <AdminRoute>
              <Home />
            </AdminRoute>
          }
        />
        <Route path="/telegram" element={<TelegramUserInfo />} />
      </Routes>
    </div>
  );
}

export default App;
