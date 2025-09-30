import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components - Authentication
import Login from './pages/Login';
import Register from './pages/Register';

// Page Components - Main Application
import Dashboard from './pages/Dashboard';
import Feed from './pages/Feed';
import Groups from './pages/Groups';
import Challenges from './pages/Challenges';
import ChatbotPage from './pages/ChatbotPage';
import StockNews from './pages/StockNews';
import CryptoNews from './pages/CryptoNews';

// Page Components - User Management
import Profile from './pages/Profile';
import Settings from './pages/Settings';

/**
 * AppLayout - Main layout wrapper for authenticated pages
 * @param {React.ReactNode} children - Page components to render within the layout
 * @returns {JSX.Element} Layout with sidebar, navbar, and main content area
 */
const AppLayout = ({ children }) => {
  return (
    <div className="h-screen bg-gray-50">
      {/* Fixed Sidebar - 256px wide */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="ml-64 flex flex-col h-full">
        {/* Top Navigation */}
        <Navbar />
        
        {/* Page Content */}
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
            
            <Route path="/stock-news" element={
              <ProtectedRoute>
                <AppLayout>
                  <StockNews />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/crypto-news" element={
              <ProtectedRoute>
                <AppLayout>
                  <CryptoNews />
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
