import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Feed from './pages/Feed';
import Groups from './pages/Groups';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ChatbotPage from './pages/ChatbotPage';

// Layout wrapper for authenticated pages
const AppLayout = ({ children }) => {
  return (
    <div className="h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex flex-col h-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/feed" element={
              <ProtectedRoute>
                <AppLayout>
                  <Feed />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/groups" element={
              <ProtectedRoute>
                <AppLayout>
                  <Groups />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/challenges" element={
              <ProtectedRoute>
                <AppLayout>
                  <Challenges />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/assistant" element={
              <ProtectedRoute>
                <AppLayout>
                  <ChatbotPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            } />

            {/* Redirect any unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
