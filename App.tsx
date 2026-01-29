import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoadingOverlay from './components/LoadingOverlay';
import { useGlobal } from './store/GlobalContext';
import { Menu } from 'lucide-react';

// Lazy load pages for better performance
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Todos from './pages/Todos';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state, dispatch } = useGlobal();

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Mobile */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h1 className="text-lg font-bold text-gray-800">DummyAdmin</h1>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Global Error Banner */}
        {state.error && (
          <div className="bg-red-50 text-red-700 px-6 py-3 flex justify-between items-center border-b border-red-200">
            <span><strong>Error:</strong> {state.error}</span>
            <button 
              onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
              className="text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/todos" element={<Todos />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <LoadingOverlay />
    </div>
  );
};

export default App;
